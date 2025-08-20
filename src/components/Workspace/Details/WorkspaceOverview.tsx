import { useCallback, useEffect, useRef, useState } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Workspace, Member } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import { getWorkspace } from 'services/workspace';

import { EditableTitle } from 'components/Workspace/Details/EditableTitle';
import MembersSection from 'components/Workspace/Details/MembersSection';
import InviteSection from 'components/Workspace/Details/InviteSection';

type WorkspaceOverviewProps = {
  canManage: boolean;
  onWorkspaceRename: (_name: string) => Promise<void>;
  onMemberRoleChange: (_memberId: number, _role: Member['role']) => void;
  onMemberRemove: (_memberId: number) => void;
  onLeaveWorkspace: () => void;
};

const WorkspaceOverview = ({
  canManage,
  onWorkspaceRename,
  onMemberRoleChange,
  onMemberRemove,
  onLeaveWorkspace,
}: WorkspaceOverviewProps) => {
  const [workspaceDetails, setWorkspaceDetails] = useState<Workspace>({} as Workspace);

  const isDark = useProfileStore((s) => s.data.theme) === 'dark';

  const { id } = useParams<{ id: string }>();

  const shouldFetchOverviewRef = useRef(true);

  const handleRename = useCallback(async (newName: string) => {
    await onWorkspaceRename(newName);
  }, [onWorkspaceRename]);

  useEffect(() => {
    if (id && shouldFetchOverviewRef.current) {
      getWorkspace(id).then((res) => {
        setWorkspaceDetails(res?.data);
      }).catch((err) => {
        toast.error(err?.error);
      });
      shouldFetchOverviewRef.current = false;
    }
  }, [id]);

  return (
    <section className={`rounded-xl border p-6 ${isDark ? 'border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900' : 'border-gray-200 bg-gradient-to-b from-white to-gray-50'}`}>

      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
        <div className='min-w-0 flex-1'>
          <span className='inline-flex items-center gap-1'>
            <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
            Active
          </span>
          <EditableTitle
            title={workspaceDetails?.name || ''}
            onSave={handleRename}
            className={isDark ? 'text-white' : 'text-gray-900'}
          />
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Workspace ID:
            {' '}
            {workspaceDetails?.id || ('ID' in workspaceDetails ? workspaceDetails.ID as string : '')}
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0'>
          <MembersSection
            canManage={canManage}
            onChangeRole={onMemberRoleChange}
            onRemoveMember={onMemberRemove}
          />

          <InviteSection
            inviteCode={workspaceDetails.invite_code}
            onLeaveWorkspace={onLeaveWorkspace}
          />
        </div>
      </div>
    </section>
  );
};

export default WorkspaceOverview;