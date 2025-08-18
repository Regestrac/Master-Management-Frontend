import { memo, useCallback } from 'react';

import { Workspace, Member } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import { EditableTitle } from 'components/Workspace/Details/EditableTitle';
import { MembersSection } from 'components/Workspace/Details/MembersSection';
import { InviteSection } from 'components/Workspace/Details/InviteSection';

interface WorkspaceOverviewProps {
  workspace: Workspace | null;
  members: Member[];
  inviteCode: string;
  canManage: boolean;
  onWorkspaceRename: (_name: string) => Promise<void>;
  onMemberRoleChange: (_memberId: number, _role: Member['role']) => void;
  onMemberRemove: (_memberId: number) => void;
  onLeaveWorkspace: () => void;
}

export const WorkspaceOverview = memo(({
  workspace,
  members,
  inviteCode,
  canManage,
  onWorkspaceRename,
  onMemberRoleChange,
  onMemberRemove,
  onLeaveWorkspace,
}: WorkspaceOverviewProps) => {
  const theme = useProfileStore((s) => s.data.theme);
  const isDark = theme === 'dark';

  const handleRename = useCallback(async (newName: string) => {
    await onWorkspaceRename(newName);
  }, [onWorkspaceRename]);

  return (
    <section className={`rounded-xl border p-6 ${isDark ? 'border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900' : 'border-gray-200 bg-gradient-to-b from-white to-gray-50'}`}>
      <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2'>
        <span className='sr-only'>Workspace ID</span>
        <span className='inline-flex items-center gap-1'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          Active
        </span>
      </div>

      <div className='flex items-center justify-between gap-4'>
        <div className='min-w-0 flex-1'>
          <EditableTitle
            title={workspace?.name || ''}
            onSave={handleRename}
            className={isDark ? 'text-white' : 'text-gray-900'}
          />
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Workspace ID:
            {' '}
            {workspace?.id}
          </p>
        </div>

        <MembersSection
          members={members}
          canManage={canManage}
          onChangeRole={onMemberRoleChange}
          onRemoveMember={onMemberRemove}
        />

        <InviteSection
          inviteCode={inviteCode}
          onLeaveWorkspace={onLeaveWorkspace}
        />
      </div>
    </section>
  );
});

WorkspaceOverview.displayName = 'WorkspaceOverview';
