import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CryptoJS from 'crypto-js';

interface PrivacySettings {
  dataProcessing: boolean;
  dataStorage: boolean;
  dataSharing: boolean;
  cookies: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface PrivacyContextType {
  settings: PrivacySettings;
  updateSettings: (settings: Partial<PrivacySettings>) => void;
  encryptData: (data: any) => string;
  decryptData: (encryptedData: string) => any;
  anonymizeData: (data: any) => any;
  hasValidConsent: () => boolean;
  clearUserData: () => void;
  exportUserData: () => any;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

interface PrivacyProviderProps {
  children: ReactNode;
}

export const PrivacyProvider: React.FC<PrivacyProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<PrivacySettings>({
    dataProcessing: false,
    dataStorage: false,
    dataSharing: false,
    cookies: false,
    analytics: false,
    marketing: false,
  });

  // Initialize privacy settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('privacy-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Failed to parse privacy settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('privacy-settings', JSON.stringify(settings));
  }, [settings]);

  // Update privacy settings
  const updateSettings = (newSettings: Partial<PrivacySettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  // Encrypt sensitive data
  const encryptData = (data: any): string => {
    const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key-32-chars-long';
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, encryptionKey).toString();
  };

  // Decrypt sensitive data
  const decryptData = (encryptedData: string): any => {
    const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key-32-chars-long';
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  };

  // Anonymize data for analytics
  const anonymizeData = (data: any): any => {
    const anonymized = { ...data };
    
    // Remove direct identifiers
    delete anonymized.email;
    delete anonymized.phone;
    delete anonymized.name;
    delete anonymized.address;
    delete anonymized.resume;
    delete anonymized.coverLetter;
    
    // Hash indirect identifiers
    if (anonymized.userId) {
      anonymized.userId = CryptoJS.SHA256(anonymized.userId).toString();
    }
    
    return anonymized;
  };

  // Check if user has valid consent
  const hasValidConsent = (): boolean => {
    const requiredConsents = ['dataProcessing', 'dataStorage'];
    return requiredConsents.every(consent => settings[consent as keyof PrivacySettings]);
  };

  // Clear all user data (GDPR right to erasure)
  const clearUserData = () => {
    // Clear localStorage
    localStorage.removeItem('user-data');
    localStorage.removeItem('applications');
    localStorage.removeItem('preferences');
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Reset privacy settings
    setSettings({
      dataProcessing: false,
      dataStorage: false,
      dataSharing: false,
      cookies: false,
      analytics: false,
      marketing: false,
    });
    
    console.log('🔒 All user data cleared (GDPR right to erasure)');
  };

  // Export user data (GDPR right to portability)
  const exportUserData = (): any => {
    const userData = {
      profile: localStorage.getItem('user-data') ? 
        decryptData(localStorage.getItem('user-data')!) : null,
      applications: localStorage.getItem('applications') ? 
        JSON.parse(localStorage.getItem('applications')!) : [],
      preferences: localStorage.getItem('preferences') ? 
        JSON.parse(localStorage.getItem('preferences')!) : {},
      privacySettings: settings,
      exportedAt: new Date().toISOString(),
      format: 'json',
      version: '1.0'
    };
    
    return userData;
  };

  const value: PrivacyContextType = {
    settings,
    updateSettings,
    encryptData,
    decryptData,
    anonymizeData,
    hasValidConsent,
    clearUserData,
    exportUserData,
  };

  return (
    <PrivacyContext.Provider value={value}>
      {children}
    </PrivacyContext.Provider>
  );
};

// Custom hook to use privacy context
export const usePrivacy = (): PrivacyContextType => {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};