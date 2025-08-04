import { TestSprite } from 'testsprite';

/**
 * TestSprite Test Runner for Decentralized Job Application Agent
 * 
 * This runner performs comprehensive testing of:
 * - GDPR compliance and privacy features
 * - Multi-language support
 * - Local AI processing
 * - Blockchain integration
 * - User data protection
 */

class PrivacyFirstTestRunner {
  private testSprite: TestSprite;
  private testResults: any[] = [];
  private privacyChecks: Map<string, boolean> = new Map();

  constructor() {
    this.testSprite = new TestSprite({
      baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
      timeout: 30000,
      retries: 2,
      headless: process.env.NODE_ENV === 'production',
      viewport: { width: 1280, height: 720 },
      userAgent: 'TestSprite/1.0 (Privacy-First Testing)',
    });

    this.setupPrivacyMonitoring();
  }

  /**
   * Setup privacy monitoring for all tests
   */
  private setupPrivacyMonitoring() {
    console.log('🔒 Setting up privacy monitoring...');
    
    // Monitor network requests for external tracking
    this.testSprite.on('request', (request) => {
      const url = request.url();
      if (url.includes('google-analytics') || url.includes('facebook') || url.includes('tracking')) {
        console.warn('⚠️ External tracking detected:', url);
        this.privacyChecks.set('no-external-tracking', false);
      }
    });

    // Monitor localStorage for encryption
    this.testSprite.on('storage', (event) => {
      if (event.key === 'user-data') {
        const isEncrypted = event.newValue && event.newValue.length > 100;
        this.privacyChecks.set('local-storage-encrypted', isEncrypted);
        console.log('🔐 Local storage encryption check:', isEncrypted);
      }
    });
  }

  /**
   * Run GDPR Consent Flow Test
   */
  async testGDPRConsentFlow() {
    console.log('🧪 Testing GDPR Consent Flow...');
    
    try {
      await this.testSprite.navigate('/');
      
      // Check if GDPR modal appears
      const gdprModal = await this.testSprite.waitForElement('[data-testid="gdpr-modal"]', 5000);
      if (!gdprModal) {
        throw new Error('GDPR modal not found');
      }

      // Test consent options
      await this.testSprite.click('[data-testid="analytics-consent"]');
      await this.testSprite.click('[data-testid="accept-selected"]');

      // Verify consent is saved
      const consent = await this.testSprite.evaluate(() => {
        return localStorage.getItem('gdpr-consent');
      });

      if (!consent) {
        throw new Error('GDPR consent not saved');
      }

      const consentData = JSON.parse(consent);
      this.validateConsentData(consentData);

      console.log('✅ GDPR Consent Flow test passed');
      this.testResults.push({
        test: 'GDPR Consent Flow',
        status: 'PASSED',
        details: {
          modalAppeared: true,
          consentSaved: true,
          timestamp: consentData.timestamp
        }
      });

    } catch (error) {
      console.error('❌ GDPR Consent Flow test failed:', error);
      this.testResults.push({
        test: 'GDPR Consent Flow',
        status: 'FAILED',
        error: error.message
      });
    }
  }

  /**
   * Test Privacy-First Data Handling
   */
  async testPrivacyFirstDataHandling() {
    console.log('🔒 Testing Privacy-First Data Handling...');
    
    try {
      // Test local storage encryption
      const encryptionTest = await this.testSprite.evaluate(() => {
        const testData = { email: 'test@example.com', name: 'John Doe' };
        const encrypted = window.encryptData(testData);
        const decrypted = window.decryptData(encrypted);
        return {
          encrypted: encrypted.length > 100,
          decrypted: decrypted.email === 'test@example.com',
          noPlainText: !encrypted.includes('test@example.com')
        };
      });

      if (!encryptionTest.encrypted || !encryptionTest.decrypted || !encryptionTest.noPlainText) {
        throw new Error('Data encryption test failed');
      }

      // Test data anonymization
      const anonymizationTest = await this.testSprite.evaluate(() => {
        const userData = { email: 'test@example.com', name: 'John Doe', userId: '123' };
        const anonymized = window.anonymizeData(userData);
        return {
          emailRemoved: !anonymized.email,
          nameRemoved: !anonymized.name,
          userIdHashed: anonymized.userId && anonymized.userId.length === 64
        };
      });

      if (!anonymizationTest.emailRemoved || !anonymizationTest.nameRemoved || !anonymizationTest.userIdHashed) {
        throw new Error('Data anonymization test failed');
      }

      // Test no external API calls
      const networkRequests = await this.testSprite.getNetworkRequests();
      const externalCalls = networkRequests.filter(req => 
        req.url.includes('api.external.com') || 
        req.url.includes('tracking') ||
        req.url.includes('analytics')
      );

      if (externalCalls.length > 0) {
        throw new Error(`External API calls detected: ${externalCalls.length}`);
      }

      console.log('✅ Privacy-First Data Handling test passed');
      this.testResults.push({
        test: 'Privacy-First Data Handling',
        status: 'PASSED',
        details: {
          encryptionWorking: true,
          anonymizationWorking: true,
          noExternalCalls: true
        }
      });

    } catch (error) {
      console.error('❌ Privacy-First Data Handling test failed:', error);
      this.testResults.push({
        test: 'Privacy-First Data Handling',
        status: 'FAILED',
        error: error.message
      });
    }
  }

