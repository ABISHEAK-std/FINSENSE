// Mock backend service for development when ICP is not available
class MockBackendService {
  constructor() {
    this.storageKey = 'finsense_mock_data';
    this.data = this.loadFromStorage();
    this.nextId = this.data.nextId || 1;
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          expenses: parsed.expenses || [],
          incomes: parsed.incomes || [],
          holdings: parsed.holdings || [],
          messages: parsed.messages || [],
          chatInteractions: parsed.chatInteractions || [],
          userProfile: parsed.userProfile || null,
          nextId: parsed.nextId || 1
        };
      }
    } catch (error) {
      console.warn('Failed to load mock data from storage:', error);
    }
    
    return {
      expenses: [],
      incomes: [],
      holdings: [],
      messages: [],
      chatInteractions: [],
      userProfile: null,
      nextId: 1
    };
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        ...this.data,
        nextId: this.nextId
      }));
    } catch (error) {
      console.warn('Failed to save mock data to storage:', error);
    }
  }

  // Mock user profile methods
  async getUserProfile() {
    return this.data.userProfile;
  }

  async updateUserProfile(profileData) {
    this.data.userProfile = {
      name: profileData.name || null,
      salary: profileData.salary || null,
      expenses: profileData.expenses || null,
      riskTolerance: profileData.riskTolerance || null,
      targetSavings: profileData.targetSavings || null,
      country: profileData.country || null,
      language: profileData.language || null,
      lifeStage: profileData.lifeStage || null,
      goals: profileData.goals || []
    };
    this.saveToStorage();
    return this.data.userProfile;
  }

  // Mock expense methods
  async addExpense(title, amount, date, category) {
    const expense = {
      id: this.nextId++,
      title,
      amount: Number(amount),
      date,
      category
    };
    this.data.expenses.push(expense);
    this.saveToStorage();
    return expense;
  }

  async getExpenses() {
    return this.data.expenses;
  }

  async removeExpense(id) {
    const index = this.data.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      this.data.expenses.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Mock income methods
  async addIncome(amount, source, description, date, emotion) {
    const income = {
      id: this.nextId++,
      amount: Number(amount),
      source,
      description: description || null,
      date,
      emotion
    };
    this.data.incomes.push(income);
    this.saveToStorage();
    return income;
  }

  async getIncomes() {
    return this.data.incomes;
  }

  async removeIncome(id) {
    const index = this.data.incomes.findIndex(i => i.id === id);
    if (index !== -1) {
      this.data.incomes.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Mock holding methods
  async addHolding(symbol, shares, avgPrice) {
    const holding = {
      id: this.nextId++,
      symbol,
      shares: Number(shares),
      avgPrice: Number(avgPrice)
    };
    this.data.holdings.push(holding);
    this.saveToStorage();
    return holding;
  }

  async getHoldings() {
    return this.data.holdings;
  }

  async removeHolding(id) {
    const index = this.data.holdings.findIndex(h => h.id === id);
    if (index !== -1) {
      this.data.holdings.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Mock message methods
  async addMessage(content, timestamp) {
    const message = {
      id: this.nextId++,
      content,
      timestamp,
      messageType: "user",
      emotion: null
    };
    this.data.messages.push(message);
    this.saveToStorage();
    return message;
  }

  async addBotMessage(content, emotion) {
    const message = {
      id: this.nextId++,
      content,
      timestamp: Date.now(),
      messageType: "bot",
      emotion
    };
    this.data.messages.push(message);
    this.saveToStorage();
    return message;
  }

  async getMessages() {
    return this.data.messages;
  }

  // Mock chat interaction methods
  async storeChatInteraction(userMessage, botResponse, emotion, entities) {
    const interaction = {
      id: this.nextId++,
      userMessage,
      botResponse,
      emotion,
      timestamp: Date.now(),
      entities
    };
    this.data.chatInteractions.push(interaction);
    this.saveToStorage();
    return interaction;
  }

  async getChatInteractions() {
    return this.data.chatInteractions;
  }

  // Mock system methods
  async whoami() {
    return "mock-principal-id";
  }

  async getCanisterInfo() {
    return {
      totalExpenses: this.data.expenses.length,
      totalIncomes: this.data.incomes.length,
      totalHoldings: this.data.holdings.length,
      totalMessages: this.data.messages.length,
      totalChatInteractions: this.data.chatInteractions.length
    };
  }

  // Clear all data (for testing purposes)
  async clearAllData() {
    this.data = {
      expenses: [],
      incomes: [],
      holdings: [],
      messages: [],
      chatInteractions: [],
      userProfile: null
    };
    this.nextId = 1;
    this.saveToStorage();
    console.log('All mock data cleared');
  }
}

export const mockBackendService = new MockBackendService();
