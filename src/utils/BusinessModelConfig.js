// src/utils/BusinessModelConfig.js

export const BUSINESS_MODEL_CONFIG = {
  // User Plans
  PLANS: {
    FREE: 'FREE',
    PREMIUM: 'PREMIUM'
  },

  // Feature Access Controls
  FREE_LIMITS: {
    maxBudgets: 5,
    maxExpenseEntries: 100,
    therapySessionsPerMonth: 10,
    culturalEventsPerMonth: 3
  },

  PREMIUM_FEATURES: [
    'performance-analytics',
    'advanced-insights',
    'export-data',
    'priority-support',
    'custom-themes',
    'unlimited-budgets'
  ],

  // Token System
  TOKEN_REWARDS: {
    dailyLogin: 10,
    expenseEntry: 5,
    budgetCreation: 25,
    festivalBudgetComplete: 50,
    positiveFeisScore: 15,
    therapySessionComplete: 20,
    weeklyStreakBonus: 100,
    referralBonus: 200,
    profileComplete: 30
  },

  // Referral System
  REFERRAL_CONFIG: {
    bonusTokens: 200,
    maxReferrals: 50,
    cooldownPeriod: 24 // hours
  },

  // Analytics Seed Data
  SAMPLE_USERS: [
    'Selvam Kumar',
    'Sangeetha Rajesh', 
    'Malarselvi Anand',
    'Sampathkumar Ravi',
    'Premalatha Devi',
    'P Sethu Madhavan',
    'Krithik Venkat',
    'Roopesh Chandra'
  ],

  // Partner Categories
  PARTNER_CATEGORIES: [
    'Digital Wallets',
    'Banking',
    'Insurance', 
    'Investment Platforms',
    'Cashback Offers',
    'Shopping Discounts'
  ]
};

// --- Utility Functions ---

export const getUserPlan = () => {
  return localStorage.getItem('user_plan') || BUSINESS_MODEL_CONFIG.PLANS.FREE;
};

export const setUserPlan = (plan) => {
  localStorage.setItem('user_plan', plan);
};

export const hasAccess = (feature) => {
  const userPlan = getUserPlan();
  if (userPlan === BUSINESS_MODEL_CONFIG.PLANS.PREMIUM) return true;
  return !BUSINESS_MODEL_CONFIG.PREMIUM_FEATURES.includes(feature);
};

export const getTokenBalance = () => {
  const tokens = localStorage.getItem('finsense_tokens');
  return Number(tokens) || 0;
};

export const addTokens = (amount, reason = 'general') => {
  const currentBalance = getTokenBalance();
  const newBalance = currentBalance + Number(amount);
  localStorage.setItem('finsense_tokens', newBalance.toString());

  const transactions = JSON.parse(localStorage.getItem('fincoins_transactions') || '[]');
  transactions.push({
    amount: Number(amount),
    reason,
    timestamp: new Date().toISOString(),
    balance: newBalance
  });
  localStorage.setItem('fincoins_transactions', JSON.stringify(transactions));

  return newBalance;
};

export const spendTokens = (amount, reason = 'redemption') => {
  const currentBalance = getTokenBalance();
  if (currentBalance < Number(amount)) return false;

  const newBalance = currentBalance - Number(amount);
  localStorage.setItem('finsense_tokens', newBalance.toString());

  const transactions = JSON.parse(localStorage.getItem('fincoins_transactions') || '[]');
  transactions.push({
    amount: -Number(amount),
    reason,
    timestamp: new Date().toISOString(),
    balance: newBalance
  });
  localStorage.setItem('fincoins_transactions', JSON.stringify(transactions));

  return true;
};
