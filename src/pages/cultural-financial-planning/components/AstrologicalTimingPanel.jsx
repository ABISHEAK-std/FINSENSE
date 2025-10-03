import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AstrologicalTimingPanel = ({ 
  culturalContext = 'default',
  onTimingSelect,
  className = '' 
}) => {
  const [currentMuhurat, setCurrentMuhurat] = useState(null);
  const [upcomingMuhurats, setUpcomingMuhurats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Mock astrological data - in real app, this would come from an astrological API
    const mockMuhurats = generateMockMuhurats();
    setUpcomingMuhurats(mockMuhurats);
    
    // Check if current time is auspicious
    const now = new Date();
    const currentHour = now?.getHours();
    const isAuspicious = (currentHour >= 6 && currentHour <= 8) || 
                        (currentHour >= 10 && currentHour <= 12) ||
                        (currentHour >= 16 && currentHour <= 18);
    
    if (isAuspicious) {
      setCurrentMuhurat({
        name: culturalContext === 'hindi' ? 'शुभ मुहूर्त' : 'Auspicious Time',
        type: 'general',
        startTime: `${currentHour}:00`,
        endTime: `${currentHour + 2}:00`,
        significance: culturalContext === 'hindi' ?'वित्तीय निर्णयों के लिए अच्छा समय' :'Good time for financial decisions'
      });
    }
  }, [culturalContext]);

  const generateMockMuhurats = () => {
    const muhurats = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date?.setDate(today?.getDate() + i);
      
      muhurats?.push({
        id: i,
        date: date?.toDateString(),
        name: culturalContext === 'hindi' ? 'धन मुहूर्त' : 'Wealth Muhurat',
        type: 'investment',
        startTime: '10:30',
        endTime: '12:00',
        planet: culturalContext === 'hindi' ? 'बुध' : 'Mercury',
        significance: culturalContext === 'hindi' ?'निवेश और व्यापारिक निर्णयों के लिए उत्तम' :'Excellent for investment and business decisions',
        activities: culturalContext === 'hindi' 
          ? ['सोना खरीदना', 'निवेश करना', 'व्यापार शुरू करना']
          : ['Buying Gold', 'Making Investments', 'Starting Business'],
        avoidActivities: culturalContext === 'hindi'
          ? ['कर्ज लेना', 'बड़े खर्च करना']
          : ['Taking Loans', 'Major Expenses']
      });
    }
    
    return muhurats;
  };

  const getPlanetIcon = (planet) => {
    const icons = {
      'Mercury': 'Zap',
      'Venus': 'Heart',
      'Jupiter': 'Crown',
      'Mars': 'Flame',
      'Saturn': 'Clock',
      'बुध': 'Zap',
      'शुक्र': 'Heart',
      'बृहस्पति': 'Crown',
      'मंगल': 'Flame',
      'शनि': 'Clock'
    };
    return icons?.[planet] || 'Star';
  };

  const getMuhuratTypeColor = (type) => {
    const colors = {
      investment: 'text-success',
      business: 'text-primary',
      purchase: 'text-warning',
      general: 'text-muted-foreground'
    };
    return colors?.[type] || 'text-primary';
  };

  const renderCurrentMuhurat = () => {
    if (!currentMuhurat || !isEnabled) return null;

    return (
      <div className="p-4 rounded-lg bg-gradient-to-r from-success/10 to-primary/10 border border-success/20 mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
            <Icon name="Star" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-base font-medium text-success">{currentMuhurat?.name}</h3>
            <p className="text-sm text-success/80">
              {currentMuhurat?.startTime} - {currentMuhurat?.endTime}
            </p>
          </div>
          <div className="ml-auto">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-sm text-success/80">{currentMuhurat?.significance}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 border-success text-success hover:bg-success hover:text-white"
          iconName="Clock"
          iconPosition="left"
        >
          {culturalContext === 'hindi' ? 'अभी निवेश करें' : 'Invest Now'}
        </Button>
      </div>
    );
  };

  const renderMuhuratCard = (muhurat) => (
    <div key={muhurat?.id} className="glass-card rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted/30`}>
            <Icon 
              name={getPlanetIcon(muhurat?.planet)} 
              size={20} 
              className={getMuhuratTypeColor(muhurat?.type)} 
            />
          </div>
          <div>
            <h4 className="text-base font-medium text-foreground">{muhurat?.name}</h4>
            <p className="text-xs text-muted-foreground">{muhurat?.date}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary`}>
          {muhurat?.planet}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {culturalContext === 'hindi' ? 'समय' : 'Time'}
          </span>
          <span className="font-medium text-foreground">
            {muhurat?.startTime} - {muhurat?.endTime}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{muhurat?.significance}</p>
      </div>

      {/* Recommended Activities */}
      <div className="mb-3">
        <h5 className="text-xs font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'अनुशंसित गतिविधियां' : 'Recommended Activities'}
        </h5>
        <div className="flex flex-wrap gap-1">
          {muhurat?.activities?.map((activity, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-success/10 text-success rounded-full"
            >
              {activity}
            </span>
          ))}
        </div>
      </div>

      {/* Activities to Avoid */}
      <div className="mb-4">
        <h5 className="text-xs font-medium text-foreground mb-2">
          {culturalContext === 'hindi' ? 'बचने योग्य गतिविधियां' : 'Activities to Avoid'}
        </h5>
        <div className="flex flex-wrap gap-1">
          {muhurat?.avoidActivities?.map((activity, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-error/10 text-error rounded-full"
            >
              {activity}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Calendar"
          iconPosition="left"
          className="flex-1"
          onClick={() => onTimingSelect?.(muhurat)}
        >
          {culturalContext === 'hindi' ? 'रिमाइंडर सेट करें' : 'Set Reminder'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Share"
          iconPosition="left"
          className="flex-1"
        >
          {culturalContext === 'hindi' ? 'साझा करें' : 'Share'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`glass-card rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading text-foreground">
            {culturalContext === 'hindi' ? 'ज्योतिषीय मुहूर्त' : 'Astrological Timing'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' ?'वित्तीय निर्णयों के लिए शुभ समय' :'Auspicious times for financial decisions'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' ? 'सक्षम करें' : 'Enable'}
          </span>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`
              relative w-12 h-6 rounded-full transition-ui
              ${isEnabled ? 'bg-primary' : 'bg-muted'}
            `}
          >
            <div className={`
              absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
              ${isEnabled ? 'translate-x-7' : 'translate-x-1'}
            `} />
          </button>
        </div>
      </div>
      {!isEnabled ? (
        <div className="text-center py-12">
          <Icon name="Star" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {culturalContext === 'hindi' ? 'ज्योतिषीय सुझाव बंद हैं' : 'Astrological Guidance Disabled'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {culturalContext === 'hindi' ?'वित्तीय निर्णयों के लिए शुभ मुहूर्त देखने के लिए इसे सक्षम करें' :'Enable to see auspicious timings for your financial decisions'
            }
          </p>
          <Button
            variant="outline"
            onClick={() => setIsEnabled(true)}
            iconName="Star"
            iconPosition="left"
          >
            {culturalContext === 'hindi' ? 'सक्षम करें' : 'Enable Now'}
          </Button>
        </div>
      ) : (
        <div>
          {/* Current Muhurat */}
          {renderCurrentMuhurat()}

          {/* Upcoming Muhurats */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground mb-4">
              {culturalContext === 'hindi' ? 'आगामी शुभ मुहूर्त' : 'Upcoming Auspicious Times'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingMuhurats?.slice(0, 4)?.map(renderMuhuratCard)}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm text-warning font-medium mb-1">
                  {culturalContext === 'hindi' ? 'अस्वीकरण' : 'Disclaimer'}
                </p>
                <p className="text-xs text-warning/80">
                  {culturalContext === 'hindi' ?'ज्योतिषीय सुझाव केवल मार्गदर्शन के लिए हैं। वित्तीय निर्णय लेने से पहले विशेषज्ञ सलाह लें।' :'Astrological guidance is for reference only. Please consult financial experts before making investment decisions.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstrologicalTimingPanel;