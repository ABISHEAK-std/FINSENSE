import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveMarketInsights = ({ 
  userProfile, 
  marketData, 
  recommendations, 
  culturalContext,
  onRefreshData,
  onUpdateRecommendations
}) => {
  const [watchlist, setWatchlist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    if (autoRefresh && marketData?.isLive) {
      // Different refresh rates for different data types
      const intervals = {
        indices: 15000,  // 15 seconds
        stocks: 30000,   // 30 seconds
        mutualFunds: 300000, // 5 minutes
        general: 30000   // 30 seconds default
      };

      const interval = setInterval(() => {
        refreshAllData();
      }, intervals.general);

      setRefreshInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [autoRefresh, marketData?.isLive, onRefreshData]);

  const refreshAllData = async () => {
    try {
      setConnectionStatus('updating');
      await onRefreshData();
      setLastUpdateTime(new Date());
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setConnectionStatus('error');
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const formatChange = (change, showPlus = true) => {
    const sign = change >= 0 ? (showPlus ? '+' : '') : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const addToWatchlist = (item) => {
    setWatchlist(prev => [...prev, item]);
  };

  const removeFromWatchlist = (itemId) => {
    setWatchlist(prev => prev.filter(item => item.id !== itemId));
  };

  const RecommendationCard = ({ item, type }) => (
    <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
      {/* Enhanced Live Indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            marketData?.isLive && connectionStatus === 'connected' 
              ? 'bg-red-500 animate-pulse' 
              : marketData?.isLive && connectionStatus === 'updating'
              ? 'bg-yellow-500 animate-spin'
              : 'bg-gray-500'
          }`}></div>
          <span className={`text-xs font-medium ${
            marketData?.isLive 
              ? connectionStatus === 'connected' ? 'text-red-600' : 'text-yellow-600'
              : 'text-gray-600'
          }`}>
            {marketData?.isLive 
              ? connectionStatus === 'connected' ? 'LIVE' : 'UPDATING'
              : 'OFFLINE'
            }
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(item.lastUpdated).toLocaleTimeString('en-IN')}
        </div>
      </div>

      {/* Enhanced Content based on type */}
      {type === 'mutualFund' && (
        <>
          <h4 className="font-medium text-foreground mb-1">{item.name}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>NAV:</span>
              <span className="font-medium">₹{item.nav?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Today:</span>
              <span className={getChangeColor(item.change || 0)}>
                {formatChange(item.change || 0)} ({formatChange(item.changePercent || 0)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span>AUM:</span>
              <span>₹{item.aum || 'N/A'} Cr</span>
            </div>
            <div className="flex justify-between">
              <span>3Y Returns:</span>
              <span className="text-green-600">{item.returns?.['3y'] || 'N/A'}%</span>
            </div>
            <div className="flex justify-between">
              <span>Risk:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                item.risk === 'Low' ? 'bg-green-100 text-green-700' :
                item.risk === 'Medium' || item.risk === 'High' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {item.risk || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Min SIP:</span>
              <span className="text-xs">₹{item.minInvestment || 500}</span>
            </div>
          </div>
        </>
      )}

      {type === 'stock' && (
        <>
          <h4 className="font-medium text-foreground mb-1">{item.name || item.symbol}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Price:</span>
              <span className="font-medium">₹{item.price?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Today:</span>
              <span className={getChangeColor(item.change || 0)}>
                {formatChange(item.change || 0)} ({formatChange(item.changePercent || 0)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Volume:</span>
              <span>{item.volume || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Market Cap:</span>
              <span>{item.marketCap || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>P/E:</span>
              <span>{item.pe || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Day H/L:</span>
              <span className="text-xs">₹{item.dayHigh || 'N/A'}/₹{item.dayLow || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Sector:</span>
              <span className="text-xs">{item.sector || 'N/A'}</span>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-3">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs"
          onClick={() => addToWatchlist(item)}
        >
          {culturalContext === 'hindi' ? 'वॉचलिस्ट' : 'Watchlist'}
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs"
          onClick={() => window.open(`https://www.nseindia.com/get-quotes/equity?symbol=${item.symbol}`, '_blank')}
        >
          {culturalContext === 'hindi' ? 'विवरण' : 'Details'}
        </Button>
      </div>
    </div>
  );

  if (!marketData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="Loader" size={48} className="text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">
            {culturalContext === 'hindi' ? 'लाइव मार्केट डेटा लोड हो रहा है...' : 'Loading live market data...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - 100% Dynamic Recommendations */}
      <div className="lg:col-span-2 space-y-6">
        {/* Enhanced Header with Live Status */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-heading text-foreground">
                {culturalContext === 'hindi' ? 'आपके लिए लाइव सुझाव' : 'Live Recommendations for You'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {culturalContext === 'hindi' 
                  ? `आपकी ₹${userProfile?.monthlyCapacity?.toLocaleString() || 'N/A'} निवेश क्षमता के अनुसार`
                  : `Based on your ₹${userProfile?.monthlyCapacity?.toLocaleString() || 'N/A'} investment capacity`
                }
              </p>
              {userProfile && (
                <p className="text-xs text-muted-foreground">
                  {culturalContext === 'hindi' ? 'जोखिम प्रोफ़ाइल' : 'Risk Profile'}: {
                    userProfile.riskTolerance <= 3 ? 
                      (culturalContext === 'hindi' ? 'रूढ़िवादी' : 'Conservative') :
                    userProfile.riskTolerance <= 7 ? 
                      (culturalContext === 'hindi' ? 'मध्यम' : 'Moderate') :
                      (culturalContext === 'hindi' ? 'आक्रामक' : 'Aggressive')
                  }
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={refreshAllData}
                iconName="RefreshCw"
                disabled={connectionStatus === 'updating'}
              />
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  marketData.isLive && connectionStatus === 'connected' 
                    ? 'bg-green-500 animate-pulse' 
                    : marketData.isLive && connectionStatus === 'updating'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}></div>
                <span className={`text-xs ${
                  marketData.isLive && connectionStatus === 'connected' 
                    ? 'text-green-600' 
                    : marketData.isLive && connectionStatus === 'updating'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {marketData.isLive 
                    ? connectionStatus === 'connected' 
                      ? (culturalContext === 'hindi' ? 'लाइव' : 'LIVE')
                      : (culturalContext === 'hindi' ? 'अपडेट हो रहा' : 'UPDATING')
                    : (culturalContext === 'hindi' ? 'ऑफलाइन' : 'OFFLINE')
                  }
                </span>
              </div>
            </div>
          </div>
          
          {/* Connection Status */}
          {marketData.error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  {culturalContext === 'hindi' 
                    ? 'लाइव डेटा अस्थायी रूप से अनुपलब्ध है। वैकल्पिक डेटा दिखाया जा रहा है।'
                    : 'Live data temporarily unavailable. Showing alternative data.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Last Update Time */}
          {lastUpdateTime && (
            <div className="mt-2 text-xs text-muted-foreground">
              {culturalContext === 'hindi' ? 'अंतिम अपडेट' : 'Last updated'}: {lastUpdateTime.toLocaleTimeString('en-IN')}
            </div>
          )}
        </div>

        {/* Category Filter */}
<div className="flex space-x-2 overflow-x-auto">
  {[
    { id: 'all', label: culturalContext === 'hindi' ? 'सभी' : 'All' },
    { id: 'mutualFunds', label: culturalContext === 'hindi' ? 'म्यूचुअल फंड' : 'Mutual Funds' },
    { id: 'stocks', label: culturalContext === 'hindi' ? 'स्टॉक्स' : 'Stocks' },
    { id: 'etfs', label: 'ETFs' },
    { id: 'bonds', label: culturalContext === 'hindi' ? 'बॉन्ड्स' : 'Bonds' }
  ].map(category => (
    <Button
      key={category.id}
      size="sm"
      variant={selectedCategory === category.id ? 'default' : 'outline'}
      onClick={() => setSelectedCategory(category.id)}
    >
      {category.label}
    </Button>
  ))}
</div>


        {/* Enhanced Recommendations Grid */}
        <div className="space-y-6">
          {/* No Hardcoded Values - All Dynamic */}
          {recommendations?.mutualFunds?.length > 0 && (selectedCategory === 'all' || selectedCategory === 'mutualFunds') && (
            <div>
              <h3 className="text-lg font-heading text-foreground mb-4 flex items-center">
                <Icon name="TrendingUp" size={20} className="mr-2" />
                {culturalContext === 'hindi' ? 'म्यूचुअल फंड सुझाव (लाइव NAV)' : 'Mutual Fund Recommendations (Live NAV)'}
                {marketData.isLive && (
                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded animate-pulse">
                    🔴 LIVE
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.mutualFunds.map((fund, index) => (
                  <RecommendationCard key={index} item={fund} type="mutualFund" />
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Stock Recommendations */}
          {recommendations?.stocks?.length > 0 && (selectedCategory === 'all' || selectedCategory === 'stocks') && (
            <div>
              <h3 className="text-lg font-heading text-foreground mb-4 flex items-center">
                <Icon name="BarChart3" size={20} className="mr-2" />
                {culturalContext === 'hindi' ? 'स्टॉक सुझाव (लाइव प्राइस)' : 'Stock Recommendations (Live Prices)'}
                {marketData.isLive && (
                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded animate-pulse">
                    🔴 LIVE
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.stocks.map((stock, index) => (
                  <RecommendationCard key={index} item={stock} type="stock" />
                ))}
              </div>
            </div>
          )}

          {/* ETFs */}
          {recommendations?.etfs?.length > 0 && (selectedCategory === 'all' || selectedCategory === 'etfs') && (
            <div>
              <h3 className="text-lg font-heading text-foreground mb-4 flex items-center">
                <Icon name="PieChart" size={20} className="mr-2" />
                {culturalContext === 'hindi' ? 'ETF सुझाव' : 'ETF Recommendations'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.etfs.map((etf, index) => (
                  <div key={index} className="bg-card rounded-lg border p-4">
                    <h4 className="font-medium text-foreground mb-2">{etf.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>NAV:</span>
                        <span className="font-medium">₹{etf.nav?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tracking:</span>
                        <span>{etf.tracking}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expense Ratio:</span>
                        <span>{etf.expenseRatio}%</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      {culturalContext === 'hindi' ? 'निवेश करें' : 'Invest Now'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bonds */}
          {recommendations?.bonds?.length > 0 && (selectedCategory === 'all' || selectedCategory === 'bonds') && (
            <div>
              <h3 className="text-lg font-heading text-foreground mb-4 flex items-center">
                <Icon name="Shield" size={20} className="mr-2" />
                {culturalContext === 'hindi' ? 'सुरक्षित निवेश विकल्प' : 'Safe Investment Options'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.bonds.map((bond, index) => (
                  <div key={index} className="bg-card rounded-lg border p-4">
                    <h4 className="font-medium text-foreground mb-2">{bond.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Rate:</span>
                        <span className="font-medium text-green-600">{bond.rate || bond.ytm}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Min Amount:</span>
                        <span>₹{bond.minAmount}</span>
                      </div>
                      {bond.safety && (
                        <div className="flex justify-between">
                          <span>Safety:</span>
                          <span className="text-green-600">{bond.safety}</span>
                        </div>
                      )}
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      {culturalContext === 'hindi' ? 'निवेश करें' : 'Invest Now'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message when no recommendations available */}
          {(!recommendations?.mutualFunds?.length && !recommendations?.stocks?.length) && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">
                {culturalContext === 'hindi' ? 'सुझाव लोड हो रहे हैं' : 'Loading Recommendations'}
              </h4>
              <p className="text-muted-foreground mb-4">
                {culturalContext === 'hindi' 
                  ? 'आपकी प्रोफ़ाइल के आधार पर व्यक्तिगत सुझाव तैयार किए जा रहे हैं'
                  : 'Preparing personalized recommendations based on your profile'
                }
              </p>
              <Button onClick={onUpdateRecommendations}>
                {culturalContext === 'hindi' ? 'फिर से लोड करें' : 'Refresh Recommendations'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - 100% Live Market Dashboard */}
      <div className="space-y-6">
        {/* Live Market Indices */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading text-foreground">
              {culturalContext === 'hindi' ? 'मार्केट इंडेक्स' : 'Market Indices'}
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                marketData.isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
              }`}></div>
              <span className={`text-xs ${
                marketData.isLive ? 'text-red-600' : 'text-gray-600'
              }`}>
                {marketData.isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {marketData.indices && Object.entries(marketData.indices).map(([key, index]) => (
              <div key={key} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">
                    {key === 'nifty50' ? 'NIFTY 50' : 
                     key === 'sensex' ? 'SENSEX' : 
                     key === 'niftyBank' ? 'NIFTY Bank' : 'NIFTY IT'}
                  </span>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(index.value || 0)}</div>
                    <div className={`text-sm ${getChangeColor(index.change || 0)}`}>
                      {formatChange(index.change || 0)} ({formatChange(index.changePercent || 0)}%)
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Updated: {new Date(index.lastUpdated).toLocaleTimeString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Market Status with Live Time */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-heading text-foreground mb-4">
            {culturalContext === 'hindi' ? 'मार्केट स्थिति' : 'Market Status'}
          </h3>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${
              marketData.marketStatus?.isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              <div className="font-medium">
                {marketData.marketStatus?.isOpen ? 
                  (culturalContext === 'hindi' ? '🟢 मार्केट ओपन' : '🟢 Market Open') :
                  (culturalContext === 'hindi' ? '🔴 मार्केट बंद' : '🔴 Market Closed')
                }
              </div>
              <div className="text-sm">
                {culturalContext === 'hindi' ? 'समय' : 'Hours'}: 9:15 AM - 3:30 PM IST
              </div>
              <div className="text-sm">
                {culturalContext === 'hindi' ? 'अगला सत्र' : 'Next Session'}: {marketData.marketStatus?.nextSession}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{marketData.marketStatus?.currentTime}</div>
              <div className="text-sm text-muted-foreground">Current IST Time</div>
            </div>
          </div>
        </div>

        {/* Live Sector Performance */}
        
       

        {/* Auto Refresh Controls */}
        
      </div>
    </div>
  );
};

export default LiveMarketInsights;
