import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TherapyHeader = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  isTherapyMode = true,
  onCrisisHelp,
  onVoiceToggle,
  isVoiceActive = false,
  sessionDuration = 0,
  className = '' 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionTimer, setSessionTimer] = useState(sessionDuration);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isTherapyMode) {
        setSessionTimer(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isTherapyMode]);

  const getEmotionalStateColor = () => {
    switch (emotionalState) {
      case 'stressed':
        return 'text-warning';
      case 'positive':
        return 'text-success';
      case 'anxious':
        return 'text-error';
      case 'calm':
      default:
        return 'text-primary';
    }
  };

  const getEmotionalStateIcon = () => {
    switch (emotionalState) {
      case 'stressed':
        return 'AlertTriangle';
      case 'positive':
        return 'Smile';
      case 'anxious':
        return 'Frown';
      case 'calm':
      default:
        return 'Heart';
    }
  };

  const getCulturalGreeting = () => {
    const hour = currentTime?.getHours();
    if (culturalContext === 'hindi') {
      if (hour < 12) return 'सुप्रभात';
      if (hour < 17) return 'नमस्ते';
      return 'शुभ संध्या';
    }
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatSessionTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white/90 backdrop-blur-md border-b border-border/20 ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section - Therapy Mode Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center">
                <Icon name="MessageCircleHeart" size={20} color="white" />
              </div>
              {isTherapyMode && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success animate-pulse" />
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-heading text-foreground">
                {culturalContext === 'hindi' ? 'AI वित्तीय चिकित्सक' : 'AI Financial Therapist'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {getCulturalGreeting()} • {culturalContext === 'hindi' ? 'सुरक्षित स्थान' : 'Safe Space'}
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Session Info */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Emotional State Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-muted/50">
            <Icon 
              name={getEmotionalStateIcon()} 
              size={16} 
              className={getEmotionalStateColor()} 
            />
            <span className="text-sm font-medium capitalize text-muted-foreground">
              {emotionalState}
            </span>
          </div>

          {/* Session Timer */}
          {isTherapyMode && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {formatSessionTime(sessionTimer)}
              </span>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Voice Assistant Toggle */}
          <Button
            variant={isVoiceActive ? 'default' : 'outline'}
            size="sm"
            onClick={onVoiceToggle}
            iconName="Mic"
            iconSize={16}
            className={`transition-ui ${isVoiceActive ? 'voice-active' : ''}`}
          >
            <span className="hidden sm:inline ml-2">
              {culturalContext === 'hindi' ? 'आवाज़' : 'Voice'}
            </span>
          </Button>

          {/* Crisis Help Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onCrisisHelp}
            iconName="LifeBuoy"
            iconSize={16}
            className="text-error hover:text-white hover:bg-error transition-ui"
          >
            <span className="hidden sm:inline ml-2">
              {culturalContext === 'hindi' ? 'तुरंत मदद' : 'Crisis Help'}
            </span>
          </Button>

          {/* Menu */}
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreVertical"
            iconSize={16}
            className="transition-ui"
          />
        </div>
      </div>

      {/* Mobile Session Info */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-t border-border/20 bg-muted/20">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getEmotionalStateIcon()} 
              size={14} 
              className={getEmotionalStateColor()} 
            />
            <span className="text-xs font-medium capitalize text-muted-foreground">
              {emotionalState}
            </span>
          </div>
          {isTherapyMode && (
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">
                {formatSessionTime(sessionTimer)}
              </span>
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {culturalContext === 'hindi' ? 'सुरक्षित चैट' : 'Secure Chat'}
        </div>
      </div>
    </div>
  );
};

export default TherapyHeader;
