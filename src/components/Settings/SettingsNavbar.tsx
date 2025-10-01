import { RefObject, useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import useModalStore from 'stores/modalStore';
import { useSettingsStore } from 'stores/settingsStore';

import { logout } from 'services/auth';

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

const handleSignOut = () => {
  logout().then(() => {
    toast.success('Successfully signed out');
    // Navigate to login page
    const event = new CustomEvent('custom-navigation', {
      detail: { url: '/auth/login', replace: true },
    });
    window.dispatchEvent(event);
  }).catch(() => {
    toast.error('Failed to sign out. Please try again.');
  });
};

const SettingsNavbar = ({ sectionRefs }: { sectionRefs: RefObject<{ [key: string]: HTMLElement | null }>; }) => {
  const [activeSection, setActiveSection] = useState('general');

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const updateVisibility = useModalStore((state) => state.updateVisibility);

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
  }, [sectionRefs]);

  return (
    <div className='lg:col-span-1'>
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 border shadow-sm sticky top-28`}>
        <h4 className='font-semibold mb-4'>Settings Categories</h4>
        <nav className='space-y-2'>
          {settingsCategories.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${activeSection === id
                ? 'bg-primary-500 text-white'
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
  );
};

export default SettingsNavbar;