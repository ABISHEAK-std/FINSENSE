# FinSense AI - Deployment Guide

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **DFX** (Internet Computer SDK)
3. **Git**

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finsense_ai
```

2. Install dependencies:
```bash
npm install
```

3. Install DFX (if not already installed):
```bash
# Windows (PowerShell)
powershell -c "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; iwr 'https://internetcomputer.org/install.sh' -useb | iex}"

# macOS/Linux
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

## 🔧 Local Development

### Start Local Development

1. **Start the local Internet Computer replica:**
```bash
npm run dfx:start
```

2. **Deploy canisters locally:**
```bash
npm run dfx:deploy
```

3. **Start the frontend development server:**
```bash
npm start
```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - IC Replica: http://localhost:4943

### Alternative: One-Command Deployment

```bash
npm run deploy:local
```

This will:
- Build the frontend
- Start the local IC replica
- Deploy all canisters
- Copy canister IDs to the frontend

## 🌐 Production Deployment

### Deploy to Internet Computer Mainnet

1. **Build and deploy:**
```bash
npm run deploy:ic
```

2. **Or step by step:**
```bash
# Build frontend
npm run build

# Deploy to mainnet
dfx deploy --network ic
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Gemini AI API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Internet Computer Network
VITE_DFX_NETWORK=ic
VITE_IC_HOST=https://ic0.app

# Internet Identity URL
VITE_II_URL=https://identity.ic0.app
```

## 📱 User Flow

### First-Time User Experience

1. **Landing Page**: Users see a welcome screen with Internet Identity login
2. **Authentication**: Users log in using Internet Identity (no passwords required)
3. **Profile Setup**: New users are guided through profile creation
4. **Dashboard**: Access to all financial wellness features

### Features Available

- ✅ **AI Financial Therapy Chat** - Emotional financial counseling
- ✅ **Expense Tracking** - Track expenses with emotional analysis
- ✅ **Investment Portfolio** - Manage investments with emotional market timing
- ✅ **Cultural Financial Planning** - Culturally-aware financial advice
- ✅ **Profile Management** - Personalize your experience

## 🔐 Authentication

The app uses **Internet Identity** for authentication:

- **No passwords required**
- **Decentralized and secure**
- **Privacy-focused**
- **Works across devices**

## 🗄️ Data Storage

All user data is stored on the Internet Computer:

- **Expenses**: Personal expense records
- **Investments**: Portfolio holdings
- **Chat History**: Therapy conversations
- **User Profile**: Personal preferences and settings

## 🛠️ Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── services/           # Backend service integrations
├── ic/                 # Internet Computer integration
└── styles/             # CSS and styling

ic/
├── backend/            # Motoko backend canisters
└── types/              # Shared type definitions
```

### Key Services

- **ChatService**: AI therapy chat functionality
- **ExpenseService**: Expense tracking and analytics
- **InvestmentService**: Portfolio management
- **GeminiService**: AI integration for financial advice

## 🐛 Troubleshooting

### Common Issues

1. **DFX not found**: Install DFX using the installation command above
2. **Build fails**: Check Node.js version and run `npm install`
3. **Deployment fails**: Ensure DFX is running and try `dfx stop && dfx start`
4. **Authentication issues**: Clear browser cache and try again

### Logs

Check the browser console for detailed error messages and logs.

## 📞 Support

For issues and questions:
- Check the browser console for errors
- Review the deployment logs
- Ensure all prerequisites are installed

## 🔄 Updates

To update the application:

1. Pull latest changes: `git pull`
2. Install new dependencies: `npm install`
3. Rebuild: `npm run build`
4. Redeploy: `npm run dfx:deploy` (local) or `npm run deploy:ic` (mainnet)

---

**FinSense AI** - Your personal AI Financial Therapist for emotional financial wellness 🌟

