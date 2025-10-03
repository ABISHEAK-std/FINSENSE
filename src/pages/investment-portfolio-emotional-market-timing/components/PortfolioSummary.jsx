import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PortfolioSummary = ({ 
  portfolioData, 
  userProfile, 
  culturalContext, 
  onAddInvestment, 
  onUpdateMood 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateGainLoss = () => {
    const currentValue = portfolioData.totalValue;
    const initialValue = portfolioData.initialAmount || 0;
    const gainLoss = currentValue - initialValue;
    const gainLossPercentage = initialValue > 0 ? (gainLoss / initialValue) * 100 : 0;
    
    return { gainLoss, gainLossPercentage };
  };

  const calculateEmotionalConfidence = () => {
    const mood = userProfile.currentMood || 5;
    const stress = userProfile.stressLevel || 5;
    const confidence = userProfile.investmentConfidence || 5;
    
    return Math.round(
      (mood * 0.4 + (10 - stress) * 0.3 + confidence * 0.3)
    );
  };

  const calculateRiskScore = () => {
    const riskTolerance = userProfile.riskTolerance || 5;
    const portfolioDiversification = portfolioData.investments?.length || 1;
    const marketVolatility = 3; // Mock market volatility
    
    return Math.round(
      (riskTolerance * 0.5 + Math.min(portfolioDiversification, 5) * 0.3 + marketVolatility * 0.2)
    );
  };

  const getAISuggestion = () => {
    const { gainLossPercentage } = calculateGainLoss();
    const emotionalScore = calculateEmotionalConfidence();
    const riskScore = calculateRiskScore();
    
    if (emotionalScore < 5 && gainLossPercentage < 0) {
      return {
        status: 'warning',
        title: culturalContext === 'hindi' ? 'सावधान रहें' : 'Stay Cautious',
        description: culturalContext === 'hindi' 
          ? 'भावनात्मक तनाव के कारण जल्दबाजी में निर्णय न लें। अपना मूड बेहतर होने का इंतजार करें।'
          : 'Avoid hasty decisions due to emotional stress. Wait for your mood to improve.'
      };
    }
    
    if (emotionalScore > 7 && riskScore > 6) {
      return {
        status: 'positive',
        title: culturalContext === 'hindi' ? 'निवेश का अच्छा समय' : 'Good Time to Invest',
        description: culturalContext === 'hindi' 
          ? 'आपकी भावनात्मक स्थिति अच्छी है। नए निवेश के अवसर देखें।'
          : 'Your emotional state is good. Look for new investment opportunities.'
      };
    }
    
    return {
      status: 'neutral',
      title: culturalContext === 'hindi' ? 'स्थिर रहें' : 'Stay Steady',
      description: culturalContext === 'hindi' 
        ? 'अपनी वर्तमान रणनीति जारी रखें और नियमित निवेश करते रहें।'
        : 'Continue your current strategy and maintain regular investments.'
    };
  };

  const { gainLoss, gainLossPercentage } = calculateGainLoss();
  const emotionalConfidence = calculateEmotionalConfidence();
  const riskScore = calculateRiskScore();
  const aiSuggestion = getAISuggestion();

  return (
    <div className="space-y-6">
      {/* Portfolio Value Card */}
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading text-foreground">
            {culturalContext === 'hindi' ? 'पोर्टफोलियो मूल्य' : 'Portfolio Value'}
          </h3>
          <Button
            size="sm"
            onClick={onAddInvestment}
            iconName="Plus"
            iconPosition="left"
          >
            {culturalContext === 'hindi' ? 'निवेश जोड़ें' : 'Add Investment'}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(portfolioData.totalValue)}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Icon 
                name={gainLoss >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={gainLoss >= 0 ? 'text-green-500' : 'text-red-500'} 
              />
              <span className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)} ({gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {culturalContext === 'hindi' ? 'अंतिम अपडेट' : 'Last Updated'}: {new Date(portfolioData.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="text-lg font-heading text-foreground mb-4">
          {culturalContext === 'hindi' ? 'पोर्टफोलियो मेट्रिक्स' : 'Portfolio Metrics'}
        </h3>
        
        <div className="space-y-4">
          {/* Total Gain/Loss */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'कुल लाभ/हानि' : 'Total Gain/Loss'}
              </span>
              <span className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {gainLossPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  gainLoss >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(Math.abs(gainLossPercentage), 100)}%` }}
              />
            </div>
          </div>

          {/* Emotional Confidence */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'भावनात्मक आत्मविश्वास' : 'Emotional Confidence'}
              </span>
              <button 
                onClick={onUpdateMood}
                className="text-xs text-primary hover:underline"
              >
                {culturalContext === 'hindi' ? 'अपडेट करें' : 'Update'}
              </button>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-foreground">{emotionalConfidence}/10</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300 bg-blue-500"
                style={{ width: `${(emotionalConfidence / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Risk Score */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'जोखिम स्कोर' : 'Risk Score'}
              </span>
              <span className="text-sm font-medium text-foreground">
                {riskScore < 4 
                  ? (culturalContext === 'hindi' ? 'रूढ़िवादी' : 'Conservative')
                  : riskScore < 7 
                  ? (culturalContext === 'hindi' ? 'मध्यम' : 'Moderate')
                  : (culturalContext === 'hindi' ? 'आक्रामक' : 'Aggressive')
                }
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  riskScore < 4 ? 'bg-green-500' : riskScore < 7 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(riskScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Investment Suggestion */}
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            aiSuggestion.status === 'positive' ? 'bg-green-100' :
            aiSuggestion.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            <Icon 
              name={
                aiSuggestion.status === 'positive' ? 'TrendingUp' :
                aiSuggestion.status === 'warning' ? 'AlertTriangle' : 'BarChart3'
              } 
              size={20} 
              className={
                aiSuggestion.status === 'positive' ? 'text-green-600' :
                aiSuggestion.status === 'warning' ? 'text-yellow-600' : 'text-blue-600'
              }
            />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-1">{aiSuggestion.title}</h4>
            <p className="text-sm text-muted-foreground">{aiSuggestion.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
