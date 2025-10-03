import { tokenService } from './TokenService';

// Financial Data Service - Centralized management of financial data
class FinancialDataService {
  constructor() {
    this.storageKey = 'finsense_financial_data';
    this.initializeData();
  }

  // Initialize financial data structure
  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      // Check if onboarding data exists to initialize with base values
      const userProfile = localStorage.getItem('finsense_user_profile');
      let baseAssets = 0;
      let baseLiabilities = 0;
      
      if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          baseAssets = Number(profile.savings) || 0;
          baseLiabilities = Number(profile.debt) || 0;
        } catch (error) {
          console.warn('Error parsing user profile for initialization:', error);
        }
      }
      
      const initialData = {
        totalAssets: baseAssets, // Start with onboarding savings
        totalLiabilities: baseLiabilities, // Start with onboarding debt
        incomeEntries: [],
        expenseEntries: [],
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  // Get current financial data
  getFinancialData() {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      return {
        totalAssets: data.totalAssets || 0,
        totalLiabilities: data.totalLiabilities || 0,
        incomeEntries: data.incomeEntries || [],
        expenseEntries: data.expenseEntries || [],
        lastUpdated: data.lastUpdated || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting financial data:', error);
      return this.getDefaultData();
    }
  }

  // Get default data structure
  getDefaultData() {
    return {
      totalAssets: 0,
      totalLiabilities: 0,
      incomeEntries: [],
      expenseEntries: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // Save financial data
  saveFinancialData(data) {
    try {
      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('Error saving financial data:', error);
      return false;
    }
  }

  // Add income entry
  addIncome(incomeData) {
    try {
      const data = this.getFinancialData();
      const newIncome = {
        id: Date.now(),
        amount: Number(incomeData.amount) || 0,
        type: 'income',
        source: incomeData.source || 'other',
        description: incomeData.description || '',
        emotion: incomeData.emotion || 'neutral',
        timestamp: incomeData.timestamp || new Date(),
        culturalContext: incomeData.culturalContext || 'default'
      };

      // Update total assets
      data.totalAssets += newIncome.amount;
      data.incomeEntries.unshift(newIncome);

      this.saveFinancialData(data);
      return newIncome;
    } catch (error) {
      console.error('Error adding income:', error);
      throw error;
    }
  }

  // Add expense entry
  addExpense(expenseData) {
    try {
      const data = this.getFinancialData();
      const newExpense = {
        id: Date.now(),
        amount: Number(expenseData.amount) || 0,
        type: 'expense',
        category: expenseData.category || 'other',
        description: expenseData.description || '',
        emotion: expenseData.emotion || 'neutral',
        timestamp: expenseData.timestamp || new Date(),
        culturalContext: expenseData.culturalContext || 'default'
      };

      // Decrease total assets (expenses reduce assets)
      data.totalAssets = Math.max(0, data.totalAssets - newExpense.amount);
      data.expenseEntries.unshift(newExpense);

      this.saveFinancialData(data);
      return newExpense;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  // Get net worth
  getNetWorth() {
    const data = this.getFinancialData();
    return data.totalAssets - data.totalLiabilities;
  }

  // Get emotional analytics
  getEmotionalAnalytics() {
    const data = this.getFinancialData();
    const allEntries = [...data.incomeEntries, ...data.expenseEntries];
    
    // Group by emotion
    const emotionGroups = {};
    allEntries.forEach(entry => {
      const emotion = entry.emotion || 'neutral';
      if (!emotionGroups[emotion]) {
        emotionGroups[emotion] = {
          income: 0,
          expenses: 0,
          count: 0,
          totalAmount: 0
        };
      }
      
      if (entry.type === 'income') {
        emotionGroups[emotion].income += entry.amount;
      } else {
        emotionGroups[emotion].expenses += entry.amount;
      }
      
      emotionGroups[emotion].count += 1;
      emotionGroups[emotion].totalAmount += entry.amount;
    });

    // Find most common emotions
    const sortedByCount = Object.entries(emotionGroups)
      .sort(([,a], [,b]) => b.count - a.count);
    
    const sortedByExpenses = Object.entries(emotionGroups)
      .sort(([,a], [,b]) => b.expenses - a.expenses);
    
    const sortedByIncome = Object.entries(emotionGroups)
      .sort(([,a], [,b]) => b.income - a.income);

    return {
      emotionGroups,
      mostCommonEmotion: sortedByCount[0]?.[0] || 'neutral',
      mostExpensiveEmotion: sortedByExpenses[0]?.[0] || 'neutral',
      mostIncomeEmotion: sortedByIncome[0]?.[0] || 'neutral',
      totalEntries: allEntries.length,
      totalIncome: data.incomeEntries.reduce((sum, entry) => sum + entry.amount, 0),
      totalExpenses: data.expenseEntries.reduce((sum, entry) => sum + entry.amount, 0)
    };
  }

  // Get chart data for net worth over time
  getNetWorthHistory(timeframe = '6M') {
    const data = this.getFinancialData();
    const allEntries = [...data.incomeEntries, ...data.expenseEntries]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Calculate running balance
    let runningAssets = 0;
    const history = [];
    
    allEntries.forEach(entry => {
      if (entry.type === 'income') {
        runningAssets += entry.amount;
      } else {
        runningAssets = Math.max(0, runningAssets - entry.amount);
      }
      
      history.push({
        date: new Date(entry.timestamp).toISOString().split('T')[0],
        assets: runningAssets,
        netWorth: runningAssets - data.totalLiabilities,
        emotion: entry.emotion,
        type: entry.type,
        amount: entry.amount
      });
    });

    // Group by timeframe
    const now = new Date();
    const filteredHistory = history.filter(item => {
      const itemDate = new Date(item.date);
      const monthsAgo = timeframe === '1M' ? 1 : timeframe === '3M' ? 3 : timeframe === '6M' ? 6 : 12;
      const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate());
      return itemDate >= cutoffDate;
    });

    return filteredHistory;
  }

  // Check if onboarding has been completed
  hasOnboardingData() {
    try {
      const userProfile = localStorage.getItem('finsense_user_profile');
      if (!userProfile) return false;
      
      const profile = JSON.parse(userProfile);
      return !!(profile.savings !== undefined && profile.debt !== undefined);
    } catch (error) {
      console.warn('Error checking onboarding data:', error);
      return false;
    }
  }

  // Get initial values from onboarding
  getOnboardingValues() {
    try {
      const userProfile = localStorage.getItem('finsense_user_profile');
      if (!userProfile) return { savings: 0, debt: 0 };
      
      const profile = JSON.parse(userProfile);
      return {
        savings: Number(profile.savings) || 0,
        debt: Number(profile.debt) || 0
      };
    } catch (error) {
      console.warn('Error getting onboarding values:', error);
      return { savings: 0, debt: 0 };
    }
  }

  // Update financial data from onboarding
  updateFromOnboarding(savings, debt) {
    try {
      const data = this.getFinancialData();
      data.totalAssets = Number(savings) || 0;
      data.totalLiabilities = Number(debt) || 0;
      data.lastUpdated = new Date().toISOString();
      
      this.saveFinancialData(data);
      console.log('Financial data updated from onboarding:', { savings, debt });
      return true;
    } catch (error) {
      console.error('Error updating financial data from onboarding:', error);
      return false;
    }
  }

  // Refresh data from onboarding (useful when onboarding is completed)
  refreshFromOnboarding() {
    try {
      const userProfile = localStorage.getItem('finsense_user_profile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        const savings = Number(profile.savings) || 0;
        const debt = Number(profile.debt) || 0;
        
        // Reset financial data with onboarding values (this overwrites any existing data)
        const data = {
          totalAssets: savings,
          totalLiabilities: debt,
          incomeEntries: [],
          expenseEntries: [],
          lastUpdated: new Date().toISOString()
        };
        
        this.saveFinancialData(data);
        console.log('Financial data refreshed from onboarding:', { savings, debt });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing from onboarding:', error);
      return false;
    }
  }

  // Force reinitialize with onboarding data
  forceReinitializeWithOnboarding() {
    try {
      // Remove existing financial data completely
      localStorage.removeItem(this.storageKey);
      
      // Get fresh onboarding values
      const userProfile = localStorage.getItem('finsense_user_profile');
      let savings = 0;
      let debt = 0;
      
      if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          savings = Number(profile.savings) || 0;
          debt = Number(profile.debt) || 0;
        } catch (error) {
          console.warn('Error parsing user profile:', error);
        }
      }
      
      // Create completely fresh data with onboarding values
      const freshData = {
        totalAssets: savings,
        totalLiabilities: debt,
        incomeEntries: [],
        expenseEntries: [],
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(freshData));
      
      console.log('Financial data force reinitialized with onboarding data:', { savings, debt });
      return true;
    } catch (error) {
      console.error('Error force reinitializing:', error);
      return false;
    }
  }

  // Reset all data (for testing)
  resetData() {
    localStorage.removeItem(this.storageKey);
    this.initializeData();
  }

  // Festival-specific data management
  getFestivalData(festivalId) {
    try {
      const festivalData = JSON.parse(localStorage.getItem('festival_budgets') || '[]');
      return festivalData.find(f => f.id === festivalId) || null;
    } catch (error) {
      console.error('Error getting festival data:', error);
      return null;
    }
  }

  saveFestivalData(festivalId, data) {
    try {
      let allFestivalData = JSON.parse(localStorage.getItem('festival_budgets') || '[]');
      const existingIndex = allFestivalData.findIndex(f => f.id === festivalId);
      
      if (existingIndex >= 0) {
        allFestivalData[existingIndex] = { ...allFestivalData[existingIndex], ...data };
      } else {
        allFestivalData.push({ id: festivalId, ...data });
        // Award tokens for creating new festival budget
        TokenService.addTokens(20, 'Festival Budget Created');
      }
      
      localStorage.setItem('festival_budgets', JSON.stringify(allFestivalData));
      return true;
    } catch (error) {
      console.error('Error saving festival data:', error);
      return false;
    }
  }

  addFestivalExpense(festivalId, expense) {
    try {
      const festivalData = this.getFestivalData(festivalId) || { expenses: [] };
      festivalData.expenses = [...(festivalData.expenses || []), expense];
      
      this.saveFestivalData(festivalId, festivalData);
      
      // Also add to main financial tracking
      this.addExpense({
        ...expense,
        category: 'festival',
        description: `Festival expense for ${festivalId}: ${expense.note || 'No description'}`
      });
      
      return expense;
    } catch (error) {
      console.error('Error adding festival expense:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const financialDataService = new FinancialDataService();
export default financialDataService;
