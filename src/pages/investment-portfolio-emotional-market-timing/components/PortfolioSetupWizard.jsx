import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import CulturalContextIndicator from '../../../components/ui/CulturalContextIndicator';

const PortfolioSetupWizard = ({ culturalContext, onComplete, onLanguageChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Portfolio Setup
    initialInvestment: '',
    investmentGoals: '',
    riskTolerance: 5,
    investmentTimeline: '',
    preferredTypes: [],
    
    // Step 2: Emotional Profile
    currentMood: 5,
    stressLevel: 5,
    investmentConfidence: 5,
    riskComfort: 5,
    decisionStyle: '',
    
    // Step 3: Financial Details
    monthlyCapacity: '',
    financialStatus: '',
    emergencyFund: '',
    debtStatus: ''
  });

  const totalSteps = 3;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field, option) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(option)
        ? prev[field].filter(item => item !== option)
        : [...prev[field], option]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const userProfile = {
      // Portfolio data
      initialInvestment: Number(formData.initialInvestment),
      investmentGoals: formData.investmentGoals,
      riskTolerance: formData.riskTolerance,
      investmentTimeline: formData.investmentTimeline,
      preferredTypes: formData.preferredTypes,
      
      // Emotional profile
      currentMood: formData.currentMood,
      stressLevel: formData.stressLevel,
      investmentConfidence: formData.investmentConfidence,
      riskComfort: formData.riskComfort,
      decisionStyle: formData.decisionStyle,
      
      // Financial details
      monthlyCapacity: Number(formData.monthlyCapacity),
      financialStatus: formData.financialStatus,
      emergencyFund: formData.emergencyFund,
      debtStatus: formData.debtStatus,
      
      createdAt: new Date().toISOString(),
      lastMoodUpdate: new Date().toISOString()
    };

    const portfolioData = {
      totalValue: Number(formData.initialInvestment),
      initialAmount: Number(formData.initialInvestment),
      investments: formData.initialInvestment > 0 ? [{
        type: 'Initial Investment',
        amount: Number(formData.initialInvestment),
        date: new Date().toISOString(),
        id: Date.now()
      }] : [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    onComplete(userProfile, portfolioData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.initialInvestment && formData.investmentGoals && formData.investmentTimeline && formData.preferredTypes.length > 0;
      case 2:
        return formData.decisionStyle;
      case 3:
        return formData.monthlyCapacity && formData.financialStatus && formData.emergencyFund && formData.debtStatus;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'प्रारंभिक निवेश राशि (₹)' : 'Initial Investment Amount (₹)'}
        </label>
        <input
          type="number"
          min="0"
          value={formData.initialInvestment}
          onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={culturalContext === 'hindi' ? 'उदाहरण: 50000' : 'e.g., 50000'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'निवेश लक्ष्य' : 'Investment Goals'}
        </label>
        <select
          value={formData.investmentGoals}
          onChange={(e) => handleInputChange('investmentGoals', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{culturalContext === 'hindi' ? 'लक्ष्य चुनें' : 'Select Goal'}</option>
          <option value="retirement">{culturalContext === 'hindi' ? 'सेवानिवृत्ति' : 'Retirement'}</option>
          <option value="wealth-building">{culturalContext === 'hindi' ? 'संपत्ति निर्माण' : 'Wealth Building'}</option>
          <option value="short-term">{culturalContext === 'hindi' ? 'अल्पकालिक' : 'Short-term'}</option>
          <option value="emergency-fund">{culturalContext === 'hindi' ? 'आपातकालीन फंड' : 'Emergency Fund'}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? `जोखिम सहनशीलता: ${formData.riskTolerance}/10` : `Risk Tolerance: ${formData.riskTolerance}/10`}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.riskTolerance}
          onChange={(e) => handleInputChange('riskTolerance', Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{culturalContext === 'hindi' ? 'रूढ़िवादी' : 'Conservative'}</span>
          <span>{culturalContext === 'hindi' ? 'आक्रामक' : 'Aggressive'}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'निवेश समयसीमा' : 'Investment Timeline'}
        </label>
        <select
          value={formData.investmentTimeline}
          onChange={(e) => handleInputChange('investmentTimeline', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{culturalContext === 'hindi' ? 'समयसीमा चुनें' : 'Select Timeline'}</option>
          <option value="1-year">{culturalContext === 'hindi' ? '1 साल' : '1 year'}</option>
          <option value="2-5-years">{culturalContext === 'hindi' ? '2-5 साल' : '2-5 years'}</option>
          <option value="5-10-years">{culturalContext === 'hindi' ? '5-10 साल' : '5-10 years'}</option>
          <option value="10-plus-years">{culturalContext === 'hindi' ? '10+ साल' : '10+ years'}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'पसंदीदा निवेश प्रकार (कई चुनें)' : 'Preferred Investment Types (Select Multiple)'}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'stocks', label: culturalContext === 'hindi' ? 'स्टॉक्स' : 'Stocks' },
            { id: 'bonds', label: culturalContext === 'hindi' ? 'बॉन्ड्स' : 'Bonds' },
            { id: 'mutual-funds', label: culturalContext === 'hindi' ? 'म्यूचुअल फंड' : 'Mutual Funds' },
            { id: 'etfs', label: 'ETFs' },
            { id: 'crypto', label: culturalContext === 'hindi' ? 'क्रिप्टो' : 'Crypto' },
            { id: 'gold', label: culturalContext === 'hindi' ? 'सोना' : 'Gold' }
          ].map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleMultiSelectChange('preferredTypes', option.id)}
              className={`p-3 border rounded-lg text-left transition-ui ${
                formData.preferredTypes.includes(option.id)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? `वर्तमान मूड: ${formData.currentMood}/10` : `Current Mood: ${formData.currentMood}/10`}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.currentMood}
          onChange={(e) => handleInputChange('currentMood', Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{culturalContext === 'hindi' ? 'बहुत नकारात्मक' : 'Very Negative'}</span>
          <span>{culturalContext === 'hindi' ? 'बहुत सकारात्मक' : 'Very Positive'}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? `तनाव स्तर: ${formData.stressLevel}/10` : `Stress Level: ${formData.stressLevel}/10`}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.stressLevel}
          onChange={(e) => handleInputChange('stressLevel', Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{culturalContext === 'hindi' ? 'बहुत शांत' : 'Very Calm'}</span>
          <span>{culturalContext === 'hindi' ? 'बहुत तनावग्रस्त' : 'Very Stressed'}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? `निवेश आत्मविश्वास: ${formData.investmentConfidence}/10` : `Investment Confidence: ${formData.investmentConfidence}/10`}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.investmentConfidence}
          onChange={(e) => handleInputChange('investmentConfidence', Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{culturalContext === 'hindi' ? 'आत्मविश्वास नहीं' : 'Not Confident'}</span>
          <span>{culturalContext === 'hindi' ? 'बहुत आत्मविश्वास' : 'Very Confident'}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? `जोखिम आराम: ${formData.riskComfort}/10` : `Risk Comfort: ${formData.riskComfort}/10`}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.riskComfort}
          onChange={(e) => handleInputChange('riskComfort', Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{culturalContext === 'hindi' ? 'असहज' : 'Uncomfortable'}</span>
          <span>{culturalContext === 'hindi' ? 'बहुत आरामदायक' : 'Very Comfortable'}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'निर्णय लेने की शैली' : 'Decision Making Style'}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'analytical', label: culturalContext === 'hindi' ? 'विश्लेषणात्मक' : 'Analytical' },
            { id: 'intuitive', label: culturalContext === 'hindi' ? 'सहज' : 'Intuitive' },
            { id: 'conservative', label: culturalContext === 'hindi' ? 'रूढ़िवादी' : 'Conservative' },
            { id: 'aggressive', label: culturalContext === 'hindi' ? 'आक्रामक' : 'Aggressive' }
          ].map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleInputChange('decisionStyle', option.id)}
              className={`p-3 border rounded-lg text-left transition-ui ${
                formData.decisionStyle === option.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'मासिक निवेश क्षमता (₹)' : 'Monthly Investment Capacity (₹)'}
        </label>
        <input
          type="number"
          min="0"
          value={formData.monthlyCapacity}
          onChange={(e) => handleInputChange('monthlyCapacity', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={culturalContext === 'hindi' ? 'उदाहरण: 10000' : 'e.g., 10000'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'वर्तमान वित्तीय स्थिति' : 'Current Financial Status'}
        </label>
        <select
          value={formData.financialStatus}
          onChange={(e) => handleInputChange('financialStatus', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{culturalContext === 'hindi' ? 'स्थिति चुनें' : 'Select Status'}</option>
          <option value="stable">{culturalContext === 'hindi' ? 'स्थिर' : 'Stable'}</option>
          <option value="growing">{culturalContext === 'hindi' ? 'बढ़ते हुए' : 'Growing'}</option>
          <option value="uncertain">{culturalContext === 'hindi' ? 'अनिश्चित' : 'Uncertain'}</option>
          <option value="improving">{culturalContext === 'hindi' ? 'सुधार रहा' : 'Improving'}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'आपातकालीन फंड स्थिति' : 'Emergency Fund Status'}
        </label>
        <div className="space-y-2">
          {[
            { id: 'none', label: culturalContext === 'hindi' ? 'कोई नहीं' : 'None' },
            { id: '3-months', label: culturalContext === 'hindi' ? '3 महीने' : '3 months' },
            { id: '6-months', label: culturalContext === 'hindi' ? '6 महीने' : '6 months' },
            { id: '1-year-plus', label: culturalContext === 'hindi' ? '1 साल+' : '1 year+' }
          ].map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleInputChange('emergencyFund', option.id)}
              className={`w-full p-3 border rounded-lg text-left transition-ui ${
                formData.emergencyFund === option.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'ऋण स्थिति' : 'Debt Status'}
        </label>
        <select
          value={formData.debtStatus}
          onChange={(e) => handleInputChange('debtStatus', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{culturalContext === 'hindi' ? 'स्थिति चुनें' : 'Select Status'}</option>
          <option value="debt-free">{culturalContext === 'hindi' ? 'ऋण मुक्त' : 'Debt-free'}</option>
          <option value="low-debt">{culturalContext === 'hindi' ? 'कम ऋण' : 'Low debt'}</option>
          <option value="moderate-debt">{culturalContext === 'hindi' ? 'मध्यम ऋण' : 'Moderate debt'}</option>
          <option value="high-debt">{culturalContext === 'hindi' ? 'उच्च ऋण' : 'High debt'}</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CulturalContextIndicator
              culturalContext={culturalContext}
              onContextChange={onLanguageChange}
            />
          </div>
          <Icon name="TrendingUp" size={48} className="text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-heading text-foreground mb-2">
            {culturalContext === 'hindi' ? 'पोर्टफोलियो सेटअप' : 'Portfolio Setup'}
          </h1>
          <p className="text-muted-foreground">
            {culturalContext === 'hindi' 
              ? 'आपके व्यक्तिगत निवेश अनुभव को बनाने के लिए कुछ प्रश्नों का उत्तर दें'
              : 'Answer a few questions to create your personalized investment experience'
            }
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              {culturalContext === 'hindi' ? 'चरण' : 'Step'} {currentStep} {culturalContext === 'hindi' ? 'का' : 'of'} {totalSteps}
            </span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-card rounded-xl border p-8 mb-8">
          <h2 className="text-xl font-heading text-foreground mb-6">
            {currentStep === 1 && (culturalContext === 'hindi' ? 'पोर्टफोलियो सेटअप' : 'Portfolio Setup')}
            {currentStep === 2 && (culturalContext === 'hindi' ? 'भावनात्मक प्रोफाइल मूल्यांकन' : 'Emotional Profile Assessment')}
            {currentStep === 3 && (culturalContext === 'hindi' ? 'वित्तीय विवरण' : 'Financial Details')}
          </h2>
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            {culturalContext === 'hindi' ? 'पिछला' : 'Previous'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            iconName={currentStep === totalSteps ? "Check" : "ArrowRight"}
            iconPosition="right"
          >
            {currentStep === totalSteps 
              ? (culturalContext === 'hindi' ? 'पूरा करें' : 'Complete')
              : (culturalContext === 'hindi' ? 'अगला' : 'Next')
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSetupWizard;
