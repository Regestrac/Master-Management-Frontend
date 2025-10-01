import clsx from 'clsx';
import { toast } from 'react-toastify';

import { Member } from 'helpers/sharedTypes';

import useModalStore from 'stores/modalStore';
import { useSettingsStore } from 'stores/settingsStore';

import { removeMember } from 'services/workspace';

import ModalWrapper from 'components/Modals/ModalWrapper';
import { MemberAvatar } from 'components/Workspace/Details/MemberAvatar';

type ExtraProps = {
  members?: Member[];
  canManage?: boolean;
  workspaceId?: string;
  onChangeRole?: (_memberId: number, _role: 'manager' | 'admin' | 'member') => void;
};

const ManageMembersModal = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const modalData: ExtraProps = useModalStore((state) => state.modals?.manageMembersModal?.extraProps?.modalData);
  const { members = [], canManage = false, onChangeRole, workspaceId } = modalData;

  const handleRemoveMember = (memberId: number) => {
    if (workspaceId && memberId) {
      removeMember(workspaceId, memberId).then((res) => {
        toast.success(res?.message || 'Member removed successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to remove member');
      });
    }
  };

  return (
    <ModalWrapper modalType='manageMembersModal'>
      <div className='flex items-center justify-between sticky top-0 mb-2'>
        <h3 className='text-lg font-semibold text-primary-100'>Members</h3>
      </div>
      <div className='max-h-[60vh] overflow-y-auto space-y-2'>
        {members.map((m: Member) => (
          <div
            key={m.user_id}
            className={clsx(
              'flex items-center justify-between rounded-lg border px-3 py-2 transition',
              darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50',
            )}
          >
            <div className='flex items-center gap-3'>
              {m.avatar_url ? (
                <div className='w-8 h-8 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center'>
                  <img src={m.avatar_url} alt={m.name} className='w-full h-full object-cover ring-2' />
                </div>
              ) : (
                <MemberAvatar member={m} size='md' color={m.profile_color} />
              )}
              <div className='font-medium text-primary-200'>{m.name}</div>
            </div>
            {canManage ? (
              <div className='flex items-center gap-2'>
                <select
                  value={m.role}
                  onChange={(e) => onChangeRole && onChangeRole(m.id, e.target.value as 'manager' | 'admin' | 'member')}
                  className={clsx('text-sm px-2 py-1 rounded border shadow-sm', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300')}
                >
                  <option value='manager'>Manager</option>
                  <option value='admin'>Admin</option>
                  <option value='member'>Member</option>
                </select>
                <button
                  type='button'
                  onClick={() => handleRemoveMember(m.id)}
                  className={clsx(
                    'text-sm px-3 py-1 rounded border focus:outline-none focus:ring-2',
                    darkMode
                      ? 'border-red-700 text-red-300 hover:bg-red-900/20 focus:ring-red-400/30'
                      : 'border-red-300 text-red-600 hover:bg-red-50 focus:ring-red-400/30',
                  )}
                >
                  Remove
                </button>
              </div>
            ) : (
              <span className='text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'>
                {m.role}
              </span>
            )}
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

export default ManageMembersModal;
