import { useState } from 'react';

import { AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

import useModalStore from 'stores/modalStore';
import { useProfileStore } from 'stores/profileStore';

import ModalWrapper from 'components/Modals/ModalWrapper';

const SwitchTaskModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskType = useModalStore((state) => state.modals.switchTaskModal.extraProps?.modalData?.taskType);
  const taskName = useModalStore((state) => state.modals.switchTaskModal.extraProps?.modalData?.taskName);

  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const handleConfirm = () => {
    setIsLoading(true);
    // handle actual switch logic here
  };

  const handleCancel = () => {
    updateVisibility({ modalType: 'switchTaskModal', isVisible: false });
  };

  return (
    <ModalWrapper modalType='switchTaskModal'>
      {/* Header */}
      <div className='flex items-center justify-center gap-4 mb-6'>
        <div className={clsx('p-2 rounded-full', darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100')}>
          <AlertTriangle className={clsx('w-5 h-5', darkMode ? 'text-yellow-400' : 'text-yellow-600')} />
        </div>
        <h3 className={clsx('text-xl font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
          Switch
          {' '}
          {taskType === 'goal' ? 'Goal' : 'Task'}
        </h3>
      </div>

      {/* Body */}
      <div className='mb-6'>
        <div className='flex items-start gap-4'>
          <div className='flex-1'>
            <p className={clsx('text-lg text-center', darkMode ? 'text-gray-300' : 'text-gray-600')}>
              Are you sure you want to switch to
              <br />
              <span className={clsx('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>{taskName || `this ${taskType === 'goal' ? 'goal' : 'task'}`}</span>
              ?
            </p>
            <p className={clsx('text-sm mt-2 text-center', darkMode ? 'text-gray-400' : 'text-gray-500')}>
              This will stop the current running task/goal and start this
              {taskType === 'goal' ? ' goal' : ' task'}
              .
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='flex justify-end gap-3 mt-10'>
        <button
          type='button'
          className={clsx('px-4 py-2 text-sm font-medium', darkMode ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50')}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type='button'
          className={clsx('px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50', darkMode ? 'bg-primary-700 hover:bg-primary-800' : 'bg-primary-600 hover:bg-primary-700')}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Switching...' : 'Switch'}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default SwitchTaskModal;
