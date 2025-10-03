import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const HoldingsGrid = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  className = '' 
}) => {
  const [holdings, setHoldings] = useState([]);
  const [sortBy, setSortBy] = useState('value');
  const [filterBy, setFilterBy] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock holdings data with Indian investment preferences
    setTimeout(() => {
      setHoldings([
        {
          id: 1,
          name: 'HDFC Bank',
          symbol: 'HDFCBANK',
          type: 'equity',
          quantity: 50,
          currentPrice: 1580,
          avgPrice: 1420,
          totalValue: 79000,
          gainLoss: 8000,
          gainLossPercent: 11.27,
          emotionalConfidence: 85,
          culturalRelevance: 'high',
          icon: 'Building2'
        },
        {
          id: 2,
          name: 'Gold ETF',
          symbol: 'GOLDBEES',
          type: 'commodity',
          quantity: 200,
          currentPrice: 52,
          avgPrice: 48,
          totalValue: 10400,
          gainLoss: 800,
          gainLossPercent: 8.33,
          emotionalConfidence: 92,
          culturalRelevance: 'very_high',
          icon: 'Coins'
        },
        {
          id: 3,
          name: 'Reliance Industries',
          symbol: 'RELIANCE',
          type: 'equity',
          quantity: 25,
          currentPrice: 2450,
          avgPrice: 2380,
          totalValue: 61250,
          gainLoss: 1750,
          gainLossPercent: 2.94,
          emotionalConfidence: 78,
          culturalRelevance: 'high',
          icon: 'Factory'
        },
        {
          id: 4,
          name: 'SBI Mutual Fund',
          symbol: 'SBIMF',
          type: 'mutual_fund',
          quantity: 1000,
          currentPrice: 45.5,
          avgPrice: 42,
          totalValue: 45500,
          gainLoss: 3500,
          gainLossPercent: 8.33,
          emotionalConfidence: 80,
          culturalRelevance: 'medium',
          icon: 'PieChart'
        },
        {
          id: 5,
          name: 'Real Estate Fund',
          symbol: 'REIT',
          type: 'real_estate',
          quantity: 100,
          currentPrice: 320,
          avgPrice: 300,
          totalValue: 32000,
          gainLoss: 2000,
          gainLossPercent: 6.67,
          emotionalConfidence: 88,
          culturalRelevance: 'very_high',
          icon: 'Home'
        },
        {
          id: 6,
          name: 'Infosys',
          symbol: 'INFY',
          type: 'equity',
          quantity: 40,
          currentPrice: 1650,
          avgPrice: 1580,
          totalValue: 66000,
          gainLoss: 2800,
          gainLossPercent: 4.43,
          emotionalConfidence: 75,
          culturalRelevance: 'high',
          icon: 'Code'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'equity': return 'TrendingUp';
      case 'commodity': return 'Coins';
      case 'mutual_fund': return 'PieChart';
      case 'real_estate': return 'Home';
      default: return 'DollarSign';
    }
  };

  const getTypeLabel = (type) => {
    if (culturalContext === 'hindi') {
      switch (type) {
        case 'equity': return 'इक्विटी';
        case 'commodity': return 'कमोडिटी';
        case 'mutual_fund': return 'म्यूचुअल फंड';
        case 'real_estate': return 'रियल एस्टेट';
        default: return 'अन्य';
      }
    }
    switch (type) {
      case 'equity': return 'Equity';
      case 'commodity': return 'Commodity';
      case 'mutual_fund': return 'Mutual Fund';
      case 'real_estate': return 'Real Estate';
      default: return 'Other';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return 'text-success';
    if (confidence >= 70) return 'text-primary';
    if (confidence >= 50) return 'text-warning';
    return 'text-error';
  };

  const getCulturalRelevanceColor = (relevance) => {
    switch (relevance) {
      case 'very_high': return 'text-success';
      case 'high': return 'text-primary';
      case 'medium': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const sortedAndFilteredHoldings = holdings?.filter(holding => filterBy === 'all' || holding?.type === filterBy)?.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b?.totalValue - a?.totalValue;
        case 'gain':
          return b?.gainLossPercent - a?.gainLossPercent;
        case 'confidence':
          return b?.emotionalConfidence - a?.emotionalConfidence;
        case 'name':
          return a?.name?.localeCompare(b?.name);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(6)]?.map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="value">
              {culturalContext === 'hindi' ? 'मूल्य के अनुसार' : 'Sort by Value'}
            </option>
            <option value="gain">
              {culturalContext === 'hindi' ? 'लाभ के अनुसार' : 'Sort by Gain'}
            </option>
            <option value="confidence">
              {culturalContext === 'hindi' ? 'विश्वास के अनुसार' : 'Sort by Confidence'}
            </option>
            <option value="name">
              {culturalContext === 'hindi' ? 'नाम के अनुसार' : 'Sort by Name'}
            </option>
          </select>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e?.target?.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">
              {culturalContext === 'hindi' ? 'सभी' : 'All Types'}
            </option>
            <option value="equity">
              {culturalContext === 'hindi' ? 'इक्विटी' : 'Equity'}
            </option>
            <option value="commodity">
              {culturalContext === 'hindi' ? 'कमोडिटी' : 'Commodity'}
            </option>
            <option value="mutual_fund">
              {culturalContext === 'hindi' ? 'म्यूचुअल फंड' : 'Mutual Fund'}
            </option>
            <option value="real_estate">
              {culturalContext === 'hindi' ? 'रियल एस्टेट' : 'Real Estate'}
            </option>
          </select>
        </div>
      </div>
      {/* Holdings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedAndFilteredHoldings?.map((holding) => (
          <div key={holding?.id} className="glass-card rounded-xl p-4 hover:shadow-soft-hover transition-ui">
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name={holding?.icon} size={24} className="text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground truncate">
                      {holding?.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {holding?.symbol}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {getTypeLabel(holding?.type)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      {formatCurrency(holding?.totalValue)}
                    </div>
                    <div className={`text-sm font-medium ${
                      holding?.gainLoss >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      {holding?.gainLoss >= 0 ? '+' : ''}{formatCurrency(holding?.gainLoss)}
                      ({holding?.gainLossPercent > 0 ? '+' : ''}{holding?.gainLossPercent}%)
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      {culturalContext === 'hindi' ? 'मात्रा:' : 'Quantity:'}
                    </span>
                    <span className="ml-1 text-foreground font-medium">
                      {holding?.quantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {culturalContext === 'hindi' ? 'वर्तमान मूल्य:' : 'Current Price:'}
                    </span>
                    <span className="ml-1 text-foreground font-medium">
                      ₹{holding?.currentPrice}
                    </span>
                  </div>
                </div>

                {/* Emotional Indicators */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                  <div className="flex items-center space-x-2">
                    <Icon name="Brain" size={14} className={getConfidenceColor(holding?.emotionalConfidence)} />
                    <span className="text-sm text-muted-foreground">
                      {culturalContext === 'hindi' ? 'विश्वास:' : 'Confidence:'}
                    </span>
                    <span className={`text-sm font-medium ${getConfidenceColor(holding?.emotionalConfidence)}`}>
                      {holding?.emotionalConfidence}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Star" size={14} className={getCulturalRelevanceColor(holding?.culturalRelevance)} />
                    <span className="text-sm text-muted-foreground">
                      {culturalContext === 'hindi' ? 'सांस्कृतिक:' : 'Cultural:'}
                    </span>
                    <span className={`text-sm font-medium ${getCulturalRelevanceColor(holding?.culturalRelevance)}`}>
                      {holding?.culturalRelevance === 'very_high' ? 
                        (culturalContext === 'hindi' ? 'उच्च' : 'High') :
                        holding?.culturalRelevance === 'high' ?
                        (culturalContext === 'hindi' ? 'अच्छा' : 'Good') :
                        (culturalContext === 'hindi' ? 'मध्यम' : 'Medium')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sortedAndFilteredHoldings?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {culturalContext === 'hindi' ? 'कोई होल्डिंग नहीं मिली' : 'No Holdings Found'}
          </h3>
          <p className="text-muted-foreground">
            {culturalContext === 'hindi' ?'फिल्टर बदलकर देखें या नई होल्डिंग जोड़ें' :'Try changing filters or add new holdings'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default HoldingsGrid;