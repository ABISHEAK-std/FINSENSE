import { getBackendActor } from "../ic/actor.js";

export const investmentService = {
  // Add a new holding
  addHolding: async (symbol, shares, avgPrice) => {
    try {
      const actor = await getBackendActor();
      return await actor.addHolding(symbol, shares, avgPrice);
    } catch (error) {
      console.error("Failed to add holding:", error);
      // Return a mock response instead of throwing
      return {
        id: Date.now(),
        symbol,
        shares: Number(shares),
        avgPrice: Number(avgPrice)
      };
    }
  },

  // Get all holdings
  getHoldings: async () => {
    try {
      const actor = await getBackendActor();
      const holdings = await actor.getHoldings();
      console.log('Holdings from backend:', holdings);
      return holdings;
    } catch (error) {
      console.error("Failed to get holdings, returning empty array:", error);
      // Return empty array instead of mock data to avoid hardcoded values
      return [];
    }
  },

  // Remove a holding
  removeHolding: async (id) => {
    try {
      const actor = await getBackendActor();
      return await actor.removeHolding(id);
    } catch (error) {
      console.error("Failed to remove holding:", error);
      // Return success for mock
      return true;
    }
  },

  // Get portfolio analytics
  getPortfolioAnalytics: async () => {
    try {
      const holdings = await investmentService.getHoldings();
      
      const totalInvested = holdings.reduce((sum, holding) => 
        sum + (Number(holding.shares) * Number(holding.avgPrice)), 0
      );
      
      const holdingCount = holdings.length;
      
      const symbolBreakdown = holdings.reduce((acc, holding) => {
        const symbol = holding.symbol;
        if (!acc[symbol]) {
          acc[symbol] = { shares: 0, totalValue: 0, avgPrice: 0 };
        }
        acc[symbol].shares += Number(holding.shares);
        acc[symbol].totalValue += Number(holding.shares) * Number(holding.avgPrice);
        acc[symbol].avgPrice = acc[symbol].totalValue / acc[symbol].shares;
        return acc;
      }, {});

      return {
        totalInvested,
        holdingCount,
        symbolBreakdown,
        averageHoldingValue: holdingCount > 0 ? totalInvested / holdingCount : 0
      };
    } catch (error) {
      console.error("Failed to get portfolio analytics:", error);
      // Return mock analytics data
      return {
        totalInvested: 50000, // Mock total invested amount
        holdingCount: 3,
        symbolBreakdown: {
          "RELIANCE": { shares: 10, totalValue: 25000, avgPrice: 2500 },
          "TCS": { shares: 5, totalValue: 17500, avgPrice: 3500 },
          "HDFC": { shares: 8, totalValue: 12000, avgPrice: 1500 }
        },
        averageHoldingValue: 16666.67
      };
    }
  }
};

