import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const NotificationPreferencesSection = ({ 
  notificationSettings, 
  onUpdate, 
  isExpanded, 
  onToggle,
  culturalContext = 'default' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(notificationSettings);

  const deliveryMethodOptions = [
    { value: 'push', label: culturalContext === 'hindi' ? 'पुश नोटिफिकेशन' : 'Push Notifications' },
    { value: 'email', label: culturalContext === 'hindi' ? 'ईमेल' : 'Email' },
    { value: 'sms', label: culturalContext === 'hindi' ? 'SMS' : 'SMS' },
    { value: 'whatsapp', label: culturalContext === 'hindi' ? 'व्हाट्सऐप' : 'WhatsApp' }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: culturalContext === 'hindi' ? 'तुरंत' : 'Immediate' },
    { value: 'daily', label: culturalContext === 'hindi' ? 'दैनिक' : 'Daily' },
    { value: 'weekly', label: culturalContext === 'hindi' ? 'साप्ताहिक' : 'Weekly' },
    { value: 'monthly', label: culturalContext === 'hindi' ? 'मासिक' : 'Monthly' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी' },
    { value: 'tamil', label: 'தமிழ்' },
    { value: 'bengali', label: 'বাংলা' },
    { value: 'gujarati', label: 'ગુજરાતી' }
  ];

  const notificationTypes = [
    {
      id: 'emotional_alerts',
      label: culturalContext === 'hindi' ? 'भावनात्मक चेतावनी' : 'Emotional Alerts',
      description: culturalContext === 'hindi' ? 'तनाव या चिंता के समय अलर्ट' : 'Alerts during stress or anxiety',
      icon: 'Heart',
      color: 'text-red-500'
    },
    {
      id: 'spending_warnings',
      label: culturalContext === 'hindi' ? 'खर्च चेतावनी' : 'Spending Warnings',
      description: culturalContext === 'hindi' ? 'बजट सीमा पार करने पर चेतावनी' : 'Warnings when exceeding budget limits',
      icon: 'AlertTriangle',
      color: 'text-warning'
    },
    {
      id: 'cultural_events',
      label: culturalContext === 'hindi' ? 'सांस्कृतिक कार्यक्रम' : 'Cultural Events',
      description: culturalContext === 'hindi' ? 'त्योहार और विशेष अवसरों की याद दिलाना' : 'Reminders for festivals and special occasions',
      icon: 'Calendar',
      color: 'text-amber-500'
    },
    {
      id: 'investment_insights',
      label: culturalContext === 'hindi' ? 'निवेश अंतर्दृष्टि' : 'Investment Insights',
      description: culturalContext === 'hindi' ? 'बाजार के अवसर और सुझाव' : 'Market opportunities and suggestions',
      icon: 'TrendingUp',
      color: 'text-green-500'
    },
    {
      id: 'community_updates',
      label: culturalContext === 'hindi' ? 'समुदायिक अपडेट' : 'Community Updates',
      description: culturalContext === 'hindi' ? 'समुदाय की गतिविधियां और चर्चा' : 'Community activities and discussions',
      icon: 'Users',
      color: 'text-blue-500'
    },
    {
      id: 'therapy_reminders',
      label: culturalContext === 'hindi' ? 'थेरेपी रिमाइंडर' : 'Therapy Reminders',
      description: culturalContext === 'hindi' ? 'AI थेरेपी सत्र के लिए रिमाइंडर' : 'Reminders for AI therapy sessions',
      icon: 'MessageCircleHeart',
      color: 'text-purple-500'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev?.[field]?.includes(value) 
        ? prev?.[field]?.filter(item => item !== value)
        : [...(prev?.[field] || []), value]
    }));
  };

  const handleNotificationToggle = (notificationId, enabled) => {
    setFormData(prev => ({
      ...prev,
      enabledNotifications: {
        ...prev?.enabledNotifications,
        [notificationId]: enabled
      }
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(notificationSettings);
    setIsEditing(false);
  };

  const getEnabledCount = () => {
    const enabled = formData?.enabledNotifications || {};
    return Object.values(enabled)?.filter(Boolean)?.length;
  };

  const enabledCount = getEnabledCount();

  return (
    <div className="glass-card rounded-xl border border-border/20 overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-ui"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Icon name="Bell" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'सूचना प्राथमिकताएं' : 'Notification Preferences'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' 
                ? `${enabledCount} सूचनाएं सक्रिय • अलर्ट और रिमाइंडर सेटिंग्स`
                : `${enabledCount} notifications enabled • Alert and reminder settings`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Icon name="Bell" size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-500">{enabledCount}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'डिलीवरी विधि' : 'Delivery Method'}
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData?.deliveryMethods?.map(method => {
                        const option = deliveryMethodOptions?.find(opt => opt?.value === method);
                        return option ? (
                          <span key={method} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {option?.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'आवृत्ति' : 'Frequency'}
                    </label>
                    <p className="text-foreground font-medium">
                      {frequencyOptions?.find(opt => opt?.value === formData?.frequency)?.label || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'भाषा' : 'Language'}
                    </label>
                    <p className="text-foreground font-medium">
                      {languageOptions?.find(opt => opt?.value === formData?.notificationLanguage)?.label || 'Not set'}
                    </p>
                  </div>
                </div>
                {/* Notification Types */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-4">
                    {culturalContext === 'hindi' ? 'सूचना प्रकार' : 'Notification Types'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notificationTypes?.map((type) => {
                      const isEnabled = formData?.enabledNotifications?.[type?.id] || false;
                      return (
                        <div key={type?.id} className={`p-4 rounded-lg border transition-ui ${
                          isEnabled 
                            ? 'border-primary bg-primary/5' :'border-border bg-muted/30'
                        }`}>
                          <div className="flex items-start space-x-3">
                            <Icon name={type?.icon} size={20} className={type?.color} />
                            <div className="flex-1">
                              <h5 className="text-sm font-medium text-foreground">{type?.label}</h5>
                              <p className="text-xs text-muted-foreground mt-1">{type?.description}</p>
                              <div className="flex items-center mt-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  isEnabled ? 'bg-success' : 'bg-muted-foreground'
                                }`} />
                                <span className="text-xs text-muted-foreground ml-2">
                                  {isEnabled 
                                    ? (culturalContext === 'hindi' ? 'सक्रिय' : 'Enabled')
                                    : (culturalContext === 'hindi' ? 'निष्क्रिय' : 'Disabled')
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    {culturalContext === 'hindi' ? 'संपादित करें' : 'Edit Preferences'}
                  </Button>
                </div>
              </div>)
            ) : (
              /* Edit Mode */
              (<div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <CheckboxGroup 
                      label={culturalContext === 'hindi' ? 'डिलीवरी विधि' : 'Delivery Methods'}
                      description={culturalContext === 'hindi' ? 'सूचनाएं कैसे प्राप्त करना चाहते हैं' : 'How you want to receive notifications'}
                    >
                      <div className="space-y-2 mt-3">
                        {deliveryMethodOptions?.map((method) => (
                          <Checkbox
                            key={method?.value}
                            label={method?.label}
                            checked={formData?.deliveryMethods?.includes(method?.value) || false}
                            onChange={(e) => handleArrayToggle('deliveryMethods', method?.value)}
                          />
                        ))}
                      </div>
                    </CheckboxGroup>
                  </div>
                  <Select
                    label={culturalContext === 'hindi' ? 'आवृत्ति' : 'Frequency'}
                    description={culturalContext === 'hindi' ? 'कितनी बार सूचनाएं चाहिए' : 'How often you want notifications'}
                    options={frequencyOptions}
                    value={formData?.frequency || ''}
                    onChange={(value) => handleInputChange('frequency', value)}
                    placeholder={culturalContext === 'hindi' ? 'आवृत्ति चुनें' : 'Select frequency'}
                  />
                  <Select
                    label={culturalContext === 'hindi' ? 'भाषा' : 'Language'}
                    description={culturalContext === 'hindi' ? 'सूचनाओं की भाषा' : 'Language for notifications'}
                    options={languageOptions}
                    value={formData?.notificationLanguage || ''}
                    onChange={(value) => handleInputChange('notificationLanguage', value)}
                    placeholder={culturalContext === 'hindi' ? 'भाषा चुनें' : 'Select language'}
                  />
                </div>
                {/* Notification Types */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-4">
                    {culturalContext === 'hindi' ? 'सूचना प्रकार सक्रिय करें' : 'Enable Notification Types'}
                  </h4>
                  <div className="space-y-3">
                    {notificationTypes?.map((type) => (
                      <Checkbox
                        key={type?.id}
                        label={
                          <div className="flex items-center space-x-3">
                            <Icon name={type?.icon} size={16} className={type?.color} />
                            <div>
                              <span className="font-medium">{type?.label}</span>
                              <p className="text-xs text-muted-foreground">{type?.description}</p>
                            </div>
                          </div>
                        }
                        checked={formData?.enabledNotifications?.[type?.id] || false}
                        onChange={(e) => handleNotificationToggle(type?.id, e?.target?.checked)}
                      />
                    ))}
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

export default NotificationPreferencesSection;