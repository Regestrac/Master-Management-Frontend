import { useState, useEffect } from 'react';

import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import { useProfileStore } from 'stores/profileStore';
import { useSettingsStore } from 'stores/settingsStore';
import useModalStore from 'stores/modalStore';

import { updateProfile } from 'services/profile';

import ModalWrapper from './ModalWrapper';

const UpdateProfilePictureModal = () => {
  const { modals, updateVisibility } = useModalStore();
  const { updateProfilePictureModal } = modals;
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const currentAvatarUrl = useProfileStore((state) => state.data?.avatar_url);

  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    updateVisibility({
      modalType: 'updateProfilePictureModal',
      isVisible: false,
    });
  };

  useEffect(() => {
    if (updateProfilePictureModal.isVisible) {
      setImageUrl(currentAvatarUrl || '');
      setPreviewUrl(currentAvatarUrl || '');
    }
  }, [updateProfilePictureModal.isVisible, currentAvatarUrl]);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);

    try {
      new URL(url);
      setPreviewUrl(url);
    } catch {
      setPreviewUrl('');
    }
  };

  const handleSaveImage = async () => {
    if (!imageUrl) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateProfile({ avatar_url: imageUrl });
      useProfileStore.getState().updateProfile({ avatar_url: imageUrl });
      toast.success(res?.message || 'Profile picture updated successfully');
      handleClose();
    } catch (err: any) {
      toast.error(err?.error || 'Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  if (!updateProfilePictureModal.isVisible) {
    return null;
  }

  return (
    <ModalWrapper modalType='updateProfilePictureModal'>
      <div className={`relative w-full max-w-md rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold'>Update Profile Picture</h3>
          <button
            onClick={handleClose}
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            aria-label='Close'
            disabled={isLoading}
          >
            <span className='sr-only'>Close</span>
            <span aria-hidden>×</span>
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
            disabled={isLoading}
            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-70`}
          />
        </div>

        {previewUrl && (
          <div className='mb-4'>
            <p className={clsx('text-sm mb-2', darkMode ? 'text-gray-300' : 'text-gray-700')}>Preview:</p>
            <div className={clsx('w-full aspect-square rounded-lg border overflow-hidden', darkMode ? 'border-gray-600' : 'border-gray-200')}>
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
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} transition-colors disabled:opacity-70`}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveImage}
            disabled={!previewUrl || isLoading}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${!previewUrl || isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            {isLoading ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span>Saving...</span>
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default UpdateProfilePictureModal;
