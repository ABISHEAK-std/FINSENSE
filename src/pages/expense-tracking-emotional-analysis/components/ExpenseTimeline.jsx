import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExpenseTimeline = ({ 
  expenses = [], 
  culturalContext = 'default',
  onExpenseClick,
  onDeleteExpense,
  onEditExpense,
  onDuplicateExpense,
  className = '' 
}) => {
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [isPlaying, setIsPlaying] = useState(null);

  useEffect(() => {
    let filtered = [...expenses];
    
    // Filter by date
    if (selectedDate !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (selectedDate) {
        case 'today':
          filtered = filtered?.filter(expense => 
            new Date(expense.timestamp)?.toDateString() === today?.toDateString()
          );
          break;
        case 'week':
          filterDate?.setDate(today?.getDate() - 7);
          filtered = filtered?.filter(expense => 
            new Date(expense.timestamp) >= filterDate
          );
          break;
        case 'month':
          filterDate?.setMonth(today?.getMonth() - 1);
          filtered = filtered?.filter(expense => 
            new Date(expense.timestamp) >= filterDate
          );
          break;
      }
    }
    
    // Filter by emotion
    if (selectedEmotion !== 'all') {
      filtered = filtered?.filter(expense => expense?.emotion === selectedEmotion);
    }
    
    // Sort by timestamp (newest first)
    filtered?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredExpenses(filtered);
  }, [expenses, selectedDate, selectedEmotion]);

  // Format numbers in Indian style (e.g., 1,00,000)
  const formatIndianNumber = (amount) => {
    const numStr = amount?.toString();
    const lastThree = numStr?.substring(numStr?.length - 3);
    const otherNumbers = numStr?.substring(0, numStr?.length - 3);
    if (otherNumbers !== '') {
      return otherNumbers?.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    } else {
      return lastThree;
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      food: 'UtensilsCrossed',
      transport: 'Car',
      festival: 'Sparkles',
      family: 'Users',
      healthcare: 'Heart',
      education: 'BookOpen',
      traditional: 'Crown',
      entertainment: 'Film',
      shopping: 'ShoppingBag',
      utilities: 'Zap'
    };
    return iconMap?.[category] || 'Receipt';
  };

  const getEmotionColor = (emotion) => {
    const colorMap = {
      happy: 'text-green-500',
      stressed: 'text-red-500',
      excited: 'text-purple-500',
      sad: 'text-blue-500',
      angry: 'text-orange-500',
      calm: 'text-teal-500',
      anxious: 'text-yellow-500',
      guilty: 'text-gray-500'
    };
    return colorMap?.[emotion] || 'text-muted-foreground';
  };

  const getEmotionEmoji = (emotion) => {
    const emojiMap = {
      happy: '😊',
      stressed: '😰',
      excited: '🤩',
      sad: '😢',
      angry: '😠',
      calm: '😌',
      anxious: '😟',
      guilty: '😔'
    };
    return emojiMap?.[emotion] || '😐';
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const expenseTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - expenseTime) / (1000 * 60));
    
    if (culturalContext === 'hindi') {
      if (diffInMinutes < 1) return 'अभी';
      if (diffInMinutes < 60) return `${diffInMinutes} मिनट पहले`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} घंटे पहले`;
      return `${Math.floor(diffInMinutes / 1440)} दिन पहले`;
    }
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const playVoiceNote = (expenseId) => {
    setIsPlaying(expenseId);
    setTimeout(() => {
      setIsPlaying(null);
    }, 3000);
  };

  const getDateFilterOptions = () => {
    if (culturalContext === 'hindi') {
      return [
        { value: 'all', label: 'सभी' },
        { value: 'today', label: 'आज' },
        { value: 'week', label: 'इस सप्ताह' },
        { value: 'month', label: 'इस महीने' }
      ];
    }
    return [
      { value: 'all', label: 'All Time' },
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' }
    ];
  };

  const getEmotionFilterOptions = () => {
    if (culturalContext === 'hindi') {
      return [
        { value: 'all', label: 'सभी भावनाएं' },
        { value: 'happy', label: '😊 खुश' },
        { value: 'stressed', label: '😰 तनावग्रस्त' },
        { value: 'excited', label: '🤩 उत्साहित' },
        { value: 'sad', label: '😢 उदास' },
        { value: 'angry', label: '😠 गुस्सा' },
        { value: 'calm', label: '😌 शांत' },
        { value: 'anxious', label: '😟 चिंतित' },
        { value: 'guilty', label: '😔 अपराधबोध' }
      ];
    }
    return [
      { value: 'all', label: 'All Emotions' },
      { value: 'happy', label: '😊 Happy' },
      { value: 'stressed', label: '😰 Stressed' },
      { value: 'excited', label: '🤩 Excited' },
      { value: 'sad', label: '😢 Sad' },
      { value: 'angry', label: '😠 Angry' },
      { value: 'calm', label: '😌 Calm' },
      { value: 'anxious', label: '😟 Anxious' },
      { value: 'guilty', label: '😔 Guilty' }
    ];
  };

  const dateOptions = getDateFilterOptions();
  const emotionOptions = getEmotionFilterOptions();

  return (
    <div className={`bg-card rounded-xl border shadow-soft ${className}`}>
      {/* Header with Filters */}
      <div className="p-6 border-b border-border/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-heading text-foreground">
                {culturalContext === 'hindi' ? 'खर्च की समयरेखा' : 'Expense Timeline'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' 
                  ? `${filteredExpenses?.length} खर्च मिले`
                  : `${filteredExpenses?.length} expenses found`
                }
              </p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e?.target?.value)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {dateOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>

            <select
              value={selectedEmotion}
              onChange={(e) => setSelectedEmotion(e?.target?.value)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {emotionOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="p-6">
        {filteredExpenses?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {culturalContext === 'hindi' ? 'कोई खर्च नहीं मिला' : 'No Expenses Found'}
            </h3>
            <p className="text-muted-foreground">
              {culturalContext === 'hindi'
                ? 'चुने गए फिल्टर के लिए कोई खर्च नहीं मिला।'
                : 'No expenses found for the selected filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExpenses?.map((expense, index) => (
              <div
                key={expense?.id}
                className="relative flex items-start space-x-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/20 transition-ui cursor-pointer"
                onClick={() => onExpenseClick?.(expense)}
              >
                {/* Timeline Line */}
                {index < filteredExpenses?.length - 1 && (
                  <div className="absolute left-8 top-16 w-px h-8 bg-border/30" />
                )}

                {/* Category Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon 
                    name={getCategoryIcon(expense?.category)} 
                    size={20} 
                    className="text-primary" 
                  />
                </div>

                {/* Expense Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-base font-medium text-foreground">
                          ₹{formatIndianNumber(expense?.amount)}
                        </h3>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground capitalize">
                          {expense?.category}
                        </span>
                      </div>
                      
                      {expense?.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {expense?.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4">
                        {/* Emotional State */}
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getEmotionEmoji(expense?.emotion)}</span>
                          <span className={`text-sm font-medium ${getEmotionColor(expense?.emotion)}`}>
                            {expense?.emotion}
                          </span>
                        </div>

                        {/* Timestamp */}
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(expense?.timestamp)}
                        </span>

                        {/* Voice Note */}
                        {expense?.voiceNote && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e?.stopPropagation();
                              playVoiceNote(expense?.id);
                            }}
                            iconName={isPlaying === expense?.id ? "Pause" : "Play"}
                            iconSize={14}
                            className={`text-xs ${isPlaying === expense?.id ? 'text-primary' : 'text-muted-foreground'}`}
                          >
                            {culturalContext === 'hindi' ? 'आवाज़' : 'Voice'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Action Menu */}
                    <div className="flex items-center space-x-1">
                      {onEditExpense && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e?.stopPropagation();
                            onEditExpense(expense?.id);
                          }}
                          iconName="Edit"
                          iconSize={14}
                          className="text-primary/70 hover:text-primary hover:bg-primary/10"
                          title={culturalContext === 'hindi' ? 'खर्च संपादित करें' : 'Edit expense'}
                        />
                      )}
                      {onDuplicateExpense && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e?.stopPropagation();
                            onDuplicateExpense(expense?.id);
                          }}
                          iconName="Copy"
                          iconSize={14}
                          className="text-secondary/70 hover:text-secondary hover:bg-secondary/10"
                          title={culturalContext === 'hindi' ? 'खर्च डुप्लिकेट करें' : 'Duplicate expense'}
                        />
                      )}
                      {onDeleteExpense && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e?.stopPropagation();
                            onDeleteExpense(expense?.id);
                          }}
                          iconName="Trash2"
                          iconSize={14}
                          className="text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                          title={culturalContext === 'hindi' ? 'खर्च मिटाएं' : 'Delete expense'}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          // Handle other expense actions
                        }}
                        iconName="MoreHorizontal"
                        iconSize={16}
                        className="text-muted-foreground hover:text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredExpenses?.length > 0 && (
        <div className="p-6 border-t border-border/20">
          <Button
            variant="outline"
            onClick={() => {
              // Handle load more
            }}
            iconName="ChevronDown"
            iconPosition="right"
            className="w-full"
          >
            {culturalContext === 'hindi' ? 'और लोड करें' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpenseTimeline;