import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const AITherapistAvatar = ({ 
  emotionalTone = 'empathetic',
  isTyping = false,
  culturalContext = 'default',
  therapistPersonality = 'compassionate',
  className = '' 
}) => {
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Update avatar expression based on emotional tone
    const expressionMap = {
      empathetic: 'caring',
      encouraging: 'positive',
      concerned: 'worried',
      celebratory: 'happy',
      calming: 'peaceful'
    };
    
    setCurrentExpression(expressionMap?.[emotionalTone] || 'neutral');
    setIsAnimating(true);
    
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [emotionalTone]);

  const getAvatarConfig = () => {
    const baseConfig = {
      name: culturalContext === 'hindi' ? 'डॉ. आर्या' : 'Dr. Zypher',
      title: culturalContext === 'hindi' ? 'AI वित्तीय चिकित्सक' : 'AI Financial Advisor',
      specialization: culturalContext === 'hindi' ?'भावनात्मक वित्तीय कल्याण विशेषज्ञ' :'Emotional Financial Wellness Expert'
    };

    // Cultural adaptation
    if (culturalContext === 'hindi') {
      return {
        ...baseConfig,
        greeting: 'नमस्ते',
        supportMessage: 'मैं यहाँ आपकी मदद के लिए हूँ'
      };
    }

    return {
      ...baseConfig,
      greeting: 'Hello',
      supportMessage: 'I\'m here to support you'
    };
  };

  const getExpressionIcon = () => {
    const expressions = {
      neutral: 'User',
      caring: 'Heart',
      positive: 'Smile',
      worried: 'AlertCircle',
      happy: 'Laugh',
      peaceful: 'Sparkles'
    };
    return expressions?.[currentExpression] || 'User';
  };

  const getExpressionColor = () => {
    const colors = {
      neutral: 'text-muted-foreground',
      caring: 'text-success',
      positive: 'text-primary',
      worried: 'text-warning',
      happy: 'text-amber-500',
      peaceful: 'text-blue-500'
    };
    return colors?.[currentExpression] || 'text-muted-foreground';
  };

  const config = getAvatarConfig();

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      {/* Avatar Container */}
      <div className="relative flex-shrink-0">
        <div className={`
          w-12 h-12 rounded-full bg-gradient-to-br from-success/20 to-primary/20 
          flex items-center justify-center border-2 border-success/30
          transition-all duration-500 ease-in-out
          ${isAnimating ? 'scale-110' : 'scale-100'}
          ${isTyping ? 'animate-pulse' : ''}
        `}>
          <Icon 
            name={getExpressionIcon()} 
            size={24} 
            className={`${getExpressionColor()} transition-colors duration-300`}
          />
        </div>
        
        {/* Status Indicator */}
        <div className="absolute -bottom-1 -right-1">
          <div className={`
            w-4 h-4 rounded-full border-2 border-white
            ${isTyping ? 'bg-warning animate-pulse' : 'bg-success'}
          `}>
            {isTyping && (
              <div className="w-full h-full rounded-full bg-warning animate-ping" />
            )}
          </div>
        </div>

        {/* Emotional Aura */}
        <div className={`
          absolute inset-0 rounded-full opacity-20 transition-all duration-1000
          ${emotionalTone === 'calming' ? 'bg-blue-400 animate-pulse' : ''}
          ${emotionalTone === 'encouraging' ? 'bg-green-400 animate-pulse' : ''}
          ${emotionalTone === 'concerned' ? 'bg-orange-400 animate-pulse' : ''}
        `} />
      </div>
      {/* Therapist Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-sm font-medium text-foreground">{config?.name}</h3>
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} className="text-success" />
            <span className="text-xs text-success font-medium">
              {culturalContext === 'hindi' ? 'सत्यापित' : 'Verified'}
            </span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-1">{config?.title}</p>
        <p className="text-xs text-muted-foreground/80">{config?.specialization}</p>
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-muted-foreground">
              {culturalContext === 'hindi' ? 'टाइप कर रहे हैं...' : 'typing...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITherapistAvatar;