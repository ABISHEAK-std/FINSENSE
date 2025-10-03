import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmotionalMarketTiming = ({ 
  userProfile, 
  marketData, 
  culturalContext, 
  timingScore, 
  onReanalyze,
  fullView = false 
}) => {
  const getScoreColor = () => {
    if (timingScore >= 80) return 'text-green-600';
    if (timingScore >= 60) return 'text-blue-600';
    if (timingScore >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = () => {
    if (timingScore >= 80) return 'from-green-500 to-emerald-400';
    if (timingScore >= 60) return 'from-blue-500 to-blue-400';
    if (timingScore >= 40) return 'from-yellow-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  const getTimingRecommendation = () => {
    if (timingScore >= 80) {
      return {
        action: culturalContext === 'hindi' ? 'निवेश करें' : 'Invest Now',
        description: culturalContext === 'hindi' 
          ? 'बाजार की स्थिति और आपकी भावनात्मक स्थिति दोनों अच्छी हैं'
          : 'Both market conditions and your emotional state are favorable'
      };
    }
    if (timingScore >= 60) {
      return {
        action: culturalContext === 'hindi' ? 'सावधानी से निवेश करें' : 'Invest Cautiously',
        description: culturalContext === 'hindi' 
          ? 'छोटी मात्रा में निवेश करना उचित है'
          : 'Small investments are advisable'
      };
    }
    if (timingScore >= 40) {
      return {
        action: culturalContext === 'hindi' ? 'प्रतीक्षा करें' : 'Wait',
        description: culturalContext === 'hindi' 
          ? 'बेहतर समय का इंतजार करें'
          : 'Wait for better timing'
      };
    }
    return {
      action: culturalContext === 'hindi' ? 'निवेश न करें' : 'Avoid Investing',
      description: culturalContext === 'hindi' 
        ? 'अभी निवेश करना जोखिम भरा है'
        : 'Investing now is risky'
    };
  };

  const getEmotionalStateIcon = () => {
    const mood = userProfile.currentMood || 5;
    if (mood >= 8) return 'Smile';
    if (mood >= 6) return 'Heart';
    if (mood >= 4) return 'Meh';
    if (mood >= 2) return 'Frown';
    return 'AlertTriangle';
  };

  const getEmotionalStateText = () => {
    const mood = userProfile.currentMood || 5;
    if (culturalContext === 'hindi') {
      if (mood >= 8) return 'बहुत खुश';
      if (mood >= 6) return 'खुश';
      if (mood >= 4) return 'सामान्य';
      if (mood >= 2) return 'उदास';
      return 'बहुत उदास';
    }
    if (mood >= 8) return 'Very Happy';
    if (mood >= 6) return 'Happy';
    if (mood >= 4) return 'Neutral';
    if (mood >= 2) return 'Sad';
    return 'Very Sad';
  };

  const getMarketSentimentIcon = () => {
    return marketData?.marketSentiment === 'bullish' ? 'TrendingUp' : 'TrendingDown';
  };

  const getMarketSentimentText = () => {
    if (culturalContext === 'hindi') {
      return marketData?.marketSentiment === 'bullish' ? 'तेजी' : 'मंदी';
    }
    return marketData?.marketSentiment === 'bullish' ? 'Bullish' : 'Bearish';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (timingScore / 100) * circumference;
  const recommendation = getTimingRecommendation();

  return (
    <div className={`bg-card rounded-xl border p-6 ${fullView ? 'max-w-4xl mx-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading text-foreground">
          {culturalContext === 'hindi' ? 'भावनात्मक मार्केट टाइमिंग' : 'Emotional Market Timing'}
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={onReanalyze}
          iconName="RefreshCw"
          iconPosition="left"
        >
          {culturalContext === 'hindi' ? 'पुन: विश्लेषण' : 'Re-analyze'}
        </Button>
      </div>

      <div className={`${fullView ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'space-y-6'}`}>
        {/* Circular Progress Indicator */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="currentColor" 
                strokeWidth="6" 
                fill="transparent" 
                className="text-muted/20" 
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#timingGradient)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="timingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" className={getScoreColor()} />
                  <stop offset="100%" stopColor="currentColor" className={getScoreColor()} stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor()}`}>{timingScore}</div>
                <div className="text-xs text-muted-foreground">
                  {culturalContext === 'hindi' ? 'टाइमिंग स्कोर' : 'Timing Score'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <h4 className={`text-lg font-medium ${getScoreColor()}`}>
              {recommendation.action}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {recommendation.description}
            </p>
          </div>
        </div>

        {/* Market and Emotional Data */}
        <div className="space-y-4">
          {/* Market Sentiment */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {culturalContext === 'hindi' ? 'मार्केट सेंटिमेंट' : 'Market Sentiment'}
              </span>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getMarketSentimentIcon()} 
                  size={16} 
                  className={marketData?.marketSentiment === 'bullish' ? 'text-green-500' : 'text-red-500'} 
                />
                <span className={`text-sm font-medium ${
                  marketData?.marketSentiment === 'bullish' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getMarketSentimentText()}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {culturalContext === 'hindi' ? 'स्कोर' : 'Score'}: {marketData?.sentimentScore || 50}/100
            </div>
          </div>

          {/* User Emotional State */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {culturalContext === 'hindi' ? 'आपकी भावनात्मक स्थिति' : 'Your Emotional State'}
              </span>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getEmotionalStateIcon()} 
                  size={16} 
                  className={getScoreColor()} 
                />
                <span className={`text-sm font-medium ${getScoreColor()}`}>
                  {getEmotionalStateText()}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {culturalContext === 'hindi' ? 'मूड' : 'Mood'}: {userProfile.currentMood || 5}/10, 
              {' '}{culturalContext === 'hindi' ? 'तनाव' : 'Stress'}: {userProfile.stressLevel || 5}/10
            </div>
          </div>

          {fullView && (
            <>
              {/* Additional Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-center">
                  <div className="text-lg font-bold text-primary">
                    {userProfile.riskTolerance || 5}/10
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {culturalContext === 'hindi' ? 'जोखिम सहनशीलता' : 'Risk Tolerance'}
                  </div>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg text-center">
                  <div className="text-lg font-bold text-secondary">
                    {userProfile.investmentConfidence || 5}/10
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {culturalContext === 'hindi' ? 'निवेश आत्मविश्वास' : 'Investment Confidence'}
                  </div>
                </div>
              </div>

              {/* Market Indices */}
              {marketData?.indices && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="text-sm font-medium text-foreground mb-3">
                    {culturalContext === 'hindi' ? 'मार्केट इंडेक्स' : 'Market Indices'}
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {marketData.indices.nifty?.value.toLocaleString()}
                      </div>
                      <div className={`text-xs ${
                        marketData.indices.nifty?.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        NIFTY {marketData.indices.nifty?.change >= 0 ? '+' : ''}{marketData.indices.nifty?.change.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {marketData.indices.sensex?.value.toLocaleString()}
                      </div>
                      <div className={`text-xs ${
                        marketData.indices.sensex?.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        SENSEX {marketData.indices.sensex?.change >= 0 ? '+' : ''}{marketData.indices.sensex?.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground text-center">
        {culturalContext === 'hindi' ? 'अंतिम अपडेट' : 'Last Updated'}: {
          new Date(marketData?.lastUpdated || Date.now()).toLocaleString()
        }
      </div>
    </div>
  );
};

export default EmotionalMarketTiming;
