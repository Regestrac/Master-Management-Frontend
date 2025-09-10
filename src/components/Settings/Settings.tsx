import { useState, useEffect, useRef } from 'react';

import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import clsx from 'clsx';

import { useProfileStore } from 'stores/profileStore';
import useModalStore from 'stores/modalStore';

import { logout } from 'services/auth';

import GeneralSettings from 'components/Settings/GeneralSettings';
import AppearanceSettings from 'components/Settings/AppearanceSettings';
import ProductivitySettings from 'components/Settings/ProductivitySettings';
import DataAndStorageSettings from 'components/Settings/DataAndStorageSettings';
import AdvancedSettings from 'components/Settings/AdvancedSettings';
import AboutSection from 'components/Settings/AboutSection';
import NotificationSettings from 'components/Settings/NotificationSettings';
import PrivacyAndSecurity from 'components/Settings/PrivacyAndSecurity';
import Integrations from 'components/Settings/Integrations';

const settingsCategories = [
  { id: 'general', icon: '⚙️', label: 'General' },
  { id: 'appearance', icon: '🎨', label: 'Appearance' },
  { id: 'productivity', icon: '⚡', label: 'Productivity' },
  { id: 'notifications', icon: '🔔', label: 'Notifications' },
  { id: 'data', icon: '💾', label: 'Data & Storage' },
  { id: 'privacy', icon: '🔒', label: 'Privacy & Security' },
  { id: 'integrations', icon: '🔗', label: 'Integrations' },
  { id: 'advanced', icon: '🔧', label: 'Advanced' },
  { id: 'about', icon: 'ℹ️', label: 'About' },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const methods = useForm();

  // Handle sign out
  const handleSignOut = () => {
    logout()
      .then(() => {
        toast.success('Successfully signed out');
        // Navigate to login page
        const event = new CustomEvent('custom-navigation', {
          detail: { url: '/auth/login', replace: true },
        });
        window.dispatchEvent(event);
      })
      .catch(() => {
        toast.error('Failed to sign out. Please try again.');
      });
  };

  // Open sign out modal
  const openSignOutModal = () => {
    updateVisibility({
      modalType: 'signOutModal',
      isVisible: true,
      extraProps: {
        onSuccess: handleSignOut,
      },
    });
  };

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 130; // Offset for fixed header
      for (const category of settingsCategories) {
        const element = sectionRefs.current[category.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const headerOffset = 120; // Account for fixed header height + padding
      const elementPosition = element.offsetTop - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  // Set section ref
  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div>
      {/* Settings Header - Fixed */}
      <div className={clsx('fixed top-0 left-70 right-0 z-50 border-b px-6 py-4', darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200')}>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
          <div>
            <h3 className='text-2xl font-bold mb-2'>Settings & Configuration</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Customize your TaskFlow Pro experience and manage system settings
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <button className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
              </svg>
              <span>Reset to Defaults</span>
            </button>
            <button className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
              <span>Save All Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content with top margin to account for fixed header */}
      <div className='mt-24 px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Settings Navigation */}
          <div className='lg:col-span-1'>
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 border shadow-sm sticky top-28`}>
              <h4 className='font-semibold mb-4'>Settings Categories</h4>
              <nav className='space-y-2'>
                {settingsCategories.map(({ id, icon, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${activeSection === id
                      ? 'bg-purple-500 text-white'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <span className='text-lg'>{icon}</span>
                    <span className='text-sm font-medium'>{label}</span>
                  </button>
                ))}
              </nav>

              <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
                <button
                  onClick={openSignOutModal}
                  className='w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer'
                >
                  <span className='text-lg'>🚪</span>
                  <span className='text-sm font-medium'>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className='lg:col-span-3 space-y-8'>
            <FormProvider {...methods}>
              <div ref={setSectionRef('general')}>
                <GeneralSettings />
              </div>

              <div ref={setSectionRef('appearance')}>
                <AppearanceSettings />
              </div>

              <div ref={setSectionRef('productivity')}>
                <ProductivitySettings />
              </div>

              <div ref={setSectionRef('notifications')}>
                <NotificationSettings />
              </div>

              <div ref={setSectionRef('data')}>
                <DataAndStorageSettings />
              </div>

              <div ref={setSectionRef('privacy')}>
                <PrivacyAndSecurity />
              </div>

              <div ref={setSectionRef('integrations')}>
                <Integrations />
              </div>

              <div ref={setSectionRef('advanced')}>
                <AdvancedSettings />
              </div>

              <div ref={setSectionRef('about')}>
                <AboutSection />
              </div>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
