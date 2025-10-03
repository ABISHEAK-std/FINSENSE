import React from 'react';
import { LogIn, User, Shield, Globe } from 'lucide-react';
import { hasICPAccount, getICPPrincipal } from '../../ic/auth';

const ICPAuthButton = ({ onLogin, isAuthenticated = false, onLogout, culturalContext = 'default' }) => {
  const hasAccount = hasICPAccount();
  const principalId = getICPPrincipal();

  if (isAuthenticated) {
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-lg border border-success/20">
          <Shield size={16} />
          <span className="text-sm font-medium">
            {culturalContext === 'hindi' ? 'ICP सुरक्षित' : 'ICP Secured'}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
        >
          <User size={16} />
          <span>{culturalContext === 'hindi' ? 'लॉगआउट' : 'Logout'}</span>
        </button>
        {principalId && (
          <p className="text-xs text-muted-foreground text-center truncate">
            {principalId.substring(0, 20)}...
          </p>
        )}
      </div>
    );
  }

  if (hasAccount) {
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-center space-x-2 bg-warning/10 text-warning px-4 py-2 rounded-lg border border-warning/20">
          <Globe size={16} />
          <span className="text-sm font-medium">
            {culturalContext === 'hindi' ? 'ICP खाता मौजूद' : 'ICP Account Exists'}
          </span>
        </div>
        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
        >
          <LogIn size={16} />
          <span>{culturalContext === 'hindi' ? 'लॉगिन करें' : 'Login'}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onLogin}
      className="w-full flex items-center justify-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
    >
      <LogIn size={16} />
      <span>{culturalContext === 'hindi' ? 'ICP खाता बनाएं' : 'Create ICP Account'}</span>
    </button>
  );
};

export default ICPAuthButton;