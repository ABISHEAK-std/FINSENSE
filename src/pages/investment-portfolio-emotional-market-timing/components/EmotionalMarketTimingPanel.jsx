import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmotionalMarketTimingPanel = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  onActionTaken,
  className = '' 
}) => {
  const [marketSentiment, setMarketSentiment] = useState('neutral');
  const [timingScore, setTimingScore] = useState(72);
  const [recommendations, setRecommendations] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [biasAlerts, setBiasAlerts] = useState([]);

  useEffect(() => {
    // Simulate real-time market sentiment analysis
    const interval = setInterval(() => {
      const sentiments = ['bullish', 'bearish', 'neutral', 'volatile'];
      const randomSentiment = sentiments?.[Math.floor(Math.random() * sentiments?.length)];
      setMarketSentiment(randomSentiment);
      
      // Update timing score based on emotional state and market sentiment
      let baseScore = 70;
      if (emotionalState === 'stressed') baseScore -= 20;
      if (emotionalState === 'positive') baseScore += 10;
      if (randomSentiment === 'volatile') baseScore -= 15;
      if (randomSentiment === 'bullish') baseScore += 10;
      
      setTimingScore(Math.max(20, Math.min(95, baseScore + Math.random() * 10 - 5)));
    }, 5000);

    return () => clearInterval(interval);
  }, [emotionalState]);

  useEffect(() => {
    // Generate recommendations based on emotional state and market conditions
    generateRecommendations();
    generateBiasAlerts();
  }, [emotionalState, marketSentiment, culturalContext]);

  const generateRecommendations = () => {
    const recs = [];
    
    if (emotionalState === 'stressed') {
      recs?.push({
        id: 1,
        type: 'caution',
        icon: 'AlertTriangle',
        title: culturalContext === 'hindi' ? 'तनाव में निवेश न करें' : 'Avoid Investing While Stressed',
        description: culturalContext === 'hindi' ?'तनावग्रस्त अवस्था में लिए गए निवेश निर्णय अक्सर गलत होते हैं। पहले मन को शांत करें।' :'Investment decisions made while stressed are often poor. Take time to calm your mind first.',
        action: culturalContext === 'hindi' ? 'श्वास व्यायाम करें' : 'Try Breathing Exercise',
        priority: 'high'
      });
    }

    if (marketSentiment === 'volatile' && emotionalState !== 'calm') {
      recs?.push({
        id: 2,
        type: 'warning',
        icon: 'TrendingDown',
        title: culturalContext === 'hindi' ? 'बाजार में अस्थिरता' : 'Market Volatility Alert',
        description: culturalContext === 'hindi' ?'बाजार में तेजी से बदलाव हो रहा है। बड़े निवेश से बचें।' :'Market is experiencing high volatility. Avoid large investments.',
        action: culturalContext === 'hindi' ? 'SIP जारी रखें' : 'Continue SIP Only',
        priority: 'medium'
      });
    }

    if (emotionalState === 'positive' && marketSentiment === 'bullish') {
      recs?.push({
        id: 3,
        type: 'opportunity',
        icon: 'TrendingUp',
        title: culturalContext === 'hindi' ? 'निवेश का अच्छा समय' : 'Good Time to Invest',
        description: culturalContext === 'hindi' ?'आपकी मानसिक स्थिति और बाजार दोनों सकारात्मक हैं। निवेश पर विचार करें।' :'Both your mental state and market conditions are positive. Consider investing.',
        action: culturalContext === 'hindi' ? 'निवेश करें' : 'Consider Investing',
        priority: 'high'
      });
    }

    // Cultural recommendations
    if (culturalContext === 'hindi') {
      const today = new Date();
      const isAuspiciousDay = today?.getDay() === 1 || today?.getDay() === 3; // Monday or Wednesday
      
      if (isAuspiciousDay) {
        recs?.push({
          id: 4,
          type: 'cultural',
          icon: 'Star',
          title: 'शुभ दिन - निवेश के लिए अच्छा समय',
          description: 'आज का दिन निवेश के लिए शुभ माना जाता है। सोना या इक्विटी में निवेश करें।',
          action: 'शुभ निवेश करें',
          priority: 'medium'
        });
      }
    }

    setRecommendations(recs);
  };

  const generateBiasAlerts = () => {
    const alerts = [];

    if (emotionalState === 'stressed') {
      alerts?.push({
        id: 1,
        bias: 'loss_aversion',
        title: culturalContext === 'hindi' ? 'नुकसान का डर' : 'Loss Aversion Detected',
        description: culturalContext === 'hindi' ?'आप नुकसान से बचने के लिए अच्छे अवसर छोड़ सकते हैं।' :'You might miss good opportunities due to fear of losses.',
        severity: 'high'
      });
    }

    if (marketSentiment === 'bullish' && emotionalState === 'positive') {
      alerts?.push({
        id: 2,
        bias: 'overconfidence',
        title: culturalContext === 'hindi' ? 'अति आत्मविश्वास' : 'Overconfidence Bias',
        description: culturalContext === 'hindi' ?'बाजार की तेजी में अधिक जोखिम न लें।' :'Don\'t take excessive risks during market highs.',
        severity: 'medium'
      });
    }

    setBiasAlerts(alerts);
  };

  const handleAnalyzeEmotions = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simulate emotion analysis results
      onActionTaken?.('emotion_analysis');
    }, 2000);
  };

  const getTimingScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-error';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'text-success';
      case 'bearish': return 'text-error';
      case 'volatile': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'TrendingUp';
      case 'bearish': return 'TrendingDown';
      case 'volatile': return 'Zap';
      default: return 'Minus';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Market Timing Score */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading text-foreground">
            {culturalContext === 'hindi' ? 'भावनात्मक मार्केट टाइमिंग' : 'Emotional Market Timing'}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyzeEmotions}
            loading={isAnalyzing}
            iconName="Brain"
            iconPosition="left"
          >
            {culturalContext === 'hindi' ? 'विश्लेषण करें' : 'Analyze'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timing Score */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(timingScore / 100) * 314} 314`}
                  className={getTimingScoreColor(timingScore)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getTimingScoreColor(timingScore)}`}>
                    {Math.round(timingScore)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {culturalContext === 'hindi' ? 'स्कोर' : 'Score'}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' ? 'निवेश टाइमिंग स्कोर' : 'Investment Timing Score'}
            </p>
          </div>

          {/* Market Sentiment */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon 
                name={getSentimentIcon(marketSentiment)} 
                size={20} 
                className={getSentimentColor(marketSentiment)} 
              />
              <div>
                <h4 className="font-medium text-foreground">
                  {culturalContext === 'hindi' ? 'बाजार की भावना' : 'Market Sentiment'}
                </h4>
                <p className={`text-sm capitalize ${getSentimentColor(marketSentiment)}`}>
                  {marketSentiment === 'bullish' ? 
                    (culturalContext === 'hindi' ? 'तेजी' : 'Bullish') :
                    marketSentiment === 'bearish' ?
                    (culturalContext === 'hindi' ? 'मंदी' : 'Bearish') :
                    marketSentiment === 'volatile' ?
                    (culturalContext === 'hindi' ? 'अस्थिर' : 'Volatile') :
                    (culturalContext === 'hindi' ? 'स्थिर' : 'Neutral')
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Icon 
                name={
                  emotionalState === 'stressed' ? 'AlertTriangle' :
                  emotionalState === 'positive' ? 'Smile' : 'Heart'
                } 
                size={20} 
                className={
                  emotionalState === 'stressed' ? 'text-warning' :
                  emotionalState === 'positive' ? 'text-success' : 'text-primary'
                }
              />
              <div>
                <h4 className="font-medium text-foreground">
                  {culturalContext === 'hindi' ? 'आपकी भावनात्मक स्थिति' : 'Your Emotional State'}
                </h4>
                <p className={`text-sm capitalize ${
                  emotionalState === 'stressed' ? 'text-warning' :
                  emotionalState === 'positive' ? 'text-success' : 'text-primary'
                }`}>
                  {emotionalState === 'stressed' ? 
                    (culturalContext === 'hindi' ? 'तनावग्रस्त' : 'Stressed') :
                    emotionalState === 'positive' ?
                    (culturalContext === 'hindi' ? 'सकारात्मक' : 'Positive') :
                    (culturalContext === 'hindi' ? 'शांत' : 'Calm')
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-heading text-foreground mb-4">
            {culturalContext === 'hindi' ? 'व्यक्तिगत सुझाव' : 'Personalized Recommendations'}
          </h3>
          <div className="space-y-4">
            {recommendations?.map((rec) => (
              <div 
                key={rec?.id} 
                className={`p-4 rounded-lg border transition-ui ${
                  rec?.priority === 'high' 
                    ? rec?.type === 'caution'|| rec?.type === 'warning' ?'bg-warning/10 border-warning/20' :'bg-success/10 border-success/20' :'bg-muted/30 border-border/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={rec?.icon} 
                    size={20} 
                    className={
                      rec?.type === 'caution' || rec?.type === 'warning' ? 'text-warning' :
                      rec?.type === 'opportunity' ? 'text-success' :
                      rec?.type === 'cultural' ? 'text-primary' : 'text-muted-foreground'
                    }
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">
                      {rec?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {rec?.description}
                    </p>
                    <Button
                      variant={rec?.priority === 'high' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onActionTaken?.(rec?.action)}
                    >
                      {rec?.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Bias Alerts */}
      {biasAlerts?.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-heading text-foreground mb-4">
            {culturalContext === 'hindi' ? 'पूर्वाग्रह चेतावनी' : 'Behavioral Bias Alerts'}
          </h3>
          <div className="space-y-3">
            {biasAlerts?.map((alert) => (
              <div 
                key={alert?.id}
                className={`p-3 rounded-lg border ${
                  alert?.severity === 'high' ?'bg-error/10 border-error/20' :'bg-warning/10 border-warning/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name="AlertCircle" 
                    size={16} 
                    className={alert?.severity === 'high' ? 'text-error' : 'text-warning'} 
                  />
                  <div>
                    <h4 className={`font-medium ${
                      alert?.severity === 'high' ? 'text-error' : 'text-warning'
                    }`}>
                      {alert?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {alert?.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionalMarketTimingPanel;