// src/services/chatService.js
import { geminiService } from "./GeminiService.js";
import { getBackendActor } from "../ic/actor.js";
import { tokenService } from './TokenService';


// Ensure profile exists; if not, request minimal setup
async function ensureUserProfile() {
  try {
    const actor = await getBackendActor();
    const existing = await actor.getUserProfile();
    return existing;
  } catch {
    return null;
  }
}

// Core chat handler
async function processChat(message, userProfile, history = []) {
  try {
    // Award daily tracking tokens
    const lastTrackingDate = localStorage.getItem('last_tracking_date');
    const today = new Date().toDateString();
    
    if (lastTrackingDate !== today) {
      tokenService.addTokens(10, 'Daily Expense Tracking');
      localStorage.setItem('last_tracking_date', today);
    }

    // If no profile provided, try to fetch; if still missing, return prompt to setup
    let profile = userProfile;
    if (!profile || Object.keys(profile || {}).length === 0) {
      const backendProfile = await ensureUserProfile();
      if (!backendProfile) {
        return {
          advice: "Before we begin, please complete your profile: name, salary, monthly expenses, risk tolerance, and goals.",
          emotion: "neutral",
          suggestions: [
            "Open profile to set details",
            "What is risk tolerance?",
            "Help me plan a budget"
          ],
          resources: [],
          entities: []
        };
      }
      profile = {
        name: backendProfile.name || 'User',
        salary: Number(backendProfile.salary || 0),
        expenses: Number(backendProfile.expenses || 0),
        risk_tolerance: backendProfile.riskTolerance || 'moderate',
        target_savings: Number(backendProfile.targetSavings || 0),
        country: backendProfile.country || 'IN',
        language: backendProfile.language || 'en',
        life_stage: backendProfile.lifeStage || 'general',
        goals: backendProfile.goals || []
      };
    }
    const normalizedMsg = message.trim().toLowerCase();

    // --- Direct Q&A using user's dashboard values (deterministic, no LLM) ---
    const getNumber = (v) => Number(Array.isArray(v) ? v?.[0] : v) || 0;
    const monthlySalary = getNumber(profile?.salary);
    const monthlyExpenses = getNumber(profile?.expenses);
    const targetSavings = getNumber(profile?.target_savings ?? profile?.targetSavings);
    const monthlyDebt = Math.max(0, monthlyExpenses - monthlySalary * 0.5);
    const liabilities = Math.max(0, monthlyDebt * 12);
    const assets = targetSavings; // matches dashboard fallback logic
    const netWorth = Math.max(0, assets - liabilities);

    const saysExpenses = /(what|how|tell).*\b(expense|expenses|spend|spending)\b|\bmy\s+expenses\b/.test(normalizedMsg);
    const saysAssets = /(what|how|tell).*\b(asset|assets|savings)\b|\bmy\s+assets\b/.test(normalizedMsg);
    const saysNetWorth = /(what|how|tell).*\bnet\s*worth\b|\bmy\s+net\s*worth\b/.test(normalizedMsg);

    if (saysExpenses || saysAssets || saysNetWorth) {
      const toInr = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
      const parts = [];
      if (saysExpenses) parts.push(`Monthly expenses: ${toInr(monthlyExpenses)}`);
      if (saysAssets) parts.push(`Assets (Target Savings): ${toInr(assets)}`);
      if (saysNetWorth) parts.push(`Net worth (Assets − Liabilities): ${toInr(netWorth)}`);
      // Add a concise, helpful response mirroring dashboard logic
      return {
        advice: parts.join('\n'),
        emotion: 'neutral',
        suggestions: [
          'Update basics on dashboard',
          'Adjust target savings',
          'Open Expense Tracking'
        ],
        resources: [],
        entities: []
      };
    }

    // Quick replies for common messages
    if (normalizedMsg === "hi" || normalizedMsg === "hello") {
      return {
        advice: "👋 Hi there! I'm Dr. Zypher, your AI Financial Therapist. How are you feeling about your finances today?",
        emotion: "happy",
        suggestions: ["Help me create a budget", "What are safe investments?"],
        resources: [],
        entities: []
      };
    }

    // Always use Gemini for emotion detection and advice
    const detectedEmotion = await geminiService.detectEmotion(message);
    const extractedEntities = geminiService.extractInvestmentEntities(message);
    
    try {
      const geminiResponse = await geminiService.generateFinancialAdvice(
        message,
        profile,
        detectedEmotion,
        extractedEntities,
        history
      );

      // Ensure advice is concise and structured for the UI
      const intent = extractIntent(message);
      const structuredAdvice = formatToStructuredAdvice(
        geminiResponse?.advice || "",
        profile,
        detectedEmotion,
        intent,
        message
      );

      // Store the interaction in the backend
      try {
        await chatService.storeChatInteraction(
          message,
          structuredAdvice,
          detectedEmotion || geminiResponse.emotion,
          extractedEntities
        );
      } catch (storeError) {
        console.warn("Failed to store chat interaction:", storeError);
      }

      // Prefer structured output from Gemini but enforce our structure if missing
      return {
        advice: structuredAdvice,
        emotion: detectedEmotion || geminiResponse.emotion,
        suggestions: Array.isArray(geminiResponse.suggestions) ? geminiResponse.suggestions : [],
        resources: Array.isArray(geminiResponse.resources) ? geminiResponse.resources : [],
        entities: Array.isArray(geminiResponse.entities) ? geminiResponse.entities : extractedEntities
      };
    } catch (adviceError) {
      console.error("Advice generation failed:", adviceError);
      const fallback = geminiService.getFallbackAdvice(profile, detectedEmotion);
      const intent = extractIntent(message);
      const structuredAdvice = formatToStructuredAdvice(
        fallback?.advice || "",
        profile,
        detectedEmotion,
        intent,
        message
      );
      return {
        advice: structuredAdvice,
        emotion: detectedEmotion,
        suggestions: Array.isArray(fallback?.suggestions) ? fallback.suggestions : [
          "Show me budgeting basics",
          "Explain investment options",
          "Help me save money"
        ],
        resources: Array.isArray(fallback?.resources) ? fallback.resources : [],
        entities: extractedEntities
      };
    }
  } catch (err) {
    console.error("🔥 Error in processChat:", err);
    const fallback = geminiService.getFallbackAdvice(userProfile, 'neutral');
    const intent = extractIntent(message);
    const structuredAdvice = formatToStructuredAdvice(
      fallback?.advice || "",
      userProfile,
      'neutral',
      intent,
      message
    );
    return {
      advice: structuredAdvice,
      emotion: 'neutral',
      suggestions: Array.isArray(fallback?.suggestions) ? fallback.suggestions : [
        "Help me create a budget",
        "Show me safe investments",
        "How to start saving?"
      ],
      resources: Array.isArray(fallback?.resources) ? fallback.resources : [],
      entities: []
    };
  }
}

