import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';
import useModalStore from 'stores/modalStore';
import { useSettingsStore } from 'stores/settingsStore';

import { logout } from 'services/auth';

import ActiveStatus from 'components/Profile/ActiveStatus';

import CameraIcon from 'icons/CameraIcon';

const ProfileInfoCard = () => {
  const firstName = useProfileStore((state) => state.data?.first_name);
  const lastName = useProfileStore((state) => state.data?.last_name);
  const email = useProfileStore((state) => state.data?.email);
  const avatarUrl = useProfileStore((state) => state.data?.avatar_url);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const navigate = useNavigate();

  const userInitial = firstName?.[0] || 'U';
  const userName = firstName && lastName ? `${firstName} ${lastName}` : 'User';
  const userEmail = email || 'No email provided';

  const handleOpenModal = () => {
    updateVisibility({
      modalType: 'updateProfilePictureModal',
      isVisible: true,
    });
  };

  const handleLogout = () => {
    updateVisibility({
      modalType: 'signOutModal',
      isVisible: true,
      extraProps: {
        onSuccess: () => {
          logout().then((res) => {
            toast.success(res?.message || 'Successfully signed out');
            clearProfile();
            navigate('/auth/login');
          }).catch((err) => {
            toast.error(err?.error || 'Failed to sign out. Please try again.');
          });
        },
      },
    });
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='text-center'>
        <div className='relative inline-block mb-4'>
          <div className='w-30 h-30 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden'>
            {avatarUrl ? (
              <div className='w-full h-full'>
                <img
                  src={avatarUrl}
                  alt={`${userName} profile picture`}
                  className='w-full h-full object-cover min-w-full min-h-full'
                  style={{ objectPosition: 'center' }}
                />
              </div>
            ) : userInitial}
          </div>
          <button
            onClick={handleOpenModal}
            className='absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors'
            aria-label='Edit profile picture'
          >
            <CameraIcon />
          </button>
        </div>
        <h4 className='text-xl font-bold mb-1'>{userName}</h4>
        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {userEmail}
        </p>
        <ActiveStatus />
        <div className='grid grid-cols-2 gap-4 text-center'>
          <div>
            <div className='text-2xl font-bold text-purple-500'>87</div>
            <div className='text-xs text-gray-500'>Days Active</div>
          </div>
          <div>
            <div className='text-2xl font-bold text-blue-500'>12</div>
            <div className='text-xs text-gray-500'>Day Streak</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={`mt-6 w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${darkMode
            ? 'text-red-400 hover:bg-red-900/30'
            : 'text-red-500 hover:bg-red-50'} transition-colors`}
        >
          <LogOut className='w-4 h-4' />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;