#!/usr/bin/env node

/**
 * TestSprite Test Execution Script
 * 
 * This script runs comprehensive tests for the decentralized job application agent
 * with detailed logging and privacy-focused testing.
 */

const { PrivacyFirstTestRunner } = require('./src/tests/TestSpriteRunner');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  console.log('\n' + '='.repeat(60));
  log(`🚀 ${title}`, 'bright');
  console.log('='.repeat(60));
}

function logSection(title) {
  console.log('\n' + '-'.repeat(40));
  log(`📋 ${title}`, 'blue');
  console.log('-'.repeat(40));
}

function logTest(testName, status, details = '') {
  const statusColor = status === 'PASSED' ? 'green' : 'red';
  const statusIcon = status === 'PASSED' ? '✅' : '❌';
  log(`${statusIcon} ${testName}: ${status}`, statusColor);
  if (details) {
    log(`   ${details}`, 'yellow');
  }
}

async function main() {
  logHeader('DECENTRALIZED JOB APPLICATION AGENT - TESTSPRITE TESTING');
  
  // Create test results directory
  const testResultsDir = path.join(__dirname, 'test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }

  // Environment check
  logSection('Environment Check');
  log('🔍 Checking test environment...', 'cyan');
  
  const envVars = {
    'NODE_ENV': process.env.NODE_ENV || 'development',
    'TEST_BASE_URL': process.env.TEST_BASE_URL || 'http://localhost:3000',
    'TEST_HEADLESS': process.env.TEST_HEADLESS || 'true'
  };

  Object.entries(envVars).forEach(([key, value]) => {
    log(`   ${key}: ${value}`, 'yellow');
  });

  // Check if application is running
  log('\n🔍 Checking if application is accessible...', 'cyan');
  try {
    const response = await fetch(envVars.TEST_BASE_URL);
    if (response.ok) {
      log('✅ Application is accessible', 'green');
    } else {
      log('⚠️ Application returned non-200 status', 'yellow');
    }
  } catch (error) {
    log('❌ Application is not accessible', 'red');
    log(`   Error: ${error.message}`, 'red');
    log('   Please start the application before running tests', 'yellow');
    process.exit(1);
  }

  // Initialize test runner
  logSection('Test Runner Initialization');
  log('🔧 Initializing TestSprite runner...', 'cyan');
  
  const runner = new PrivacyFirstTestRunner();
  
  // Test execution
  logSection('Test Execution');
  log('🧪 Starting comprehensive privacy-first testing...', 'cyan');
  
  const startTime = Date.now();
  
  try {
    const report = await runner.runAllTests();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Results summary
    logSection('Test Results Summary');
    
    const { summary, privacyChecks, tests } = report;
    
    log(`📊 Total Tests: ${summary.total}`, 'bright');
    log(`✅ Passed: ${summary.passed}`, 'green');
    log(`❌ Failed: ${summary.failed}`, 'red');
    log(`📈 Success Rate: ${summary.successRate}`, 'bright');
    log(`⏱️ Duration: ${duration} seconds`, 'bright');
    
    // Privacy checks
    log('\n🔒 Privacy Checks:', 'cyan');
    Object.entries(privacyChecks).forEach(([check, passed]) => {
      const status = passed ? '✅' : '❌';
      const color = passed ? 'green' : 'red';
      log(`   ${status} ${check}: ${passed ? 'PASSED' : 'FAILED'}`, color);
    });
    
    // Detailed test results
    log('\n📋 Detailed Test Results:', 'cyan');
    tests.forEach(test => {
      logTest(test.test, test.status, test.error || test.details);
    });
    
    // Generate HTML report
    logSection('Report Generation');
    log('📄 Generating HTML report...', 'cyan');
    
    const htmlReport = generateHTMLReport(report);
    const htmlPath = path.join(testResultsDir, 'privacy-test-report.html');
    fs.writeFileSync(htmlPath, htmlReport);
    
    log(`✅ HTML report saved to: ${htmlPath}`, 'green');
    
    // Save JSON report
    const jsonPath = path.join(testResultsDir, 'privacy-test-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    log(`✅ JSON report saved to: ${jsonPath}`, 'green');
    
    // Final status
    logSection('Final Status');
    if (summary.failed === 0) {
      log('🎉 ALL TESTS PASSED!', 'green');
      log('🔒 Privacy compliance verified', 'green');
      log('🌐 Multi-language support working', 'green');
      log('🤖 Local AI processing confirmed', 'green');
      log('🔗 Blockchain integration active', 'green');
      log('⚖️ GDPR rights implemented', 'green');
    } else {
      log(`⚠️ ${summary.failed} test(s) failed`, 'yellow');
      log('Please review the detailed results above', 'yellow');
    }
    
    process.exit(summary.failed === 0 ? 0 : 1);
    
  } catch (error) {
    logSection('Test Execution Error');
    log('❌ Test execution failed:', 'red');
    log(`   Error: ${error.message}`, 'red');
    log('   Stack trace:', 'red');
    console.error(error.stack);
    process.exit(1);
  }
}

function generateHTMLReport(report) {
  const { summary, privacyChecks, tests, timestamp, environment } = report;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy-First Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8fafc;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #374151;
        }
        .summary-card .value {
            font-size: 2em;
            font-weight: bold;
        }
        .passed { color: #10b981; }
        .failed { color: #ef4444; }
        .tests {
            padding: 30px;
        }
        .test-item {
            background: white;
            margin: 10px 0;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #e5e7eb;
        }
        .test-item.passed {
            border-left-color: #10b981;
        }
        .test-item.failed {
            border-left-color: #ef4444;
        }
        .test-name {
            font-weight: bold;
            margin-bottom: 10px;
        }
        .test-status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.875em;
            font-weight: 500;
        }
        .test-status.passed {
            background: #d1fae5;
            color: #065f46;
        }
        .test-status.failed {
            background: #fee2e2;
            color: #991b1b;
        }
        .privacy-checks {
            padding: 30px;
            background: #f0f9ff;
        }
        .privacy-check {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        .privacy-check .status {
            margin-right: 10px;
            font-size: 1.2em;
        }
        .footer {
            padding: 20px 30px;
            background: #f8fafc;
            text-align: center;
            color: #6b7280;
            font-size: 0.875em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Privacy-First Test Report</h1>
            <p>Decentralized Job Application Agent - Comprehensive Testing Results</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Total Tests</h3>
                <div class="value">${summary.total}</div>
            </div>
            <div class="summary-card">
                <h3>Passed</h3>
                <div class="value passed">${summary.passed}</div>
            </div>
            <div class="summary-card">
                <h3>Failed</h3>
                <div class="value failed">${summary.failed}</div>
            </div>
            <div class="summary-card">
                <h3>Success Rate</h3>
                <div class="value">${summary.successRate}</div>
            </div>
        </div>
        
        <div class="privacy-checks">
            <h2>🔒 Privacy Checks</h2>
            ${Object.entries(privacyChecks).map(([check, passed]) => `
                <div class="privacy-check">
                    <span class="status">${passed ? '✅' : '❌'}</span>
                    <span>${check}: ${passed ? 'PASSED' : 'FAILED'}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="tests">
            <h2>📋 Test Results</h2>
            ${tests.map(test => `
                <div class="test-item ${test.status.toLowerCase()}">
                    <div class="test-name">${test.test}</div>
                    <span class="test-status ${test.status.toLowerCase()}">${test.status}</span>
                    ${test.error ? `<p style="color: #ef4444; margin-top: 10px;">${test.error}</p>` : ''}
                    ${test.details ? `<p style="color: #6b7280; margin-top: 10px;">${JSON.stringify(test.details)}</p>` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <p>Report generated on ${new Date(timestamp).toLocaleString()}</p>
            <p>Environment: ${environment.baseUrl} | User Agent: ${environment.userAgent}</p>
        </div>
    </div>
</body>
</html>
  `;
}

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { main, generateHTMLReport };