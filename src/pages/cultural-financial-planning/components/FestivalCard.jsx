import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FestivalCard = ({ festival, culturalContext, budgetData, onSelect }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBudgetStatus = () => {
    if (!budgetData || budgetData.budgetAllocated === 0) {
      return {
        status: 'not-set',
        text: culturalContext === 'hindi' ? 'बजट सेट नहीं' : 'No budget set',
        color: 'text-muted-foreground'
      };
    }

    const spent = budgetData.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
    const remaining = budgetData.budgetAllocated - spent;
    const percentage = (spent / budgetData.budgetAllocated) * 100;

    if (remaining < 0) {
      return {
        status: 'over-budget',
        text: culturalContext === 'hindi' 
          ? `₹${Math.abs(remaining).toLocaleString()} अधिक`
          : `₹${Math.abs(remaining).toLocaleString()} over`,
        color: 'text-red-500'
      };
    }

    if (percentage > 80) {
      return {
        status: 'warning',
        text: culturalContext === 'hindi' 
          ? `₹${remaining.toLocaleString()} बचे`
          : `₹${remaining.toLocaleString()} left`,
        color: 'text-yellow-500'
      };
    }

    return {
      status: 'good',
      text: culturalContext === 'hindi' 
        ? `₹${remaining.toLocaleString()} बचे`
        : `₹${remaining.toLocaleString()} left`,
      color: 'text-green-500'
    };
  };

  const status = getBudgetStatus();

  return (
    <div className="bg-card rounded-xl border shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Festival Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10`}>
              <Icon name={festival.icon} size={24} className={festival.colorClass} />
            </div>
            <div>
              <h3 className="text-lg font-heading text-foreground">{festival.name}</h3>
              <p className="text-sm text-muted-foreground">{festival.date}</p>
            </div>
          </div>
          {status.status !== 'not-set' && (
            <div className={`px-2 py-1 rounded text-xs font-medium ${status.color} bg-current/10`}>
              {status.text}
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {festival.description}
        </p>

        {/* Budget Overview */}
        {budgetData && budgetData.budgetAllocated > 0 ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {culturalContext === 'hindi' ? 'बजट:' : 'Budget:'}
              </span>
              <span className="font-medium">{formatCurrency(budgetData.budgetAllocated)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {culturalContext === 'hindi' ? 'खर्च:' : 'Spent:'}
              </span>
              <span className="font-medium">
                {formatCurrency(budgetData.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  status.status === 'over-budget' ? 'bg-red-500' :
                  status.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ 
                  width: `${Math.min(
                    ((budgetData.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0) / budgetData.budgetAllocated) * 100, 
                    100
                  )}%` 
                }}
              />
            </div>

            {budgetData.expenses && budgetData.expenses.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {budgetData.expenses.length} {culturalContext === 'hindi' ? 'खर्च' : 'expenses'}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 border-2 border-dashed border-border rounded-lg">
            <Icon name="PlusCircle" size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' ? 'बजट सेट करें' : 'Set budget to start'}
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <Button
          onClick={onSelect}
          className="w-full"
          variant={budgetData && budgetData.budgetAllocated > 0 ? 'default' : 'outline'}
        >
          {budgetData && budgetData.budgetAllocated > 0 
            ? (culturalContext === 'hindi' ? 'प्रबंधित करें' : 'Manage')
            : (culturalContext === 'hindi' ? 'योजना शुरू करें' : 'Start Planning')
          }
        </Button>
      </div>

      {/* Cultural Tip */}
      {festival.traditionTip && (
        <div className="px-6 pb-6 pt-0">
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={14} className="text-primary mt-0.5" />
              <p className="text-xs text-primary/80">{festival.traditionTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalCard;
