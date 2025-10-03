import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const CulturalPreferencesSection = ({ 
  culturalPrefs, 
  onUpdate, 
  isExpanded, 
  onToggle,
  culturalContext = 'default' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(culturalPrefs);

  const regionOptions = [
    { value: 'north_india', label: culturalContext === 'hindi' ? 'उत्तर भारत' : 'North India' },
    { value: 'south_india', label: culturalContext === 'hindi' ? 'दक्षिण भारत' : 'South India' },
    { value: 'west_india', label: culturalContext === 'hindi' ? 'पश्चिम भारत' : 'West India' },
    { value: 'east_india', label: culturalContext === 'hindi' ? 'पूर्व भारत' : 'East India' },
    { value: 'central_india', label: culturalContext === 'hindi' ? 'मध्य भारत' : 'Central India' },
    { value: 'northeast_india', label: culturalContext === 'hindi' ? 'पूर्वोत्तर भारत' : 'Northeast India' }
  ];

  const familyStructureOptions = [
    { value: 'nuclear', label: culturalContext === 'hindi' ? 'एकल परिवार' : 'Nuclear Family' },
    { value: 'joint', label: culturalContext === 'hindi' ? 'संयुक्त परिवार' : 'Joint Family' },
    { value: 'extended', label: culturalContext === 'hindi' ? 'विस्तृत परिवार' : 'Extended Family' },
    { value: 'single', label: culturalContext === 'hindi' ? 'अकेले रहते हैं' : 'Living Alone' }
  ];

  const priorityFestivals = [
    { id: 'diwali', label: culturalContext === 'hindi' ? 'दिवाली' : 'Diwali', icon: 'Sparkles' },
    { id: 'holi', label: culturalContext === 'hindi' ? 'होली' : 'Holi', icon: 'Palette' },
    { id: 'dussehra', label: culturalContext === 'hindi' ? 'दशहरा' : 'Dussehra', icon: 'Crown' },
    { id: 'eid', label: culturalContext === 'hindi' ? 'ईद' : 'Eid', icon: 'Moon' },
    { id: 'christmas', label: culturalContext === 'hindi' ? 'क्रिसमस' : 'Christmas', icon: 'Gift' },
    { id: 'navratri', label: culturalContext === 'hindi' ? 'नवरात्रि' : 'Navratri', icon: 'Music' },
    { id: 'karva_chauth', label: culturalContext === 'hindi' ? 'करवा चौथ' : 'Karva Chauth', icon: 'Heart' },
    { id: 'raksha_bandhan', label: culturalContext === 'hindi' ? 'रक्षा बंधन' : 'Raksha Bandhan', icon: 'Users' }
  ];

  const financialCustoms = [
    { id: 'gold_investment', label: culturalContext === 'hindi' ? 'सोने में निवेश' : 'Gold Investment', icon: 'Coins' },
    { id: 'family_consultation', label: culturalContext === 'hindi' ? 'पारिवारिक सलाह' : 'Family Consultation', icon: 'Users' },
    { id: 'astrological_timing', label: culturalContext === 'hindi' ? 'ज्योतिषीय समय' : 'Astrological Timing', icon: 'Star' },
    { id: 'community_savings', label: culturalContext === 'hindi' ? 'सामुदायिक बचत' : 'Community Savings', icon: 'PiggyBank' },
    { id: 'religious_donations', label: culturalContext === 'hindi' ? 'धार्मिक दान' : 'Religious Donations', icon: 'Heart' },
    { id: 'traditional_investments', label: culturalContext === 'hindi' ? 'पारंपरिक निवेश' : 'Traditional Investments', icon: 'TrendingUp' }
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

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(culturalPrefs);
    setIsEditing(false);
  };

  const getCompletionPercentage = () => {
    const fields = ['region', 'familyStructure', 'priorityFestivals', 'financialCustoms'];
    const completedFields = fields?.filter(field => {
      const value = formData?.[field];
      return value && (Array.isArray(value) ? value?.length > 0 : value?.trim());
    });
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
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Icon name="Globe" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'सांस्कृतिक प्राथमिकताएं' : 'Cultural Preferences'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' 
                ? `${completionPercentage}% पूर्ण • क्षेत्रीय पृष्ठभूमि और पारंपरिक रीति-रिवाज`
                : `${completionPercentage}% Complete • Regional background and traditional customs`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
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
                      {culturalContext === 'hindi' ? 'क्षेत्रीय पृष्ठभूमि' : 'Regional Background'}
                    </label>
                    <p className="text-foreground font-medium">
                      {regionOptions?.find(opt => opt?.value === formData?.region)?.label || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {culturalContext === 'hindi' ? 'पारिवारिक संरचना' : 'Family Structure'}
                    </label>
                    <p className="text-foreground font-medium">
                      {familyStructureOptions?.find(opt => opt?.value === formData?.familyStructure)?.label || 'Not specified'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    {culturalContext === 'hindi' ? 'प्राथमिकता त्योहार' : 'Priority Festivals'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData?.priorityFestivals?.length > 0 ? (
                      formData?.priorityFestivals?.map(festivalId => {
                        const festival = priorityFestivals?.find(f => f?.id === festivalId);
                        return festival ? (
                          <div key={festivalId} className="flex items-center space-x-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
                            <Icon name={festival?.icon} size={14} className="text-amber-600" />
                            <span className="text-sm text-amber-800">{festival?.label}</span>
                          </div>
                        ) : null;
                      })
                    ) : (
                      <p className="text-muted-foreground">No festivals selected</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    {culturalContext === 'hindi' ? 'वित्तीय रीति-रिवाज' : 'Financial Customs'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData?.financialCustoms?.length > 0 ? (
                      formData?.financialCustoms?.map(customId => {
                        const custom = financialCustoms?.find(c => c?.id === customId);
                        return custom ? (
                          <div key={customId} className="flex items-center space-x-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                            <Icon name={custom?.icon} size={14} className="text-primary" />
                            <span className="text-sm text-primary">{custom?.label}</span>
                          </div>
                        ) : null;
                      })
                    ) : (
                      <p className="text-muted-foreground">No customs selected</p>
                    )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label={culturalContext === 'hindi' ? 'क्षेत्रीय पृष्ठभूमि' : 'Regional Background'}
                    description={culturalContext === 'hindi' ? 'आपकी सांस्कृतिक पृष्ठभूमि' : 'Your cultural background'}
                    options={regionOptions}
                    value={formData?.region || ''}
                    onChange={(value) => handleInputChange('region', value)}
                    placeholder={culturalContext === 'hindi' ? 'क्षेत्र चुनें' : 'Select region'}
                  />
                  <Select
                    label={culturalContext === 'hindi' ? 'पारिवारिक संरचना' : 'Family Structure'}
                    description={culturalContext === 'hindi' ? 'आपकी पारिवारिक व्यवस्था' : 'Your family arrangement'}
                    options={familyStructureOptions}
                    value={formData?.familyStructure || ''}
                    onChange={(value) => handleInputChange('familyStructure', value)}
                    placeholder={culturalContext === 'hindi' ? 'संरचना चुनें' : 'Select structure'}
                  />
                </div>
                <div>
                  <CheckboxGroup 
                    label={culturalContext === 'hindi' ? 'प्राथमिकता त्योहार' : 'Priority Festivals'}
                    description={culturalContext === 'hindi' ? 'वे त्योहार जिनके लिए आप वित्तीय योजना बनाना चाहते हैं' : 'Festivals you want to plan financially for'}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {priorityFestivals?.map((festival) => (
                        <Checkbox
                          key={festival?.id}
                          label={
                            <div className="flex items-center space-x-2">
                              <Icon name={festival?.icon} size={16} className="text-muted-foreground" />
                              <span>{festival?.label}</span>
                            </div>
                          }
                          checked={formData?.priorityFestivals?.includes(festival?.id) || false}
                          onChange={(e) => handleArrayToggle('priorityFestivals', festival?.id)}
                        />
                      ))}
                    </div>
                  </CheckboxGroup>
                </div>
                <div>
                  <CheckboxGroup 
                    label={culturalContext === 'hindi' ? 'वित्तीय रीति-रिवाज' : 'Financial Customs'}
                    description={culturalContext === 'hindi' ? 'पारंपरिक वित्तीय प्रथाएं जिनका आप पालन करते हैं' : 'Traditional financial practices you follow'}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {financialCustoms?.map((custom) => (
                        <Checkbox
                          key={custom?.id}
                          label={
                            <div className="flex items-center space-x-2">
                              <Icon name={custom?.icon} size={16} className="text-muted-foreground" />
                              <span>{custom?.label}</span>
                            </div>
                          }
                          checked={formData?.financialCustoms?.includes(custom?.id) || false}
                          onChange={(e) => handleArrayToggle('financialCustoms', custom?.id)}
                        />
                      ))}
                    </div>
                  </CheckboxGroup>
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

export default CulturalPreferencesSection;