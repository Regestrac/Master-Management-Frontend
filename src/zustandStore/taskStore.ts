import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type TaskType = {
  id: number;
  task: string;
  status: 'completed' | 'incomplete';
  timeSpend: number;
};

type TasksStateType = {
  tasks: TaskType[];
  recentTasks: TaskType[];
  addTask: (_newTask: TaskType) => void;
  updateTask: (_task: TaskType) => void;
  deleteTask: (_id: number) => void;
  updateRecentTask: (_task: TaskType) => void;
};

export const useTaskStore = create<TasksStateType>()(persist(
  (set, get) => ({
    tasks: [],
    recentTasks: [],
    addTask: (newTask) => set({ tasks: [...get().tasks, newTask] }),
    updateTask: (updatedTask) =>
      set({
        tasks: get().tasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
        ),
      }),
    deleteTask: (id) =>
      set({ tasks: get().tasks?.filter((task) => task?.id !== id) }),
    updateRecentTask: (updatedTask) => {
      const filtered = get().recentTasks.filter((task) => task.id !== updatedTask.id);
      const updatedRecents = [updatedTask, ...filtered].slice(0, 5);
      set({ recentTasks: updatedRecents });
    },
  }),
  {
    name: 'tasks-storage',
    storage: createJSONStorage(() => sessionStorage),
  },
));