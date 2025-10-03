import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TraditionalInvestmentTracker = ({ 
  investments, 
  onInvestmentUpdate,
  culturalContext = 'default',
  className = '' 
}) => {
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getInvestmentTypeColor = (type) => {
    const colors = {
      gold: 'text-yellow-600',
      silver: 'text-gray-500',
      property: 'text-green-600',
      jewelry: 'text-purple-600',
      antiques: 'text-amber-600',
      land: 'text-emerald-600'
    };
    return colors?.[type] || 'text-primary';
  };

  const getInvestmentIcon = (type) => {
    const icons = {
      gold: 'Coins',
      silver: 'Circle',
      property: 'Home',
      jewelry: 'Crown',
      antiques: 'Gem',
      land: 'MapPin'
    };
    return icons?.[type] || 'TrendingUp';
  };

  const calculateReturns = (investment) => {
    const returns = investment?.currentValue - investment?.purchaseValue;
    const percentage = (returns / investment?.purchaseValue) * 100;
    return { returns, percentage };
  };

  const getTotalPortfolioValue = () => {
    return investments?.reduce((total, inv) => total + inv?.currentValue, 0);
  };

  const getTotalInvestment = () => {
    return investments?.reduce((total, inv) => total + inv?.purchaseValue, 0);
  };

  const renderInvestmentCard = (investment) => {
    const { returns, percentage } = calculateReturns(investment);
    const isPositive = returns >= 0;

    return (
      <div 
        key={investment?.id}
        className="glass-card rounded-lg p-4 cursor-pointer transition-ui hover:shadow-soft-hover"
        onClick={() => setSelectedInvestment(investment)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted/30`}>
              <Icon 
                name={getInvestmentIcon(investment?.type)} 
                size={20} 
                className={getInvestmentTypeColor(investment?.type)} 
              />
            </div>
            <div>
              <h4 className="text-base font-medium text-foreground">{investment?.name}</h4>
              <p className="text-xs text-muted-foreground">{investment?.type} • {investment?.location}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}>
            {isPositive ? '+' : ''}{percentage?.toFixed(1)}%
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {culturalContext === 'hindi' ? 'खरीद मूल्य' : 'Purchase Value'}
            </span>
            <span className="font-medium text-foreground">
              {formatCurrency(investment?.purchaseValue)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {culturalContext === 'hindi' ? 'वर्तमान मूल्य' : 'Current Value'}
            </span>
            <span className="font-medium text-foreground">
              {formatCurrency(investment?.currentValue)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {culturalContext === 'hindi' ? 'लाभ/हानि' : 'Gain/Loss'}
            </span>
            <span className={`font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
              {isPositive ? '+' : ''}{formatCurrency(returns)}
            </span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {culturalContext === 'hindi' ? 'खरीदा गया' : 'Purchased'}: {investment?.purchaseDate}
            </span>
            <span>
              {culturalContext === 'hindi' ? 'अपडेट' : 'Updated'}: {investment?.lastUpdated}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailModal = () => {
    if (!selectedInvestment) return null;

    const { returns, percentage } = calculateReturns(selectedInvestment);
    const isPositive = returns >= 0;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedInvestment(null)}
        />
        <div className="relative w-full max-w-md mx-4 glass-card rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-border/20">
            <h2 className="text-lg font-heading text-foreground">{selectedInvestment?.name}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedInvestment(null)}
              iconName="X"
              iconSize={20}
            />
          </div>

          <div className="p-6 space-y-4">
            {/* Investment Image */}
            {selectedInvestment?.image && (
              <div className="w-full h-32 rounded-lg overflow-hidden bg-muted/30">
                <img 
                  src={selectedInvestment?.image} 
                  alt={selectedInvestment?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Investment Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {culturalContext === 'hindi' ? 'प्रकार' : 'Type'}
                </span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {selectedInvestment?.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {culturalContext === 'hindi' ? 'स्थान' : 'Location'}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {selectedInvestment?.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {culturalContext === 'hindi' ? 'मात्रा/आकार' : 'Quantity/Size'}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {selectedInvestment?.quantity}
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-lg bg-muted/20">
              <h3 className="text-base font-medium text-foreground mb-3">
                {culturalContext === 'hindi' ? 'वित्तीय सारांश' : 'Financial Summary'}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {culturalContext === 'hindi' ? 'खरीद मूल्य' : 'Purchase Value'}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(selectedInvestment?.purchaseValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {culturalContext === 'hindi' ? 'वर्तमान मूल्य' : 'Current Value'}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(selectedInvestment?.currentValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {culturalContext === 'hindi' ? 'कुल रिटर्न' : 'Total Return'}
                  </span>
                  <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(returns)} ({percentage?.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            {selectedInvestment?.description && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  {culturalContext === 'hindi' ? 'विवरण' : 'Description'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedInvestment?.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                iconPosition="left"
                className="flex-1"
              >
                {culturalContext === 'hindi' ? 'संपादित करें' : 'Edit'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="TrendingUp"
                iconPosition="left"
                className="flex-1"
              >
                {culturalContext === 'hindi' ? 'मूल्य अपडेट करें' : 'Update Value'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`glass-card rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading text-foreground">
            {culturalContext === 'hindi' ? 'पारंपरिक निवेश' : 'Traditional Investments'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' ?'सोना, चांदी, संपत्ति और अन्य पारंपरिक संपत्तियां' :'Gold, Silver, Property and other traditional assets'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            iconName="Grid3X3"
            iconSize={16}
          />
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            iconName="List"
            iconSize={16}
          />
        </div>
      </div>
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Wallet" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {culturalContext === 'hindi' ? 'कुल निवेश' : 'Total Investment'}
            </span>
          </div>
          <p className="text-2xl font-heading text-primary">
            {formatCurrency(getTotalInvestment())}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={20} className="text-success" />
            <span className="text-sm font-medium text-success">
              {culturalContext === 'hindi' ? 'वर्तमान मूल्य' : 'Current Value'}
            </span>
          </div>
          <p className="text-2xl font-heading text-success">
            {formatCurrency(getTotalPortfolioValue())}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={20} className="text-warning" />
            <span className="text-sm font-medium text-warning">
              {culturalContext === 'hindi' ? 'कुल रिटर्न' : 'Total Returns'}
            </span>
          </div>
          <p className="text-2xl font-heading text-warning">
            {formatCurrency(getTotalPortfolioValue() - getTotalInvestment())}
          </p>
        </div>
      </div>
      {/* Investments Grid/List */}
      <div className={`
        ${viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' :'space-y-4'
        }
      `}>
        {investments?.map(renderInvestmentCard)}
      </div>
      {/* Add Investment Button */}
      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          iconName="Plus"
          iconPosition="left"
        >
          {culturalContext === 'hindi' ? 'नया निवेश जोड़ें' : 'Add New Investment'}
        </Button>
      </div>
      {/* Detail Modal */}
      {renderDetailModal()}
    </div>
  );
};

export default TraditionalInvestmentTracker;