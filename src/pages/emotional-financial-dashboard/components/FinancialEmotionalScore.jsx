import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { chatService } from '../../../services/ChatService';
import { expenseService } from '../../../services/ExpenseService';

const FinancialEmotionalScore = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  userProfile = null,
  className = '' 
}) => {
  const [feisScore, setFeisScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dailyAffirmation, setDailyAffirmation] = useState('');
  const [scoreHistory, setScoreHistory] = useState([]);

  // --- TAP TO CATCH COINS GAME STATE ---
  const [coins, setCoins] = useState([]);
  const [gameScore, setGameScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Start Game
  const startGame = () => {
    setGameScore(0);
    setTimeLeft(20);
    setCoins([]);
    setGameOver(false);
    setIsRunning(true);
  };

  // Pause Game
  const pauseGame = () => {
    setIsRunning(false);
  };

  // Resume Game
  const resumeGame = () => {
    setIsRunning(true);
  };

  // --- FEIS Score Calculation ---
  useEffect(() => {
    (async () => {
      try {
        const [history, expenses] = await Promise.all([
          chatService.getChatHistory().catch(() => []),
          expenseService.getExpenses().catch(() => [])
        ]);

        let score = 60;
        const recent = history.slice(-10).map(m => (m.emotion && m.emotion[0]) || 'neutral');
        recent.forEach(e => {
          if (['happy','excited','confident','hopeful'].includes(e)) score += 2;
          if (['calm','neutral'].includes(e)) score += 0.5;
          if (['stressed','anxious','frustrated','overwhelmed','angry'].includes(e)) score -= 2;
        });

        const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000);
        const recentSpend = expenses
          .filter(e => new Date(e.date) >= thirtyDaysAgo)
          .reduce((s,e)=> s + Number(e.amount), 0);
        if (recentSpend > 50000) score -= 5; 
        else if (recentSpend > 20000) score -= 2;

        score = Math.max(0, Math.min(100, Math.round(score)));
        setIsAnimating(true);
        setTimeout(() => { setFeisScore(score); setIsAnimating(false); }, 300);
        setScoreHistory(prev => [...prev.slice(-9), score]);

        // Personalized affirmation
        const userName = userProfile?.name || '';
        const nameGreeting = userName ? `, ${userName}` : '';
        const aff = score >= 70
          ? (culturalContext === 'hindi' 
              ? `आप सही दिशा में हैं${nameGreeting}—नियमितता बनाए रखें।` 
              : `You are on track${nameGreeting}—keep your routines consistent.`)
          : (culturalContext === 'hindi' 
              ? `छोटे कदमों से शुरुआत करें${nameGreeting}—आज एक खर्च श्रेणी कम करें।` 
              : `Start small${nameGreeting}—trim one spending category today.`);
        setDailyAffirmation(aff);
      } catch (err) {
        console.error('FEIS compute error:', err);
      }
    })();
  }, [emotionalState, culturalContext, userProfile]);

  // --- TAP TO CATCH COINS GAME LOGIC ---
  useEffect(() => {
    if (!isRunning || gameOver) return;

    // Spawn coins
    const coinInterval = setInterval(() => {
      setCoins(prev => [
        ...prev,
        { id: Date.now(), x: Math.random() * 80 + 10, y: 0 }
      ]);
    }, 1200);

    return () => clearInterval(coinInterval);
  }, [isRunning, gameOver]);

  useEffect(() => {
    if (!isRunning || gameOver) return;

    // Coin falling animation
    const fallInterval = setInterval(() => {
      setCoins(prev =>
        prev
          .map(c => ({ ...c, y: c.y + 5 }))
          .filter(c => c.y < 100)
      );
    }, 300);

    return () => clearInterval(fallInterval);
  }, [isRunning, gameOver]);

  useEffect(() => {
    if (!isRunning || gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      setIsRunning(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isRunning, gameOver]);

  const catchCoin = (id) => {
    setCoins(prev => prev.filter(c => c.id !== id));
    setGameScore(s => s + 1);
  };

  // --- FEIS helpers ---
  const getScoreColor = () => {
    if (feisScore >= 80) return 'text-success';
    if (feisScore >= 60) return 'text-primary';
    if (feisScore >= 40) return 'text-warning';
    return 'text-error';
  };

  const getScoreGradient = () => {
    if (feisScore >= 80) return 'from-success to-emerald-400';
    if (feisScore >= 60) return 'from-primary to-blue-400';
    if (feisScore >= 40) return 'from-warning to-amber-400';
    return 'from-error to-red-400';
  };

  const getEmotionalStateIcon = () => {
    switch (emotionalState) {
      case 'positive': return 'Smile';
      case 'stressed': return 'AlertTriangle';
      case 'anxious': return 'Frown';
      default: return 'Heart';
    }
  };

  const getEmotionalStateText = () => {
    if (culturalContext === 'hindi') {
      const states = {
        calm: 'शांत',
        positive: 'खुश',
        stressed: 'तनावग्रस्त',
        anxious: 'चिंतित'
      };
      return states?.[emotionalState] || 'शांत';
    }
    return emotionalState?.charAt(0)?.toUpperCase() + emotionalState?.slice(1);
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (feisScore / 100) * circumference;

  return (
    <div className={`glass-card rounded-2xl p-6 transition-emotional ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading text-foreground">
            {culturalContext === 'hindi' ? 'वित्तीय भावनात्मक स्कोर' : 'Financial Emotional Intelligence Score'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {culturalContext === 'hindi' ? 'आज का FEIS स्कोर' : "Today's FEIS Score"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name={getEmotionalStateIcon()} size={20} className={getScoreColor()} />
          <span className={`text-sm font-medium ${getScoreColor()}`}>
            {getEmotionalStateText()}
          </span>
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted/20" />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#scoreGradient)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${isAnimating ? 'animate-pulse' : ''}`}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor()}`}>{feisScore}</div>
              <div className="text-xs text-muted-foreground">
                {culturalContext === 'hindi' ? 'स्कोर' : 'Score'}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          {[
            { label: culturalContext === 'hindi' ? 'भावनात्मक नियंत्रण' : 'Emotional Control', value: Math.min(feisScore + 10, 100) },
            { label: culturalContext === 'hindi' ? 'वित्तीय जागरूकता' : 'Financial Awareness', value: feisScore },
            { label: culturalContext === 'hindi' ? 'निर्णय लेने की क्षमता' : 'Decision Making', value: Math.max(feisScore - 5, 0) }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${getScoreGradient()} transition-all duration-500`} style={{ width: `${item.value}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Affirmation */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="flex items-start space-x-3">
          <Icon name="Quote" size={20} className="text-primary mt-1" />
          <div>
            <h3 className="text-sm font-medium text-primary mb-1">
              {culturalContext === 'hindi' ? 'आज का प्रेरणादायक संदेश' : "Today's Affirmation"}
            </h3>
            <p className="text-sm text-primary/80 leading-relaxed">
              {dailyAffirmation}
            </p>
          </div>
        </div>
      </div>

      {/* --- TAP TO CATCH COINS GAME --- */}
      <div className="mt-4 p-4 rounded-xl bg-muted/20 border border-muted/40 text-center relative overflow-hidden h-56">
        <h3 className="text-sm font-medium text-primary mb-2">
          {culturalContext === 'hindi' ? 'सिक्के पकड़ो' : 'Tap to Catch Coins'}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">
          {culturalContext === 'hindi' ? 'सिक्के नीचे गिरने से पहले टैप करें!' : 'Tap the coins before they fall!'}
        </p>

        {/* Controls */}
        <div className="flex justify-center space-x-3 mb-3">
          {!isRunning && !gameOver && (
            <button
              onClick={startGame}
              className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
            >
              {culturalContext === 'hindi' ? 'शुरू करें' : 'Start'}
            </button>
          )}
          {isRunning && (
            <button
              onClick={pauseGame}
              className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600"
            >
              {culturalContext === 'hindi' ? 'रोकें' : 'Pause'}
            </button>
          )}
          {!isRunning && !gameOver && (
            <button
              onClick={resumeGame}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
            >
              {culturalContext === 'hindi' ? 'फिर से चालू करें' : 'Resume'}
            </button>
          )}
          {gameOver && (
            <button
              onClick={startGame}
              className="px-3 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600"
            >
              {culturalContext === 'hindi' ? 'फिर से खेलें' : 'Restart'}
            </button>
          )}
        </div>

        {/* Render Coins */}
        {isRunning &&
          coins.map(coin => (
            <div
              key={coin.id}
              onClick={() => catchCoin(coin.id)}
              className="absolute w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer shadow-md"
              style={{ left: `${coin.x}%`, top: `${coin.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <Icon name="CircleDollarSign" size={20} className="text-white" />
            </div>
          ))}

        {/* Timer & Score */}
        {!gameOver ? (
          <div className="absolute bottom-2 left-2 text-xs font-medium">
            {culturalContext === 'hindi' ? 'समय' : 'Time'}: {timeLeft}s
          </div>
        ) : (
          <div className="mt-6 text-sm font-semibold text-primary">
            {culturalContext === 'hindi'
              ? `आपने ${gameScore} सिक्के पकड़े!`
              : `You caught ${gameScore} coins!`}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialEmotionalScore;
