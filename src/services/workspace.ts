import { getHandler, postHandler } from 'helpers/api';
import { Workspace, Member, Task, Goal } from 'helpers/sharedTypes';

// Workspace operations
export const getWorkspace = (workspaceId: string): Promise<Workspace> =>
  getHandler({ path: `workspaces/${workspaceId}` });

export const getWorkspaces = (): Promise<{ workspaces: Workspace[] }> =>
  getHandler({ path: 'workspaces' });

export const createWorkspace = (name: string): Promise<Workspace> =>
  postHandler({
    path: 'workspaces',
    body: JSON.stringify({ name }),
  });

export const updateWorkspace = (workspaceId: string, name: string): Promise<Workspace> =>
  postHandler({
    path: `workspaces/${workspaceId}`,
    method: 'PUT',
    body: JSON.stringify({ name }),
  });

export const deleteWorkspace = (workspaceId: string): Promise<void> =>
  postHandler({
    path: `workspaces/${workspaceId}`,
    method: 'DELETE',
  });

export const leaveWorkspace = (workspaceId: string): Promise<void> =>
  postHandler({
    path: `workspaces/${workspaceId}/leave`,
  });

export const joinWorkspace = (inviteCode: string): Promise<Workspace> =>
  postHandler({
    path: 'workspaces/join',
    body: JSON.stringify({ inviteCode }),
  });

export const generateInviteCode = (workspaceId: string): Promise<{ inviteCode: string }> =>
  postHandler({
    path: `workspaces/${workspaceId}/invite`,
  });

// Member operations
export const getMembers = (workspaceId: string): Promise<Member[]> =>
  getHandler({ path: `workspaces/${workspaceId}/members` });

export const addMember = (workspaceId: string, email: string, role: Member['role'] = 'Member'): Promise<Member> =>
  postHandler({
    path: `workspaces/${workspaceId}/members`,
    body: JSON.stringify({ email, role }),
  });

export const updateMemberRole = (workspaceId: string, memberId: number, role: Member['role']): Promise<Member> =>
  postHandler({
    path: `workspaces/${workspaceId}/members/${memberId}`,
    method: 'PUT',
    body: JSON.stringify({ role }),
  });

export const removeMember = (workspaceId: string, memberId: number): Promise<void> =>
  postHandler({
    path: `workspaces/${workspaceId}/members/${memberId}`,
    method: 'DELETE',
  });

// Task operations
export const getWorkspaceTasks = (workspaceId: string): Promise<Task[]> =>
  getHandler({ path: `workspaces/${workspaceId}/tasks` });

export const createWorkspaceTask = (workspaceId: string, task: Omit<Task, 'id'>): Promise<Task> =>
  postHandler({
    path: `workspaces/${workspaceId}/tasks`,
    body: JSON.stringify(task),
  });

export const updateWorkspaceTask = (workspaceId: string, taskId: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task> =>
  postHandler({
    path: `workspaces/${workspaceId}/tasks/${taskId}`,
    method: 'PUT',
    body: JSON.stringify(updates),
  });

export const deleteWorkspaceTask = (workspaceId: string, taskId: number): Promise<void> =>
  postHandler({
    path: `workspaces/${workspaceId}/tasks/${taskId}`,
    method: 'DELETE',
  });

export const assignTask = (workspaceId: string, taskId: number, assignees: number[]): Promise<Task> =>
  postHandler({
    path: `workspaces/${workspaceId}/tasks/${taskId}/assign`,
    method: 'PUT',
    body: JSON.stringify({ assignees }),
  });

// Goal operations
export const getWorkspaceGoals = (workspaceId: string): Promise<Goal[]> =>
  getHandler({ path: `workspaces/${workspaceId}/goals` });

export const createWorkspaceGoal = (workspaceId: string, goal: Omit<Goal, 'id'>): Promise<Goal> =>
  postHandler({
    path: `workspaces/${workspaceId}/goals`,
    body: JSON.stringify(goal),
  });

export const updateWorkspaceGoal = (workspaceId: string, goalId: number, updates: Partial<Omit<Goal, 'id'>>): Promise<Goal> =>
  postHandler({
    path: `workspaces/${workspaceId}/goals/${goalId}`,
    method: 'PUT',
    body: JSON.stringify(updates),
  });

export const deleteWorkspaceGoal = (workspaceId: string, goalId: number): Promise<void> =>
  postHandler({
    path: `workspaces/${workspaceId}/goals/${goalId}`,
    method: 'DELETE',
  });

// Analytics operations
export const getWorkspaceAnalytics = (workspaceId: string): Promise<{
  totalTasks: number;
  completedTasks: number;
  totalGoals: number;
  achievedGoals: number;
  memberCount: number;
  recentActivity: Array<{
    id: string;
    type: 'task' | 'goal' | 'member';
    action: string;
    timestamp: string;
    user: string;
  }>;
}> => getHandler({ path: `workspaces/${workspaceId}/analytics` });

export const getMemberPerformance = (workspaceId: string, memberId: number): Promise<{
  tasksCompleted: number;
  tasksAssigned: number;
  goalsAchieved: number;
  averageCompletionTime: number;
}> => getHandler({ path: `workspaces/${workspaceId}/members/${memberId}/performance` });

// Activity operations
export const getActivity = (workspaceId: string, limit = 50): Promise<Array<{
  id: string;
  type: 'task' | 'goal' | 'member' | 'workspace';
  action: string;
  timestamp: string;
  user: string;
  details: Record<string, any>;
}>> => getHandler({ path: `workspaces/${workspaceId}/activity?limit=${limit}` });

export const markActivityRead = (workspaceId: string, activityId: string): Promise<void> =>
  postHandler({
    path: `workspaces/${workspaceId}/activity/${activityId}/read`,
  });

// Settings operations
export const getSettings = (workspaceId: string): Promise<{
  allowMemberInvites: boolean;
  requireApprovalForJoin: boolean;
  defaultMemberRole: Member['role'];
  timezone: string;
  workingDays: string[];
}> => getHandler({ path: `workspaces/${workspaceId}/settings` });

export const updateSettings = (workspaceId: string, settings: {
  allowMemberInvites?: boolean;
  requireApprovalForJoin?: boolean;
  defaultMemberRole?: Member['role'];
  timezone?: string;
  workingDays?: string[];
}): Promise<void> =>
  postHandler({
    path: `workspaces/${workspaceId}/settings`,
    method: 'PUT',
    body: JSON.stringify(settings),
  });