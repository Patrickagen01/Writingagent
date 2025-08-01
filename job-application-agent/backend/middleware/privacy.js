const crypto = require('crypto');

/**
 * Privacy middleware for GDPR compliance and data protection
 */
function setupPrivacyMiddleware() {
  return (req, res, next) => {
    // Add privacy headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // GDPR compliance headers
    res.setHeader('X-GDPR-Compliant', 'true');
    res.setHeader('X-Data-Processing', 'local-only');
    res.setHeader('X-Data-Retention', 'user-controlled');
    
    // Add request ID for tracking without PII
    req.requestId = crypto.randomUUID();
    res.setHeader('X-Request-ID', req.requestId);
    
    // Sanitize request body for logging
    req.sanitizedBody = sanitizeRequestBody(req.body);
    
    next();
  };
}

/**
 * Sanitize request body to remove PII for logging
 */
function sanitizeRequestBody(body) {
  if (!body) return {};
  
  const sanitized = { ...body };
  const piiFields = [
    'email', 'password', 'phone', 'address', 'ssn', 'socialSecurity',
    'creditCard', 'bankAccount', 'personalId', 'dateOfBirth',
    'firstName', 'lastName', 'fullName', 'resume', 'coverLetter'
  ];
  
  piiFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

/**
 * Encrypt sensitive data before storage
 */
function encryptSensitiveData(data, key = process.env.ENCRYPTION_KEY) {
  if (!key) {
    throw new Error('Encryption key not configured');
  }
  
  const algorithm = 'aes-256-gcm';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex')
  };
}

/**
 * Decrypt sensitive data
 */
function decryptSensitiveData(encryptedData, key = process.env.ENCRYPTION_KEY) {
  if (!key) {
    throw new Error('Encryption key not configured');
  }
  
  const algorithm = 'aes-256-gcm';
  const decipher = crypto.createDecipher(algorithm, key);
  
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
  decipher.setAAD(Buffer.from(encryptedData.iv, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted);
}

/**
 * Generate privacy-compliant user identifier
 */
function generatePrivacyId(userData) {
  // Create a hash of user data without storing the original
  const dataToHash = `${userData.email || ''}-${Date.now()}`;
  return crypto.createHash('sha256').update(dataToHash).digest('hex');
}

/**
 * Validate GDPR consent
 */
function validateGDPRConsent(consent) {
  const requiredConsents = [
    'dataProcessing',
    'dataStorage',
    'dataSharing',
    'cookies',
    'analytics'
  ];
  
  return requiredConsents.every(consentType => 
    consent && consent[consentType] && consent[consentType].granted
  );
}

/**
 * Anonymize data for analytics
 */
function anonymizeData(data) {
  const anonymized = { ...data };
  
  // Remove direct identifiers
  delete anonymized.email;
  delete anonymized.phone;
  delete anonymized.name;
  delete anonymized.address;
  
  // Hash indirect identifiers
  if (anonymized.userId) {
    anonymized.userId = crypto.createHash('sha256').update(anonymized.userId).digest('hex');
  }
  
  return anonymized;
}

module.exports = {
  setupPrivacyMiddleware,
  sanitizeRequestBody,
  encryptSensitiveData,
  decryptSensitiveData,
  generatePrivacyId,
  validateGDPRConsent,
  anonymizeData
};