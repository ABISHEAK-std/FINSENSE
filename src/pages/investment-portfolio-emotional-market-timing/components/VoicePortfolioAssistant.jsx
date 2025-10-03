import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoicePortfolioAssistant = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  onQueryResult,
  className = '' 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);
  
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = culturalContext === 'hindi' ? 'hi-IN' : 'en-IN';
      
      recognition.onstart = () => {
        setIsListening(true);
        startAudioVisualization();
      };
      
      recognition.onresult = (event) => {
        const current = event?.resultIndex;
        const transcriptResult = event?.results?.[current]?.[0]?.transcript;
        setTranscript(transcriptResult);
        
        if (event?.results?.[current]?.isFinal) {
          processVoiceQuery(transcriptResult);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
        stopAudioVisualization();
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event?.error);
        setIsListening(false);
        stopAudioVisualization();
      };
      
      recognitionRef.current = recognition;
    }

    // Load query history from localStorage
    const savedHistory = localStorage.getItem('voiceQueryHistory');
    if (savedHistory) {
      setQueryHistory(JSON.parse(savedHistory));
    }

    return () => {
      if (audioContextRef?.current) {
        audioContextRef?.current?.close();
      }
    };
  }, [culturalContext]);

  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef?.current?.createAnalyser();
      microphoneRef.current = audioContextRef?.current?.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      microphoneRef?.current?.connect(analyserRef?.current);
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef?.current && isListening) {
          analyserRef?.current?.getByteFrequencyData(dataArray);
          const average = dataArray?.reduce((a, b) => a + b) / dataArray?.length;
          setAudioLevel(average / 255);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopAudioVisualization = () => {
    if (microphoneRef?.current) {
      microphoneRef?.current?.disconnect();
    }
    if (audioContextRef?.current) {
      audioContextRef?.current?.close();
    }
    setAudioLevel(0);
  };

  const processVoiceQuery = async (query) => {
    setIsProcessing(true);
    setTranscript('');
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const processedResponse = generateResponse(query);
    setResponse(processedResponse?.text);
    
    // Add to history
    const newQuery = {
      id: Date.now(),
      query: query,
      response: processedResponse?.text,
      timestamp: new Date(),
      data: processedResponse?.data
    };
    
    const updatedHistory = [newQuery, ...queryHistory?.slice(0, 9)]; // Keep last 10 queries
    setQueryHistory(updatedHistory);
    localStorage.setItem('voiceQueryHistory', JSON.stringify(updatedHistory));
    
    // Notify parent component
    onQueryResult?.(newQuery);
    
    setIsProcessing(false);
    
    // Text-to-speech response
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(processedResponse.text);
      utterance.lang = culturalContext === 'hindi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const generateResponse = (query) => {
    const lowerQuery = query?.toLowerCase();
    
    // Portfolio value queries
    if (lowerQuery?.includes('portfolio') || lowerQuery?.includes('total') || lowerQuery?.includes('value') || 
        lowerQuery?.includes('पोर्टफोलियो') || lowerQuery?.includes('कुल') || lowerQuery?.includes('मूल्य')) {
      return {
        text: culturalContext === 'hindi' ?'आपका कुल पोर्टफोलियो मूल्य ₹12,50,000 है। आज ₹15,750 का लाभ हुआ है, जो 1.28% की वृद्धि है।' :'Your total portfolio value is ₹12,50,000. Today you gained ₹15,750, which is a 1.28% increase.',
        data: { type: 'portfolio_value', value: 1250000, change: 15750, changePercent: 1.28 }
      };
    }
    
    // Holdings queries
    if (lowerQuery?.includes('holdings') || lowerQuery?.includes('stocks') || lowerQuery?.includes('shares') ||
        lowerQuery?.includes('होल्डिंग') || lowerQuery?.includes('शेयर') || lowerQuery?.includes('स्टॉक')) {
      return {
        text: culturalContext === 'hindi' ?'आपके पास 6 होल्डिंग्स हैं: HDFC Bank, Gold ETF, Reliance, SBI Mutual Fund, Real Estate Fund, और Infosys। सबसे अच्छा प्रदर्शन Gold ETF का है।' :'You have 6 holdings: HDFC Bank, Gold ETF, Reliance, SBI Mutual Fund, Real Estate Fund, and Infosys. Gold ETF is performing best.',
        data: { type: 'holdings', count: 6, bestPerformer: 'Gold ETF' }
      };
    }
    
    // Performance queries
    if (lowerQuery?.includes('performance') || lowerQuery?.includes('gain') || lowerQuery?.includes('loss') ||
        lowerQuery?.includes('प्रदर्शन') || lowerQuery?.includes('लाभ') || lowerQuery?.includes('हानि')) {
      return {
        text: culturalContext === 'hindi' ?'आपका कुल लाभ ₹1,85,000 है, जो 17.4% रिटर्न है। आपका भावनात्मक विश्वास स्कोर 75% है।' :'Your total gain is ₹1,85,000, which is a 17.4% return. Your emotional confidence score is 75%.',
        data: { type: 'performance', totalGain: 185000, returnPercent: 17.4, emotionalScore: 75 }
      };
    }
    
    // Market timing queries
    if (lowerQuery?.includes('buy') || lowerQuery?.includes('sell') || lowerQuery?.includes('invest') ||
        lowerQuery?.includes('खरीदें') || lowerQuery?.includes('बेचें') || lowerQuery?.includes('निवेश')) {
      const advice = emotionalState === 'stressed' 
        ? (culturalContext === 'hindi' ?'आप तनावग्रस्त हैं। अभी निवेश न करें। पहले मन को शांत करें।' :'You seem stressed. Avoid investing right now. Take time to calm your mind first.')
        : emotionalState === 'positive'
        ? (culturalContext === 'hindi' ?'आपकी मानसिक स्थिति अच्छी है। यह निवेश के लिए अच्छा समय हो सकता है।' :'Your mental state is positive. This could be a good time to invest.')
        : (culturalContext === 'hindi' ?'आप शांत हैं। संतुलित निर्णय लें और अपनी रिस्क टॉलरेंस के अनुसार निवेश करें।' :'You are calm. Make balanced decisions and invest according to your risk tolerance.');
      
      return {
        text: advice,
        data: { type: 'market_timing', emotionalState, recommendation: emotionalState === 'stressed' ? 'avoid' : 'consider' }
      };
    }
    
    // Default response
    return {
      text: culturalContext === 'hindi' ?'मुझे खुशी होगी आपकी मदद करने में। आप पोर्टफोलियो, होल्डिंग्स, प्रदर्शन, या निवेश सलाह के बारे में पूछ सकते हैं।' :'I\'d be happy to help you. You can ask about portfolio, holdings, performance, or investment advice.',
      data: { type: 'general', supportedQueries: ['portfolio', 'holdings', 'performance', 'advice'] }
    };
  };

  const startListening = () => {
    if (!isSupported) {
      alert(culturalContext === 'hindi' ?'आपका ब्राउज़र वॉयस रिकग्निशन को सपोर्ट नहीं करता' :'Your browser doesn\'t support voice recognition');
      return;
    }
    
    if (recognitionRef?.current && !isListening) {
      recognitionRef?.current?.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef?.current && isListening) {
      recognitionRef?.current?.stop();
    }
  };

  const clearHistory = () => {
    setQueryHistory([]);
    localStorage.removeItem('voiceQueryHistory');
  };

  return (
    <div className={`glass-card rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Icon name="Mic" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'वॉयस असिस्टेंट' : 'Voice Assistant'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' ? 'पोर्टफोलियो के बारे में पूछें' : 'Ask about your portfolio'}
            </p>
          </div>
        </div>
        
        {queryHistory?.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            iconName="Trash2"
            iconSize={16}
            className="text-muted-foreground hover:text-foreground"
          />
        )}
      </div>
      {/* Voice Control */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <Button
            variant={isListening ? 'default' : 'outline'}
            size="lg"
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported || isProcessing}
            className={`w-20 h-20 rounded-full ${isListening ? 'voice-active' : ''}`}
          >
            <Icon 
              name={isProcessing ? 'Loader2' : isListening ? 'MicIcon' : 'Mic'} 
              size={32}
              className={isProcessing ? 'animate-spin' : ''}
            />
          </Button>
          
          {/* Audio Level Indicator */}
          {isListening && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {[...Array(5)]?.map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full transition-all duration-100"
                  style={{
                    height: `${4 + (audioLevel * 16)}px`,
                    opacity: audioLevel > (i * 0.2) ? 1 : 0.3,
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-foreground">
            {isProcessing 
              ? (culturalContext === 'hindi' ? 'प्रोसेसिंग...' : 'Processing...')
              : isListening 
              ? (culturalContext === 'hindi' ? 'सुन रहा हूं...' : 'Listening...')
              : (culturalContext === 'hindi' ? 'बोलने के लिए टैप करें' : 'Tap to speak')
            }
          </p>
          
          {transcript && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              "{transcript}"
            </p>
          )}
        </div>
      </div>
      {/* Current Response */}
      {response && (
        <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start space-x-3">
            <Icon name="MessageCircle" size={16} className="text-primary mt-1" />
            <p className="text-sm text-primary/80 flex-1">{response}</p>
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">
          {culturalContext === 'hindi' ? 'त्वरित प्रश्न:' : 'Quick Questions:'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            {
              text: culturalContext === 'hindi' ? 'मेरा पोर्टफोलियो कैसा है?' : 'How is my portfolio?',
              query: culturalContext === 'hindi' ? 'मेरा पोर्टफोलियो कैसा है' : 'How is my portfolio'
            },
            {
              text: culturalContext === 'hindi' ? 'कौन सा स्टॉक बेस्ट है?' : 'Which stock is best?',
              query: culturalContext === 'hindi' ? 'कौन सा स्टॉक बेस्ट है' : 'Which stock is performing best'
            },
            {
              text: culturalContext === 'hindi' ? 'क्या निवेश करूं?' : 'Should I invest?',
              query: culturalContext === 'hindi' ? 'क्या मुझे निवेश करना चाहिए' : 'Should I invest now'
            },
            {
              text: culturalContext === 'hindi' ? 'आज का प्रदर्शन?' : 'Today\'s performance?',
              query: culturalContext === 'hindi' ? 'आज का प्रदर्शन कैसा है' : 'How is today performance'
            }
          ]?.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => processVoiceQuery(item?.query)}
              className="text-left justify-start h-auto py-2 px-3 text-xs"
              disabled={isListening || isProcessing}
            >
              {item?.text}
            </Button>
          ))}
        </div>
      </div>
      {/* Query History */}
      {queryHistory?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">
            {culturalContext === 'hindi' ? 'हाल के प्रश्न:' : 'Recent Queries:'}
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {queryHistory?.slice(0, 3)?.map((item) => (
              <div key={item?.id} className="p-3 rounded-lg bg-muted/30 text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="MessageSquare" size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">
                    {item?.timestamp?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-foreground font-medium mb-1">"{item?.query}"</p>
                <p className="text-muted-foreground text-xs">{item?.response}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Support Info */}
      {!isSupported && (
        <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <p className="text-sm text-warning">
              {culturalContext === 'hindi' ?'आपका ब्राउज़र वॉयस रिकग्निशन को सपोर्ट नहीं करता। कृपया Chrome या Firefox का उपयोग करें।' :'Your browser doesn\'t support voice recognition. Please use Chrome or Firefox.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoicePortfolioAssistant;