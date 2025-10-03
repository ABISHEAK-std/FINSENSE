import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const CrisisInterventionOverlay = ({ 
  isVisible = false,
  onClose,
  emotionalState = 'stressed',
  culturalContext = 'default',
  triggerReason = 'manual',
  className = '' 
}) => {
  const [currentStep, setCurrentStep] = useState('assessment');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [breathingCount, setBreathingCount] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Reset state when overlay becomes visible
      setCurrentStep('assessment');
      setSelectedOptions([]);
      setIsConnecting(false);
      setBreathingCount(0);
      setIsBreathingActive(false);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const getCulturalContent = () => {
    if (culturalContext === 'hindi') {
      return {
        title: 'हम यहाँ आपकी मदद के लिए हैं',
        subtitle: 'आपकी वित्तीय चिंताएं समझ में आती हैं। आइए इसे एक साथ हल करते हैं।',
        breathingTitle: 'गहरी सांस लें',
        breathingInstruction: 'मेरे साथ सांस लें। यह आपको शांत करने में मदद करेगा।',
        connectTitle: 'विशेषज्ञ से बात करें',
        connectSubtitle: 'हमारे वित्तीय सलाहकार आपकी मदद के लिए तैयार हैं',
        emergencyTitle: 'तत्काल सहायता',
        emergencySubtitle: 'यदि यह एक आपातकाल है, तो कृपया तुरंत संपर्क करें'
      };
    }
    return {
      title: 'We\'re Here to Help You',
      subtitle: 'Your financial concerns are understandable. Let\'s work through this together.',
      breathingTitle: 'Take a Deep Breath',
      breathingInstruction: 'Breathe with me. This will help calm your mind.',
      connectTitle: 'Talk to an Expert',
      connectSubtitle: 'Our financial counselors are ready to support you',
      emergencyTitle: 'Immediate Support',
      emergencySubtitle: 'If this is an emergency, please reach out immediately'
    };
  };

  const getAssessmentOptions = () => {
    if (culturalContext === 'hindi') {
      return [
        { id: 'debt', label: 'कर्ज की चिंता', icon: 'CreditCard' },
        { id: 'family', label: 'पारिवारिक दबाव', icon: 'Users' },
        { id: 'job', label: 'नौकरी की असुरक्षा', icon: 'Briefcase' },
        { id: 'investment', label: 'निवेश की हानि', icon: 'TrendingDown' },
        { id: 'expenses', label: 'बढ़ते खर्च', icon: 'Receipt' },
        { id: 'future', label: 'भविष्य की चिंता', icon: 'Clock' }
      ];
    }
    return [
      { id: 'debt', label: 'Debt Concerns', icon: 'CreditCard' },
      { id: 'family', label: 'Family Pressure', icon: 'Users' },
      { id: 'job', label: 'Job Insecurity', icon: 'Briefcase' },
      { id: 'investment', label: 'Investment Losses', icon: 'TrendingDown' },
      { id: 'expenses', label: 'Rising Expenses', icon: 'Receipt' },
      { id: 'future', label: 'Future Anxiety', icon: 'Clock' }
    ];
  };

  const content = getCulturalContent();
  const assessmentOptions = getAssessmentOptions();

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prev => 
      prev?.includes(optionId) 
        ? prev?.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const startBreathingExercise = () => {
    setCurrentStep('breathing');
    setIsBreathingActive(true);
    setBreathingCount(0);
    
    // Breathing exercise timer
    const breathingInterval = setInterval(() => {
      setBreathingCount(prev => {
        if (prev >= 10) {
          clearInterval(breathingInterval);
          setIsBreathingActive(false);
          return prev;
        }
        return prev + 1;
      });
    }, 4000); // 4 seconds per breath cycle
  };

  const connectToExpert = () => {
    setCurrentStep('connecting');
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      // In real app, this would open chat or call interface
      alert(culturalContext === 'hindi' ?'विशेषज्ञ से जुड़ाव हो रहा है...' :'Connecting you to an expert...'
      );
    }, 3000);
  };

  const handleEmergencyContact = () => {
    // Open emergency contact options
    window.open('tel:+911800111999', '_blank'); // Example crisis helpline
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Main Content */}
      <div className="relative w-full max-w-md mx-4 glass-card rounded-2xl shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center">
              <Icon name="Heart" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-heading text-foreground">{content?.title}</h2>
              <p className="text-sm text-muted-foreground">{content?.subtitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* Content Area */}
        <div className="p-6">
          {currentStep === 'assessment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-foreground mb-3">
                  {culturalContext === 'hindi' ?'आप किस बारे में चिंतित हैं?' :'What are you concerned about?'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {assessmentOptions?.map((option) => (
                    <button
                      key={option?.id}
                      onClick={() => handleOptionToggle(option?.id)}
                      className={`
                        p-3 rounded-lg border transition-ui text-left
                        ${selectedOptions?.includes(option?.id)
                          ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                        }
                      `}
                    >
                      <Icon name={option?.icon} size={16} className="mb-2" />
                      <p className="text-sm font-medium">{option?.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  variant="default"
                  onClick={startBreathingExercise}
                  iconName="Wind"
                  iconPosition="left"
                  className="w-full"
                >
                  {content?.breathingTitle}
                </Button>
                <Button
                  variant="outline"
                  onClick={connectToExpert}
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="w-full"
                >
                  {content?.connectTitle}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'breathing' && (
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-lg font-heading text-foreground mb-2">
                  {content?.breathingTitle}
                </h3>
                <p className="text-muted-foreground">{content?.breathingInstruction}</p>
              </div>

              {/* Breathing Animation */}
              <div className="flex items-center justify-center">
                <div 
                  className={`
                    w-32 h-32 rounded-full border-4 border-primary/30 flex items-center justify-center
                    transition-all duration-4000 ease-in-out
                    ${isBreathingActive ? 'scale-110 border-primary' : 'scale-100'}
                  `}
                >
                  <div className={`
                    w-20 h-20 rounded-full bg-gradient-to-br from-primary to-success
                    transition-all duration-4000 ease-in-out
                    ${isBreathingActive ? 'scale-110' : 'scale-100'}
                  `}>
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {isBreathingActive 
                          ? (breathingCount % 2 === 0 
                              ? (culturalContext === 'hindi' ? 'सांस लें' : 'Breathe In')
                              : (culturalContext === 'hindi' ? 'छोड़ें' : 'Breathe Out')
                            )
                          : breathingCount
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' 
                  ? `${breathingCount}/10 सांस पूरी`
                  : `${breathingCount}/10 breaths completed`}
              </div>

              {breathingCount >= 10 && (
                <div className="space-y-3">
                  <p className="text-success font-medium">
                    {culturalContext === 'hindi' ?'बहुत अच्छा! आप बेहतर महसूस कर रहे हैं?' :'Great! Are you feeling better?'}
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      variant="default"
                      onClick={() => setCurrentStep('assessment')}
                      className="flex-1"
                    >
                      {culturalContext === 'hindi' ? 'हाँ, धन्यवाद' : 'Yes, Thank You'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={connectToExpert}
                      className="flex-1"
                    >
                      {culturalContext === 'hindi' ? 'और मदद चाहिए' : 'Need More Help'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'connecting' && (
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-lg font-heading text-foreground mb-2">
                  {content?.connectTitle}
                </h3>
                <p className="text-muted-foreground">{content?.connectSubtitle}</p>
              </div>

              {isConnecting ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="text-muted-foreground">
                    {culturalContext === 'hindi' ?'विशेषज्ञ से जुड़ाव हो रहा है...' :'Connecting to expert...'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
                    <p className="text-success font-medium">
                      {culturalContext === 'hindi' ?'विशेषज्ञ उपलब्ध है' :'Expert Available'}
                    </p>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => alert('Starting chat...')}
                    iconName="MessageCircle"
                    iconPosition="left"
                    className="w-full"
                  >
                    {culturalContext === 'hindi' ? 'चैट शुरू करें' : 'Start Chat'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Emergency Footer */}
        <div className="p-4 border-t border-border/20 bg-error/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-error" />
              <span className="text-sm font-medium text-error">
                {content?.emergencyTitle}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmergencyContact}
              iconName="Phone"
              iconPosition="left"
              className="text-error border-error hover:bg-error hover:text-white"
            >
              {culturalContext === 'hindi' ? 'कॉल करें' : 'Call Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisInterventionOverlay;