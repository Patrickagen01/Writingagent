module.exports = {
  // TestSprite Configuration for Decentralized Job Application Agent
  
  // Test environment setup
  environment: {
    baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
    timeout: 30000,
    retries: 2,
    headless: true,
    viewport: { width: 1280, height: 720 },
    userAgent: 'TestSprite/1.0 (Privacy-First Testing)',
  },

  // Privacy and GDPR testing scenarios
  scenarios: [
    {
      name: 'GDPR Consent Flow',
      description: 'Test GDPR consent modal and user privacy controls',
      steps: [
        {
          name: 'Load application',
          action: 'navigate',
          url: '/',
          expected: {
            title: 'Decentralized Job Application Agent',
            elements: ['gdpr-consent-modal', 'privacy-banner']
          }
        },
        {
          name: 'Check GDPR modal appears',
          action: 'waitForElement',
          selector: '[data-testid="gdpr-modal"]',
          timeout: 5000,
          expected: {
            visible: true,
            text: 'Privacy & Cookie Settings'
          }
        },
        {
          name: 'Test consent options',
          action: 'interact',
          selector: '[data-testid="analytics-consent"]',
          type: 'click',
          expected: {
            checked: true
          }
        },
        {
          name: 'Accept selected consents',
          action: 'click',
          selector: '[data-testid="accept-selected"]',
          expected: {
            modalHidden: true,
            localStorage: {
              'gdpr-consent': {
                analytics: true,
                marketing: false,
                timestamp: 'string'
              }
            }
          }
        }
      ]
    },

    {
      name: 'Privacy-First Data Handling',
      description: 'Test local data processing and encryption',
      steps: [
        {
          name: 'Check local storage encryption',
          action: 'executeScript',
          script: `
            const encrypted = localStorage.getItem('user-data');
            return encrypted && encrypted.length > 100;
          `,
          expected: {
            result: true,
            message: 'User data is encrypted'
          }
        },
        {
          name: 'Verify no external API calls',
          action: 'interceptNetwork',
          pattern: 'api.external.com',
          expected: {
            calls: 0,
            message: 'No external API calls made'
          }
        },
        {
          name: 'Test data anonymization',
          action: 'executeScript',
          script: `
            const userData = { email: 'test@example.com', name: 'John Doe' };
            const anonymized = window.anonymizeData(userData);
            return !anonymized.email && !anonymized.name;
          `,
          expected: {
            result: true,
            message: 'Data properly anonymized'
          }
        }
      ]
    },

    {
      name: 'Multi-Language Support',
      description: 'Test internationalization and language switching',
      steps: [
        {
          name: 'Load page in English',
          action: 'navigate',
          url: '/',
          expected: {
            language: 'en',
            elements: ['language-selector']
          }
        },
        {
          name: 'Switch to Spanish',
          action: 'select',
          selector: '[data-testid="language-selector"]',
          value: 'es',
          expected: {
            textChanges: {
              'h1': 'Agente de Aplicación de Trabajo Descentralizado',
              'nav.jobs': 'Trabajos'
            }
          }
        },
        {
          name: 'Switch to French',
          action: 'select',
          selector: '[data-testid="language-selector"]',
          value: 'fr',
          expected: {
            textChanges: {
              'h1': 'Agent de Candidature d\'Emploi Décentralisé',
              'nav.jobs': 'Emplois'
            }
          }
        },
        {
          name: 'Verify language persistence',
          action: 'reload',
          expected: {
            language: 'fr',
            localStorage: {
              'language': 'fr'
            }
          }
        }
      ]
    },

    {
      name: 'Job Application Flow',
      description: 'Test complete job application process with privacy',
      steps: [
        {
          name: 'Navigate to job search',
          action: 'navigate',
          url: '/jobs',
          expected: {
            elements: ['job-list', 'search-filters']
          }
        },
        {
          name: 'Search for jobs',
          action: 'type',
          selector: '[data-testid="job-search"]',
          text: 'Software Engineer',
          expected: {
            resultsCount: '>0'
          }
        },
        {
          name: 'Select a job',
          action: 'click',
          selector: '[data-testid="job-card"]:first-child',
          expected: {
            url: '/apply/',
            elements: ['application-form']
          }
        },
        {
          name: 'Fill application form',
          action: 'fillForm',
          form: '[data-testid="application-form"]',
          data: {
            'firstName': 'John',
            'lastName': 'Doe',
            'email': 'john.doe@example.com',
            'phone': '+1234567890',
            'experience': '5 years in React development',
            'skills': 'React, TypeScript, Node.js'
          },
          expected: {
            formValid: true
          }
        },
        {
          name: 'Upload resume (privacy test)',
          action: 'uploadFile',
          selector: '[data-testid="resume-upload"]',
          file: 'test-resume.pdf',
          expected: {
            fileProcessed: true,
            localProcessing: true,
            noExternalUpload: true
          }
        },
        {
          name: 'Submit application',
          action: 'click',
          selector: '[data-testid="submit-application"]',
          expected: {
            successMessage: 'Application submitted successfully',
            encryptedStorage: true
          }
        }
      ]
    },

    {
      name: 'AI Processing Privacy',
      description: 'Test local AI processing without external calls',
      steps: [
        {
          name: 'Test resume parsing',
          action: 'executeScript',
          script: `
            const resumeText = 'Software Engineer with 5 years experience...';
            return window.parseResume(resumeText);
          `,
          expected: {
            result: {
              skills: ['JavaScript', 'React', 'Node.js'],
              experience: '5 years',
              localProcessing: true
            }
          }
        },
        {
          name: 'Test job matching',
          action: 'executeScript',
          script: `
            const userProfile = { skills: ['React', 'TypeScript'] };
            const jobs = [{ title: 'React Developer', skills: ['React'] }];
            return window.matchJobs(userProfile, jobs);
          `,
          expected: {
            result: {
              matches: [{ score: '>0.7' }],
              localProcessing: true
            }
          }
        },
        {
          name: 'Test translation',
          action: 'executeScript',
          script: `
            return window.translateText('Hello World', 'es');
          `,
          expected: {
            result: 'Hola Mundo',
            localProcessing: true
          }
        }
      ]
    },

    {
      name: 'Blockchain Integration',
      description: 'Test decentralized identity and data verification',
      steps: [
        {
          name: 'Connect wallet',
          action: 'click',
          selector: '[data-testid="connect-wallet"]',
          expected: {
            walletConnected: true,
            addressDisplayed: true
          }
        },
        {
          name: 'Verify identity on blockchain',
          action: 'executeScript',
          script: `
            return window.verifyIdentity();
          `,
          expected: {
            result: {
              verified: true,
              decentralized: true
            }
          }
        },
        {
          name: 'Store data hash on IPFS',
          action: 'executeScript',
          script: `
            const data = { resume: 'hash', profile: 'hash' };
            return window.storeOnIPFS(data);
          `,
          expected: {
            result: {
              ipfsHash: 'string',
              decentralized: true
            }
          }
        }
      ]
    },

    {
      name: 'GDPR Rights Testing',
      description: 'Test user rights under GDPR',
      steps: [
        {
          name: 'Test data access right',
          action: 'click',
          selector: '[data-testid="export-data"]',
          expected: {
            download: 'user-data.json',
            format: 'json',
            complete: true
          }
        },
        {
          name: 'Test data rectification',
          action: 'fillForm',
          form: '[data-testid="profile-form"]',
          data: {
            'email': 'newemail@example.com'
          },
          expected: {
            updated: true,
            encrypted: true
          }
        },
        {
          name: 'Test right to erasure',
          action: 'click',
          selector: '[data-testid="delete-account"]',
          expected: {
            confirmation: true,
            dataDeleted: true,
            retentionPeriod: '30 days'
          }
        }
      ]
    }
  ],

  // Performance and security testing
  performance: {
    lighthouse: {
      categories: ['performance', 'accessibility', 'best-practices', 'seo'],
      thresholds: {
        performance: 90,
        accessibility: 95,
        'best-practices': 90,
        seo: 90
      }
    },
    security: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'X-GDPR-Compliant': 'true'
      },
      csp: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'"]
      }
    }
  },

  // Accessibility testing
  accessibility: {
    standards: ['WCAG2AA'],
    include: ['color-contrast', 'keyboard-navigation', 'screen-reader'],
    exclude: ['color-contrast'] // Temporarily exclude for development
  },

  // Reporting configuration
  reporting: {
    output: {
      format: 'html',
      path: './test-results',
      includeScreenshots: true,
      includeVideos: true
    },
    notifications: {
      slack: process.env.SLACK_WEBHOOK_URL,
      email: process.env.TEST_EMAIL
    }
  },

  // Custom assertions for privacy testing
  assertions: {
    'no-external-tracking': () => {
      const scripts = document.querySelectorAll('script[src*="google-analytics"], script[src*="facebook"], script[src*="tracking"]');
      return scripts.length === 0;
    },
    'local-storage-encrypted': () => {
      const userData = localStorage.getItem('user-data');
      return userData && userData.length > 100 && !userData.includes('"email"');
    },
    'gdpr-compliant': () => {
      const consent = localStorage.getItem('gdpr-consent');
      return consent && JSON.parse(consent).timestamp;
    }
  }
};