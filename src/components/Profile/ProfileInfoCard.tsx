import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';
import useModalStore from 'stores/modalStore';

const ProfileInfoCard = () => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const navigate = useNavigate();
  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const handleLogout = () => {
    updateVisibility({
      modalType: 'signOutModal',
      isVisible: true,
      extraProps: {
        onSuccess: () => {
          clearProfile();
          navigate('/auth/login');
          toast.success('You have been logged out successfully');
        },
      },
    });
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='text-center'>
        <div className='relative inline-block mb-4'>
          <div className='w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
            A
          </div>
          <button className='absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
            </svg>
          </button>
        </div>
        <h4 className='text-xl font-bold mb-1'>Alex Johnson</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
          alex.johnson@example.com
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
          className={`mt-6 w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
            darkMode
              ? 'text-red-400 hover:bg-red-900/30'
              : 'text-red-500 hover:bg-red-50'
          } transition-colors`}
        >
          <LogOut className='w-4 h-4' />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;