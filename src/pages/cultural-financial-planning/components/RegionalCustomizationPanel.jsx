import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegionalCustomizationPanel = ({ 
  currentRegion = 'north-indian',
  onRegionChange,
  culturalContext = 'default',
  className = '' 
}) => {
  const [selectedRegion, setSelectedRegion] = useState(currentRegion);
  const [customizations, setCustomizations] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load regional customizations
    const regionData = getRegionalData(selectedRegion);
    setCustomizations(regionData);
  }, [selectedRegion]);

  const getRegionalData = (region) => {
    const regionalData = {
      'north-indian': {
        name: culturalContext === 'hindi' ? 'उत्तर भारतीय' : 'North Indian',
        festivals: [
          { name: culturalContext === 'hindi' ? 'दिवाली' : 'Diwali', importance: 'high', budgetPercent: 25 },
          { name: culturalContext === 'hindi' ? 'होली' : 'Holi', importance: 'medium', budgetPercent: 15 },
          { name: culturalContext === 'hindi' ? 'दशहरा' : 'Dussehra', importance: 'medium', budgetPercent: 12 },
          { name: culturalContext === 'hindi' ? 'करवा चौथ' : 'Karva Chauth', importance: 'medium', budgetPercent: 10 }
        ],
        investments: [
          { type: 'gold', preference: 'high', description: culturalContext === 'hindi' ? 'सोने की आभूषण और सिक्के' : 'Gold jewelry and coins' },
          { type: 'property', preference: 'high', description: culturalContext === 'hindi' ? 'दिल्ली/गुड़गांव में संपत्ति' : 'Property in Delhi/Gurgaon' },
          { type: 'fd', preference: 'medium', description: culturalContext === 'hindi' ? 'बैंक फिक्स्ड डिपॉजिट' : 'Bank Fixed Deposits' }
        ],
        familyStructure: {
          type: 'joint',
          headRole: culturalContext === 'hindi' ? 'पिता/दादाजी' : 'Father/Grandfather',
          decisionMaking: 'hierarchical',
          contributionPattern: 'income-based'
        },
        culturalColors: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5'],
        traditions: [
          culturalContext === 'hindi' ? 'धनतेरस पर सोना खरीदना' : 'Buying gold on Dhanteras',
          culturalContext === 'hindi' ? 'नए साल में नया व्यापार' : 'Starting new business in New Year',
          culturalContext === 'hindi' ? 'शादी के लिए अलग बचत' : 'Separate savings for weddings'
        ]
      },
      'south-indian': {
        name: culturalContext === 'hindi' ? 'दक्षिण भारतीय' : 'South Indian',
        festivals: [
          { name: 'Diwali', importance: 'high', budgetPercent: 20 },
          { name: 'Onam', importance: 'high', budgetPercent: 18 },
          { name: 'Pongal', importance: 'high', budgetPercent: 15 },
          { name: 'Ugadi', importance: 'medium', budgetPercent: 12 }
        ],
        investments: [
          { type: 'gold', preference: 'very-high', description: 'Temple gold and traditional jewelry' },
          { type: 'property', preference: 'high', description: 'Property in Bangalore/Chennai/Hyderabad' },
          { type: 'education', preference: 'very-high', description: 'Children education fund' }
        ],
        familyStructure: {
          type: 'joint',
          headRole: 'Elder male member',
          decisionMaking: 'consensus',
          contributionPattern: 'equal-share'
        },
        culturalColors: ['#E74C3C', '#F39C12', '#27AE60', '#8E44AD'],
        traditions: [
          'Gold buying during Akshaya Tritiya',
          'Education as primary investment',
          'Temple donations and charity'
        ]
      },
      'bengali': {
        name: culturalContext === 'hindi' ? 'बंगाली' : 'Bengali',
        festivals: [
          { name: 'Durga Puja', importance: 'very-high', budgetPercent: 30 },
          { name: 'Kali Puja', importance: 'high', budgetPercent: 15 },
          { name: 'Poila Boishakh', importance: 'medium', budgetPercent: 12 },
          { name: 'Lakshmi Puja', importance: 'medium', budgetPercent: 10 }
        ],
        investments: [
          { type: 'gold', preference: 'high', description: 'Traditional Bengali gold ornaments' },
          { type: 'property', preference: 'medium', description: 'Property in Kolkata' },
          { type: 'cultural', preference: 'high', description: 'Art and cultural investments' }
        ],
        familyStructure: {
          type: 'joint',
          headRole: 'Eldest family member',
          decisionMaking: 'democratic',
          contributionPattern: 'need-based'
        },
        culturalColors: ['#DC143C', '#FFD700', '#228B22', '#4169E1'],
        traditions: [
          'Community-based financial planning',
          'Cultural event sponsorship',
          'Traditional craft investments'
        ]
      },
      'gujarati': {
        name: culturalContext === 'hindi' ? 'गुजराती' : 'Gujarati',
        festivals: [
          { name: 'Navratri', importance: 'very-high', budgetPercent: 25 },
          { name: 'Diwali', importance: 'very-high', budgetPercent: 22 },
          { name: 'Uttarayan', importance: 'medium', budgetPercent: 8 },
          { name: 'Janmashtami', importance: 'medium', budgetPercent: 10 }
        ],
        investments: [
          { type: 'business', preference: 'very-high', description: 'Business and trading investments' },
          { type: 'gold', preference: 'high', description: 'Gold as security investment' },
          { type: 'stocks', preference: 'high', description: 'Stock market investments' }
        ],
        familyStructure: {
          type: 'business-oriented',
          headRole: 'Business head',
          decisionMaking: 'business-focused',
          contributionPattern: 'profit-sharing'
        },
        culturalColors: ['#FF4500', '#FFD700', '#32CD32', '#1E90FF'],
        traditions: [
          'Business expansion during festivals',
          'Community investment groups',
          'Charity and social responsibility'
        ]
      }
    };

    return regionalData?.[region] || regionalData?.['north-indian'];
  };

  const getRegions = () => [
    { id: 'north-indian', name: culturalContext === 'hindi' ? 'उत्तर भारतीय' : 'North Indian', icon: 'Mountain' },
    { id: 'south-indian', name: culturalContext === 'hindi' ? 'दक्षिण भारतीय' : 'South Indian', icon: 'Palmtree' },
    { id: 'bengali', name: culturalContext === 'hindi' ? 'बंगाली' : 'Bengali', icon: 'Fish' },
    { id: 'gujarati', name: culturalContext === 'hindi' ? 'गुजराती' : 'Gujarati', icon: 'Building' },
    { id: 'punjabi', name: culturalContext === 'hindi' ? 'पंजाबी' : 'Punjabi', icon: 'Wheat' },
    { id: 'marathi', name: culturalContext === 'hindi' ? 'मराठी' : 'Marathi', icon: 'Crown' }
  ];

  const handleRegionSelect = (regionId) => {
    setSelectedRegion(regionId);
    onRegionChange?.(regionId);
  };

  const getImportanceColor = (importance) => {
    const colors = {
      'very-high': 'text-error',
      'high': 'text-warning',
      'medium': 'text-primary',
      'low': 'text-muted-foreground'
    };
    return colors?.[importance] || 'text-muted-foreground';
  };

  const getPreferenceColor = (preference) => {
    const colors = {
      'very-high': 'text-success',
      'high': 'text-primary',
      'medium': 'text-warning',
      'low': 'text-muted-foreground'
    };
    return colors?.[preference] || 'text-muted-foreground';
  };

  return (
    <div className={`glass-card rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading text-foreground">
            {culturalContext === 'hindi' ? 'क्षेत्रीय अनुकूलन' : 'Regional Customization'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' ?'अपनी सांस्कृतिक पृष्ठभूमि के अनुसार वित्तीय योजना को अनुकूलित करें' :'Customize your financial planning based on cultural background'
            }
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconSize={16}
        />
      </div>
      {/* Region Selection */}
      <div className="mb-6">
        <h3 className="text-base font-medium text-foreground mb-3">
          {culturalContext === 'hindi' ? 'अपना क्षेत्र चुनें' : 'Select Your Region'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {getRegions()?.map((region) => (
            <button
              key={region?.id}
              onClick={() => handleRegionSelect(region?.id)}
              className={`
                p-3 rounded-lg border transition-ui text-left
                ${selectedRegion === region?.id
                  ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={region?.icon} size={20} className="mb-2" />
              <p className="text-sm font-medium">{region?.name}</p>
            </button>
          ))}
        </div>
      </div>
      {/* Regional Details */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Festival Priorities */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-3">
              {culturalContext === 'hindi' ? 'त्योहार प्राथमिकताएं' : 'Festival Priorities'}
            </h3>
            <div className="space-y-2">
              {customizations?.festivals?.map((festival, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center space-x-3">
                    <Icon name="Calendar" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{festival?.name}</p>
                      <p className={`text-xs ${getImportanceColor(festival?.importance)}`}>
                        {festival?.importance} priority
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{festival?.budgetPercent}%</p>
                    <p className="text-xs text-muted-foreground">
                      {culturalContext === 'hindi' ? 'बजट' : 'budget'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Preferences */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-3">
              {culturalContext === 'hindi' ? 'निवेश प्राथमिकताएं' : 'Investment Preferences'}
            </h3>
            <div className="space-y-2">
              {customizations?.investments?.map((investment, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground capitalize">
                        {investment?.type}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${getPreferenceColor(investment?.preference)}`}>
                      {investment?.preference} preference
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{investment?.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Family Structure */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-3">
              {culturalContext === 'hindi' ? 'पारिवारिक संरचना' : 'Family Structure'}
            </h3>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {culturalContext === 'hindi' ? 'पारिवारिक प्रकार' : 'Family Type'}
                  </p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {customizations?.familyStructure?.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {culturalContext === 'hindi' ? 'मुखिया की भूमिका' : 'Head Role'}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {customizations?.familyStructure?.headRole}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {culturalContext === 'hindi' ? 'निर्णय प्रक्रिया' : 'Decision Making'}
                  </p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {customizations?.familyStructure?.decisionMaking}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {culturalContext === 'hindi' ? 'योगदान पैटर्न' : 'Contribution Pattern'}
                  </p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {customizations?.familyStructure?.contributionPattern}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cultural Traditions */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-3">
              {culturalContext === 'hindi' ? 'सांस्कृतिक परंपराएं' : 'Cultural Traditions'}
            </h3>
            <div className="space-y-2">
              {customizations?.traditions?.map((tradition, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                  <Icon name="Star" size={16} className="text-primary" />
                  <p className="text-sm text-foreground">{tradition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-3">
              {culturalContext === 'hindi' ? 'सांस्कृतिक रंग पैलेट' : 'Cultural Color Palette'}
            </h3>
            <div className="flex space-x-2">
              {customizations?.culturalColors?.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Apply Customization */}
      <div className="flex space-x-2 mt-6">
        <Button
          variant="default"
          iconName="Check"
          iconPosition="left"
          className="flex-1"
          onClick={() => onRegionChange?.(selectedRegion)}
        >
          {culturalContext === 'hindi' ? 'अनुकूलन लागू करें' : 'Apply Customization'}
        </Button>
        <Button
          variant="outline"
          iconName="RotateCcw"
          iconPosition="left"
          className="flex-1"
        >
          {culturalContext === 'hindi' ? 'रीसेट करें' : 'Reset'}
        </Button>
      </div>
    </div>
  );
};

export default RegionalCustomizationPanel;