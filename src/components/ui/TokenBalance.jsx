import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenService } from '../../services/TokenService';

const TokenBalance = ({ className = '' }) => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setBalance(tokenService.getBalance());

    // Listen for token changes
    const handleTokenNotification = (event) => {
      setBalance(tokenService.getBalance());
      
      // Show animation for earned tokens
      if (event.detail.type === 'earned') {
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2000);
      }
    };

    document.addEventListener('fincoins-notification', handleTokenNotification);
    return () => {
      document.removeEventListener('fincoins-notification', handleTokenNotification);
    };
  }, []);

  return (
    <button
      onClick={() => navigate('/tokens')}
      className={`inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all ${
        showAnimation ? 'animate-pulse' : ''
      } ${className}`}
    >
      <span className="mr-1">FinCoins 🪙</span>
      <span>{balance}</span>
      {showAnimation && (
        <span className="ml-1 animate-bounce text-xs">+</span>
      )}
    </button>
  );
};

export default TokenBalance;
