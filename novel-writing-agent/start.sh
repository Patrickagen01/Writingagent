#!/bin/bash

# Novel Writing Agent - Quick Start Script

echo "🤖📖 Novel Writing Agent - Starting Up..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(process.version >= 'v$REQUIRED_VERSION' ? 0 : 1)"; then
    echo "❌ Node.js version $REQUIRED_VERSION or higher is required. Current version: v$NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check for environment file
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  Environment file not found!"
    echo "📝 Creating .env.local from template..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local"
        echo ""
        echo "🔑 IMPORTANT: Please edit .env.local and add your OpenAI API key:"
        echo "   OPENAI_API_KEY=your_openai_api_key_here"
        echo ""
        echo "   Get your API key from: https://platform.openai.com/"
        echo ""
        read -p "Press Enter after setting up your API key to continue..."
    else
        echo "❌ .env.example not found"
        exit 1
    fi
fi

# Check if API key is set
if grep -q "your_openai_api_key_here" .env.local; then
    echo ""
    echo "⚠️  Please set your OpenAI API key in .env.local before starting"
    echo "   Edit the OPENAI_API_KEY line with your actual API key"
    echo ""
    exit 1
fi

echo ""
echo "🚀 Starting Novel Writing Agent..."
echo "📱 The application will open at: http://localhost:3000"
echo ""
echo "🎯 Features available:"
echo "   • AI-powered outline generation"
echo "   • Chapter writing with GPT-4"
echo "   • Character development"
echo "   • Multi-language translation"
echo "   • Plagiarism detection"
echo "   • Project management"
echo ""
echo "💡 Tip: See demo.md for a complete walkthrough"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev