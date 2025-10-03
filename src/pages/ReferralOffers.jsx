import React, { useState, useEffect } from 'react';
import { addTokens, getTokenBalance } from '../utils/BusinessModelConfig';

const ReferralOffers = () => {
  const [tokenBalance, setTokenBalance] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [friendEmail, setFriendEmail] = useState('');

  useEffect(() => {
    setTokenBalance(getTokenBalance());
    
    // Generate referral code if not exists
    let code = localStorage.getItem('referral_code');
    if (!code) {
      code = 'FINSENSE' + Math.random().toString(36).substr(2, 6).toUpperCase();
      localStorage.setItem('referral_code', code);
    }
    setReferralCode(code);
  }, []);

  const sendReferral = () => {
    if (!friendEmail) {
      alert('Please enter your friend\'s email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(friendEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    // Simulate sending referral
    setTimeout(() => {
      const newBalance = addTokens(200, 'Referral bonus');
      setTokenBalance(newBalance);
      alert('🎉 Your friend joined! You earned 200 FinCoins!');
    }, 2000);

    setFriendEmail('');
    alert('Referral sent! You\'ll earn 200 FinCoins when they join.');
  };

  const partnerOffers = [
    {
      id: 1,
      partner: 'PayTM',
      title: '10% Cashback on First Transaction',
      description: 'Get 10% cashback up to ₹100 on your first UPI payment',
      icon: '💳'
    },
    {
      id: 2,
      partner: 'PhonePe',
      title: 'Flat ₹50 Cashback',
      description: 'Flat ₹50 cashback on bill payments above ₹500',
      icon: '📱'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Referrals & Offers</h1>
          <p className="text-gray-600">Invite friends and discover exclusive partner offers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral Section */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🎁 Refer Friends</h2>
            
            {/* Token Balance Display */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{tokenBalance.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total FinCoins</p>
            </div>

            {/* Referral Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Code</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={referralCode}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode);
                    alert('Code copied!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Send Referral */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Invite by Email</label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={sendReferral}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Send
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Share your referral code with friends</li>
                <li>• They sign up using your code</li>
                <li>• Both of you get 200 FinCoins!</li>
              </ul>
            </div>
          </div>

          {/* Partner Offers Section */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🤝 Partner Offers</h2>
            
            <div className="space-y-4">
              {partnerOffers.map((offer) => (
                <div key={offer.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{offer.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{offer.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                      <p className="text-xs text-gray-500">by {offer.partner}</p>
                      <button className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700">
                        Claim Offer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralOffers;
