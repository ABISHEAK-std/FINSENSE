import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioOverviewCard = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  className = '' 
}) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [emotionalConfidence, setEmotionalConfidence] = useState(75);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading portfolio data
    setTimeout(() => {
      setPortfolioData({
        totalValue: 1250000,
        todayChange: 15750,
        todayChangePercent: 1.28,
        totalGainLoss: 185000,
        totalGainLossPercent: 17.4,
        emotionalRiskScore: 6.8,
        lastUpdated: new Date()
      });
      setIsLoading(false);
    }, 1500);
  }, []);

  const getEmotionalColor = () => {
    switch (emotionalState) {
      case 'stressed':
        return 'text-warning';
      case 'positive':
        return 'text-success';
      case 'calm':
      default:
        return 'text-primary';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-primary';
    if (confidence >= 40) return 'text-warning';
    return 'text-error';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getCulturalGreeting = () => {
    if (culturalContext === 'hindi') {
      return 'आपका निवेश पोर्टफोलियो';
    }
    return 'Your Investment Portfolio';
  };

  if (isLoading) {
    return (
      <div className={`glass-card rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-xl p-6 transition-emotional ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading text-foreground mb-1">
            {getCulturalGreeting()}
          </h2>
          <p className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' 
              ? `अंतिम अपडेट: ${portfolioData?.lastUpdated?.toLocaleTimeString('hi-IN')}`
              : `Last updated: ${portfolioData?.lastUpdated?.toLocaleTimeString()}`
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getEmotionalColor()} bg-current animate-pulse`} />
          <span className="text-sm font-medium capitalize text-muted-foreground">
            {emotionalState}
          </span>
        </div>
      </div>
      {/* Portfolio Value */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-2 mb-2">
          <h3 className="text-3xl font-bold text-foreground">
            {formatCurrency(portfolioData?.totalValue)}
          </h3>
          <div className={`flex items-center space-x-1 ${
            portfolioData?.todayChange >= 0 ? 'text-success' : 'text-error'
          }`}>
            <Icon 
              name={portfolioData?.todayChange >= 0 ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
            />
            <span className="text-sm font-medium">
              {formatCurrency(Math.abs(portfolioData?.todayChange))} 
              ({portfolioData?.todayChangePercent > 0 ? '+' : ''}{portfolioData?.todayChangePercent}%)
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {culturalContext === 'hindi' ? 'आज का बदलाव' : 'Today\'s change'}
        </p>
      </div>
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Gain/Loss */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {culturalContext === 'hindi' ? 'कुल लाभ/हानि' : 'Total Gain/Loss'}
            </span>
          </div>
          <div className={`text-lg font-bold ${
            portfolioData?.totalGainLoss >= 0 ? 'text-success' : 'text-error'
          }`}>
            {formatCurrency(portfolioData?.totalGainLoss)}
          </div>
          <div className="text-sm text-muted-foreground">
            {portfolioData?.totalGainLossPercent > 0 ? '+' : ''}{portfolioData?.totalGainLossPercent}%
          </div>
        </div>

        {/* Emotional Confidence */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Brain" size={16} className={getEmotionalColor()} />
            <span className="text-sm font-medium text-muted-foreground">
              {culturalContext === 'hindi' ? 'भावनात्मक विश्वास' : 'Emotional Confidence'}
            </span>
          </div>
          <div className={`text-lg font-bold ${getConfidenceColor(emotionalConfidence)}`}>
            {emotionalConfidence}%
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                getConfidenceColor(emotionalConfidence)?.replace('text-', 'bg-')
              }`}
              style={{ width: `${emotionalConfidence}%` }}
            />
          </div>
        </div>

        {/* Risk Score */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {culturalContext === 'hindi' ? 'जोखिम स्कोर' : 'Risk Score'}
            </span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {portfolioData?.emotionalRiskScore}/10
          </div>
          <div className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' ? 'मध्यम जोखिम' : 'Moderate Risk'}
          </div>
        </div>
      </div>
      {/* Emotional State Indicator */}
      <div className={`p-4 rounded-lg border transition-ui ${
        emotionalState === 'stressed' ?'bg-warning/10 border-warning/20' 
          : emotionalState === 'positive' ?'bg-success/10 border-success/20' :'bg-primary/10 border-primary/20'
      }`}>
        <div className="flex items-center space-x-3">
          <Icon 
            name={
              emotionalState === 'stressed' ? 'AlertTriangle' :
              emotionalState === 'positive' ? 'Smile' : 'Heart'
            } 
            size={20} 
            className={getEmotionalColor()} 
          />
          <div className="flex-1">
            <h4 className={`font-medium ${getEmotionalColor()}`}>
              {culturalContext === 'hindi' 
                ? emotionalState === 'stressed' ?'तनावग्रस्त अवस्था में निवेश सलाह'
                  : emotionalState === 'positive' ?'सकारात्मक मूड - निवेश के लिए अच्छा समय' :'शांत मन - संतुलित निर्णय लें'
                : emotionalState === 'stressed' ?'Stressed State - Investment Caution'
                : emotionalState === 'positive' ?'Positive Mood - Good Time to Invest' :'Calm Mind - Make Balanced Decisions'
              }
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {culturalContext === 'hindi' ?'आपकी भावनात्मक स्थिति के आधार पर निवेश सुझाव' :'Investment suggestions based on your emotional state'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverviewCard;