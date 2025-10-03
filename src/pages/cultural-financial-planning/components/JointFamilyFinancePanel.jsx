import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JointFamilyFinancePanel = ({ 
  familyData, 
  onContributionUpdate,
  culturalContext = 'default',
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getTabs = () => {
    if (culturalContext === 'hindi') {
      return [
        { id: 'overview', label: 'सारांश', icon: 'Home' },
        { id: 'members', label: 'सदस्य', icon: 'Users' },
        { id: 'expenses', label: 'खर्च', icon: 'Receipt' },
        { id: 'contributions', label: 'योगदान', icon: 'PiggyBank' }
      ];
    }
    return [
      { id: 'overview', label: 'Overview', icon: 'Home' },
      { id: 'members', label: 'Members', icon: 'Users' },
      { id: 'expenses', label: 'Expenses', icon: 'Receipt' },
      { id: 'contributions', label: 'Contributions', icon: 'PiggyBank' }
    ];
  };

  const tabs = getTabs();

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Family Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={20} className="text-success" />
            <span className="text-sm font-medium text-success">
              {culturalContext === 'hindi' ? 'कुल आय' : 'Total Income'}
            </span>
          </div>
          <p className="text-2xl font-heading text-success">
            {formatCurrency(familyData?.totalIncome)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingDown" size={20} className="text-warning" />
            <span className="text-sm font-medium text-warning">
              {culturalContext === 'hindi' ? 'कुल खर्च' : 'Total Expenses'}
            </span>
          </div>
          <p className="text-2xl font-heading text-warning">
            {formatCurrency(familyData?.totalExpenses)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="PiggyBank" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {culturalContext === 'hindi' ? 'कुल बचत' : 'Total Savings'}
            </span>
          </div>
          <p className="text-2xl font-heading text-primary">
            {formatCurrency(familyData?.totalIncome - familyData?.totalExpenses)}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-lg font-heading text-foreground mb-3">
          {culturalContext === 'hindi' ? 'हाल की गतिविधियां' : 'Recent Activities'}
        </h3>
        <div className="space-y-3">
          {familyData?.recentTransactions?.map((transaction) => (
            <div key={transaction?.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction?.type === 'income' ? 'bg-success/20' : 'bg-warning/20'
                }`}>
                  <Icon 
                    name={transaction?.type === 'income' ? 'ArrowUp' : 'ArrowDown'} 
                    size={16} 
                    className={transaction?.type === 'income' ? 'text-success' : 'text-warning'} 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction?.member} • {transaction?.date}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                transaction?.type === 'income' ? 'text-success' : 'text-warning'
              }`}>
                {transaction?.type === 'income' ? '+' : '-'}{formatCurrency(transaction?.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading text-foreground">
          {culturalContext === 'hindi' ? 'परिवारिक सदस्य' : 'Family Members'}
        </h3>
        <Button
          variant="outline"
          size="sm"
          iconName="UserPlus"
          iconPosition="left"
        >
          {culturalContext === 'hindi' ? 'सदस्य जोड़ें' : 'Add Member'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {familyData?.members?.map((member) => (
          <div key={member?.id} className="glass-card rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {member?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="text-base font-medium text-foreground">{member?.name}</h4>
                <p className="text-sm text-muted-foreground">{member?.role}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {culturalContext === 'hindi' ? 'मासिक योगदान' : 'Monthly Contribution'}
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(member?.monthlyContribution)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {culturalContext === 'hindi' ? 'इस महीने खर्च' : 'This Month Expenses'}
                </span>
                <span className="font-medium text-warning">
                  {formatCurrency(member?.monthlyExpenses)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {culturalContext === 'hindi' ? 'बचत दर' : 'Savings Rate'}
                </span>
                <span className="font-medium text-success">
                  {((member?.monthlyContribution - member?.monthlyExpenses) / member?.monthlyContribution * 100)?.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex space-x-2 mt-3">
              <Button
                variant="outline"
                size="xs"
                iconName="Edit"
                iconPosition="left"
                className="flex-1"
                onClick={() => setSelectedMember(member)}
              >
                {culturalContext === 'hindi' ? 'संपादित करें' : 'Edit'}
              </Button>
              <Button
                variant="outline"
                size="xs"
                iconName="BarChart3"
                iconPosition="left"
                className="flex-1"
              >
                {culturalContext === 'hindi' ? 'रिपोर्ट' : 'Report'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading text-foreground">
          {culturalContext === 'hindi' ? 'साझा खर्च' : 'Shared Expenses'}
        </h3>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setIsAddingExpense(true)}
        >
          {culturalContext === 'hindi' ? 'खर्च जोड़ें' : 'Add Expense'}
        </Button>
      </div>

      {/* Expense Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyData?.expenseCategories?.map((category) => (
          <div key={category?.id} className="glass-card rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category?.colorClass} bg-opacity-20`}>
                <Icon name={category?.icon} size={20} className={category?.colorClass} />
              </div>
              <div>
                <h4 className="text-base font-medium text-foreground">{category?.name}</h4>
                <p className="text-xs text-muted-foreground">{category?.description}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {culturalContext === 'hindi' ? 'बजट' : 'Budget'}
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(category?.budget)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {culturalContext === 'hindi' ? 'खर्च किया गया' : 'Spent'}
                </span>
                <span className="font-medium text-warning">
                  {formatCurrency(category?.spent)}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    category?.spent > category?.budget ? 'bg-error' : 'bg-gradient-to-r from-primary to-secondary'
                  }`}
                  style={{ width: `${Math.min((category?.spent / category?.budget) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContributions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-heading text-foreground">
        {culturalContext === 'hindi' ? 'योगदान प्रबंधन' : 'Contribution Management'}
      </h3>

      {/* Contribution Rules */}
      <div className="glass-card rounded-lg p-4">
        <h4 className="text-base font-medium text-foreground mb-3">
          {culturalContext === 'hindi' ? 'योगदान नियम' : 'Contribution Rules'}
        </h4>
        <div className="space-y-3">
          {familyData?.contributionRules?.map((rule) => (
            <div key={rule?.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <p className="text-sm font-medium text-foreground">{rule?.name}</p>
                <p className="text-xs text-muted-foreground">{rule?.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-primary">
                  {rule?.percentage}%
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Edit"
                  iconSize={14}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Contribution Summary */}
      <div className="glass-card rounded-lg p-4">
        <h4 className="text-base font-medium text-foreground mb-3">
          {culturalContext === 'hindi' ? 'मासिक योगदान सारांश' : 'Monthly Contribution Summary'}
        </h4>
        <div className="space-y-3">
          {familyData?.members?.map((member) => (
            <div key={member?.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {member?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{member?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {culturalContext === 'hindi' ? 'स्थिति' : 'Status'}: {member?.contributionStatus}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(member?.monthlyContribution)}
                </p>
                <p className={`text-xs ${
                  member?.contributionStatus === 'paid' ? 'text-success' : 'text-warning'
                }`}>
                  {member?.contributionStatus === 'paid' 
                    ? (culturalContext === 'hindi' ? 'भुगतान किया गया' : 'Paid')
                    : (culturalContext === 'hindi' ? 'बकाया' : 'Pending')
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`glass-card rounded-xl p-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted/30 rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-ui flex-1 justify-center
              ${activeTab === tab?.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'expenses' && renderExpenses()}
        {activeTab === 'contributions' && renderContributions()}
      </div>
    </div>
  );
};

export default JointFamilyFinancePanel;