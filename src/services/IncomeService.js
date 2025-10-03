import { getBackendActor } from '../ic/actor';
import { financialDataService } from './FinancialDataService.js';

class IncomeService {
  constructor() {
    this.actor = null;
  }

  async getActor() {
    if (!this.actor) {
      this.actor = await getBackendActor();
    }
    return this.actor;
  }

  async addIncome(amount, source, description, date, emotion, culturalContext = 'default') {
    try {
      // Validate and sanitize inputs
      const sanitizedAmount = Number(amount) || 0;
      const sanitizedSource = source || 'other';
      const sanitizedDescription = description || null;
      const sanitizedDate = date || new Date().toISOString().split('T')[0];
      const sanitizedEmotion = emotion || 'neutral';
      
      // Additional validation
      if (sanitizedAmount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      
      // Use FinancialDataService for centralized data management
      console.log("Adding income via FinancialDataService");
      const incomeData = {
        amount: sanitizedAmount,
        source: sanitizedSource,
        description: sanitizedDescription || '',
        emotion: sanitizedEmotion,
        timestamp: new Date(sanitizedDate),
        culturalContext: culturalContext
      };
      
      const newIncome = financialDataService.addIncome(incomeData);
      
      // Also maintain backward compatibility with old localStorage structure
      const income = {
        id: newIncome.id,
        amount: sanitizedAmount,
        source: sanitizedSource,
        description: sanitizedDescription,
        date: sanitizedDate,
        emotion: sanitizedEmotion,
        timestamp: newIncome.timestamp,
        culturalContext: culturalContext
      };
      
      // Store in localStorage for backward compatibility
      const existingIncomes = JSON.parse(localStorage.getItem('incomes') || '[]');
      existingIncomes.unshift(income);
      localStorage.setItem('incomes', JSON.stringify(existingIncomes));
      
      return income;
    } catch (error) {
      console.error('Error adding income:', error);
      throw error;
    }
  }

  async getIncomes() {
    try {
      // Force use of mock implementation
      console.log("Using mock implementation for getIncomes");
      const incomes = JSON.parse(localStorage.getItem('incomes') || '[]');
      return incomes.map(income => ({
        ...income,
        timestamp: new Date(income.timestamp)
      }));
    } catch (error) {
      console.error('Error getting incomes:', error);
      return [];
    }
  }

  async removeIncome(incomeId) {
    try {
      const actor = await this.getActor();
      
      // If using mock backend, handle locally
      if (actor.removeIncome && typeof actor.removeIncome === 'function') {
        return await actor.removeIncome(incomeId);
      } else {
        // Mock implementation for development
        const incomes = JSON.parse(localStorage.getItem('incomes') || '[]');
        const filteredIncomes = incomes.filter(income => income.id !== incomeId);
        localStorage.setItem('incomes', JSON.stringify(filteredIncomes));
        return true;
      }
    } catch (error) {
      console.error('Error removing income:', error);
      throw error;
    }
  }

  // Helper methods for income analysis
  getIncomeStats(incomes) {
    if (!incomes || incomes.length === 0) {
      return {
        totalAmount: 0,
        totalCount: 0,
        averageAmount: 0,
        sourceStats: {},
        emotionStats: {},
        monthlyTrend: []
      };
    }

    const totalAmount = incomes.reduce((sum, income) => sum + Number(income.amount), 0);
    const sourceStats = incomes.reduce((acc, income) => {
      acc[income.source] = (acc[income.source] || 0) + Number(income.amount);
      return acc;
    }, {});

    const emotionStats = incomes.reduce((acc, income) => {
      acc[income.emotion] = (acc[income.emotion] || 0) + 1;
      return acc;
    }, {});

    // Calculate monthly trend
    const monthlyTrend = incomes.reduce((acc, income) => {
      const month = new Date(income.timestamp || income.date).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + Number(income.amount);
      return acc;
    }, {});

    return {
      totalAmount,
      totalCount: incomes.length,
      averageAmount: totalAmount / incomes.length,
      sourceStats,
      emotionStats,
      monthlyTrend: Object.entries(monthlyTrend).map(([month, amount]) => ({ month, amount }))
    };
  }

  getIncomeInsights(incomes) {
    const stats = this.getIncomeStats(incomes);
    const insights = [];

    if (stats.totalAmount > 0) {
      // Source diversity insight
      const sourceCount = Object.keys(stats.sourceStats).length;
      if (sourceCount === 1) {
        insights.push('Consider diversifying your income sources for better financial stability');
      } else if (sourceCount >= 3) {
        insights.push('Great job! You have diversified income sources');
      }

      // Emotional patterns
      const positiveEmotions = ['happy', 'grateful', 'proud', 'excited', 'motivated'];
      const positiveCount = incomes.filter(income => positiveEmotions.includes(income.emotion)).length;
      if (positiveCount > incomes.length * 0.7) {
        insights.push('You have a positive relationship with your income sources');
      }

      // Amount patterns
      if (stats.averageAmount > 50000) {
        insights.push('Your average income is quite substantial');
      }
    }

    return insights;
  }

  exportIncomesToCSV(incomes) {
    if (!incomes || incomes.length === 0) {
      return null;
    }

    const headers = [
      'Date',
      'Amount (₹)',
      'Source',
      'Description',
      'Emotion'
    ];

    const csvContent = [
      headers.join(','),
      ...incomes.map(income => [
        new Date(income.timestamp || income.date).toLocaleDateString(),
        income.amount,
        income.source,
        income.description || '',
        income.emotion
      ].join(','))
    ].join('\n');

    return csvContent;
  }
}

export const incomeService = new IncomeService();
