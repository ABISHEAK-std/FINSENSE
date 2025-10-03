import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const PersonalInfoSection = ({ 
  personalInfo, 
  onUpdate, 
  isExpanded, 
  onToggle,
  culturalContext = 'default' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(personalInfo);
  const [errors, setErrors] = useState({});

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी (Hindi)' },
    { value: 'tamil', label: 'தமிழ் (Tamil)' },
    { value: 'bengali', label: 'বাংলা (Bengali)' },
    { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' },
    { value: 'marathi', label: 'मराठी (Marathi)' },
    { value: 'telugu', label: 'తెలుగు (Telugu)' },
    { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)' }
  ];

  const genderOptions = [
    { value: 'male', label: culturalContext === 'hindi' ? 'पुरुष' : 'Male' },
    { value: 'female', label: culturalContext === 'hindi' ? 'महिला' : 'Female' },
    { value: 'other', label: culturalContext === 'hindi' ? 'अन्य' : 'Other' },
    { value: 'prefer_not_to_say', label: culturalContext === 'hindi' ? 'नहीं बताना चाहते' : 'Prefer not to say' }
  ];

  const occupationOptions = [
    { value: 'software_engineer', label: culturalContext === 'hindi' ? 'सॉफ्टवेयर इंजीनियर' : 'Software Engineer' },
    { value: 'business_owner', label: culturalContext === 'hindi' ? 'व्यापारी' : 'Business Owner' },
    { value: 'doctor', label: culturalContext === 'hindi' ? 'डॉक्टर' : 'Doctor' },
    { value: 'teacher', label: culturalContext === 'hindi' ? 'शिक्षक' : 'Teacher' },
    { value: 'banker', label: culturalContext === 'hindi' ? 'बैंकर' : 'Banker' },
    { value: 'consultant', label: culturalContext === 'hindi' ? 'सलाहकार' : 'Consultant' },
    { value: 'student', label: culturalContext === 'hindi' ? 'छात्र' : 'Student' },
    { value: 'other', label: culturalContext === 'hindi' ? 'अन्य' : 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = culturalContext === 'hindi' ? 'नाम आवश्यक है' : 'Full name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = culturalContext === 'hindi' ? 'ईमेल आवश्यक है' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = culturalContext === 'hindi' ? 'वैध ईमेल दर्ज करें' : 'Please enter a valid email';
    }
    
    if (!formData?.phone?.trim()) {
      newErrors.phone = culturalContext === 'hindi' ? 'फोन नंबर आवश्यक है' : 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/?.test(formData?.phone)) {
      newErrors.phone = culturalContext === 'hindi' ? 'वैध फोन नंबर दर्ज करें' : 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdate(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(personalInfo);
    setErrors({});
    setIsEditing(false);
  };

  const getCompletionPercentage = () => {
    const fields = ['fullName', 'email', 'phone', 'dateOfBirth', 'gender', 'occupation', 'primaryLanguage'];
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
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' 
                ? `${completionPercentage}% पूर्ण • बुनियादी विवरण और भाषा प्राथमिकताएं`
                : `${completionPercentage}% Complete • Basic details and language preferences`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Completion Indicator */}
          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
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
              (<div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {culturalContext === 'hindi' ? 'पूरा नाम' : 'Full Name'}
                      </label>
                      <p className="text-foreground font-medium">{formData?.fullName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {culturalContext === 'hindi' ? 'ईमेल' : 'Email'}
                      </label>
                      <p className="text-foreground">{formData?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {culturalContext === 'hindi' ? 'फोन नंबर' : 'Phone Number'}
                      </label>
                      <p className="text-foreground">{formData?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {culturalContext === 'hindi' ? 'जन्म तिथि' : 'Date of Birth'}
                      </label>
                      <p className="text-foreground">{formData?.dateOfBirth || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {culturalContext === 'hindi' ? 'लिंग' : 'Gender'}
                      </label>
                      <p className="text-foreground">
                        {genderOptions?.find(opt => opt?.value === formData?.gender)?.label || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {culturalContext === 'hindi' ? 'व्यवसाय' : 'Occupation'}
                      </label>
                      <p className="text-foreground">
                        {occupationOptions?.find(opt => opt?.value === formData?.occupation)?.label || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {culturalContext === 'hindi' ? 'प्राथमिक भाषा' : 'Primary Language'}
                  </label>
                  <p className="text-foreground">
                    {languageOptions?.find(opt => opt?.value === formData?.primaryLanguage)?.label || 'Not provided'}
                  </p>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    {culturalContext === 'hindi' ? 'संपादित करें' : 'Edit Information'}
                  </Button>
                </div>
              </div>)
            ) : (
              /* Edit Mode */
              (<div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Input
                      label={culturalContext === 'hindi' ? 'पूरा नाम' : 'Full Name'}
                      type="text"
                      placeholder={culturalContext === 'hindi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                      value={formData?.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e?.target?.value)}
                      error={errors?.fullName}
                      required
                    />
                    <Input
                      label={culturalContext === 'hindi' ? 'ईमेल पता' : 'Email Address'}
                      type="email"
                      placeholder={culturalContext === 'hindi' ? 'आपका ईमेल पता' : 'Your email address'}
                      value={formData?.email || ''}
                      onChange={(e) => handleInputChange('email', e?.target?.value)}
                      error={errors?.email}
                      required
                    />
                    <Input
                      label={culturalContext === 'hindi' ? 'फोन नंबर' : 'Phone Number'}
                      type="tel"
                      placeholder={culturalContext === 'hindi' ? '+91 98765 43210' : '+91 98765 43210'}
                      value={formData?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e?.target?.value)}
                      error={errors?.phone}
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <Input
                      label={culturalContext === 'hindi' ? 'जन्म तिथि' : 'Date of Birth'}
                      type="date"
                      value={formData?.dateOfBirth || ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
                    />
                    <Select
                      label={culturalContext === 'hindi' ? 'लिंग' : 'Gender'}
                      options={genderOptions}
                      value={formData?.gender || ''}
                      onChange={(value) => handleInputChange('gender', value)}
                      placeholder={culturalContext === 'hindi' ? 'लिंग चुनें' : 'Select gender'}
                    />
                    <Select
                      label={culturalContext === 'hindi' ? 'व्यवसाय' : 'Occupation'}
                      options={occupationOptions}
                      value={formData?.occupation || ''}
                      onChange={(value) => handleInputChange('occupation', value)}
                      placeholder={culturalContext === 'hindi' ? 'व्यवसाय चुनें' : 'Select occupation'}
                    />
                  </div>
                </div>
                <Select
                  label={culturalContext === 'hindi' ? 'प्राथमिक भाषा' : 'Primary Language'}
                  description={culturalContext === 'hindi' ? 'AI सहायक इस भाषा में आपसे बात करेगा' : 'AI assistant will communicate in this language'}
                  options={languageOptions}
                  value={formData?.primaryLanguage || ''}
                  onChange={(value) => handleInputChange('primaryLanguage', value)}
                  placeholder={culturalContext === 'hindi' ? 'भाषा चुनें' : 'Select language'}
                />
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

export default PersonalInfoSection;