// Format Gemini free-form text into concise structured sections for UI
function formatToStructuredAdvice(rawText, userProfile, emotion, intent = 'general_finance_query', userMessage = '') {
  try {
    if (!rawText || typeof rawText !== 'string') return '';
    const text = rawText.trim();

    // If already structured per our strict format, return as is
    const hasStrict = text.includes('Greeting:') && text.includes('Advice:') && text.toLowerCase().includes('next steps');
    if (hasStrict) return text;

    const name = Array.isArray(userProfile?.name) ? userProfile.name[0] : (userProfile?.name || 'User');
    const mood = (emotion || 'neutral');

    // Extract recommendation bullets following the label or generic bullets
    const lines = text.split(/\r?\n/);
    const recos = [];
    let inRecos = false;
    let inSteps = false;
    const steps = [];

    for (const line of lines) {
      const l = line.trim();
      if (!l) continue;
      if (l.toLowerCase().includes('specific recommendations')) {
        inRecos = true; inSteps = false; continue;
      }
      if (l.toLowerCase().includes('next steps')) {
        inSteps = true; inRecos = false; continue;
      }
      if (inRecos && (l.startsWith('•') || l.startsWith('-') || l.startsWith('*'))) {
        recos.push(l.replace(/^([•\-*]\s*)/, '').replace(/^\*\*|\*\*$/g, '').trim());
        continue;
      }
      if (inSteps) {
        const stepMatch = l.match(/^\s*(\d+)[\.)]\s*(.*)$/);
        if (stepMatch && stepMatch[2]) steps.push(stepMatch[2].trim());
      }
    }

    // Fallbacks if not found
    const salary = Number(userProfile?.salary ?? 0);
    const expenses = Number(userProfile?.expenses ?? 0);
    const surplus = Math.max(0, salary - expenses);
    const riskTol = userProfile?.risk_tolerance || userProfile?.riskTolerance || 'moderate';
    const lifeStage = userProfile?.life_stage || userProfile?.lifeStage || 'general';

    const finalRecos = (recos.length > 0 ? recos : [
      surplus ? `Automate savings from surplus of ₹${surplus}` : 'Track spending to find monthly surplus',
      `Build 3–6 months emergency fund (~₹${Math.max(0, expenses * 3)}–₹${Math.max(0, expenses * 6)}) in liquid options`,
      `Start SIPs aligned to ${riskTol} risk; keep costs low`
    ]).slice(0, 5);

    const finalSteps = (steps.length > 0 ? steps : [
      'Set an auto-transfer on salary day',
      'Begin/adjust PPF or index SIP (small amount is fine)',
      'Review expenses weekly to cut 1–2 categories'
    ]).slice(0, 3);

    // Assemble structured text expected by UI
    const structured = [
      `Greeting: Hey ${name}! 👋`,
      `Mood: ${mood}`,
      '',
      'Advice:',
      ...finalRecos.map(r => `- ${r}`),
      '',
      'Next steps:',
      ...finalSteps.map((s, i) => `${i + 1}) ${s}`),
      '',
      `Note: Tailored to intent [${intent}] for: ${userMessage}`,
      `Note: Keep decisions aligned to ${riskTol} risk and ${lifeStage} stage.`
    ].join('\n');

    // Improve readability: ensure bold segments (**) start on a new line
    let pretty = structured
      .replace(/([-•]\s*)\*\*/g, (_m, prefix) => `${prefix}\n**`) // before bold
      .replace(/\*\*(.*?)\*\*\s*(?=\S)/g, '**$1**\n'); // after bold

    // Reformat Advice bullets uniformly as "• " and extra spacing between items
    pretty = pretty.replace(/Advice:\n([\s\S]*?)\n\nNext steps:/, (_m, block) => {
      const lines = block
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0)
        .map(l => l.replace(/^[-•]\s*/, ''));
      const rebuilt = lines.map(item => `• ${item}`).join('\n\n');
      return `Advice:\n${rebuilt}\n\nNext steps:`;
    });

    return pretty.trim();
  } catch {
    return rawText;
  }
}

