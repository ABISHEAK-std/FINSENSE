import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CulturalIntelligence = ({ culturalContext, userRegion, userProfile, festivals }) => {
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [activeInsight, setActiveInsight] = useState('budgeting');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const aiSuggestions = useMemo(() => {
    const monthlyIncome = userProfile?.salary || 50000;
    
    const festivalMultipliers = {
      'diwali': { base: 0.15, regional: { 'north-indian': 1.0, 'south-indian': 0.9, 'west-indian': 1.1 } },
      'holi': { base: 0.08, regional: { 'north-indian': 1.2, 'south-indian': 0.7, 'west-indian': 0.9 } },
      'navratri': { base: 0.12, regional: { 'north-indian': 0.8, 'south-indian': 0.9, 'west-indian': 1.3 } },
      'christmas': { base: 0.10, regional: { 'north-indian': 0.8, 'south-indian': 1.1, 'west-indian': 0.9 } }
    };

    const categoryDistribution = {
      'diwali': { decorations: 0.25, gifts: 0.30, sweets: 0.20, clothes: 0.25 },
      'holi': { colors: 0.20, food: 0.40, party: 0.40 },
      'navratri': { outfits: 0.40, dandiya: 0.35, puja: 0.25 },
      'christmas': { 'christmas-tree': 0.20, 'christmas-gifts': 0.50, 'christmas-dinner': 0.30 }
    };

    return festivals.map(festival => {
      const multiplierData = festivalMultipliers[festival.id] || { base: 0.08, regional: {} };
      const regionalMultiplier = multiplierData.regional[userRegion] || 1.0;
      const suggestedBudget = Math.round(monthlyIncome * multiplierData.base * regionalMultiplier);
      
      const distribution = categoryDistribution[festival.id] || {};
      const suggestedCategories = festival.categories?.map(cat => ({
        ...cat,
        suggestedBudget: Math.round(suggestedBudget * (distribution[cat.id] || 0.25))
      })) || [];

      return {
        ...festival,
        suggestedBudget,
        suggestedCategories,
        confidence: regionalMultiplier === 1.0 ? 'high' : 'medium'
      };
    });
  }, [userProfile, userRegion, festivals]);

  const culturalInsights = {
    'diwali': {
      significance: culturalContext === 'hindi' 
        ? 'दिवाली धन की देवी लक्ष्मी का त्योहार है। इस दिन नए कपड़े, सोना खरीदना शुभ माना जाता है।'
        : 'Diwali celebrates Goddess Lakshmi. Buying new clothes and gold is considered auspicious.',
      budgetTips: culturalContext === 'hindi'
        ? ['मिठाई घर पर बनाएं', 'LED दीयों का उपयोग करें', 'उपहारों की सूची पहले से बनाएं']
        : ['Make sweets at home', 'Use LED diyas', 'Plan gift list in advance'],
      commonExpenses: culturalContext === 'hindi'
        ? ['दीए और मोमबत्तियां', 'रंगोली सामग्री', 'सोने/चांदी के गहने', 'पटाखे']
        : ['Diyas and candles', 'Rangoli materials', 'Gold/silver jewelry', 'Firecrackers']
    },
    'holi': {
      significance: culturalContext === 'hindi'
        ? 'होली रंगों का त्योहार है जो एकता और खुशी का प्रतीक है। प्राकृतिक रंगों का उपयोग स्वास्थ्य के लिए बेहतर है।'
        : 'Holi is the festival of colors symbolizing unity and joy. Natural colors are better for health.',
      budgetTips: culturalContext === 'hindi'
        ? ['प्राकृतिक रंग बनाएं', 'पानी की बचत करें', 'समूह में मनाएं']
        : ['Make natural colors', 'Save water', 'Celebrate in groups'],
      commonExpenses: culturalContext === 'hindi'
        ? ['गुलाल और रंग', 'पिचकारी', 'गुजिया और ठंडाई', 'सफेद कपड़े']
        : ['Gulal and colors', 'Water guns', 'Gujiya and thandai', 'White clothes']
    }
  };

  const regionalInsights = {
    'north-indian': {
      title: culturalContext === 'hindi' ? 'उत्तर भारतीय परंपरा' : 'North Indian Traditions',
      characteristics: culturalContext === 'hindi'
        ? ['भव्य उत्सव', 'महंगे उपहार', 'पारिवारिक समारोह']
        : ['Grand celebrations', 'Expensive gifts', 'Family gatherings'],
      avgSpending: 'High',
      tips: culturalContext === 'hindi'
        ? 'सामुदायिक उत्सव में भाग लें और व्यक्तिगत खर्च कम करें'
        : 'Participate in community celebrations to reduce personal expenses'
    },
    'south-indian': {
      title: culturalContext === 'hindi' ? 'दक्षिण भारतीय परंपरा' : 'South Indian Traditions',
      characteristics: culturalContext === 'hindi'
        ? ['पारंपरिक भोजन', 'सुनहरे गहने', 'धार्मिक अनुष्ठान']
        : ['Traditional food', 'Gold jewelry', 'Religious rituals'],
      avgSpending: 'Medium-High',
      tips: culturalContext === 'hindi'
        ? 'त्योहारी भोजन घर पर बनाएं और सोने की खरीदारी के लिए अलग से बचत करें'
        : 'Prepare festival food at home and save separately for gold purchases'
    }
  };

  const renderAISuggestions = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Brain" size={24} className="text-primary" />
          <h3 className="text-lg font-heading text-foreground">
            {culturalContext === 'hindi' ? 'AI बजट सुझाव' : 'AI Budget Suggestions'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiSuggestions.slice(0, 6).map(festival => (
            <div key={festival.id} className="bg-card rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={festival.icon} size={16} className={festival.colorClass} />
                <span className="font-medium text-foreground text-sm">{festival.name}</span>
                <div className={`px-2 py-1 rounded text-xs ${
                  festival.confidence === 'high' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {festival.confidence === 'high' 
                    ? (culturalContext === 'hindi' ? 'उच्च' : 'High')
                    : (culturalContext === 'hindi' ? 'मध्यम' : 'Med')
                  }
                </div>
              </div>
              <p className="text-lg font-bold text-primary">{formatCurrency(festival.suggestedBudget)}</p>
              <p className="text-xs text-muted-foreground">
                {culturalContext === 'hindi' ? 'आपकी आय का' : 'Of your income'} {
                  ((festival.suggestedBudget / (userProfile.salary || 50000)) * 100).toFixed(1)
                }%
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2"
                onClick={() => setSelectedFestival(festival)}
              >
                {culturalContext === 'hindi' ? 'विस्तार देखें' : 'View Details'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Insights */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="text-lg font-heading text-foreground mb-4">
          {culturalContext === 'hindi' ? 'क्षेत्रीय अंतर्दृष्टि' : 'Regional Insights'}
        </h3>
        
        {regionalInsights[userRegion] && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">
              {regionalInsights[userRegion].title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {culturalContext === 'hindi' ? 'विशेषताएं:' : 'Characteristics:'}
                </p>
                <ul className="text-sm space-y-1">
                  {regionalInsights[userRegion].characteristics.map((char, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={12} className="text-green-500" />
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {culturalContext === 'hindi' ? 'सुझाव:' : 'Tips:'}
                </p>
                <p className="text-sm text-foreground">{regionalInsights[userRegion].tips}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const getCulturalInsights = () => {
    const insights = {
      budgeting: {
        title: culturalContext === 'hindi' ? 'त्योहार बजट रणनीति' : 'Festival Budgeting Strategy',
        icon: 'Target',
        color: 'text-blue-600',
        content: [
          {
            type: 'tip',
            text: culturalContext === 'hindi' 
              ? 'त्योहारों से 2-3 महीने पहले बचत शुरू करें'
              : 'Start saving 2-3 months before major festivals'
          },
          {
            type: 'suggestion',
            text: culturalContext === 'hindi' 
              ? 'हर महीने अपनी आय का 5-10% त्योहार फंड के लिए अलग रखें'
              : 'Allocate 5-10% of monthly income to festival fund'
          }
        ]
      },
      traditions: {
        title: culturalContext === 'hindi' ? 'पारंपरिक ज्ञान' : 'Traditional Wisdom',
        icon: 'Book',
        color: 'text-green-600',
        content: [
          {
            type: 'wisdom',
            text: culturalContext === 'hindi' 
              ? '"त्योहार खुशी के लिए हैं, कर्ज के लिए नहीं" - पुराना भारतीय कहावत'
              : '"Festivals are for joy, not for debt" - Ancient Indian saying'
          },
          {
            type: 'practice',
            text: culturalContext === 'hindi' 
              ? 'समुदायिक उत्सव में भाग लेकर व्यक्तिगत खर्च कम करें'
              : 'Participate in community celebrations to reduce personal expenses'
          }
        ]
      },
      planning: {
        title: culturalContext === 'hindi' ? 'स्मार्ट योजना' : 'Smart Planning',
        icon: 'Brain',
        color: 'text-purple-600',
        content: [
          {
            type: 'strategy',
            text: culturalContext === 'hindi' 
              ? 'पिछले साल के खर्च को देखकर इस साल का बजट बनाएं'
              : 'Review last year\'s expenses to plan this year\'s budget'
          },
          {
            type: 'automation',
            text: culturalContext === 'hindi' 
              ? 'त्योहार फंड के लिए ऑटो-डेबिट सेट करें'
              : 'Set up auto-debit for festival fund'
          }
        ]
      }
    };

    return insights;
  };

  const getRegionalTips = () => {
    const regionalTips = {
      'north-indian': {
        festivals: ['Diwali', 'Holi', 'Karva Chauth'],
        tips: culturalContext === 'hindi' ? [
          'दिवाली के लिए सोना खरीदने से पहले रेट चेक करें',
          'होली के लिए प्राकृतिक रंग का उपयोग करें - सस्ता और सुरक्षित'
        ] : [
          'Check gold rates before Diwali purchases',
          'Use natural colors for Holi - cheaper and safer'
        ]
      },
      'south-indian': {
        festivals: ['Onam', 'Pongal', 'Dussehra'],
        tips: culturalContext === 'hindi' ? [
          'ओणम के लिए सामुदायिक साधव भोज में भाग लें',
          'पोंगल के लिए घर पर मिठाई बनाएं'
        ] : [
          'Participate in community Onam feasts',
          'Make sweets at home for Pongal'
        ]
      }
    };

    return regionalTips[userRegion] || regionalTips['north-indian'];
  };

  const insights = getCulturalInsights();
  const regionalTips = getRegionalTips();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-2">
          {culturalContext === 'hindi' ? 'सांस्कृतिक वित्तीय बुद्धि' : 'Cultural Financial Intelligence'}
        </h2>
        <p className="text-muted-foreground">
          {culturalContext === 'hindi' 
            ? 'AI-संचालित सुझाव और पारंपरिक ज्ञान'
            : 'AI-powered suggestions and traditional wisdom'
          }
        </p>
      </div>

      {/* Insight Categories */}
      <div className="flex space-x-2 overflow-x-auto">
        {Object.entries(insights).map(([key, insight]) => (
          <Button
            key={key}
            variant={activeInsight === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveInsight(key)}
            iconName={insight.icon}
            iconPosition="left"
          >
            {insight.title}
          </Button>
        ))}
      </div>

      {/* Active Insight Content */}
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center ${insights[activeInsight].color}`}>
            <Icon name={insights[activeInsight].icon} size={20} className={insights[activeInsight].color} />
          </div>
          <h3 className="text-lg font-heading text-foreground">
            {insights[activeInsight].title}
          </h3>
        </div>

        <div className="space-y-4">
          {insights[activeInsight].content.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon 
                name={
                  item.type === 'tip' ? 'Lightbulb' :
                  item.type === 'suggestion' ? 'Target' :
                  item.type === 'wisdom' ? 'Quote' :
                  item.type === 'practice' ? 'Users' :
                  item.type === 'strategy' ? 'Strategy' : 'Zap'
                } 
                size={16} 
                className="text-primary mt-1" 
              />
              <p className="text-sm text-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Tips */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="text-lg font-heading text-foreground mb-4 flex items-center">
          <Icon name="MapPin" size={20} className="mr-2 text-secondary" />
          {culturalContext === 'hindi' ? 'आपके क्षेत्र के लिए विशेष सुझाव' : 'Regional Tips for You'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-2">
              {culturalContext === 'hindi' ? 'मुख्य त्योहार:' : 'Major Festivals:'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {regionalTips.festivals.map((festival, index) => (
                <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                  {festival}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">
              {culturalContext === 'hindi' ? 'क्षेत्रीय सुझाव:' : 'Regional Tips:'}
            </h4>
            <div className="space-y-2">
              {regionalTips.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={14} className="text-green-500 mt-0.5" />
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border p-6">
        <h3 className="text-lg font-heading text-foreground mb-4 flex items-center">
          <Icon name="Brain" size={20} className="mr-2 text-primary" />
          {culturalContext === 'hindi' ? 'AI की सिफारिशें' : 'AI Recommendations'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-green-600" />
              <h4 className="font-medium text-foreground">
                {culturalContext === 'hindi' ? 'बचत रणनीति' : 'Savings Strategy'}
              </h4>
            </div>
            <p className="text-sm text-foreground">
              {culturalContext === 'hindi' 
                ? 'आपकी आय के आधार पर, हर महीने ₹2,500 त्योहार फंड में जमा करें।'
                : 'Based on your income, save ₹2,500 monthly for festival fund.'
              }
            </p>
          </div>
          
          <div className="p-4 bg-white/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Calendar" size={16} className="text-blue-600" />
              <h4 className="font-medium text-foreground">
                {culturalContext === 'hindi' ? 'समय योजना' : 'Timing Plan'}
              </h4>
            </div>
            <p className="text-sm text-foreground">
              {culturalContext === 'hindi' 
                ? 'अगले दिवाली तक 8 महीने हैं - अभी से तैयारी शुरू करें।'
                : 'Next Diwali is 8 months away - start preparing now.'
              }
            </p>
          </div>
        </div>
      </div>

      {renderAISuggestions()}

      {/* Festival Details Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading">
                {selectedFestival.name} - {culturalContext === 'hindi' ? 'विस्तृत सुझाव' : 'Detailed Suggestions'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFestival(null)}
                iconName="X"
              />
            </div>
            
            <div className="space-y-6">
              {/* Budget Breakdown */}
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  {culturalContext === 'hindi' ? 'सुझाया गया बजट विभाजन' : 'Suggested Budget Breakdown'}
                </h4>
                <div className="space-y-2">
                  {selectedFestival.suggestedCategories?.map(category => (
                    <div key={category.id} className="flex justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm">{category.name}</span>
                      <span className="text-sm font-medium">{formatCurrency(category.suggestedBudget)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Insights */}
              {culturalInsights[selectedFestival.id] && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    {culturalContext === 'hindi' ? 'सांस्कृतिक जानकारी' : 'Cultural Insights'}
                  </h4>
                  <div className="space-y-3">
                    <p className="text-sm text-foreground">
                      {culturalInsights[selectedFestival.id].significance}
                    </p>
                    
                    <div>
                      <p className="font-medium text-sm mb-2">
                        {culturalContext === 'hindi' ? 'बचत के सुझाव:' : 'Saving Tips:'}
                      </p>
                      <ul className="text-sm space-y-1">
                        {culturalInsights[selectedFestival.id].budgetTips.map((tip, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Icon name="Lightbulb" size={12} className="text-yellow-500" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalIntelligence;
