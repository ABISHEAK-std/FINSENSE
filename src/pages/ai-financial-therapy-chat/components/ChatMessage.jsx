import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AITherapistAvatar from './AITherapistAvatar';

const ChatMessage = ({ 
  message,
  isUser = false,
  timestamp,
  emotionalTone = 'neutral',
  culturalContext = 'default',
  onReaction,
  onShare,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return culturalContext === 'hindi' ? 'अभी' : 'now';
    } else if (diffInMinutes < 60) {
      return culturalContext === 'hindi' 
        ? `${diffInMinutes} मिनट पहले`
        : `${diffInMinutes}m ago`;
    } else {
      return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getEmotionalStyling = () => {
    if (isUser) return '';
    
    const styles = {
      empathetic: 'border-l-4 border-l-success bg-success/5',
      encouraging: 'border-l-4 border-l-primary bg-primary/5',
      concerned: 'border-l-4 border-l-warning bg-warning/5',
      celebratory: 'border-l-4 border-l-amber-500 bg-amber-50',
      calming: 'border-l-4 border-l-blue-500 bg-blue-50'
    };
    
    return styles?.[emotionalTone] || '';
  };

  const getReactionEmojis = () => {
    return [
      { emoji: '💙', label: culturalContext === 'hindi' ? 'सहायक' : 'Helpful' },
      { emoji: '🙏', label: culturalContext === 'hindi' ? 'आभारी' : 'Grateful' },
      { emoji: '💡', label: culturalContext === 'hindi' ? 'अंतर्दृष्टि' : 'Insightful' },
      { emoji: '🌟', label: culturalContext === 'hindi' ? 'प्रेरणादायक' : 'Inspiring' },
      { emoji: '🤗', label: culturalContext === 'hindi' ? 'सहारा' : 'Supportive' }
    ];
  };

  const handleReaction = (reaction) => {
    setSelectedReaction(reaction);
    onReaction?.(message?.id, reaction);
  };

  const reactions = getReactionEmojis();

  return (
    <div className={`
      flex ${isUser ? 'justify-end' : 'justify-start'} mb-6
      transition-all duration-500 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      ${className}
    `}>
      <div className={`
        max-w-[85%] md:max-w-[70%] 
        ${isUser ? 'order-2' : 'order-1'}
      `}>
        {/* AI Therapist Avatar */}
        {!isUser && (
          <AITherapistAvatar
            emotionalTone={emotionalTone}
            culturalContext={culturalContext}
            className="mb-2"
          />
        )}

        {/* Message Content */}
        <div 
          className={`
            relative p-4 rounded-2xl shadow-soft
            ${isUser 
              ? 'bg-primary text-white ml-12' 
              : `bg-white/80 backdrop-blur-sm text-foreground ${getEmotionalStyling()}`
            }
          `}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* Message Text */}
          <div className="prose prose-sm max-w-none">
            {message?.type === 'text' && (
              <p className={`mb-0 leading-relaxed ${isUser ? 'text-white' : 'text-foreground'}`}>
                {message?.content}
              </p>
            )}
            
            {message?.type === 'exercise' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Brain" size={16} className={isUser ? 'text-white' : 'text-primary'} />
                  <span className="text-sm font-medium">
                    {culturalContext === 'hindi' ? 'चिकित्सा अभ्यास' : 'Therapy Exercise'}
                  </span>
                </div>
                <p className={`mb-2 ${isUser ? 'text-white' : 'text-foreground'}`}>
                  {message?.content}
                </p>
                {message?.exerciseData && (
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
                    <h4 className="text-sm font-medium mb-2">{message?.exerciseData?.title}</h4>
                    <p className="text-xs text-muted-foreground">{message?.exerciseData?.description}</p>
                  </div>
                )}
              </div>
            )}

            {message?.type === 'insight' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Lightbulb" size={16} className="text-amber-500" />
                  <span className="text-sm font-medium text-amber-600">
                    {culturalContext === 'hindi' ? 'वित्तीय अंतर्दृष्टि' : 'Financial Insight'}
                  </span>
                </div>
                <p className={`mb-0 ${isUser ? 'text-white' : 'text-foreground'}`}>
                  {message?.content}
                </p>
              </div>
            )}
          </div>

          {/* Message Actions */}
          {showActions && !isUser && (
            <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(message)}
                iconName="Share"
                iconSize={12}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {/* Copy to clipboard */}}
                iconName="Copy"
                iconSize={12}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              />
            </div>
          )}
        </div>

        {/* Timestamp and Reactions */}
        <div className={`
          flex items-center justify-between mt-2 px-2
          ${isUser ? 'flex-row-reverse' : 'flex-row'}
        `}>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(timestamp)}
          </span>

          {/* Reaction Buttons */}
          {!isUser && (
            <div className="flex items-center space-x-1">
              {reactions?.map((reaction, index) => (
                <button
                  key={index}
                  onClick={() => handleReaction(reaction)}
                  className={`
                    text-sm hover:scale-110 transition-transform duration-200
                    ${selectedReaction?.emoji === reaction?.emoji ? 'scale-110' : ''}
                  `}
                  title={reaction?.label}
                >
                  {reaction?.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Reaction Display */}
        {selectedReaction && !isUser && (
          <div className="mt-2 px-2">
            <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
              <span className="text-sm">{selectedReaction?.emoji}</span>
              <span className="text-xs">{selectedReaction?.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;