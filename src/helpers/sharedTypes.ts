export type ThemeType = 'dark' | 'black' | 'red' | 'green' | 'blue' | 'purple' | 'cyan' | 'white';

export type StatusType = 'completed' | 'todo' | 'inprogress' | 'pending' | 'paused';

export type PriorityType = 'high' | 'normal' | 'low';

export type TaskType = {
  id: number;
  title: string;
  status: StatusType;
  time_spend: number;
  priority: PriorityType;
  created_at: string;
  streak: number;
  due_date: string;
  category: string;
  type: 'goal' | 'task';
};

export type SelectOptionType = {
  label: string;
  value: string | number;
};

export type StickyNoteDataType = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
};

export type ModalPropsType = {
  id?: string;
  title?: string;
  modalData?: any;
  cancelText?: string;
  description?: string;
  successText?: string;
  onCancel?: () => void;
  onSuccess?: (_payload?: any) => void;
  hideCloseButton?: boolean;
  disableOutsideClick?: boolean;
};

export type ModalTypes = {
  isVisible: boolean;
  extraProps?: ModalPropsType;
};

export type ModalNamesType = 'switchTaskModal' | 'confirmDeleteModal' | 'workspaceModal' | 'manageMembersModal';

export type Member = {
  id: number;
  name: string;
  role: 'manager' | 'admin' | 'member';
  avatar_url?: string;
  profile_color: 'rose' | 'orange' | 'amber' | 'lime' | 'emerald' | 'sky' | 'violet' | 'pink';
  joined_at: string;
  user_id: number;
  ID: number;
}

export type Task = {
  id: number;
  title: string;
  status: 'Open' | 'In Progress' | 'Done';
  assignees: number[];
  dueDate: string;
}

export type Goal = {
  id: number;
  title: string;
  status: 'Not Started' | 'In Progress' | 'Achieved';
}

export type Workspace = {
  id: number;
  name: string;
  manager_id: number;
  created_at: string;
  type: 'personal' | 'team';
  invite_code: string;
}

export type TabType = 'tasks' | 'goals';

export type WorkspaceDetailProps = {
  workspace: Workspace | null;
  members: Member[];
  tasks: Task[];
  goals: Goal[];
  inviteCode: string;
  currentUserId: number;
  onWorkspaceRename: (_name: string) => Promise<void>;
  onMemberRoleChange: (_memberId: number, _role: Member['role']) => void;
  onMemberRemove: (_memberId: number) => void;
  onTaskAdd: (_title: string) => void;
  onGoalAdd: (_title: string) => void;
}
