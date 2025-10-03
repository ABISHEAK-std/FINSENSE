import { getBackendActor } from "../ic/actor.js";
import { financialDataService } from './FinancialDataService.js';

export const expenseService = {
  // Add a new expense
  addExpense: async (title, amount, date, category, emotion = 'neutral', culturalContext = 'default') => {
    try {
      // Validate and sanitize inputs
      const sanitizedTitle = title || 'Untitled Expense';
      const sanitizedAmount = Number(amount) || 0;
      const sanitizedDate = date || new Date().toISOString().split('T')[0];
      const sanitizedCategory = category || 'other';
      
      // Additional validation
      if (sanitizedAmount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      
      // Use FinancialDataService for centralized data management
      console.log("Adding expense via FinancialDataService");
      const expenseData = {
        amount: sanitizedAmount,
        category: sanitizedCategory,
        description: sanitizedTitle,
        emotion: emotion,
        timestamp: new Date(sanitizedDate),
        culturalContext: culturalContext
      };
      
      const newExpense = financialDataService.addExpense(expenseData);
      
      // Also maintain backward compatibility with old localStorage structure
      const expense = {
        id: newExpense.id,
        title: sanitizedTitle,
        amount: sanitizedAmount,
        date: sanitizedDate,
        category: sanitizedCategory,
        emotionalContext: emotion,
        emotion: emotion,
        description: sanitizedTitle,
        culturalContext: culturalContext,
        timestamp: newExpense.timestamp
      };
      
      // Store in localStorage for backward compatibility
      const existingExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      existingExpenses.unshift(expense);
      localStorage.setItem('expenses', JSON.stringify(existingExpenses));
      
      return expense;
    } catch (error) {
      console.error("Failed to add expense:", error);
      throw error;
    }
  },

  // Get all expenses
  getExpenses: async () => {
    try {
      // Force use of mock implementation
      console.log("Using mock implementation for getExpenses");
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      return expenses;
    } catch (error) {
      console.error("Failed to get expenses:", error);
      return [];
    }
  },

  // Remove an expense
  removeExpense: async (id) => {
    try {
      // Force use of mock implementation
      console.log("Using mock implementation for removeExpense");
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const filteredExpenses = expenses.filter(expense => expense.id !== id);
      localStorage.setItem('expenses', JSON.stringify(filteredExpenses));
      return true;
    } catch (error) {
      console.error("Failed to remove expense:", error);
      throw error;
    }
  },

  // Get expense analytics
  getExpenseAnalytics: async () => {
    try {
      const expenses = await expenseService.getExpenses();
      
      const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      
      const categoryBreakdown = expenses.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = { count: 0, amount: 0 };
        }
        acc[category].count += 1;
        acc[category].amount += Number(expense.amount);
        return acc;
      }, {});

      const monthlyBreakdown = expenses.reduce((acc, expense) => {
        const month = expense.date.substring(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += Number(expense.amount);
        return acc;
      }, {});

      return {
        totalAmount,
        totalCount: expenses.length,
        categoryBreakdown,
        monthlyBreakdown,
        averageAmount: expenses.length > 0 ? totalAmount / expenses.length : 0
      };
    } catch (error) {
      console.error("Failed to get expense analytics:", error);
      return {
        totalAmount: 0,
        totalCount: 0,
        categoryBreakdown: {},
        monthlyBreakdown: {},
        averageAmount: 0
      };
    }
  }
};

