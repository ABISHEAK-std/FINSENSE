import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const EmotionalAISettingsSection = ({ 
  aiSettings, 
  onUpdate, 
  isExpanded, 
  onToggle,
  culturalContext = 'default' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(aiSettings);

  const sensitivityOptions = [
    { value: 'low', label: culturalContext === 'hindi' ? 'कम संवेदनशीलता' : 'Low Sensitivity' },
    { value: 'medium', label: culturalContext === 'hindi' ? 'मध्यम संवेदनशीलता' : 'Medium Sensitivity' },
    { value: 'high', label: culturalContext === 'hindi' ? 'उच्च संवेदनशीलता' : 'High Sensitivity' },
    { value: 'adaptive', label: culturalContext === 'hindi' ? 'अनुकूली संवेदनशीलता' : 'Adaptive Sensitivity' }
  ];

  const therapyStyleOptions = [
    { value: 'supportive', label: culturalContext === 'hindi' ? 'सहायक' : 'Supportive' },
    { value: 'analytical', label: culturalContext === 'hindi' ? 'विश्लेषणात्मक' : 'Analytical' },
    { value: 'motivational', label: culturalContext === 'hindi' ? 'प्रेरणादायक' : 'Motivational' },
    { value: 'gentle', label: culturalContext === 'hindi' ? 'कोमल' : 'Gentle' },
    { value: 'direct', label: culturalContext === 'hindi' ? 'प्रत्यक्ष' : 'Direct' }
  ];

  const crisisThresholdOptions = [
    { value: 'immediate', label: culturalContext === 'hindi' ? 'तत्काल हस्तक्षेप' : 'Immediate Intervention' },
    { value: 'moderate', label: culturalContext === 'hindi' ? 'मध्यम चेतावनी' : 'Moderate Warning' },
    { value: 'gentle', label: culturalContext === 'hindi' ? 'कोमल सुझाव' : 'Gentle Suggestion' },
    { value: 'disabled', label: culturalContext === 'hindi' ? 'निष्क्रिय' : 'Disabled' }
  ];

  const voiceAnalysisOptions = [
    { value: 'full', label: culturalContext === 'hindi' ? 'पूर्ण विश्लेषण' : 'Full Analysis' },
    { value: 'basic', label: culturalContext === 'hindi' ? 'बुनियादी विश्लेषण' : 'Basic Analysis' },
    { value: 'disabled', label: culturalContext === 'hindi' ? 'निष्क्रिय' : 'Disabled' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(aiSettings);
    setIsEditing(false);
  };

  const getCompletionPercentage = () => {
    const fields = ['emotionSensitivity', 'therapyStyle', 'crisisThreshold', 'voiceAnalysis'];
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
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Icon name="Brain" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'भावनात्मक AI सेटिंग्स' : 'Emotional AI Settings'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' 
                ? `${completionPercentage}% पूर्ण • भावना पहचान और थेरेपी शैली`
                : `${completionPercentage}% Complete • Emotion detection and therapy style`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
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
                      {culturalContext === 'hindi' ? 'भावना संवेदनशीलता' : 'Emotion Sensitivity'}
                    </label>
                    <p className="text-foreground font-medium">
                      {sensitivityOptions?.find(opt => opt?.value === formData?.emotionSensitivity)?.label || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'थेरेपी शैली' : 'Therapy Style'}
                    </label>
                    <p className="text-foreground font-medium">
                      {therapyStyleOptions?.find(opt => opt?.value === formData?.therapyStyle)?.label || 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'संकट हस्तक्षेप सीमा' : 'Crisis Intervention Threshold'}
                    </label>
                    <p className="text-foreground font-medium">
                      {crisisThresholdOptions?.find(opt => opt?.value === formData?.crisisThreshold)?.label || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'आवाज़ विश्लेषण' : 'Voice Analysis'}
                    </label>
                    <p className="text-foreground font-medium">
                      {voiceAnalysisOptions?.find(opt => opt?.value === formData?.voiceAnalysis)?.label || 'Not set'}
                    </p>
                  </div>
                </div>
                {/* AI Features Status */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">
                    {culturalContext === 'hindi' ? 'AI सुविधाएं' : 'AI Features'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="MessageCircleHeart" size={16} className="text-purple-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'भावनात्मक चैट' : 'Emotional Chat'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.emotionalChat ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="TrendingUp" size={16} className="text-blue-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'व्यय पैटर्न विश्लेषण' : 'Spending Pattern Analysis'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.spendingAnalysis ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="AlertTriangle" size={16} className="text-warning" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'तनाव चेतावनी' : 'Stress Alerts'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.stressAlerts ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Calendar" size={16} className="text-green-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'त्योहार योजना' : 'Festival Planning'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.festivalPlanning ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
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
                    label={culturalContext === 'hindi' ? 'भावना संवेदनशीलता' : 'Emotion Sensitivity'}
                    description={culturalContext === 'hindi' ? 'AI कितनी संवेदनशीलता से आपकी भावनाओं को समझे' : 'How sensitively AI should detect your emotions'}
                    options={sensitivityOptions}
                    value={formData?.emotionSensitivity || ''}
                    onChange={(value) => handleInputChange('emotionSensitivity', value)}
                    placeholder={culturalContext === 'hindi' ? 'संवेदनशीलता चुनें' : 'Select sensitivity'}
                  />
                  <Select
                    label={culturalContext === 'hindi' ? 'थेरेपी शैली' : 'Therapy Style'}
                    description={culturalContext === 'hindi' ? 'AI की सलाह देने की शैली' : 'AI\'s counseling approach'}
                    options={therapyStyleOptions}
                    value={formData?.therapyStyle || ''}
                    onChange={(value) => handleInputChange('therapyStyle', value)}
                    placeholder={culturalContext === 'hindi' ? 'शैली चुनें' : 'Select style'}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label={culturalContext === 'hindi' ? 'संकट हस्तक्षेप सीमा' : 'Crisis Intervention Threshold'}
                    description={culturalContext === 'hindi' ? 'कब AI को तुरंत मदद की पेशकश करनी चाहिए' : 'When AI should offer immediate help'}
                    options={crisisThresholdOptions}
                    value={formData?.crisisThreshold || ''}
                    onChange={(value) => handleInputChange('crisisThreshold', value)}
                    placeholder={culturalContext === 'hindi' ? 'सीमा चुनें' : 'Select threshold'}
                  />
                  <Select
                    label={culturalContext === 'hindi' ? 'आवाज़ विश्लेषण' : 'Voice Analysis'}
                    description={culturalContext === 'hindi' ? 'आपकी आवाज़ से भावना पहचान का स्तर' : 'Level of emotion detection from your voice'}
                    options={voiceAnalysisOptions}
                    value={formData?.voiceAnalysis || ''}
                    onChange={(value) => handleInputChange('voiceAnalysis', value)}
                    placeholder={culturalContext === 'hindi' ? 'विश्लेषण स्तर चुनें' : 'Select analysis level'}
                  />
                </div>
                {/* AI Features Toggle */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">
                    {culturalContext === 'hindi' ? 'AI सुविधाएं सक्रिय करें' : 'Enable AI Features'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="MessageCircleHeart" size={16} className="text-purple-500" />
                          <span>{culturalContext === 'hindi' ? 'भावनात्मक चैट' : 'Emotional Chat'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'AI से भावनात्मक सहायता प्राप्त करें' : 'Get emotional support from AI'}
                      checked={formData?.emotionalChat || false}
                      onChange={(e) => handleInputChange('emotionalChat', e?.target?.checked)}
                    />
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="TrendingUp" size={16} className="text-blue-500" />
                          <span>{culturalContext === 'hindi' ? 'व्यय पैटर्न विश्लेषण' : 'Spending Pattern Analysis'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'भावनाओं के आधार पर खर्च का विश्लेषण' : 'Analyze spending based on emotions'}
                      checked={formData?.spendingAnalysis || false}
                      onChange={(e) => handleInputChange('spendingAnalysis', e?.target?.checked)}
                    />
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="AlertTriangle" size={16} className="text-warning" />
                          <span>{culturalContext === 'hindi' ? 'तनाव चेतावनी' : 'Stress Alerts'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'तनाव के समय चेतावनी प्राप्त करें' : 'Get alerts during stressful times'}
                      checked={formData?.stressAlerts || false}
                      onChange={(e) => handleInputChange('stressAlerts', e?.target?.checked)}
                    />
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="Calendar" size={16} className="text-green-500" />
                          <span>{culturalContext === 'hindi' ? 'त्योहार योजना' : 'Festival Planning'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'त्योहारों के लिए स्वचालित बजट सुझाव' : 'Automatic budget suggestions for festivals'}
                      checked={formData?.festivalPlanning || false}
                      onChange={(e) => handleInputChange('festivalPlanning', e?.target?.checked)}
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

export default EmotionalAISettingsSection;