import React, { useState, useEffect } from 'react';
import EmotionalHeader from '../../components/ui/EmotionalHeader';
import VoiceAssistantToggle from '../../components/ui/VoiceAssistantToggle';
import CrisisInterventionOverlay from '../../components/ui/CrisisInterventionOverlay';
import CulturalContextIndicator from '../../components/ui/CulturalContextIndicator';
import UserOnboardingModal from '../../components/ui/UserOnboardingModal';
import ICPAccountSetup from '../../components/ui/ICPAccountSetup';
import FinancialEmotionalScore from './components/FinancialEmotionalScore';
import BasicDetailsBar from './components/BasicDetailsBar';
import NetWorthSummary from './components/NetWorthSummary';
import RecentTransactions from './components/RecentTransactions';
import UpcomingBills from './components/UpcomingBills';
import CulturalFinancialWisdom from './components/CulturalFinancialWisdom';
import QuickActionButtons from './components/QuickActionButtons';
import EmotionalStateSidebar from './components/EmotionalStateSidebar';
import { chatService } from '../../services/ChatService';
import { financialDataService } from '../../services/FinancialDataService';
import { hasICPAccount, isAuthenticated } from '../../ic/auth';
import TokenBalanceCard from '../../components/ui/TokenBalanceCard';
import TokenBalance from '../../components/ui/TokenBalance';


