import { RefObject, useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import useModalStore from 'stores/modalStore';
import { useSettingsStore } from 'stores/settingsStore';
import { useProfileStore } from 'stores/profileStore';

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

const SettingsNavbar = ({ sectionRefs }: { sectionRefs: RefObject<{ [key: string]: HTMLElement | null }>; }) => {
  const [activeSection, setActiveSection] = useState('general');

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const updateVisibility = useModalStore((state) => state.updateVisibility);
  const clearProfile = useProfileStore((state) => state.clearProfile);

  const navigate = useNavigate();

  // Open sign out modal
  const openSignOutModal = () => {
    updateVisibility({
      modalType: 'signOutModal',
      isVisible: true,
      extraProps: {
        onSuccess: () => {
          logout().then(() => {
            toast.success('Successfully signed out');
            clearProfile();
            navigate('/auth/login');
          }).catch(() => {
            toast.error('Failed to sign out. Please try again.');
          });
        },
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
      <div
        className={clsx(
          'rounded-xl p-4 border shadow-sm sticky top-28',
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        )}
      >
        <h4 className='font-semibold mb-4'>Settings Categories</h4>
        <nav className='space-y-2'>
          {settingsCategories.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={clsx(
                'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer',
                {
                  'bg-primary-500 text-white': activeSection === id,
                  'text-gray-300 hover:bg-gray-700': activeSection !== id && darkMode,
                  'text-gray-600 hover:bg-gray-100': activeSection !== id && !darkMode,
                },
              )}
            >
              <span className='text-lg'>{icon}</span>
              <span className='text-sm font-medium'>{label}</span>
            </button>
          ))}
        </nav>

        <div className={clsx('mt-6 pt-6 border-t', darkMode ? 'border-gray-700' : 'border-gray-200')}>
          <button
            onClick={openSignOutModal}
            className={clsx(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-500 transition-colors cursor-pointer',
              darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50',
            )}
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