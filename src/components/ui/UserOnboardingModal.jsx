import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const UserOnboardingModal = ({ 
  isVisible, 
  onClose, 
  onSave, 
  culturalContext = 'default',
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    riskTolerance: 'moderate',
    savings: '',
    debt: '',
    country: 'India',
    language: culturalContext,
    lifeStage: 'adult',
    goals: []
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = culturalContext === 'hindi' ? 'नाम आवश्यक है' : 'Name is required';
        }
        break;
      case 2:
        if (!formData.riskTolerance) {
          newErrors.riskTolerance = culturalContext === 'hindi' ? 'जोखिम सहनशीलता चुनें' : 'Select risk tolerance';
        }
        if (!formData.savings || formData.savings < 0) {
          newErrors.savings = culturalContext === 'hindi' ? 'वैध बचत दर्ज करें' : 'Enter valid savings amount';
        }
        if (formData.debt === '' || formData.debt < 0) {
          newErrors.debt = culturalContext === 'hindi' ? 'वैध कर्ज दर्ज करें' : 'Enter valid debt amount';
        }
        break;
      case 3:
        if (!formData.country) {
          newErrors.country = culturalContext === 'hindi' ? 'देश चुनें' : 'Select country';
        }
        if (!formData.lifeStage) {
          newErrors.lifeStage = culturalContext === 'hindi' ? 'जीवन स्तर चुनें' : 'Select life stage';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = async () => {
    if (validateStep(currentStep)) {
      setIsLoading(true);
      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        console.error('Failed to save user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStepTitle = () => {
    if (culturalContext === 'hindi') {
      const titles = {
        1: 'व्यक्तिगत जानकारी',
        2: 'वित्तीय प्राथमिकताएं',
        3: 'जीवन स्तर और लक्ष्य',
        4: 'समीक्षा और सहेजें'
      };
      return titles[currentStep];
    }
    
    const titles = {
      1: 'Personal Information',
      2: 'Financial Preferences',
      3: 'Life Stage & Goals',
      4: 'Review & Save'
    };
    return titles[currentStep];
  };

  const getStepDescription = () => {
    if (culturalContext === 'hindi') {
      const descriptions = {
        1: 'अपनी बुनियादी जानकारी दर्ज करें',
        2: 'अपनी वित्तीय प्राथमिकताएं सेट करें',
        3: 'अपने जीवन स्तर और लक्ष्यों को चुनें',
        4: 'अपनी जानकारी की समीक्षा करें'
      };
      return descriptions[currentStep];
    }
    
    const descriptions = {
      1: 'Enter your basic information',
      2: 'Set your financial preferences',
      3: 'Choose your life stage and goals',
      4: 'Review your information'
    };
    return descriptions[currentStep];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'नाम *' : 'Name *'}
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={culturalContext === 'hindi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                error={errors.name}
              />
            </div>
            
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon name="Info" size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    {culturalContext === 'hindi' ? 'आय और खर्च का ट्रैकिंग' : 'Income & Expense Tracking'}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {culturalContext === 'hindi' 
                      ? 'आप अपनी आय और खर्च को अलग पेज पर ट्रैक कर सकते हैं। यहां केवल आपकी बचत और कर्ज की जानकारी दें।'
                      : 'You can track your income and expenses on a separate page. Here, just provide your savings and debt information.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'जोखिम सहनशीलता *' : 'Risk Tolerance *'}
              </label>
              <Select
                value={formData.riskTolerance}
                onChange={(value) => handleInputChange('riskTolerance', value)}
                options={[
                  { value: 'conservative', label: culturalContext === 'hindi' ? 'रूढ़िवादी' : 'Conservative' },
                  { value: 'moderate', label: culturalContext === 'hindi' ? 'मध्यम' : 'Moderate' },
                  { value: 'aggressive', label: culturalContext === 'hindi' ? 'आक्रामक' : 'Aggressive' }
                ]}
                error={errors.riskTolerance}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'बचत (₹) *' : 'Savings (₹) *'}
              </label>
              <Input
                type="number"
                value={formData.savings}
                onChange={(e) => handleInputChange('savings', parseFloat(e.target.value))}
                placeholder={culturalContext === 'hindi' ? '500000' : '500000'}
                error={errors.savings}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'कर्ज (₹) *' : 'Debt (₹) *'}
              </label>
              <Input
                type="number"
                value={formData.debt}
                onChange={(e) => handleInputChange('debt', parseFloat(e.target.value))}
                placeholder={culturalContext === 'hindi' ? '200000' : '200000'}
                error={errors.debt}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'देश *' : 'Country *'}
              </label>
              <Select
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
                options={[
                  { value: 'India', label: 'India' },
                  { value: 'USA', label: 'United States' },
                  { value: 'UK', label: 'United Kingdom' },
                  { value: 'Canada', label: 'Canada' },
                  { value: 'Australia', label: 'Australia' }
                ]}
                error={errors.country}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'जीवन स्तर *' : 'Life Stage *'}
              </label>
              <Select
                value={formData.lifeStage}
                onChange={(value) => handleInputChange('lifeStage', value)}
                options={[
                  { value: 'student', label: culturalContext === 'hindi' ? 'छात्र' : 'Student' },
                  { value: 'young-adult', label: culturalContext === 'hindi' ? 'युवा वयस्क' : 'Young Adult' },
                  { value: 'adult', label: culturalContext === 'hindi' ? 'वयस्क' : 'Adult' },
                  { value: 'parent', label: culturalContext === 'hindi' ? 'माता-पिता' : 'Parent' },
                  { value: 'senior', label: culturalContext === 'hindi' ? 'वरिष्ठ नागरिक' : 'Senior Citizen' }
                ]}
                error={errors.lifeStage}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium text-foreground mb-3">
                {culturalContext === 'hindi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">{culturalContext === 'hindi' ? 'नाम:' : 'Name:'}</span> {formData.name}</p>
                <p><span className="text-muted-foreground">{culturalContext === 'hindi' ? 'बचत:' : 'Savings:'}</span> ₹{formData.savings?.toLocaleString()}</p>
                <p><span className="text-muted-foreground">{culturalContext === 'hindi' ? 'कर्ज:' : 'Debt:'}</span> ₹{formData.debt?.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium text-foreground mb-3">
                {culturalContext === 'hindi' ? 'वित्तीय प्राथमिकताएं' : 'Financial Preferences'}
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">{culturalContext === 'hindi' ? 'जोखिम सहनशीलता:' : 'Risk Tolerance:'}</span> {formData.riskTolerance}</p>
                <p><span className="text-muted-foreground">{culturalContext === 'hindi' ? 'बचत:' : 'Savings:'}</span> ₹{formData.savings?.toLocaleString()}</p>
                <p><span className="text-muted-foreground">{culturalContext === 'hindi' ? 'कर्ज:' : 'Debt:'}</span> ₹{formData.debt?.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium text-foreground mb-3">
                {culturalContext === 'hindi' ? 'जीवन स्तर' : 'Life Stage'}
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">{culturalContext === 'hindi' ? 'देश:' : 'Country:'}</span> {formData.country}</p>
                <p><span className="text-muted-foreground">{culturalContext === 'hindi' ? 'जीवन स्तर:' : 'Life Stage:'}</span> {formData.lifeStage}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {culturalContext === 'hindi' ? 'वित्तीय प्रोफ़ाइल सेटअप' : 'Financial Profile Setup'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {getStepDescription()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-ui"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {culturalContext === 'hindi' 
                ? `चरण ${currentStep} का ${totalSteps}` 
                : `Step ${currentStep} of ${totalSteps}`
              }
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {getStepTitle()}
          </h3>
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onClose : handlePrevious}
              disabled={isLoading}
            >
              {currentStep === 1 
                ? (culturalContext === 'hindi' ? 'बाद में' : 'Later')
                : (culturalContext === 'hindi' ? 'पिछला' : 'Previous')
              }
            </Button>
            
            <div className="flex items-center space-x-3">
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={isLoading}>
                  {culturalContext === 'hindi' ? 'अगला' : 'Next'}
                </Button>
              ) : (
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading 
                    ? (culturalContext === 'hindi' ? 'सहेज रहे हैं...' : 'Saving...')
                    : (culturalContext === 'hindi' ? 'सहेजें' : 'Save')
                  }
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOnboardingModal;