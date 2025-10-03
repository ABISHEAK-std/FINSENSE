import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { tokenService } from '../../../services/TokenService';


const FestivalPlanningCard = ({ 
  festival, 
  culturalContext = 'default',
  onBudgetUpdate,
  onExpenseAdd,
  onExpenseDelete,
  onExpenseDeleteById, // New prop for better expense deletion
  userProfile = {}
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editableBudget, setEditableBudget] = useState(festival.budgetAllocated || 0);
  const [editableCategories, setEditableCategories] = useState(festival.categories || []);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    note: ''
  });

  // Sync with festival prop changes
  useEffect(() => {
    setEditableBudget(festival.budgetAllocated || 0);
    setEditableCategories(festival.categories || []);
  }, [festival.budgetAllocated, festival.categories]);

  // Enhanced category generator based on festival type
  const getDefaultCategories = (festivalId) => {
    const commonCategories = [
      { 
        id: 'decorations', 
        name: culturalContext === 'hindi' ? 'सजावट' : 'Decorations', 
        icon: 'Sparkles', 
        budget: 0 
      },
      { 
        id: 'food', 
        name: culturalContext === 'hindi' ? 'खाना-पीना' : 'Food & Drinks', 
        icon: 'Coffee', 
        budget: 0 
      },
      { 
        id: 'gifts', 
        name: culturalContext === 'hindi' ? 'उपहार' : 'Gifts', 
        icon: 'Gift', 
        budget: 0 
      },
      { 
        id: 'clothes', 
        name: culturalContext === 'hindi' ? 'कपड़े' : 'Clothes', 
        icon: 'Shirt', 
        budget: 0 
      },
      { 
        id: 'travel', 
        name: culturalContext === 'hindi' ? 'यात्रा' : 'Travel', 
        icon: 'Car', 
        budget: 0 
      }
    ];

    // Festival-specific additions
    const festivalSpecific = {
      'diwali': [
        { 
          id: 'sweets', 
          name: culturalContext === 'hindi' ? 'मिठाई' : 'Sweets', 
          icon: 'Cookie', 
          budget: 0 
        },
        { 
          id: 'firecrackers', 
          name: culturalContext === 'hindi' ? 'पटाखे' : 'Firecrackers', 
          icon: 'Zap', 
          budget: 0 
        }
      ],
      'holi': [
        { 
          id: 'colors', 
          name: culturalContext === 'hindi' ? 'रंग और गुलाल' : 'Colors & Gulal', 
          icon: 'Palette', 
          budget: 0 
        }
      ],
      'christmas': [
        { 
          id: 'tree', 
          name: culturalContext === 'hindi' ? 'क्रिसमस ट्री' : 'Christmas Tree', 
          icon: 'Tree', 
          budget: 0 
        },
        { 
          id: 'cards', 
          name: culturalContext === 'hindi' ? 'कार्ड' : 'Cards', 
          icon: 'Mail', 
          budget: 0 
        }
      ],
      'halloween': [
        { 
          id: 'costumes', 
          name: culturalContext === 'hindi' ? 'वेशभूषा' : 'Costumes', 
          icon: 'Mask', 
          budget: 0 
        },
        { 
          id: 'candy', 
          name: culturalContext === 'hindi' ? 'कैंडी' : 'Candy', 
          icon: 'Candy', 
          budget: 0 
        }
      ]
    };

    return [
      ...commonCategories,
      ...(festivalSpecific[festivalId] || [])
    ];
  };

  // Initialize categories if none exist
  useEffect(() => {
    if (!festival.categories || festival.categories.length === 0) {
      const defaultCategories = getDefaultCategories(festival.id);
      setEditableCategories(defaultCategories);
    }
  }, [festival.id, culturalContext]);

  // Calculate totals
  const totalSpent = festival.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const remainingBudget = editableBudget - totalSpent;
  const spentPercentage = editableBudget > 0 ? (totalSpent / editableBudget) * 100 : 0;
  const isOverBudget = totalSpent > editableBudget;

  // Calculate category-wise spending
  const getCategorySpending = (categoryId) => {
    return festival.expenses?.filter(expense => expense.category === categoryId)
      .reduce((sum, expense) => sum + expense.amount, 0) || 0;
  };

  // Enhanced budget calculation with festival-specific logic
  const calculateSuggestedBudget = () => {
    const monthlyIncome = userProfile?.salary || 50000;
    const region = userProfile?.region || 'north-indian';
    
    // Festival-specific multipliers (updated with more festivals)
    const festivalMultipliers = {
      // Indian festivals
      'diwali': 0.15,
      'holi': 0.08,
      'navratri': 0.12,
      'ganesh-chaturthi': 0.10,
      'raksha-bandhan': 0.06,
      'durga-puja': 0.14,
      'janmashtami': 0.07,
      'karva-chauth': 0.04,
      'eid-ul-fitr': 0.12,
      'pongal': 0.09,
      'onam': 0.10,
      'lohri': 0.05,
      'baisakhi': 0.08,
      'makar-sankranti': 0.06,
      // International festivals
      'christmas': 0.18,
      'new-year': 0.12,
      'thanksgiving': 0.10,
      'halloween': 0.06,
      'easter': 0.07,
      'chinese-new-year': 0.11,
      'ramadan': 0.10,
      'hanukkah': 0.08
    };
    
    // Regional multipliers
    const regionalMultipliers = {
      'north-indian': 1.0,
      'south-indian': 0.9,
      'west-indian': 1.1,
      'east-indian': 0.85,
      'central-indian': 0.9
    };
    
    const festivalMultiplier = festivalMultipliers[festival.id] || 0.10;
    const regionalMultiplier = regionalMultipliers[region] || 1.0;
    
    return Math.round(monthlyIncome * festivalMultiplier * regionalMultiplier);
  };

  // Enhanced auto-distribute budget logic
  const autoDistributeBudget = (totalBudget) => {
    if (!editableCategories.length) return;

    // Distribution weights by category
    const categoryWeights = {
      'decorations': 0.25,
      'food': 0.30,
      'gifts': 0.20,
      'clothes': 0.15,
      'travel': 0.10,
      'sweets': 0.15,
      'colors': 0.20,
      'firecrackers': 0.10,
      'tree': 0.15,
      'costumes': 0.25,
      'candy': 0.15
    };

    const updatedCategories = editableCategories.map(category => {
      const weight = categoryWeights[category.id] || 0.10;
      return {
        ...category,
        budget: Math.round(totalBudget * weight)
      };
    });

    setEditableCategories(updatedCategories);
  };

  const handleSaveBudget = () => {
    // Validate budget
    if (editableBudget < 0) {
      alert(culturalContext === 'hindi' ? 'बजट ऋणात्मक नहीं हो सकता' : 'Budget cannot be negative');
      return;
    }

    // Auto-distribute if categories have no budget
    const hasNoBudgets = editableCategories.every(cat => (cat.budget || 0) === 0);
    if (hasNoBudgets && editableBudget > 0) {
      autoDistributeBudget(editableBudget);
      // Wait for state update
      setTimeout(() => {
        onBudgetUpdate(editableBudget, editableCategories);
        setIsEditing(false);
         tokenService.addTokens(20, 'Festival Budget Added');
      }, 100);
    } else {
      onBudgetUpdate(editableBudget, editableCategories);
      setIsEditing(false);
       tokenService.addTokens(20, 'Festival Budget Added');
    }
  };

  const handleCategoryBudgetChange = (categoryId, newBudget) => {
    setEditableCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, budget: Number(newBudget) }
          : cat
      )
    );
  };

  const handleAddExpense = () => {
    // Validate expense
    if (!newExpense.amount || !newExpense.category) {
      alert(culturalContext === 'hindi' ? 'राशि और श्रेणी आवश्यक है' : 'Amount and category are required');
      return;
    }

    if (Number(newExpense.amount) <= 0) {
      alert(culturalContext === 'hindi' ? 'राशि शून्य से अधिक होनी चाहिए' : 'Amount must be greater than zero');
      return;
    }
    
    const expense = {
      id: Date.now() + Math.random(), // Ensure unique ID
      amount: Number(newExpense.amount),
      category: newExpense.category,
      note: newExpense.note || '',
      date: new Date().toISOString(),
      festivalId: festival.id
    };
    
    onExpenseAdd(expense);
    setNewExpense({ amount: '', category: '', note: '' });
    setShowExpenseForm(false);
  };

  const handleDeleteExpense = (expense, index) => {
    if (window.confirm(culturalContext === 'hindi' 
      ? 'क्या आप इस खर्च को हटाना चाहते हैं?' 
      : 'Are you sure you want to delete this expense?')) {
      
      // Use ID-based deletion if available, otherwise fall back to index
      if (expense.id && onExpenseDeleteById) {
        onExpenseDeleteById(expense.id);
      } else if (onExpenseDelete) {
        onExpenseDelete(index);
      }
    }
  };

  // Add reset functionality
  const handleReset = () => {
    if (window.confirm(culturalContext === 'hindi' 
      ? 'क्या आप वाकई इस त्योहार का बजट रीसेट करना चाहते हैं?' 
      : 'Are you sure you want to reset this festival\'s budget?')) {
      setEditableBudget(0);
      setEditableCategories(festival.categories.map(cat => ({...cat, budget: 0})));
      onBudgetUpdate(festival.id, 0, []);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressBarColor = () => {
    if (isOverBudget) return 'bg-red-500';
    if (spentPercentage > 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-card rounded-xl border shadow-soft p-6">
      {/* Enhanced Festival Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10`}>
            <Icon name={festival.icon} size={24} className={festival.colorClass} />
          </div>
          <div>
            <h3 className="text-lg font-heading text-foreground">{festival.name}</h3>
            <p className="text-sm text-muted-foreground">{festival.date}</p>
            <p className="text-xs text-muted-foreground mt-1">{festival.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {editableBudget === 0 && (
            <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {culturalContext === 'hindi' ? 'बजट सेट करें' : 'Set Budget'}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExpenseForm(true)}
            iconName="Plus"
            iconPosition="left"
            disabled={editableBudget === 0}
          >
            {culturalContext === 'hindi' ? 'खर्च जोड़ें' : 'Add Expense'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            iconName="Edit"
          />
        </div>
      </div>

      {/* Show setup prompt if no budget */}
      {editableBudget === 0 && !isEditing ? (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
          <Icon name="PlusCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">
            {culturalContext === 'hindi' ? 'पहली बार बजट बनाएं' : 'Create Your First Budget'}
          </h4>
          <p className="text-muted-foreground mb-4">
            {culturalContext === 'hindi' 
              ? `${festival.name} के लिए बजट सेट करें और अपने खर्च को ट्रैक करें`
              : `Set a budget for ${festival.name} and track your expenses`
            }
          </p>
          <Button onClick={() => setIsEditing(true)}>
            {culturalContext === 'hindi' ? 'बजट शुरू करें' : 'Start Budget'}
          </Button>
        </div>
      ) : (
        <>
          {/* Budget Overview - existing code with enhanced auto-suggestion */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {culturalContext === 'hindi' ? 'बजट अवलोकन' : 'Budget Overview'}
              </span>
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={editableBudget}
                    onChange={(e) => setEditableBudget(Number(e.target.value))}
                    className="w-28 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Budget"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const suggested = calculateSuggestedBudget();
                      setEditableBudget(suggested);
                    }}
                  >
                    {culturalContext === 'hindi' ? 'सुझाव' : 'Suggest'}
                  </Button>
                  <Button size="sm" onClick={handleSaveBudget}>
                    {culturalContext === 'hindi' ? 'सेव' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {culturalContext === 'hindi' ? 'कुल बजट' : 'Total Budget'}
                </p>
                <p className="text-lg font-semibold text-primary">{formatCurrency(editableBudget)}</p>
              </div>
              <div className="text-center p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {culturalContext === 'hindi' ? 'खर्च हुआ' : 'Spent'}
                </p>
                <p className={`text-lg font-semibold ${isOverBudget ? 'text-red-600' : 'text-secondary'}`}>
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {culturalContext === 'hindi' ? 'बचा हुआ' : 'Remaining'}
                </p>
                <p className={`text-lg font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(remainingBudget)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>{culturalContext === 'hindi' ? 'खर्च प्रगति' : 'Spending Progress'}</span>
                <span>{spentPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
              {isOverBudget && (
                <p className="text-xs text-red-600 mt-1 flex items-center">
                  <Icon name="AlertTriangle" size={12} className="mr-1" />
                  {culturalContext === 'hindi' ? 'बजट से अधिक खर्च!' : 'Budget exceeded!'}
                </p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              {culturalContext === 'hindi' ? 'श्रेणी-वार बजट' : 'Category-wise Budget'}
            </h4>
            
            {editableCategories.map((category) => {
              const categorySpent = getCategorySpending(category.id);
              const categoryRemaining = category.budget - categorySpent;
              const categoryPercentage = category.budget > 0 ? (categorySpent / category.budget) * 100 : 0;
              
              return (
                <div key={category.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name={category.icon} size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      {isEditing ? (
                        <input
                          type="number"
                          value={category.budget}
                          onChange={(e) => handleCategoryBudgetChange(category.id, e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      ) : (
                        <span className="text-muted-foreground">{formatCurrency(category.budget)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{culturalContext === 'hindi' ? 'खर्च' : 'Spent'}: {formatCurrency(categorySpent)}</span>
                    <span>{culturalContext === 'hindi' ? 'बचा' : 'Left'}: {formatCurrency(categoryRemaining)}</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        categorySpent > category.budget ? 'bg-red-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Expenses */}
          {festival.expenses && festival.expenses.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center justify-between">
                <span>{culturalContext === 'hindi' ? 'हाल के खर्च' : 'Recent Expenses'}</span>
                <span className="text-xs text-muted-foreground">
                  {festival.expenses.length} {culturalContext === 'hindi' ? 'कुल' : 'total'}
                </span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {festival.expenses.slice(-5).map((expense, index) => (
                  <div key={expense.id || index} className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{formatCurrency(expense.amount)}</span>
                        <span className="text-muted-foreground">
                          {editableCategories.find(cat => cat.id === expense.category)?.name || expense.category}
                        </span>
                      </div>
                      {expense.note && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{expense.note}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(expense, festival.expenses.length - 1 - index)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      title={culturalContext === 'hindi' ? 'खर्च हटाएं' : 'Delete expense'}
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              {festival.expenses.length > 5 && (
                <div className="mt-2 text-center">
                  <span className="text-xs text-muted-foreground">
                    {culturalContext === 'hindi' 
                      ? `${festival.expenses.length - 5} और खर्च`
                      : `${festival.expenses.length - 5} more expenses`
                    }
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Add Expense Modal with better validation */}
          {showExpenseForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading">
                    {culturalContext === 'hindi' ? 'खर्च जोड़ें' : 'Add Expense'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowExpenseForm(false);
                      setNewExpense({ amount: '', category: '', note: '' });
                    }}
                    iconName="X"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {culturalContext === 'hindi' ? 'राशि *' : 'Amount *'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={culturalContext === 'hindi' ? 'राशि दर्ज करें' : 'Enter amount'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {culturalContext === 'hindi' ? 'श्रेणी *' : 'Category *'}
                    </label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{culturalContext === 'hindi' ? 'श्रेणी चुनें' : 'Select category'}</option>
                      {editableCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {culturalContext === 'hindi' ? 'नोट (वैकल्पिक)' : 'Note (Optional)'}
                    </label>
                    <input
                      type="text"
                      maxLength="100"
                      value={newExpense.note}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, note: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={culturalContext === 'hindi' ? 'विवरण दर्ज करें' : 'Enter description'}
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowExpenseForm(false);
                        setNewExpense({ amount: '', category: '', note: '' });
                      }}
                    >
                      {culturalContext === 'hindi' ? 'रद्द करें' : 'Cancel'}
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleAddExpense}
                      disabled={!newExpense.amount || !newExpense.category || Number(newExpense.amount) <= 0}
                    >
                      {culturalContext === 'hindi' ? 'जोड़ें' : 'Add'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ...existing expense modal code... */}
    </div>
  );
};

export default FestivalPlanningCard;