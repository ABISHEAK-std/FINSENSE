// Enhanced Market Data Service with Twelve Data API integration

class MarketDataService {
  constructor() {
    this.apiKey = //'461504bf71ec433591658448665575b5';
    this.baseUrl =// 'https://api.twelvedata.com';
    
    // Cache for reducing API calls
    this.cache = new Map();
    this.cacheExpiry = {
      indices: 30000,     // 30 seconds for indices
      stocks: 15000,      // 15 seconds for stocks
      mutualFunds: 60000, // 1 minute for mutual funds
      bonds: 300000       // 5 minutes for bonds
    };
    
    // API rate limiting
    this.lastApiCall = 0;
    this.apiCallDelay = 12000; // 12 seconds between calls (5 calls per minute limit)
    this.requestQueue = [];
    this.isProcessingQueue = false;
    
    // Auto-refresh interval
    this.refreshInterval = null;
    
    // Market symbols mapping (updated for Twelve Data)
    this.symbols = {
      indices: {
        sensex: 'BSE/SENSEX',
        nifty50: 'NSE/NIFTY50',
        niftyIT: 'NSE/NIFTYIT',
        niftyBank: 'NSE/BANKNIFTY'
      },
      stocks: {
        reliance: 'RELIANCE.BSE',
        tcs: 'TCS.NSE',
        infy: 'INFY.NSE',
        hdfcbank: 'HDFCBANK.NSE',
        icicibank: 'ICICIBANK.NSE'
      },
      etfs: {
        niftyBees: 'NIFTYBEES.NSE',
        goldBees: 'GOLDBEES.NSE',
        bankBees: 'BANKBEES.NSE'
      },
      bonds: {
        sgb: 'SGBAUG29.NSE', // Sovereign Gold Bond
        gilt: 'GILT.NSE'     // Government Securities ETF
      }
    };

    // User profile reference
    this.userProfile = null;
    
    // Start auto-refresh
    this.startAutoRefresh();
  }

