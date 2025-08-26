import { useCallback } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

import { useWorkspaceData } from 'hooks/useWorkspaceData';

import useModalStore from 'stores/modalStore';

import { leaveWorkspace } from 'services/workspace';

import WorkspaceOverview from 'components/Workspace/Details/WorkspaceOverview';
import WorkspaceTabs from 'components/Workspace/Details/WorkspaceTabs';
import GoalList from 'components/Workspace/Details/GoalList';
import TaskList from 'components/Workspace/Details/TaskList';

const WorkspaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserId = 1; // TODO: Get from auth context

  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const {
    members,
    isLoading,
    error,
    actions,
  } = useWorkspaceData(Number(id));

  const currentUserRole = members.find((m) => m.id === currentUserId)?.role || 'member';
  const canManage = currentUserRole === 'manager' || currentUserRole === 'admin';

  const handleLeaveWorkspace = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      await leaveWorkspace(id);
      toast.success('Successfully left the workspace');
      navigate('/workspace');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to leave workspace');
    }
  }, [id, navigate]);

  const openLeaveWorkspaceModal = useCallback(() => {
    const workspaceName = members.length > 0 ? 'Current Workspace' : 'this workspace';
    updateVisibility({
      modalType: 'leaveWorkspaceModal',
      isVisible: true,
      extraProps: {
        workspaceName,
        onSuccess: handleLeaveWorkspace,
      } as any,
    });
  }, [updateVisibility, handleLeaveWorkspace, members.length]);

  if (error) {
    return (
      <div className='p-8 min-h-[calc(100vh-165px)]'>
        <div className='text-center'>
          <p className='text-red-600 dark:text-red-400'>
            Error:
            {' '}
            {error}
          </p>
          <button
            type='button'
            onClick={() => navigate('/workspace')}
            className='mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700'
          >
            Back to Workspaces
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='p-8 min-h-[calc(100vh-165px)]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto' />
          <p className='mt-2 text-gray-600 dark:text-gray-400'>Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8 min-h-[calc(100vh-165px)]'>
      <button
        type='button'
        className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer'
        onClick={() => navigate('/workspace')}
      >
        <ArrowLeft className='w-4 h-4' />
        Back To Workspaces
      </button>

      <WorkspaceOverview
        canManage={canManage}
        onWorkspaceRename={actions.handleWorkspaceRename}
        onMemberRoleChange={actions.handleMemberRoleChange}
        onLeaveWorkspace={openLeaveWorkspaceModal}
      />

      <WorkspaceTabs
        taskList={<TaskList />}
        goalList={<GoalList />}
      />
    </div>
  );
};

export default WorkspaceDetail;
