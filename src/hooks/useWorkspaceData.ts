import { useState, useEffect, useCallback } from 'react';

import { Goal, Member, Task, Workspace } from 'helpers/sharedTypes';

// Mock API functions - replace with real API calls
const mockFetchWorkspace = async (id: number): Promise<Workspace> => {
  await new Promise((res) => setTimeout(res, 300));
  return { id, name: `Workspace #${id}`, manager_id: 1, created_at: new Date().toISOString(), type: 'personal', invite_code: '3JS8' };
};

const mockRenameWorkspace = async (id: number, name: string): Promise<Workspace> => {
  await new Promise((res) => setTimeout(res, 300));
  return { id, name, manager_id: 1, created_at: new Date().toISOString(), type: 'personal', invite_code: '3SD4' };
};

// Initial mock data
const initialMembers: Member[] = [
  { id: 1, name: 'You', role: 'manager', profile_color: 'rose', joined_at: new Date().toISOString(), user_id: 1, ID: 1 },
  { id: 2, name: 'Alex Doe', role: 'member', profile_color: 'amber', joined_at: new Date().toISOString(), user_id: 2, ID: 2 },
  { id: 3, name: 'Sam Lee', role: 'member', profile_color: 'emerald', joined_at: new Date().toISOString(), user_id: 3, ID: 3 },
  { id: 4, name: 'Jordan Smith', role: 'member', profile_color: 'lime', joined_at: new Date().toISOString(), user_id: 4, ID: 4 },
  { id: 5, name: 'Taylor Kim', role: 'member', profile_color: 'orange', joined_at: new Date().toISOString(), user_id: 5, ID: 5 },
  { id: 6, name: 'Morgan Lee', role: 'member', profile_color: 'sky', joined_at: new Date().toISOString(), user_id: 6, ID: 6 },
];

const initialTasks: Task[] = [
  { id: 101, title: 'Set up workspace rules', status: 'Open', assignees: [1, 2], due_date: '2025-08-20' },
  { id: 102, title: 'Invite teammates', status: 'In Progress', assignees: [3], due_date: '2025-08-22' },
  { id: 103, title: 'Plan sprint backlog', status: 'Done', assignees: [2, 4, 5], due_date: '2025-08-18' },
];

const initialGoals: Goal[] = [
  { id: 201, title: 'Ship MVP', status: 'In Progress' },
  { id: 202, title: 'Hit 100 users', status: 'Not Started' },
  { id: 203, title: 'Collect feedback', status: 'Achieved' },
];

export const useWorkspaceData = (workspaceId: number | undefined) => {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load workspace data
  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    mockFetchWorkspace(workspaceId)
      .then(setWorkspace)
      .catch((err) => setError(err.message || 'Failed to load workspace'))
      .finally(() => setIsLoading(false));
  }, [workspaceId]);

  // Workspace actions
  const handleWorkspaceRename = useCallback(async (newName: string) => {
    if (!workspaceId || !workspace) {
      throw new Error('No workspace to rename');
    }

    setIsLoading(true);
    try {
      const updated = await mockRenameWorkspace(workspaceId, newName);
      setWorkspace(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename workspace');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, workspace]);

  // Member actions
  const handleMemberRoleChange = useCallback((memberId: number, role: Member['role']) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role } : m)));
  }, []);

  const handleMemberRemove = useCallback((memberId: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }, []);

  // Task actions
  const handleTaskAdd = useCallback((title: string) => {
    const id = Date.now();
    const due = new Date();
    due.setDate(due.getDate() + 7);

    const newTask: Task = {
      id,
      title,
      status: 'Open',
      assignees: [],
      due_date: due.toISOString().slice(0, 10),
    };

    setTasks((prev) => [newTask, ...prev]);
  }, []);

  // Goal actions
  const handleGoalAdd = useCallback((title: string) => {
    const id = Date.now();
    const newGoal: Goal = {
      id,
      title,
      status: 'Not Started',
    };

    setGoals((prev) => [newGoal, ...prev]);
  }, []);

  return {
    workspace,
    members,
    tasks,
    goals,
    isLoading,
    error,
    actions: {
      handleWorkspaceRename,
      handleMemberRoleChange,
      handleMemberRemove,
      handleTaskAdd,
      handleGoalAdd,
    },
  };
};
