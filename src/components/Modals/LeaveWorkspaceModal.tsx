import { useState } from 'react';

import clsx from 'clsx';
import { LogOut, AlertTriangle } from 'lucide-react';

import useModalStore from 'stores/modalStore';
import { useSettingsStore } from 'stores/settingsStore';

import ModalWrapper from 'components/Modals/ModalWrapper';

const LeaveWorkspaceModal = () => {
  const [loading, setLoading] = useState(false);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const workspaceName = useModalStore((state) => state.modals.leaveWorkspaceModal.extraProps?.modalData?.workspaceName);
  const updateVisibility = useModalStore((state) => state.updateVisibility);
  const onSuccess = useModalStore((state) => state.modals.leaveWorkspaceModal?.extraProps?.onSuccess);

  const handleCancel = () => updateVisibility({ modalType: 'leaveWorkspaceModal', isVisible: false });

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
    <ModalWrapper modalType='leaveWorkspaceModal'>
      <div className='flex flex-col items-center text-center gap-4'>
        <div className={clsx('p-3 rounded-full', darkMode ? 'bg-orange-900/30' : 'bg-orange-100')}>
          <LogOut className={clsx('w-6 h-6', darkMode ? 'text-orange-400' : 'text-orange-600')} />
        </div>
        <h3 className={clsx('text-xl font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
          Leave Workspace
        </h3>
        <div className='space-y-2'>
          <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-700')}>
            Are you sure you want to leave
            {' '}
            <span className={`font-medium ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
              {workspaceName || 'this workspace'}
            </span>
            ?
          </p>
          <div className={clsx('flex items-center gap-2 p-3 rounded-lg text-sm', darkMode ? 'bg-orange-900/20 text-orange-300' : 'bg-orange-50 text-orange-700')}>
            <AlertTriangle className='w-4 h-4 shrink-0' />
            <span>You will lose access to all tasks, goals, and workspace data.</span>
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
            ? 'bg-orange-700 hover:bg-orange-800 disabled:opacity-50'
            : 'bg-orange-600 hover:bg-orange-700 disabled:opacity-50')}
        >
          {loading ? (
            <>
              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              Leaving...
            </>
          ) : (
            <>
              <LogOut className='w-4 h-4' />
              Leave Workspace
            </>
          )}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default LeaveWorkspaceModal;
