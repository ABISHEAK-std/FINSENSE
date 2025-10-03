import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenService } from '../../../services/TokenService';
import { BUSINESS_MODEL_CONFIG } from '../../../config/BusinessModelConfig';

const TokenRedemption = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);

  const rewards = [
    { id: 'dark_theme', name: 'Dark Theme', cost: 50, description: 'Unlock beautiful dark mode for your app', icon: '🌙' },
    { id: 'cultural_avatar', name: 'Cultural Avatar', cost: 100, description: 'Personalized avatar with cultural elements', icon: '👤' },
    { id: 'financial_wisdom', name: 'Financial Wisdom Insight', cost: 150, description: 'Advanced financial insights and tips', icon: '💡' },
    { id: 'community_badge', name: 'Community Badge', cost: 200, description: 'Exclusive community recognition badge', icon: '🏆' }
  ];

  useEffect(() => {
    // Load initial values from TokenService
    setBalance(tokenService.getBalance());
    setReferralCode(tokenService.getReferralCode());
    setReferralCount(tokenService.getReferralCount());

    // Listen for token updates
    const handleTokenNotification = () => {
      setBalance(tokenService.getBalance());
      setReferralCount(tokenService.getReferralCount());
    };

    document.addEventListener('fincoins-notification', handleTokenNotification);
    return () => document.removeEventListener('fincoins-notification', handleTokenNotification);
  }, []);

  // Redeem a reward
  const handleRedeem = (reward) => {
    try {
      const newBalance = tokenService.redeemTokens(reward.id);
      setBalance(newBalance);
      setMessage(`Successfully redeemed ${reward.name}!`);
      setMessageType('success');

      // Save redeemed item in localStorage
      const redeemedItems = JSON.parse(localStorage.getItem('redeemed_items') || '[]');
      redeemedItems.push({ ...reward, redeemedAt: new Date().toISOString() });
      localStorage.setItem('redeemed_items', JSON.stringify(redeemedItems));
    } catch (error) {
      setMessage(error.message || 'Redemption failed');
      setMessageType('error');
    }

    setTimeout(() => { setMessage(''); setMessageType(''); }, 3000);
  };

  const isRedeemed = (rewardId) => {
    const redeemedItems = JSON.parse(localStorage.getItem('redeemed_items') || '[]');
    return redeemedItems.some(item => item.id === rewardId);
  };

  // Award referral bonus
  const handleReferralSuccess = () => {
    try {
      const newBalance = tokenService.awardReferral();
      setReferralCount(tokenService.getReferralCount());
      setBalance(newBalance);
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
      setTimeout(() => { setMessage(''); setMessageType(''); }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/emotional-financial-dashboard')} className="mb-4 flex items-center text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Token Redemption Store</h1>
            <p className="text-gray-600 mb-6">Spend your FinCoins on exclusive rewards</p>
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
              <span className="mr-2">🪙</span>
              <span>{balance} FinCoins</span>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Referral Card */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Referral Program</h2>
              <p className="text-sm text-gray-700 mb-2">
                Share your code with friends & earn <b>+{BUSINESS_MODEL_CONFIG.TOKEN_REWARDS.referralBonus} FinCoins</b> per referral
              </p>
              <div className="bg-white p-2 rounded border text-center font-mono text-sm mb-2">{referralCode}</div>
              <p className="text-sm text-gray-600 mb-2">
                Successful Referrals: <b>{referralCount}</b> / {BUSINESS_MODEL_CONFIG.REFERRAL_CONFIG?.maxReferrals || 0}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${Math.min((referralCount / BUSINESS_MODEL_CONFIG.REFERRAL_CONFIG?.maxReferrals || 0) * 100, 100)}%` }}></div>
              </div>
              <button onClick={handleReferralSuccess} className="bg-green-600 text-white w-full py-2 rounded text-sm hover:bg-green-700">Simulate Referral</button>
            </div>

            {/* Other Earning Methods */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">💰 How to Earn More FinCoins</h2>
              <div className="space-y-3">
                <div><div className="text-xl">🎯</div><p className="text-sm font-medium text-gray-900">Festival Budget</p><p className="text-xs text-gray-600">+20 FinCoins</p></div>
                <div><div className="text-xl">📊</div><p className="text-sm font-medium text-gray-900">Daily Tracking</p><p className="text-xs text-gray-600">+10 FinCoins</p></div>
                <div><div className="text-xl">📈</div><p className="text-sm font-medium text-gray-900">Weekly Tracking</p><p className="text-xs text-gray-600">+10 FinCoins</p></div>
                <div><div className="text-xl">😊</div><p className="text-sm font-medium text-gray-900">Positive FEIS</p><p className="text-xs text-gray-600">+15 FinCoins</p></div>
              </div>
            </div>
          </div>

          {/* Right Column - Rewards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map((reward) => {
              const canAfford = balance >= reward.cost;
              const alreadyRedeemed = isRedeemed(reward.id);

              return (
                <div key={reward.id} className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all ${alreadyRedeemed ? 'border-green-200 bg-green-50' : canAfford ? 'border-blue-200 hover:border-blue-400' : 'border-gray-200 opacity-75'}`}>
                  <div className="text-center">
                    <div className="text-4xl mb-3">{reward.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{reward.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-yellow-600 text-lg font-bold">🪙 {reward.cost} FinCoins</span>
                    </div>
                    {alreadyRedeemed ? (
                      <div className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium">✓ Redeemed</div>
                    ) : (
                      <button onClick={() => handleRedeem(reward)} disabled={!canAfford} className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${canAfford ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                        {canAfford ? 'Redeem' : 'Not Enough FinCoins'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenRedemption;
