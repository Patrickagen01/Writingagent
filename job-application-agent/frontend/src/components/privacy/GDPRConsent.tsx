import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ShieldCheckIcon, EyeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface GDPRConsentProps {
  onConsent: (consent: boolean) => void;
}

export const GDPRConsent: React.FC<GDPRConsentProps> = ({ onConsent }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [consentSettings, setConsentSettings] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    dataSharing: false,
  });

  const handleAcceptAll = () => {
    setConsentSettings({
      essential: true,
      analytics: true,
      marketing: true,
      dataSharing: true,
    });
    onConsent(true);
  };

  const handleAcceptSelected = () => {
    onConsent(true);
  };

  const handleRejectAll = () => {
    setConsentSettings({
      essential: true,
      analytics: false,
      marketing: false,
      dataSharing: false,
    });
    onConsent(false);
  };

  const handleSettingChange = (setting: keyof typeof consentSettings) => {
    setConsentSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('gdpr.title')}
                </h2>
                <p className="text-sm text-gray-600">
                  {t('gdpr.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={() => onConsent(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                {t('gdpr.description')}
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <LockClosedIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-2">
                      {t('gdpr.privacyFirst')}
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• {t('gdpr.localProcessing')}</li>
                      <li>• {t('gdpr.encryptedStorage')}</li>
                      <li>• {t('gdpr.userControl')}</li>
                      <li>• {t('gdpr.gdprCompliant')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Consent Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t('gdpr.essential.title')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('gdpr.essential.description')}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {t('gdpr.alwaysRequired')}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={consentSettings.analytics}
                    onChange={() => handleSettingChange('analytics')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t('gdpr.analytics.title')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('gdpr.analytics.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={consentSettings.marketing}
                    onChange={() => handleSettingChange('marketing')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t('gdpr.marketing.title')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('gdpr.marketing.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="dataSharing"
                    checked={consentSettings.dataSharing}
                    onChange={() => handleSettingChange('dataSharing')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t('gdpr.dataSharing.title')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('gdpr.dataSharing.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium mt-4"
            >
              <EyeIcon className="h-4 w-4" />
              <span>{showDetails ? t('gdpr.hideDetails') : t('gdpr.showDetails')}</span>
            </button>

            {/* Detailed Information */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900 mb-3">
                    {t('gdpr.detailedInfo.title')}
                  </h4>
                  <div className="text-sm text-gray-700 space-y-3">
                    <p>{t('gdpr.detailedInfo.dataProcessing')}</p>
                    <p>{t('gdpr.detailedInfo.dataStorage')}</p>
                    <p>{t('gdpr.detailedInfo.userRights')}</p>
                    <p>{t('gdpr.detailedInfo.contact')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleRejectAll}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              {t('gdpr.rejectAll')}
            </button>
            <button
              onClick={handleAcceptSelected}
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              {t('gdpr.acceptSelected')}
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              {t('gdpr.acceptAll')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};