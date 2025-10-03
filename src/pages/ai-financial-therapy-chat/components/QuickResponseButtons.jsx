import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickResponseButtons = ({
  onQuickResponse,
  culturalContext = 'default',
  emotionalState = 'calm',
  isVisible = true,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getTherapyTopics = () => {
    if (culturalContext === 'hindi') {
      return [
        {
          id: 'money-anxiety',
          label: 'पैसे की चिंता',
          icon: 'AlertTriangle',
          color: 'text-warning',
          responses: [
            'मुझे पैसों के बारे में बहुत चिंता होती है',
            'मैं हमेशा पैसे खत्म होने का डर रखता हूं',
            'वित्तीय निर्णय लेना मुश्किल लगता है',
          ],
        },
        {
          id: 'family-pressure',
          label: 'पारिवारिक दबाव',
          icon: 'Users',
          color: 'text-error',
          responses: [
            'परिवार मुझसे ज्यादा कमाने की उम्मीद करता है',
            'घर की जिम्मेदारियां बहुत भारी लगती हैं',
            'पारिवारिक खर्चों का दबाव है',
          ],
        },
        {
          id: 'generational-trauma',
          label: 'पीढ़ियों का आघात',
          icon: 'Clock',
          color: 'text-purple-500',
          responses: [
            'मेरे परिवार में हमेशा पैसे की कमी रही है',
            'मैं गरीबी के डर से परेशान रहता हूं',
            'पैसे बचाना बहुत मुश्किल लगता है',
          ],
        },
        {
          id: 'cultural-expectations',
          label: 'सामाजिक अपेक्षाएं',
          icon: 'Crown',
          color: 'text-amber-500',
          responses: [
            'समाज में दिखावे का दबाव है',
            'त्योहारों में खर्च करने का दबाव',
            'शादी-विवाह के खर्चे की चिंता',
          ],
        },
      ];
    }

    return [
      {
        id: 'money-anxiety',
        label: 'Money Anxiety',
        icon: 'AlertTriangle',
        color: 'text-warning',
        responses: [
          'I feel anxious about money constantly',
          "I'm always worried about running out of money",
          'Making financial decisions feels overwhelming',
        ],
      },
      {
        id: 'family-pressure',
        label: 'Family Pressure',
        icon: 'Users',
        color: 'text-error',
        responses: [
          'My family expects me to earn more',
          'I feel burdened by family responsibilities',
          "There's pressure to support everyone financially",
        ],
      },
      {
        id: 'generational-trauma',
        label: 'Generational Wealth Trauma',
        icon: 'Clock',
        color: 'text-purple-500',
        responses: [
          'My family has always struggled with money',
          "I'm haunted by fear of poverty",
          'Saving money feels impossible for me',
        ],
      },
      {
        id: 'cultural-expectations',
        label: 'Cultural Financial Expectations',
        icon: 'Crown',
        color: 'text-amber-500',
        responses: [
          "There's pressure to maintain social status",
          'Festival expenses stress me out',
          'Wedding and ceremony costs worry me',
        ],
      },
    ];
  };

  const getEmergencyResponses = () => {
    if (culturalContext === 'hindi') {
      return [
        {
          id: 'crisis',
          label: 'तुरंत मदद चाहिए',
          icon: 'AlertCircle',
          color: 'text-error',
          urgent: true,
        },
        {
          id: 'breathing',
          label: 'सांस लेने में मदद',
          icon: 'Wind',
          color: 'text-blue-500',
          urgent: false,
        },
        {
          id: 'grounding',
          label: 'मन शांत करना',
          icon: 'Anchor',
          color: 'text-success',
          urgent: false,
        },
      ];
    }

    return [
      {
        id: 'crisis',
        label: 'I need immediate help',
        icon: 'AlertCircle',
        color: 'text-error',
        urgent: true,
      },
      {
        id: 'breathing',
        label: 'Help me breathe',
        icon: 'Wind',
        color: 'text-blue-500',
        urgent: false,
      },
      {
        id: 'grounding',
        label: 'Ground me',
        icon: 'Anchor',
        color: 'text-success',
        urgent: false,
      },
    ];
  };

  const therapyTopics = getTherapyTopics();
  const emergencyResponses = getEmergencyResponses();

  const handleTopicSelect = (topic) => {
    setSelectedCategory(topic?.id);
  };

  const handleResponseSelect = (response, topicId) => {
    onQuickResponse?.(response, topicId);
    setSelectedCategory(null);
  };

  const handleEmergencyResponse = (response) => {
    onQuickResponse?.(response?.label, response?.id, response?.urgent);
  };

  if (!isVisible) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Emergency Responses */}
      {emotionalState === 'stressed' || emotionalState === 'anxious' ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            {culturalContext === 'hindi' ? 'तत्काल सहायता:' : 'Immediate Support:'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {emergencyResponses?.map((response) => (
              <Button
                key={response?.id}
                variant={response?.urgent ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => handleEmergencyResponse(response)}
                iconName={response?.icon}
                iconPosition="left"
                iconSize={14}
                className={`${response?.color} transition-ui`}
              >
                {response?.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Therapy Topics */}
      {!selectedCategory ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            {culturalContext === 'hindi'
              ? 'आज किस बारे में बात करना चाहते हैं?'
              : 'What would you like to talk about today?'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {therapyTopics?.map((topic) => (
              <Button
                key={topic?.id}
                variant="outline"
                size="sm"
                onClick={() => handleTopicSelect(topic)}
                iconName={topic?.icon}
                iconPosition="left"
                iconSize={16}
                className={`justify-start text-left h-auto py-3 px-4 ${topic?.color} hover:bg-muted/50 transition-ui`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{topic?.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">
              {culturalContext === 'hindi' ? 'कुछ इस तरह कहें:' : 'You might say:'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              iconName="ArrowLeft"
              iconSize={14}
              className="text-muted-foreground"
            >
              {culturalContext === 'hindi' ? 'वापस' : 'Back'}
            </Button>
          </div>
          <div className="space-y-2">
            {therapyTopics
              ?.find((topic) => topic?.id === selectedCategory)
              ?.responses?.map((response, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResponseSelect(response, selectedCategory)}
                  className="justify-start text-left h-auto py-3 px-4 w-full bg-muted/20 hover:bg-muted/40 transition-ui"
                >
                  <div className="flex items-start space-x-2">
                    <Icon
                      name="MessageCircle"
                      size={14}
                      className="text-muted-foreground mt-0.5"
                    />
                    <span className="text-sm text-foreground">{response}</span>
                  </div>
                </Button>
              ))}
          </div>
        </div>
      )}

      {/* Additional Support Options */}
      <div className="pt-2 border-t border-border/20">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onQuickResponse?.(
                culturalContext === 'hindi'
                  ? 'मुझे कुछ सांस लेने की तकनीक सिखाएं'
                  : 'Can you teach me some breathing techniques?',
                'breathing-exercise'
              )
            }
            iconName="Wind"
            iconPosition="left"
            iconSize={14}
            className="text-blue-500"
          >
            {culturalContext === 'hindi' ? 'सांस की तकनीक' : 'Breathing Exercise'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onQuickResponse?.(
                culturalContext === 'hindi'
                  ? 'मेरी प्रगति कैसी चल रही है?'
                  : 'How am I progressing?',
                'progress-check'
              )
            }
            iconName="TrendingUp"
            iconPosition="left"
            iconSize={14}
            className="text-success"
          >
            {culturalContext === 'hindi' ? 'प्रगति देखें' : 'Check Progress'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickResponseButtons;
