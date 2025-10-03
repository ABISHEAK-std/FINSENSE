import React, { useState, useEffect } from 'react';
import { getTokenBalance, spendTokens } from '../utils/BusinessModelConfig';

const TokenRedemption = () => {
  const [tokenBalance, setTokenBalance] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('themes');
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    setTokenBalance(getTokenBalance());
    loadPurchaseHistory();
  }, []);

  const loadPurchaseHistory = () => {
    const history = JSON.parse(localStorage.getItem('token_purchases') || '[]');
    setPurchaseHistory(history);
  };

  const redeemableItems = {
    themes: [
      { id: 'dark', name: 'Dark Theme', cost: 100, icon: '🌙' },
      { id: 'nature', name: 'Nature Theme', cost: 150, icon: '🌿' },
      { id: 'festival', name: 'Festival Theme', cost: 200, icon: '🎉' }
    ],
    avatars: [
      { id: 'traditional', name: 'Traditional Avatar', cost: 250, icon: '🧑‍🎨' },
      { id: 'modern', name: 'Modern Avatar', cost: 200, icon: '👨‍💼' },
      { id: 'cultural', name: 'Cultural Avatar', cost: 300, icon: '🕺' }
    ],
    insights: [
      { id: 'advanced_analytics', name: 'Advanced Analytics Report', cost: 500, icon: '📊' },
      { id: 'market_prediction', name: 'Market Prediction Insights', cost: 400, icon: '🔮' },
      { id: 'personalized_tips', name: 'Personalized Tips Bundle', cost: 300, icon: '💡' }
    ]
  };

  const handleRedeem = (item) => {
    if (tokenBalance < item.cost) {
      alert('Insufficient tokens!');
      return;
    }

    if (window.confirm(`Redeem ${item.name} for ${item.cost} FinCoins?`)) {
      const success = spendTokens(item.cost, `Redeemed ${item.name}`);
      
      if (success) {
        setTokenBalance(getTokenBalance());
        
        // Add to purchase history
        const purchase = {
          id: Date.now(),
          item: item.name,
          cost: item.cost,
          category: selectedCategory,
          date: new Date().toISOString()
        };
        
        const updatedHistory = [purchase, ...purchaseHistory];
        setPurchaseHistory(updatedHistory);
        localStorage.setItem('token_purchases', JSON.stringify(updatedHistory));
        
        alert(`Successfully redeemed ${item.name}!`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FinCoin Store</h1>
          <p className="text-gray-600">Redeem your tokens for exclusive rewards</p>
          
          {/* Token Balance */}
          <div className="mt-6 inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🪙</span>
              <div>
                <p className="text-sm opacity-90">Your Balance</p>
                <p className="text-2xl font-bold">{tokenBalance.toLocaleString()} FinCoins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-1 shadow-sm">
              {Object.keys(redeemableItems).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-md font-medium text-sm capitalize transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {redeemableItems[selectedCategory].map((item) => (
            <div key={item.id} className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-xl">🪙</span>
                  <span className="text-xl font-bold text-blue-600">{item.cost}</span>
                </div>
                <button
                  onClick={() => handleRedeem(item)}
                  disabled={tokenBalance < item.cost}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    tokenBalance >= item.cost
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {tokenBalance >= item.cost ? 'Redeem' : 'Insufficient Tokens'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Purchase History */}
        {purchaseHistory.length > 0 && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Purchases</h3>
            <div className="space-y-3">
              {purchaseHistory.slice(0, 5).map((purchase) => (
                <div key={purchase.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{purchase.item}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(purchase.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">-{purchase.cost} 🪙</p>
                    <p className="text-xs text-gray-500 capitalize">{purchase.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenRedemption;
    
