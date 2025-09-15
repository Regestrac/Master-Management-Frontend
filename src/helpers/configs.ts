import { SelectOptionType } from 'helpers/sharedTypes';

export const NAVBAR_LINKS = [
  { label: 'Dashboard', route: '/dashboard' },
  { label: 'Tasks', route: '/tasks' },
  { label: 'Settings', route: '/settings' },
];

export const PRIORITY_OPTIONS = [
  { label: 'High', value: 'high', color: '#fb2c36' },
  { label: 'Normal', value: 'normal', color: '#efb100' },
  { label: 'Low', value: 'low', color: '#00c951' },
];

export const STATUS_OPTIONS = [
  { label: 'To Do', value: 'todo', color: '#3b82f6' },
  { label: 'In Progress', value: 'inprogress', color: '#a855f7' },
  { label: 'Pending', value: 'pending', color: '#f59e0b' },
  { label: 'Paused', value: 'paused', color: '#6b7280' },
  { label: 'Completed', value: 'completed', color: '#22c55e' },
];

export const DATE_FORMAT_OPTIONS: SelectOptionType[] = [
  { label: 'MM/DD/YYYY (US)', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY (UK)', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD (ISO)', value: 'YYYY-MM-DD' },
  { label: 'DD.MM.YYYY (German)', value: 'DD.MM.YYYY' },
  { label: 'MM-DD-YYYY', value: 'MM-DD-YYYY' },
  { label: 'DD-MM-YYYY', value: 'DD-MM-YYYY' },
];

export const TIME_FORMAT_OPTIONS: SelectOptionType[] = [
  { label: '12-hour (AM/PM)', value: '12' },
  { label: '24-hour', value: '24' },
];

export const FIRST_DAY_OPTIONS: SelectOptionType[] = [
  { label: 'Sunday', value: 'sunday' },
  { label: 'Monday', value: 'monday' },
  { label: 'Saturday', value: 'saturday' },
];

export const WORK_WEEK_OPTIONS: SelectOptionType[] = [
  { label: 'Monday to Friday (5 days)', value: '5' },
  { label: 'Monday to Saturday (6 days)', value: '6' },
  { label: 'Full Week (7 days)', value: '7' },
  { label: 'Custom', value: 'custom' },
];

export const LONG_BREAK_SESSIONS_OPTIONS: SelectOptionType[] = [
  { label: '2 sessions', value: 2 },
  { label: '3 sessions', value: 3 },
  { label: '4 sessions', value: 4 },
  { label: '5 sessions', value: 5 },
];

export const GOAL_DURATION_OPTIONS: SelectOptionType[] = [
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 1 },
  { label: '2 hours', value: 2 },
  { label: '3 hours', value: 3 },
  { label: '4 hours', value: 4 },
];

export const WEEKLY_TARGET_OPTIONS: SelectOptionType[] = [
  { label: '5 hours', value: 5 },
  { label: '10 hours', value: 10 },
  { label: '15 hours', value: 15 },
  { label: '20 hours', value: 20 },
  { label: '25 hours', value: 25 },
];