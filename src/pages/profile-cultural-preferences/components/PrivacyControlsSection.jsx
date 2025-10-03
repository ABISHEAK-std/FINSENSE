import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const PrivacyControlsSection = ({ 
  privacySettings, 
  onUpdate, 
  isExpanded, 
  onToggle,
  culturalContext = 'default' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(privacySettings);

  const dataUsageOptions = [
    { value: 'minimal', label: culturalContext === 'hindi' ? 'न्यूनतम उपयोग' : 'Minimal Usage' },
    { value: 'standard', label: culturalContext === 'hindi' ? 'मानक उपयोग' : 'Standard Usage' },
    { value: 'enhanced', label: culturalContext === 'hindi' ? 'उन्नत उपयोग' : 'Enhanced Usage' },
    { value: 'full', label: culturalContext === 'hindi' ? 'पूर्ण उपयोग' : 'Full Usage' }
  ];

  const communityLevelOptions = [
    { value: 'private', label: culturalContext === 'hindi' ? 'निजी' : 'Private' },
    { value: 'anonymous', label: culturalContext === 'hindi' ? 'गुमनाम' : 'Anonymous' },
    { value: 'limited', label: culturalContext === 'hindi' ? 'सीमित' : 'Limited' },
    { value: 'open', label: culturalContext === 'hindi' ? 'खुला' : 'Open' }
  ];

  const aiLearningOptions = [
    { value: 'disabled', label: culturalContext === 'hindi' ? 'निष्क्रिय' : 'Disabled' },
    { value: 'local_only', label: culturalContext === 'hindi' ? 'केवल स्थानीय' : 'Local Only' },
    { value: 'anonymized', label: culturalContext === 'hindi' ? 'गुमनाम' : 'Anonymized' },
    { value: 'full', label: culturalContext === 'hindi' ? 'पूर्ण' : 'Full' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(privacySettings);
    setIsEditing(false);
  };

  const getPrivacyScore = () => {
    let score = 0;
    
    // Data usage scoring (lower usage = higher privacy)
    const dataUsageScores = { minimal: 25, standard: 15, enhanced: 10, full: 5 };
    score += dataUsageScores?.[formData?.emotionalDataUsage] || 0;
    
    // Community level scoring
    const communityScores = { private: 25, anonymous: 20, limited: 15, open: 10 };
    score += communityScores?.[formData?.communityParticipation] || 0;
    
    // AI learning scoring
    const aiScores = { disabled: 25, local_only: 20, anonymized: 15, full: 10 };
    score += aiScores?.[formData?.aiLearning] || 0;
    
    // Additional privacy features
    if (formData?.encryptEmotionalData) score += 10;
    if (formData?.anonymizeFinancialData) score += 10;
    if (!formData?.shareWithFamily) score += 5;
    
    return Math.min(score, 100);
  };

  const privacyScore = getPrivacyScore();

  const getPrivacyLevel = (score) => {
    if (score >= 80) return { level: culturalContext === 'hindi' ? 'उच्च' : 'High', color: 'text-success' };
    if (score >= 60) return { level: culturalContext === 'hindi' ? 'मध्यम' : 'Medium', color: 'text-warning' };
    return { level: culturalContext === 'hindi' ? 'कम' : 'Low', color: 'text-error' };
  };

  const privacyLevel = getPrivacyLevel(privacyScore);

  return (
    <div className="glass-card rounded-xl border border-border/20 overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-ui"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'गोपनीयता नियंत्रण' : 'Privacy Controls'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' 
                ? `गोपनीयता स्तर: ${privacyLevel?.level} (${privacyScore}%) • डेटा सुरक्षा सेटिंग्स`
                : `Privacy Level: ${privacyLevel?.level} (${privacyScore}%) • Data security settings`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className={privacyLevel?.color} />
            <span className={`text-sm font-medium ${privacyLevel?.color}`}>
              {privacyScore}%
            </span>
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
                {/* Privacy Score Card */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-green-800">
                      {culturalContext === 'hindi' ? 'गोपनीयता स्कोर' : 'Privacy Score'}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Icon name="Shield" size={16} className="text-green-600" />
                      <span className="text-lg font-bold text-green-800">{privacyScore}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${privacyScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    {culturalContext === 'hindi' ?'आपकी डेटा सुरक्षा का स्तर' :'Your data security level'
                    }
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'भावनात्मक डेटा उपयोग' : 'Emotional Data Usage'}
                    </label>
                    <p className="text-foreground font-medium">
                      {dataUsageOptions?.find(opt => opt?.value === formData?.emotionalDataUsage)?.label || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'समुदायिक भागीदारी' : 'Community Participation'}
                    </label>
                    <p className="text-foreground font-medium">
                      {communityLevelOptions?.find(opt => opt?.value === formData?.communityParticipation)?.label || 'Not set'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {culturalContext === 'hindi' ? 'AI सीखने की अनुमति' : 'AI Learning Permission'}
                  </label>
                  <p className="text-foreground font-medium">
                    {aiLearningOptions?.find(opt => opt?.value === formData?.aiLearning)?.label || 'Not set'}
                  </p>
                </div>
                {/* Privacy Features Status */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">
                    {culturalContext === 'hindi' ? 'सुरक्षा सुविधाएं' : 'Security Features'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Lock" size={16} className="text-green-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'भावनात्मक डेटा एन्क्रिप्शन' : 'Emotional Data Encryption'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.encryptEmotionalData ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="EyeOff" size={16} className="text-blue-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'वित्तीय डेटा गुमनामीकरण' : 'Financial Data Anonymization'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.anonymizeFinancialData ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Users" size={16} className="text-purple-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'पारिवारिक साझाकरण' : 'Family Sharing'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.shareWithFamily ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Database" size={16} className="text-orange-500" />
                        <span className="text-sm">
                          {culturalContext === 'hindi' ? 'स्थानीय डेटा भंडारण' : 'Local Data Storage'}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${formData?.localDataStorage ? 'bg-success' : 'bg-muted-foreground'}`} />
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
                    {culturalContext === 'hindi' ? 'संपादित करें' : 'Edit Privacy Settings'}
                  </Button>
                </div>
              </div>)
            ) : (
              /* Edit Mode */
              (<div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label={culturalContext === 'hindi' ? 'भावनात्मक डेटा उपयोग' : 'Emotional Data Usage'}
                    description={culturalContext === 'hindi' ? 'AI आपके भावनात्मक डेटा का कैसे उपयोग करे' : 'How AI should use your emotional data'}
                    options={dataUsageOptions}
                    value={formData?.emotionalDataUsage || ''}
                    onChange={(value) => handleInputChange('emotionalDataUsage', value)}
                    placeholder={culturalContext === 'hindi' ? 'उपयोग स्तर चुनें' : 'Select usage level'}
                  />
                  <Select
                    label={culturalContext === 'hindi' ? 'समुदायिक भागीदारी' : 'Community Participation'}
                    description={culturalContext === 'hindi' ? 'समुदाय में आपकी भागीदारी का स्तर' : 'Your level of community participation'}
                    options={communityLevelOptions}
                    value={formData?.communityParticipation || ''}
                    onChange={(value) => handleInputChange('communityParticipation', value)}
                    placeholder={culturalContext === 'hindi' ? 'भागीदारी स्तर चुनें' : 'Select participation level'}
                  />
                </div>
                <Select
                  label={culturalContext === 'hindi' ? 'AI सीखने की अनुमति' : 'AI Learning Permission'}
                  description={culturalContext === 'hindi' ? 'AI को आपके डेटा से सीखने की अनुमति दें' : 'Allow AI to learn from your data'}
                  options={aiLearningOptions}
                  value={formData?.aiLearning || ''}
                  onChange={(value) => handleInputChange('aiLearning', value)}
                  placeholder={culturalContext === 'hindi' ? 'अनुमति स्तर चुनें' : 'Select permission level'}
                />
                {/* Privacy Features */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">
                    {culturalContext === 'hindi' ? 'सुरक्षा सुविधाएं सक्रिय करें' : 'Enable Security Features'}
                  </h4>
                  <div className="space-y-3">
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="Lock" size={16} className="text-green-500" />
                          <span>{culturalContext === 'hindi' ? 'भावनात्मक डेटा एन्क्रिप्शन' : 'Encrypt Emotional Data'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'आपके भावनात्मक डेटा को एन्क्रिप्ट करें' : 'Encrypt your emotional data for maximum security'}
                      checked={formData?.encryptEmotionalData || false}
                      onChange={(e) => handleInputChange('encryptEmotionalData', e?.target?.checked)}
                    />
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="EyeOff" size={16} className="text-blue-500" />
                          <span>{culturalContext === 'hindi' ? 'वित्तीय डेटा गुमनामीकरण' : 'Anonymize Financial Data'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'आपकी वित्तीय जानकारी को गुमनाम बनाएं' : 'Make your financial information anonymous'}
                      checked={formData?.anonymizeFinancialData || false}
                      onChange={(e) => handleInputChange('anonymizeFinancialData', e?.target?.checked)}
                    />
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="Users" size={16} className="text-purple-500" />
                          <span>{culturalContext === 'hindi' ? 'पारिवारिक साझाकरण' : 'Share with Family'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'परिवार के सदस्यों के साथ डेटा साझा करें' : 'Share data with family members'}
                      checked={formData?.shareWithFamily || false}
                      onChange={(e) => handleInputChange('shareWithFamily', e?.target?.checked)}
                    />
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name="Database" size={16} className="text-orange-500" />
                          <span>{culturalContext === 'hindi' ? 'स्थानीय डेटा भंडारण' : 'Local Data Storage'}</span>
                        </div>
                      }
                      description={culturalContext === 'hindi' ? 'डेटा को स्थानीय रूप से संग्रहीत करें' : 'Store data locally on your device'}
                      checked={formData?.localDataStorage || false}
                      onChange={(e) => handleInputChange('localDataStorage', e?.target?.checked)}
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

export default PrivacyControlsSection;