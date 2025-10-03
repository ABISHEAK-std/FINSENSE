import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { login, hasICPAccount, setICPAccountStatus } from '../../ic/auth';

const ICPAccountSetup = ({ 
  isVisible, 
  onClose, 
  onAccountCreated,
  culturalContext = 'default',
  className = '' 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Creating, 3: Success

  const handleCreateAccount = async () => {
    setIsCreating(true);
    setStep(2);
    
    try {
      // Start ICP login process
      const result = await login();
      
      if (result && result.success) {
        console.log('ICP account created successfully:', result);
        setStep(3);
        setICPAccountStatus(true);
        setIsCreating(false);
        
        // Notify parent component after a short delay
        setTimeout(() => {
          if (onAccountCreated) {
            onAccountCreated();
          }
          // As a fallback, force a reload so the app re-initializes and shows onboarding
          try {
            if (typeof window !== 'undefined' && window.location && window.location.reload) {
              window.location.reload();
            }
          } catch {}
        }, 1500);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Failed to create ICP account:', error);
      setIsCreating(false);
      setStep(1);
      
      // Show error message to user
      alert(culturalContext === 'hindi' 
        ? 'ICP खाता बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
        : 'Failed to create ICP account. Please try again.'
      );
    }
  };

  const getStepTitle = () => {
    if (culturalContext === 'hindi') {
      const titles = {
        1: 'ICP खाता बनाएं',
        2: 'खाता बन रहा है...',
        3: 'खाता सफलतापूर्वक बन गया!'
      };
      return titles[step];
    }
    
    const titles = {
      1: 'Create ICP Account',
      2: 'Creating Account...',
      3: 'Account Created Successfully!'
    };
    return titles[step];
  };

  const getStepDescription = () => {
    if (culturalContext === 'hindi') {
      const descriptions = {
        1: 'अपना वित्तीय डेटा सुरक्षित रखने के लिए ICP खाता बनाएं',
        2: 'कृपया प्रतीक्षा करें, आपका खाता बनाया जा रहा है...',
        3: 'आपका ICP खाता तैयार है! अब आप अपना वित्तीय डेटा सुरक्षित रूप से सहेज सकते हैं।'
      };
      return descriptions[step];
    }
    
    const descriptions = {
      1: 'Create an ICP account to securely store your financial data',
      2: 'Please wait while your account is being created...',
      3: 'Your ICP account is ready! You can now securely save your financial data.'
    };
    return descriptions[step];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-background rounded-2xl shadow-2xl max-w-md w-full ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {getStepTitle()}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {getStepDescription()}
              </p>
            </div>
            {step === 1 && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted/50 rounded-lg transition-ui"
              >
                <Icon name="X" size={20} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Shield" size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {culturalContext === 'hindi' ? 'सुरक्षित भंडारण' : 'Secure Storage'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {culturalContext === 'hindi' 
                        ? 'आपका वित्तीय डेटा ICP ब्लॉकचेन पर सुरक्षित रूप से संग्रहीत होता है'
                        : 'Your financial data is securely stored on the ICP blockchain'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Globe" size={16} className="text-success" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {culturalContext === 'hindi' ? 'वैश्विक पहुंच' : 'Global Access'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {culturalContext === 'hindi' 
                        ? 'कहीं से भी अपने डेटा तक पहुंचें'
                        : 'Access your data from anywhere in the world'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Lock" size={16} className="text-warning" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {culturalContext === 'hindi' ? 'गोपनीयता' : 'Privacy'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {culturalContext === 'hindi' 
                        ? 'आपका डेटा केवल आपके पास है'
                        : 'Your data remains private and under your control'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">
                      {culturalContext === 'hindi' ? 'महत्वपूर्ण' : 'Important'}
                    </p>
                    <p className="text-xs text-warning/80 mt-1">
                      {culturalContext === 'hindi' 
                        ? 'ICP खाता बनाने के लिए आपको Internet Identity का उपयोग करना होगा। यह प्रक्रिया कुछ मिनट ले सकती है।'
                        : 'Creating an ICP account requires Internet Identity. This process may take a few minutes.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              <div>
                <h3 className="font-medium text-foreground mb-2">
                  {culturalContext === 'hindi' ? 'खाता बनाया जा रहा है' : 'Creating Your Account'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {culturalContext === 'hindi' 
                    ? 'कृपया Internet Identity विंडो में लॉगिन करें'
                    : 'Please complete the login in the Internet Identity window'
                  }
                </p>
                
                {/* Instructions */}
                <div className="text-left space-y-2 p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {culturalContext === 'hindi' ? 'चरण:' : 'Steps:'}
                  </p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>
                      {culturalContext === 'hindi' 
                        ? 'Internet Identity विंडो में जाएं'
                        : 'Go to the Internet Identity window'
                      }
                    </li>
                    <li>
                      {culturalContext === 'hindi' 
                        ? 'अपना डिवाइस पासवर्ड या बायोमेट्रिक का उपयोग करें'
                        : 'Use your device password or biometric'
                      }
                    </li>
                    <li>
                      {culturalContext === 'hindi' 
                        ? 'लॉगिन पूरा करने के बाद यहां वापस आएं'
                        : 'Return here after completing login'
                      }
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">
                  {culturalContext === 'hindi' ? 'सफलता!' : 'Success!'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {culturalContext === 'hindi' 
                    ? 'आपका ICP खाता तैयार है। अब आप अपना वित्तीय डेटा सुरक्षित रूप से सहेज सकते हैं।'
                    : 'Your ICP account is ready. You can now securely save your financial data.'
                  }
                </p>
                
                {/* Next Steps */}
                <div className="text-left space-y-2 p-4 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-xs font-medium text-success">
                    {culturalContext === 'hindi' ? 'अगला कदम:' : 'Next Step:'}
                  </p>
                  <p className="text-xs text-success/80">
                    {culturalContext === 'hindi' 
                      ? 'अब आपसे आपकी वित्तीय जानकारी मांगी जाएगी ताकि हम आपके लिए व्यक्तिगत सुझाव दे सकें।'
                      : 'You will now be asked for your financial information so we can provide personalized recommendations.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          {step === 1 && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {culturalContext === 'hindi' ? 'बाद में' : 'Later'}
              </Button>
              <Button
                onClick={handleCreateAccount}
                className="flex-1"
                iconName="UserPlus"
                iconPosition="left"
              >
                {culturalContext === 'hindi' ? 'खाता बनाएं' : 'Create Account'}
              </Button>
            </div>
          )}

          {step === 3 && (
            <Button
              onClick={onClose}
              className="w-full"
              iconName="Check"
              iconPosition="left"
            >
              {culturalContext === 'hindi' ? 'जारी रखें' : 'Continue'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ICPAccountSetup;
