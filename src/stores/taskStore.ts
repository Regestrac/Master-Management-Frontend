import { create } from 'zustand';

type TaskType = {
  id: number;
  title: string;
  status: 'completed' | 'incomplete';
  timeSpend: number;
};

type TaskDetailsType = TaskType & {
  startedAt: string;
  description: string;
  parent_id: number;
};

type TasksStateType = {
  tasks: TaskType[];
  recentTasks: TaskType[];
  shouldStartTimer: boolean;
  currentTaskDetails: TaskDetailsType;
  updateCurrentTaskDetails: (_task: TaskDetailsType) => void;
  addTask: (_newTask: TaskType | TaskType[]) => void;
  updateTask: (_task: TaskType) => void;
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
  updateTask: (updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
    ),
  })),
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
