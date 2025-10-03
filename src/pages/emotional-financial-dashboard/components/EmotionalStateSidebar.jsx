import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import { chatService } from '../../../services/ChatService';

const EmotionalStateSidebar = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  className = '' 
}) => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [currentMoodScore, setCurrentMoodScore] = useState(7);
  const [improvementSuggestions, setImprovementSuggestions] = useState([]);
  const [stressFactors, setStressFactors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    (async () => {
      // Pull last 24 hours of chat emotions and build series
      const history = await chatService.getChatHistory().catch(() => []);
      const last = history.slice(-12); // recent points
      const moods = last.map(m => (m.emotion && m.emotion[0]) || 'neutral');
      const toScore = (e) => e==='happy'||e==='excited'||e==='confident'||e==='hopeful' ? 8
        : e==='calm'||e==='neutral' ? 7
        : e==='stressed'||e==='anxious'||e==='frustrated'||e==='overwhelmed'||e==='angry' ? 4 : 6;
      const series = moods.map((e, i) => ({ time: `${i+1}`, score: toScore(e), state: e }));
      setMoodHistory(series.length ? series : [{ time: '1', score: 7, state: emotionalState }]);

      // Current mood score from latest
      setCurrentMoodScore(series.length ? series[series.length-1].score : 7);
      setImprovementSuggestions(getImprovementSuggestions());
      setStressFactors(getStressFactors());
    })();
  }, [emotionalState, culturalContext]);

  const getImprovementSuggestions = () => {
    const suggestions = {
      'positive': culturalContext === 'hindi' ? [
        'नए निवेश के अवसर देखें',
        'वित्तीय लक्ष्य बढ़ाने पर विचार करें',
        'परिवार के साथ वित्तीय योजना साझा करें'
      ] : [
        'Explore new investment opportunities',
        'Consider increasing financial goals',
        'Share financial plans with family'
      ],
      'calm': culturalContext === 'hindi' ? [
        'नियमित SIP शुरू करें',
        'आपातकालीन फंड की समीक्षा करें',
        'वित्तीय शिक्षा पर समय दें'
      ] : [
        'Start regular SIP investments',
        'Review emergency fund status',
        'Spend time on financial education'
      ],
      'stressed': culturalContext === 'hindi' ? [
        'गहरी सांस लेने का अभ्यास करें',
        'खर्चों की प्राथमिकता तय करें',
        'AI थेरेपी चैट का उपयोग करें'
      ] : [
        'Practice deep breathing exercises',
        'Prioritize essential expenses',
        'Use AI therapy chat for support'
      ],
      'anxious': culturalContext === 'hindi' ? [
        'तुरंत विशेषज्ञ से बात करें',
        'छोटे वित्तीय कदम उठाएं',
        'परिवार से सहायता लें'
      ] : [
        'Talk to an expert immediately',
        'Take small financial steps',
        'Seek family support'
      ]
    };
    
    return suggestions?.[emotionalState] || suggestions?.['calm'];
  };

  const getStressFactors = () => {
    return [
      {
        factor: culturalContext === 'hindi' ? 'उच्च EMI भुगतान' : 'High EMI Payments',
        impact: 'high',
        percentage: 35
      },
      {
        factor: culturalContext === 'hindi' ? 'अनियमित आय' : 'Irregular Income',
        impact: 'medium',
        percentage: 25
      },
      {
        factor: culturalContext === 'hindi' ? 'पारिवारिक दबाव' : 'Family Pressure',
        impact: 'medium',
        percentage: 20
      },
      {
        factor: culturalContext === 'hindi' ? 'बाजार की अस्थिरता' : 'Market Volatility',
        impact: 'low',
        percentage: 20
      }
    ];
  };

  const getMoodColor = (state) => {
    const colors = {
      'positive': 'text-success',
      'calm': 'text-primary',
      'stressed': 'text-warning',
      'anxious': 'text-error'
    };
    return colors?.[state] || 'text-muted-foreground';
  };

  const getMoodIcon = (state) => {
    const icons = {
      'positive': 'Smile',
      'calm': 'Heart',
      'stressed': 'AlertTriangle',
      'anxious': 'Frown'
    };
    return icons?.[state] || 'Circle';
  };

  const getImpactColor = (impact) => {
    const colors = {
      'high': 'text-error',
      'medium': 'text-warning',
      'low': 'text-success'
    };
    return colors?.[impact] || 'text-muted-foreground';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass-card p-2 rounded-lg shadow-soft border">
          <p className="text-xs font-medium text-foreground">{label}</p>
          <p className="text-xs text-primary">
            {culturalContext === 'hindi' ? 'स्कोर: ' : 'Score: '}{payload?.[0]?.value}/10
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`glass-card rounded-2xl p-6 transition-emotional ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading text-foreground">
            {culturalContext === 'hindi' ? 'भावनात्मक विश्लेषण' : 'Emotional Analytics'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' ? 'आज का मूड ट्रैकिंग' : 'Today\'s mood tracking'}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-muted rounded-lg transition-ui"
        >
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-muted-foreground" 
          />
        </button>
      </div>
      {/* Current Mood Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getMoodIcon(emotionalState)} 
              size={20} 
              className={getMoodColor(emotionalState)} 
            />
            <span className={`text-sm font-medium capitalize ${getMoodColor(emotionalState)}`}>
              {emotionalState}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground">
              {currentMoodScore}
            </span>
            <span className="text-sm text-muted-foreground">/10</span>
          </div>
        </div>
        
        {/* Mood Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              currentMoodScore >= 7 ? 'bg-success' :
              currentMoodScore >= 5 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${currentMoodScore * 10}%` }}
          />
        </div>
      </div>
      {/* Mood History Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">
          {culturalContext === 'hindi' ? 'आज का मूड ट्रेंड' : 'Today\'s Mood Trend'}
        </h3>
        <div className="h-20 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodHistory}>
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--color-primary)' }}
                activeDot={{ r: 4, fill: 'var(--color-primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Improvement Suggestions */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">
          {culturalContext === 'hindi' ? 'सुधार के सुझाव' : 'Improvement Suggestions'}
        </h3>
        <div className="space-y-2">
          {improvementSuggestions?.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-muted/20 transition-ui">
              <Icon name="Lightbulb" size={14} className="text-warning mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Stress Factors */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              {culturalContext === 'hindi' ? 'तनाव के कारक' : 'Stress Factors'}
            </h3>
            <div className="space-y-3">
              {stressFactors?.map((factor, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground">{factor?.factor}</span>
                    <span className={`text-xs font-medium ${getImpactColor(factor?.impact)}`}>
                      {factor?.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        factor?.impact === 'high' ? 'bg-error' :
                        factor?.impact === 'medium' ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${factor?.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Spending Pattern */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              {culturalContext === 'hindi' ? 'भावनात्मक खर्च पैटर्न' : 'Emotional Spending Pattern'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="TrendingDown" size={14} className="text-error" />
                  <span className="text-xs font-medium text-error">
                    {culturalContext === 'hindi' ? 'तनाव में खर्च' : 'Stress Spending'}
                  </span>
                </div>
                <p className="text-sm font-bold text-error">₹2,340</p>
                <p className="text-xs text-error/70">
                  {culturalContext === 'hindi' ? 'इस सप्ताह' : 'This week'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="TrendingUp" size={14} className="text-success" />
                  <span className="text-xs font-medium text-success">
                    {culturalContext === 'hindi' ? 'खुशी में खर्च' : 'Happy Spending'}
                  </span>
                </div>
                <p className="text-sm font-bold text-success">₹1,850</p>
                <p className="text-xs text-success/70">
                  {culturalContext === 'hindi' ? 'इस सप्ताह' : 'This week'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/20">
        <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-ui">
          <Icon name="BarChart3" size={16} />
          <span>
            {culturalContext === 'hindi' ? 'विस्तृत रिपोर्ट' : 'Detailed Report'}
          </span>
        </button>
        
        <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-ui">
          <Icon name="Settings" size={16} />
          <span>
            {culturalContext === 'hindi' ? 'सेटिंग्स' : 'Settings'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default EmotionalStateSidebar;