import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { tokenService } from '../../services/TokenService';

const TokenBalanceCard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    // Initial load
    setBalance(tokenService.getBalance());
    const history = tokenService.getHistory();
    if (history.length > 0) {
      setLastTransaction(history[0]);
    }

    // Listen for updates
    const handleTokenUpdate = () => {
      setBalance(tokenService.getBalance());
      const newHistory = tokenService.getHistory();
      if (newHistory.length > 0) {
        setLastTransaction(newHistory[0]);
      }
    };

    document.addEventListener('fincoins-notification', handleTokenUpdate);
    return () => document.removeEventListener('fincoins-notification', handleTokenUpdate);
  }, []);

  return (
    <div 
      onClick={() => navigate('/tokens')}
      className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200/30 shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <Icon name="CircleDollarSign" size={20} color="white" />
          </div>
          <h3 className="text-lg font-heading text-foreground">FinCoins Balance</h3>
        </div>
        <span className="text-2xl font-bold text-amber-600">🪙 {balance}</span>
      </div>

      {lastTransaction && (
        <div className="text-sm text-muted-foreground">
          Last earned: {lastTransaction.amount} FinCoins for {lastTransaction.reason}
        </div>
      )}
    </div>
  );
};

export default TokenBalanceCard;