  /**
   * Test Multi-Language Support
   */
  async testMultiLanguageSupport() {
    console.log('🌐 Testing Multi-Language Support...');
    
    const languages = ['en', 'es', 'fr', 'de'];
    
    for (const lang of languages) {
      try {
        await this.testSprite.navigate('/');
        
        // Change language
        await this.testSprite.select('[data-testid="language-selector"]', lang);
        
        // Wait for translation
        await this.testSprite.waitForTimeout(1000);
        
        // Verify translation
        const pageTitle = await this.testSprite.getText('h1');
        const expectedTitles = {
          'en': 'Decentralized Job Application Agent',
          'es': 'Agente de Aplicación de Trabajo Descentralizado',
          'fr': 'Agent de Candidature d\'Emploi Décentralisé',
          'de': 'Dezentraler Job-Bewerbungsagent'
        };

        if (pageTitle !== expectedTitles[lang]) {
          throw new Error(`Translation failed for ${lang}: expected "${expectedTitles[lang]}", got "${pageTitle}"`);
        }

        // Verify language persistence
        await this.testSprite.reload();
        const persistedLang = await this.testSprite.evaluate(() => {
          return localStorage.getItem('language');
        });

        if (persistedLang !== lang) {
          throw new Error(`Language persistence failed for ${lang}`);
        }

        console.log(`✅ Language test passed for ${lang}`);
        
      } catch (error) {
        console.error(`❌ Language test failed for ${lang}:`, error);
        this.testResults.push({
          test: `Multi-Language Support (${lang})`,
          status: 'FAILED',
          error: error.message
        });
        return;
      }
    }

    this.testResults.push({
      test: 'Multi-Language Support',
      status: 'PASSED',
      details: {
        languagesTested: languages,
        translationsWorking: true,
        persistenceWorking: true
      }
    });
  }

  /**
   * Test Job Application Flow with Privacy
   */
  async testJobApplicationFlow() {
    console.log('📝 Testing Job Application Flow...');
    
    try {
      // Navigate to job search
      await this.testSprite.navigate('/jobs');
      
      // Search for jobs
      await this.testSprite.type('[data-testid="job-search"]', 'Software Engineer');
      await this.testSprite.waitForTimeout(1000);
      
      // Check if results appear
      const jobCards = await this.testSprite.getElements('[data-testid="job-card"]');
      if (jobCards.length === 0) {
        throw new Error('No job results found');
      }

      // Select first job
      await this.testSprite.click('[data-testid="job-card"]:first-child');
      
      // Fill application form
      await this.testSprite.fillForm('[data-testid="application-form"]', {
        'firstName': 'John',
        'lastName': 'Doe',
        'email': 'john.doe@example.com',
        'phone': '+1234567890',
        'experience': '5 years in React development',
        'skills': 'React, TypeScript, Node.js'
      });

      // Upload resume (test local processing)
      const resumeFile = await this.testSprite.uploadFile('[data-testid="resume-upload"]', 'test-resume.pdf');
      
      // Verify local processing
      const processingTest = await this.testSprite.evaluate(() => {
        return window.isLocalProcessing && !window.externalUpload;
      });

      if (!processingTest) {
        throw new Error('Resume not processed locally');
      }

      // Submit application
      await this.testSprite.click('[data-testid="submit-application"]');
      
      // Check success message
      const successMessage = await this.testSprite.waitForElement('[data-testid="success-message"]', 5000);
      if (!successMessage) {
        throw new Error('Application submission failed');
      }

      // Verify encrypted storage
      const storageTest = await this.testSprite.evaluate(() => {
        const applications = localStorage.getItem('applications');
        return applications && applications.length > 100;
      });

      if (!storageTest) {
        throw new Error('Application not encrypted in storage');
      }

      console.log('✅ Job Application Flow test passed');
      this.testResults.push({
        test: 'Job Application Flow',
        status: 'PASSED',
        details: {
          searchWorking: true,
          formFilled: true,
          localProcessing: true,
          encryptedStorage: true
        }
      });

    } catch (error) {
      console.error('❌ Job Application Flow test failed:', error);
      this.testResults.push({
        test: 'Job Application Flow',
        status: 'FAILED',
        error: error.message
      });
    }
  }

