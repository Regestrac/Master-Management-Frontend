import { useCallback } from 'react';

import { Copy } from 'lucide-react';
import { toast } from 'react-toastify';

type InviteSectionProps = {
  inviteCode: string;
  onLeaveWorkspace: () => void;
};

const InviteSection = ({ inviteCode, onLeaveWorkspace }: InviteSectionProps) => {
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
          className='h-9 w-28 sm:w-36 truncate flex items-center justify-between rounded-lg border px-2 text-sm shadow-sm bg-white border-gray-300 text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300'
          aria-label='Invite code'
        >
          {inviteCode}
          <button
            type='button'
            onClick={handleCopyInvite}
            className='h-9 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40'
            title='Copy invite code'
            aria-label='Copy invite code'
          >
            <Copy className='w-4 h-4' />
          </button>
        </div>
        <button
          type='button'
          onClick={onLeaveWorkspace}
          className='h-9 px-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/30'
        >
          Leave
        </button>
      </div>
    </div>
  );
};

export default InviteSection;
