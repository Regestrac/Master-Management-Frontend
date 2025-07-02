import { useThemeStore } from 'stores/themeStore';

const allTasks = [
  {
    id: 1,
    title: 'Design new landing page',
    status: 'in-progress',
    time: '2h 15m',
    priority: 'high',
    streak: 5,
    dueDate: '2025-06-28',
    category: 'Design',
    description: 'Create a modern, responsive landing page for the new product launch',
    subtasks: [
      { id: 11, title: 'Create wireframes', completed: true },
      { id: 12, title: 'Design mockups', completed: true },
      { id: 13, title: 'Code HTML/CSS', completed: false },
    ],
    checklist: [
      { id: 101, text: 'Research competitor designs', completed: true },
      { id: 102, text: 'Gather brand assets', completed: true },
      { id: 103, text: 'Test on mobile devices', completed: false },
    ],
    notes: 'Focus on mobile-first design approach. Use the new brand colors.',
    tags: ['urgent', 'design', 'frontend'],
  },
  {
    id: 2,
    title: 'Review code submissions',
    status: 'completed',
    time: '45m',
    priority: 'medium',
    streak: 3,
    dueDate: '2025-06-27',
    category: 'Development',
    description: 'Review and provide feedback on team code submissions',
    subtasks: [
      { id: 21, title: 'Review PR #123', completed: true },
      { id: 22, title: 'Review PR #124', completed: true },
    ],
    checklist: [
      { id: 201, text: 'Check code quality', completed: true },
      { id: 202, text: 'Test functionality', completed: true },
      { id: 203, text: 'Provide feedback', completed: true },
    ],
    notes: 'All submissions look good. Approved both PRs.',
    tags: ['review', 'development'],
  },
  {
    id: 3,
    title: 'Team standup meeting',
    status: 'pending',
    time: '0m',
    priority: 'low',
    streak: 0,
    dueDate: '2025-06-27',
    category: 'Meeting',
    description: 'Daily standup with the development team',
    subtasks: [],
    checklist: [
      { id: 301, text: 'Prepare updates', completed: false },
      { id: 302, text: 'Review blockers', completed: false },
    ],
    notes: 'Discuss the new feature roadmap',
    tags: ['meeting', 'daily'],
  },
  {
    id: 4,
    title: 'Update documentation',
    status: 'in-progress',
    time: '1h 30m',
    priority: 'medium',
    streak: 2,
    dueDate: '2025-06-29',
    category: 'Documentation',
    description: 'Update API documentation with new endpoints',
    subtasks: [
      { id: 41, title: 'Document new endpoints', completed: false },
      { id: 42, title: 'Update examples', completed: false },
      { id: 43, title: 'Review with team', completed: false },
    ],
    checklist: [
      { id: 401, text: 'Gather endpoint specs', completed: true },
      { id: 402, text: 'Write documentation', completed: false },
      { id: 403, text: 'Add code examples', completed: false },
    ],
    notes: 'Include authentication examples for all new endpoints',
    tags: ['documentation', 'api'],
  },
  {
    id: 5,
    title: 'Prepare quarterly presentation',
    status: 'pending',
    time: '0m',
    priority: 'high',
    streak: 0,
    dueDate: '2025-07-01',
    category: 'Presentation',
    description: 'Create Q2 results presentation for stakeholders',
    subtasks: [
      { id: 51, title: 'Gather metrics', completed: false },
      { id: 52, title: 'Create slides', completed: false },
      { id: 53, title: 'Practice presentation', completed: false },
    ],
    checklist: [
      { id: 501, text: 'Collect performance data', completed: false },
      { id: 502, text: 'Prepare visual charts', completed: false },
      { id: 503, text: 'Schedule rehearsal', completed: false },
    ],
    notes: 'Include comparison with Q1 results. Highlight key achievements.',
    tags: ['presentation', 'quarterly', 'important'],
  },
];

const getTaskStats = () => {
  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === 'completed').length;
  const inProgress = allTasks.filter((t) => t.status === 'in-progress').length;
  const pending = allTasks.filter((t) => t.status === 'pending').length;
  const overdue = allTasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

  return { total, completed, inProgress, pending, overdue };
};

const TaskStats = () => {
  const darkMode = useThemeStore((state) => state.theme) === 'dark';

  return (
    <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-8'>
      {(() => {
        const stats = getTaskStats();
        return [
          { label: 'Total', value: stats.total, color: 'from-blue-500 to-blue-600' },
          { label: 'Completed', value: stats.completed, color: 'from-green-500 to-green-600' },
          { label: 'In Progress', value: stats.inProgress, color: 'from-purple-500 to-purple-600' },
          { label: 'Pending', value: stats.pending, color: 'from-yellow-500 to-yellow-600' },
          { label: 'Overdue', value: stats.overdue, color: 'from-red-500 to-red-600' },
        ].map(({ label, value, color }, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`w-8 h-8 bg-gradient-to-r ${color} rounded-lg mb-2`} />
            <p className='text-2xl font-bold'>{value}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
          </div>
        ));
      })()}
    </div>
  );
};

export default TaskStats;