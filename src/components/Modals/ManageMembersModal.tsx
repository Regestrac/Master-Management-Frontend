import clsx from 'clsx';

import useModalStore from 'stores/modalStore';
import { useProfileStore } from 'stores/profileStore';

import ModalWrapper from 'components/Modals/ModalWrapper';

type Member = { id: number; name: string; role: 'Owner' | 'Admin' | 'Member'; avatarUrl?: string };

type ExtraProps = {
  members?: Member[];
  canManage?: boolean;
  onChangeRole?: (_memberId: number, _role: 'Owner' | 'Admin' | 'Member') => void;
  onRemoveMember?: (_memberId: number) => void;
};

const getInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) { return parts[0].charAt(0).toUpperCase(); }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const ManageMembersModal = () => {
  const darkMode = useProfileStore((s) => s.data.theme) === 'dark';
  const { modals } = useModalStore();
  const data = (modals.manageMembersModal?.extraProps as { modalData?: ExtraProps })?.modalData || {};
  const { members = [], canManage = false, onChangeRole, onRemoveMember } = data;

  // Shared color mapping for member visuals (consistent across app)
  const colorClasses = [
    { bg: 'bg-rose-500', ring: 'ring-rose-300 dark:ring-rose-900/40' },
    { bg: 'bg-orange-500', ring: 'ring-orange-300 dark:ring-orange-900/40' },
    { bg: 'bg-amber-500', ring: 'ring-amber-300 dark:ring-amber-900/40' },
    { bg: 'bg-lime-500', ring: 'ring-lime-300 dark:ring-lime-900/40' },
    { bg: 'bg-emerald-500', ring: 'ring-emerald-300 dark:ring-emerald-900/40' },
    { bg: 'bg-sky-500', ring: 'ring-sky-300 dark:ring-sky-900/40' },
    { bg: 'bg-violet-500', ring: 'ring-violet-300 dark:ring-violet-900/40' },
    { bg: 'bg-pink-500', ring: 'ring-pink-300 dark:ring-pink-900/40' },
  ];

  return (
    <ModalWrapper modalType='manageMembersModal'>
      <div className='flex items-center justify-between sticky top-0 mb-2'>
        <h3 className='text-lg font-semibold'>Members</h3>
      </div>
      <div className='max-h-[60vh] overflow-y-auto space-y-2'>
        {members.map((m: Member) => (
          <div
            key={m.id}
            className={clsx(
              'flex items-center justify-between rounded-lg border px-3 py-2 transition',
              darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50',
            )}
          >
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center'>
                {m.avatarUrl ? (
                  <img src={m.avatarUrl} alt={m.name} className={`w-full h-full object-cover ring-2 ${colorClasses[m.id % colorClasses.length].ring}`} />
                ) : (
                  <span className={`text-xs font-semibold text-white ${colorClasses[m.id % colorClasses.length].bg} w-full h-full flex items-center justify-center`}>
                    {getInitials(m.name)}
                  </span>
                )}
              </div>
              <div>
                <div className='font-medium'>{m.name}</div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  <span>ID:</span>
                  <span className='ml-1'>{m.id}</span>
                </div>
              </div>
            </div>
            {canManage ? (
              <div className='flex items-center gap-2'>
                <select
                  value={m.role}
                  onChange={(e) => onChangeRole && onChangeRole(m.id, e.target.value as 'Owner' | 'Admin' | 'Member')}
                  className={clsx('text-sm px-2 py-1 rounded border shadow-sm', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300')}
                >
                  <option value='Owner'>Owner</option>
                  <option value='Admin'>Admin</option>
                  <option value='Member'>Member</option>
                </select>
                <button
                  type='button'
                  onClick={() => onRemoveMember && onRemoveMember(m.id)}
                  className={clsx('text-sm px-3 py-1 rounded border focus:outline-none focus:ring-2', darkMode
                    ? 'border-red-700 text-red-300 hover:bg-red-900/20 focus:ring-red-400/30'
                    : 'border-red-300 text-red-600 hover:bg-red-50 focus:ring-red-400/30')}
                >
                  Remove
                </button>
              </div>
            ) : (
              <span className='text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'>{m.role}</span>
            )}
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

export default ManageMembersModal;
