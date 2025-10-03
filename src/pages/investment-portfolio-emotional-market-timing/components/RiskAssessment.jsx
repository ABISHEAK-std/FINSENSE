import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RiskAssessment = ({ culturalContext, userProfile, onProfileUpdate }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [riskScore, setRiskScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const getQuestions = () => {
    if (culturalContext === 'hindi') {
      return [
        {
          id: 'investment_experience',
          question: 'आपका निवेश अनुभव कैसा है?',
          options: [
            { value: 1, text: 'मैं निवेश में नया हूं', score: 1 },
            { value: 2, text: '1-3 साल का अनुभव है', score: 2 },
            { value: 3, text: '3-5 साल का अनुभव है', score: 3 },
            { value: 4, text: '5+ साल का व्यापक अनुभव है', score: 4 }
          ]
        },
        {
          id: 'loss_tolerance',
          question: 'अगर आपका निवेश 20% घट जाए तो आप क्या करेंगे?',
          options: [
            { value: 1, text: 'तुरंत बेच दूंगा', score: 1 },
            { value: 2, text: 'चिंतित होकर कुछ बेच दूंगा', score: 2 },
            { value: 3, text: 'इंतजार करूंगा', score: 3 },
            { value: 4, text: 'और खरीदूंगा', score: 4 }
          ]
        },
        {
          id: 'time_horizon',
          question: 'आप कितने समय के लिए निवेश करना चाहते हैं?',
          options: [
            { value: 1, text: '1 साल से कम', score: 1 },
            { value: 2, text: '1-3 साल', score: 2 },
            { value: 3, text: '3-7 साल', score: 3 },
            { value: 4, text: '7+ साल', score: 4 }
          ]
        },
        {
          id: 'income_stability',
          question: 'आपकी आय कितनी स्थिर है?',
          options: [
            { value: 1, text: 'बहुत अस्थिर', score: 1 },
            { value: 2, text: 'कुछ अस्थिर', score: 2 },
            { value: 3, text: 'काफी स्थिर', score: 3 },
            { value: 4, text: 'पूरी तरह स्थिर', score: 4 }
          ]
        },
        {
          id: 'emergency_fund',
          question: 'क्या आपके पास आपातकालीन फंड है?',
          options: [
            { value: 1, text: 'नहीं', score: 1 },
            { value: 2, text: '1-3 महीने का खर्च', score: 2 },
            { value: 3, text: '3-6 महीने का खर्च', score: 3 },
            { value: 4, text: '6+ महीने का खर्च', score: 4 }
          ]
        }
      ];
    }

    return [
      {
        id: 'investment_experience',
        question: 'What is your investment experience?',
        options: [
          { value: 1, text: 'I am new to investing', score: 1 },
          { value: 2, text: '1-3 years of experience', score: 2 },
          { value: 3, text: '3-5 years of experience', score: 3 },
          { value: 4, text: '5+ years of extensive experience', score: 4 }
        ]
      },
      {
        id: 'loss_tolerance',
        question: 'If your investment dropped by 20%, what would you do?',
        options: [
          { value: 1, text: 'Sell immediately', score: 1 },
          { value: 2, text: 'Worry and sell some', score: 2 },
          { value: 3, text: 'Wait it out', score: 3 },
          { value: 4, text: 'Buy more', score: 4 }
        ]
      },
      {
        id: 'time_horizon',
        question: 'How long do you plan to invest?',
        options: [
          { value: 1, text: 'Less than 1 year', score: 1 },
          { value: 2, text: '1-3 years', score: 2 },
          { value: 3, text: '3-7 years', score: 3 },
          { value: 4, text: '7+ years', score: 4 }
        ]
      },
      {
        id: 'income_stability',
        question: 'How stable is your income?',
        options: [
          { value: 1, text: 'Very unstable', score: 1 },
          { value: 2, text: 'Somewhat unstable', score: 2 },
          { value: 3, text: 'Fairly stable', score: 3 },
          { value: 4, text: 'Very stable', score: 4 }
        ]
      },
      {
        id: 'emergency_fund',
        question: 'Do you have an emergency fund?',
        options: [
          { value: 1, text: 'No', score: 1 },
          { value: 2, text: '1-3 months expenses', score: 2 },
          { value: 3, text: '3-6 months expenses', score: 3 },
          { value: 4, text: '6+ months expenses', score: 4 }
        ]
      }
    ];
  };

  const questions = getQuestions();

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateRiskScore();
    }
  };

  const calculateRiskScore = () => {
    const totalScore = Object.values(answers).reduce((sum, answer) => sum + answer.score, 0);
    const maxScore = questions.length * 4;
    const normalizedScore = Math.round((totalScore / maxScore) * 100);
    
    setRiskScore(normalizedScore);
    setShowResults(true);

    // Update user profile
    const riskLevel = normalizedScore >= 75 ? 'aggressive' : 
                     normalizedScore >= 50 ? 'moderate' : 'conservative';
    
    onProfileUpdate(prev => ({
      ...prev,
      riskTolerance: riskLevel,
      riskScore: normalizedScore
    }));
  };

  const getRiskLevel = () => {
    if (riskScore >= 75) return { 
      level: culturalContext === 'hindi' ? 'आक्रामक' : 'Aggressive',
      color: 'text-red-600',
      description: culturalContext === 'hindi' 
        ? 'आप उच्च जोखिम सहन कर सकते हैं और उच्च रिटर्न चाहते हैं'
        : 'You can tolerate high risk and seek high returns'
    };
    if (riskScore >= 50) return { 
      level: culturalContext === 'hindi' ? 'मध्यम' : 'Moderate',
      color: 'text-yellow-600',
      description: culturalContext === 'hindi' 
        ? 'आप संतुलित जोखिम और रिटर्न चाहते हैं'
        : 'You prefer balanced risk and returns'
    };
    return { 
      level: culturalContext === 'hindi' ? 'रूढ़िवादी' : 'Conservative',
      color: 'text-green-600',
      description: culturalContext === 'hindi' 
        ? 'आप कम जोखिम और स्थिर रिटर्न पसंद करते हैं'
        : 'You prefer low risk and stable returns'
    };
  };

  const restartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setRiskScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const riskLevel = getRiskLevel();
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-foreground mb-2">
            {culturalContext === 'hindi' ? 'जोखिम मूल्यांकन परिणाम' : 'Risk Assessment Results'}
          </h2>
          <p className="text-muted-foreground">
            {culturalContext === 'hindi' 
              ? 'आपका निवेश जोखिम प्रोफाइल तैयार है'
              : 'Your investment risk profile is ready'
            }
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Risk Score Display */}
          <div className="bg-card rounded-xl border p-8 text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - riskScore / 100)}`}
                  strokeLinecap="round"
                  className={riskLevel.color}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${riskLevel.color}`}>{riskScore}</div>
                  <div className="text-xs text-muted-foreground">
                    {culturalContext === 'hindi' ? 'स्कोर' : 'Score'}
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className={`text-xl font-heading ${riskLevel.color} mb-2`}>
              {riskLevel.level}
            </h3>
            <p className="text-muted-foreground">
              {riskLevel.description}
            </p>
          </div>

          {/* Investment Recommendations */}
          <div className="bg-card rounded-xl border p-6">
            <h4 className="text-lg font-heading text-foreground mb-4">
              {culturalContext === 'hindi' ? 'सुझावित निवेश रणनीति' : 'Recommended Investment Strategy'}
            </h4>
            
            <div className="space-y-4">
              {riskScore >= 75 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h5 className="font-medium text-red-800 mb-2">
                    {culturalContext === 'hindi' ? 'आक्रामक पोर्टफोलियो' : 'Aggressive Portfolio'}
                  </h5>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• {culturalContext === 'hindi' ? '70-80% इक्विटी' : '70-80% Equity'}</li>
                    <li>• {culturalContext === 'hindi' ? '10-20% डेब्ट' : '10-20% Debt'}</li>
                    <li>• {culturalContext === 'hindi' ? '5-10% वैकल्पिक निवेश' : '5-10% Alternative investments'}</li>
                  </ul>
                </div>
              )}
              
              {riskScore >= 50 && riskScore < 75 && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h5 className="font-medium text-yellow-800 mb-2">
                    {culturalContext === 'hindi' ? 'संतुलित पोर्टफोलियो' : 'Balanced Portfolio'}
                  </h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• {culturalContext === 'hindi' ? '50-60% इक्विटी' : '50-60% Equity'}</li>
                    <li>• {culturalContext === 'hindi' ? '30-40% डेब्ट' : '30-40% Debt'}</li>
                    <li>• {culturalContext === 'hindi' ? '5-10% गोल्ड/रियल एस्टेट' : '5-10% Gold/Real Estate'}</li>
                  </ul>
                </div>
              )}
              
              {riskScore < 50 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-800 mb-2">
                    {culturalContext === 'hindi' ? 'रूढ़िवादी पोर्टफोलियो' : 'Conservative Portfolio'}
                  </h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• {culturalContext === 'hindi' ? '20-30% इक्विटी' : '20-30% Equity'}</li>
                    <li>• {culturalContext === 'hindi' ? '60-70% डेब्ट/FD' : '60-70% Debt/FD'}</li>
                    <li>• {culturalContext === 'hindi' ? '10% लिक्विड फंड' : '10% Liquid funds'}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={restartAssessment} variant="outline">
              {culturalContext === 'hindi' ? 'दोबारा करें' : 'Retake Assessment'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading text-foreground mb-2">
          {culturalContext === 'hindi' ? 'जोखिम मूल्यांकन' : 'Risk Assessment'}
        </h2>
        <p className="text-muted-foreground">
          {culturalContext === 'hindi' 
            ? 'कुछ प्रश्नों के उत्तर देकर अपना निवेश जोखिम प्रोफाइल जानें'
            : 'Answer a few questions to determine your investment risk profile'
          }
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{culturalContext === 'hindi' ? 'प्रगति' : 'Progress'}</span>
            <span>{currentQuestion + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-card rounded-xl border p-8">
          <h3 className="text-lg font-heading text-foreground mb-6">
            {questions[currentQuestion]?.question}
          </h3>
          
          <div className="space-y-3">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-ui"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  <span className="text-foreground">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
