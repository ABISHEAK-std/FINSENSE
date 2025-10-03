import React from 'react';
import Icon from '../../../components/AppIcon';

const FestivalSidebar = ({ 
  festivals, 
  selectedFestival, 
  onFestivalSelect, 
  culturalContext,
  savedBudgets 
}) => {
  const formatBudgetStatus = (festivalId) => {
    const budget = savedBudgets[festivalId];
    if (!budget || budget.budgetAllocated === 0) {
      return culturalContext === 'hindi' ? 'बजट सेट नहीं' : 'No budget set';
    }
    
    const spent = budget.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
    const remaining = budget.budgetAllocated - spent;
    
    if (remaining < 0) {
      return culturalContext === 'hindi' 
        ? `₹${Math.abs(remaining).toLocaleString()} अधिक` 
        : `₹${Math.abs(remaining).toLocaleString()} over`;
    }
    
    return `₹${Math.round(remaining).toLocaleString()}`;
  };

  const getBudgetStatusColor = (festivalId) => {
    const budget = savedBudgets?.[festivalId];
    if (!budget || !budget.budgetAllocated || budget.budgetAllocated === 0) {
      return 'text-muted-foreground';
    }
    
    const spent = budget.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
    const remaining = budget.budgetAllocated - spent;
    
    if (remaining < 0) return 'text-red-500';
    if (remaining < budget.budgetAllocated * 0.2) return 'text-yellow-500';
    return 'text-green-500';
  };

  const FestivalItem = ({ festival }) => (
    <button
      onClick={() => onFestivalSelect(festival)}
      className={`w-full text-left p-3 rounded-lg border transition-ui ${
        selectedFestival?.id === festival.id
          ? 'bg-primary/10 border-primary text-primary'
          : 'bg-card border-border hover:bg-muted/50 text-foreground'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10`}>
          <Icon name={festival.icon} size={16} className={festival.colorClass} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{festival.name}</h4>
          <p className="text-xs text-muted-foreground truncate">{festival.date}</p>
          <p className={`text-xs ${getBudgetStatusColor(festival.id)}`}>
            {formatBudgetStatus(festival.id)}
          </p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-heading text-foreground">
          {culturalContext === 'hindi' ? 'त्योहार चुनें' : 'Select Festival'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {culturalContext === 'hindi' ? 'बजट बनाने के लिए त्योहार चुनें' : 'Choose a festival to create budget'}
        </p>
      </div>

      {/* Festival List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Indian Festivals */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="MapPin" size={16} className="mr-2" />
            {culturalContext === 'hindi' ? 'भारतीय त्योहार' : 'Indian Festivals'}
          </h3>
          <div className="space-y-2">
            {festivals.filter(f => 
              f.category === 'Indian Festivals' || 
              f.category === 'indian' || 
              f.category === 'Indian'
            ).map(festival => (
              <FestivalItem key={festival.id} festival={festival} />
            ))}
          </div>
        </div>

        {/* International Festivals */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="Globe" size={16} className="mr-2" />
            {culturalContext === 'hindi' ? 'अंतर्राष्ट्रीय त्योहार' : 'International Festivals'}
          </h3>
          <div className="space-y-2">
            {festivals.filter(f => 
              f.category === 'International Festivals' || 
              f.category === 'international' || 
              f.category === 'International'
            ).map(festival => (
              <FestivalItem key={festival.id} festival={festival} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {culturalContext === 'hindi' 
            ? `कुल त्योहार: ${festivals.length}`
            : `Total festivals: ${festivals.length}`
          }
        </div>
      </div>
    </div>
  );
};

export default FestivalSidebar;