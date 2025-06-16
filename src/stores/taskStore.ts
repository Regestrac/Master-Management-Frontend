import { create } from 'zustand';

type TaskType = {
  id: number;
  title: string;
  status: 'completed' | 'incomplete';
  timeSpend: number;
};

type TasksStateType = {
  tasks: TaskType[];
  recentTasks: TaskType[];
  addTask: (_newTask: TaskType | TaskType[]) => void;
  updateTask: (_task: TaskType) => void;
  deleteTask: (_id: number) => void;
  updateRecentTask: (_task: TaskType) => void;
};

export const useTaskStore = create<TasksStateType>()((set) => ({
  tasks: [],
  recentTasks: [],
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
    const filtered = state.recentTasks.filter((task: TaskType) => task.id !== updatedTask.id);
    const updatedRecentTasks = [updatedTask, ...filtered].slice(0, 5);
    return { recentTasks: updatedRecentTasks };
  }),
}));