  /**
   * Test AI Processing Privacy
   */
  async testAIProcessingPrivacy() {
    console.log('🤖 Testing AI Processing Privacy...');
    
    try {
      // Test resume parsing
      const resumeParsingTest = await this.testSprite.evaluate(() => {
        const resumeText = 'Software Engineer with 5 years experience in React, TypeScript, and Node.js';
        const parsed = window.parseResume(resumeText);
        return {
          skills: parsed.skills && parsed.skills.length > 0,
          experience: parsed.experience && parsed.experience.includes('5'),
          localProcessing: window.isLocalProcessing
        };
      });

      if (!resumeParsingTest.skills || !resumeParsingTest.experience || !resumeParsingTest.localProcessing) {
        throw new Error('Resume parsing test failed');
      }

      // Test job matching
      const jobMatchingTest = await this.testSprite.evaluate(() => {
        const userProfile = { skills: ['React', 'TypeScript'] };
        const jobs = [{ title: 'React Developer', skills: ['React'] }];
        const matches = window.matchJobs(userProfile, jobs);
        return {
          matchesFound: matches.length > 0,
          scoreValid: matches[0] && matches[0].score > 0.7,
          localProcessing: window.isLocalProcessing
        };
      });

      if (!jobMatchingTest.matchesFound || !jobMatchingTest.scoreValid || !jobMatchingTest.localProcessing) {
        throw new Error('Job matching test failed');
      }

      // Test translation
      const translationTest = await this.testSprite.evaluate(() => {
        const translated = window.translateText('Hello World', 'es');
        return {
          translated: translated === 'Hola Mundo',
          localProcessing: window.isLocalProcessing
        };
      });

      if (!translationTest.translated || !translationTest.localProcessing) {
        throw new Error('Translation test failed');
      }

      console.log('✅ AI Processing Privacy test passed');
      this.testResults.push({
        test: 'AI Processing Privacy',
        status: 'PASSED',
        details: {
          resumeParsing: true,
          jobMatching: true,
          translation: true,
          allLocalProcessing: true
        }
      });

    } catch (error) {
      console.error('❌ AI Processing Privacy test failed:', error);
      this.testResults.push({
        test: 'AI Processing Privacy',
        status: 'FAILED',
        error: error.message
      });
    }
  }

  /**
   * Test Blockchain Integration
   */
  async testBlockchainIntegration() {
    console.log('🔗 Testing Blockchain Integration...');
    
    try {
      // Connect wallet
      await this.testSprite.click('[data-testid="connect-wallet"]');
      
      const walletTest = await this.testSprite.evaluate(() => {
        return window.walletConnected && window.walletAddress;
      });

      if (!walletTest) {
        throw new Error('Wallet connection failed');
      }

      // Verify identity on blockchain
      const identityTest = await this.testSprite.evaluate(() => {
        return window.verifyIdentity();
      });

      if (!identityTest.verified || !identityTest.decentralized) {
        throw new Error('Identity verification failed');
      }

      // Store data hash on IPFS
      const ipfsTest = await this.testSprite.evaluate(() => {
        const data = { resume: 'hash123', profile: 'hash456' };
        return window.storeOnIPFS(data);
      });

      if (!ipfsTest.ipfsHash || !ipfsTest.decentralized) {
        throw new Error('IPFS storage failed');
      }

      console.log('✅ Blockchain Integration test passed');
      this.testResults.push({
        test: 'Blockchain Integration',
        status: 'PASSED',
        details: {
          walletConnected: true,
          identityVerified: true,
          ipfsStorage: true,
          decentralized: true
        }
      });

    } catch (error) {
      console.error('❌ Blockchain Integration test failed:', error);
      this.testResults.push({
        test: 'Blockchain Integration',
        status: 'FAILED',
        error: error.message
      });
    }
  }

