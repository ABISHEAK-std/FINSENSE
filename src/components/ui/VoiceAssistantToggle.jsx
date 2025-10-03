import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const VoiceAssistantToggle = ({ 
  isActive = false,
  onToggle,
  emotionalState = 'calm',
  culturalContext = 'default',
  className = '' 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = culturalContext === 'hindi' ? 'hi-IN' : 'en-IN';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        startAudioVisualization();
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        stopAudioVisualization();
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event?.error);
        setIsListening(false);
        stopAudioVisualization();
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event?.results)?.map(result => result?.[0]?.transcript)?.join('');
        
        // Handle voice commands here
        handleVoiceCommand(transcript);
      };
      
      setRecognition(recognitionInstance);
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

  const handleVoiceCommand = (transcript) => {
    const command = transcript?.toLowerCase()?.trim();
    
    // Basic navigation commands
    if (command?.includes('dashboard') || command?.includes('डैशबोर्ड')) {
      window.location.href = '/emotional-financial-dashboard';
    } else if (command?.includes('expenses') || command?.includes('खर्च')) {
      window.location.href = '/expense-tracking-emotional-analysis';
    } else if (command?.includes('therapy') || command?.includes('थेरेपी')) {
      window.location.href = '/ai-financial-therapy-chat';
    } else if (command?.includes('culture') || command?.includes('संस्कृति')) {
      window.location.href = '/cultural-financial-planning';
    } else if (command?.includes('investment') || command?.includes('निवेश')) {
      window.location.href = '/investment-portfolio-emotional-market-timing';
    } else if (command?.includes('profile') || command?.includes('प्रोफाइल')) {
      window.location.href = '/profile-cultural-preferences';
    }
    
    // Emotional support commands
    if (command?.includes('help') || command?.includes('मदद')) {
      // Trigger crisis intervention
      document.dispatchEvent(new CustomEvent('triggerCrisisHelp'));
    }
  };

  const handleToggle = () => {
    if (!isSupported) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    const newActiveState = !isActive;
    onToggle?.(newActiveState);

    if (newActiveState && recognition) {
      recognition?.start();
    } else if (recognition) {
      recognition?.stop();
    }
  };

  const getEmotionalColor = () => {
    switch (emotionalState) {
      case 'stressed':
        return 'text-warning';
      case 'positive':
        return 'text-success';
      case 'calm':
      default:
        return 'text-primary';
    }
  };

  const getStatusText = () => {
    if (!isSupported) return 'Not Supported';
    if (isListening) return culturalContext === 'hindi' ? 'सुन रहा है...' : 'Listening...';
    if (isActive) return culturalContext === 'hindi' ? 'सक्रिय' : 'Active';
    return culturalContext === 'hindi' ? 'निष्क्रिय' : 'Inactive';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Voice Toggle Button */}
      <Button
        variant={isActive ? 'default' : 'outline'}
        size="sm"
        onClick={handleToggle}
        disabled={!isSupported}
        className={`
          relative transition-ui
          ${isListening ? 'voice-active' : ''}
          ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="relative flex items-center">
          <Icon 
            name={isListening ? 'MicIcon' : 'Mic'} 
            size={16}
            className={isListening ? getEmotionalColor() : ''}
          />
          
          {/* Audio Level Indicator */}
          {isListening && (
            <div className="ml-2 flex items-center space-x-1">
              {[...Array(3)]?.map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-current rounded-full transition-all duration-100 ${getEmotionalColor()}`}
                  style={{
                    height: `${4 + (audioLevel * 12)}px`,
                    opacity: audioLevel > (i * 0.3) ? 1 : 0.3,
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          )}
          
          <span className="hidden sm:inline ml-2 text-sm">
            {getStatusText()}
          </span>
        </div>
        
        {/* Active Indicator */}
        {isActive && (
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getEmotionalColor()} bg-current animate-pulse`} />
        )}
      </Button>
      {/* Voice Waveform Visualization */}
      {isListening && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-3 glass-card rounded-lg shadow-soft">
          <div className="flex items-center space-x-1">
            <Icon name="Radio" size={14} className={getEmotionalColor()} />
            <div className="flex items-center space-x-1">
              {[...Array(8)]?.map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-current rounded-full transition-all duration-150 ${getEmotionalColor()}`}
                  style={{
                    height: `${6 + Math.sin((Date.now() / 200) + i) * audioLevel * 10}px`,
                    animationDelay: `${i * 50}ms`
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {culturalContext === 'hindi' ? 'बोलें...' : 'Speak now...'}
          </p>
        </div>
      )}
      {/* Voice Commands Help */}
      {isActive && !isListening && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-3 glass-card rounded-lg shadow-soft w-64 z-10">
          <h4 className="text-sm font-medium text-foreground mb-2">
            {culturalContext === 'hindi' ? 'आवाज़ कमांड:' : 'Voice Commands:'}
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>"Dashboard" - {culturalContext === 'hindi' ? 'डैशबोर्ड खोलें' : 'Open Dashboard'}</p>
            <p>"Expenses" - {culturalContext === 'hindi' ? 'खर्च ट्रैकिंग' : 'Track Expenses'}</p>
            <p>"Therapy" - {culturalContext === 'hindi' ? 'AI थेरेपी चैट' : 'AI Therapy Chat'}</p>
            <p>"Help" - {culturalContext === 'hindi' ? 'तुरंत मदद' : 'Emergency Help'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistantToggle;