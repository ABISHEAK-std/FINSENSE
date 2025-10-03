import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmotionalAnalysis = ({ culturalContext, emotionalState, userProfile }) => {
  const [emotionalHistory, setEmotionalHistory] = useState([]);
  const [investmentBias, setInvestmentBias] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Load emotional history and analyze investment bias
    loadEmotionalHistory();
    analyzeInvestmentBias();
    generateRecommendations();
  }, [emotionalState, userProfile]);

  const loadEmotionalHistory = () => {
    // Simulate emotional history data
    const history = [
      { date: '2024-01-15', emotion: 'anxious', decision: 'sold_stocks', result: 'missed_gains' },
      { date: '2024-01-10', emotion: 'excited', decision: 'bought_crypto', result: 'lost_money' },
      { date: '2024-01-05', emotion: 'calm', decision: 'regular_sip', result: 'steady_growth' },
      { date: '2024-01-01', emotion: 'fearful', decision: 'avoided_investment', result: 'missed_opportunity' }
    ];
    setEmotionalHistory(history);
  };

  const analyzeInvestmentBias = () => {
    const biases = {
      'anxious': {
        type: culturalContext === 'hindi' ? 'हानि से बचने की प्रवृत्ति' : 'Loss Aversion',
        description: culturalContext === 'hindi' 
          ? 'आप नुकसान से डरकर अच्छे मौके गंवा सकते हैं'
          : 'You might miss good opportunities due to fear of losses',
        severity: 'high'
      },
      'excited': {
        type: culturalContext === 'hindi' ? 'अति आत्मविश्वास' : 'Overconfidence Bias',
        description: culturalContext === 'hindi' 
          ? 'आप अधिक जोखिम लेकर नुकसान कर सकते हैं'
          : 'You might take excessive risks leading to losses',
        severity: 'medium'
      },
      'calm': {
        type: culturalContext === 'hindi' ? 'संतुलित दृष्टिकोण' : 'Balanced Approach',
        description: culturalContext === 'hindi' 
          ? 'आप तर्कसंगत निर्णय लेते हैं'
          : 'You make rational decisions',
        severity: 'low'
      },
      'fearful': {
        type: culturalContext === 'hindi' ? 'पूर्ण जोखिम परिहार' : 'Risk Paralysis',
        description: culturalContext === 'hindi' 
          ? 'आप निवेश के अवसर गंवा सकते हैं'
          : 'You might miss investment opportunities',
        severity: 'high'
      }
    };

    setInvestmentBias(biases[emotionalState] || biases['calm']);
  };

  const generateRecommendations = () => {
    const recs = [];
    
    if (emotionalState === 'anxious' || emotionalState === 'fearful') {
      recs.push({
        title: culturalContext === 'hindi' ? 'SIP शुरू करें' : 'Start SIP',
        description: culturalContext === 'hindi' 
          ? 'नियमित निवेश से भावनात्मक निर्णयों से बचें'
          : 'Regular investments help avoid emotional decisions',
        icon: 'TrendingUp',
        color: 'text-green-500'
      });
    }

    if (emotionalState === 'excited') {
      recs.push({
        title: culturalContext === 'hindi' ? 'धीमी रणनीति अपनाएं' : 'Slow Down Strategy',
        description: culturalContext === 'hindi' 
          ? 'उत्साह में आकर तुरंत निर्णय न लें'
          : 'Don\'t make hasty decisions in excitement',
        icon: 'Pause',
        color: 'text-yellow-500'
      });
    }

    recs.push({
      title: culturalContext === 'hindi' ? 'विविधीकरण' : 'Diversification',
      description: culturalContext === 'hindi' 
        ? 'अलग-अलग एसेट क्लास में निवेश करें'
        : 'Invest across different asset classes',
      icon: 'PieChart',
      color: 'text-blue-500'
    });

    recs.push({
      title: culturalContext === 'hindi' ? 'लक्ष्य निर्धारण' : 'Goal Setting',
      description: culturalContext === 'hindi' 
        ? 'स्पष्ट वित्तीय लक्ष्य रखें'
        : 'Maintain clear financial goals',
      icon: 'Target',
      color: 'text-purple-500'
    });

    setRecommendations(recs);
  };

  const getEmotionIcon = (emotion) => {
    const icons = {
      'anxious': 'AlertTriangle',
      'excited': 'Zap',
      'calm': 'Heart',
      'fearful': 'Frown',
      'confident': 'Smile'
    };
    return icons[emotion] || 'Heart';
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      'anxious': 'text-red-500',
      'excited': 'text-orange-500',
      'calm': 'text-green-500',
      'fearful': 'text-red-600',
      'confident': 'text-blue-500'
    };
    return colors[emotion] || 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading text-foreground mb-2">
          {culturalContext === 'hindi' ? 'भावनात्मक निवेश विश्लेषण' : 'Emotional Investment Analysis'}
        </h2>
        <p className="text-muted-foreground">
          {culturalContext === 'hindi' 
            ? 'आपकी भावनाओं का निवेश निर्णयों पर प्रभाव समझें'
            : 'Understand how your emotions affect investment decisions'
          }
        </p>
      </div>

      {/* Current Emotional State */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="text-lg font-heading text-foreground mb-4">
          {culturalContext === 'hindi' ? 'वर्तमान भावनात्मक स्थिति' : 'Current Emotional State'}
        </h3>
        
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center`}>
            <Icon name={getEmotionIcon(emotionalState)} size={32} className={getEmotionColor(emotionalState)} />
          </div>
          <div className="flex-1">
            <h4 className={`text-xl font-medium ${getEmotionColor(emotionalState)} capitalize`}>
              {emotionalState}
            </h4>
            <p className="text-muted-foreground text-sm">
              {culturalContext === 'hindi' ? 'आज की भावनात्मक स्थिति' : 'Today\'s emotional state'}
            </p>
          </div>
        </div>
      </div>

      {/* Investment Bias Analysis */}
      {investmentBias && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-heading text-foreground mb-4">
            {culturalContext === 'hindi' ? 'निवेश पूर्वाग्रह विश्लेषण' : 'Investment Bias Analysis'}
          </h3>
          
          <div className={`p-4 rounded-lg border ${
            investmentBias.severity === 'high' ? 'bg-red-50 border-red-200' :
            investmentBias.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start space-x-3">
              <Icon 
                name={investmentBias.severity === 'high' ? 'AlertTriangle' : 
                      investmentBias.severity === 'medium' ? 'AlertCircle' : 'CheckCircle'} 
                size={20} 
                className={
                  investmentBias.severity === 'high' ? 'text-red-600' :
                  investmentBias.severity === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }
              />
              <div>
                <h4 className={`font-medium ${
                  investmentBias.severity === 'high' ? 'text-red-800' :
                  investmentBias.severity === 'medium' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  {investmentBias.type}
                </h4>
                <p className={`text-sm mt-1 ${
                  investmentBias.severity === 'high' ? 'text-red-700' :
                  investmentBias.severity === 'medium' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {investmentBias.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emotional History */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="text-lg font-heading text-foreground mb-4">
          {culturalContext === 'hindi' ? 'भावनात्मक निवेश इतिहास' : 'Emotional Investment History'}
        </h3>
        
        <div className="space-y-3">
          {emotionalHistory.map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name={getEmotionIcon(entry.emotion)} size={16} className={getEmotionColor(entry.emotion)} />
                <div>
                  <p className="text-sm font-medium text-foreground capitalize">{entry.emotion}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-foreground">{entry.decision.replace('_', ' ')}</p>
                <p className={`text-xs ${
                  entry.result.includes('gains') || entry.result.includes('growth') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {entry.result.replace('_', ' ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="text-lg font-heading text-foreground mb-4">
          {culturalContext === 'hindi' ? 'सुझाव' : 'Recommendations'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-muted/20 rounded-lg border">
              <div className="flex items-start space-x-3">
                <Icon name={rec.icon} size={20} className={rec.color} />
                <div>
                  <h4 className="font-medium text-foreground">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emotional Control Tips */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border p-6">
        <h3 className="text-lg font-heading text-primary mb-4">
          {culturalContext === 'hindi' ? 'भावनात्मक नियंत्रण के सुझाव' : 'Emotional Control Tips'}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="Clock" size={16} className="text-primary mt-1" />
            <p className="text-sm text-primary/80">
              {culturalContext === 'hindi' 
                ? 'निवेश निर्णय लेने से पहले 24 घंटे इंतजार करें'
                : 'Wait 24 hours before making investment decisions'
              }
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="Users" size={16} className="text-primary mt-1" />
            <p className="text-sm text-primary/80">
              {culturalContext === 'hindi' 
                ? 'विश्वसनीय वित्तीय सलाहकार से सलाह लें'
                : 'Consult with a trusted financial advisor'
              }
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="BookOpen" size={16} className="text-primary mt-1" />
            <p className="text-sm text-primary/80">
              {culturalContext === 'hindi' 
                ? 'नियमित रूप से वित्तीय शिक्षा लें'
                : 'Continuously educate yourself about finance'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionalAnalysis;
