import { useCallback } from 'react';

import { Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

type InviteSectionProps = {
  inviteCode: string;
  onLeaveWorkspace: () => void;
};

const InviteSection = ({ inviteCode, onLeaveWorkspace }: InviteSectionProps) => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const handleCopyInvite = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      toast.success('Invite code copied to clipboard');
    } catch {
      toast.error('Failed to copy invite code');
    }
  }, [inviteCode]);

  return (
    <div className='flex items-center gap-2 shrink-0'>
      <div className='flex items-center gap-2'>
        <label htmlFor='invite' className='sr-only'>Invite code</label>
        <div
          id='invite'
          className={clsx(
            'h-9 w-28 sm:w-36 truncate flex items-center justify-between rounded-lg border px-2 text-sm shadow-sm',
            darkMode ? 'bg-gray-900 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700',
          )}
          aria-label='Invite code'
        >
          {inviteCode}
          <button
            type='button'
            onClick={handleCopyInvite}
            className={clsx(
              'h-9 px-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40',
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
            )}
            title='Copy invite code'
            aria-label='Copy invite code'
          >
            <Copy className='w-4 h-4' />
          </button>
        </div>
        <button
          type='button'
          onClick={onLeaveWorkspace}
          className={clsx(
            'h-9 px-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-red-400/30',
            darkMode ? 'border-red-700 text-red-300 hover:bg-red-900/20' : 'border-red-300 text-red-600 hover:bg-red-50')}
        >
          Leave
        </button>
      </div>
    </div>
  );
};

export default InviteSection;
