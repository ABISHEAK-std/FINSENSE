import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import EmotionalHeader from '../../components/ui/EmotionalHeader';
import VoiceAssistantToggle from '../../components/ui/VoiceAssistantToggle';
import CrisisInterventionOverlay from '../../components/ui/CrisisInterventionOverlay';
import CulturalContextIndicator from '../../components/ui/CulturalContextIndicator';
import UnifiedFinancialEntry from './components/UnifiedFinancialEntry';
import CombinedFinancialTimeline from './components/CombinedFinancialTimeline';
import EmotionalAnalysisPanel from './components/EmotionalAnalysisPanel';
import PredictiveAlerts from './components/PredictiveAlerts';
import { expenseService } from '../../services/ExpenseService';
import { incomeService } from '../../services/IncomeService';

const ExpenseTrackingEmotionalAnalysis = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [culturalContext, setCulturalContext] = useState('default');
  const [emotionalState, setEmotionalState] = useState('calm');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showCrisisOverlay, setShowCrisisOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved preferences
    const savedContext = localStorage.getItem('culturalContext') || 'default';
    const savedEmotionalState = localStorage.getItem('emotionalState') || 'calm';
    
    setCulturalContext(savedContext);
    setEmotionalState(savedEmotionalState);
    
    // Load expenses and incomes
    loadExpenses();
    loadIncomes();
    
    // Listen for crisis intervention trigger
    const handleCrisisEvent = () => setShowCrisisOverlay(true);
    document.addEventListener('triggerCrisisHelp', handleCrisisEvent);
    
    return () => {
      document.removeEventListener('triggerCrisisHelp', handleCrisisEvent);
    };
  }, []);

  const loadExpenses = async () => {
    setIsLoading(true);
    
    try {
      const backendExpenses = await expenseService.getExpenses();
      
      if (backendExpenses && backendExpenses.length > 0) {
        const formattedExpenses = backendExpenses.map(expense => ({
          id: expense.id,
          title: expense.title,
          amount: Number(expense.amount),
          category: expense.category,
          timestamp: new Date(expense.date),
          emotionalContext: 'neutral'
        }));
        setExpenses(formattedExpenses);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error('Error loading expenses from backend:', error);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadIncomes = async () => {
    try {
      const backendIncomes = await incomeService.getIncomes();
      
      if (backendIncomes && backendIncomes.length > 0) {
        const formattedIncomes = backendIncomes.map(income => ({
          id: income.id,
          amount: Number(income.amount),
          source: income.source,
          description: income.description,
          timestamp: new Date(income.date),
          emotion: income.emotion,
          culturalContext
        }));
        setIncomes(formattedIncomes);
      } else {
        setIncomes([]);
      }
    } catch (error) {
      console.error('Error loading incomes from backend:', error);
      setIncomes([]);
    }
  };

  const handleVoiceToggle = (isActive) => {
    setIsVoiceActive(isActive);
  };

  const handleCrisisHelp = () => {
    setShowCrisisOverlay(true);
  };

  const handleContextChange = (newContext) => {
    setCulturalContext(newContext);
    localStorage.setItem('culturalContext', newContext);
  };

  const handleAddExpense = async (expenseData) => {
    try {
      // Validate and prepare data
      const amount = Number(expenseData.amount) || 0;
      const date = expenseData.timestamp ? expenseData.timestamp.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const category = expenseData.category || 'other';
      // Use description if provided, otherwise use category as title
      const title = expenseData.description?.trim() || expenseData.title || category;
      
      // Validate required fields
      if (!amount || amount <= 0) {
        alert(culturalContext === 'hindi' ? 'कृपया वैध राशि दर्ज करें' : 'Please enter a valid amount');
        return;
      }
      
      if (!category || category === '') {
        alert(culturalContext === 'hindi' ? 'कृपया श्रेणी चुनें' : 'Please select a category');
        return;
      }
      
      const backendExpense = await expenseService.addExpense(
        title,
        amount,
        date,
        category,
        expenseData.emotion || 'neutral',
        culturalContext
      );
      
      const newExpense = {
        id: backendExpense.id,
        title: backendExpense.title,
        amount: Number(backendExpense.amount),
        category: backendExpense.category,
        timestamp: expenseData.timestamp || new Date(),
        emotionalContext: expenseData.emotion || 'neutral',
        emotion: expenseData.emotion || 'neutral',
        description: expenseData.description,
        culturalContext: expenseData.culturalContext
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      
      // Dispatch event to notify dashboard of transaction update
      const event = new CustomEvent('transaction-updated', {
        detail: { type: 'expense', amount: newExpense.amount }
      });
      document.dispatchEvent(event);
      
      if (['stressed', 'anxious', 'sad', 'angry']?.includes(expenseData?.emotion)) {
        setEmotionalState('stressed');
        localStorage.setItem('emotionalState', 'stressed');
      } else if (['happy', 'excited']?.includes(expenseData?.emotion)) {
        setEmotionalState('positive');
        localStorage.setItem('emotionalState', 'positive');
      }
    } catch (error) {
      console.error('Error adding expense to backend:', error);
      alert(culturalContext === 'hindi' ? 'खर्च जोड़ने में त्रुटि हुई' : 'Error adding expense');
    }
  };

  const handleAddIncome = async (incomeData) => {
    try {
      // Validate and prepare data
      const amount = Number(incomeData.amount) || 0;
      const source = incomeData.source || 'other';
      const description = incomeData.description || '';
      const date = incomeData.timestamp ? incomeData.timestamp.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const emotion = incomeData.emotion || 'neutral';
      
      // Validate required fields
      if (!amount || amount <= 0) {
        alert(culturalContext === 'hindi' ? 'कृपया वैध राशि दर्ज करें' : 'Please enter a valid amount');
        return;
      }
      
      if (!source || source === '') {
        alert(culturalContext === 'hindi' ? 'कृपया स्रोत चुनें' : 'Please select a source');
        return;
      }
      
      const backendIncome = await incomeService.addIncome(
        amount,
        source,
        description,
        date,
        emotion,
        culturalContext
      );
      
      const newIncome = {
        id: backendIncome.id,
        amount: Number(backendIncome.amount),
        source: backendIncome.source,
        description: backendIncome.description,
        timestamp: incomeData.timestamp || new Date(),
        emotion: incomeData.emotion,
        culturalContext: incomeData.culturalContext
      };
      
      setIncomes(prev => [newIncome, ...prev]);
      
      // Dispatch event to notify dashboard of transaction update
      const event = new CustomEvent('transaction-updated', {
        detail: { type: 'income', amount: newIncome.amount }
      });
      document.dispatchEvent(event);
      
      if (['happy', 'grateful', 'proud', 'excited', 'motivated']?.includes(incomeData?.emotion)) {
        setEmotionalState('positive');
        localStorage.setItem('emotionalState', 'positive');
      }
    } catch (error) {
      console.error('Error adding income to backend:', error);
      alert(culturalContext === 'hindi' ? 'आय जोड़ने में त्रुटि हुई' : 'Error adding income');
    }
  };

  const handleAlertAction = (actionType, alert) => {
    switch (actionType) {
      case 'breathing_exercise':
        setShowCrisisOverlay(true);
        break;
      case 'create_budget':
        window.location.href = '/cultural-financial-planning';
        break;
      case 'stress_management':
        window.location.href = '/ai-financial-therapy-chat';
        break;
      case 'set_spending_limit':
        alert(culturalContext === 'hindi' ?'खर्च की सीमा सेट करने की सुविधा जल्द आ रही है।' :'Spending limit feature coming soon.');
        break;
      case 'family_discussion_guide':
        window.location.href = '/cultural-financial-planning';
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  const getPageTitle = () => {
    return culturalContext === 'hindi' ?'आय और खर्च ट्रैकिंग - FinSense AI' :'Income & Expense Tracking - FinSense AI';
  };

  const getPageDescription = () => {
    return culturalContext === 'hindi' ?'अपनी आय और खर्च को ट्रैक करें और भावनात्मक पैटर्न को समझें। AI-powered वित्तीय सलाह के साथ बेहतर वित्तीय निर्णय लें।' :'Track your income and expenses with emotional analysis. Make better financial decisions with AI-powered insights and comprehensive financial tracking.';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {culturalContext === 'hindi' ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content={culturalContext === 'hindi' ?'खर्च ट्रैकिंग, भावनात्मक विश्लेषण, वित्तीय प्रबंधन, AI सलाह' :'expense tracking, emotional analysis, financial management, AI advice'
        } />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/expense-tracking-emotional-analysis" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <EmotionalHeader
          emotionalState={emotionalState}
          culturalContext={culturalContext}
          onVoiceToggle={handleVoiceToggle}
          onCrisisHelp={handleCrisisHelp}
        />

        {/* Main Content */}
        <main className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="text-2xl lg:text-3xl font-heading text-foreground">
                    {culturalContext === 'hindi' ?'आय और खर्च ट्रैकिंग' :'Income & Expense Tracking'
                    }
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <CulturalContextIndicator
                  culturalContext={culturalContext}
                  onContextChange={handleContextChange}
                  showDetails={false}
                />
                <VoiceAssistantToggle
                  isActive={isVoiceActive}
                  onToggle={handleVoiceToggle}
                  emotionalState={emotionalState}
                  culturalContext={culturalContext}
                />
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="xl:col-span-2 space-y-8">
                {/* Unified Financial Entry */}
                <UnifiedFinancialEntry
                  onAddIncome={handleAddIncome}
                  onAddExpense={handleAddExpense}
                  culturalContext={culturalContext}
                  emotionalState={emotionalState}
                />

                {/* Combined Financial Timeline */}
                <CombinedFinancialTimeline
                  expenses={expenses}
                  incomes={incomes}
                  culturalContext={culturalContext}
                  onExpenseClick={() => {}}
                  onIncomeClick={() => {}}
                  onDeleteExpense={() => {}}
                  onDeleteIncome={() => {}}
                  onEditExpense={() => {}}
                  onEditIncome={() => {}}
                  onDuplicateExpense={() => {}}
                  onDuplicateIncome={() => {}}
                />
              </div>

              {/* Right Column - Analysis & Alerts */}
              <div className="space-y-8">
                {/* Predictive Alerts */}
                <PredictiveAlerts
                  expenses={expenses}
                  culturalContext={culturalContext}
                  onAlertAction={handleAlertAction}
                />

                {/* Emotional Analysis Panel */}
                <EmotionalAnalysisPanel
                  expenses={expenses}
                  incomes={incomes}
                  culturalContext={culturalContext}
                />
              </div>
            </div>

            {/* Mobile-only Analysis Panel */}
            <div className="xl:hidden mt-8">
              <EmotionalAnalysisPanel
                expenses={expenses}
                incomes={incomes}
                culturalContext={culturalContext}
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
      </div>
    </>
  );
};

export default ExpenseTrackingEmotionalAnalysis;