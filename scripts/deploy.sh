#!/bin/bash

# FinSense AI Deployment Script
echo "🚀 Starting FinSense AI deployment..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install dfx first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "dfx.json" ]; then
    echo "❌ dfx.json not found. Please run this script from the project root."
    exit 1
fi

# Build the frontend
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

# Deploy to local network
echo "🔧 Deploying to local network..."
dfx start --background --clean

# Deploy canisters
echo "📡 Deploying canisters..."
dfx deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Frontend URL: http://localhost:4943/?canisterId=$(dfx canister id finsense_frontend)"
    echo "🔗 Backend Canister ID: $(dfx canister id finsense_backend)"
    
    # Copy canister IDs to frontend
    echo "📋 Copying canister IDs..."
    node scripts/copy-canister-ids.js
    
    echo "🎉 FinSense AI is now running locally!"
    echo "💡 To deploy to mainnet, run: dfx deploy --network ic"
else
    echo "❌ Deployment failed!"
    exit 1
fi

