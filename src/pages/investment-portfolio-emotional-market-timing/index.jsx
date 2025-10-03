import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';

import EmotionalHeader from '../../components/ui/EmotionalHeader';
import CrisisInterventionOverlay from '../../components/ui/CrisisInterventionOverlay';
import CulturalContextIndicator from '../../components/ui/CulturalContextIndicator';

// Import new components
import PortfolioSetupWizard from './components/PortfolioSetupWizard';
import PortfolioSummary from './components/PortfolioSummary';
import EmotionalMarketTiming from './components/EmotionalMarketTiming';
import QuickMoodUpdate from './components/QuickMoodUpdate';
import PortfolioUpdate from './components/PortfolioUpdate';
import LiveMarketInsights from './components/LiveMarketInsights';
import marketDataService from '../../utils/marketDataService';
import { getUserPlan, hasAccess, setUserPlan } from '../../utils/BusinessModelConfig';

const InvestmentPortfolioEmotionalMarketTiming = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [culturalContext, setCulturalContext] = useState('default');
  const [emotionalState, setEmotionalState] = useState('calm');
  const [showCrisisOverlay, setShowCrisisOverlay] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showMoodUpdate, setShowMoodUpdate] = useState(false);
  const [showPortfolioUpdate, setShowPortfolioUpdate] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [userId, setUserId] = useState('');
  const [marketInsightsData, setMarketInsightsData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Load user preferences and check for existing portfolio
    loadUserData();
    generateUserId();
    fetchMarketData();
    
    const handleCrisisEvent = () => setShowCrisisOverlay(true);
    document.addEventListener('triggerCrisisHelp', handleCrisisEvent);

    // Start real-time market data updates using the service
    const marketDataInterval = setInterval(fetchLiveMarketData, 30000); // Every 30 seconds
    const recommendationsInterval = setInterval(fetchPersonalizedRecommendations, 300000); // Every 5 minutes
    
    // Initial fetch
    fetchLiveMarketData();
    if (userProfile) {
      fetchPersonalizedRecommendations();
    }

    return () => {
      document.removeEventListener('triggerCrisisHelp', handleCrisisEvent);
      clearInterval(marketDataInterval);
      clearInterval(recommendationsInterval);
    };
  }, [userProfile]);

  const generateUserId = () => {
    let savedUserId = localStorage.getItem('finsense_user_id');
    if (!savedUserId) {
      savedUserId = 'USR' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      localStorage.setItem('finsense_user_id', savedUserId);
    }
    setUserId(savedUserId);
  };

  const loadUserData = () => {
    try {
      const savedLanguage = localStorage.getItem('culturalContext') || 'default';
      setCulturalContext(savedLanguage);

      const savedProfile = localStorage.getItem('finsense_investment_profile');
      const savedPortfolio = localStorage.getItem('finsense_portfolio_data');
      
      if (savedProfile && savedPortfolio) {
        setUserProfile(JSON.parse(savedProfile));
        setPortfolioData(JSON.parse(savedPortfolio));
      } else {
        setShowSetupWizard(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setShowSetupWizard(true);
    }
  };

  const fetchMarketData = async () => {
    try {
      const marketData = await marketDataService.getLiveMarketData();
      
      // Transform for existing components
      const transformedData = {
        marketSentiment: marketData.marketSentiment.overall,
        sentimentScore: marketData.marketSentiment.score,
        marketStatus: marketData.marketStatus.isOpen ? 'open' : 'closed',
        lastUpdated: marketData.lastUpdated,
        indices: {
          nifty: { 
            value: marketData.indices.nifty50.value, 
            change: marketData.indices.nifty50.changePercent 
          },
          sensex: { 
            value: marketData.indices.sensex.value, 
            change: marketData.indices.sensex.changePercent 
          }
        }
      };
      
      setMarketData(transformedData);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const fetchLiveMarketData = async () => {
    try {
      const liveMarketData = await marketDataService.getLiveMarketData();
      setMarketInsightsData(liveMarketData);
    } catch (error) {
      console.error('Error fetching live market data:', error);
      
      // Set fallback data to prevent crashes
      setMarketInsightsData({
        indices: {},
        marketStatus: { isOpen: false, openTime: '9:15 AM', closeTime: '3:30 PM' },
        sectorPerformance: [],
        marketSentiment: { overall: 'neutral', score: 50, vix: 15 },
        lastUpdated: new Date().toISOString(),
        isOffline: true
      });
    }
  };

  const fetchPersonalizedRecommendations = async () => {
    if (!userProfile) return;
    
    try {
      const personalizedRecs = await marketDataService.getPersonalizedRecommendations(userProfile);
      setRecommendations(personalizedRecs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Set empty recommendations to prevent crashes
      setRecommendations({
        mutualFunds: [],
        stocks: [],
        etfs: [],
        bonds: []
      });
    }
  };

  const getMarketStatus = () => {
    return marketDataService.getMarketStatus();
  };

  const handleSetupComplete = (profileData, portfolioData) => {
    setUserProfile(profileData);
    setPortfolioData(portfolioData);
    setShowSetupWizard(false);
    
    // Save to localStorage
    localStorage.setItem('finsense_investment_profile', JSON.stringify(profileData));
    localStorage.setItem('finsense_portfolio_data', JSON.stringify(portfolioData));
  };

  const handleMoodUpdate = (moodData) => {
    const updatedProfile = {
      ...userProfile,
      currentMood: moodData.mood,
      stressLevel: moodData.stress,
      investmentConfidence: moodData.confidence,
      lastMoodUpdate: new Date().toISOString()
    };
    
    setUserProfile(updatedProfile);
    setEmotionalState(getMoodState(moodData.mood));
    localStorage.setItem('finsense_investment_profile', JSON.stringify(updatedProfile));
    setShowMoodUpdate(false);
  };

  const handlePortfolioUpdate = (newInvestment) => {
    const updatedPortfolio = {
      ...portfolioData,
      totalValue: portfolioData.totalValue + newInvestment.amount,
      investments: [...portfolioData.investments, newInvestment],
      lastUpdated: new Date().toISOString()
    };
    
    setPortfolioData(updatedPortfolio);
    localStorage.setItem('finsense_portfolio_data', JSON.stringify(updatedPortfolio));
    setShowPortfolioUpdate(false);
  };

  const getMoodState = (moodScore) => {
    if (moodScore >= 8) return 'positive';
    if (moodScore >= 6) return 'calm';
    if (moodScore >= 4) return 'neutral';
    if (moodScore >= 2) return 'anxious';
    return 'stressed';
  };

  const calculateInvestmentTimingScore = () => {
    if (!userProfile || !marketData) return 50;
    
    const emotionalConfidence = (
      (userProfile.currentMood || 5) * 0.4 +
      (10 - (userProfile.stressLevel || 5)) * 0.3 +
      (userProfile.investmentConfidence || 5) * 0.3
    );
    
    const marketSentiment = marketData.sentimentScore || 50;
    const riskTolerance = userProfile.riskTolerance || 5;
    
    return Math.round(
      emotionalConfidence * 0.5 +
      marketSentiment * 0.3 +
      riskTolerance * 0.2
    );
  };

  const handleLanguageChange = (newContext) => {
    setCulturalContext(newContext);
    localStorage.setItem('culturalContext', newContext);
  };

  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: culturalContext === 'hindi' ? 'अवलोकन' : 'Overview', icon: 'BarChart3' }
    ];

    if (portfolioData && portfolioData.investments?.length > 0) {
      baseTabs.push({ 
        id: 'holdings', 
        label: culturalContext === 'hindi' ? 'होल्डिंग्स' : 'Holdings', 
        icon: 'PieChart' 
      });
    }

    if (userProfile) {
      baseTabs.push({ 
        id: 'market-insights', 
        label: culturalContext === 'hindi' ? 'मार्केट इनसाइट्स' : 'Market Insights', 
        icon: 'TrendingUp' 
      });
    }

    if (portfolioData && portfolioData.investments?.length > 0) {
      baseTabs.push({ 
        id: 'performance', 
        label: culturalContext === 'hindi' ? 'प्रदर्शन' : 'Performance', 
        icon: 'BarChart' 
      });
    }

    return baseTabs;
  };

  const renderTabContent = () => {
    if (!userProfile || !portfolioData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Icon name="Loader" size={48} className="text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">
              {culturalContext === 'hindi' ? 'लोड हो रहा है...' : 'Loading...'}
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PortfolioSummary
                portfolioData={portfolioData}
                userProfile={userProfile}
                culturalContext={culturalContext}
                onAddInvestment={() => setShowPortfolioUpdate(true)}
                onUpdateMood={() => setShowMoodUpdate(true)}
              />
            </div>
            <div>
              <EmotionalMarketTiming
                userProfile={userProfile}
                marketData={marketData}
                culturalContext={culturalContext}
                timingScore={calculateInvestmentTimingScore()}
                onReanalyze={() => setShowMoodUpdate(true)}
              />
            </div>
          </div>
        );

      case 'holdings':
        return (
          <div className="space-y-6">
            <div className="bg-card rounded-xl border p-6">
              <h3 className="text-lg font-heading text-foreground mb-4">
                {culturalContext === 'hindi' ? 'आपकी होल्डिंग्स' : 'Your Holdings'}
              </h3>
              {portfolioData.investments?.map((investment, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg mb-2">
                  <div>
                    <h4 className="font-medium">{investment.type}</h4>
                    <p className="text-sm text-muted-foreground">{investment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{investment.amount.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+₹{Math.floor(investment.amount * 0.08).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'market-insights':
        return (
          <LiveMarketInsights
            userProfile={userProfile}
            marketData={marketInsightsData}
            recommendations={recommendations}
            culturalContext={culturalContext}
            onRefreshData={fetchLiveMarketData}
            onUpdateRecommendations={fetchPersonalizedRecommendations}
          />
        );

      case 'performance':
        // Check if user has access to performance analytics
        if (!hasAccess('performance-analytics')) {
          return (
            <div className="space-y-6">
              {/* Paywall Card */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {culturalContext === 'hindi' ? 'प्रीमियम फीचर' : 'Premium Feature'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {culturalContext === 'hindi' 
                    ? 'प्रीमियम के साथ विस्तृत प्रदर्शन इनसाइट्स अनलॉक करें। उन्नत एनालिटिक्स, निर्यात सुविधाएं, और बहुत कुछ।'
                    : 'Unlock detailed performance insights with Premium. Get advanced analytics, export features, and much more.'
                  }
                </p>
                <div className="bg-white rounded-lg p-4 mb-6 inline-block">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Current Plan</p>
                      <p className="font-bold text-gray-900">FREE</p>
                    </div>
                    <div className="text-2xl">→</div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Upgrade to</p>
                      <p className="font-bold text-purple-600">PREMIUM</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <span>✅</span>
                    <span>{culturalContext === 'hindi' ? 'उन्नत प्रदर्शन मेट्रिक्स' : 'Advanced performance metrics'}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <span>✅</span>
                    <span>{culturalContext === 'hindi' ? 'डेटा निर्यात करें' : 'Export your data'}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <span>✅</span>
                    <span>{culturalContext === 'hindi' ? 'असीमित बजट' : 'Unlimited budgets'}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Mock upgrade action
                    if (window.confirm(culturalContext === 'hindi' 
                      ? 'प्रीमियम में अपग्रेड करें? (डेमो के लिए)' 
                      : 'Upgrade to Premium? (For demo purposes)'
                    )) {
                      setUserPlan('PREMIUM');
                      window.location.reload();
                    }
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                  {culturalContext === 'hindi' ? '₹299/महीना - अभी अपग्रेड करें' : '₹299/month - Upgrade Now'}
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  {culturalContext === 'hindi' ? '7 दिन का निःशुल्क ट्रायल' : '7-day free trial'}
                </p>
              </div>
            </div>
          );
        }

        // Regular performance content for premium users
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-xl">👑</span>
                <span className="font-semibold">Premium Feature Active</span>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-6">
              <h3 className="text-lg font-heading text-foreground mb-4">
                {culturalContext === 'hindi' ? 'प्रदर्शन विश्लेषण' : 'Performance Analysis'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">+₹{Math.floor(portfolioData.totalValue * 0.08).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {culturalContext === 'hindi' ? 'कुल लाभ' : 'Total Gains'}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">8.2%</p>
                  <p className="text-sm text-muted-foreground">
                    {culturalContext === 'hindi' ? 'रिटर्न रेट' : 'Return Rate'}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{portfolioData.investments?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {culturalContext === 'hindi' ? 'निवेश' : 'Investments'}
                  </p>
                </div>
              </div>
              
              {/* Additional Premium Features */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-4">Advanced Analytics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Risk-Adjusted Return</p>
                    <p className="text-xl font-bold text-blue-600">6.8%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Volatility</p>
                    <p className="text-xl font-bold text-orange-600">12.3%</p>
                  </div>
                </div>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  📊 Export Performance Report
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const tabs = getTabs();

  if (showSetupWizard) {
    return (
      <PortfolioSetupWizard
        culturalContext={culturalContext}
        onComplete={handleSetupComplete}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EmotionalHeader
        emotionalState={emotionalState}
        culturalContext={culturalContext}
        onVoiceToggle={() => {}}
        onCrisisHelp={() => setShowCrisisOverlay(true)}
      />
      
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="TrendingUp" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-3xl font-heading text-foreground">
                  {culturalContext === 'hindi' ? 'निवेश पोर्टफोलियो और भावनात्मक मार्केट टाइमिंग' : 'Investment Portfolio & Emotional Market Timing'}
                </h1>
                <p className="text-muted-foreground">
                  {culturalContext === 'hindi' 
                    ? 'भावनात्मक बुद्धिमत्ता के साथ AI-संचालित निवेश सलाह' 
                    : 'AI-powered investment advice with emotional intelligence'}
                </p>
                {userProfile && (
                  <p className="text-sm text-muted-foreground">
                    {culturalContext === 'hindi' 
                      ? `स्वागत है - अंतिम लॉगिन: ${new Date(userProfile.lastMoodUpdate || Date.now()).toLocaleDateString()}`
                      : `Welcome back - Last login: ${new Date(userProfile.lastMoodUpdate || Date.now()).toLocaleDateString()}`
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* User ID Display */}
              <div className="px-3 py-1 bg-muted rounded-full text-xs font-mono">
                {userId}
              </div>
              
              {/* Market Indices - moved to second position */}
              {marketData && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full text-xs">
                  <span className="text-blue-700 font-medium">
                    NIFTY: {marketData.indices?.nifty?.value?.toLocaleString()} 
                    <span className={marketData.indices?.nifty?.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ({marketData.indices?.nifty?.change >= 0 ? '+' : ''}{marketData.indices?.nifty?.change}%)
                    </span>
                  </span>
                </div>
              )}

              {/* Market Status - moved to first position */}
              {marketData && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  marketData.marketStatus === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {marketData.marketStatus === 'open' 
                    ? (culturalContext === 'hindi' ? 'मार्केट ओपन' : 'Market Open')
                    : (culturalContext === 'hindi' ? 'मार्केट बंद' : 'Market Closed')
                  }
                </div>
              )}

              <CulturalContextIndicator
                culturalContext={culturalContext}
                onContextChange={handleLanguageChange}
                showDetails={true}
              />
            </div>
          </div>

          {/* Sub-Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-ui
                      ${activeTab === tab.id
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                      }
                    `}
                  >
                    <Icon name={tab.icon} size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="transition-ui">
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showMoodUpdate && (
        <QuickMoodUpdate
          currentMood={userProfile}
          culturalContext={culturalContext}
          onUpdate={handleMoodUpdate}
          onClose={() => setShowMoodUpdate(false)}
        />
      )}

      {showPortfolioUpdate && (
        <PortfolioUpdate
          culturalContext={culturalContext}
          onUpdate={handlePortfolioUpdate}
          onClose={() => setShowPortfolioUpdate(false)}
        />
      )}
      
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

export default InvestmentPortfolioEmotionalMarketTiming;