// Extract a concise intent string from the user's message
function extractIntent(message) {
  try {
    if (!message || typeof message !== 'string') return 'general_finance_query';
    const m = message.toLowerCase();
    const intents = [];
    if (m.includes('gambl')) intents.push('loss_gambling');
    if (m.includes('debt') || m.includes('loan')) intents.push('manage_debt');
    if (m.includes('bonus')) intents.push('bonus_investment');
    if (m.includes('gift')) intents.push('gift_investment');
    if (m.includes('save')) intents.push('increase_saving');
    if (m.includes('invest')) intents.push('investing_options');
    if (m.includes('retire')) intents.push('retirement_planning');
    if (m.includes('double')) intents.push('target_double_capital');
    if (m.includes('emergency')) intents.push('emergency_fund');
    return intents.length ? intents.join('+') : 'general_finance_query';
  } catch {
    return 'general_finance_query';
  }
}

// Export as object with the functions your UI expects
// Mock chat history data
const mockChatHistory = [
  {
    messageType: 'bot',
    content: 'Welcome! How can I help you with your finances today?',
    timestamp: Date.now() * 1000000,
    emotion: ['neutral']
  }
];

export const chatService = {
  processChat,
  
  // Get user data from ICP backend
  getUserData: async () => {
    try {
      // Force use of mock implementation for now
      console.log("Using mock implementation for getUserData");
      
      // Check localStorage for saved profile
      const savedProfile = localStorage.getItem('finsense_user_profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        console.log('Profile loaded from localStorage:', profile);
        
        // Convert to frontend format (arrays)
        const formattedProfile = {
          name: profile.name ? [profile.name] : ["User"],
          riskTolerance: profile.riskTolerance ? [profile.riskTolerance] : ["moderate"],
          savings: profile.savings ? [profile.savings] : [100000],
          debt: profile.debt ? [profile.debt] : [0],
          country: profile.country ? [profile.country] : ["India"],
          language: profile.language ? [profile.language] : ["default"],
          lifeStage: profile.lifeStage ? [profile.lifeStage] : ["adult"],
          goals: profile.goals || []
        };
        
        console.log('Formatted profile:', formattedProfile);
        return [formattedProfile];
      }
      
      return []; // No profile set yet
    } catch (error) {
      console.error("Failed to get user data:", error);
      return [];
    }
  },
  
  // Get chat history from ICP backend
  getChatHistory: async () => {
    try {
      const actor = await getBackendActor();
      
      // Check if the actor has getMessages method
      if (actor && typeof actor.getMessages === 'function') {
        const messages = await actor.getMessages();
        
        return messages.map(msg => ({
          messageType: msg.messageType,
          content: msg.content,
          timestamp: msg.timestamp,
          emotion: msg.emotion ? [msg.emotion] : ["neutral"]
        }));
      } else {
        console.log("Backend actor doesn't have getMessages method, using mock data");
        return mockChatHistory;
      }
    } catch (error) {
      console.error("Failed to get chat history:", error);
      return mockChatHistory;
    }
  },
  
  // Store chat interaction in backend
  storeChatInteraction: async (userMessage, botResponse, emotion, entities) => {
    try {
      const actor = await getBackendActor();
      return await actor.storeChatInteraction(userMessage, botResponse, emotion, entities);
    } catch (error) {
      console.error("Failed to store chat interaction:", error);
    }
  },
  
  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      console.log('Updating user profile with data:', profileData);
      
      // Force use of mock implementation for now
      console.log("Using mock implementation for updateUserProfile");
      
      // Create a mock profile object
      const mockProfile = {
        id: Date.now(),
        name: profileData.name || '',
        riskTolerance: profileData.riskTolerance || 'moderate',
        savings: profileData.savings || 0,
        debt: profileData.debt || 0,
        country: profileData.country || 'India',
        language: profileData.language || 'default',
        lifeStage: profileData.lifeStage || 'adult',
        goals: profileData.goals || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('finsense_user_profile', JSON.stringify(mockProfile));
      console.log('Profile saved to localStorage:', mockProfile);
      
      return mockProfile;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  },

  // Sync data when user logs in with ICP
  syncUserData: async () => {
    try {
      console.log('Syncing user data with ICP...');
      
      // Get data from ICP backend
      const icpData = await chatService.getUserData();
      
      if (icpData && icpData.length > 0) {
        console.log('Data synced from ICP:', icpData[0]);
        return icpData[0];
      } else {
        // Check localStorage for backup data
        const localData = localStorage.getItem('finsense_user_profile');
        if (localData) {
          const parsedData = JSON.parse(localData);
          console.log('Using backup data from localStorage:', parsedData);
          return parsedData;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Failed to sync user data:', error);
      return null;
    }
  },
  
  // Helper method to handle API errors
  handleApiError: (error) => {
    console.error("API Error:", error);
    return {
      advice: "I'm having trouble accessing my knowledge base. Let's focus on basic financial concepts for now.",
      emotion: "neutral",
      suggestions: ["Tell me about budgeting", "Explain investments", "Discuss savings strategies"],
      resources: [],
      entities: []
    };
  }
};
