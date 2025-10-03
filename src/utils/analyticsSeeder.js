import { BUSINESS_MODEL_CONFIG } from './BusinessModelConfig';

const SAMPLE_USERS = [
  { name: 'Selvam', region: 'Tamil Nadu' },
  { name: 'Sangeetha', region: 'Kerala' },
  { name: 'Malarselvi', region: 'Tamil Nadu' },
  { name: 'Sampathkumar', region: 'Karnataka' },
  { name: 'Premalatha', region: 'Tamil Nadu' },
  { name: 'P Sethu', region: 'Andhra Pradesh' },
  { name: 'Krithik', region: 'Tamil Nadu' },
  { name: 'Roopesh', region: 'Kerala' }
];

export class AnalyticsSeeder {
  constructor() {
    this.users = BUSINESS_MODEL_CONFIG.SAMPLE_USERS;
    this.activities = [
      'login',
      'budget_created',
      'expense_added',
      'therapy_session',
      'emotional_checkin',
      'festival_planning',
      'tokens_earned',
      'performance_view',
      'investment_added',
      'profile_updated'
    ];
  }

  generateUserActivity(userName, days = 30) {
    const activities = [];
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now - (i * 24 * 60 * 60 * 1000));
      const dayActivities = Math.floor(Math.random() * 8) + 2; // 2-10 activities per day
      
      for (let j = 0; j < dayActivities; j++) {
        const activity = this.activities[Math.floor(Math.random() * this.activities.length)];
        const timestamp = new Date(date.getTime() + (Math.random() * 24 * 60 * 60 * 1000));
        
        activities.push({
          user: userName,
          activity,
          timestamp: timestamp.toISOString(),
          metadata: this.generateActivityMetadata(activity)
        });
      }
    }
    
    return activities;
  }

  generateActivityMetadata(activity) {
    const metadata = {
      sessionId: this.generateSessionId(),
      deviceType: Math.random() > 0.3 ? 'mobile' : 'desktop',
      culturalContext: Math.random() > 0.5 ? 'hindi' : 'default'
    };

    switch (activity) {
      case 'budget_created':
        metadata.budgetType = ['festival', 'monthly', 'emergency', 'investment'][Math.floor(Math.random() * 4)];
        metadata.amount = Math.floor(Math.random() * 50000) + 5000;
        break;
      case 'expense_added':
        metadata.category = ['food', 'transport', 'entertainment', 'bills', 'shopping'][Math.floor(Math.random() * 5)];
        metadata.amount = Math.floor(Math.random() * 2000) + 50;
        break;
      case 'emotional_checkin':
        metadata.mood = Math.floor(Math.random() * 10) + 1;
        metadata.stress = Math.floor(Math.random() * 10) + 1;
        metadata.confidence = Math.floor(Math.random() * 10) + 1;
        break;
      case 'tokens_earned':
        metadata.amount = [5, 10, 15, 20, 25, 50][Math.floor(Math.random() * 6)];
        metadata.reason = ['daily_login', 'expense_entry', 'budget_creation'][Math.floor(Math.random() * 3)];
        break;
    }

    return metadata;
  }

  generateSessionId() {
    return 'sess_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  generateAnalytics() {
    const analytics = {
      overview: {
        totalUsers: this.users.length,
        dailyActiveUsers: Math.floor(Math.random() * this.users.length) + Math.floor(this.users.length * 0.6),
        weeklyActiveUsers: this.users.length,
        monthlyActiveUsers: this.users.length,
        totalSessions: 0,
        totalBudgets: 0,
        totalExpenses: 0,
        totalEmotionalCheckins: 0,
        totalTokensEarned: 0,
        totalInvestments: 0,
        premiumUsers: Math.floor(this.users.length * 0.25),
        lastUpdated: new Date().toISOString()
      },
      users: [],
      dailyMetrics: [],
      recentActivity: []
    };

    // Generate activity for each user
    this.users.forEach(userName => {
      const userActivities = this.generateUserActivity(userName);
      analytics.users.push({
        name: userName,
        userId: 'usr_' + userName.toLowerCase().replace(/\s+/g, '_'),
        joinDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        totalSessions: userActivities.filter(a => a.activity === 'login').length,
        totalBudgets: userActivities.filter(a => a.activity === 'budget_created').length,
        totalExpenses: userActivities.filter(a => a.activity === 'expense_added').length,
        emotionalCheckins: userActivities.filter(a => a.activity === 'emotional_checkin').length,
        investmentCount: userActivities.filter(a => a.activity === 'investment_added').length,
        tokensEarned: userActivities.filter(a => a.activity === 'tokens_earned')
          .reduce((sum, a) => sum + (a.metadata.amount || 0), 0),
        plan: Math.random() > 0.75 ? 'PREMIUM' : 'FREE'
      });

      // Add to recent activity
      analytics.recentActivity.push(...userActivities.slice(-50));
    });

    // Calculate totals
    analytics.overview.totalSessions = analytics.users.reduce((sum, u) => sum + u.totalSessions, 0);
    analytics.overview.totalBudgets = analytics.users.reduce((sum, u) => sum + u.totalBudgets, 0);
    analytics.overview.totalExpenses = analytics.users.reduce((sum, u) => sum + u.totalExpenses, 0);
    analytics.overview.totalEmotionalCheckins = analytics.users.reduce((sum, u) => sum + u.emotionalCheckins, 0);
    analytics.overview.totalTokensEarned = analytics.users.reduce((sum, u) => sum + u.tokensEarned, 0);
    analytics.overview.totalInvestments = analytics.users.reduce((sum, u) => sum + u.investmentCount, 0);

    // Generate daily metrics for last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
      analytics.dailyMetrics.push({
        date: date.toISOString().split('T')[0],
        activeUsers: Math.floor(Math.random() * this.users.length * 0.8) + Math.floor(this.users.length * 0.2),
        newBudgets: Math.floor(Math.random() * 15) + 5,
        expenseEntries: Math.floor(Math.random() * 50) + 20,
        emotionalCheckins: Math.floor(Math.random() * 25) + 10,
        tokensEarned: Math.floor(Math.random() * 1000) + 500,
        newInvestments: Math.floor(Math.random() * 8) + 2
      });
    }

    // Sort recent activity by timestamp
    analytics.recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    analytics.recentActivity = analytics.recentActivity.slice(0, 100);

    return analytics;
  }

  seedAnalytics() {
    const analytics = this.generateAnalytics();
    localStorage.setItem('finsense_analytics', JSON.stringify(analytics));
    console.log('📊 Analytics seeded with', analytics.overview.totalUsers, 'users');
    return analytics;
  }

  getAnalytics() {
    const stored = localStorage.getItem('finsense_analytics');
    if (!stored) {
      return this.seedAnalytics();
    }

    const analytics = JSON.parse(stored);
    const lastUpdate = new Date(analytics.overview.lastUpdated);
    const hoursOld = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);

    // Refresh if older than 4 hours
    if (hoursOld > 4) {
      return this.seedAnalytics();
    }

    return analytics;
  }

  // Add new activity (for real-time simulation)
  addActivity(userName, activity, metadata = {}) {
    const analytics = this.getAnalytics();
    
    const newActivity = {
      user: userName,
      activity,
      timestamp: new Date().toISOString(),
      metadata: {
        sessionId: this.generateSessionId(),
        deviceType: 'web',
        ...metadata
      }
    };

    analytics.recentActivity.unshift(newActivity);
    analytics.recentActivity = analytics.recentActivity.slice(0, 100);

    // Update user stats
    const user = analytics.users.find(u => u.name === userName);
    if (user) {
      if (activity === 'budget_created') user.totalBudgets++;
      if (activity === 'expense_added') user.totalExpenses++;
      if (activity === 'emotional_checkin') user.emotionalCheckins++;
      if (activity === 'investment_added') user.investmentCount++;
      user.lastActive = new Date().toISOString();
    }

    // Update overview
    analytics.overview.lastUpdated = new Date().toISOString();
    
    localStorage.setItem('finsense_analytics', JSON.stringify(analytics));
    return analytics;
  }
}

