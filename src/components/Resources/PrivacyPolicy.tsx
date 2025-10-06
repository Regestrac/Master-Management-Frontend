import React, { useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Mail } from 'lucide-react';

import { useSettingsStore } from 'stores/settingsStore';

const PrivacyPolicy: React.FC = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm fixed top-0 left-0 right-0 z-50`}>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={handleBack}
                className={`flex items-center space-x-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                aria-label='Go back'
              >
                <ArrowLeft className='w-5 h-5' />
                <span>Back</span>
              </button>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                <Shield className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold'>Privacy Policy</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Master Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className='max-w-4xl mx-auto px-6 pt-24 pb-8'>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-8 border shadow-sm`}>
          {/* Last Updated */}
          <div className='mb-8'>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last updated: January 1, 2025
            </p>
          </div>

          {/* Introduction */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4 flex items-center'>
              <Shield className='w-6 h-6 mr-3 text-purple-500' />
              Your Privacy Matters
            </h2>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              This Privacy Policy explains how Master Management ("we", "our", or "us") collects, uses, discloses, and safeguards your information when you use our platform and services. By using our services, you consent to the practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Information We Collect</h2>
            <ul className={`list-disc pl-6 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Account information (name, email, password)</li>
              <li>Workspace and content data you provide (tasks, goals, notes)</li>
              <li>Usage data (interactions, feature usage, device information)</li>
              <li>Cookies and similar technologies for session and analytics</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>How We Use Your Information</h2>
            <ul className={`list-disc pl-6 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>To provide, maintain, and improve our services</li>
              <li>To personalize your experience and recommendations</li>
              <li>To communicate updates, security alerts, and support</li>
              <li>To analyze usage and improve product performance</li>
            </ul>
          </section>

          {/* Sharing and Disclosure */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Sharing and Disclosure</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              We do not sell your personal information. We may share data with:
            </p>
            <ul className={`list-disc pl-6 mt-2 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Service providers who assist in operations (under contractual obligations)</li>
              <li>Authorities when required by law</li>
              <li>Other users when you explicitly share or collaborate</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Data Retention</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data, subject to legal and operational requirements.
            </p>
          </section>

          {/* Security */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Security</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              We implement industry-standard safeguards to protect your information. However, no method of transmission or storage is 100% secure; use the service at your own risk.
            </p>
          </section>

          {/* Your Rights */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Your Rights and Choices</h2>
            <ul className={`list-disc pl-6 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Access, update, or delete your data</li>
              <li>Export your data where supported</li>
              <li>Manage cookie preferences via your browser settings</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Children's Privacy</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Our services are not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with information, contact us to remove it.
            </p>
          </section>

          {/* Contact */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4 flex items-center'>
              <Mail className='w-6 h-6 mr-3 text-purple-500' />
              Contact Us
            </h2>
            <div className={`mt-2 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className='font-medium'>Master Management</p>
              <p>Email: privacy@mastermanagement.com</p>
              <p>Address: 123 Productivity Street, Tech City, TC 12345</p>
            </div>
          </section>

          {/* Agreement */}
          <section className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              By using Master Management, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className={`mt-8 text-center space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className='text-sm'>
            <Link to='/legal/terms' className='text-purple-500 hover:text-purple-400 transition-colors'>
              Terms of Service
            </Link>
            {' • '}
            <Link to='/support' className='text-purple-500 hover:text-purple-400 transition-colors'>
              Support
            </Link>
          </p>
          <p className='text-xs'>
            © 2025 Master Management. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