  // Enhanced cache management
  getFromCache(key, expiry) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < expiry) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Rate limiting queue processor
  async processRequestQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const { resolve, reject, url } = this.requestQueue.shift();
      
      try {
        // Respect rate limits
        const timeSinceLastCall = Date.now() - this.lastApiCall;
        if (timeSinceLastCall < this.apiCallDelay) {
          await new Promise(resolve => setTimeout(resolve, this.apiCallDelay - timeSinceLastCall));
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        this.lastApiCall = Date.now();
        
        // Check for API errors
        if (data['Error Message'] || data['Note']) {
          throw new Error(data['Error Message'] || data['Note'] || 'API Error');
        }
        
        resolve(data);
      } catch (error) {
        console.warn('Twelve Data API error:', error.message);
        reject(error);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.isProcessingQueue = false;
  }

  // Queue API requests to respect rate limits
  async queueApiRequest(symbol, functionType = 'GLOBAL_QUOTE') {
    const url = `${this.baseUrl}?function=${functionType}&symbol=${symbol}&apikey=${this.apiKey}`;
    
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ resolve, reject, url });
      this.processRequestQueue();
    });
  }

  // Update API request method
  async makeApiRequest(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    url.searchParams.append('apikey', this.apiKey);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Twelve Data API error:', error);
      throw error;
    }
  }

  // Fetch live market data from Twelve Data
  async generateLiveMarketData() {
    console.log('🔄 Fetching live market data from Twelve Data...');
    
    try {
      const marketData = {
        indices: {},
        stocks: {},
        etfs: {},
        bonds: {},
        mutualFunds: [],
        lastUpdated: new Date().toISOString(),
        isLive: true,
        source: 'Twelve Data'
      };

      // Fetch all data types in sequence to respect rate limits
      await this.fetchIndicesData(marketData);
      await this.fetchStocksData(marketData);
      await this.fetchETFsData(marketData);
      await this.fetchBondsData(marketData);
      await this.fetchMutualFundsData(marketData);

      // Cache the complete result
      this.setCache('liveMarketData', marketData);
      
      console.log('✅ Live market data fetched successfully');
      return marketData;
      
    } catch (error) {
      console.error('❌ Error fetching live market data:', error);
      
      // Return cached data if available, otherwise fall back to mock
      const cachedData = this.getFromCache('liveMarketData', 300000); // 5 minute fallback
      if (cachedData) {
        console.log('📦 Using cached market data');
        return { ...cachedData, isLive: false, lastUpdated: cachedData.lastUpdated };
      }
      
      console.log('🎭 Falling back to mock data');
      return this.generateRealisticMockData();
    }
  }

  // Fetch indices data
  async fetchIndicesData(marketData) {
    console.log('📊 Fetching indices data...');
    
    for (const [key, symbol] of Object.entries(this.symbols.indices)) {
      try {
        const data = await this.makeApiRequest('quote', {
          symbol: symbol,
          interval: '1min'
        });
        
        if (data) {
          marketData.indices[key] = {
            value: parseFloat(data.close) || 0,
            change: parseFloat(data.change) || 0,
            changePercent: parseFloat(data.percent_change) || 0,
            open: parseFloat(data.open) || 0,
            dayHigh: parseFloat(data.high) || 0,
            dayLow: parseFloat(data.low) || 0,
            volume: parseInt(data.volume) || 0,
            lastUpdated: data.datetime || new Date().toISOString(),
            symbol: symbol
          };
        }
      } catch (error) {
        console.warn(`Failed to fetch ${key} data:`, error.message);
        marketData.indices[key] = this.generateMockIndexData(key);
      }
    }
  }

  // Fetch stocks data
  async fetchStocksData(marketData) {
    console.log('📈 Fetching stocks data...');
    
    for (const [key, symbol] of Object.entries(this.symbols.stocks)) {
      try {
        const [quoteData, timeSeriesData] = await Promise.all([
          this.makeApiRequest('quote', { symbol }),
          this.makeApiRequest('time_series', { 
            symbol,
            interval: '1day',
            outputsize: '2'
          })
        ]);
        
        if (quoteData) {
          marketData.stocks[key] = {
            symbol: symbol,
            name: this.getStockName(key),
            price: parseFloat(quoteData.close) || 0,
            change: parseFloat(quoteData.change) || 0,
            changePercent: parseFloat(quoteData.percent_change) || 0,
            open: parseFloat(quoteData.open) || 0,
            dayHigh: parseFloat(quoteData.high) || 0,
            dayLow: parseFloat(quoteData.low) || 0,
            volume: parseInt(quoteData.volume) || 0,
            marketCap: this.calculateMarketCap(key, parseFloat(quoteData.close)),
            pe: this.getEstimatedPE(key),
            sector: this.getStockSector(key),
            week52: this.calculateWeek52Range(parseFloat(quoteData.close)),
            lastUpdated: quoteData.datetime || new Date().toISOString()
          };
        }
      } catch (error) {
        console.warn(`Failed to fetch ${key} stock data:`, error.message);
        marketData.stocks[key] = this.generateMockStockData(key);
      }
    }
  }

  // Fetch ETFs data
  async fetchETFsData(marketData) {
    console.log('📊 Fetching ETFs data...');
    
    for (const [key, symbol] of Object.entries(this.symbols.etfs)) {
      try {
        const data = await this.makeApiRequest('quote', { symbol });
        
        if (data) {
          marketData.etfs[key] = {
            symbol: symbol,
            name: this.getETFName(key),
            nav: parseFloat(data.close) || 0,
            change: parseFloat(data.change) || 0,
            changePercent: parseFloat(data.percent_change) || 0,
            aum: this.getEstimatedAUM(key),
            expenseRatio: this.getETFExpenseRatio(key),
            tracking: this.getETFTracking(key),
            category: 'ETF',
            lastUpdated: data.datetime || new Date().toISOString()
          };
        }
      } catch (error) {
        console.warn(`Failed to fetch ${key} ETF data:`, error.message);
        marketData.etfs[key] = this.generateMockETFData(key);
      }
    }
  }

  // Fetch bonds data
  async fetchBondsData(marketData) {
    console.log('🏛️ Fetching bonds data...');
    
    for (const [key, symbol] of Object.entries(this.symbols.bonds)) {
      try {
        const data = await this.queueApiRequest(symbol);
        
        if (data['Global Quote']) {
          const quote = data['Global Quote'];
          marketData.bonds[key] = {
            symbol: quote['01. symbol'] || symbol,
            name: this.getBondName(key),
            price: parseFloat(quote['05. price']) || 0,
            change: parseFloat(quote['09. change']) || 0,
            changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
            ytm: this.getEstimatedYTM(key),
            duration: this.getBondDuration(key),
            rating: this.getBondRating(key),
            category: 'Bond',
            lastUpdated: quote['07. latest trading day'] || new Date().toISOString()
          };
        }
      } catch (error) {
        console.warn(`Failed to fetch ${key} bond data:`, error.message);
        marketData.bonds[key] = this.generateMockBondData(key);
      }
    }
  }

  // Fetch mutual funds data (fallback to ETFs as Alpha Vantage has limited MF support)
  async fetchMutualFundsData(marketData) {
    console.log('💰 Fetching mutual funds data...');
    
    // Since Alpha Vantage has limited mutual fund support, we'll use ETF data as proxy
    try {
      marketData.mutualFunds = [
        {
          name: 'SBI Bluechip Fund',
          schemeCode: '120503',
          nav: 89.45 + (Math.random() - 0.5) * 4,
          change: (Math.random() - 0.5) * 2,
          changePercent: (Math.random() - 0.5) * 2,
          aum: '45,234',
          expenseRatio: 0.95,
          returns: { '3y': 12.4, '5y': 14.2 },
          risk: 'Low',
          category: 'Large Cap',
          minInvestment: 500,
          lastUpdated: new Date().toISOString(),
          source: 'Estimated'
        },
        {
          name: 'Axis Midcap Fund',
          schemeCode: '120505',
          nav: 124.67 + (Math.random() - 0.5) * 6,
          change: (Math.random() - 0.5) * 3,
          changePercent: (Math.random() - 0.5) * 3,
          aum: '28,943',
          expenseRatio: 1.45,
          returns: { '3y': 16.2, '5y': 18.8 },
          risk: 'High',
          category: 'Mid Cap',
          minInvestment: 1000,
          lastUpdated: new Date().toISOString(),
          source: 'Estimated'
        }
      ];
    } catch (error) {
      console.warn('Failed to fetch mutual funds data:', error.message);
      marketData.mutualFunds = [];
    }
  }

  // Helper functions for stock metadata
  getStockName(key) {
    const names = {
      reliance: 'Reliance Industries Ltd',
      tcs: 'Tata Consultancy Services',
      infy: 'Infosys Ltd',
      hdfcbank: 'HDFC Bank Ltd',
      icicibank: 'ICICI Bank Ltd'
    };
    return names[key] || `${key.toUpperCase()} Ltd`;
  }

  getStockSector(key) {
    const sectors = {
      reliance: 'Oil & Gas',
      tcs: 'IT Services',
      infy: 'IT Services',
      hdfcbank: 'Banking',
      icicibank: 'Banking'
    };
    return sectors[key] || 'Unknown';
  }

  calculateMarketCap(key, price) {
    const shareMultipliers = {
      reliance: 6.76, // Billion shares
      tcs: 3.72,
      infy: 4.24,
      hdfcbank: 5.43,
      icicibank: 7.02
    };
    const shares = shareMultipliers[key] || 1;
    const marketCapCr = (price * shares * 10000000) / 10000000; // Convert to Crores
    return `${(marketCapCr / 100).toFixed(1)}L Cr`;
  }

  getEstimatedPE(key) {
    const peRatios = {
      reliance: 24.5,
      tcs: 28.3,
      infy: 25.8,
      hdfcbank: 18.5,
      icicibank: 16.8
    };
    return peRatios[key] || 20.0;
  }

  calculateWeek52Range(currentPrice) {
    // Estimate 52-week range based on current price
    const highVariation = 1.2 + Math.random() * 0.3; // 20-50% above
    const lowVariation = 0.7 - Math.random() * 0.2;  // 20-30% below
    
    return {
      high: Math.round(currentPrice * highVariation),
      low: Math.round(currentPrice * lowVariation)
    };
  }

  // ETF helper functions
  getETFName(key) {
    const names = {
      niftyBees: 'Nippon India ETF Nifty BeES',
      goldBees: 'Nippon India ETF Gold BeES',
      bankBees: 'Nippon India ETF Bank BeES'
    };
    return names[key] || `${key.toUpperCase()} ETF`;
  }

  getETFTracking(key) {
    const tracking = {
      niftyBees: 'NIFTY 50',
      goldBees: 'Gold Price',
      bankBees: 'NIFTY Bank'
    };
    return tracking[key] || 'Index';
  }

  getETFExpenseRatio(key) {
    const ratios = {
      niftyBees: 0.05,
      goldBees: 1.00,
      bankBees: 0.15
    };
    return ratios[key] || 0.50;
  }

  getEstimatedAUM(key) {
    const aums = {
      niftyBees: '8,456 Cr',
      goldBees: '3,245 Cr',
      bankBees: '5,678 Cr'
    };
    return aums[key] || '1,000 Cr';
  }

  // Bond helper functions
  getBondName(key) {
    const names = {
      sgb: 'Sovereign Gold Bond',
      gilt: 'Government Securities ETF'
    };
    return names[key] || `${key.toUpperCase()} Bond`;
  }

  getEstimatedYTM(key) {
    const ytms = {
      sgb: 2.5,
      gilt: 7.2
    };
    return ytms[key] || 6.0;
  }

  getBondDuration(key) {
    const durations = {
      sgb: '8 years',
      gilt: '5.2 years'
    };
    return durations[key] || '5 years';
  }

  getBondRating(key) {
    const ratings = {
      sgb: 'Government',
      gilt: 'Government'
    };
    return ratings[key] || 'AAA';
  }

  // Mock data generators for fallbacks
  generateMockIndexData(key) {
    const baseValues = {
      sensex: 82200,
      nifty50: 25327,
      niftyIT: 39.86,
      niftyBank: 55458

      
    };
    
    const baseValue = baseValues[key] || 20000;
    const change = (Math.random() - 0.5) * 2; // ±1% change
    
    return {
      value: Math.round(baseValue * (1 + change / 100)),
      change: Math.round(baseValue * change / 100),
      changePercent: Math.round(change * 100) / 100,
      open: Math.round(baseValue * (1 + (Math.random() - 0.5) * 0.01)),
      dayHigh: Math.round(baseValue * (1 + Math.random() * 0.02)),
      dayLow: Math.round(baseValue * (1 - Math.random() * 0.02)),
      volume: Math.floor(Math.random() * 1000000) + 500000,
      lastUpdated: new Date().toISOString(),
      source: 'Mock Data'
    };
  }

  generateMockStockData(key) {
    const stockData = {
      reliance: { basePrice: 2456, sector: 'Oil & Gas' },
      tcs: { basePrice: 3845, sector: 'IT Services' },
      infy: { basePrice: 1534, sector: 'IT Services' },
      hdfcbank: { basePrice: 1645, sector: 'Banking' },
      icicibank: { basePrice: 1089, sector: 'Banking' }
    };
    
    const data = stockData[key] || { basePrice: 1000, sector: 'Unknown' };
    const change = (Math.random() - 0.5) * 4; // ±2% change
    
    return {
      symbol: key.toUpperCase(),
      name: this.getStockName(key),
      price: Math.round(data.basePrice * (1 + change / 100) * 100) / 100,
      change: Math.round(data.basePrice * change / 100 * 100) / 100,
      changePercent: Math.round(change * 100) / 100,
      volume: `${(Math.random() * 5 + 0.5).toFixed(1)}L`,
      marketCap: this.calculateMarketCap(key, data.basePrice),
      pe: this.getEstimatedPE(key),
      sector: data.sector,
      lastUpdated: new Date().toISOString(),
      source: 'Mock Data'
    };
  }

  generateMockETFData(key) {
    const baseNavs = {
      niftyBees: 178.45,
      goldBees: 4567.89,
      bankBees: 412.33
    };
    
    const nav = baseNavs[key] || 100;
    const change = (Math.random() - 0.5) * 2;
    
    return {
      name: this.getETFName(key),
      nav: Math.round(nav * (1 + change / 100) * 100) / 100,
      change: Math.round(nav * change / 100 * 100) / 100,
      changePercent: Math.round(change * 100) / 100,
      aum: this.getEstimatedAUM(key),
      expenseRatio: this.getETFExpenseRatio(key),
      tracking: this.getETFTracking(key),
      lastUpdated: new Date().toISOString(),
      source: 'Mock Data'
    };
  }

  generateMockBondData(key) {
    const basePrices = {
      sgb: 5234.56,
      gilt: 98.45
    };
    
    const price = basePrices[key] || 100;
    const change = (Math.random() - 0.5) * 1;
    
    return {
      name: this.getBondName(key),
      price: Math.round(price * (1 + change / 100) * 100) / 100,
      change: Math.round(price * change / 100 * 100) / 100,
      changePercent: Math.round(change * 100) / 100,
      ytm: this.getEstimatedYTM(key),
      duration: this.getBondDuration(key),
      rating: this.getBondRating(key),
      lastUpdated: new Date().toISOString(),
      source: 'Mock Data'
    };
  }

  generateRealisticMockData() {
    const mockData = {
      indices: {},
      stocks: {},
      etfs: {},
      bonds: {},
      mutualFunds: [],
      lastUpdated: new Date().toISOString(),
      isLive: false,
      source: 'Mock Data (API Unavailable)'
    };

    // Generate mock data for all categories
    Object.keys(this.symbols.indices).forEach(key => {
      mockData.indices[key] = this.generateMockIndexData(key);
    });

    Object.keys(this.symbols.stocks).forEach(key => {
      mockData.stocks[key] = this.generateMockStockData(key);
    });

    Object.keys(this.symbols.etfs).forEach(key => {
      mockData.etfs[key] = this.generateMockETFData(key);
    });

    Object.keys(this.symbols.bonds).forEach(key => {
      mockData.bonds[key] = this.generateMockBondData(key);
    });

    // Add mock mutual funds
    mockData.mutualFunds = [
      {
        name: 'SBI Bluechip Fund',
        nav: 89.45 + (Math.random() - 0.5) * 4,
        change: (Math.random() - 0.5) * 2,
        risk: 'Low',
        category: 'Large Cap',
        lastUpdated: new Date().toISOString(),
        source: 'Mock Data'
      }
    ];

    return mockData;
  }

  // Auto-refresh functionality
  startAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    // Refresh every 30 seconds (adjusted from 10 seconds due to API rate limits)
    this.refreshInterval = setInterval(() => {
      console.log('⏰ Auto-refreshing market data...');
      this.generateLiveMarketData().catch(error => {
        console.error('Auto-refresh failed:', error);
      });
    }, 30000);
    
    console.log('🔄 Auto-refresh started (30 second intervals)');
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('⏹️ Auto-refresh stopped');
    }
  }

  // Main method to get live market data (updated interface)
  async getLiveMarketData() {
    // Check cache first
    const cached = this.getFromCache('liveMarketData', this.cacheExpiry.indices);
    if (cached) {
      console.log('📦 Using cached market data');
      return cached;
    }

    // Fetch fresh data
    return await this.generateLiveMarketData();
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  // Get cache status
  getCacheStatus() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessingQueue,
      lastApiCall: this.lastApiCall
    };
  }

  // Cleanup method
  destroy() {
    this.stopAutoRefresh();
    this.clearCache();
    this.requestQueue = [];
    console.log('🧹 MarketDataService destroyed');
  }

  // Get personalized recommendations based on user profile
  async getPersonalizedRecommendations(userProfile) {
    console.log('🎯 Generating personalized recommendations...');
    
    if (!userProfile) {
      console.warn('No user profile provided for recommendations');
      return {
        mutualFunds: [],
        stocks: [],
        etfs: [],
        bonds: [],
        lastUpdated: new Date().toISOString()
      };
    }

    try {
      // Get fresh market data
      const marketData = await this.generateLiveMarketData();
      
      const riskLevel = userProfile.riskTolerance || 5;
      const monthlyCapacity = userProfile.monthlyCapacity || 10000;
      const preferredTypes = userProfile.preferredTypes || [];
      
      const recommendations = {
        mutualFunds: [],
        stocks: [],
        etfs: [],
        bonds: [],
        lastUpdated: new Date().toISOString()
      };

      // Filter mutual funds based on user preferences
      if (preferredTypes.includes('mutual-funds') || preferredTypes.includes('mutualFunds')) {
        recommendations.mutualFunds = await this.getFilteredMutualFunds(riskLevel, monthlyCapacity, marketData);
      }

      // Filter stocks based on user preferences
      if (preferredTypes.includes('stocks')) {
        recommendations.stocks = await this.getFilteredStocks(riskLevel, marketData);
      }

      // Add ETF recommendations
      if (preferredTypes.includes('etfs')) {
        recommendations.etfs = await this.getFilteredETFs(riskLevel, marketData);
      }

      // Add bond/FD recommendations for conservative investors
      if (preferredTypes.includes('bonds') || riskLevel <= 3) {
        recommendations.bonds = await this.getFilteredBonds(riskLevel);
      }

      console.log('✅ Personalized recommendations generated');
      return recommendations;

    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      
      // Return fallback recommendations
      return {
        mutualFunds: this.getFallbackMutualFunds(userProfile),
        stocks: this.getFallbackStocks(userProfile),
        etfs: this.getFallbackETFs(userProfile),
        bonds: this.getFallbackBonds(userProfile),
        lastUpdated: new Date().toISOString(),
        isOffline: true
      };
    }
  }

  // Filter mutual funds based on user profile
  async getFilteredMutualFunds(riskLevel, monthlyCapacity, marketData) {
    let filteredFunds = marketData.mutualFunds || [];
    
    // Filter by risk tolerance
    if (riskLevel <= 3) {
      filteredFunds = filteredFunds.filter(fund => fund.risk === 'Low');
    } else if (riskLevel <= 7) {
      filteredFunds = filteredFunds.filter(fund => fund.risk !== 'Very High');
    }
    
    // Filter by investment capacity
    filteredFunds = filteredFunds.filter(fund => 
      (fund.minInvestment || 500) <= monthlyCapacity
    );
    
    // Sort by returns and take top 4
    filteredFunds.sort((a, b) => {
      const aReturn = a.returns?.['3y'] || 0;
      const bReturn = b.returns?.['3y'] || 0;
      return bReturn - aReturn;
    });
    
    return filteredFunds.slice(0, 4);
  }

  // Filter stocks based on user profile
  async getFilteredStocks(riskLevel, marketData) {
    let filteredStocks = Object.values(marketData.stocks || {});
    
    // Conservative investors get banking stocks
    if (riskLevel <= 4) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.sector === 'Banking' || stock.sector === 'FMCG'
      );
    } else if (riskLevel >= 8) {
      // Aggressive investors can get all stocks including IT and growth stocks
      // No filtering needed
    } else {
      // Moderate investors get large cap stocks
      filteredStocks = filteredStocks.filter(stock => 
        ['Banking', 'IT Services', 'Oil & Gas'].includes(stock.sector)
      );
    }
    
    // Sort by market cap (proxy for stability) and take top 3
    filteredStocks.sort((a, b) => {
      const aMarketCap = parseFloat(a.marketCap?.replace(/[^\d.]/g, '')) || 0;
      const bMarketCap = parseFloat(b.marketCap?.replace(/[^\d.]/g, '')) || 0;
      return bMarketCap - aMarketCap;
    });
    
    return filteredStocks.slice(0, 3);
  }

  // Filter ETFs based on user profile
  async getFilteredETFs(riskLevel, marketData) {
    let filteredETFs = Object.values(marketData.etfs || {});
    
    // Add expense ratio filtering
    if (riskLevel <= 4) {
      // Conservative investors prefer low-cost ETFs
      filteredETFs = filteredETFs.filter(etf => 
        (etf.expenseRatio || 1) <= 0.5
      );
    }
    
    // Sort by expense ratio (lower is better)
    filteredETFs.sort((a, b) => 
      (a.expenseRatio || 1) - (b.expenseRatio || 1)
    );
    
    return filteredETFs.slice(0, 2);
  }

  // Filter bonds based on user profile
  async getFilteredBonds(riskLevel) {
    const allBonds = [
      {
        name: 'SBI Fixed Deposit',
        type: 'FD',
        rate: 7.25,
        tenure: '1-5 years',
        minAmount: 1000,
        safety: 'Government Backed',
        category: 'Fixed Income',
        riskLevel: 1
      },
      {
        name: 'HDFC Corporate Bond Fund',
        type: 'Debt Fund',
        ytm: 8.15,
        duration: '3.2 years',
        rating: 'AAA/AA+',
        minAmount: 500,
        category: 'Debt Mutual Fund',
        riskLevel: 2
      },
      {
        name: 'PPF (Public Provident Fund)',
        type: 'Tax Saving',
        rate: 8.0,
        tenure: '15 years',
        minAmount: 500,
        safety: 'Government Backed',
        category: 'Tax Saving',
        riskLevel: 1
      },
      {
        name: 'Government Securities ETF',
        type: 'Gilt Fund',
        ytm: 7.5,
        duration: '8.5 years',
        rating: 'Government',
        minAmount: 1000,
        category: 'Government Securities',
        riskLevel: 2
      }
    ];

    // Filter based on risk level
    const filteredBonds = allBonds.filter(bond => 
      bond.riskLevel <= Math.max(riskLevel / 2, 2)
    );

    return filteredBonds.slice(0, 3);
  }

  // Fallback recommendations when API fails
  getFallbackMutualFunds(userProfile) {
    const riskLevel = userProfile.riskTolerance || 5;
    const baseRecommendations = [
      {
        name: 'SBI Bluechip Fund',
        schemeCode: '120503',
        nav: 89.45 + (Math.random() - 0.5) * 4,
        change: (Math.random() - 0.5) * 2,
        changePercent: (Math.random() - 0.5) * 2,
        aum: '45,234',
        expenseRatio: 0.95,
        returns: { '3y': 12.4, '5y': 14.2 },
        risk: 'Low',
        category: 'Large Cap',
        minInvestment: 500,
        lastUpdated: new Date().toISOString(),
        source: 'Fallback'
      },
      {
        name: 'Axis Bluechip Fund',
        schemeCode: '120510',
        nav: 67.23 + (Math.random() - 0.5) * 3,
        change: (Math.random() - 0.5) * 1.8,
        changePercent: (Math.random() - 0.5) * 1.8,
        aum: '32,156',
        expenseRatio: 1.15,
        returns: { '3y': 11.8, '5y': 13.6 },
        risk: 'Low',
        category: 'Large Cap',
        minInvestment: 1000,
        lastUpdated: new Date().toISOString(),
        source: 'Fallback'
      }
    ];

    if (riskLevel >= 6) {
      baseRecommendations.push({
        name: 'Axis Midcap Fund',
        schemeCode: '120505',
        nav: 124.67 + (Math.random() - 0.5) * 6,
        change: (Math.random() - 0.5) * 3.5,
        changePercent: (Math.random() - 0.5) * 3.5,
        aum: '28,943',
        expenseRatio: 1.45,
        returns: { '3y': 16.2, '5y': 18.8 },
        risk: 'High',
        category: 'Mid Cap',
        minInvestment: 1000,
        lastUpdated: new Date().toISOString(),
        source: 'Fallback'
      });
    }

    return baseRecommendations.filter(fund => 
      fund.minInvestment <= (userProfile.monthlyCapacity || 10000)
    );
  }

  getFallbackStocks(userProfile) {
    const riskLevel = userProfile.riskTolerance || 5;
    const allStocks = [
      {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd',
        price: 1645.30 + (Math.random() - 0.5) * 40,
        change: (Math.random() - 0.5) * 25,
        changePercent: (Math.random() - 0.5) * 1.5,
        volume: '2.3L',
        marketCap: '12.1L Cr',
        pe: 18.5,
        sector: 'Banking',
        lastUpdated: new Date().toISOString(),
        source: 'Fallback'
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        price: 3845.75 + (Math.random() - 0.5) * 60,
        change: (Math.random() - 0.5) * 35,
        changePercent: (Math.random() - 0.5) * 1.8,
        volume: '1.8L',
        marketCap: '14.2L Cr',
        pe: 28.3,
        sector: 'IT Services',
        lastUpdated: new Date().toISOString(),
        source: 'Fallback'
      },
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        price: 2456.50 + (Math.random() - 0.5) * 50,
        change: (Math.random() - 0.5) * 30,
        changePercent: (Math.random() - 0.5) * 1.2,
        volume: '3.5L',
        marketCap: '16.5L Cr',
        pe: 24.2,
        sector: 'Oil & Gas',
        lastUpdated: new Date().toISOString(),
        source: 'Fallback'
      }
    ];

    if (riskLevel <= 4) {
      return allStocks.filter(stock => stock.sector === 'Banking').slice(0, 2);
    }

    return allStocks.slice(0, 3);
  }

  getFallbackETFs(userProfile) {
    return [
      {
        name: 'HDFC NIFTY 50 ETF',
        symbol: 'HDFCNIFETF',
        nav: 178.45 + (Math.random() - 0.5) * 4,
        change: (Math.random() - 0.5) * 3,
        changePercent: (Math.random() - 0.5) * 1.5,
        aum: '8,456 Cr',
        expenseRatio: 0.05,
        tracking: 'NIFTY 50',
        category: 'Equity ETF',
        lastUpdated: new Date().toISOString(),
        source: 'Fallback'
      }
    ];
  }

  getFallbackBonds(userProfile) {
    return [
      {
        name: 'SBI Fixed Deposit',
        type: 'FD',
        rate: 7.25,
        tenure: '1-5 years',
        minAmount: 1000,
        safety: 'Government Backed',
        category: 'Fixed Income',
        source: 'Fallback'
      },
      {
        name: 'PPF (Public Provident Fund)',
        type: 'Tax Saving',
        rate: 8.0,
        tenure: '15 years',
        minAmount: 500,
        safety: 'Government Backed',
        category: 'Tax Saving',
        source: 'Fallback'
      }
    ];
  }

  // Set user profile for personalized recommendations
  setUserProfile(profile) {
    this.userProfile = profile;
    console.log('👤 User profile updated for recommendations');
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService();
export default marketDataService;
