# FinSense AI Deployment Script for Windows
Write-Host "🚀 Starting FinSense AI deployment..." -ForegroundColor Green

# Check if dfx is installed
try {
    dfx --version | Out-Null
    Write-Host "✅ dfx is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ dfx is not installed. Please install dfx first." -ForegroundColor Red
    Write-Host "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "dfx.json")) {
    Write-Host "❌ dfx.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Build the frontend
Write-Host "📦 Building frontend..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to local network
Write-Host "🔧 Deploying to local network..." -ForegroundColor Blue
dfx start --background --clean

# Deploy canisters
Write-Host "📡 Deploying canisters..." -ForegroundColor Blue
dfx deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    
    $frontendId = dfx canister id finsense_frontend
    $backendId = dfx canister id finsense_backend
    
    Write-Host "🌐 Frontend URL: http://localhost:4943/?canisterId=$frontendId" -ForegroundColor Cyan
    Write-Host "🔗 Backend Canister ID: $backendId" -ForegroundColor Cyan
    
    # Copy canister IDs to frontend
    Write-Host "📋 Copying canister IDs..." -ForegroundColor Blue
    node scripts/copy-canister-ids.js
    
    Write-Host "🎉 FinSense AI is now running locally!" -ForegroundColor Green
    Write-Host "💡 To deploy to mainnet, run: dfx deploy --network ic" -ForegroundColor Yellow
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

