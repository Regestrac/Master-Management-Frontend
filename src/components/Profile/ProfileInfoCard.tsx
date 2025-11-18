import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut, X, Loader2 } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';
import useModalStore from 'stores/modalStore';
import { useSettingsStore } from 'stores/settingsStore';

import { logout } from 'services/auth';
import { updateProfile } from 'services/profile';

import CameraIcon from 'icons/CameraIcon';

const ProfileInfoCard = () => {
  const user = useProfileStore((state) => state.data);
  const updateProfileInfo = useProfileStore((state) => state.updateProfile);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const updateVisibility = useModalStore((state) => state.updateVisibility);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const navigate = useNavigate();

  const userInitial = user?.first_name?.[0] || 'U';
  const userName = user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'User';
  const userEmail = user?.email || 'No email provided';

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);

    // Simple URL validation
    try {
      new URL(url);
      setPreviewUrl(url);
    } catch {
      setPreviewUrl('');
    }
  };

  const handleSaveImage = () => {
    if (!imageUrl) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setIsLoading(true);
    updateProfile({ avatar_url: imageUrl })
      .then((res) => {
        updateProfileInfo({ avatar_url: imageUrl });
        toast.success(res?.message || 'Profile picture updated successfully');
        setShowImageModal(false);
        setImageUrl('');
        setPreviewUrl('');
      })
      .catch((err) => {
        toast.error(err?.error || 'Failed to update profile picture');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOpenModal = () => {
    setImageUrl(user?.avatar_url || '');
    setPreviewUrl(user?.avatar_url || '');
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
    setImageUrl('');
    setPreviewUrl('');
  };

  const handleLogout = () => {
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

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='text-center'>
        <div className='relative inline-block mb-4'>
          <div className='w-30 h-30 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden'>
            {user?.avatar_url ? (
              <div className='w-full h-full'>
                <img
                  src={user.avatar_url}
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
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
          {userEmail}
        </p>
        <div className='flex items-center justify-center space-x-2 mb-4'>
          <div className='w-2 h-2 bg-green-500 rounded-full' />
          <span className='text-sm text-green-500'>Active</span>
        </div>
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
      {showImageModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-black/70' : 'bg-black/50'}`}>
          <div className={`relative w-full max-w-md rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold'>Update Profile Picture</h3>
              <button
                onClick={handleCloseModal}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                aria-label='Close'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='mb-4'>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Image URL
              </label>
              <input
                type='url'
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder='https://example.com/image.jpg'
                className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
              />
            </div>

            {previewUrl && (
              <div className='mb-4'>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Preview:</p>
                <div className='w-full aspect-square rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden'>
                  <div className='w-full h-full'>
                    <img
                      src={previewUrl}
                      alt='Profile preview'
                      className='w-full h-full object-cover min-w-full min-h-full'
                      style={{ objectPosition: 'center' }}
                      onError={(e) => {
                        e.currentTarget.src = '';
                        setPreviewUrl('');
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className='flex justify-end space-x-3 mt-6'>
              <button
                onClick={handleCloseModal}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} transition-colors`}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveImage}
                disabled={!previewUrl || isLoading}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${(!previewUrl || isLoading)
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Saving...</span>
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoCard;