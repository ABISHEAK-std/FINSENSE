import React, { useState, useEffect } from 'react';

const TokenNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleTokenNotification = (event) => {
      const { message, type, amount } = event.detail;
      
      const notification = {
        id: Date.now(),
        message,
        type,
        amount,
        timestamp: Date.now()
      };

      setNotifications(prev => [...prev, notification]);

      // Auto remove after 4 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 4000);
    };

    document.addEventListener('fincoins-notification', handleTokenNotification);
    return () => {
      document.removeEventListener('fincoins-notification', handleTokenNotification);
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-white border-l-4 p-4 rounded-lg shadow-lg max-w-sm animate-slide-in ${
            notification.type === 'earned' 
              ? 'border-green-500 bg-green-50' 
              : 'border-blue-500 bg-blue-50'
          }`}
        >
          <div className="flex items-center">
            <div className="text-lg mr-2">
              {notification.type === 'earned' ? '🎉' : '💰'}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {notification.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenNotification;
