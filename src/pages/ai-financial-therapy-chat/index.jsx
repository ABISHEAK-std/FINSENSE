import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { chatService } from "../../services/ChatService";
import { financialDataService } from "../../services/FinancialDataService";

const AIFinancialTherapyChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    savings: 100000,
    debt: 0,
    riskTolerance: 'moderate',
    country: 'India',
    language: 'default',
    lifeStage: 'adult',
    goals: []
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([{
      id: 1,
      type: 'bot',
      content: "Hello! I'm Zypher, your AI Financial Therapist. I'm here to support your emotional and financial wellbeing. How are you feeling today? Is there any financial concern you'd like to talk about?",
      timestamp: new Date(),
      emotion: 'calm'
    }]);

    // Load user profile and chat history
    loadUserData();

    // Listen for profile updates from dashboard
    const handleProfileUpdate = () => {
      console.log('Profile update detected, reloading user data');
      loadUserData();
    };

    // Listen for financial data updates
    const handleFinancialUpdate = () => {
      console.log('Financial data update detected, reloading user data');
      loadUserData();
    };

    // Force refresh data on page load
    setTimeout(() => {
      console.log('Force refreshing user data on page load');
      loadUserData();
    }, 1000);

    document.addEventListener('profile-updated', handleProfileUpdate);
    document.addEventListener('transaction-updated', handleFinancialUpdate);

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      document.removeEventListener('profile-updated', handleProfileUpdate);
      document.removeEventListener('transaction-updated', handleFinancialUpdate);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUserData = async () => {
    try {
      // Initialize financial data service first
      financialDataService.initializeData();
      
      // Check if onboarding has been completed
      const hasOnboardingData = financialDataService.hasOnboardingData();
      console.log('Has onboarding data:', hasOnboardingData);
      
      if (hasOnboardingData) {
        // Load user profile from ChatService
        const userData = await chatService.getUserData();
        console.log('User data from ChatService:', userData);
        
        if (userData && userData.length > 0) {
          const profile = userData[0];
          const name = profile.name?.[0] || 'User';
          const savings = Number(profile.savings?.[0] || profile.savings) || 0;
          const debt = Number(profile.debt?.[0] || profile.debt) || 0;
          const riskTolerance = profile.riskTolerance?.[0] || 'moderate';
          const country = profile.country?.[0] || 'India';
          const language = profile.language?.[0] || 'default';
          const lifeStage = profile.lifeStage?.[0] || 'adult';
          const goals = profile.goals || [];

          setUserProfile({
            name,
            savings,
            debt,
            riskTolerance,
            country,
            language,
            lifeStage,
            goals
          });

          // Get current financial data for context
          const financialData = financialDataService.getFinancialData();
          const netWorth = financialDataService.getNetWorth();
          console.log('Financial data loaded for therapy chat:', {
            financialData,
            netWorth,
            totalAssets: financialData.totalAssets,
            totalLiabilities: financialData.totalLiabilities
          });
        } else {
          // No user profile found, show onboarding prompt
          setShowOnboardingPrompt(true);
        }
      } else {
        // No onboarding data - show prompt to complete onboarding
        setShowOnboardingPrompt(true);
      }

      // Load chat history
      try {
        const chatHistory = await chatService.getChatHistory();
        if (chatHistory && chatHistory.length > 0) {
          const formattedMessages = chatHistory.map((msg, index) => ({
            id: index + 2, // Start after welcome message
            type: msg.messageType === 'user' ? 'user' : 'bot',
            content: msg.content,
            timestamp: new Date(Number(msg.timestamp) / 1000000), // Convert from nanoseconds
            emotion: msg.emotion?.[0] || 'neutral'
          }));
          setMessages(prev => [...prev, ...formattedMessages]);
        }
      } catch (chatError) {
        console.error('Failed to load chat history:', chatError);
        // Continue without chat history
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleRedirectToOnboarding = () => {
    // Redirect to dashboard where onboarding modal will appear
    window.location.href = '/emotional-financial-dashboard';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get current financial data for context
      const financialData = financialDataService.getFinancialData();
      const netWorth = financialDataService.getNetWorth();
      
      console.log('Current financial data for chat context:', {
        totalAssets: financialData.totalAssets,
        totalLiabilities: financialData.totalLiabilities,
        netWorth: netWorth,
        userProfile: userProfile
      });
      
      // Create enhanced user profile with current financial data
      const enhancedProfile = {
        ...userProfile,
        currentAssets: financialData.totalAssets,
        currentLiabilities: financialData.totalLiabilities,
        netWorth: netWorth,
        recentTransactions: financialData.incomeEntries.slice(0, 5).concat(financialData.expenseEntries.slice(0, 5))
      };

      // Pass recent conversation history (last 6 messages) for context
      const recentHistory = messages.slice(-6).map(m => ({
        role: m.type === 'user' ? 'user' : 'bot',
        content: m.content,
        emotion: m.emotion || undefined,
        timestamp: m.timestamp
      }));
      const response = await chatService.processChat(messageToProcess, enhancedProfile, recentHistory);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.advice,
        timestamp: new Date(),
        emotion: response.emotion,
        suggestions: response.suggestions,
        resources: response.resources
      };

      setMessages(prev => [...prev, botMessage]);

      // Speak the response if enabled
      if (isSpeaking) {
        speakText(response.advice);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I'm having trouble processing your message right now. Please try again.",
        timestamp: new Date(),
        emotion: 'neutral'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: 'text-green-600',
      sad: 'text-blue-600',
      anxious: 'text-yellow-600',
      angry: 'text-red-600',
      excited: 'text-purple-600',
      calm: 'text-teal-600',
      neutral: 'text-gray-600',
      worried: 'text-orange-600',
      confident: 'text-blue-700',
      frustrated: 'text-red-500',
      hopeful: 'text-green-500',
      overwhelmed: 'text-purple-500'
    };
    return colors[emotion] || colors.neutral;
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      excited: '🤩',
      calm: '😌',
      neutral: '😐',
      worried: '😟',
      confident: '😎',
      frustrated: '😤',
      hopeful: '🙂',
      overwhelmed: '😵'
    };
    return emojis[emotion] || emojis.neutral;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {showOnboardingPrompt && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Hey User, Complete Your Profile</h2>
              <p className="text-sm text-gray-600 mb-6">
                To provide personalized financial therapy, We need to know about your financial situation. 
                Please complete the onboarding process first.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowOnboardingPrompt(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Maybe Later
                </button>
                <button 
                  onClick={handleRedirectToOnboarding}
                  className="flex-1 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Debug Info - Remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 m-4 rounded">
          <div className="text-sm">
            <strong>Debug Info:</strong>
            <br />
            User Profile: {JSON.stringify(userProfile, null, 2)}
            <br />
            Financial Data: {JSON.stringify(financialDataService.getFinancialData(), null, 2)}
            <br />
            Net Worth: {financialDataService.getNetWorth()}
            <br />
            Has Onboarding: {financialDataService.hasOnboardingData() ? 'Yes' : 'No'}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Z</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Dr. Zypher</h1>
              <p className="text-sm text-gray-600">AI Financial Advisor • Emotional Financial Wellness Expert</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-teal-600 font-medium">Calm • Safe Space</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-teal-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
              }`}
            >
              {message.type === 'bot' && message.emotion && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">Detected mood:</span>
                  <span className={`text-sm font-semibold ${getEmotionColor(message.emotion)}`}>
                    {getEmotionEmoji(message.emotion)} {message.emotion}
                  </span>
                </div>
              )}
              
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {message.suggestions && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Quick Actions:</p>
                  <div className="space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="block w-full text-left text-xs bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                        onClick={() => setInputMessage(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-400 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm border border-gray-100 px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500">Analyzing your message...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows="1"
              style={{ minHeight: '50px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-full transition-colors ${
              isListening
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button
            onClick={() => setIsSpeaking(!isSpeaking)}
            className={`p-3 rounded-full transition-colors ${
              isSpeaking
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isSpeaking ? 'Disable speech' : 'Enable speech'}
          >
            {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send • Shift+Enter for new line</span>
          {isListening && <span className="text-red-500 animate-pulse">🎤 Listening...</span>}
        </div>
      </div>
    </div>
  );
};

export default AIFinancialTherapyChat;