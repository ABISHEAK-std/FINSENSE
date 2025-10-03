export const BUSINESS_MODEL_CONFIG = {
  TOKEN_REWARDS: {
    FESTIVAL_BUDGET_CREATE: 20,
    DAILY_TRACKING: 10,
    WEEKLY_TRACKING: 50,
    POSITIVE_FEIS_SCORE: 15,
    PROFILE_COMPLETE: 25
  },

  FREE_LIMITS: {
    MAX_FESTIVALS: 3,
    MAX_BUDGETS: 5,
    MAX_ANALYTICS_DAYS: 30
  },

  PREMIUM_FEATURES: {
    PERFORMANCE_ANALYTICS: true,
    CUSTOM_THEMES: true,
    CULTURAL_AVATARS: true,
    ADVANCED_INSIGHTS: true
  },

  SAMPLE_USERS: [
    { name: 'Selvam', region: 'Tamil Nadu' },
    { name: 'Sangeetha', region: 'Kerala' },
    { name: 'Malarselvi', region: 'Tamil Nadu' },
    { name: 'Sampathkumar', region: 'Karnataka' },
    { name: 'Premalatha', region: 'Tamil Nadu' },
    { name: 'P Sethu', region: 'Andhra Pradesh' },
    { name: 'Krithik', region: 'Tamil Nadu' },
    { name: 'Roopesh', region: 'Kerala' }
  ],

  REDEMPTION_ITEMS: [
    {
      id: 'dark_theme',
      name: 'Dark Theme',
      cost: 50,
      description: 'Switch to dark mode for better viewing',
      icon: '🌙',
      type: 'theme'
    },
    {
      id: 'cultural_avatar',
      name: 'Cultural Avatar Pack',
      cost: 100,
      description: 'Traditional cultural avatar collection',
      icon: '👤',
      type: 'avatar'
    },
    {
      id: 'financial_wisdom',
      name: 'Financial Wisdom Insights',
      cost: 150,
      description: 'Premium financial insights and tips',
      icon: '💡',
      type: 'insight'
    },
    {
      id: 'community_badge',
      name: 'Community Badge',
      cost: 200,
      description: 'Special community recognition badge',
      icon: '🏆',
    },
  ],
}
