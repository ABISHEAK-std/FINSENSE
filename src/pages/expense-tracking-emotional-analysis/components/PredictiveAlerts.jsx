import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PredictiveAlerts = ({ 
  expenses = [], 
  culturalContext = 'default',
  onAlertAction,
  className = '' 
}) => {
  const [alerts, setAlerts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    generatePredictiveAlerts();
  }, [expenses]);

  const generatePredictiveAlerts = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const generatedAlerts = [];
      const now = new Date();
      
      // Analyze spending patterns
      const recentExpenses = expenses?.filter(expense => {
        const expenseDate = new Date(expense.timestamp);
        const diffDays = Math.ceil((now - expenseDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });

      // Emotional spending pattern detection
      const emotionalSpending = recentExpenses?.filter(expense => 
        ['stressed', 'anxious', 'sad', 'angry']?.includes(expense?.emotion)
      );

      // Immediate red alert for any recent negative-emotion expense (last 24h)
      const recentNegative = recentExpenses?.some(expense => {
        const neg = ['stressed', 'anxious', 'sad', 'angry'];
        const isNeg = neg.includes(expense?.emotion);
        const hoursAgo = (now - new Date(expense.timestamp)) / (1000 * 60 * 60);
        return isNeg && hoursAgo <= 24;
      });
      if (recentNegative) {
        generatedAlerts?.push({
          id: 'recent_negative_expense',
          type: 'warning',
          priority: 'high',
          title: culturalContext === 'hindi' ? 'हालिया तनावपूर्ण खर्च' : 'Recent Stressful Spending',
          description: culturalContext === 'hindi'
            ? 'पिछले 24 घंटों में नकारात्मक भावना से जुड़ा एक खर्च जोड़ा गया है।'
            : 'A spending with a negative emotion was added in the last 24 hours.',
          suggestion: culturalContext === 'hindi' ? 'थोड़ा विराम लें और कारण का मूल्यांकन करें।' : 'Pause and reflect on the trigger before more spending.',
          icon: 'AlertTriangle',
          actionLabel: culturalContext === 'hindi' ? 'सांस लेने का अभ्यास' : 'Breathing Exercise',
          actionType: 'breathing'
        });
      }

      if (emotionalSpending?.length >= 3) {
        generatedAlerts?.push({
          id: 'emotional_pattern',
          type: 'warning',
          priority: 'high',
          title: culturalContext === 'hindi' ? 'भावनात्मक खर्च का पैटर्न' : 'Emotional Spending Pattern',
          description: culturalContext === 'hindi' 
            ? `पिछले सप्ताह में ${emotionalSpending?.length} बार भावनात्मक खर्च हुआ है।`
            : `You've had ${emotionalSpending?.length} emotional spending episodes this week.`,
          suggestion: culturalContext === 'hindi' ?'खर्च करने से पहले 5 मिनट रुकें और गहरी सांस लें।' :'Take a 5-minute pause and deep breath before spending.',
          icon: 'AlertTriangle',
          actionLabel: culturalContext === 'hindi' ? 'सांस लेने का अभ्यास' : 'Breathing Exercise',
          actionType: 'breathing'
        });
      }

      // Festival spending prediction
      const upcomingFestivals = getUpcomingFestivals();
      if (upcomingFestivals?.length > 0) {
        const nextFestival = upcomingFestivals?.[0];
        const daysUntil = Math.ceil((new Date(nextFestival.date) - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntil <= 7 && daysUntil > 0) {
          generatedAlerts?.push({
            id: 'festival_preparation',
            type: 'info',
            priority: 'medium',
            title: culturalContext === 'hindi' ? 'त्योहार की तैयारी' : 'Festival Preparation',
            description: culturalContext === 'hindi' 
              ? `${nextFestival?.name} ${daysUntil} दिन में है। खर्च की योजना बनाएं।`
              : `${nextFestival?.name} is in ${daysUntil} days. Plan your expenses.`,
            suggestion: culturalContext === 'hindi' ?'त्योहारी खर्च के लिए बजट सेट करें।' :'Set a budget for festival expenses.',
            icon: 'Calendar',
            actionLabel: culturalContext === 'hindi' ? 'बजट बनाएं' : 'Create Budget',
            actionType: 'budget'
          });
        }
      }

      // Stress spending prediction based on calendar
      const stressfulEvents = getStressfulEvents();
      if (stressfulEvents?.length > 0) {
        const nextEvent = stressfulEvents?.[0];
        generatedAlerts?.push({
          id: 'stress_prediction',
          type: 'tip',
          priority: 'medium',
          title: culturalContext === 'hindi' ? 'तनाव की भविष्यवाणी' : 'Stress Prediction',
          description: culturalContext === 'hindi' 
            ? `${nextEvent?.name} के दौरान तनाव हो सकता है।`
            : `You might experience stress during ${nextEvent?.name}.`,
          suggestion: culturalContext === 'hindi' ?'पहले से ही तनाव प्रबंधन की रणनीति तैयार करें।' :'Prepare stress management strategies in advance.',
          icon: 'Shield',
          actionLabel: culturalContext === 'hindi' ? 'तनाव प्रबंधन' : 'Stress Management',
          actionType: 'stress_management'
        });
      }

      // Weekend spending alert
      const dayOfWeek = now?.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
        const weekendSpending = expenses?.filter(expense => {
          const expenseDate = new Date(expense.timestamp);
          const expenseDay = expenseDate?.getDay();
          return (expenseDay === 0 || expenseDay === 6) && // Weekend
                 Math.ceil((now - expenseDate) / (1000 * 60 * 60 * 24)) <= 30;
        });

        if (weekendSpending?.length > 0) {
          const avgWeekendSpending = weekendSpending?.reduce((sum, expense) => sum + expense?.amount, 0) / weekendSpending?.length;
          
          generatedAlerts?.push({
            id: 'weekend_spending',
            type: 'info',
            priority: 'low',
            title: culturalContext === 'hindi' ? 'सप्ताहांत खर्च अलर्ट' : 'Weekend Spending Alert',
            description: culturalContext === 'hindi' 
              ? `आपका औसत सप्ताहांत खर्च ₹${Math.round(avgWeekendSpending)} है।`
              : `Your average weekend spending is ₹${Math.round(avgWeekendSpending)}.`,
            suggestion: culturalContext === 'hindi' ?'सप्ताहांत के लिए खर्च की सीमा निर्धारित करें।' :'Set a spending limit for the weekend.',
            icon: 'Calendar',
            actionLabel: culturalContext === 'hindi' ? 'सीमा सेट करें' : 'Set Limit',
            actionType: 'set_limit'
          });
        }
      }

      // Family pressure spending alert
      const familyExpenses = recentExpenses?.filter(expense => 
        expense?.category === 'family' && expense?.emotion === 'stressed'
      );

      if (familyExpenses?.length >= 2) {
        generatedAlerts?.push({
          id: 'family_pressure',
          type: 'warning',
          priority: 'high',
          title: culturalContext === 'hindi' ? 'पारिवारिक दबाव' : 'Family Pressure',
          description: culturalContext === 'hindi' ?'पारिवारिक दबाव के कारण अधिक खर्च हो रहा है।' :'Increased spending due to family pressure detected.',
          suggestion: culturalContext === 'hindi' ?'परिवार के साथ वित्तीय सीमाओं पर चर्चा करें।' :'Discuss financial boundaries with family members.',
          icon: 'Users',
          actionLabel: culturalContext === 'hindi' ? 'पारिवारिक चर्चा' : 'Family Discussion',
          actionType: 'family_discussion'
        });
      }

      setAlerts(generatedAlerts);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getUpcomingFestivals = () => {
    const now = new Date();
    const currentYear = now?.getFullYear();
    
    const festivals = [
      { name: culturalContext === 'hindi' ? 'दिवाली' : 'Diwali', date: new Date(currentYear, 10, 12) },
      { name: culturalContext === 'hindi' ? 'होली' : 'Holi', date: new Date(currentYear + 1, 2, 15) },
      { name: culturalContext === 'hindi' ? 'दशहरा' : 'Dussehra', date: new Date(currentYear, 9, 22) },
      { name: culturalContext === 'hindi' ? 'करवा चौथ' : 'Karva Chauth', date: new Date(currentYear, 10, 1) }
    ];

    return festivals?.filter(festival => festival?.date > now)?.slice(0, 2);
  };

  const getStressfulEvents = () => {
    // Mock stressful events - in real app, this would come from calendar integration
    return [
      { name: culturalContext === 'hindi' ? 'कार्य की समय सीमा' : 'Work Deadline', date: new Date() },
      { name: culturalContext === 'hindi' ? 'परीक्षा का समय' : 'Exam Period', date: new Date() }
    ];
  };

  const handleAlertAction = (alert) => {
    switch (alert?.actionType) {
      case 'breathing': onAlertAction?.('breathing_exercise', alert);
        break;
      case 'budget': onAlertAction?.('create_budget', alert);
        break;
      case 'stress_management': onAlertAction?.('stress_management', alert);
        break;
      case 'set_limit': onAlertAction?.('set_spending_limit', alert);
        break;
      case 'family_discussion': onAlertAction?.('family_discussion_guide', alert);
        break;
      default:
        console.log('Unknown action type:', alert?.actionType);
    }
  };

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      case 'tip':
        return 'Lightbulb';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type, priority) => {
    if (priority === 'high') {
      return 'border-red-200 bg-red-50';
    } else if (type === 'warning') {
      return 'border-orange-200 bg-orange-50';
    } else if (type === 'info') {
      return 'border-blue-200 bg-blue-50';
    } else {
      return 'border-green-200 bg-green-50';
    }
  };

  const getAlertIconColor = (type, priority) => {
    if (priority === 'high') {
      return 'text-red-600';
    } else if (type === 'warning') {
      return 'text-orange-600';
    } else if (type === 'info') {
      return 'text-blue-600';
    } else {
      return 'text-green-600';
    }
  };

  const visibleAlerts = alerts?.filter(alert => !dismissedAlerts?.has(alert?.id));

  return (
    <div className={`bg-card rounded-xl border shadow-soft ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-heading text-foreground">
                {culturalContext === 'hindi' ? 'भविष्यवाणी अलर्ट' : 'Predictive Alerts'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ?'AI-आधारित खर्च की भविष्यवाणी और सुझाव' :'AI-powered spending predictions and suggestions'
                }
              </p>
            </div>
          </div>

          {isAnalyzing && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' ? 'विश्लेषण...' : 'Analyzing...'}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Alerts Content */}
      <div className="p-6">
        {visibleAlerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {culturalContext === 'hindi' ? 'कोई अलर्ट नहीं' : 'No Alerts'}
            </h3>
            <p className="text-muted-foreground">
              {culturalContext === 'hindi' ?'आपके खर्च के पैटर्न सामान्य लग रहे हैं।' :'Your spending patterns look normal.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleAlerts?.map((alert) => (
              <div
                key={alert?.id}
                className={`p-4 rounded-lg border ${getAlertColor(alert?.type, alert?.priority)} transition-ui`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Icon 
                      name={getAlertIcon(alert?.type)} 
                      size={20} 
                      className={getAlertIconColor(alert?.type, alert?.priority)} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base font-medium text-foreground">
                          {alert?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert?.description}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert?.id)}
                        iconName="X"
                        iconSize={16}
                        className="text-muted-foreground hover:text-foreground"
                      />
                    </div>

                    {alert?.suggestion && (
                      <div className="p-3 bg-white/50 rounded-md mb-3">
                        <div className="flex items-start space-x-2">
                          <Icon name="Lightbulb" size={16} className="text-amber-600 mt-0.5" />
                          <p className="text-sm text-foreground">{alert?.suggestion}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAlertAction(alert)}
                        iconName="ArrowRight"
                        iconPosition="right"
                        className="text-sm"
                      >
                        {alert?.actionLabel}
                      </Button>

                      {alert?.priority === 'high' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {culturalContext === 'hindi' ? 'उच्च प्राथमिकता' : 'High Priority'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Actions */}
      {visibleAlerts?.length > 0 && (
        <div className="p-6 border-t border-border/20 bg-muted/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {culturalContext === 'hindi' 
                ? `${visibleAlerts?.length} सक्रिय अलर्ट`
                : `${visibleAlerts?.length} active alerts`
              }
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDismissedAlerts(new Set(alerts.map(a => a.id)))}
                iconName="EyeOff"
                iconPosition="left"
              >
                {culturalContext === 'hindi' ? 'सभी छुपाएं' : 'Dismiss All'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generatePredictiveAlerts}
                iconName="RefreshCw"
                iconPosition="left"
              >
                {culturalContext === 'hindi' ? 'रीफ्रेश' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveAlerts;