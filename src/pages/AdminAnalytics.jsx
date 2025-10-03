import React, { useState, useEffect } from 'react';
import { analyticsSeeder } from '../utils/analyticsSeeder';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [selectedView, setSelectedView] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const data = analyticsSeeder.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const refreshAnalytics = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const data = analyticsSeeder.seedAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error refreshing analytics:', error);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading traction analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || !analytics.overview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No analytics data available</p>
          <button 
            onClick={refreshAnalytics}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN');

  const getActivityIcon = (activity) => {
    const icons = {
      login: '🔐', 
      budget_created: '💰', 
      expense_added: '📝',
      therapy_session: '🧠', 
      emotional_checkin: '😊', 
      festival_planning: '🎉',
      tokens_earned: '🪙', 
      performance_view: '📊', 
      investment_added: '📈'
    };
    return icons[activity] || '📱';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FinSense Traction Dashboard</h1>
              <p className="text-gray-600">Real-time business metrics and user engagement analytics</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={refreshAnalytics}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh Data
              </button>
              <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
                Last updated: {formatDate(analytics.overview.lastUpdated)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {['overview', 'users', 'activity'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`pb-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                  selectedView === view
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {view}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Daily Active Users</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.overview.dailyActiveUsers}</p>
                </div>
                <div className="text-2xl">👥</div>
              </div>
              <p className="text-sm text-green-600 mt-2">
                {Math.round((analytics.overview.dailyActiveUsers / analytics.overview.totalUsers) * 100)}% engagement
              </p>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budgets</p>
                  <p className="text-3xl font-bold text-green-600">{formatNumber(analytics.overview.totalBudgets)}</p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Avg {Math.round(analytics.overview.totalBudgets / analytics.overview.totalUsers)} per user
              </p>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emotional Check-ins</p>
                  <p className="text-3xl font-bold text-purple-600">{formatNumber(analytics.overview.totalEmotionalCheckins)}</p>
                </div>
                <div className="text-2xl">😊</div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Mental health engagement</p>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tokens Earned</p>
                  <p className="text-3xl font-bold text-orange-600">{formatNumber(analytics.overview.totalTokensEarned)}</p>
                </div>
                <div className="text-2xl">🪙</div>
              </div>
              <p className="text-sm text-gray-500 mt-2">FinCoins distributed</p>
            </div>
          </div>
        )}

        {/* Users */}
        {selectedView === 'users' && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">User Activity Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budgets</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-ins</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tokens</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.users && analytics.users.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.plan === 'PREMIUM' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.totalBudgets}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.emotionalCheckins}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(user.tokensEarned)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.lastActive)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Feed */}
        {selectedView === 'activity' && (
          <div className="bg-white rounded-xl border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {analytics.recentActivity && analytics.recentActivity.slice(0, 50).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{getActivityIcon(activity.activity)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        <span className="font-semibold text-blue-600">{activity.user}</span> {activity.activity.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString('en-IN')}
                        {activity.metadata && activity.metadata.amount && ` • Amount: ₹${activity.metadata.amount}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



        {/* Activity Feed */}
        {selectedView === 'activity' && (
          <div className="bg-white rounded-xl border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
              <p className="text-sm text-gray-500">Real-time user interactions across the platform</p>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {analytics.recentActivity.slice(0, 50).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{getActivityIcon(activity.activity)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        <span className="font-semibold text-blue-600">{activity.user}</span> {activity.activity.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString('en-IN')}
                        {activity.metadata.amount && ` • Amount: ₹${activity.metadata.amount}`}
                        {activity.metadata.category && ` • Category: ${activity.metadata.category}`}
                        {activity.metadata.budgetType && ` • Type: ${activity.metadata.budgetType}`}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {activity.metadata.deviceType}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Growth Trends */}
        {selectedView === 'growth' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends (Last 30 Days)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Daily Active Users</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {analytics.dailyMetrics.slice(-10).map((day) => (
                      <div key={day.date} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{formatDate(day.date)}</span>
                        <span className="font-medium">{day.activeUsers}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">New Investments Daily</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {analytics.dailyMetrics.slice(-10).map((day) => (
                      <div key={day.date} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{formatDate(day.date)}</span>
                        <span className="font-medium">{day.newInvestments}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Mental Health Sessions</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {analytics.dailyMetrics.slice(-10).map((day) => (
                      <div key={day.date} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{formatDate(day.date)}</span>
                        <span className="font-medium">{day.emotionalCheckins}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round((analytics.overview.dailyActiveUsers / analytics.overview.totalUsers) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Daily Engagement Rate</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((analytics.overview.premiumUsers / analytics.overview.totalUsers) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Premium Conversion</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(analytics.overview.totalInvestments / analytics.overview.totalUsers * 10) / 10}
                  </p>
                  <p className="text-sm text-gray-600">Avg Investments per User</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round((analytics.overview.totalEmotionalCheckins / analytics.overview.totalUsers) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Mental Health Adoption</p>
                </div>
              </div>
            </div>
          </div>
        )}
      

export default AdminAnalytics;
