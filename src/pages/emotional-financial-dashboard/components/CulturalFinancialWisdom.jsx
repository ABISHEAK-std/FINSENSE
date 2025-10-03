import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CulturalFinancialWisdom = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  className = '' 
}) => {
  const [currentWisdom, setCurrentWisdom] = useState(null);
  const [festivalData, setFestivalData] = useState(null);
  const [wisdomCards, setWisdomCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and data fetch
    setIsLoading(true);
    
    setTimeout(() => {
      // Get current date and check for upcoming festivals
      const today = new Date();
      const currentMonth = today?.getMonth();
      const currentDate = today?.getDate();
      
      // Mock festival data
      const festivals = getFestivalData();
      const upcomingFestival = festivals?.find(f => {
        const festivalDate = new Date(today.getFullYear(), f.month, f.date);
        const diffTime = festivalDate?.getTime() - today?.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 30;
      });
      
      setFestivalData(upcomingFestival);
      
      // Set wisdom cards based on cultural context and current situation
      const wisdom = getWisdomCards();
      setWisdomCards(wisdom);
      
      // Set current wisdom based on emotional state
      const currentWisdomData = getCurrentWisdom();
      setCurrentWisdom(currentWisdomData);
      
      setIsLoading(false);
    }, 500);
  }, [culturalContext, emotionalState]);

  const getFestivalData = () => {
    return [
      {
        id: 'diwali',
        name: culturalContext === 'hindi' ? 'दिवाली' : 'Diwali',
        month: 10, // November
        date: 12,
        icon: 'Sparkles',
        color: 'text-amber-500',
        budgetTip: culturalContext === 'hindi' ?'दिवाली की खरीदारी के लिए अलग से बजट बनाएं' :'Create a separate budget for Diwali shopping',
        savingTip: culturalContext === 'hindi' ?'सोना खरीदने से पहले रेट्स की तुलना करें' :'Compare gold rates before making purchases'
      },
      {
        id: 'holi',
        name: culturalContext === 'hindi' ? 'होली' : 'Holi',
        month: 2, // March
        date: 15,
        icon: 'Palette',
        color: 'text-pink-500',
        budgetTip: culturalContext === 'hindi' ?'होली के रंग और मिठाइयों का बजट पहले से तय करें' :'Plan budget for colors and sweets in advance',
        savingTip: culturalContext === 'hindi' ?'घर पर रंग बनाकर पैसे बचाएं' :'Save money by making colors at home'
      },
      {
        id: 'karva-chauth',
        name: culturalContext === 'hindi' ? 'करवा चौथ' : 'Karva Chauth',
        month: 10, // November
        date: 1,
        icon: 'Heart',
        color: 'text-red-500',
        budgetTip: culturalContext === 'hindi' ?'गिफ्ट्स और सरगी की तैयारी के लिए बचत करें' :'Save for gifts and sargi preparations',
        savingTip: culturalContext === 'hindi' ?'पारंपरिक गहने किराए पर लेकर पैसे बचाएं' :'Rent traditional jewelry to save money'
      }
    ];
  };

  const getCurrentWisdom = () => {
    const wisdomByState = {
      'calm': {
        quote: culturalContext === 'hindi' ?'"धैर्य रखने वाले को सब कुछ मिल जाता है।"' : '"Patience is the key to financial prosperity."',
        author: culturalContext === 'hindi' ? 'चाणक्य' : 'Chanakya',
        meaning: culturalContext === 'hindi' ?'धैर्य के साथ निवेश करने से बेहतर रिटर्न मिलता है।' :'Patient investing leads to better returns.',
        icon: 'Heart',
        color: 'text-primary'
      },
      'positive': {
        quote: culturalContext === 'hindi' ?'"जो बचाता है, वो कमाता है।"' : '"A penny saved is a penny earned."',
        author: culturalContext === 'hindi' ? 'भारतीय कहावत' : 'Indian Proverb',
        meaning: culturalContext === 'hindi' ?'बचत करना भी कमाई का एक तरीका है।' :'Saving money is equivalent to earning money.',
        icon: 'Smile',
        color: 'text-success'
      },
      'stressed': {
        quote: culturalContext === 'hindi' ?'"संकट के समय धैर्य ही सबसे बड़ा धन है।"' : '"In times of crisis, patience is the greatest wealth."',
        author: culturalContext === 'hindi' ? 'महात्मा गांधी' : 'Mahatma Gandhi',
        meaning: culturalContext === 'hindi' ?'वित्तीय तनाव में शांति से सोचना जरूरी है।' :'Financial stress requires calm thinking and planning.',
        icon: 'Shield',
        color: 'text-warning'
      },
      'anxious': {
        quote: culturalContext === 'hindi' ?'"छोटी-छोटी बूंदों से सागर भरता है।"' : '"Small drops make the mighty ocean."',
        author: culturalContext === 'hindi' ? 'तुलसीदास' : 'Tulsidas',
        meaning: culturalContext === 'hindi' ?'छोटी बचत भी बड़ी संपत्ति बन सकती है।' :'Small savings can build substantial wealth over time.',
        icon: 'Droplets',
        color: 'text-primary'
      }
    };
    
    return wisdomByState?.[emotionalState] || wisdomByState?.['calm'];
  };

  const getWisdomCards = () => {
    const cards = [
      {
        id: 1,
        title: culturalContext === 'hindi' ? 'आपातकालीन फंड' : 'Emergency Fund',
        description: culturalContext === 'hindi' ?'6 महीने का खर्च आपातकाल के लिए अलग रखें' :'Keep 6 months of expenses for emergencies',
        icon: 'Shield',
        color: 'text-blue-500',
        category: 'saving'
      },
      {
        id: 2,
        title: culturalContext === 'hindi' ? 'SIP निवेश' : 'SIP Investment',
        description: culturalContext === 'hindi' ?'हर महीने नियमित राशि का निवेश करें' :'Invest a fixed amount regularly every month',
        icon: 'TrendingUp',
        color: 'text-green-500',
        category: 'investment'
      },
      {
        id: 3,
        title: culturalContext === 'hindi' ? '50-30-20 नियम' : '50-30-20 Rule',
        description: culturalContext === 'hindi' ?'50% जरूरत, 30% इच्छा, 20% बचत में बांटें' :'Divide income: 50% needs, 30% wants, 20% savings',
        icon: 'PieChart',
        color: 'text-purple-500',
        category: 'budgeting'
      },
      {
        id: 4,
        title: culturalContext === 'hindi' ? 'कर्ज से मुक्ति' : 'Debt Freedom',
        description: culturalContext === 'hindi' ?'उच्च ब्याज वाले कर्ज पहले चुकताएं' :'Pay off high-interest debts first',
        icon: 'CreditCard',
        color: 'text-red-500',
        category: 'debt'
      }
    ];
    
    return cards;
  };

  if (isLoading) {
    return (
      <div className={`glass-card rounded-2xl p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="h-20 bg-muted rounded" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)]?.map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl p-6 transition-emotional ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading text-foreground">
            {culturalContext === 'hindi' ? 'वित्तीय ज्ञान' : 'Financial Wisdom'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' ? 'पारंपरिक और आधुनिक सलाह' : 'Traditional & modern advice'}
          </p>
        </div>
        <Icon name="BookOpen" size={20} className="text-primary" />
      </div>
      {/* Festival Alert */}
      {festivalData && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <div className="flex items-start space-x-3">
            <Icon name={festivalData?.icon} size={20} className={festivalData?.color} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800 mb-1">
                {festivalData?.name} {culturalContext === 'hindi' ? 'आ रहा है!' : 'is coming!'}
              </h3>
              <p className="text-xs text-amber-700 mb-2">
                {festivalData?.budgetTip}
              </p>
              <p className="text-xs text-amber-600">
                💡 {festivalData?.savingTip}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Daily Wisdom Quote */}
      {currentWisdom && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
          <div className="flex items-start space-x-3">
            <Icon name={currentWisdom?.icon} size={20} className={currentWisdom?.color} />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-2">
                {currentWisdom?.quote}
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                - {currentWisdom?.author}
              </p>
              <p className="text-xs text-primary/80">
                {currentWisdom?.meaning}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Wisdom Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {wisdomCards?.map((card) => (
          <div
            key={card?.id}
            className="p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-ui cursor-pointer group"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={card?.icon} size={16} className={card?.color} />
              <span className="text-xs font-medium text-foreground">
                {card?.title}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {card?.description}
            </p>
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-ui">
              <Icon name="ArrowRight" size={12} className="text-primary" />
            </div>
          </div>
        ))}
      </div>
      {/* Cultural Financial Tips */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          {culturalContext === 'hindi' ? 'आज के सुझाव' : 'Today\'s Tips'}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/20 transition-ui">
            <Icon name="Lightbulb" size={14} className="text-warning mt-0.5" />
            <p className="text-xs text-muted-foreground">
              {culturalContext === 'hindi' ?'महंगाई के समय में अपने खर्चों की समीक्षा करें और अनावश्यक खर्चे कम करें।' :'Review your expenses during inflation and cut unnecessary spending.'
              }
            </p>
          </div>
          
          <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/20 transition-ui">
            <Icon name="Target" size={14} className="text-success mt-0.5" />
            <p className="text-xs text-muted-foreground">
              {culturalContext === 'hindi' ?'अपने वित्तीय लक्ष्यों को छोटे हिस्सों में बांटकर आसान बनाएं।' :'Break down your financial goals into smaller, achievable milestones.'
              }
            </p>
          </div>
          
          <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/20 transition-ui">
            <Icon name="Users" size={14} className="text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground">
              {culturalContext === 'hindi' ?'परिवार के साथ वित्तीय योजना पर चर्चा करें और सभी को शामिल करें।' :'Discuss financial planning with family and involve everyone in decisions.'
              }
            </p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/20">
        <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-ui">
          <Icon name="BookMarked" size={16} />
          <span>
            {culturalContext === 'hindi' ? 'और पढ़ें' : 'Read More'}
          </span>
        </button>
        
        <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-ui">
          <Icon name="Share" size={16} />
          <span>
            {culturalContext === 'hindi' ? 'साझा करें' : 'Share Wisdom'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CulturalFinancialWisdom;