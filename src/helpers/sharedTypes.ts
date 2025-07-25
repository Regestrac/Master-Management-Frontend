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
  color: string;
  border: string;
};