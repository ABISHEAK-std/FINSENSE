import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';

import EmotionalHeader from '../../components/ui/EmotionalHeader';
import VoiceAssistantToggle from '../../components/ui/VoiceAssistantToggle';
import CrisisInterventionOverlay from '../../components/ui/CrisisInterventionOverlay';
import CulturalContextIndicator from '../../components/ui/CulturalContextIndicator';

// Import page components
import FestivalCard from './components/FestivalCard';
import FestivalPlanningCard from './components/FestivalPlanningCard';
import Analytics from './components/Analytics';
import CulturalIntelligence from './components/CulturalIntelligence';
import CommunityWisdomPanel from './components/CommunityWisdomPanel';
import TokenBalance from '../../components/ui/TokenBalance';


const CulturalFinancialPlanning = () => {
  const [activeTab, setActiveTab] = useState('festivals');
  const [culturalContext, setCulturalContext] = useState('default');
  const [emotionalState, setEmotionalState] = useState('calm');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showCrisisOverlay, setShowCrisisOverlay] = useState(false);
  const [userRegion, setUserRegion] = useState('north-indian');
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [festivalBudgets, setFestivalBudgets] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Centralized localStorage key
  const STORAGE_KEY = 'festival_budgets_v2';

  // Centralized save function
  const saveFestivalBudgets = (budgets) => {
    try {
      const dataToSave = {
        budgets,
        lastUpdated: new Date().toISOString(),
        version: '2.0'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving festival budgets:', error);
    }
  };

  // Centralized load function
  const loadFestivalBudgets = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Handle different data versions
        if (parsedData.version === '2.0' && parsedData.budgets) {
          return parsedData.budgets;
        } else if (typeof parsedData === 'object' && !parsedData.version) {
          // Legacy format - convert to new format
          return parsedData;
        }
      }
      return {};
    } catch (error) {
      console.error('Error loading festival budgets:', error);
      return {};
    }
  };

  // Initialize default festival data
  const initializeFestivalData = (festivalId, festivalName) => ({
    id: festivalId,
    name: festivalName,
    budgetAllocated: 0,
    expenses: [],
    categories: getAllFestivalsData().find(f => f.id === festivalId)?.categories?.map(c => ({ 
      ...c, 
      budget: 0 
    })) || [],
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    // Load user preferences from localStorage
    const savedLanguage = localStorage.getItem('culturalContext') || 'default';
    const savedRegion = localStorage.getItem('userRegion') || 'north-indian';
    setCulturalContext(savedLanguage);
    setUserRegion(savedRegion);

    // Listen for crisis intervention events
    const handleCrisisEvent = () => setShowCrisisOverlay(true);
    document.addEventListener('triggerCrisisHelp', handleCrisisEvent);

    // Load user profile and festival data
    loadUserProfile();
    
    // Load festival budgets and initialize missing ones
    const loadedBudgets = loadFestivalBudgets();
    const festivals = getAllFestivalsData();
    
    // Ensure all festivals have entries
    const completeBudgets = { ...loadedBudgets };
    festivals.forEach(festival => {
      if (!completeBudgets[festival.id]) {
        completeBudgets[festival.id] = initializeFestivalData(festival.id, festival.name);
      }
    });
    
    setFestivalBudgets(completeBudgets);
    setIsDataLoaded(true);

    return () => {
      document.removeEventListener('triggerCrisisHelp', handleCrisisEvent);
    };
  }, []);

  // Auto-save whenever festivalBudgets changes
  useEffect(() => {
    if (isDataLoaded && Object.keys(festivalBudgets).length > 0) {
      saveFestivalBudgets(festivalBudgets);
    }
  }, [festivalBudgets, isDataLoaded]);

  const loadUserProfile = () => {
    try {
      const savedProfile = localStorage.getItem('finsense_user_profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile({
          salary: profile.salary || 50000,
          region: profile.region || userRegion,
          expenses: profile.expenses || 25000
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleFestivalSelect = (festival) => {
    setSelectedFestival(festival);
    
    // Ensure festival data exists
    if (!festivalBudgets[festival.id]) {
      const newFestivalData = initializeFestivalData(festival.id, festival.name);
      setFestivalBudgets(prev => ({
        ...prev,
        [festival.id]: newFestivalData
      }));
    }
  };

  const handleBudgetUpdate = (festivalId, newBudget, newCategories) => {
    setFestivalBudgets(prev => {
      const currentData = prev[festivalId] || initializeFestivalData(festivalId, 'Unknown Festival');
      
      const updatedData = {
        ...currentData,
        budgetAllocated: typeof newBudget === 'number' ? newBudget : 0,
        categories: Array.isArray(newCategories) 
          ? newCategories.map(cat => ({
              id: cat.id,
              name: cat.name,
              icon: cat.icon,
              budget: typeof cat.budget === 'number' ? cat.budget : 0
            }))
          : currentData.categories,
        lastUpdated: new Date().toISOString()
      };

      return {
        ...prev,
        [festivalId]: updatedData
      };
    });
  };

  const handleExpenseAdd = (festivalId, expense) => {
    if (!expense.amount || !expense.category) {
      console.error('Invalid expense data:', expense);
      return;
    }

    setFestivalBudgets(prev => {
      const currentData = prev[festivalId] || initializeFestivalData(festivalId, 'Unknown Festival');
      
      const newExpense = {
        id: expense.id || Date.now() + Math.random(),
        amount: Number(expense.amount),
        category: expense.category,
        note: expense.note || '',
        date: expense.date || new Date().toISOString(),
        festivalId: festivalId
      };

      const updatedData = {
        ...currentData,
        expenses: [...(currentData.expenses || []), newExpense],
        lastUpdated: new Date().toISOString()
      };

      return {
        ...prev,
        [festivalId]: updatedData
      };
    });
  };

  const handleExpenseDelete = (festivalId, expenseIndex) => {
    setFestivalBudgets(prev => {
      const currentData = prev[festivalId];
      if (!currentData || !currentData.expenses) return prev;

      const updatedData = {
        ...currentData,
        expenses: currentData.expenses.filter((_, index) => index !== expenseIndex),
        lastUpdated: new Date().toISOString()
      };

      return {
        ...prev,
        [festivalId]: updatedData
      };
    });
  };

  // Enhanced expense delete by ID for better reliability
  const handleExpenseDeleteById = (festivalId, expenseId) => {
    setFestivalBudgets(prev => {
      const currentData = prev[festivalId];
      if (!currentData || !currentData.expenses) return prev;

      const updatedData = {
        ...currentData,
        expenses: currentData.expenses.filter(exp => exp.id !== expenseId),
        lastUpdated: new Date().toISOString()
      };

      return {
        ...prev,
        [festivalId]: updatedData
      };
    });
  };

  // Clear all data function for debugging/reset
  const handleClearAllData = () => {
    if (window.confirm(culturalContext === 'hindi' 
      ? 'क्या आप सभी त्योहार डेटा साफ़ करना चाहते हैं?' 
      : 'Are you sure you want to clear all festival data?')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('festival_budgets_enhanced'); // Clear legacy data
      setFestivalBudgets({});
      window.location.reload();
    }
  };

  const getAllFestivalsData = () => [
    // Indian Festivals
    {
      id: 'diwali',
      name: culturalContext === 'hindi' ? 'दिवाली' : 'Diwali',
      date: 'November 2025',
      icon: 'Sparkles',
      colorClass: 'text-amber-500',
      category: 'Indian Festivals',
      description: culturalContext === 'hindi' ? 'रोशनी का त्योहार - धन और समृद्धि का उत्सव' : 'Festival of lights - celebration of wealth and prosperity',
      significance: culturalContext === 'hindi' ? 'लक्ष्मी पूजा और धन की देवी का आशीर्वाद' : 'Lakshmi Puja and blessings of the goddess of wealth',
      traditionTip: culturalContext === 'hindi' ? 'घर की सफाई और दीयों की रोशनी से नकारात्मक ऊर्जा दूर होती है' : 'Cleaning the home and lighting diyas removes negative energy',
      categories: [
        { id: 'decorations', name: culturalContext === 'hindi' ? 'सजावट' : 'Decorations', icon: 'Sparkles', budget: 0 },
        { id: 'gifts', name: culturalContext === 'hindi' ? 'उपहार' : 'Gifts', icon: 'Gift', budget: 0 },
        { id: 'sweets', name: culturalContext === 'hindi' ? 'मिठाई' : 'Sweets', icon: 'Cookie', budget: 0 },
        { id: 'clothes', name: culturalContext === 'hindi' ? 'कपड़े' : 'Clothes', icon: 'Shirt', budget: 0 }
      ]
    },
    {
      id: 'holi',
      name: culturalContext === 'hindi' ? 'होली' : 'Holi',
      date: 'March 2025',
      icon: 'Palette',
      colorClass: 'text-pink-500',
      category: 'Indian Festivals',
      description: culturalContext === 'hindi' ? 'रंगों का त्योहार - खुशी और एकता का उत्सव' : 'Festival of colors - celebration of joy and unity',
      significance: culturalContext === 'hindi' ? 'बुराई पर अच्छाई की जीत और नई शुरुआत' : 'Victory of good over evil and new beginnings',
      traditionTip: culturalContext === 'hindi' ? 'प्राकृतिक रंगों का उपयोग करें और त्वचा की सुरक्षा करें' : 'Use natural colors and protect your skin',
      categories: [
        { id: 'colors', name: culturalContext === 'hindi' ? 'रंग और गुलाल' : 'Colors & Gulal', icon: 'Palette', budget: 0 },
        { id: 'food', name: culturalContext === 'hindi' ? 'खाना-पीना' : 'Food & Drinks', icon: 'Coffee', budget: 0 },
        { id: 'party', name: culturalContext === 'hindi' ? 'पार्टी सामान' : 'Party Supplies', icon: 'Music', budget: 0 }
      ]
    },
    {
      id: 'navratri',
      name: culturalContext === 'hindi' ? 'नवरात्रि' : 'Navratri',
      date: 'October 2025',
      icon: 'Star',
      colorClass: 'text-purple-500',
      category: 'Indian Festivals',
      description: culturalContext === 'hindi' ? 'देवी दुर्गा के नौ दिन का उत्सव' : 'Nine days celebration of Goddess Durga',
      significance: culturalContext === 'hindi' ? 'शक्ति और भक्ति का त्योहार' : 'Festival of power and devotion',
      traditionTip: culturalContext === 'hindi' ? 'हर दिन अलग रंग पहनें और व्रत रखें' : 'Wear different colors each day and observe fasting',
      categories: [
        { id: 'outfits', name: culturalContext === 'hindi' ? 'पारंपरिक कपड़े' : 'Traditional Outfits', icon: 'Shirt', budget: 0 },
        { id: 'dandiya', name: culturalContext === 'hindi' ? 'डांडिया पार्टी' : 'Dandiya Events', icon: 'Music', budget: 0 },
        { id: 'puja', name: culturalContext === 'hindi' ? 'पूजा सामग्री' : 'Puja Items', icon: 'Star', budget: 0 }
      ]
    },
    {
      id: 'eid',
      name: culturalContext === 'hindi' ? 'ईद' : 'Eid',
      date: 'April 2025',
      icon: 'Moon',
      colorClass: 'text-green-500',
      category: 'Indian Festivals',
      description: culturalContext === 'hindi' ? 'खुशी और भाईचारे का त्योहार' : 'Festival of joy and brotherhood',
      significance: culturalContext === 'hindi' ? 'रमजान के बाद खुशी का त्योहार' : 'Celebration after the holy month of Ramadan',
      traditionTip: culturalContext === 'hindi' ? 'गरीबों को दान करें और परिवार के साथ मिलकर मनाएं' : 'Give charity to the poor and celebrate with family',
      categories: [
        { id: 'eid-clothes', name: culturalContext === 'hindi' ? 'ईद के कपड़े' : 'Eid Clothes', icon: 'Shirt', budget: 0 },
        { id: 'eid-feast', name: culturalContext === 'hindi' ? 'ईद का भोजन' : 'Eid Feast', icon: 'Coffee', budget: 0 },
        { id: 'eid-gifts', name: culturalContext === 'hindi' ? 'ईदी और उपहार' : 'Eidi & Gifts', icon: 'Gift', budget: 0 }
      ]
    },
    // International Festivals
    {
      id: 'christmas',
      name: culturalContext === 'hindi' ? 'क्रिसमस' : 'Christmas',
      date: 'December 2025',
      icon: 'Star',
      colorClass: 'text-red-600',
      category: 'International Festivals',
      description: culturalContext === 'hindi' ? 'ईसा मसीह के जन्म का उत्सव' : 'Celebration of Jesus Christ\'s birth',
      significance: culturalContext === 'hindi' ? 'प्रेम और शांति का संदेश' : 'Message of love and peace',
      traditionTip: culturalContext === 'hindi' ? 'पारिवारिक समय बिताएं और दान करें' : 'Spend time with family and give to charity',
      categories: [
        { id: 'christmas-tree', name: culturalContext === 'hindi' ? 'क्रिसमस ट्री' : 'Christmas Tree', icon: 'Star', budget: 0 },
        { id: 'christmas-gifts', name: culturalContext === 'hindi' ? 'उपहार' : 'Gifts', icon: 'Gift', budget: 0 },
        { id: 'christmas-dinner', name: culturalContext === 'hindi' ? 'क्रिसमस डिनर' : 'Christmas Dinner', icon: 'Coffee', budget: 0 }
      ]
    },
    {
      id: 'new-year',
      name: culturalContext === 'hindi' ? 'नव वर्ष' : 'New Year',
      date: 'January 1, 2025',
      icon: 'Calendar',
      colorClass: 'text-blue-600',
      category: 'International Festivals',
      description: culturalContext === 'hindi' ? 'नए साल का स्वागत उत्सव' : 'Welcome celebration of the new year',
      significance: culturalContext === 'hindi' ? 'नई शुरुआत और संकल्पों का समय' : 'Time for new beginnings and resolutions',
      traditionTip: culturalContext === 'hindi' ? 'वित्तीय लक्ष्य बनाएं और बचत की आदत डालें' : 'Set financial goals and develop saving habits',
      categories: [
        { id: 'party-supplies', name: culturalContext === 'hindi' ? 'पार्टी सामान' : 'Party Supplies', icon: 'Music', budget: 0 },
        { id: 'countdown-event', name: culturalContext === 'hindi' ? 'काउंटडाउन इवेंट' : 'Countdown Event', icon: 'Clock', budget: 0 },
        { id: 'resolutions', name: culturalContext === 'hindi' ? 'संकल्प उपहार' : 'Resolution Gifts', icon: 'Target', budget: 0 }
      ]
    }
  ];

  const getFestivalDataForCard = (festival) => {
    if (!festival) return null;
    
    const festivalBudgetData = festivalBudgets[festival.id];
    
    if (festivalBudgetData) {
      return {
        ...festival,
        ...festivalBudgetData,
        // Preserve original festival metadata
        name: festival.name,
        date: festival.date,
        icon: festival.icon,
        colorClass: festival.colorClass,
        description: festival.description,
        category: festival.category,
        significance: festival.significance,
        traditionTip: festival.traditionTip
      };
    }
    
    return {
      ...festival,
      budgetAllocated: 0,
      expenses: [],
      categories: (festival.categories || []).map(c => ({ ...c, budget: 0 }))
    };
  };

  const handleLanguageChange = (newContext) => {
    setCulturalContext(newContext);
    localStorage.setItem('culturalContext', newContext);
  };

  const getTabs = () => {
    if (culturalContext === 'hindi') {
      return [
        { id: 'festivals', label: 'त्योहार योजना', icon: 'Calendar', description: 'त्योहारों के लिए बजट और योजना' },
        { id: 'analytics', label: 'विश्लेषण', icon: 'BarChart', description: 'खर्च के रुझान और रिपोर्ट' },
        { id: 'intelligence', label: 'सांस्कृतिक बुद्धि', icon: 'Brain', description: 'AI सुझाव और सांस्कृतिक अंतर्दृष्टि' },
        { id: 'community', label: 'समुदाय', icon: 'Users', description: 'सामुदायिक सहभागिता और चुनौतियां' }
      ];
    }
    return [
      { id: 'festivals', label: 'Festival Planning', icon: 'Calendar', description: 'Budget and plan for celebrations' },
      { id: 'analytics', label: 'Analytics', icon: 'BarChart', description: 'Spending trends and reports' },
      { id: 'intelligence', label: 'Cultural Intelligence', icon: 'Brain', description: 'AI suggestions and cultural insights' },
      { id: 'community', label: 'Community', icon: 'Users', description: 'Community engagement and challenges' }
    ];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'festivals':
        return (
          <div className="space-y-6">
            {selectedFestival ? (
              <div>
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setSelectedFestival(null)}
                    className="flex items-center text-muted-foreground hover:text-foreground transition-ui mr-4"
                  >
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    {culturalContext === 'hindi' ? 'वापस त्योहारों पर' : 'Back to Festivals'}
                  </button>
                  
                  {/* Debug button - remove in production */}
                  {process.env.NODE_ENV === 'development' && (
                    <button
                      onClick={handleClearAllData}
                      className="ml-auto px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Clear All Data
                    </button>
                  )}
                </div>
                <FestivalPlanningCard
                  festival={getFestivalDataForCard(selectedFestival)}
                  culturalContext={culturalContext}
                  userProfile={userProfile}
                  festivalId={selectedFestival.id}
                  onBudgetUpdate={(newBudget, newCategories) => {
                    handleBudgetUpdate(selectedFestival.id, newBudget, newCategories);
                  }}
                  onExpenseAdd={(expense) =>
                    handleExpenseAdd(selectedFestival.id, expense)
                  }
                  onExpenseDelete={(expenseIndex) =>
                    handleExpenseDelete(selectedFestival.id, expenseIndex)
                  }
                  onExpenseDeleteById={(expenseId) =>
                    handleExpenseDeleteById(selectedFestival.id, expenseId)
                  }
                />
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-heading text-foreground mb-2">
                    {culturalContext === 'hindi' ? 'त्योहार योजना' : 'Festival Planning'}
                  </h2>
                  <p className="text-muted-foreground">
                    {culturalContext === 'hindi' 
                      ? 'अपने पसंदीदा त्योहारों के लिए बजट बनाएं और खर्च को ट्रैक करें'
                      : 'Create budgets for your favorite festivals and track your spending'
                    }
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getAllFestivalsData().map(festival => (
                    <FestivalCard
                      key={festival.id}
                      festival={festival}
                      culturalContext={culturalContext}
                      budgetData={festivalBudgets[festival.id]}
                      onSelect={() => handleFestivalSelect(festival)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <Analytics
            festivalBudgets={festivalBudgets}
            festivals={getAllFestivalsData()}
            culturalContext={culturalContext}
            userProfile={userProfile}
          />
        );

      case 'intelligence':
        return (
          <CulturalIntelligence
            culturalContext={culturalContext}
            userRegion={userRegion}
            userProfile={userProfile}
            festivals={getAllFestivalsData()}
          />
        );

      case 'community':
        return (
          <CommunityWisdomPanel
            culturalContext={culturalContext}
            userRegion={userRegion}
            festivalBudgets={festivalBudgets}
            festivals={getAllFestivalsData()}
          />
        );

      default:
        return null;
    }
  };

  const tabs = getTabs();

  return (
    <div className="min-h-screen bg-background">
      <EmotionalHeader
        emotionalState={emotionalState}
        culturalContext={culturalContext}
        onVoiceToggle={setIsVoiceActive}
        onCrisisHelp={() => setShowCrisisOverlay(true)}
      />
      
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="Calendar" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-3xl font-heading text-foreground">
                  {culturalContext === 'hindi' ? 'सांस्कृतिक वित्तीय योजना' : 'Cultural Financial Planning'}
                </h1>
                <p className="text-muted-foreground">
                  {culturalContext === 'hindi' 
                    ? 'त्योहारों के लिए स्मार्ट बजटिंग और खर्च प्रबंधन' 
                    : 'Smart budgeting and expense management for festivals'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <TokenBalance />
              <CulturalContextIndicator
                culturalContext={culturalContext}
                onContextChange={handleLanguageChange}
                showDetails={true}
              />
              <VoiceAssistantToggle
                isActive={isVoiceActive}
                onToggle={setIsVoiceActive}
                emotionalState={emotionalState}
                culturalContext={culturalContext}
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-ui
                      ${activeTab === tab?.id
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="transition-ui">
            {renderTabContent()}
          </div>
        </div>
      </main>
      
      <CrisisInterventionOverlay
        isVisible={showCrisisOverlay}
        onClose={() => setShowCrisisOverlay(false)}
        emotionalState={emotionalState}
        culturalContext={culturalContext}
        triggerReason="manual"
      />
    </div>
  );
};

export default CulturalFinancialPlanning;