export const analyticsSeeder = new AnalyticsSeeder();

export const generateAnalytics = () => {
  const today = new Date();
  const users = SAMPLE_USERS.map(user => ({
    ...user,
    id: Math.random().toString(36).substr(2, 9),
    lastLogin: new Date(today - Math.random() * 86400000).toISOString(),
    budgetsCreated: Math.floor(Math.random() * 5),
    emotionalCheckins: Math.floor(Math.random() * 10),
    tokensEarned: Math.floor(Math.random() * 1000),
    activities: Array(Math.floor(Math.random() * 5)).fill(null).map(() => ({
      type: ['budget', 'checkin', 'token', 'referral'][Math.floor(Math.random() * 4)],
      timestamp: new Date(today - Math.random() * 86400000).toISOString(),
      details: 'Activity details here'
    }))
  }));

  const analytics = {
    dailyActiveUsers: Math.floor(Math.random() * 5) + 4,
    budgetsCreated: users.reduce((sum, u) => sum + u.budgetsCreated, 0),
    emotionalCheckins: users.reduce((sum, u) => sum + u.emotionalCheckins, 0),
    tokensEarned: users.reduce((sum, u) => sum + u.tokensEarned, 0),
    users,
    lastUpdated: new Date().toISOString()
  };

  localStorage.setItem('finSence_analytics', JSON.stringify(analytics));
  return analytics;
};

// Auto-initialize analytics when module loads
if (typeof window !== 'undefined') {
  // Ensure analytics are seeded on first load
  setTimeout(() => {
    const existing = localStorage.getItem('finsense_analytics');
    if (!existing) {
      console.log('🎯 Seeding initial traction analytics...');
      analyticsSeeder.seedAnalytics();
    }
  }, 1000);
}
