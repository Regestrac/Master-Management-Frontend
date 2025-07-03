export type ThemeType = 'dark' | 'black' | 'red' | 'green' | 'blue' | 'purple' | 'cyan' | 'white';

export type TaskType = {
  id: number;
  title: string;
  status: 'completed' | 'todo' | 'inprogress' | 'pending' | 'paused';
  time_spend: number;
  priority: 'high' | 'normal' | 'low';
  streak: number;
  due_date: string;
  category: string;
  type: 'goal' | 'task';
};