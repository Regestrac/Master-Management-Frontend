import React, { useState, useCallback } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

import { useWorkspaceData } from 'hooks/useWorkspaceData';

import { TabType } from 'helpers/sharedTypes';

import { WorkspaceOverview } from 'components/Workspace/Details/WorkspaceOverview';
import { WorkspaceTabs } from 'components/Workspace/Details/WorkspaceTabs';

const WorkspaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserId = 1; // TODO: Get from auth context
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  const {
    workspace,
    members,
    tasks,
    goals,
    isLoading,
    error,
    actions,
  } = useWorkspaceData(Number(id));

  const inviteCode = `WS-${id || '0000'}`;
  const currentUserRole = members.find((m) => m.id === currentUserId)?.role || 'Member';
  const canManage = currentUserRole === 'Owner' || currentUserRole === 'Admin';

  const handleLeaveWorkspace = useCallback(() => {
    // TODO: Implement leave workspace functionality
    toast.info('Leave workspace functionality coming soon');
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, [setActiveTab]);

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
        className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:underline'
        onClick={() => navigate('/workspace')}
      >
        <ArrowLeft className='w-4 h-4' />
        Back
      </button>

      {/* Workspace Overview */}
      <WorkspaceOverview
        workspace={workspace}
        members={members}
        inviteCode={inviteCode}
        canManage={canManage}
        onWorkspaceRename={actions.handleWorkspaceRename}
        onMemberRoleChange={actions.handleMemberRoleChange}
        onMemberRemove={actions.handleMemberRemove}
        onLeaveWorkspace={handleLeaveWorkspace}
      />

      {/* Workspace Tabs */}
      <WorkspaceTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tasks={tasks}
        goals={goals}
        members={members}
        onTaskAdd={actions.handleTaskAdd}
        onGoalAdd={actions.handleGoalAdd}
      />
    </div>
  );
};

export default WorkspaceDetail;
