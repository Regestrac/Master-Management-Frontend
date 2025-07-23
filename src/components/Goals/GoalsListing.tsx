import { useSearchParams } from 'react-router-dom';

import GoalCard from 'components/Goals/GoalCard';

const allGoals = [
  {
    id: 1,
    title: 'Learn React Advanced Patterns',
    progress: 75,
    streak: 15,
    totalTime: '24h',
    status: 'active',
    category: 'Learning',
    priority: 'high',
    startDate: '2025-05-01',
    targetDate: '2025-08-01',
    description: 'Master advanced React concepts including hooks, context, and performance optimization',
    milestones: [
      { id: 11, title: 'Complete hooks deep dive', completed: true, completedDate: '2025-05-15' },
      { id: 12, title: 'Build context API project', completed: true, completedDate: '2025-06-01' },
      { id: 13, title: 'Performance optimization study', completed: false, targetDate: '2025-07-01' },
      { id: 14, title: 'Build final project', completed: false, targetDate: '2025-07-15' },
    ],
    weeklyTarget: 8, // hours
    currentWeekHours: 6,
    tags: ['react', 'frontend', 'programming'],
    notes: 'Focus on practical implementation. Build at least one project per concept.',
    achievements: ['Week Warrior', 'Consistency King'],
  },
  {
    id: 2,
    title: 'Build Personal Portfolio',
    progress: 40,
    streak: 8,
    totalTime: '18h',
    status: 'active',
    category: 'Career',
    priority: 'high',
    startDate: '2025-06-01',
    targetDate: '2025-07-15',
    description: 'Create a stunning portfolio website to showcase my projects and skills',
    milestones: [
      { id: 21, title: 'Design wireframes', completed: true, completedDate: '2025-06-05' },
      { id: 22, title: 'Set up development environment', completed: true, completedDate: '2025-06-08' },
      { id: 23, title: 'Build main components', completed: false, targetDate: '2025-06-25' },
      { id: 24, title: 'Add projects section', completed: false, targetDate: '2025-07-05' },
      { id: 25, title: 'Deploy and optimize', completed: false, targetDate: '2025-07-15' },
    ],
    weeklyTarget: 10,
    currentWeekHours: 4,
    tags: ['portfolio', 'design', 'career'],
    notes: 'Make it responsive and include case studies for major projects.',
    achievements: ['Quick Starter'],
  },
  {
    id: 3,
    title: 'Read 12 Books This Year',
    progress: 60,
    streak: 22,
    totalTime: '45h',
    status: 'active',
    category: 'Personal',
    priority: 'medium',
    startDate: '2025-01-01',
    targetDate: '2025-12-31',
    description: 'Expand knowledge and improve focus through consistent reading habit',
    milestones: [
      { id: 31, title: 'Read 3 books (Q1)', completed: true, completedDate: '2025-03-31' },
      { id: 32, title: 'Read 6 books (Q2)', completed: true, completedDate: '2025-06-30' },
      { id: 33, title: 'Read 9 books (Q3)', completed: false, targetDate: '2025-09-30' },
      { id: 34, title: 'Read 12 books (Q4)', completed: false, targetDate: '2025-12-31' },
    ],
    weeklyTarget: 3, // hours
    currentWeekHours: 4,
    tags: ['reading', 'knowledge', 'habits'],
    notes: 'Mix of technical books, biographies, and fiction. Take notes on key insights.',
    achievements: ['Bookworm', 'Streak Master', 'Consistency King'],
  },
  {
    id: 4,
    title: 'Master TypeScript',
    progress: 25,
    streak: 5,
    totalTime: '12h',
    status: 'active',
    category: 'Learning',
    priority: 'medium',
    startDate: '2025-06-15',
    targetDate: '2025-09-15',
    description: 'Become proficient in TypeScript for better code quality and development experience',
    milestones: [
      { id: 41, title: 'Learn basic types and interfaces', completed: true, completedDate: '2025-06-20' },
      { id: 42, title: 'Advanced types and generics', completed: false, targetDate: '2025-07-15' },
      { id: 43, title: 'Build a TypeScript project', completed: false, targetDate: '2025-08-15' },
      { id: 44, title: 'Contribute to open source TS project', completed: false, targetDate: '2025-09-10' },
    ],
    weeklyTarget: 5,
    currentWeekHours: 3,
    tags: ['typescript', 'programming', 'development'],
    notes: 'Start with official TypeScript handbook. Build practical projects.',
    achievements: [],
  },
  {
    id: 5,
    title: 'Get Fit and Healthy',
    progress: 85,
    streak: 30,
    totalTime: '60h',
    status: 'active',
    category: 'Health',
    priority: 'high',
    startDate: '2025-05-01',
    targetDate: '2025-12-31',
    description: 'Establish a consistent fitness routine and healthy lifestyle habits',
    milestones: [
      { id: 51, title: 'Work out 3x per week for a month', completed: true, completedDate: '2025-06-01' },
      { id: 52, title: 'Reach target weight', completed: false, targetDate: '2025-08-01' },
      { id: 53, title: 'Run a 5K without stopping', completed: true, completedDate: '2025-06-15' },
      { id: 54, title: 'Maintain habits for 6 months', completed: false, targetDate: '2025-11-01' },
    ],
    weeklyTarget: 4, // workouts
    currentWeekHours: 3,
    tags: ['fitness', 'health', 'lifestyle'],
    notes: 'Focus on consistency over intensity. Track nutrition and sleep too.',
    achievements: ['Streak Master', 'Fitness Fanatic', 'Consistency King', 'Month Champion'],
  },
  {
    id: 6,
    title: 'Launch Side Business',
    progress: 15,
    streak: 0,
    totalTime: '8h',
    status: 'paused',
    category: 'Business',
    priority: 'low',
    startDate: '2025-06-01',
    targetDate: '2025-12-01',
    description: 'Start a profitable side business to generate additional income',
    milestones: [
      { id: 61, title: 'Research market opportunities', completed: true, completedDate: '2025-06-10' },
      { id: 62, title: 'Validate business idea', completed: false, targetDate: '2025-07-01' },
      { id: 63, title: 'Build MVP', completed: false, targetDate: '2025-09-01' },
      { id: 64, title: 'Get first customers', completed: false, targetDate: '2025-11-01' },
    ],
    weeklyTarget: 6,
    currentWeekHours: 0,
    tags: ['business', 'entrepreneurship', 'income'],
    notes: 'Paused to focus on portfolio completion. Will resume next month.',
    achievements: [],
  },
];

const GoalsListing = () => {
  const [searchParams] = useSearchParams();

  const view = searchParams.get('view') as 'list' | 'grid' || 'list';

  return (
    <div className={view === 'list' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'}>
      {allGoals.map((goal) => (
        <GoalCard
          key={goal.id}
          isActive={false}
          goal={goal}
          view={view}
        />
      ))}
    </div>
  );
};

export default GoalsListing;