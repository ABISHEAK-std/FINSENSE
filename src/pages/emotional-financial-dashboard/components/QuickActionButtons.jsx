import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionButtons = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  onVoiceToggle,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleVoiceToggle = () => {
    const newState = !isVoiceActive;
    setIsVoiceActive(newState);
    onVoiceToggle?.(newState);
  };

  const getActionButtons = () => {
    return [
      {
        id: 'expense-tracking',
        title: culturalContext === 'hindi' ? 'खर्च ट्रैक करें' : 'Track Expenses',
        description: culturalContext === 'hindi' ? 'भावनात्मक विश्लेषण के साथ' : 'With emotional analysis',
        icon: 'Receipt',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        route: '/expense-tracking-emotional-analysis',
        priority: 'high'
      },
      {
        id: 'ai-therapy',
        title: culturalContext === 'hindi' ? 'AI थेरेपी चैट' : 'AI Financial Therapy Chat',
        description: culturalContext === 'hindi' ? 'वित्तीय सलाह और मानसिक सहायता' : 'Financial counseling & support',
        icon: 'MessageCircleHeart',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        route: '/ai-financial-therapy-chat',
        priority: emotionalState === 'stressed' || emotionalState === 'anxious' ? 'high' : 'medium'
      },
      {
        id: 'goal-setting',
        title: culturalContext === 'hindi' ? 'लक्ष्य निर्धारण' : ' Cultural financial preferences',
        description: culturalContext === 'hindi' ? 'वित्तीय लक्ष्य बनाएं' : 'Create cultural financial targets',
        icon: 'Target',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        route: '/cultural-financial-planning',
        priority: 'medium'
      },
      {
        id: 'investment',
        title: culturalContext === 'hindi' ? 'निवेश पोर्टफोलियो' : 'Investment Portfolio',
        description: culturalContext === 'hindi' ? 'भावनात्मक मार्केट टाइमिंग' : 'Emotional market timing',
        icon: 'TrendingUp',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        route: '/investment-portfolio-emotional-market-timing',
        priority: 'medium'
      },
      {
        id: 'voice-assistant',
        title: culturalContext === 'hindi' ? 'वॉइस असिस्टेंट' : 'Voice Assistant',
        description: culturalContext === 'hindi' ? 'हाथों से मुक्त इंटरैक्शन' : 'Hands-free interaction',
        icon: isVoiceActive ? 'MicIcon' : 'Mic',
        color: isVoiceActive ? 'text-success' : 'text-indigo-500',
        bgColor: isVoiceActive ? 'bg-success/10' : 'bg-indigo-500/10',
        borderColor: isVoiceActive ? 'border-success/20' : 'border-indigo-500/20',
        action: handleVoiceToggle,
        priority: 'low',
        isActive: isVoiceActive
      },
      {
        id: 'profile',
        title: culturalContext === 'hindi' ? 'प्रोफाइल सेटिंग्स' : 'Profile Settings',
        description: culturalContext === 'hindi' ? 'सांस्कृतिक प्राथमिकताएं' : 'Cultural preferences',
        icon: 'Settings',
        color: 'text-gray-500',
        bgColor: 'bg-gray-500/10',
        borderColor: 'border-gray-500/20',
        route: '/profile-cultural-preferences',
        priority: 'low'
      }
    ];
  };

  const handleActionClick = (action) => {
    if (action?.route) {
      navigate(action?.route);
    } else if (action?.action) {
      action?.action();
    }
  };

  const sortedActions = getActionButtons()?.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder?.[a?.priority] - priorityOrder?.[b?.priority];
  });

  const getEmotionalMessage = () => {
    const messages = {
      'calm': {
        hindi: 'आप शांत हैं। अपनी वित्तीय योजना को आगे बढ़ाने का अच्छा समय है।',
        english: 'You\'re calm. Great time to advance your financial planning.'
      },
      'positive': {
        hindi: 'आप खुश हैं! नए वित्तीय लक्ष्य बनाने का बेहतरीन समय है।',
        english: 'You\'re feeling positive! Perfect time to set new financial goals.'
      },
      'stressed': {
        hindi: 'तनाव महसूस कर रहे हैं? AI थेरेपी चैट आपकी मदद कर सकती है।',
        english: 'Feeling stressed? AI therapy chat can help you feel better.'
      },
      'anxious': {
        hindi: 'चिंता हो रही है? पहले अपनी भावनाओं को संभालें, फिर वित्तीय निर्णय लें।',
        english: 'Feeling anxious? Let\'s address your emotions first, then make financial decisions.'
      }
    };
    
    const message = messages?.[emotionalState] || messages?.['calm'];
    return culturalContext === 'hindi' ? message?.hindi : message?.english;
  };

  return (
    <div className={`glass-card rounded-2xl p-6 transition-emotional ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading text-foreground">
            {culturalContext === 'hindi' ? 'त्वरित कार्य' : 'Quick Actions'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {getEmotionalMessage()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            emotionalState === 'positive' ? 'bg-success' :
            emotionalState === 'stressed' ? 'bg-warning' :
            emotionalState === 'anxious' ? 'bg-error' : 'bg-primary'
          }`} />
          <span className="text-xs text-muted-foreground capitalize">
            {emotionalState}
          </span>
        </div>
      </div>
      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedActions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => handleActionClick(action)}
            className={`
              relative p-4 rounded-xl border transition-ui text-left group
              ${action?.bgColor} ${action?.borderColor}
              hover:scale-105 hover:shadow-soft
              ${action?.priority === 'high' ? 'ring-2 ring-primary/20' : ''}
              ${action?.isActive ? 'ring-2 ring-success/30' : ''}
            `}
          >
            {/* Priority Indicator */}
            {action?.priority === 'high' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            )}
            
            {/* Active Indicator */}
            {action?.isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full">
                <div className="w-full h-full bg-success rounded-full animate-ping" />
              </div>
            )}

            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg ${action?.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon 
                name={action?.icon} 
                size={20} 
                className={`${action?.color} ${action?.isActive ? 'animate-pulse' : ''}`} 
              />
            </div>

            {/* Content */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-ui">
                {action?.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {action?.description}
              </p>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-ui">
              <Icon name="ArrowRight" size={14} className="text-primary" />
            </div>
          </button>
        ))}
      </div>
      {/* Emergency Actions */}
      <div className="mt-6 pt-4 border-t border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/ai-financial-therapy-chat')}
              iconName="LifeBuoy"
              iconPosition="left"
              className="text-warning hover:text-warning-foreground hover:bg-warning"
            >
              {culturalContext === 'hindi' ? 'तुरंत मदद' : 'Crisis Help'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('tel:+911800111999')}
              iconName="Phone"
              iconPosition="left"
              className="text-error hover:text-error-foreground hover:bg-error"
            >
              {culturalContext === 'hindi' ? 'हेल्पलाइन' : 'Helpline'}
            </Button>
          </div>

          {/* Voice Status */}
          {isVoiceActive && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-success/10 text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs font-medium">
                {culturalContext === 'hindi' ? 'वॉइस सक्रिय' : 'Voice Active'}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Motivational Footer */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center space-x-2">
          <Icon name="Sparkles" size={16} className="text-primary" />
          <p className="text-xs text-primary/80">
            {culturalContext === 'hindi' ?'आपकी वित्तीय यात्रा में हम आपके साथ हैं। एक कदम आगे बढ़ाएं!' :'We\'re with you on your financial journey. Take the next step!'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickActionButtons;