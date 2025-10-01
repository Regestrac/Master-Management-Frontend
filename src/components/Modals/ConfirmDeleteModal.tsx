import { useState } from 'react';

import clsx from 'clsx';
import { AlertTriangle } from 'lucide-react';

import useModalStore from 'stores/modalStore';
import { useSettingsStore } from 'stores/settingsStore';

import ModalWrapper from 'components/Modals/ModalWrapper';

const ConfirmDeleteModal = () => {
  const [loading, setLoading] = useState(false);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const { onSuccess, title, description } = useModalStore((state) => state.modals.confirmDeleteModal.extraProps || {});
  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const handleCancel = () => updateVisibility({ modalType: 'confirmDeleteModal', isVisible: false });

  const handleConfirm = () => {
    if (!onSuccess) {
      handleCancel();
      return;
    }
    setLoading(true);
    Promise.resolve(onSuccess()).finally(() => { // supports sync/async
      setLoading(false);
      handleCancel();
    });
  };

  return (
    <ModalWrapper modalType='confirmDeleteModal'>
      <div className='flex flex-col items-center text-center gap-4'>
        <div className={clsx('p-3 rounded-full', darkMode ? 'bg-red-900/30' : 'bg-red-100')}>
          <AlertTriangle className={clsx('w-6 h-6', darkMode ? 'text-red-400' : 'text-red-600')} />
        </div>
        <h3 className={clsx('text-xl font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
          {title || 'Confirm Deletion'}
        </h3>
        <p className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
          {description || 'Are you sure you want to delete this item?'}
        </p>
      </div>

      <div className='flex justify-end gap-3 mt-10'>
        <button
          type='button'
          onClick={handleCancel}
          className={clsx('px-4 py-2 text-sm font-medium rounded', darkMode
            ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50')}
        >
          Cancel
        </button>
        <button
          type='button'
          disabled={loading}
          onClick={handleConfirm}
          className={clsx('px-4 py-2 text-sm font-medium text-white rounded shadow', darkMode
            ? 'bg-red-700 hover:bg-red-800'
            : 'bg-red-600 hover:bg-red-700')}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmDeleteModal;
