import { useCallback } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

import { useWorkspaceData } from 'hooks/useWorkspaceData';

import WorkspaceOverview from 'components/Workspace/Details/WorkspaceOverview';
import WorkspaceTabs from 'components/Workspace/Details/WorkspaceTabs';
import GoalList from 'components/Workspace/Details/GoalList';
import TaskList from 'components/Workspace/Details/TaskList';

const WorkspaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserId = 1; // TODO: Get from auth context

  const {
    members,
    tasks,
    goals,
    isLoading,
    error,
    actions,
  } = useWorkspaceData(Number(id));

  const currentUserRole = members.find((m) => m.id === currentUserId)?.role || 'member';
  const canManage = currentUserRole === 'manager' || currentUserRole === 'admin';

  const handleLeaveWorkspace = useCallback(() => {
    // TODO: Implement leave workspace functionality
    toast.info('Leave workspace functionality coming soon');
  }, []);

  if (error) {
    return (
      <div className='p-8'>
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
      <div className='p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto' />
          <p className='mt-2 text-gray-600 dark:text-gray-400'>Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-8 space-y-8'>
      {/* Back Button */}
      <button
        type='button'
        className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer'
        onClick={() => navigate('/workspace')}
      >
        <ArrowLeft className='w-4 h-4' />
        Back
      </button>

      <WorkspaceOverview
        // members={members}
        canManage={canManage}
        onWorkspaceRename={actions.handleWorkspaceRename}
        onMemberRoleChange={actions.handleMemberRoleChange}
        onMemberRemove={actions.handleMemberRemove}
        onLeaveWorkspace={handleLeaveWorkspace}
      />

      <WorkspaceTabs
        taskCount={tasks.length}
        goalCount={goals.length}
        taskList={<TaskList tasks={tasks} members={members} onTaskAdd={actions.handleTaskAdd} />}
        goalList={<GoalList goals={goals} onGoalAdd={actions.handleGoalAdd} />}
      />
    </div>
  );
};

export default WorkspaceDetail;
