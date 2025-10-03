import { tokenService } from './TokenService';
import { toast } from 'react-hot-toast';

class GeminiService {
  constructor() {
    // Use Vite's env at build time
    this.apiKey = (import.meta && import.meta.env && (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY)) || '';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
  }

  // Detect emotion from user message using Gemini
  async detectEmotion(text) {
    try {
      const prompt = `Analyze the emotion in this message and respond with ONLY one word from this list: happy, sad, anxious, angry, excited, calm, neutral, worried, confident, frustrated, hopeful, overwhelmed.

Message: "${text}"

Respond with only the emotion word:`;

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }]
        })
      });

      const data = await response.json();
      console.log("Gemini detectEmotion response:", JSON.stringify(data, null, 2));

      const emotion = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toLowerCase();

      const validEmotions = [
        'happy', 'sad', 'anxious', 'angry', 'excited', 'calm',
        'neutral', 'worried', 'confident', 'frustrated', 'hopeful', 'overwhelmed'
      ];

      return validEmotions.includes(emotion) ? emotion : 'neutral';

    } catch (error) {
      console.error('Emotion detection failed:', error);
      return 'neutral';
    }
  }

  // Extract investment entities from user message
  extractInvestmentEntities(message) {
    const patterns = [
      /([A-Za-z0-9\s]+ Fund)/gi,
      /([A-Za-z]+\s+Bond)/gi,
      /([A-Za-z0-9\.\-]+\.NS)/gi,
      /([A-Za-z0-9\.\-]+\.BO)/gi,
      /([A-Za-z0-9\s]+ ETF)/gi,
      /(NPS|nps)/gi,
      /(FD|fd|Fixed Deposit)/gi,
      /(Gold|gold)/gi,
      /(Real Estate|real estate|property)/gi,
    ];

    let entities = [];
    patterns.forEach(pattern => {
      const matches = message.match(pattern);
      if (matches) entities = [...entities, ...matches];
    });

    return [...new Set(entities)];
  }

  // Generate comprehensive financial advice using Gemini
  async generateFinancialAdvice(userMessage, userProfile, emotion, entities, history = []) {
    try {
      if (!this.apiKey) {
        console.warn('Gemini API key missing. Using fallback advice.');
        return this.getFallbackAdvice(userProfile, emotion);
      }
      const prompt = this.buildAdvicePrompt(userMessage, userProfile, emotion, entities, history);

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.5,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 700
          }
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.error) {
        const status = data?.error?.status || response.status;
        const message = data?.error?.message || 'Gemini API error';
        console.warn(`Gemini API returned ${status}: ${message}. Using fallback advice.`);
        return this.getFallbackAdvice(userProfile, emotion);
      }
      console.log("Gemini generateFinancialAdvice response:", JSON.stringify(data, null, 2));

   const advice =
  data?.candidates?.[0]?.content?.parts?.[0]?.text ||
  data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ||
  data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") ||
  null;
      if (!advice) {
        throw new Error('No advice generated');
      }

      // Award tokens for good FEIS score if present in the message
      if (userMessage.toLowerCase().includes('feis') && userMessage.match(/\d+/)) {
        const score = parseInt(userMessage.match(/\d+/)[0]);
        if (score >= 70) {
          tokenService.addTokens(15, 'Positive FEIS Score');
          toast.success('Earned 15 FinCoins for maintaining good financial health!');
        }
      }

      return this.formatAdviceResponse(advice, userProfile, emotion, entities);
    } catch (error) {
      console.error('Advice generation failed:', error);
      return this.getFallbackAdvice(userProfile, emotion);
    }
  }

  buildAdvicePrompt(userMessage, userProfile, emotion, entities, history = []) {
    const safe = (v, d='') => (v === undefined || v === null ? d : v);
    const name = safe(userProfile?.name, 'User');
    const salary = Number(safe(userProfile?.salary, 0));
    const expenses = Number(safe(userProfile?.expenses, 0));
    const riskTol = safe(userProfile?.risk_tolerance || userProfile?.riskTolerance, 'moderate');
    const targetSave = Number(safe(userProfile?.target_savings || userProfile?.targetSavings, 0));
    const lifeStage = safe(userProfile?.life_stage || userProfile?.lifeStage, 'general');
    const country = safe(userProfile?.country, 'IN');
    const goals = Array.isArray(userProfile?.goals) ? userProfile.goals.join(', ') : safe(userProfile?.goals, 'Not specified');
    const recent = history.slice(-6).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
    const entitiesText = entities.length > 0 ? entities.join(', ') : 'None mentioned';

    return `You are Dr. Zypher, an AI Financial Therapist specializing in emotional financial wellness. Provide personalized, empathetic, and actionable financial advice. Keep it concise.

USER PROFILE:
- Name: ${name}
- Current Emotion: ${emotion}
- Salary: ₹${salary}
- Monthly Expenses: ₹${expenses}
- Risk Tolerance: ${riskTol}
- Savings Target: ₹${targetSave}
- Life Stage: ${lifeStage}
- Country: ${country}
- Goals: ${goals}

USER MESSAGE: "${userMessage}"
INVESTMENT ENTITIES MENTIONED: ${entitiesText}

RECENT CONTEXT (most recent last):
${recent || 'None'}

INSTRUCTIONS (STRICT):
1. Start with a one-line greeting using the user's name and current emotion.
2. Provide only high-signal, personalized points grounded in the profile and the user message.
3. Reflect mentioned entities if any; add cautions when needed.
4. Include 3–5 bullet recommendations and 3 concise next steps.
5. Use INR formatting and Indian context when appropriate.
6. Output must be SHORT, SCANNABLE and STRUCTURED. NO long paragraphs.

OUTPUT FORMAT (STRICT, EXACT HEADERS):
Greeting: Hey ${userProfile.name}! 👋
Mood: ${emotion}

Advice:
- [concise point 1]
- [concise point 2]
- [concise point 3]
- [optional point 4]
- [optional point 5]

Next steps:
1) [short action]
2) [short action]
3) [short action]

Note: Keep decisions aligned to ${userProfile.risk_tolerance} risk and ${userProfile.life_stage} stage.
`;
  }

  formatAdviceResponse(advice, userProfile, emotion, entities) {
    const trimmed = typeof advice === 'string' ? advice.trim() : '';
    
    // If the advice is already in the structured format, return it as is
    if (trimmed.includes('Greeting:') && trimmed.includes('Advice:') && trimmed.includes('Next steps:')) {
      return {
        advice: trimmed,
        emotion: emotion,
        suggestions: this.getEmotionalSuggestions(emotion),
        resources: this.getRecommendedResources(emotion, userProfile),
        entities: entities
      };
    }
    
    // Otherwise, format it into the expected structure
    return {
      advice: trimmed,
      emotion: emotion,
      suggestions: this.getEmotionalSuggestions(emotion),
      resources: this.getRecommendedResources(emotion, userProfile),
      entities: entities
    };
  }

  getEmotionalSuggestions(emotion) {
    const suggestions = {
      anxious: [
        'Tell me about building an emergency fund',
        'How can I start investing with small amounts?',
        'What are some low-risk investment options?'
      ],
      excited: [
        'Show me high-growth investment opportunities',
        'How can I maximize my returns?',
        'What should I research before investing?'
      ],
      worried: [
        'Help me create a budget plan',
        'What are the safest investment options?',
        'How much should I save for emergencies?'
      ],
      confident: [
        'What are some advanced investment strategies?',
        'How can I diversify my portfolio?',
        'Tell me about tax-saving investments'
      ],
      frustrated: [
        'Help me review my current investments',
        'What mistakes should I avoid?',
        'How can I improve my financial situation?'
      ],
      hopeful: [
        'What are my long-term investment options?',
        'How can I plan for my financial goals?',
        'What investment strategy suits me best?'
      ],
      overwhelmed: [
        'Break down investing basics for me',
        'What should be my first investment?',
        'How do I start my financial journey?'
      ],
      neutral: [
        'Analyze my current financial situation',
        'What investment options do you recommend?',
        'Help me set financial goals'
      ]
    };

    return suggestions[emotion] || suggestions.neutral;
  }

  getRecommendedResources(emotion, userProfile) {
    const baseResources = [
      'Financial Meditation (10-15 min)',
      'Investment Basics Guide (5 min read)',
      'Risk Assessment Tool',
      'Budget Planning Template'
    ];

    const emotionSpecificResources = {
      anxious: ['Anxiety Management for Financial Decisions', 'Emergency Fund Calculator'],
      excited: ['Investment Research Checklist', 'Market Analysis Tools'],
      worried: ['Conservative Investment Guide', 'Financial Safety Net Planning'],
      confident: ['Advanced Portfolio Strategies', 'Tax Optimization Guide'],
      frustrated: ['Financial Goal Reset Workshop', 'Investment Review Checklist'],
      overwhelmed: ['Beginner Investment Course', 'Step-by-step Financial Planning']
    };

    return [
      ...baseResources,
      ...(emotionSpecificResources[emotion] || [])
    ].slice(0, 4);
  }

  getFallbackAdvice(userProfile, emotion) {
    const name = userProfile.name || 'there';
    return {
      emotion,
      advice: `Greeting: Hey ${name}! 👋
Mood: ${emotion}

Advice:
- Keep essentials under 50% of income; automate savings from surplus ₹${userProfile.salary - userProfile.expenses}.
- Build 3–6 months emergency fund: ~₹${userProfile.expenses * 3}–₹${userProfile.expenses * 6} in liquid options.
- Start SIPs aligned to ${userProfile.risk_tolerance} risk (PPF/FD for safety; diversified index/ELSS for growth).

Next steps:
1) Set auto-transfer on salary day to savings/investments.
2) Open/verify PPF or low-cost index SIP; start small.
3) Track expenses weekly for one month to find cuts.
`,
      suggestions: this.getEmotionalSuggestions(emotion),
      resources: this.getRecommendedResources(emotion, userProfile),
      entities: []
    };
  }
}

export const geminiService = new GeminiService();
