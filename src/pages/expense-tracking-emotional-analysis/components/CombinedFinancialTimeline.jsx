import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CombinedFinancialTimeline = ({ 
  expenses = [], 
  incomes = [],
  culturalContext = 'default',
  onExpenseClick,
  onIncomeClick,
  onDeleteExpense,
  onDeleteIncome,
  onEditExpense,
  onEditIncome,
  onDuplicateExpense,
  onDuplicateIncome
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'emotion'

  // Combine and sort all financial entries
  const combinedEntries = useMemo(() => {
    const allEntries = [
      ...expenses.map(expense => ({
        ...expense,
        type: 'expense',
        originalData: expense
      })),
      ...incomes.map(income => ({
        ...income,
        type: 'income',
        originalData: income
      }))
    ];

    // Filter entries
    let filtered = allEntries;
    if (filter === 'income') {
      filtered = allEntries.filter(entry => entry.type === 'income');
    } else if (filter === 'expense') {
      filtered = allEntries.filter(entry => entry.type === 'expense');
    }

    // Sort entries
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'emotion':
          return a.emotion?.localeCompare(b.emotion) || 0;
        case 'date':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });
  }, [expenses, incomes, filter, sortBy]);

  const getEmotionIcon = (emotion) => {
    const emotionIcons = {
      happy: '😊',
      grateful: '🙏',
      proud: '🏆',
      relieved: '😌',
      excited: '🤩',
      calm: '😌',
      motivated: '💪',
      stressed: '😰',
      sad: '😢',
      angry: '😠',
      anxious: '😟',
      guilty: '😔',
      neutral: '😐'
    };
    return emotionIcons[emotion] || '😐';
  };

  const getTypeIcon = (type) => {
    return type === 'income' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTypeColor = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getTypeBgColor = (type) => {
    return type === 'income' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return culturalContext === 'hindi' ? 'कल' : 'Yesterday';
    } else if (diffDays === 0) {
      return culturalContext === 'hindi' ? 'आज' : 'Today';
    } else if (diffDays < 7) {
      return culturalContext === 'hindi' ? `${diffDays} दिन पहले` : `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getCategoryLabel = (entry) => {
    if (entry.type === 'income') {
      const sourceLabels = {
        salary: culturalContext === 'hindi' ? 'वेतन' : 'Salary',
        freelance: culturalContext === 'hindi' ? 'फ्रीलांस' : 'Freelance',
        business: culturalContext === 'hindi' ? 'व्यापार' : 'Business',
        investment: culturalContext === 'hindi' ? 'निवेश' : 'Investment',
        rental: culturalContext === 'hindi' ? 'किराया' : 'Rental',
        gift: culturalContext === 'hindi' ? 'उपहार' : 'Gift',
        bonus: culturalContext === 'hindi' ? 'बोनस' : 'Bonus',
        other: culturalContext === 'hindi' ? 'अन्य' : 'Other'
      };
      return sourceLabels[entry.source] || entry.source;
    } else {
      const categoryLabels = {
        food: culturalContext === 'hindi' ? 'भोजन' : 'Food',
        transport: culturalContext === 'hindi' ? 'परिवहन' : 'Transport',
        festival: culturalContext === 'hindi' ? 'त्योहार' : 'Festival',
        family: culturalContext === 'hindi' ? 'पारिवारिक' : 'Family',
        healthcare: culturalContext === 'hindi' ? 'स्वास्थ्य' : 'Healthcare',
        education: culturalContext === 'hindi' ? 'शिक्षा' : 'Education',
        traditional: culturalContext === 'hindi' ? 'पारंपरिक' : 'Traditional',
        entertainment: culturalContext === 'hindi' ? 'मनोरंजन' : 'Entertainment',
        shopping: culturalContext === 'hindi' ? 'खरीदारी' : 'Shopping',
        utilities: culturalContext === 'hindi' ? 'उपयोगिताएं' : 'Utilities'
      };
      return categoryLabels[entry.category] || entry.category;
    }
  };

  const getEmotionLabel = (emotion) => {
    const emotionLabels = {
      happy: culturalContext === 'hindi' ? 'खुश' : 'Happy',
      grateful: culturalContext === 'hindi' ? 'आभारी' : 'Grateful',
      proud: culturalContext === 'hindi' ? 'गर्व' : 'Proud',
      relieved: culturalContext === 'hindi' ? 'राहत' : 'Relieved',
      excited: culturalContext === 'hindi' ? 'उत्साहित' : 'Excited',
      calm: culturalContext === 'hindi' ? 'शांत' : 'Calm',
      motivated: culturalContext === 'hindi' ? 'प्रेरित' : 'Motivated',
      stressed: culturalContext === 'hindi' ? 'तनावग्रस्त' : 'Stressed',
      sad: culturalContext === 'hindi' ? 'उदास' : 'Sad',
      angry: culturalContext === 'hindi' ? 'गुस्सा' : 'Angry',
      anxious: culturalContext === 'hindi' ? 'चिंतित' : 'Anxious',
      guilty: culturalContext === 'hindi' ? 'अपराधबोध' : 'Guilty',
      neutral: culturalContext === 'hindi' ? 'तटस्थ' : 'Neutral'
    };
    return emotionLabels[emotion] || emotion;
  };

  if (combinedEntries.length === 0) {
    return (
      <div className="bg-card rounded-xl border shadow-soft p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Receipt" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'कोई वित्तीय प्रविष्टि नहीं' : 'No Financial Entries'}
        </h3>
        <p className="text-muted-foreground">
          {culturalContext === 'hindi' 
            ? 'अपनी आय और खर्च को ट्रैक करना शुरू करें' 
            : 'Start tracking your income and expenses'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Icon name="Receipt" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'वित्तीय समयरेखा' : 'Financial Timeline'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' ? 'आय और खर्च का इतिहास' : 'History of income and expenses'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {culturalContext === 'hindi' ? 'सभी' : 'All'}
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'income' ? 'bg-green-500 text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {culturalContext === 'hindi' ? 'आय' : 'Income'}
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'expense' ? 'bg-red-500 text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {culturalContext === 'hindi' ? 'खर्च' : 'Expense'}
          </button>
        </div>

        <Select
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'date', label: culturalContext === 'hindi' ? 'तारीख' : 'Date' },
            { value: 'amount', label: culturalContext === 'hindi' ? 'राशि' : 'Amount' },
            { value: 'emotion', label: culturalContext === 'hindi' ? 'भावना' : 'Emotion' }
          ]}
          className="min-w-[120px]"
        />
      </div>

      {/* Timeline Entries */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {combinedEntries.map((entry, index) => (
          <div
            key={`${entry.type}-${entry.id}`}
            className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
              entry.type === 'income' 
                ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' 
                : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
            }`}
            onClick={() => entry.type === 'income' ? onIncomeClick?.(entry.originalData) : onExpenseClick?.(entry.originalData)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  entry.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <Icon name={getTypeIcon(entry.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-sm font-medium ${getTypeColor(entry.type)}`}>
                      {getCategoryLabel(entry)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                  
                  {entry.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {entry.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-foreground">
                      {formatAmount(entry.amount)}
                    </span>
                    
                    {entry.emotion && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{getEmotionIcon(entry.emotion)}</span>
                        <span className="text-xs text-muted-foreground">
                          {getEmotionLabel(entry.emotion)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    entry.type === 'income' ? onEditIncome?.(entry.originalData) : onEditExpense?.(entry.originalData);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Icon name="Edit" size={14} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    entry.type === 'income' ? onDuplicateIncome?.(entry.originalData) : onDuplicateExpense?.(entry.originalData);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Icon name="Copy" size={14} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    entry.type === 'income' ? onDeleteIncome?.(entry.id) : onDeleteExpense?.(entry.id);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(incomes.reduce((sum, income) => sum + income.amount, 0))}
            </div>
            <div className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' ? 'कुल आय' : 'Total Income'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatAmount(expenses.reduce((sum, expense) => sum + expense.amount, 0))}
            </div>
            <div className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' ? 'कुल खर्च' : 'Total Expenses'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedFinancialTimeline;
