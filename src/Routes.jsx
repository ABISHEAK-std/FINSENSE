import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ExpenseTrackingEmotionalAnalysis from './pages/expense-tracking-emotional-analysis';
import InvestmentPortfolioEmotionalMarketTiming from './pages/investment-portfolio-emotional-market-timing';
import EmotionalFinancialDashboard from './pages/emotional-financial-dashboard';
import AIFinancialTherapyChat from './pages/ai-financial-therapy-chat';
import CulturalFinancialPlanning from './pages/cultural-financial-planning';
import ProfileCulturalPreferences from './pages/profile-cultural-preferences';
import TokenRedemption from './pages/tokens';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<EmotionalFinancialDashboard />} />
        <Route path="/expense-tracking-emotional-analysis" element={<ExpenseTrackingEmotionalAnalysis />} />
        <Route path="/investment-portfolio-emotional-market-timing" element={<InvestmentPortfolioEmotionalMarketTiming />} />
        <Route path="/emotional-financial-dashboard" element={<EmotionalFinancialDashboard />} />
        <Route path="/ai-financial-therapy-chat" element={<AIFinancialTherapyChat />} />
        <Route path="/cultural-financial-planning" element={<CulturalFinancialPlanning />} />
        <Route path="/profile-cultural-preferences" element={<ProfileCulturalPreferences />} />
        <Route path="/tokens" element={<TokenRedemption />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

