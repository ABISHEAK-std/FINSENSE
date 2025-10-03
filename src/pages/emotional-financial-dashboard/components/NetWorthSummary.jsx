import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import ICPAuthButton from '../../../components/ui/ICPAuthButton';
import { investmentService } from '../../../services/InvestmentService';
import { chatService } from '../../../services/ChatService';
import { financialDataService } from '../../../services/FinancialDataService';
import { useICP } from '../../../ic/useICP';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import NetWorthDetailModal from '../../../components/modals/NetWorthDetailModal';

const NetWorthSummary = ({ 
  emotionalState = 'calm',
  culturalContext = 'default',
  userProfile = null,
  refreshTrigger = 0,
  transactionRefreshTrigger = 0,
  className = '' 
}) => {
  const { ready, authed, login, logout } = useICP();
  const [netWorthData, setNetWorthData] = useState({
    current: 0,
    change: 0,
    changePercent: 0,
    assets: 0,
    liabilities: 0
  });
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('6M');
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        
        // Get financial data from service (includes onboarding base + transaction changes)
        const financialData = financialDataService.getFinancialData();
        console.log('Financial data from service:', financialData);
        
        // Check if onboarding data exists
        const hasOnboarding = financialDataService.hasOnboardingData();
        const onboardingValues = financialDataService.getOnboardingValues();
        console.log('Onboarding check:', { hasOnboarding, onboardingValues });
        
        // The financialData should include onboarding base + transaction changes
        let totalAssets = financialData.totalAssets;
        let totalLiabilities = financialData.totalLiabilities;
        
        // Fallback: If financial data doesn't have onboarding values, use them directly
        if (hasOnboarding && (totalAssets === 0 || totalLiabilities === 0)) {
          console.log('Using onboarding values as fallback');
          totalAssets = onboardingValues.savings;
          totalLiabilities = onboardingValues.debt;
        }
        
        console.log('Using financial data totals:', {
          totalAssets,
          totalLiabilities,
          hasOnboarding,
          onboardingValues,
          financialDataAssets: financialData.totalAssets,
          financialDataLiabilities: financialData.totalLiabilities
        });
        
        // Get holdings data with error handling (for additional assets)
        let holdings = [];
        try {
          holdings = await investmentService.getHoldings();
          console.log('Holdings loaded successfully:', holdings);
        } catch (error) {
          console.warn('Failed to load holdings, using empty array:', error);
          holdings = [];
        }
        
        // Add holdings to total assets
        const holdingsValue = holdings.reduce((sum, h) => sum + Number(h.shares) * Number(h.avgPrice), 0);
        console.log('Holdings value being added:', holdingsValue);
        totalAssets += holdingsValue;
        
        console.log('Final calculation:', {
          baseAssets: totalAssets - holdingsValue,
          holdingsValue,
          totalAssets,
          totalLiabilities
        });
        
        // Calculate net worth
        const currentNetWorth = totalAssets - totalLiabilities;
        
        // Calculate change from previous period (simplified)
        const prevNetWorth = currentNetWorth * 0.98; // Simulate 2% growth
        const change = currentNetWorth - prevNetWorth;
        const changePercent = prevNetWorth > 0 ? (change / prevNetWorth) * 100 : 0;
        
        setNetWorthData({ 
          current: Math.max(0, currentNetWorth), 
          change: change, 
          changePercent: changePercent, 
          assets: totalAssets, 
          liabilities: totalLiabilities 
        });

        // Get real-time chart data from FinancialDataService
        const historyData = financialDataService.getNetWorthHistory(timeframe);
        
        if (historyData.length > 0) {
          // Use real data if available
          const series = historyData.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: item.netWorth
          }));
          setChartData(series);
        } else {
          // Create chart starting from current net worth
          const labels = timeframe === '1M' ? ['W1', 'W2', 'W3', 'W4']
            : timeframe === '3M' ? ['M1','M2','M3']
            : timeframe === '6M' ? ['M1','M2','M3','M4','M5','M6']
            : ['Q1','Q2','Q3','Q4'];
          
          const series = labels.map((label, idx) => {
            const progress = idx / (labels.length - 1);
            const variation = 0.05; // Reduced variation for more realistic chart
            const baseValue = currentNetWorth * (0.95 + progress * 0.1); // Start at 95%, end at 105%
            const randomVariation = (Math.random() - 0.5) * variation * baseValue;
            return { 
              date: label, 
              value: Math.max(0, Math.round(baseValue + randomVariation)) 
            };
          });
          setChartData(series);
        }
        
        console.log('Updated net worth data:', {
          totalAssets,
          totalLiabilities,
          currentNetWorth,
          change,
          changePercent,
          hasOnboarding
        });
        
      } catch (error) {
        console.error('Error in NetWorthSummary useEffect:', error);
        // Set default values on error
        setNetWorthData({
          current: 0,
          change: 0,
          changePercent: 0,
          assets: 0,
          liabilities: 0
        });
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [timeframe, userProfile, refreshTrigger, transactionRefreshTrigger]);

  const formatCurrency = (amount) => {
    if (culturalContext === 'hindi') {
      return `₹${(amount / 100000)?.toFixed(1)}L`;
    }
    return `₹${(amount / 100000)?.toFixed(1)}L`;
  };

  const formatFullCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getChangeColor = () => {
    return netWorthData?.change >= 0 ? 'text-success' : 'text-error';
  };

  const getChangeIcon = () => {
    return netWorthData?.change >= 0 ? 'TrendingUp' : 'TrendingDown';
  };

  const timeframeOptions = [
    { value: '1M', label: culturalContext === 'hindi' ? '1 महीना' : '1M' },
    { value: '3M', label: culturalContext === 'hindi' ? '3 महीने' : '3M' },
    { value: '6M', label: culturalContext === 'hindi' ? '6 महीने' : '6M' },
    { value: '1Y', label: culturalContext === 'hindi' ? '1 साल' : '1Y' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass-card p-3 rounded-lg shadow-soft border">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary">
            {formatFullCurrency(payload?.[0]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Add this function to prepare breakdown data
  const getNetWorthBreakdown = () => {
    return [
      { category: culturalContext === 'hindi' ? 'बैंक खाते' : 'Bank Accounts', amount: netWorthData.assets * 0.3 },
      { category: culturalContext === 'hindi' ? 'निवेश' : 'Investments', amount: netWorthData.assets * 0.4 },
      { category: culturalContext === 'hindi' ? 'संपत्ति' : 'Property', amount: netWorthData.assets * 0.3 },
      { category: culturalContext === 'hindi' ? 'कर्ज' : 'Loans', amount: -netWorthData.liabilities * 0.7 },
      { category: culturalContext === 'hindi' ? 'क्रेडिट कार्ड' : 'Credit Cards', amount: -netWorthData.liabilities * 0.3 },
    ];
  };

  // Add export function
  const handleExportReport = (format = 'pdf') => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text(culturalContext === 'hindi' ? 'नेट वर्थ रिपोर्ट' : 'Net Worth Report', 20, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(new Date().toLocaleDateString(), 20, 30);
      
      // Add summary
      doc.setFontSize(14);
      const summaryData = [
        [culturalContext === 'hindi' ? 'कुल संपत्ति' : 'Total Assets', formatFullCurrency(netWorthData.assets)],
        [culturalContext === 'hindi' ? 'कुल देनदारियां' : 'Total Liabilities', formatFullCurrency(netWorthData.liabilities)],
        [culturalContext === 'hindi' ? 'नेट वर्थ' : 'Net Worth', formatFullCurrency(netWorthData.current)]
      ];
      
      doc.autoTable({
        startY: 40,
        head: [[
          culturalContext === 'hindi' ? 'विवरण' : 'Description',
          culturalContext === 'hindi' ? 'राशि' : 'Amount'
        ]],
        body: summaryData
      });
      
      // Add breakdown
      const breakdownData = getNetWorthBreakdown().map(item => [
        item.category,
        formatFullCurrency(item.amount)
      ]);
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [[
          culturalContext === 'hindi' ? 'श्रेणी' : 'Category',
          culturalContext === 'hindi' ? 'राशि' : 'Amount'
        ]],
        body: breakdownData
      });
      
      doc.save('net-worth-report.pdf');
    } else if (format === 'csv') {
      const rows = [
        ['Category', 'Amount'],
        ['Total Assets', netWorthData.assets],
        ['Total Liabilities', netWorthData.liabilities],
        ['Net Worth', netWorthData.current],
        [''],
        ['Breakdown'],
        ...getNetWorthBreakdown().map(item => [item.category, item.amount])
      ];
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(row => row.join(',')).join('\n');
      
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', 'net-worth-report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div className={`glass-card rounded-2xl p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  // Show message if onboarding hasn't been completed
  if (!financialDataService.hasOnboardingData()) {
    // Clear any existing financial data to prevent showing old values
    const financialData = financialDataService.getFinancialData();
    if (financialData.totalAssets > 0 || financialData.totalLiabilities > 0) {
      console.log('Clearing existing financial data as onboarding not completed');
      financialDataService.resetData();
    }
    
    return (
      <div className={`glass-card rounded-2xl p-6 ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
            <Icon name="PieChart" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">
              {culturalContext === 'hindi' ? 'कुल संपत्ति' : 'Net Worth'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {culturalContext === 'hindi' 
                ? 'ऑनबोर्डिंग पूरा करने के बाद यहां आपकी वित्तीय स्थिति दिखेगी'
                : 'Your financial position will appear here after completing onboarding'
              }
            </p>
          </div>
          <div className="text-2xl font-bold text-muted-foreground">
            {culturalContext === 'hindi' ? '₹0' : '₹0'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl p-6 transition-emotional ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading text-foreground">
            {culturalContext === 'hindi' ? 'कुल संपत्ति' : 'Net Worth'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {userProfile?.name 
              ? (culturalContext === 'hindi' 
                ? `${userProfile.name} की वित्तीय स्थिति` 
                : `${userProfile.name}'s Financial Position`)
              : (culturalContext === 'hindi' ? 'आपकी वित्तीय स्थिति' : 'Your Financial Position')
            }
          </p>
        </div>

        {/* ICP Login/Logout button */}
        <ICPAuthButton 
          isAuthenticated={authed}
          onLogin={login}
          onLogout={logout}
          culturalContext={culturalContext}
        />
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center space-x-1 p-1 bg-muted/30 rounded-lg mb-6">
        {timeframeOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setTimeframe(option?.value)}
            className={`
              px-3 py-1 text-xs font-medium rounded-md transition-ui
              ${timeframe === option?.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {option?.label}
          </button>
        ))}
      </div>

      {/* Net Worth Value */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-3">
          <h3 className="text-3xl font-bold text-foreground">
            {formatFullCurrency(netWorthData?.current)}
          </h3>
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">
              {formatCurrency(Math.abs(netWorthData?.change))}
            </span>
            <span className="text-sm">
              ({netWorthData?.changePercent > 0 ? '+' : ''}{netWorthData?.changePercent}%)
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {culturalContext === 'hindi' 
            ?` पिछले ${timeframe === '1M' ? 'महीने' : timeframe === '3M' ? '3 महीनों' : timeframe === '6M' ? '6 महीनों' : 'साल'} से`
            : `vs last ${timeframe?.toLowerCase()}`
          }
        </p>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, fill: 'var(--color-primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assets vs Liabilities */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              {culturalContext === 'hindi' ? 'संपत्ति' : 'Assets'}
            </span>
          </div>
          <p className="text-lg font-bold text-success">
            {formatFullCurrency(netWorthData?.assets)}
          </p>
          <p className="text-xs text-success/70 mt-1">
            {culturalContext === 'hindi' ? 'कुल संपत्ति' : 'Total Assets'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-error/10 border border-error/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingDown" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">
              {culturalContext === 'hindi' ? 'देनदारियां' : 'Liabilities'}
            </span>
          </div>
          <p className="text-lg font-bold text-error">
            {formatFullCurrency(netWorthData?.liabilities)}
          </p>
          <p className="text-xs text-error/70 mt-1">
            {culturalContext === 'hindi' ? 'कुल कर्ज' : 'Total Debt'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/20">
        <button 
          onClick={() => setShowDetailModal(true)}
          className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-ui"
        >
          <Icon name="PieChart" size={16} />
          <span>
            {culturalContext === 'hindi' ? 'विस्तृत विश्लेषण' : 'Detailed Breakdown'}
          </span>
        </button>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleExportReport('csv')}
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-ui"
          >
            <Icon name="FileText" size={16} />
            <span>CSV</span>
          </button>
          
          <button 
            onClick={() => handleExportReport('pdf')}
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-ui"
          >
            <Icon name="Download" size={16} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <NetWorthDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        data={{
          ...netWorthData,
          breakdown: getNetWorthBreakdown()
        }}
        culturalContext={culturalContext}
      />
    </div>
  );
};

export default NetWorthSummary;