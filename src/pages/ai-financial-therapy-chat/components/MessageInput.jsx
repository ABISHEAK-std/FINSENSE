import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageInput = ({ 
  onSendMessage,
  onVoiceToggle,
  isVoiceActive = false,
  emotionalState = 'calm',
  culturalContext = 'default',
  isTyping = false,
  className = '' 
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const textareaRef = useRef(null);
  const recordingTimerRef = useRef(null);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef?.current?.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef?.current) {
        clearInterval(recordingTimerRef?.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (recordingTimerRef?.current) {
        clearInterval(recordingTimerRef?.current);
      }
    };
  }, [isRecording]);

  const handleSendMessage = () => {
    if (message?.trim()) {
      onSendMessage?.(message?.trim(), 'text');
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceRecord = async () => {
    if (!isRecording) {
      try {
        setIsRecording(true);
        setRecordingDuration(0);
        // Simulate: console.log('Starting voice recording...');
      } catch (error) {
        console.error('Error starting voice recording:', error);
        setIsRecording(false);
      }
    } else {
      setIsRecording(false);
      const voiceMessage = culturalContext === 'hindi' ? 'आवाज़ संदेश भेजा गया' : 'Voice message sent';
      onSendMessage?.(voiceMessage, 'voice');
    }
  };

  const getPlaceholderText = () => {
    if (culturalContext === 'hindi') {
      switch (emotionalState) {
        case 'stressed':
          return 'अपनी चिंताओं के बारे में बताएं...';
        case 'anxious':
          return 'आप कैसा महसूस कर रहे हैं?';
        case 'positive':
          return 'आज कुछ अच्छा हुआ है?';
        default:
          return 'अपने मन की बात कहें...';
      }
    }

    switch (emotionalState) {
      case 'stressed':
        return "Share what's worrying you...";
      case 'anxious':
        return 'How are you feeling right now?';
      case 'positive':
        return "What's going well today?";
      default:
        return 'Type your message...';
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionalStyling = () => {
    const styles = {
      stressed: 'border-warning/50 focus-within:border-warning',
      anxious: 'border-error/50 focus-within:border-error',
      positive: 'border-success/50 focus-within:border-success',
      calm: 'border-border focus-within:border-primary'
    };
    return styles?.[emotionalState] || styles?.calm;
  };

  return (
    <div className={`bg-white/90 backdrop-blur-md border-t border-border/20 ${className}`}>
      <div className="p-4">
        {/* Voice Recording Indicator */}
        {isRecording && (
          <div className="mb-3 p-3 rounded-lg bg-error/10 border border-error/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
                <span className="text-sm font-medium text-error">
                  {culturalContext === 'hindi' ? 'रिकॉर्डिंग...' : 'Recording...'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatRecordingTime(recordingDuration)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRecording(false)}
                iconName="X"
                iconSize={16}
                className="text-error"
              />
            </div>
            
            {/* Audio Level Visualization */}
            <div className="flex items-center space-x-1 mt-2">
              {[...Array(20)]?.map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-error rounded-full transition-all duration-100"
                  style={{
                    height: `${8 + Math.sin((Date.now() / 200) + i) * 6}px`,
                    opacity: Math.random() > 0.3 ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Message Input Container */}
        <div
          className={`
            relative border rounded-2xl transition-all duration-200
            ${getEmotionalStyling()}
            ${isTyping ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <div className="flex items-end space-x-2 p-3">
            {/* Text Input */}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e?.target?.value)}
                onKeyDown={handleKeyPress}
                placeholder={getPlaceholderText()}
                disabled={isTyping || isRecording}
                className="w-full resize-none border-none outline-none bg-transparent text-foreground placeholder-muted-foreground text-sm leading-relaxed min-h-[20px] max-h-32"
                rows={1}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {/* Voice Recording Button */}
              <Button
                variant={isRecording ? 'destructive' : 'ghost'}
                size="sm"
                onClick={handleVoiceRecord}
                iconName={isRecording ? 'Square' : 'Mic'}
                iconSize={16}
                className={`
                  transition-ui
                  ${isVoiceActive ? 'text-primary' : 'text-muted-foreground'}
                  ${isRecording ? 'animate-pulse' : ''}
                `}
                disabled={isTyping}
              />

              {/* Send Button */}
              <Button
                variant={message?.trim() ? 'default' : 'ghost'}
                size="sm"
                onClick={handleSendMessage}
                iconName="Send"
                iconSize={16}
                disabled={!message?.trim() || isTyping || isRecording}
                className="transition-ui"
              />
            </div>
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-muted-foreground">
                  {culturalContext === 'hindi' ? 'AI जवाब तैयार कर रहा है...' : 'AI is thinking...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Hints */}
        <div className="flex items-center justify-between mt-2 px-2">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>
              {culturalContext === 'hindi' ? 'Enter भेजने के लिए' : 'Press Enter to send'}
            </span>
            <span>
              {culturalContext === 'hindi' ? 'Shift+Enter नई लाइन के लिए' : 'Shift+Enter for new line'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={12} className="text-success" />
            <span className="text-xs text-success">
              {culturalContext === 'hindi' ? 'सुरक्षित' : 'Secure'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
