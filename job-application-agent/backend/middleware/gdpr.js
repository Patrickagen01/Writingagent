const { encryptSensitiveData, decryptSensitiveData } = require('./privacy');

/**
 * GDPR middleware for handling user rights and data protection
 */
function setupGDPRMiddleware() {
  return (req, res, next) => {
    // Add GDPR-specific headers
    res.setHeader('X-GDPR-Rights', 'access,rectification,erasure,portability,restriction,objection');
    res.setHeader('X-Data-Controller', 'user-controlled');
    res.setHeader('X-Data-Processor', 'local-only');
    
    // Add GDPR rights to request object
    req.gdprRights = {
      access: true,
      rectification: true,
      erasure: true,
      portability: true,
      restriction: true,
      objection: true
    };
    
    // Add data processing consent check
    req.checkGDPRConsent = (consent) => {
      return validateGDPRConsent(consent);
    };
    
    next();
  };
}

/**
 * Validate GDPR consent requirements
 */
function validateGDPRConsent(consent) {
  if (!consent) return false;
  
  const requiredConsents = [
    'dataProcessing',
    'dataStorage',
    'dataSharing',
    'cookies',
    'analytics'
  ];
  
  return requiredConsents.every(consentType => {
    return consent[consentType] && 
           consent[consentType].granted && 
           consent[consentType].timestamp &&
           consent[consentType].version;
  });
}

/**
 * Handle GDPR right to access
 */
async function handleDataAccess(userId, db) {
  try {
    const userData = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    const applications = await db.all('SELECT * FROM applications WHERE user_id = ?', [userId]);
    const preferences = await db.get('SELECT * FROM user_preferences WHERE user_id = ?', [userId]);
    
    return {
      userData: userData ? decryptSensitiveData(userData) : null,
      applications: applications.map(app => ({
        ...app,
        resume: '[REDACTED]', // Don't include sensitive files in access request
        coverLetter: '[REDACTED]'
      })),
      preferences,
      timestamp: new Date().toISOString(),
      format: 'json'
    };
  } catch (error) {
    throw new Error('Failed to retrieve user data for access request');
  }
}

/**
 * Handle GDPR right to rectification
 */
async function handleDataRectification(userId, data, db) {
  try {
    const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'preferences'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updates[field] = data[field];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      throw new Error('No valid fields provided for rectification');
    }
    
    // Encrypt sensitive data before storage
    const encryptedData = encryptSensitiveData(updates);
    
    await db.run(
      'UPDATE users SET data = ?, updated_at = ? WHERE id = ?',
      [JSON.stringify(encryptedData), new Date().toISOString(), userId]
    );
    
    return {
      success: true,
      updatedFields: Object.keys(updates),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error('Failed to rectify user data');
  }
}

/**
 * Handle GDPR right to erasure (right to be forgotten)
 */
async function handleDataErasure(userId, db) {
  try {
    // Soft delete - mark as deleted but keep for legal requirements
    await db.run(
      'UPDATE users SET deleted_at = ?, data_retention_until = ? WHERE id = ?',
      [
        new Date().toISOString(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        userId
      ]
    );
    
    // Anonymize applications
    await db.run(
      'UPDATE applications SET user_id = ?, anonymized_at = ? WHERE user_id = ?',
      [`anonymized_${userId}`, new Date().toISOString(), userId]
    );
    
    return {
      success: true,
      erasureDate: new Date().toISOString(),
      retentionUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Data marked for deletion. Will be permanently removed after 30 days.'
    };
  } catch (error) {
    throw new Error('Failed to process data erasure request');
  }
}

/**
 * Handle GDPR right to data portability
 */
async function handleDataPortability(userId, db) {
  try {
    const userData = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    const applications = await db.all('SELECT * FROM applications WHERE user_id = ?', [userId]);
    const preferences = await db.get('SELECT * FROM user_preferences WHERE user_id = ?', [userId]);
    
    const portableData = {
      user: userData ? decryptSensitiveData(userData) : null,
      applications: applications.map(app => ({
        id: app.id,
        jobTitle: app.job_title,
        company: app.company,
        appliedAt: app.applied_at,
        status: app.status,
        // Exclude sensitive files for portability
        hasResume: !!app.resume,
        hasCoverLetter: !!app.cover_letter
      })),
      preferences,
      exportedAt: new Date().toISOString(),
      format: 'json',
      version: '1.0'
    };
    
    return portableData;
  } catch (error) {
    throw new Error('Failed to export user data for portability');
  }
}

/**
 * Handle GDPR right to restriction of processing
 */
async function handleProcessingRestriction(userId, restriction, db) {
  try {
    await db.run(
      'UPDATE users SET processing_restricted = ?, restriction_reason = ?, restricted_at = ? WHERE id = ?',
      [true, restriction.reason, new Date().toISOString(), userId]
    );
    
    return {
      success: true,
      restrictedAt: new Date().toISOString(),
      reason: restriction.reason,
      message: 'Data processing has been restricted as requested'
    };
  } catch (error) {
    throw new Error('Failed to restrict data processing');
  }
}

/**
 * Handle GDPR right to object
 */
async function handleObjection(userId, objection, db) {
  try {
    await db.run(
      'INSERT INTO user_objections (user_id, objection_type, reason, created_at) VALUES (?, ?, ?, ?)',
      [userId, objection.type, objection.reason, new Date().toISOString()]
    );
    
    return {
      success: true,
      objectionId: objection.id,
      objectionType: objection.type,
      timestamp: new Date().toISOString(),
      message: 'Your objection has been recorded and will be reviewed'
    };
  } catch (error) {
    throw new Error('Failed to record user objection');
  }
}

/**
 * Check if user has valid GDPR consent
 */
function hasValidGDPRConsent(userConsent) {
  if (!userConsent) return false;
  
  const now = new Date();
  const consentDate = new Date(userConsent.timestamp);
  const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
  
  return (now - consentDate) < maxAge && userConsent.version >= '1.0';
}

module.exports = {
  setupGDPRMiddleware,
  validateGDPRConsent,
  handleDataAccess,
  handleDataRectification,
  handleDataErasure,
  handleDataPortability,
  handleProcessingRestriction,
  handleObjection,
  hasValidGDPRConsent
};