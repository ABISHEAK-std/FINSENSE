import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Analytics = ({ festivalBudgets, festivals, culturalContext, userProfile }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const analyticsData = useMemo(() => {
    const data = {
      totalBudgeted: 0,
      totalSpent: 0,
      totalFestivals: 0,
      averageSpending: 0,
      topSpendingFestivals: [],
      categoryBreakdown: {},
      monthlyTrend: [],
      savingsRate: 0
    };

    // Handle cases where festivalBudgets might be null/undefined
    if (!festivalBudgets || typeof festivalBudgets !== 'object') {
      return data;
    }

    Object.entries(festivalBudgets).forEach(([festivalId, budget]) => {
      // Better validation of budget data
      if (!budget || typeof budget !== 'object') return;
      
      const budgetAmount = Number(budget.budgetAllocated) || 0;
      
      if (budgetAmount > 0) {
        data.totalBudgeted += budgetAmount;
        data.totalFestivals += 1;

        // Safer expense calculation
        const expenses = Array.isArray(budget.expenses) ? budget.expenses : [];
        const spent = expenses.reduce((sum, exp) => {
          const amount = Number(exp?.amount) || 0;
          return sum + amount;
        }, 0);
        
        data.totalSpent += spent;

        // Track top spending festivals
        const festival = festivals?.find(f => f.id === festivalId);
        if (festival) {
          data.topSpendingFestivals.push({
            name: festival.name || 'Unknown Festival',
            budgeted: budgetAmount,
            spent: spent,
            remaining: budgetAmount - spent,
            festivalId: festivalId
          });
        }

        // Category breakdown with better error handling
        expenses.forEach(expense => {
          if (!expense || !expense.category) return;
          
          const category = expense.category;
          const amount = Number(expense.amount) || 0;
          
          if (!data.categoryBreakdown[category]) {
            data.categoryBreakdown[category] = 0;
          }
          data.categoryBreakdown[category] += amount;
        });
      }
    });

    // Calculate averages and rates
    data.averageSpending = data.totalFestivals > 0 ? data.totalSpent / data.totalFestivals : 0;
    data.savingsRate = data.totalBudgeted > 0 ? ((data.totalBudgeted - data.totalSpent) / data.totalBudgeted) * 100 : 0;
    
    // Sort top spending festivals
    data.topSpendingFestivals.sort((a, b) => b.spent - a.spent);

    return data;
  }, [festivalBudgets, festivals]);

  const getSpendingInsights = () => {
    const insights = [];
    
    if (analyticsData.totalFestivals === 0) {
      insights.push({
        type: 'suggestion',
        message: culturalContext === 'hindi' 
          ? 'त्योहार बजट बनाना शुरू करें और अपने खर्च को ट्रैक करें।'
          : 'Start creating festival budgets to track your spending.'
      });
      return insights;
    }
    
    if (analyticsData.savingsRate > 20) {
      insights.push({
        type: 'positive',
        message: culturalContext === 'hindi' 
          ? 'बहुत अच्छा! आप अपने त्योहार बजट में बचत कर रहे हैं।'
          : 'Great! You\'re saving well within your festival budgets.'
      });
    } else if (analyticsData.savingsRate < 0) {
      insights.push({
        type: 'warning',
        message: culturalContext === 'hindi' 
          ? 'सावधान! आप अपने बजट से अधिक खर्च कर रहे हैं।'
          : 'Warning! You\'re overspending your budgets.'
      });
    } else if (analyticsData.savingsRate < 10) {
      insights.push({
        type: 'suggestion',
        message: culturalContext === 'hindi' 
          ? 'अपने त्योहार बजट को थोड़ा बढ़ाने पर विचार करें।'
          : 'Consider increasing your festival budgets slightly.'
      });
    }

    if (analyticsData.totalFestivals < 3) {
      insights.push({
        type: 'suggestion',
        message: culturalContext === 'hindi' 
          ? 'अधिक त्योहारों के लिए बजट बनाकर बेहतर योजना बनाएं।'
          : 'Plan better by budgeting for more festivals.'
      });
    }

    // Check if spending is too concentrated in one category
    const topCategory = Object.entries(analyticsData.categoryBreakdown)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topCategory && topCategory[1] > analyticsData.totalSpent * 0.6) {
      insights.push({
        type: 'suggestion',
        message: culturalContext === 'hindi' 
          ? `${topCategory[0]} में ज्यादा खर्च हो रहा है। संतुलन बनाने की कोशिश करें।`
          : `High spending in ${topCategory[0]}. Try to balance your expenses.`
      });
    }

    return insights;
  };

  const insights = getSpendingInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading text-foreground">
            {culturalContext === 'hindi' ? 'त्योहार विश्लेषण' : 'Festival Analytics'}
          </h2>
          <p className="text-muted-foreground">
            {culturalContext === 'hindi' 
              ? 'आपके त्योहार खर्च की विस्तृत रिपोर्ट'
              : 'Detailed insights into your festival spending'
            }
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => {
              // Implement download functionality
              console.log('Download report');
            }}
          >
            {culturalContext === 'hindi' ? 'रिपोर्ट डाउनलोड' : 'Download Report'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(analyticsData.totalBudgeted)}
              </p>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'कुल बजट' : 'Total Budgeted'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(analyticsData.totalSpent)}
              </p>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'कुल खर्च' : 'Total Spent'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {analyticsData.totalFestivals}
              </p>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'त्योहार बजट' : 'Festivals Budgeted'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              analyticsData.savingsRate >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Icon 
                name={analyticsData.savingsRate >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                size={24} 
                className={analyticsData.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'} 
              />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                analyticsData.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analyticsData.savingsRate.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'बचत दर' : 'Savings Rate'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-heading text-foreground mb-4">
            {culturalContext === 'hindi' ? 'मुख्य अंतर्दृष्टि' : 'Key Insights'}
          </h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                insight.type === 'positive' ? 'bg-green-50 border-green-200' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start space-x-2">
                  <Icon 
                    name={
                      insight.type === 'positive' ? 'CheckCircle' :
                      insight.type === 'warning' ? 'AlertTriangle' : 'Lightbulb'
                    }
                    size={16}
                    className={
                      insight.type === 'positive' ? 'text-green-600' :
                      insight.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }
                  />
                  <p className={`text-sm ${
                    insight.type === 'positive' ? 'text-green-700' :
                    insight.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                  }`}>
                    {insight.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Spending Festivals */}
      {analyticsData.topSpendingFestivals.length > 0 && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-heading text-foreground mb-4">
            {culturalContext === 'hindi' ? 'सबसे ज्यादा खर्च वाले त्योहार' : 'Top Spending Festivals'}
          </h3>
          <div className="space-y-3">
            {analyticsData.topSpendingFestivals.slice(0, 5).map((festival, index) => (
              <div key={festival.festivalId || index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">{festival.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {culturalContext === 'hindi' ? 'बजट' : 'Budget'}: {formatCurrency(festival.budgeted)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{formatCurrency(festival.spent)}</p>
                  <p className={`text-sm ${festival.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {festival.remaining >= 0 ? '+' : ''}{formatCurrency(festival.remaining)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {Object.keys(analyticsData.categoryBreakdown).length > 0 && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-heading text-foreground mb-4">
            {culturalContext === 'hindi' ? 'श्रेणी-वार खर्च' : 'Category-wise Spending'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analyticsData.categoryBreakdown)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => {
                const percentage = analyticsData.totalSpent > 0 
                  ? ((amount / analyticsData.totalSpent) * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={category} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <span className="text-foreground capitalize">{category}</span>
                      <p className="text-xs text-muted-foreground">{percentage}% of total</p>
                    </div>
                    <span className="font-medium text-foreground">{formatCurrency(amount)}</span>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {analyticsData.totalFestivals > 0 && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-heading text-foreground mb-4">
            {culturalContext === 'hindi' ? 'सारांश आंकड़े' : 'Summary Statistics'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-lg font-medium text-foreground">
                {formatCurrency(analyticsData.averageSpending)}
              </p>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'औसत खर्च प्रति त्योहार' : 'Average Spending per Festival'}
              </p>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-lg">
              <p className="text-lg font-medium text-foreground">
                {formatCurrency(analyticsData.totalBudgeted - analyticsData.totalSpent)}
              </p>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'कुल बचत' : 'Total Savings'}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-lg font-medium text-foreground">
                {Object.keys(analyticsData.categoryBreakdown).length}
              </p>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'खर्च श्रेणियां' : 'Expense Categories'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {analyticsData.totalFestivals === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Icon name="BarChart" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">
            {culturalContext === 'hindi' ? 'कोई डेटा उपलब्ध नहीं' : 'No Data Available'}
          </h4>
          <p className="text-muted-foreground mb-4">
            {culturalContext === 'hindi' 
              ? 'विश्लेषण देखने के लिए पहले त्योहार बजट बनाएं'
              : 'Create festival budgets first to see analytics'
            }
          </p>
          <Button variant="outline">
            {culturalContext === 'hindi' ? 'त्योहार जोड़ें' : 'Add Festivals'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Analytics;