const EmotionalFinancialDashboard = () => {
  const [emotionalState, setEmotionalState] = useState('calm');
  const [culturalContext, setCulturalContext] = useState('default');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showCrisisOverlay, setShowCrisisOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showICPAccountSetup, setShowICPAccountSetup] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isICPAuthenticated, setIsICPAuthenticated] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [transactionRefreshTrigger, setTransactionRefreshTrigger] = useState(0);

  useEffect(() => {
    const initializeDashboard = async () => {
      // Load saved preferences from localStorage
      const savedLanguage = localStorage.getItem('culturalContext') || 'default';
      const savedEmotionalState = localStorage.getItem('emotionalState') || 'calm';
      
      setCulturalContext(savedLanguage);
      setEmotionalState(savedEmotionalState);
      
      // Check ICP authentication status
      try {
        const authenticated = await isAuthenticated();
        setIsICPAuthenticated(authenticated);
        
        if (authenticated) {
          console.log('User is authenticated with ICP');
          // Check if user profile exists
          const profile = await chatService.getUserData();
          if (profile && profile.length > 0 && profile[0].name) {
            setUserProfile(profile[0]);
            console.log('User profile loaded from ICP:', profile[0]);
          } else {
            // Show onboarding if no profile exists
            setShowOnboarding(true);
          }
        } else {
          // Check if user has an ICP account
          const hasAccount = hasICPAccount();
          if (hasAccount) {
            // User has ICP account but not authenticated, show login prompt
            console.log('User has ICP account but not authenticated');
          } else {
            // Show ICP account setup
            setShowICPAccountSetup(true);
          }
        }
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        // Show ICP account setup on error
        setShowICPAccountSetup(true);
      }
      
      // Simulate initial loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    initializeDashboard();

    // Listen for crisis intervention events
    const handleCrisisEvent = () => {
      setShowCrisisOverlay(true);
    };

    document.addEventListener('triggerCrisisHelp', handleCrisisEvent);
    
    // Listen for ICP login success
    const handleICPLoginSuccess = async (event) => {
      console.log('ICP login success event received:', event.detail);
      setIsICPAuthenticated(true);
      
      // Check if user has profile data
      try {
        const profile = await chatService.getUserData();
        if (profile && profile.length > 0 && profile[0].name) {
          setUserProfile(profile[0]);
          console.log('User profile loaded after ICP login:', profile[0]);
        } else {
          // Show onboarding to collect user data
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to load user profile after ICP login:', error);
        setShowOnboarding(true);
      }
    };
    
    // Listen for transaction updates
    const handleTransactionUpdate = () => {
      console.log('Transaction update event received');
      setTransactionRefreshTrigger(prev => prev + 1);
    };
    
    document.addEventListener('icp-login-success', handleICPLoginSuccess);
    document.addEventListener('transaction-updated', handleTransactionUpdate);
    
    // Simulate emotional state detection (in real app, this would come from AI analysis)
    const emotionalStateInterval = setInterval(() => {
      // Mock emotional state changes based on time and user activity
      const hour = new Date()?.getHours();
      let newState = 'calm';
      
      if (hour >= 9 && hour <= 11) {
        newState = 'positive'; // Morning productivity
      } else if (hour >= 12 && hour <= 14) {
        newState = 'stressed'; // Lunch time stress
      } else if (hour >= 18 && hour <= 20) {
        newState = 'calm'; // Evening relaxation
      }
      
      if (newState !== emotionalState) {
        setEmotionalState(newState);
        localStorage.setItem('emotionalState', newState);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      document.removeEventListener('triggerCrisisHelp', handleCrisisEvent);
      document.removeEventListener('icp-login-success', handleICPLoginSuccess);
      document.removeEventListener('transaction-updated', handleTransactionUpdate);
      clearInterval(emotionalStateInterval);
    };
  }, [emotionalState]);

  const handleVoiceToggle = (isActive) => {
    setIsVoiceActive(isActive);
  };

  const handleCrisisHelp = () => {
    setShowCrisisOverlay(true);
  };

  const handleCulturalContextChange = (newContext) => {
    setCulturalContext(newContext);
    localStorage.setItem('culturalContext', newContext);
  };

  const handleSaveUserProfile = async (profileData) => {
    try {
      // Map onboarding fields to backend schema
      const payload = {
        name: profileData?.name,
        riskTolerance: profileData?.riskTolerance,
        savings: profileData?.savings,
        debt: profileData?.debt,
        country: profileData?.country,
        language: profileData?.language,
        lifeStage: profileData?.lifeStage,
        goals: profileData?.goals
      };

      console.log('Saving user profile payload:', payload);
      const savedProfile = await chatService.updateUserProfile(payload);
      console.log('Profile saved response:', savedProfile);
      
      // Immediately pull normalized profile (arrays) for UI consistency
      try {
        const latest = await chatService.getUserData();
        console.log('Latest user data retrieved:', latest);
        if (latest && latest.length > 0) {
          setUserProfile(latest[0]);
          console.log('User profile updated in state:', latest[0]);
        } else {
          setUserProfile(savedProfile);
          console.log('Using saved profile as fallback:', savedProfile);
        }
      } catch (error) {
        console.error('Error fetching latest user data:', error);
        setUserProfile(savedProfile);
      }
      
      setShowOnboarding(false);
      
      // Update financial data with onboarding values
      if (payload.savings !== undefined && payload.debt !== undefined) {
        financialDataService.forceReinitializeWithOnboarding();
        console.log('Financial data force reinitialized with onboarding values:', {
          savings: payload.savings,
          debt: payload.debt
        });
      }
      
      // Show success message
      console.log('User profile saved successfully:', savedProfile);
      
      // Update cultural context if changed
      if (payload.language && payload.language !== culturalContext) {
        setCulturalContext(payload.language);
        localStorage.setItem('culturalContext', payload.language);
      }
      
        // Force a re-render of NetWorthSummary
        setRefreshTrigger(prev => prev + 1);
        console.log('Triggered NetWorthSummary refresh');
        
        // Dispatch event to notify therapy chat of profile update
        const event = new CustomEvent('profile-updated', {
          detail: { profile: savedProfile }
        });
        document.dispatchEvent(event);
      
    } catch (error) {
      console.error('Failed to save user profile:', error);
      // Add user-facing error handling
      alert(culturalContext === 'hindi' 
        ? 'प्रोफ़ाइल सेव करने में त्रुटि। कृपया पुनः प्रयास करें।'
        : 'Error saving profile. Please try again.');
      throw error;
    }
  };

  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleICPAccountCreated = async () => {
    console.log('ICP account created successfully');
    setShowICPAccountSetup(false);
    
    // Check authentication status again
    try {
      const authenticated = await isAuthenticated();
      setIsICPAuthenticated(authenticated);
      
      if (authenticated) {
        // Show onboarding to collect user data
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Failed to check authentication after account creation:', error);
    }
  };

  const handleShowICPAccountSetup = () => {
    setShowICPAccountSetup(true);
  };

  const getPageTitle = () => {
    return culturalContext === 'hindi' ? 'भावनात्मक वित्तीय डैशबोर्ड' : 'Emotional Financial Dashboard';
  };

  const getWelcomeMessage = () => {
    const hour = new Date()?.getHours();
    let greeting = '';
    
    if (culturalContext === 'hindi') {
      if (hour < 12) greeting = 'सुप्रभात';
      else if (hour < 17) greeting = 'नमस्ते';
      else greeting = 'शुभ संध्या';
    } else {
      if (hour < 12) greeting = 'Good Morning';
      else if (hour < 17) greeting = 'Good Afternoon';
      else greeting = 'Good Evening';
    }
    
    const userName = userProfile?.name || '';
    const nameGreeting = userName ? `, ${userName}` : '';
    
    let statusMessage = '';
    if (isICPAuthenticated) {
      statusMessage = culturalContext === 'hindi' 
        ? ' (ICP खाते से सुरक्षित)'
        : ' (Secured with ICP)';
    }
    
    return `${greeting}${nameGreeting}! ${culturalContext === 'hindi' ? 'आपका वित्तीय स्वास्थ्य कैसा है?' : 'How is your financial wellness today?'}${statusMessage}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">
            {culturalContext === 'hindi' ? 'डैशबोर्ड लोड हो रहा है...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background transition-emotional ${emotionalState}-state`}>
      {/* Global Header */}
      <EmotionalHeader
        emotionalState={emotionalState}
        culturalContext={culturalContext}
        onVoiceToggle={handleVoiceToggle}
        onCrisisHelp={handleCrisisHelp}
      />

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {getPageTitle()}
                </h1>
                <p className="text-muted-foreground">
                  {getWelcomeMessage()}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <TokenBalance />
                <CulturalContextIndicator
                  culturalContext={culturalContext}
                  onContextChange={handleCulturalContextChange}
                  showDetails={false}
                />
                <VoiceAssistantToggle
                  isActive={isVoiceActive}
                  onToggle={handleVoiceToggle}
                  emotionalState={emotionalState}
                  culturalContext={culturalContext}
                />
                {userProfile && (
                  <button
                    onClick={handleShowOnboarding}
                    className="px-4 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-ui"
                  >
                    {culturalContext === 'hindi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}
                  </button>
                )}
                
                {/* Debug button for testing ICP flow */}
                {!isICPAuthenticated && (
                  <button
                    onClick={handleShowICPAccountSetup}
                    className="px-4 py-2 text-sm bg-teal-500/10 text-teal-500 rounded-lg hover:bg-teal-500/20 transition-ui"
                  >
                    {culturalContext === 'hindi' ? 'ICP खाता सेटअप' : 'ICP Account Setup'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Basic details quick bar for new users */}
          {(!userProfile || !userProfile?.name) && (
            <div className="mb-6">
              <BasicDetailsBar
                culturalContext={culturalContext}
                defaultValues={{}}
                onSave={handleSaveUserProfile}
              />
            </div>
          )}

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Top Row - FEIS Score and Net Worth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FinancialEmotionalScore
                  emotionalState={emotionalState}
                  culturalContext={culturalContext}
                  userProfile={userProfile}
                />
                <NetWorthSummary
                  emotionalState={emotionalState}
                  culturalContext={culturalContext}
                  userProfile={userProfile}
                  refreshTrigger={refreshTrigger}
                  transactionRefreshTrigger={transactionRefreshTrigger}
                  key={`networth-${refreshTrigger}-${transactionRefreshTrigger}`}
                />
                 
              </div>

              {/* Middle Row - Transactions and Bills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RecentTransactions
                  emotionalState={emotionalState}
                  culturalContext={culturalContext}
                  refreshTrigger={transactionRefreshTrigger}
                />
                <UpcomingBills
                  emotionalState={emotionalState}
                  culturalContext={culturalContext}
                  refreshTrigger={transactionRefreshTrigger}
                />
              </div>

              {/* Bottom Row - Wisdom and Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CulturalFinancialWisdom
                  emotionalState={emotionalState}
                  culturalContext={culturalContext}
                  userProfile={userProfile}
                />
                <QuickActionButtons
                  emotionalState={emotionalState}
                  culturalContext={culturalContext}
                  userProfile={userProfile}
                  onVoiceToggle={handleVoiceToggle}
                />
              </div>

            </div>

            {/* Right Column - Emotional Analytics Sidebar (Desktop Only) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <EmotionalStateSidebar
                  emotionalState={emotionalState}
                  culturalContext={culturalContext}
                  userProfile={userProfile}
                />
              </div>
            </div>
          </div>

          {/* Mobile Emotional Analytics */}
          <div className="lg:hidden mt-6">
            <EmotionalStateSidebar
              emotionalState={emotionalState}
              culturalContext={culturalContext}
              userProfile={userProfile}
            />
          </div>
        </div>
      </main>

      {/* Crisis Intervention Overlay */}
      <CrisisInterventionOverlay
        isVisible={showCrisisOverlay}
        onClose={() => setShowCrisisOverlay(false)}
        emotionalState={emotionalState}
        culturalContext={culturalContext}
        triggerReason="manual"
      />

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button
          onClick={handleCrisisHelp}
          className="w-14 h-14 bg-error text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <span className="text-2xl">🆘</span>
        </button>
      </div>

      {/* User Onboarding Modal */}
      <UserOnboardingModal
        isVisible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSave={handleSaveUserProfile}
        culturalContext={culturalContext}
      />

      {/* ICP Account Setup Modal */}
      <ICPAccountSetup
        isVisible={showICPAccountSetup}
        onClose={() => setShowICPAccountSetup(false)}
        onAccountCreated={handleICPAccountCreated}
        culturalContext={culturalContext}
      />
    </div>
  );
};

export default EmotionalFinancialDashboard;