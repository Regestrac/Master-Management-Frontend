import { useCallback, useEffect, useRef, useState } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Workspace, Member } from 'helpers/sharedTypes';

import { useSettingsStore } from 'stores/settingsStore';

import { getWorkspace } from 'services/workspace';

import MembersSection from 'components/Workspace/Details/MembersSection';
import InviteSection from 'components/Workspace/Details/InviteSection';
import InlineEditableTitle from 'components/Shared/InlineEditableTitle';

import WorkspaceOverviewSkeleton from './WorkspaceOverviewSkeleton';

type WorkspaceOverviewProps = {
  canManage: boolean;
  onWorkspaceRename: (_name: string) => Promise<void>;
  onMemberRoleChange: (_memberId: number, _role: Member['role']) => void;
  onLeaveWorkspace: () => void;
};

const WorkspaceOverview = ({
  canManage,
  onWorkspaceRename,
  onMemberRoleChange,
  onLeaveWorkspace,
}: WorkspaceOverviewProps) => {
  const [workspaceDetails, setWorkspaceDetails] = useState<Workspace>({} as Workspace);
  const [isLoading, setIsLoading] = useState(true);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const { id } = useParams<{ id: string }>();

  const shouldFetchOverviewRef = useRef(true);

  const handleRename = useCallback(async (newName: string) => {
    await onWorkspaceRename(newName);
  }, [onWorkspaceRename]);

  useEffect(() => {
    if (id && shouldFetchOverviewRef.current) {
      setIsLoading(true);
      getWorkspace(id).then((res) => {
        setWorkspaceDetails(res?.data);
        setIsLoading(false);
      }).catch((err) => {
        toast.error(err?.error);
        setIsLoading(false);
      });
      shouldFetchOverviewRef.current = false;
    }
  }, [id]);

  if (isLoading) {
    return <WorkspaceOverviewSkeleton />;
  }

  return (
    <section className={`rounded-xl border p-6 ${darkMode ? 'border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900' : 'border-gray-200 bg-gradient-to-b from-white to-gray-50'}`}>

      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
        <div className='min-w-0 flex-1'>
          <span className='inline-flex items-center gap-1'>
            <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
            Active
          </span>
          <br />
          <div className='flex items-center gap-2 w-full'>
            <InlineEditableTitle
              title={workspaceDetails?.name || ''}
              onSave={handleRename}
              fontSize={22}
              className='font-extrabold w-fit'
            />
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Workspace ID:
            {' '}
            {workspaceDetails?.id || ''}
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0'>
          <MembersSection
            canManage={canManage}
            onChangeRole={onMemberRoleChange}
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