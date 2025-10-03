import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const CulturalContextIndicator = ({ 
  culturalContext = 'default',
  onContextChange,
  showDetails = false,
  className = '' 
}) => {
  const [currentFestival, setCurrentFestival] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [financialTips, setFinancialTips] = useState([]);

  useEffect(() => {
    // Get current date and check for festivals/events
    const today = new Date();
    const currentMonth = today?.getMonth();
    const currentDate = today?.getDate();
    
    // Mock festival data - in real app, this would come from an API
    const festivals = getFestivalData();
    const currentFest = festivals?.find(f => 
      f?.month === currentMonth && 
      Math.abs(f?.date - currentDate) <= 3
    );
    
    setCurrentFestival(currentFest);
    
    // Get upcoming events in next 30 days
    const upcoming = festivals?.filter(f => {
      const festivalDate = new Date(today.getFullYear(), f.month, f.date);
      const diffTime = festivalDate?.getTime() - today?.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 30;
    });
    
    setUpcomingEvents(upcoming?.slice(0, 3));
    
    // Set contextual financial tips
    if (currentFest) {
      setFinancialTips(getFestivalFinancialTips(currentFest?.id, culturalContext));
    } else {
      setFinancialTips(getGeneralFinancialTips(culturalContext));
    }
  }, [culturalContext]);

  const getFestivalData = () => {
    return [
      {
        id: 'diwali',
        name: culturalContext === 'hindi' ? 'दिवाली' : 'Diwali',
        month: 10, // November
        date: 12,
        icon: 'Sparkles',
        color: 'text-amber-500',
        significance: culturalContext === 'hindi' ?'धन और समृद्धि का त्योहार' :'Festival of wealth and prosperity'
      },
      {
        id: 'holi',
        name: culturalContext === 'hindi' ? 'होली' : 'Holi',
        month: 2, // March
        date: 15,
        icon: 'Palette',
        color: 'text-pink-500',
        significance: culturalContext === 'hindi' ?'नई शुरुआत का त्योहार' :'Festival of new beginnings'
      },
      {
        id: 'dussehra',
        name: culturalContext === 'hindi' ? 'दशहरा' : 'Dussehra',
        month: 9, // October
        date: 22,
        icon: 'Crown',
        color: 'text-orange-500',
        significance: culturalContext === 'hindi' ?'बुराई पर अच्छाई की जीत' :'Victory of good over evil'
      },
      {
        id: 'karva-chauth',
        name: culturalContext === 'hindi' ? 'करवा चौथ' : 'Karva Chauth',
        month: 10, // November
        date: 1,
        icon: 'Heart',
        color: 'text-red-500',
        significance: culturalContext === 'hindi' ?'पारिवारिक बंधन का त्योहार' :'Festival of family bonds'
      },
      {
        id: 'dhanteras',
        name: culturalContext === 'hindi' ? 'धनतेरस' : 'Dhanteras',
        month: 10, // November
        date: 10,
        icon: 'Coins',
        color: 'text-yellow-500',
        significance: culturalContext === 'hindi' ?'धन की देवी लक्ष्मी का दिन' :'Day of Goddess Lakshmi'
      }
    ];
  };

  const getFestivalFinancialTips = (festivalId, context) => {
    const tips = {
      diwali: context === 'hindi' ? [
        'दिवाली की खरीदारी के लिए बजट बनाएं',
        'सोना खरीदने से पहले रेट्स चेक करें',
        'गिफ्ट्स के लिए अलग से पैसे रखें'
      ] : [
        'Set a budget for Diwali shopping',
        'Check gold rates before purchasing',
        'Keep separate funds for gifts'
      ],
      dhanteras: context === 'hindi' ? [
        'धनतेरस पर निवेश करने का शुभ समय',
        'सोना या चांदी खरीदने का दिन',
        'नए निवेश की शुरुआत करें'
      ] : [
        'Auspicious time for investments',
        'Good day to buy gold or silver',
        'Start new investment plans'
      ]
    };
    
    return tips?.[festivalId] || tips?.diwali;
  };

  const getGeneralFinancialTips = (context) => {
    return context === 'hindi' ? [
      'महीने की शुरुआत में बजट बनाएं',
      'आपातकालीन फंड बनाए रखें',
      'नियमित निवेश करते रहें'
    ] : [
      'Create monthly budget at start',
      'Maintain emergency fund',
      'Continue regular investments'
    ];
  };

  const getCulturalLanguages = () => {
    return [
      { code: 'default', name: 'English', flag: '🇮🇳' },
      { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
      { code: 'tamil', name: 'தமிழ்', flag: '🇮🇳' },
      { code: 'bengali', name: 'বাংলা', flag: '🇮🇳' },
      { code: 'gujarati', name: 'ગુજરાતી', flag: '🇮🇳' }
    ];
  };

  const languages = getCulturalLanguages();
  const currentLanguage = languages?.find(lang => lang?.code === culturalContext) || languages?.[0];

  const handleLanguageChange = (langCode) => {
    onContextChange?.(langCode);
    setIsExpanded(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Indicator */}
      <div className="flex items-center space-x-2">
        {/* Current Festival Indicator */}
        {currentFestival && (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
            <Icon 
              name={currentFestival?.icon} 
              size={16} 
              className={currentFestival?.color} 
            />
            <span className="text-sm font-medium text-amber-800">
              {currentFestival?.name}
            </span>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          </div>
        )}

        {/* Language Selector */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-1 rounded-full bg-muted/50 hover:bg-muted"
          >
            <span className="text-lg">{currentLanguage?.flag}</span>
            <span className="text-sm font-medium">{currentLanguage?.name}</span>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={14} 
              className="text-muted-foreground" 
            />
          </Button>

          {/* Language Dropdown */}
          {isExpanded && (
            <div className="absolute top-full right-0 mt-2 w-48 glass-card rounded-lg shadow-soft border z-20">
              <div className="p-2">
                {languages?.map((lang) => (
                  <button
                    key={lang?.code}
                    onClick={() => handleLanguageChange(lang?.code)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-ui
                      ${lang?.code === culturalContext 
                        ? 'bg-primary/10 text-primary' :'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <span className="text-lg">{lang?.flag}</span>
                    <span className="text-sm font-medium">{lang?.name}</span>
                    {lang?.code === culturalContext && (
                      <Icon name="Check" size={14} className="ml-auto text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Detailed Panel */}
      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-80 glass-card rounded-xl shadow-soft border z-10">
          <div className="p-4">
            {/* Current Festival Details */}
            {currentFestival && (
              <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Icon 
                    name={currentFestival?.icon} 
                    size={20} 
                    className={currentFestival?.color} 
                  />
                  <div>
                    <h3 className="font-medium text-amber-800">{currentFestival?.name}</h3>
                    <p className="text-xs text-amber-600">{currentFestival?.significance}</p>
                  </div>
                </div>
                
                {/* Festival Financial Tips */}
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-amber-700 mb-1">
                    {culturalContext === 'hindi' ? 'वित्तीय सुझाव:' : 'Financial Tips:'}
                  </h4>
                  {financialTips?.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Icon name="Lightbulb" size={12} className="text-amber-500 mt-0.5" />
                      <p className="text-xs text-amber-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            

           
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalContextIndicator;