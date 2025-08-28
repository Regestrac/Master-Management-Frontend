import { useState } from 'react';

import clsx from 'clsx';
import { LogOut, AlertTriangle } from 'lucide-react';

import useModalStore from 'stores/modalStore';
import { useProfileStore } from 'stores/profileStore';

import ModalWrapper from 'components/Modals/ModalWrapper';

const SignOutModal = () => {
  const [loading, setLoading] = useState(false);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const { onSuccess } = useModalStore((state) => state.modals.signOutModal.extraProps || {}) as { onSuccess?: () => void };
  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const handleCancel = () => updateVisibility({ modalType: 'signOutModal', isVisible: false });

  const handleConfirm = () => {
    if (!onSuccess) {
      handleCancel();
      return;
    }
    setLoading(true);
    Promise.resolve(onSuccess()).finally(() => {
      setLoading(false);
      handleCancel();
    });
  };

  return (
    <ModalWrapper modalType='signOutModal'>
      <div className='flex flex-col items-center text-center gap-4'>
        <div className={clsx('p-3 rounded-full', darkMode ? 'bg-red-900/30' : 'bg-red-100')}>
          <LogOut className={clsx('w-6 h-6', darkMode ? 'text-red-400' : 'text-red-600')} />
        </div>
        <h3 className={clsx('text-xl font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
          Sign Out
        </h3>
        <div className='space-y-2'>
          <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-700')}>
            Are you sure you want to sign out of your account?
          </p>
          <div className={clsx('flex items-center gap-2 p-3 rounded-lg text-sm', darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700')}>
            <AlertTriangle className='w-4 h-4 shrink-0' />
            <span>You will need to sign in again to access your account.</span>
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-3 mt-8'>
        <button
          type='button'
          onClick={handleCancel}
          disabled={loading}
          className={clsx('px-4 py-2 text-sm font-medium rounded', darkMode
            ? 'text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50'
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50')}
        >
          Cancel
        </button>
        <button
          type='button'
          disabled={loading}
          onClick={handleConfirm}
          className={clsx('px-4 py-2 text-sm font-medium text-white rounded shadow inline-flex items-center gap-2', darkMode
            ? 'bg-red-700 hover:bg-red-800 disabled:opacity-50'
            : 'bg-red-600 hover:bg-red-700 disabled:opacity-50')}
        >
          {loading ? (
            <>
              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              Signing Out...
            </>
          ) : (
            <>
              <LogOut className='w-4 h-4' />
              Sign Out
            </>
          )}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default SignOutModal;
