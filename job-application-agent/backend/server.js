const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const crypto = require('crypto');
const winston = require('winston');
require('dotenv').config();

// Import privacy-focused modules
const { setupDatabase } = require('./database/setup');
const { setupBlockchain } = require('./blockchain/setup');
const { setupAIEngine } = require('./ai/setup');
const { setupTranslation } = require('./i18n/setup');
const { setupPrivacyMiddleware } = require('./middleware/privacy');
const { setupGDPRMiddleware } = require('./middleware/gdpr');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const aiRoutes = require('./routes/ai');
const blockchainRoutes = require('./routes/blockchain');
const privacyRoutes = require('./routes/privacy');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure logging with privacy focus
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'job-agent-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Privacy-first security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting for privacy protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression for performance
app.use(compression());

// CORS with privacy considerations
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing with size limits for privacy
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Privacy and GDPR middleware
app.use(setupPrivacyMiddleware());
app.use(setupGDPRMiddleware());

// Request logging with PII protection
app.use((req, res, next) => {
  const sanitizedReq = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };
  
  // Remove any potential PII from logs
  delete sanitizedReq.body;
  delete sanitizedReq.headers;
  
  logger.info('Incoming request', sanitizedReq);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    privacy: {
      gdprCompliant: true,
      dataLocalization: true,
      encryptionEnabled: true
    }
  });
});

// Privacy policy endpoint
app.get('/privacy', (req, res) => {
  res.json({
    privacyPolicy: {
      dataCollection: 'minimal',
      dataStorage: 'local_and_decentralized',
      dataProcessing: 'local_ai_only',
      userRights: ['access', 'rectification', 'erasure', 'portability'],
      gdprCompliance: true,
      dataRetention: 'user_controlled'
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/privacy', privacyRoutes);

// Error handling with privacy focus
app.use((err, req, res, next) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    // Don't log any user data
  });

  // Don't expose internal errors to users
  res.status(500).json({
    error: 'Internal server error',
    message: 'An error occurred while processing your request',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource was not found',
    timestamp: new Date().toISOString()
  });
});

// Initialize services
async function initializeServices() {
  try {
    logger.info('Initializing decentralized job application agent...');
    
    // Setup local database
    await setupDatabase();
    logger.info('Database initialized');
    
    // Setup blockchain connection
    await setupBlockchain();
    logger.info('Blockchain connection established');
    
    // Setup local AI engine
    await setupAIEngine();
    logger.info('AI engine initialized');
    
    // Setup translation services
    await setupTranslation();
    logger.info('Translation services initialized');
    
    logger.info('All services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await initializeServices();
  
  app.listen(PORT, () => {
    logger.info(`🚀 Decentralized Job Application Agent running on port ${PORT}`);
    logger.info(`🔒 Privacy-first architecture enabled`);
    logger.info(`🌐 Multi-language support active`);
    logger.info(`⚡ Local AI processing ready`);
    logger.info(`🔗 Blockchain integration active`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer().catch(error => {
  logger.error('Failed to start server', error);
  process.exit(1);
});