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

type TaskDetailsType = TaskType & {
  startedAt: string;
  description: string;
  parent_id: number;
  checklist: ChecklistType[];
  stickyNotes: StickyNotesType[]
  tags: string[];
  comments: CommentsType[];
};

type TasksStateType = {
  tasks: TaskType[];
  recentTasks: TaskType[];
  shouldStartTimer: boolean;
  currentTaskDetails: TaskDetailsType;
  updateCurrentTaskDetails: (_task: TaskDetailsType) => void;
  addTask: (_newTask: TaskType | TaskType[]) => void;
  updateTask: (_task: Partial<TaskType> & { id: number; }) => void;
  deleteTask: (_id: number) => void;
  updateRecentTask: (_task: TaskType | TaskType[]) => void;
  updateStartTimer: (_value: boolean) => void;
  updateStartedAt: (_time: string) => void;
};

export const useTaskStore = create<TasksStateType>()((set) => ({
  tasks: [],
  recentTasks: [],
  shouldStartTimer: false,
  currentTaskDetails: {} as TaskDetailsType,
  updateCurrentTaskDetails: (task) => set({ currentTaskDetails: task }),
  addTask: (newTask) => set((state) => {
    const incoming = Array.isArray(newTask) ? newTask : [newTask];
    const mergedMap = new Map<number, TaskType>();
    // Add existing tasks to the map
    state.tasks.forEach((task) => mergedMap.set(task.id, task));
    // Overwrite or add new tasks from incoming
    incoming.forEach((task) => mergedMap.set(task.id, task));
    return { tasks: Array.from(mergedMap.values()) };
  }),
  updateTask: (updatedTask) => set((state) => {
    console.log('updatedTask: ', updatedTask);
    return ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
      ),
    });
  }),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
  updateRecentTask: (updatedTask) => set((state) => {
    const filtered = !Array.isArray(updatedTask) ? state.recentTasks.filter((task: TaskType) => task.id !== updatedTask.id) : [];
    const updatedRecentTasks = !Array.isArray(updatedTask) ? [updatedTask, ...filtered].slice(0, 5) : [];
    return { recentTasks: Array.isArray(updatedTask) ? updatedTask : updatedRecentTasks };
  }),
  updateStartTimer: (value) => set({ shouldStartTimer: value }),
  updateStartedAt: (value) => set((state) => ({ currentTaskDetails: { ...state.currentTaskDetails, startedAt: value } })),
}));
