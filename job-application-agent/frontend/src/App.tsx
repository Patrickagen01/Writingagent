import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Privacy and GDPR components
import { PrivacyProvider } from './contexts/PrivacyContext';
import { GDPRConsent } from './components/privacy/GDPRConsent';
import { PrivacyBanner } from './components/privacy/PrivacyBanner';

// Main components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Pages
import { Dashboard } from './pages/Dashboard';
import { JobSearch } from './pages/JobSearch';
import { ApplicationForm } from './pages/ApplicationForm';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Privacy } from './pages/Privacy';

// AI and Blockchain components
import { AIProvider } from './contexts/AIContext';
import { BlockchainProvider } from './contexts/BlockchainContext';

// Translation
import { useTranslation } from 'react-i18next';
import './i18n/config';

// Styles
import './styles/globals.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasGDPRConsent, setHasGDPRConsent] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Initialize app with privacy-first approach
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for existing GDPR consent
        const savedConsent = localStorage.getItem('gdpr-consent');
        if (savedConsent) {
          const consent = JSON.parse(savedConsent);
          setHasGDPRConsent(consent.granted);
        }

        // Set language based on user preference or browser
        const userLanguage = localStorage.getItem('language') || 
                           navigator.language.split('-')[0] || 
                           'en';
        setCurrentLanguage(userLanguage);
        await i18n.changeLanguage(userLanguage);

        // Initialize privacy settings
        if (process.env.NODE_ENV === 'development') {
          console.log('🔒 Privacy-first app initializing...');
          console.log('🌐 Language:', userLanguage);
          console.log('📊 GDPR Consent:', hasGDPRConsent);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [i18n, hasGDPRConsent]);

  // Handle GDPR consent
  const handleGDPRConsent = (consent: boolean) => {
    setHasGDPRConsent(consent);
    localStorage.setItem('gdpr-consent', JSON.stringify({
      granted: consent,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));
  };

  // Handle language change
  const handleLanguageChange = async (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    await i18n.changeLanguage(language);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <div className="ml-4 text-gray-600">
          <p className="text-lg font-semibold">{t('loading.initializing')}</p>
          <p className="text-sm text-gray-500">{t('loading.privacy')}</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <PrivacyProvider>
          <AIProvider>
            <BlockchainProvider>
              <Router>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                  {/* Privacy Banner */}
                  <PrivacyBanner />
                  
                  {/* GDPR Consent Modal */}
                  {!hasGDPRConsent && (
                    <GDPRConsent onConsent={handleGDPRConsent} />
                  )}

                  {/* Main App Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Header 
                        currentLanguage={currentLanguage}
                        onLanguageChange={handleLanguageChange}
                      />
                      
                      <main className="container mx-auto px-4 py-8">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/jobs" element={<JobSearch />} />
                          <Route path="/apply/:jobId" element={<ApplicationForm />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/privacy" element={<Privacy />} />
                        </Routes>
                      </main>
                      
                      <Footer />
                    </motion.div>
                  </AnimatePresence>

                  {/* Toast notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                      success: {
                        duration: 3000,
                        iconTheme: {
                          primary: '#10B981',
                          secondary: '#fff',
                        },
                      },
                      error: {
                        duration: 5000,
                        iconTheme: {
                          primary: '#EF4444',
                          secondary: '#fff',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </BlockchainProvider>
          </AIProvider>
        </PrivacyProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;