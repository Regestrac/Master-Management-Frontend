import { useCallback, useEffect, useRef } from 'react';

import { Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Member } from 'helpers/sharedTypes';

import useModalStore from 'stores/modalStore';
import useWorkspaceStore from 'stores/workspaceStore';

import { getMembers } from 'services/workspace';

import { MemberAvatar } from 'components/Workspace/Details/MemberAvatar';

type MembersSectionProps = {
  canManage: boolean;
  onChangeRole: (_memberId: number, _role: Member['role']) => void;
  onRemoveMember: (_memberId: number) => void;
};

const MembersSection = ({
  canManage,
  onChangeRole,
  onRemoveMember,
}: MembersSectionProps) => {
  const members = useWorkspaceStore((state) => state.members);
  const setMembers = useWorkspaceStore((state) => state.setMembers);
  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const shouldFetchMembersRef = useRef(true);

  const { id } = useParams<{ id: string }>();

  const handleMembersClick = useCallback(() => {
    updateVisibility({
      modalType: 'manageMembersModal',
      isVisible: true,
      extraProps: {
        modalData: { members, canManage, onChangeRole, onRemoveMember },
      },
    });
  }, [members, canManage, onChangeRole, onRemoveMember, updateVisibility]);

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
      className='flex items-center -space-x-2 p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/40'
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
              className='w-10 h-10 rounded-full border flex items-center justify-center shadow-sm border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
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
            key={member.id || member.ID}
            member={member}
            size='md'
            className='border-gray-700 dark:border-white'
          />
        );
      })}
    </div>
  );
};

export default MembersSection;
