import React, { useState, useEffect } from 'react';
import { useICP } from '../ic/useICP';
import ICPAuthButton from './ui/ICPAuthButton';
import { clearAllCredentials } from '../ic/auth';

const AuthWrapper = ({ children }) => {
  const { ready, authed, login, logout } = useICP();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (ready && authed) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [ready, authed]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FinSence</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">Z</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to FinSence</h1>
          <p className="text-gray-600 mb-8">
            Your personal AI Financial Therapist for emotional financial wellness
          </p>
          
          <div className="space-y-4">
            <ICPAuthButton onLogin={login} isAuthenticated={authed} onLogout={logout} />
            
            <button
              onClick={() => {
                clearAllCredentials();
                window.location.reload();
              }}
              className="w-full text-sm text-gray-400 hover:text-gray-600 underline"
            >
              Clear stored credentials
            </button>
            
            <div className="text-sm text-gray-500">
              <p className="text-sm md:text-lg font-semibold tracking-wide text-foreground">
    Built by <span className="text-primary font-extrabold">Team Zyphers</span>
  
  </p>
              
              
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showWelcome && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
           Successfully logged in! Welcome to FinSence
        </div>
      )}
      {children}
    </>
  );
};

export default AuthWrapper;
