import React, { useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Users, Mail } from 'lucide-react';

import { useSettingsStore } from 'stores/settingsStore';

const TermsOfService: React.FC = () => {
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
                <FileText className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold'>Terms of Service</h1>
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
              <FileText className='w-6 h-6 mr-3 text-purple-500' />
              Introduction
            </h2>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Welcome to Master Management ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our productivity management platform and services. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4 flex items-center'>
              <Shield className='w-6 h-6 mr-3 text-green-500' />
              Acceptance of Terms
            </h2>
            <p className={`leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. These Terms constitute a legally binding agreement between you and Master Management.
            </p>
          </section>

          {/* Services Description */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4 flex items-center'>
              <Users className='w-6 h-6 mr-3 text-blue-500' />
              Services Description
            </h2>
            <p className={`leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Master Management provides a comprehensive productivity platform that includes:
            </p>
            <ul className={`list-disc pl-6 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Task management and organization tools</li>
              <li>Goal setting and progress tracking</li>
              <li>Workspace collaboration features</li>
              <li>Analytics and productivity insights</li>
              <li>Calendar integration and scheduling</li>
              <li>Focus session management</li>
              <li>Team collaboration tools</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>User Accounts</h2>
            <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>To access certain features of our services, you must create an account. You agree to:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain and update your account information as needed</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Take responsibility for all activities under your account</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use Policy */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Acceptable Use Policy</h2>
            <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>You agree not to use our services to:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Violate any laws, regulations, or third-party rights</li>
                <li>Upload or share malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services or servers</li>
                <li>Use our services for any fraudulent or illegal activities</li>
                <li>Share your account credentials with others</li>
                <li>Create fake or misleading content</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Intellectual Property</h2>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Master Management and its content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of the content you create using our services.
            </p>
          </section>

          {/* Privacy and Data */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Privacy and Data</h2>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to the collection and use of your information as outlined in our Privacy Policy.
            </p>
          </section>

          {/* Subscription and Billing */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Subscription and Billing</h2>
            <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>Some features of Master Management require a paid subscription. By subscribing:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>You agree to pay all applicable fees</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>We reserve the right to change pricing with notice</li>
                <li>Refunds are provided according to our refund policy</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers and Limitations */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Disclaimers and Limitations</h2>
            <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>Our services are provided "as is" without warranties of any kind. We disclaim:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Warranties of merchantability, fitness for purpose, and non-infringement</li>
                <li>Guarantees of uninterrupted or error-free service</li>
                <li>Liability for indirect, incidental, or consequential damages</li>
                <li>Responsibility for third-party content or services</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Termination</h2>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              We may terminate or suspend your account at any time for violations of these Terms or for any other reason. You may also terminate your account at any time. Upon termination, your right to use our services ceases immediately.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Changes to Terms</h2>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through our platform. Your continued use of our services after changes become effective constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Governing Law</h2>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              These Terms are governed by and construed in accordance with the laws of the jurisdiction in which Master Management is incorporated, without regard to conflict of law principles.
            </p>
          </section>

          {/* Contact Information */}
          <section className='mb-8'>
            <h2 className='text-2xl font-bold mb-4 flex items-center'>
              <Mail className='w-6 h-6 mr-3 text-purple-500' />
              Contact Information
            </h2>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className='font-medium'>Master Management</p>
              <p>Email: legal@mastermanagement.com</p>
              <p>Address: 123 Productivity Street, Tech City, TC 12345</p>
            </div>
          </section>

          {/* Agreement */}
          <section className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              By using Master Management, you acknowledge that you have read these Terms of Service, understand them, and agree to be bound by them.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className={`mt-8 text-center space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className='text-sm'>
            <Link to='/privacy' className='text-purple-500 hover:text-purple-400 transition-colors'>
              Privacy Policy
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

export default TermsOfService;
