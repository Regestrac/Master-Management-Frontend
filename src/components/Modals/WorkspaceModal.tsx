import { useState } from 'react';

import { Plus, Link as LinkIcon, Loader2 } from 'lucide-react';
import clsx from 'clsx';

import useModalStore from 'stores/modalStore';
import { useSettingsStore } from 'stores/settingsStore';

import ModalWrapper from 'components/Modals/ModalWrapper';

const WorkspaceModal = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const updateVisibility = useModalStore((s) => s.updateVisibility);
  const onSuccess = useModalStore((s) => s.modals.workspaceModal.extraProps?.onSuccess);

  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => updateVisibility({ modalType: 'workspaceModal', isVisible: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSuccess) {
      close();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (activeTab === 'create' && name.trim()) {
        await Promise.resolve(onSuccess({ name: name.trim() }));
      } else if (activeTab === 'join' && inviteCode.trim()) {
        await Promise.resolve(onSuccess({ inviteCode: inviteCode.trim() }));
      } else {
        return;
      }
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper modalType='workspaceModal'>
      <div className='p-1'>
        <h2 className={clsx('text-xl font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
          {activeTab === 'create' ? 'Create New Workspace' : 'Join Workspace'}
        </h2>

        <div className={clsx('flex gap-2 border-b mb-4', darkMode ? 'border-gray-700' : 'border-gray-200')}>
          <button
            type='button'
            onClick={() => setActiveTab('create')}
            className={clsx('flex-1 py-2 px-1 text-center text-sm transition border-b-2',
              activeTab === 'create'
                ? (darkMode ? 'text-primary-400 border-primary-400 font-medium' : 'text-primary-600 border-primary-600 font-medium')
                : (darkMode ? 'text-gray-400 hover:text-gray-200 border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent'),
            )}
          >
            <span className='inline-flex items-center justify-center gap-2'>
              <Plus className='w-4 h-4' />
              Create New
            </span>
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('join')}
            className={clsx('flex-1 py-2 px-1 text-center text-sm transition border-b-2',
              activeTab === 'join'
                ? (darkMode ? 'text-primary-400 border-primary-400 font-medium' : 'text-primary-600 border-primary-600 font-medium')
                : (darkMode ? 'text-gray-400 hover:text-gray-200 border-transparent' : 'text-gray-600 hover:text-gray-900 border-transparent'),
            )}
          >
            <span className='inline-flex items-center justify-center gap-2'>
              <LinkIcon className='w-4 h-4' />
              Join Existing
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className='mt-2'>
          {activeTab === 'create' ? (
            <div className='mb-4'>
              <label htmlFor='ws-name' className={clsx('block text-sm font-medium mb-2', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                Workspace Name
              </label>
              <input
                id='ws-name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={clsx('w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2',
                  darkMode ? 'bg-gray-700 border border-gray-600 text-white focus:ring-primary-500' : 'bg-white border border-gray-300 focus:ring-primary-500')}
                placeholder='Enter workspace name'
                disabled={loading}
                required
              />
            </div>
          ) : (
            <div className='mb-4'>
              <label htmlFor='ws-invite' className={clsx('block text-sm font-medium mb-2', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                Invite Code
              </label>
              <input
                id='ws-invite'
                type='text'
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className={clsx('w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2',
                  darkMode ? 'bg-gray-700 border border-gray-600 text-white focus:ring-primary-500' : 'bg-white border border-gray-300 focus:ring-primary-500')}
                placeholder='Enter invite code'
                disabled={loading}
                required
              />
              <p className={clsx('mt-1 text-xs', darkMode ? 'text-gray-400' : 'text-gray-500')}>Ask the workspace admin for the invite code</p>
            </div>
          )}

          {error && (
            <div className={clsx('mb-4 p-3 text-sm rounded-md', darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700')}>
              {error}
            </div>
          )}

          <div className='mt-6 flex justify-end gap-3'>
            <button
              type='button'
              onClick={close}
              className={clsx('px-4 py-2 text-sm font-medium rounded', darkMode
                ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className={clsx('px-4 py-2 text-sm font-medium text-white rounded shadow inline-flex items-center gap-2', darkMode
                ? 'bg-primary-700 hover:bg-primary-800'
                : 'bg-primary-600 hover:bg-primary-700')}
              disabled={loading || (activeTab === 'create' ? !name.trim() : !inviteCode.trim())}
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  {' '}
                  Processing...
                </>
              ) : (activeTab === 'create' ? 'Create Workspace' : 'Join Workspace')}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default WorkspaceModal;
