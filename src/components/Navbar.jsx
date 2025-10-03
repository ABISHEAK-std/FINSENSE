import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './AppIcon';

const Navbar = ({ culturalContext = 'default' }) => {
  const location = useLocation();

  // Helper to check if current path matches menu item
  const isActive = (path) => {
    // Exact match for dashboard
    if (path === '/') {
      return location.pathname === '/';
    }
    // Check if current path starts with menu item path
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      path: '/',
      label: culturalContext === 'hindi' ? 'डैशबोर्ड' : 'Dashboard',
      icon: 'Layout'
    },
    {
      path: '/expense-tracking-emotional-analysis',
      label: culturalContext === 'hindi' ? 'खर्च' : 'Income and Expenses',
      icon: 'DollarSign'
    },
    {
      path: '/ai-financial-therapy-chat',
      label: culturalContext === 'hindi' ? 'थेरेपी' : 'Therapy',
      icon: 'Heart'
    },
    {
      path: '/cultural-financial-planning',
      label: culturalContext === 'hindi' ? 'संस्कृति' : 'Culture',
      icon: 'Globe'
    },
    {
      path: '/investment-portfolio',
      label: culturalContext === 'hindi' ? 'निवेश' : 'Investments',
      icon: 'TrendingUp'
    },
    {
      path: '/profile-cultural-preferences',
      label: culturalContext === 'hindi' ? 'प्रोफाइल' : 'Profile',
      icon: 'User'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/40 px-4 py-2 md:px-6 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors
                ${isActive(item.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
