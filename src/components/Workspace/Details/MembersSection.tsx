import { useCallback, useEffect, useRef } from 'react';

import clsx from 'clsx';
import { Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Member } from 'helpers/sharedTypes';

import useModalStore from 'stores/modalStore';
import { useSettingsStore } from 'stores/settingsStore';
import useWorkspaceStore from 'stores/workspaceStore';

import { getMembers } from 'services/workspace';

import MemberAvatar from 'components/Workspace/Details/MemberAvatar';

type MembersSectionProps = {
  canManage: boolean;
  onChangeRole: (_memberId: number, _role: Member['role']) => void;
};

const MembersSection = ({ canManage, onChangeRole }: MembersSectionProps) => {
  const members = useWorkspaceStore((state) => state.members);
  const setMembers = useWorkspaceStore((state) => state.setMembers);
  const updateVisibility = useModalStore((state) => state.updateVisibility);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const shouldFetchMembersRef = useRef(true);

  const { id } = useParams<{ id: string }>();

  const handleMembersClick = useCallback(() => {
    updateVisibility({
      modalType: 'manageMembersModal',
      isVisible: true,
      extraProps: {
        modalData: { members, canManage, onChangeRole, workspaceId: id },
      },
    });
  }, [members, canManage, onChangeRole, updateVisibility, id]);

  useEffect(() => {
    if (id && shouldFetchMembersRef.current) {
      getMembers(id).then((res) => {
        setMembers(res?.members);
      }).catch((err) => {
        toast.error(err?.error);
      });
      shouldFetchMembersRef.current = false;
    }
  }, [id, setMembers]);

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={handleMembersClick}
      className={clsx(
        'flex items-center -space-x-2 p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40',
        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      )}
    >
      <Users className='w-5 h-5 mr-2 hidden sm:block' />
      {members?.slice(0, 5).map((member, idx) => {
        const isOverflowChip = members.length > 5 && idx === 4;

        if (isOverflowChip) {
          return (
            <button
              key={`overflow-${idx}`}
              type='button'
              onClick={handleMembersClick}
              className={clsx(
                'w-10 h-10 rounded-full border flex items-center justify-center shadow-sm',
                darkMode
                  ? 'border-gray-700 bg-gray-800 text-gray-300'
                  : 'border-gray-200 bg-white text-gray-700',
              )}
              title='Manage members'
            >
              +
              {members.length - 5}
            </button>
          );
        }

        return (
          <MemberAvatar
            color={member.profile_color}
            key={member.id}
            member={member}
            size='md'
            className={darkMode ? 'border-white' : 'border-gray-700'}
          />
        );
      })}
    </div>
  );
};

export default MembersSection;
