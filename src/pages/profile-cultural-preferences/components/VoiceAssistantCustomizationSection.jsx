import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const VoiceAssistantCustomizationSection = ({ 
  voiceSettings, 
  onUpdate, 
  isExpanded, 
  onToggle,
  culturalContext = 'default' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(voiceSettings);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const voiceTypeOptions = [
    { value: 'female_warm', label: culturalContext === 'hindi' ? 'महिला - गर्म स्वर' : 'Female - Warm' },
    { value: 'female_professional', label: culturalContext === 'hindi' ? 'महिला - व्यावसायिक' : 'Female - Professional' },
    { value: 'male_friendly', label: culturalContext === 'hindi' ? 'पुरुष - मित्रवत' : 'Male - Friendly' },
    { value: 'male_authoritative', label: culturalContext === 'hindi' ? 'पुरुष - आधिकारिक' : 'Male - Authoritative' },
    { value: 'neutral_calm', label: culturalContext === 'hindi' ? 'तटस्थ - शांत' : 'Neutral - Calm' }
  ];

  const accentOptions = [
    { value: 'indian_english', label: culturalContext === 'hindi' ? 'भारतीय अंग्रेजी' : 'Indian English' },
    { value: 'hindi_accent', label: culturalContext === 'hindi' ? 'हिंदी उच्चारण' : 'Hindi Accent' },
    { value: 'regional_accent', label: culturalContext === 'hindi' ? 'क्षेत्रीय उच्चारण' : 'Regional Accent' },
    { value: 'neutral_accent', label: culturalContext === 'hindi' ? 'तटस्थ उच्चारण' : 'Neutral Accent' }
  ];

  const interactionStyleOptions = [
    { value: 'conversational', label: culturalContext === 'hindi' ? 'बातचीत शैली' : 'Conversational' },
    { value: 'formal', label: culturalContext === 'hindi' ? 'औपचारिक' : 'Formal' },
    { value: 'casual', label: culturalContext === 'hindi' ? 'अनौपचारिक' : 'Casual' },
    { value: 'supportive', label: culturalContext === 'hindi' ? 'सहायक' : 'Supportive' },
    { value: 'motivational', label: culturalContext === 'hindi' ? 'प्रेरणादायक' : 'Motivational' }
  ];

  const culturalAwarenessOptions = [
    { value: 'high', label: culturalContext === 'hindi' ? 'उच्च जागरूकता' : 'High Awareness' },
    { value: 'medium', label: culturalContext === 'hindi' ? 'मध्यम जागरूकता' : 'Medium Awareness' },
    { value: 'basic', label: culturalContext === 'hindi' ? 'बुनियादी जागरूकता' : 'Basic Awareness' },
    { value: 'minimal', label: culturalContext === 'hindi' ? 'न्यूनतम जागरूकता' : 'Minimal Awareness' }
  ];

  const speedOptions = [
    { value: 'slow', label: culturalContext === 'hindi' ? 'धीमा' : 'Slow' },
    { value: 'normal', label: culturalContext === 'hindi' ? 'सामान्य' : 'Normal' },
    { value: 'fast', label: culturalContext === 'hindi' ? 'तेज़' : 'Fast' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestVoice = () => {
    setIsTestingVoice(true);
    
    // Simulate voice test
    const testMessage = culturalContext === 'hindi' ?'नमस्ते! मैं आपका AI वित्तीय सहायक हूं। आपकी वित्तीय यात्रा में आपकी मदद करने के लिए मैं यहां हूं।' :'Hello! I am your AI financial assistant. I am here to help you with your financial journey.';
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(testMessage);
      utterance.lang = culturalContext === 'hindi' ? 'hi-IN' : 'en-IN';
      utterance.rate = formData?.speechSpeed === 'slow' ? 0.8 : formData?.speechSpeed === 'fast' ? 1.2 : 1.0;
      
      utterance.onend = () => {
        setIsTestingVoice(false);
      };
      
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsTestingVoice(false), 3000);
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(voiceSettings);
    setIsEditing(false);
  };

  const getCompletionPercentage = () => {
    const fields = ['voiceType', 'accent', 'interactionStyle', 'culturalAwareness', 'speechSpeed'];
    const completedFields = fields?.filter(field => formData?.[field] && formData?.[field]?.trim());
    return Math.round((completedFields?.length / fields?.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="glass-card rounded-xl border border-border/20 overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-ui"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Icon name="Mic" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'आवाज़ सहायक अनुकूलन' : 'Voice Assistant Customization'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' 
                ? `${completionPercentage}% पूर्ण • आवाज़ और बातचीत की शैली`
                : `${completionPercentage}% Complete • Voice and interaction style`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-muted-foreground" 
          />
        </div>
      </div>
      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border/20">
          <div className="pt-4">
            {!isEditing ? (
              /* Display Mode */
              (<div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'आवाज़ प्रकार' : 'Voice Type'}
                    </label>
                    <p className="text-foreground font-medium">
                      {voiceTypeOptions?.find(opt => opt?.value === formData?.voiceType)?.label || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'उच्चारण' : 'Accent'}
                    </label>
                    <p className="text-foreground font-medium">
                      {accentOptions?.find(opt => opt?.value === formData?.accent)?.label || 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'बातचीत की शैली' : 'Interaction Style'}
                    </label>
                    <p className="text-foreground font-medium">
                      {interactionStyleOptions?.find(opt => opt?.value === formData?.interactionStyle)?.label || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'सांस्कृतिक जागरूकता' : 'Cultural Awareness'}
                    </label>
                    <p className="text-foreground font-medium">
                      {culturalAwarenessOptions?.find(opt => opt?.value === formData?.culturalAwareness)?.label || 'Not set'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {culturalContext === 'hindi' ? 'बोलने की गति' : 'Speech Speed'}
                  </label>
                  <p className="text-foreground font-medium">
                    {speedOptions?.find(opt => opt?.value === formData?.speechSpeed)?.label || 'Not set'}
                  </p>
                </div>
                {/* Voice Features Status */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">
                    {culturalContext === 'hindi' ? 'आवाज़ सुविधाएं' : 'Voice Features'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Ear" size={16} className="text-indigo-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'निरंतर सुनना' : 'Continuous Listening'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.continuousListening ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Brain" size={16} className="text-purple-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'भावना पहचान' : 'Emotion Detection'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.emotionDetection ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Zap" size={16} className="text-yellow-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'त्वरित प्रतिक्रिया' : 'Quick Response'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.quickResponse ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Globe" size={16} className="text-green-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'बहुभाषी समर्थन' : 'Multilingual Support'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.multilingualSupport ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={handleTestVoice}
                    loading={isTestingVoice}
                    iconName="Play"
                    iconPosition="left"
                  >
                    {culturalContext === 'hindi' ? 'आवाज़ टेस्ट करें' : 'Test Voice'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    {culturalContext === 'hindi' ? 'संपादित करें' : 'Edit Settings'}
                  </Button>
                </div>
              </div>)
            ) : (
              /* Edit Mode */
              (<div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label={culturalContext === 'hindi' ? 'आवाज़ प्रकार' : 'Voice Type'}
                    description={culturalContext === 'hindi' ? 'AI सहायक की आवाज़ का प्रकार' : 'Type of AI assistant voice'}
                    options={voiceTypeOptions}
                    value={formData?.voiceType || ''}
                    onChange={(value) => handleInputChange('voiceType', value)}
                    placeholder={culturalContext === 'hindi' ? 'आवाज़ चुनें' : 'Select voice'}
                  />
                  <Select
                    label={culturalContext === 'hindi' ? 'उच्चारण' : 'Accent'}
                    description={culturalContext === 'hindi' ? 'आवाज़ का उच्चारण शैली' : 'Voice accent style'}
                    options={accentOptions}
                    value={formData?.accent || ''}
                    onChange={(value) => handleInputChange('accent', value)}
                    placeholder={culturalContext === 'hindi' ? 'उच्चारण चुनें' : 'Select accent'}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label={culturalContext === 'hindi' ? 'बातचीत की शैली' : 'Interaction Style'}
                    description={culturalContext === 'hindi' ? 'AI के साथ बातचीत का तरीका' : 'How AI interacts with you'}
                    options={interactionStyleOptions}
                    value={formData?.interactionStyle || ''}
                    onChange={(value) => handleInputChange('interactionStyle', value)}
                    placeholder={culturalContext === 'hindi' ? 'शैली चुनें' : 'Select style'}
                  />
                  <Select
                    label={culturalContext === 'hindi' ? 'सांस्कृतिक जागरूकता' : 'Cultural Awareness'}
                    description={culturalContext === 'hindi' ? 'सांस्कृतिक संदर्भ की समझ का स्तर' : 'Level of cultural context understanding'}
                    options={culturalAwarenessOptions}
                    value={formData?.culturalAwareness || ''}
                    onChange={(value) => handleInputChange('culturalAwareness', value)}
                    placeholder={culturalContext === 'hindi' ? 'जागरूकता स्तर चुनें' : 'Select awareness level'}
                  />
                </div>
                <Select
                  label={culturalContext === 'hindi' ? 'बोलने की गति' : 'Speech Speed'}
                  description={culturalContext === 'hindi' ? 'AI की बोलने की गति' : 'Speed of AI speech'}
                  options={speedOptions}
                  value={formData?.speechSpeed || ''}
                  onChange={(value) => handleInputChange('speechSpeed', value)}
                  placeholder={culturalContext === 'hindi' ? 'गति चुनें' : 'Select speed'}
                />
                {/* Voice Features */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">
                    {culturalContext === 'hindi' ? 'आवाज़ सुविधाएं सक्रिय करें' : 'Enable Voice Features'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="Ear" size={16} className="text-indigo-500" />
                          <span>{culturalContext === 'hindi' ? 'निरंतर सुनना' : 'Continuous Listening'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'हमेशा आपकी आवाज़ सुनने के लिए तैयार' : 'Always ready to listen to your voice'}
                      checked={formData?.continuousListening || false}
                      onChange={(e) => handleInputChange('continuousListening', e?.target?.checked)}
                    />
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="Brain" size={16} className="text-purple-500" />
                          <span>{culturalContext === 'hindi' ? 'भावना पहचान' : 'Emotion Detection'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'आवाज़ से भावनाओं की पहचान' : 'Detect emotions from voice'}
                      checked={formData?.emotionDetection || false}
                      onChange={(e) => handleInputChange('emotionDetection', e?.target?.checked)}
                    />
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="Zap" size={16} className="text-yellow-500" />
                          <span>{culturalContext === 'hindi' ? 'त्वरित प्रतिक्रिया' : 'Quick Response'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'तुरंत जवाब देना' : 'Respond immediately'}
                      checked={formData?.quickResponse || false}
                      onChange={(e) => handleInputChange('quickResponse', e?.target?.checked)}
                    />
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="Globe" size={16} className="text-green-500" />
                          <span>{culturalContext === 'hindi' ? 'बहुभाषी समर्थन' : 'Multilingual Support'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'कई भाषाओं में बात करना' : 'Communicate in multiple languages'}
                      checked={formData?.multilingualSupport || false}
                      onChange={(e) => handleInputChange('multilingualSupport', e?.target?.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    {culturalContext === 'hindi' ? 'रद्द करें' : 'Cancel'}
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleSave}
                    iconName="Save"
                    iconPosition="left"
                  >
                    {culturalContext === 'hindi' ? 'सहेजें' : 'Save Changes'}
                  </Button>
                </div>
              </div>)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistantCustomizationSection;