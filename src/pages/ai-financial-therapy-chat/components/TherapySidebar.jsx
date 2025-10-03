import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TherapySidebar = ({ 
  culturalContext = 'default',
  emotionalState = 'calm',
  sessionProgress = {},
  onResourceSelect,
  onCommunityAccess,
  className = '' 
}) => {
  const [activeSection, setActiveSection] = useState('resources');

  const getTherapyResources = () => {
    if (culturalContext === 'hindi') {
      return [
        {
          id: 'breathing-exercises',
          title: 'सांस लेने की तकनीक',
          description: 'चिंता कम करने के लिए सांस की तकनीकें',
          icon: 'Wind',
          color: 'text-blue-500',
          duration: '5-10 मिनट'
        },
        {
          id: 'financial-meditation',
          title: 'वित्तीय ध्यान',
          description: 'पैसे की चिंता से मुक्ति के लिए ध्यान',
          icon: 'Brain',
          color: 'text-purple-500',
          duration: '10-15 मिनट'
        },
        {
          id: 'cultural-wisdom',
          title: 'पारंपरिक ज्ञान',
          description: 'भारतीय वित्तीय परंपराओं से सीख',
          icon: 'BookOpen',
          color: 'text-amber-500',
          duration: '5 मिनट पढ़ना'
        },
        {
          id: 'family-dynamics',
          title: 'पारिवारिक रिश्ते',
          description: 'पारिवारिक वित्तीय दबाव को समझना',
          icon: 'Users',
          color: 'text-green-500',
          duration: '15-20 मिनट'
        }
      ];
    }

    return [
      {
        id: 'breathing-exercises',
        title: 'Breathing Exercises',
        description: 'Techniques to reduce financial anxiety',
        icon: 'Wind',
        color: 'text-blue-500',
        duration: '5-10 min'
      },
      {
        id: 'financial-meditation',
        title: 'Financial Meditation',
        description: 'Guided meditations for money stress',
        icon: 'Brain',
        color: 'text-purple-500',
        duration: '10-15 min'
      },
      {
        id: 'cultural-wisdom',
        title: 'Cultural Financial Wisdom',
        description: 'Traditional approaches to money management',
        icon: 'BookOpen',
        color: 'text-amber-500',
        duration: '5 min read'
      },
      {
        id: 'family-dynamics',
        title: 'Family Financial Dynamics',
        description: 'Understanding family financial pressures',
        icon: 'Users',
        color: 'text-green-500',
        duration: '15-20 min'
      }
    ];
  };

  const getCommunityGroups = () => {
    if (culturalContext === 'hindi') {
      return [
        {
          id: 'anxiety-support',
          name: 'वित्तीय चिंता सहायता समूह',
          members: 1247,
          description: 'पैसे की चिंता से जूझ रहे लोगों का समुदाय',
          isActive: true
        },
        {
          id: 'family-pressure',
          name: 'पारिवारिक दबाव सहायता',
          members: 892,
          description: 'पारिवारिक वित्तीय दबाव को समझने वाला समूह',
          isActive: true
        },
        {
          id: 'young-professionals',
          name: 'युवा पेशेवर',
          members: 2156,
          description: 'करियर शुरुआत में वित्तीय चुनौतियां',
          isActive: false
        }
      ];
    }

    return [
      {
        id: 'anxiety-support',
        name: 'Financial Anxiety Support',
        members: 1247,
        description: 'Community for those dealing with money anxiety',
        isActive: true
      },
      {
        id: 'family-pressure',
        name: 'Family Financial Pressure',
        members: 892,
        description: 'Support for family financial expectations',
        isActive: true
      },
      {
        id: 'young-professionals',
        name: 'Young Professionals',
        members: 2156,
        description: 'Early career financial challenges',
        isActive: false
      }
    ];
  };

  const getProgressMetrics = () => {
    return {
      sessionsCompleted: sessionProgress?.sessionsCompleted || 12,
      emotionalGrowth: sessionProgress?.emotionalGrowth || 78,
      anxietyReduction: sessionProgress?.anxietyReduction || 65,
      financialConfidence: sessionProgress?.financialConfidence || 82
    };
  };

  const resources = getTherapyResources();
  const communityGroups = getCommunityGroups();
  const progress = getProgressMetrics();

  const sidebarSections = [
    {
      id: 'resources',
      label: culturalContext === 'hindi' ? 'संसाधन' : 'Resources',
      icon: 'BookOpen'
    },
    {
      id: 'community',
      label: culturalContext === 'hindi' ? 'समुदाय' : 'Community',
      icon: 'Users'
    },
    {
      id: 'progress',
      label: culturalContext === 'hindi' ? 'प्रगति' : 'Progress',
      icon: 'TrendingUp'
    }
  ];

  return (
    <div className={`w-80 bg-white/80 backdrop-blur-md border-l border-border/20 ${className}`}>

      {/* Sidebar Header */}
      <div className="p-4 border-b border-border/20">
        <h2 className="text-lg font-heading text-foreground">
          {culturalContext === 'hindi' ? 'चिकित्सा सहायता' : 'Therapy Support'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {culturalContext === 'hindi' ? 'आपकी वित्तीय कल्याण यात्रा' : 'Your financial wellness journey'}
        </p>
      </div>

      {/* Section Navigation */}
      <div className="flex border-b border-border/20">
        {sidebarSections?.map((section) => (
          <button
            key={section?.id}
            onClick={() => setActiveSection(section?.id)}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium transition-ui
              ${activeSection === section?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
              }
            `}
          >
            <Icon name={section?.icon} size={16} />
            <span className="hidden lg:inline">{section?.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Resources Section */}
        {activeSection === 'resources' && (
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              {culturalContext === 'hindi' ? 'चिकित्सा संसाधन' : 'Therapy Resources'}
            </h3>
            
            <div className="space-y-3">
              {resources?.map((resource) => (
                <div
                  key={resource?.id}
                  onClick={() => onResourceSelect?.(resource)}
                  className="p-3 rounded-lg border border-border/20 hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-ui"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center">
                      <Icon name={resource?.icon} size={16} className={resource?.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {resource?.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {resource?.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {resource?.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-border/20">
              <h4 className="text-sm font-medium text-foreground mb-3">
                {culturalContext === 'hindi' ? 'त्वरित कार्य' : 'Quick Actions'}
              </h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResourceSelect?.({ id: 'emergency-breathing' })}
                  iconName="Wind"
                  iconPosition="left"
                  iconSize={14}
                  className="w-full justify-start text-blue-500 border-blue-200 hover:bg-blue-50"
                >
                  {culturalContext === 'hindi' ? 'आपातकालीन सांस तकनीक' : 'Emergency Breathing'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResourceSelect?.({ id: 'grounding-exercise' })}
                  iconName="Anchor"
                  iconPosition="left"
                  iconSize={14}
                  className="w-full justify-start text-green-500 border-green-200 hover:bg-green-50"
                >
                  {culturalContext === 'hindi' ? 'ग्राउंडिंग एक्सरसाइज' : 'Grounding Exercise'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Community Section */}
        {activeSection === 'community' && (
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              {culturalContext === 'hindi' ? 'सहायता समुदाय' : 'Support Community'}
            </h3>
            
            <div className="space-y-3">
              {communityGroups?.map((group) => (
                <div
                  key={group?.id}
                  onClick={() => onCommunityAccess?.(group)}
                  className="p-3 rounded-lg border border-border/20 hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-ui"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground">
                      {group?.name}
                    </h4>
                    <div className={`
                      w-2 h-2 rounded-full
                      ${group?.isActive ? 'bg-success' : 'bg-muted-foreground'}
                    `} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {group?.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {group?.members?.toLocaleString()} {culturalContext === 'hindi' ? 'सदस्य' : 'members'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Community Guidelines */}
            <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Shield" size={14} className="text-success" />
                <span className="text-sm font-medium text-success">
                  {culturalContext === 'hindi' ? 'सुरक्षित स्थान' : 'Safe Space'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {culturalContext === 'hindi'
                  ? 'सभी बातचीत गुमनाम और सुरक्षित हैं। कृपया दूसरों का सम्मान करें।'
                  : 'All conversations are anonymous and secure. Please respect others.'}
              </p>
            </div>
          </div>
        )}

        {/* Progress Section */}
        {activeSection === 'progress' && (
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              {culturalContext === 'hindi' ? 'आपकी प्रगति' : 'Your Progress'}
            </h3>
            
            {/* Progress Metrics */}
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {culturalContext === 'hindi' ? 'पूर्ण सत्र' : 'Sessions Completed'}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {progress?.sessionsCompleted}
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress?.sessionsCompleted * 5, 100)}%` }}
                  />
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: culturalContext === 'hindi' ? 'भावनात्मक विकास' : 'Emotional Growth',
                      value: progress?.emotionalGrowth,
                      color: 'text-success',
                      bgColor: 'bg-success'
                    },
                    {
                      label: culturalContext === 'hindi' ? 'चिंता में कमी' : 'Anxiety Reduction',
                      value: progress?.anxietyReduction,
                      color: 'text-blue-500',
                      bgColor: 'bg-blue-500'
                    },
                    {
                      label: culturalContext === 'hindi' ? 'वित्तीय आत्मविश्वास' : 'Financial Confidence',
                      value: progress?.financialConfidence,
                      color: 'text-amber-500',
                      bgColor: 'bg-amber-500'
                    }
                  ]?.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{metric?.label}</span>
                        <span className={`text-sm font-medium ${metric?.color}`}>
                          {metric?.value}%
                        </span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div
                          className={`${metric?.bgColor} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${metric?.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="pt-4 border-t border-border/20">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  {culturalContext === 'hindi' ? 'उपलब्धियां' : 'Achievements'}
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      icon: 'Award',
                      title: culturalContext === 'hindi' ? 'पहला सप्ताह पूरा' : 'First Week Complete',
                      earned: true
                    },
                    {
                      icon: 'Target',
                      title: culturalContext === 'hindi' ? 'चिंता प्रबंधन' : 'Anxiety Management',
                      earned: true
                    },
                    {
                      icon: 'Star',
                      title: culturalContext === 'hindi' ? 'वित्तीय स्पष्टता' : 'Financial Clarity',
                      earned: false
                    }
                  ]?.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${achievement?.earned 
                          ? 'bg-success/20 text-success' 
                          : 'bg-muted/30 text-muted-foreground'
                        }
                      `}>
                        <Icon name={achievement?.icon} size={14} />
                      </div>
                      <span className={`text-sm ${achievement?.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement?.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapySidebar;
