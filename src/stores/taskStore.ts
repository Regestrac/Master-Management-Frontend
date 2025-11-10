import { create } from 'zustand';

import { TaskType } from 'src/helpers/sharedTypes';

type ChecklistType = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  completed_at: string;
};

type StickyNotesType = {
  id: number;
  created_at: string;
  text: string;
  bg_color: string;
  text_color: string;
};

type CommentsType = {
  id: number;
  user: string;
  content: string;
  timestamp: string;
  edited?: boolean;
  color?: string;
  avatar?: string;
};

type SubtaskType = TaskDetailsType & {
  parent_id: number;
  checklist_completed: number;
  checklist_total: number;
  completed_at?: string;
};

type TaskDetailsType = TaskType & {
  id: number;
  startedAt: string;
  description: string;
  parent_id: number;
  checklists: ChecklistType[];
  notes: StickyNotesType[]
  tags: string[];
  comments: CommentsType[];
  progress: number;
  subtasks: SubtaskType[];
};

type TasksStateType = {
  tasks: TaskType[];
  shouldStartTimer: boolean;
  currentTaskDetails: TaskDetailsType;
  recentTaskData: Partial<TaskType>;
  updateCurrentTaskDetails: (_task: Partial<TaskDetailsType>) => void;
  addTask: (_newTask: TaskType | TaskType[], _type?: 'merge' | 'replace') => void;
  updateTask: (_task: Partial<TaskType> & { id: number; }) => void;
  updateTaskProgress: (_taskId: number, _progress: number) => void;
  deleteTask: (_id: number) => void;
  updateStartTimer: (_value: boolean) => void;
  updateStartedAt: (_time: string) => void;
  updateRecentTaskData: (_task: Partial<TaskType> & { id: number; }) => void;
  clearRecentTaskData: () => void;
};

export const useTaskStore = create<TasksStateType>()((set) => ({
  tasks: [],
  shouldStartTimer: false,
  currentTaskDetails: {} as TaskDetailsType,
  recentTaskData: {},
  updateCurrentTaskDetails: (task) => set((state) => ({ currentTaskDetails: { ...state.currentTaskDetails, ...task } })),
  addTask: (newTask, type) => set((state) => {
    if (type === 'replace') {
      return { tasks: Array.isArray(newTask) ? newTask : [newTask] };
    } else {
      const incoming = Array.isArray(newTask) ? newTask : [newTask];
      const mergedMap = new Map<number, TaskType>();
      // Add existing tasks to the map
      state.tasks.forEach((task) => mergedMap.set(task.id, task));
      // Overwrite or add new tasks from incoming
      incoming.forEach((task) => mergedMap.set(task.id, task));
      return { tasks: Array.from(mergedMap.values()) };
    }
  }),
  updateTask: (updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
    ),
  })),
  updateTaskProgress: (taskId, progress) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, progress } : task,
    ),
    currentTaskDetails: state.currentTaskDetails.id === taskId
      ? { ...state.currentTaskDetails, progress }
      : state.currentTaskDetails,
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
  updateStartTimer: (value) => set({ shouldStartTimer: value }),
  updateStartedAt: (value) => set((state) => ({ currentTaskDetails: { ...state.currentTaskDetails, startedAt: value } })),
  updateRecentTaskData: (updatedTask) => set(() => ({ recentTaskData: updatedTask })),
  clearRecentTaskData: () => set(() => ({ recentTaskData: {} })),
}));