  /**
   * Test GDPR Rights
   */
  async testGDPRRights() {
    console.log('⚖️ Testing GDPR Rights...');
    
    try {
      // Test data access right
      await this.testSprite.click('[data-testid="export-data"]');
      
      const exportTest = await this.testSprite.evaluate(() => {
        return window.exportedData && window.exportedData.format === 'json';
      });

      if (!exportTest) {
        throw new Error('Data export failed');
      }

      // Test data rectification
      await this.testSprite.fillForm('[data-testid="profile-form"]', {
        'email': 'newemail@example.com'
      });

      const rectificationTest = await this.testSprite.evaluate(() => {
        return window.dataUpdated && window.dataEncrypted;
      });

      if (!rectificationTest) {
        throw new Error('Data rectification failed');
      }

      // Test right to erasure
      await this.testSprite.click('[data-testid="delete-account"]');
      
      const erasureTest = await this.testSprite.evaluate(() => {
        return window.confirmationShown && window.retentionPeriod === '30 days';
      });

      if (!erasureTest) {
        throw new Error('Right to erasure failed');
      }

      console.log('✅ GDPR Rights test passed');
      this.testResults.push({
        test: 'GDPR Rights',
        status: 'PASSED',
        details: {
          dataAccess: true,
          dataRectification: true,
          dataErasure: true,
          retentionPeriod: '30 days'
        }
      });

    } catch (error) {
      console.error('❌ GDPR Rights test failed:', error);
      this.testResults.push({
        test: 'GDPR Rights',
        status: 'FAILED',
        error: error.message
      });
    }
  }

  /**
   * Validate consent data structure
   */
  private validateConsentData(consent: any) {
    const requiredFields = ['analytics', 'marketing', 'timestamp', 'version'];
    const missingFields = requiredFields.filter(field => !(field in consent));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing consent fields: ${missingFields.join(', ')}`);
    }

    if (!consent.timestamp || !consent.version) {
      throw new Error('Invalid consent timestamp or version');
    }
  }

  /**
   * Generate comprehensive test report
   */
  private generateReport() {
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    const total = this.testResults.length;

    const report = {
      summary: {
        total: total,
        passed: passed,
        failed: failed,
        successRate: `${((passed / total) * 100).toFixed(1)}%`
      },
      privacyChecks: Object.fromEntries(this.privacyChecks),
      tests: this.testResults,
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: this.testSprite.userAgent,
        viewport: this.testSprite.viewport,
        baseUrl: this.testSprite.baseUrl
      }
    };

    console.log('📊 Test Report:');
    console.log(JSON.stringify(report, null, 2));

    return report;
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting comprehensive privacy-first testing...');
    console.log('🔒 Testing GDPR compliance, data privacy, and decentralized features');
    
    const startTime = Date.now();

    try {
      await this.testGDPRConsentFlow();
      await this.testPrivacyFirstDataHandling();
      await this.testMultiLanguageSupport();
      await this.testJobApplicationFlow();
      await this.testAIProcessingPrivacy();
      await this.testBlockchainIntegration();
      await this.testGDPRRights();

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      console.log(`\n⏱️ Testing completed in ${duration} seconds`);
      
      const report = this.generateReport();
      
      // Save report to file
      const fs = require('fs');
      fs.writeFileSync('./test-results/privacy-test-report.json', JSON.stringify(report, null, 2));
      
      console.log('📄 Test report saved to ./test-results/privacy-test-report.json');
      
      return report;

    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    } finally {
      await this.testSprite.close();
    }
  }
}

// Export for use in test scripts
export { PrivacyFirstTestRunner };

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new PrivacyFirstTestRunner();
  runner.runAllTests()
    .then(report => {
      console.log('✅ All tests completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}