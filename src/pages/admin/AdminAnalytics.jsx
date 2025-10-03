import React, { useState, useEffect } from 'react';
import { analyticsSeeder } from '../../utils/analyticsSeeder';
import Icon from '../../components/AppIcon';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const data = analyticsSeeder.getAnalytics();
    setAnalytics(data);
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">FinSence Analytics Dashboard</h1>
          <button 
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg"
          >
            <Icon name="RefreshCw" size={16} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Daily Active Users', value: analytics.overview.dailyActiveUsers, icon: 'Users' },
            { label: 'Total Budgets', value: analytics.overview.totalBudgets, icon: 'PieChart' },
            { label: 'Total Tokens', value: analytics.overview.totalTokensEarned, icon: 'Award' }
          ].map(metric => (
            <div key={metric.label} className="bg-card p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <Icon name={metric.icon} size={24} className="text-primary" />
                <span className="text-2xl font-bold">{metric.value}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-card p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {analytics.recentActivity.slice(0, 10).map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.activity.replace(/_/g, ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User List */}
        <div className="bg-card p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">Active Users</h2>
          <div className="space-y-4">
            {analytics.users.map((user, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.plan} • Last active: {new Date(user.lastActive).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{user.tokensEarned} tokens</p>
                  <p className="text-xs text-muted-foreground">{user.totalBudgets} budgets</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
