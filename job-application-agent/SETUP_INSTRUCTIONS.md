# 🚀 Decentralized Job Application Agent - Setup Instructions

## 📍 Project Location
**Save this project to:** `C:\Users\patre\Desktop\Projects\decentralized-job-agent`

## 🎯 Quick Start

### 1. **Copy Project to Desktop**
```bash
# Copy the entire project to your desktop
xcopy /E /I job-application-agent "C:\Users\patre\Desktop\Projects\decentralized-job-agent"
```

### 2. **Install Dependencies**
```bash
# Navigate to project directory
cd "C:\Users\patre\Desktop\Projects\decentralized-job-agent"

# Install all dependencies
npm run install:all
```

### 3. **Start Development**
```bash
# Start both frontend and backend
npm run dev
```

### 4. **Run Tests**
```bash
# Run comprehensive TestSprite tests
cd frontend
npm run test:sprite
```

---

## 📁 Project Structure

```
decentralized-job-agent/
├── 📁 frontend/                 # React application
│   ├── 📁 src/
│   │   ├── 📁 components/      # UI components
│   │   ├── 📁 contexts/        # React contexts
│   │   ├── 📁 pages/          # Application pages
│   │   ├── 📁 tests/          # TestSprite tests
│   │   └── 📁 styles/         # CSS styles
│   ├── 📄 package.json         # Frontend dependencies
│   ├── 📄 testsprite.config.js # TestSprite configuration
│   └── 📄 run-testsprite-tests.js # Test execution script
├── 📁 backend/                  # Node.js server
│   ├── 📁 middleware/          # Privacy & GDPR middleware
│   ├── 📁 routes/              # API routes
│   ├── 📁 database/            # Database setup
│   ├── 📁 blockchain/          # Blockchain integration
│   └── 📄 server.js            # Main server file
├── 📁 ai-engine/               # Local AI models
├── 📁 blockchain/              # Smart contracts
├── 📁 deployment/              # Deployment configs
├── 📄 package.json             # Root dependencies
└── 📄 README.md               # Project documentation
```

---

## 🔧 Environment Setup

### Required Software
- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git** (for version control)

### Environment Variables
Create a `.env` file in the root directory:

```env
# Development
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=sqlite:./data/app.db

# Security
JWT_SECRET=your-super-secret-jwt-key-32-chars-long
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Blockchain
ETHEREUM_NETWORK=testnet
ETHEREUM_RPC_URL=https://goerli.infura.io/v3/YOUR_PROJECT_ID

# IPFS
IPFS_GATEWAY=https://ipfs.io/ipfs/

# Privacy
GDPR_ENABLED=true
PRIVACY_MODE=strict
```

---

## 🚀 Development Commands

### Root Directory Commands
```bash
# Install all dependencies
npm run install:all

# Start development (frontend + backend)
npm run dev

# Build for production
npm run build

# Run all tests
npm test
```

### Frontend Commands
```bash
cd frontend

# Start frontend development server
npm run dev

# Run TestSprite tests
npm run test:sprite

# Build frontend
npm run build

# Run unit tests
npm test
```

### Backend Commands
```bash
cd backend

# Start backend development server
npm run dev

# Run backend tests
npm test

# Database migration
npm run migrate
```

---

## 🧪 Testing with TestSprite

### Run All Tests
```bash
cd frontend
npm run test:sprite
```

### Test Categories
1. **GDPR Consent Flow** - Privacy compliance testing
2. **Privacy-First Data Handling** - Encryption and local processing
3. **Multi-Language Support** - Internationalization testing
4. **Job Application Flow** - Complete application process
5. **AI Processing Privacy** - Local AI without external calls
6. **Blockchain Integration** - Decentralized features
7. **GDPR Rights Testing** - User rights implementation

### Test Reports
- **HTML Report**: `frontend/test-results/privacy-test-report.html`
- **JSON Report**: `frontend/test-results/privacy-test-report.json`

---

## 🌐 Access the Application

### Development URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Privacy Policy**: http://localhost:3001/privacy

### Test URLs
- **TestSprite Tests**: http://localhost:3000 (with TestSprite)
- **Test Reports**: `file:///C:/Users/patre/Desktop/Projects/decentralized-job-agent/frontend/test-results/privacy-test-report.html`

---

## 🔒 Privacy Features

### Built-in Privacy Protection
- ✅ **Local AI Processing** - No external API calls
- ✅ **Data Encryption** - All sensitive data encrypted
- ✅ **GDPR Compliance** - Full user rights implementation
- ✅ **No External Tracking** - Privacy-first analytics
- ✅ **User Data Control** - Export, rectification, erasure
- ✅ **Multi-language Support** - 4 languages supported

### GDPR Rights Implemented
- **Right to Access** - Export all user data
- **Right to Rectification** - Update personal information
- **Right to Erasure** - Delete account and data
- **Right to Portability** - Download data in JSON format
- **Right to Restriction** - Limit data processing
- **Right to Object** - Object to data processing

---

## 📊 Cost Analysis

### Development Costs
- **Initial Setup**: $0 (free development tools)
- **Smart Contracts**: $50-200 (one-time deployment)
- **Domain & SSL**: $10-20/year

### Monthly Operational Costs
- **MVP (0-100 users)**: $10-15/month
- **Production (100-1000 users)**: $30-80/month
- **Enterprise (1000+ users)**: $100-300/month

### Hosting Options
1. **Vercel + Railway** (Recommended for MVP)
2. **DigitalOcean App Platform** (Production)
3. **AWS** (Enterprise)

---

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill the process
taskkill /PID <PID> /F
```

2. **Dependencies Installation Failed**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

3. **TestSprite Tests Failing**
```bash
# Check if application is running
curl http://localhost:3000

# Run tests with debug mode
npm run test:sprite -- --debug
```

4. **Blockchain Connection Issues**
```bash
# Check Ethereum network status
curl -X POST https://goerli.infura.io/v3/YOUR_PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

## 📞 Support

### Documentation
- **Project README**: `README.md`
- **TestSprite Guide**: `frontend/TESTSPRITE_TESTING_GUIDE.md`
- **Deployment Guide**: `deployment/README.md`

### Getting Help
1. Check the troubleshooting section above
2. Review the detailed documentation
3. Check the test reports for specific issues
4. Verify environment variables are set correctly

---

## 🎉 Success Indicators

Your setup is successful when:
- ✅ Application starts without errors
- ✅ Frontend accessible at http://localhost:3000
- ✅ Backend API accessible at http://localhost:3001
- ✅ All TestSprite tests pass
- ✅ Privacy compliance verified
- ✅ Multi-language support working
- ✅ Local AI processing confirmed
- ✅ Blockchain integration active

---

## 🔄 Next Steps

1. **Customize Configuration**
   - Update environment variables
   - Configure blockchain network
   - Set up IPFS gateway

2. **Deploy to Production**
   - Choose hosting platform
   - Configure domain and SSL
   - Set up monitoring

3. **Scale the Application**
   - Add more languages
   - Implement advanced AI features
   - Expand blockchain integration

---

**🎯 Project Successfully Saved to:** `C:\Users\patre\Desktop\Projects\decentralized-job-agent`

**🚀 Ready to run:** `npm run dev`