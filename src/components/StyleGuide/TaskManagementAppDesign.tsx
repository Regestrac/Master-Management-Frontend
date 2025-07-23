import { useState } from 'react';

import { Play, Pause, Plus, Target, Clock, Flame, Trophy, Settings, User, Home, CheckSquare, BarChart3, Calendar, Search, Bell, Moon, Sun } from 'lucide-react';

const TaskManagementAppDesign = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTimer, setActiveTimer] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [viewMode, setViewMode] = useState('list');
  const [selectedTasks, setSelectedTasks] = useState<any[]>([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [goalFilter, setGoalFilter] = useState('all');
  const [goalSort, setGoalSort] = useState('progress');
  const [selectedGoals, setSelectedGoals] = useState<any[]>([]);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [goalViewMode, setGoalViewMode] = useState('cards');

  // Task Creation Modal State
  const [taskCreationStep, setTaskCreationStep] = useState(1);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    tags: [] as string[],
    subtasks: [] as any[],
    checklist: [] as any[],
    notes: '',
    template: null,
  });

  // Goal Creation Modal State
  const [goalCreationStep, setGoalCreationStep] = useState(1);
  const [goalFormData, setGoalFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    startDate: '',
    targetDate: '',
    weeklyTarget: 5,
    tags: [] as string[],
    milestones: [] as any[],
    notes: '',
    template: null,
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentSubtask, setCurrentSubtask] = useState('');
  const [currentChecklist, setCurrentChecklist] = useState('');
  const [currentMilestone, setCurrentMilestone] = useState({ title: '', targetDate: '' });

  // Sample data
  const userStats = {
    totalTasks: 47,
    completedToday: 8,
    currentStreak: 12,
    totalHours: 156,
  };

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

  const recentTasks = allTasks.slice(0, 4);

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

  const goals = allGoals.slice(0, 3);

  const toggleTimer = (taskId: any) => {
    setActiveTimer(activeTimer === taskId ? null : taskId);
  };

  const toggleTaskSelection = (taskId: any) => {
    setSelectedTasks((prev: any) =>
      prev.includes(taskId)
        ? prev.filter((id: any) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const toggleTaskExpanded = (taskId: any) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const getFilteredTasks = () => {
    let filtered = allTasks;

    if (taskFilter !== 'all') {
      filtered = filtered.filter((task) => task.status === taskFilter);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        }
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  };

  const getTaskStats = () => {
    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.status === 'completed').length;
    const inProgress = allTasks.filter((t) => t.status === 'in-progress').length;
    const pending = allTasks.filter((t) => t.status === 'pending').length;
    const overdue = allTasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

    return { total, completed, inProgress, pending, overdue };
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString).getTime();
    const today = new Date().getTime();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) { return 'Today'; }
    if (diffDays === 1) { return 'Tomorrow'; }
    if (diffDays === -1) { return 'Yesterday'; }
    if (diffDays < 0) { return `${Math.abs(diffDays)} days overdue`; }
    return `${diffDays} days left`;
  };

  const toggleGoalSelection = (goalId: any) => {
    setSelectedGoals((prev: any) =>
      prev.includes(goalId)
        ? prev.filter((id: any) => id !== goalId)
        : [...prev, goalId],
    );
  };

  const toggleGoalExpanded = (goalId: any) => {
    setExpandedGoal(expandedGoal === goalId ? null : goalId);
  };

  const getFilteredGoals = () => {
    let filtered = allGoals;

    if (goalFilter !== 'all') {
      if (goalFilter === 'active') {
        filtered = filtered.filter((goal) => goal.status === 'active');
      } else if (goalFilter === 'completed') {
        filtered = filtered.filter((goal) => goal.status === 'completed');
      } else if (goalFilter === 'paused') {
        filtered = filtered.filter((goal) => goal.status === 'paused');
      } else {
        filtered = filtered.filter((goal) => goal.category.toLowerCase() === goalFilter.toLowerCase());
      }
    }

    return filtered.sort((a, b) => {
      switch (goalSort) {
        case 'progress':
          return b.progress - a.progress;
        case 'streak':
          return b.streak - a.streak;
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        }
        case 'deadline':
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
        default:
          return 0;
      }
    });
  };

  const getGoalStats = () => {
    const total = allGoals.length;
    const active = allGoals.filter((g) => g.status === 'active').length;
    const completed = allGoals.filter((g) => g.status === 'completed').length;
    const paused = allGoals.filter((g) => g.status === 'paused').length;
    const highPriority = allGoals.filter((g) => g.priority === 'high' && g.status === 'active').length;
    const averageProgress = Math.round(allGoals.reduce((sum, goal) => sum + goal.progress, 0) / total);

    return { total, active, completed, paused, highPriority, averageProgress };
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'active': return 'text-blue-400 bg-blue-400/10';
      case 'in-progress': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-gray-400 bg-gray-400/10';
      case 'paused': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryColor = (category: any) => {
    switch (category.toLowerCase()) {
      case 'learning': return 'bg-purple-500';
      case 'career': return 'bg-blue-500';
      case 'personal': return 'bg-green-500';
      case 'health': return 'bg-red-500';
      case 'business': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getWeeklyProgress = (goal: any) => {
    return Math.min(100, Math.round((goal.currentWeekHours / goal.weeklyTarget) * 100));
  };

  // Task Templates
  const taskTemplates = [
    {
      id: 1,
      name: 'Development Task',
      icon: '💻',
      category: 'Development',
      priority: 'medium',
      subtasks: ['Plan implementation', 'Write code', 'Test functionality', 'Review code'],
      checklist: ['Check requirements', 'Set up environment', 'Run tests', 'Update documentation'],
      tags: ['development', 'coding'],
    },
    {
      id: 2,
      name: 'Design Project',
      icon: '🎨',
      category: 'Design',
      priority: 'high',
      subtasks: ['Research inspiration', 'Create wireframes', 'Design mockups', 'Get feedback'],
      checklist: ['Gather assets', 'Choose color palette', 'Create style guide', 'Export files'],
      tags: ['design', 'creative'],
    },
    {
      id: 3,
      name: 'Meeting Preparation',
      icon: '📅',
      category: 'Meeting',
      priority: 'medium',
      subtasks: ['Set agenda', 'Prepare materials', 'Send invites'],
      checklist: ['Book room', 'Test equipment', 'Prepare notes', 'Share documents'],
      tags: ['meeting', 'preparation'],
    },
    {
      id: 4,
      name: 'Content Creation',
      icon: '📝',
      category: 'Content',
      priority: 'medium',
      subtasks: ['Research topic', 'Create outline', 'Write draft', 'Edit and review'],
      checklist: ['Check facts', 'Optimize for SEO', 'Add images', 'Proofread'],
      tags: ['content', 'writing'],
    },
  ];

  // Goal Templates
  const goalTemplates = [
    {
      id: 1,
      name: 'Learn New Technology',
      icon: '📚',
      category: 'Learning',
      priority: 'high',
      weeklyTarget: 8,
      milestones: [
        { title: 'Complete basic course', targetDate: '+30 days' },
        { title: 'Build first project', targetDate: '+60 days' },
        { title: 'Advanced concepts', targetDate: '+90 days' },
        { title: 'Expert level project', targetDate: '+120 days' },
      ],
      tags: ['learning', 'technology', 'skills'],
    },
    {
      id: 2,
      name: 'Health & Fitness',
      icon: '💪',
      category: 'Health',
      priority: 'high',
      weeklyTarget: 5,
      milestones: [
        { title: 'Establish routine', targetDate: '+14 days' },
        { title: 'First milestone', targetDate: '+30 days' },
        { title: 'Halfway point', targetDate: '+90 days' },
        { title: 'Achieve target', targetDate: '+180 days' },
      ],
      tags: ['health', 'fitness', 'lifestyle'],
    },
    {
      id: 3,
      name: 'Career Development',
      icon: '🚀',
      category: 'Career',
      priority: 'high',
      weeklyTarget: 6,
      milestones: [
        { title: 'Skill assessment', targetDate: '+7 days' },
        { title: 'Create development plan', targetDate: '+21 days' },
        { title: 'Complete training', targetDate: '+90 days' },
        { title: 'Apply new skills', targetDate: '+120 days' },
      ],
      tags: ['career', 'professional', 'growth'],
    },
    {
      id: 4,
      name: 'Creative Project',
      icon: '🎭',
      category: 'Personal',
      priority: 'medium',
      weeklyTarget: 4,
      milestones: [
        { title: 'Brainstorm ideas', targetDate: '+7 days' },
        { title: 'Create prototype', targetDate: '+30 days' },
        { title: 'Refine and improve', targetDate: '+60 days' },
        { title: 'Share with others', targetDate: '+90 days' },
      ],
      tags: ['creative', 'art', 'personal'],
    },
  ];

  // Form Handlers
  const updateTaskFormData = (field: any, value: any) => {
    setTaskFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateGoalFormData = (field: any, value: any) => {
    setGoalFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTaskTag = () => {
    if (currentTag.trim() && !taskFormData.tags.includes(currentTag.trim())) {
      updateTaskFormData('tags', [...taskFormData.tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTaskTag = (tagToRemove: any) => {
    updateTaskFormData('tags', taskFormData.tags.filter((tag) => tag !== tagToRemove));
  };

  const addSubtask = () => {
    if (currentSubtask.trim()) {
      const newSubtask = {
        id: Date.now(),
        title: currentSubtask.trim(),
        completed: false,
      };
      updateTaskFormData('subtasks', [...taskFormData.subtasks, newSubtask]);
      setCurrentSubtask('');
    }
  };

  const removeSubtask = (subtaskId: any) => {
    updateTaskFormData('subtasks', taskFormData.subtasks.filter((st) => st.id !== subtaskId));
  };

  const addChecklistItem = () => {
    if (currentChecklist.trim()) {
      const newItem = {
        id: Date.now(),
        text: currentChecklist.trim(),
        completed: false,
      };
      updateTaskFormData('checklist', [...taskFormData.checklist, newItem]);
      setCurrentChecklist('');
    }
  };

  const removeChecklistItem = (itemId: any) => {
    updateTaskFormData('checklist', taskFormData.checklist.filter((item) => item.id !== itemId));
  };

  const addGoalTag = () => {
    if (currentTag.trim() && !goalFormData.tags.includes(currentTag.trim())) {
      updateGoalFormData('tags', [...goalFormData.tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeGoalTag = (tagToRemove: any) => {
    updateGoalFormData('tags', goalFormData.tags.filter((tag) => tag !== tagToRemove));
  };

  const addMilestone = () => {
    if (currentMilestone.title.trim() && currentMilestone.targetDate) {
      const newMilestone = {
        id: Date.now(),
        title: currentMilestone.title.trim(),
        targetDate: currentMilestone.targetDate,
        completed: false,
      };
      updateGoalFormData('milestones', [...goalFormData.milestones, newMilestone]);
      setCurrentMilestone({ title: '', targetDate: '' });
    }
  };

  const removeMilestone = (milestoneId: any) => {
    updateGoalFormData('milestones', goalFormData.milestones.filter((m) => m.id !== milestoneId));
  };

  const applyTaskTemplate = (template: any) => {
    setTaskFormData((prev) => ({
      ...prev,
      category: template.category,
      priority: template.priority,
      tags: template.tags,
      subtasks: template.subtasks.map((title: any, index: any) => ({
        id: Date.now() + index,
        title,
        completed: false,
      })),
      checklist: template.checklist.map((text: any, index: any) => ({
        id: Date.now() + index + 1000,
        text,
        completed: false,
      })),
      template: template.id,
    }));
    setTaskCreationStep(2);
  };

  const applyGoalTemplate = (template: any) => {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const targetDate = new Date(today.getTime() + (120 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    setGoalFormData((prev) => ({
      ...prev,
      category: template.category,
      priority: template.priority,
      weeklyTarget: template.weeklyTarget,
      tags: template.tags,
      startDate,
      targetDate,
      milestones: template.milestones.map((milestone: any, index: any) => {
        const daysToAdd = parseInt(milestone.targetDate.replace('+', '').replace(' days', ''));
        const milestoneDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
        return {
          id: Date.now() + index,
          title: milestone.title,
          targetDate: milestoneDate.toISOString().split('T')[0],
          completed: false,
        };
      }),
      template: template.id,
    }));
    setGoalCreationStep(2);
  };

  const resetTaskForm = () => {
    setTaskFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      dueDate: '',
      tags: [],
      subtasks: [],
      checklist: [],
      notes: '',
      template: null,
    });
    setTaskCreationStep(1);
  };

  const resetGoalForm = () => {
    setGoalFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      startDate: '',
      targetDate: '',
      weeklyTarget: 5,
      tags: [],
      milestones: [],
      notes: '',
      template: null,
    });
    setGoalCreationStep(1);
  };

  const handleCreateTask = () => {
    // Here you would typically save the task to your backend
    // console.log('Creating task:', taskFormData);
    setShowCreateTask(false);
    resetTaskForm();
  };

  const handleCreateGoal = () => {
    // Here you would typically save the goal to your backend
    // console.log('Creating goal:', goalFormData);
    setShowCreateGoal(false);
    resetGoalForm();
  };

  const getPriorityColor = (priority: any) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // const theme = darkMode ? 'dark' : 'light';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-colors duration-300`}>
        <div className='p-6'>
          <div className='flex items-center space-x-3 mb-8'>
            <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
              <Target className='w-6 h-6 text-white' />
            </div>
            <h1 className='text-xl font-bold'>TaskFlow Pro</h1>
          </div>

          <nav className='space-y-2'>
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard' },
              { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
              { id: 'goals', icon: Target, label: 'Goals' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics' },
              { id: 'calendar', icon: Calendar, label: 'Calendar' },
              { id: 'profile', icon: User, label: 'Profile' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === id
                  ? 'bg-purple-500 text-white'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Icon className='w-5 h-5' />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className='ml-64 p-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-3xl font-bold mb-2'>Good Morning, Alex! 👋</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>You have 5 tasks scheduled for today</p>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search tasks...'
                className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <Bell className='w-5 h-5' />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          {[
            { icon: CheckSquare, label: 'Total Tasks', value: userStats.totalTasks, color: 'from-blue-500 to-blue-600' },
            { icon: Trophy, label: 'Completed Today', value: userStats.completedToday, color: 'from-green-500 to-green-600' },
            { icon: Flame, label: 'Current Streak', value: `${userStats.currentStreak} days`, color: 'from-orange-500 to-orange-600' },
            { icon: Clock, label: 'Total Hours', value: `${userStats.totalHours}h`, color: 'from-purple-500 to-purple-600' },
          ].map(({ icon: Icon, label, value, color }, index) => (
            <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className='flex items-center justify-between'>
                <div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>{label}</p>
                  <p className='text-2xl font-bold mt-1'>{value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
                  <Icon className='w-6 h-6 text-white' />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tasks Page Content */}
        {activeTab === 'tasks' && (
          <div>
            {/* Task Stats */}
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

            {/* Task Controls */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
              <div className='flex flex-wrap items-center gap-4'>
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value='all'>All Tasks</option>
                  <option value='pending'>Pending</option>
                  <option value='in-progress'>In Progress</option>
                  <option value='completed'>Completed</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value='priority'>Sort by Priority</option>
                  <option value='dueDate'>Sort by Due Date</option>
                  <option value='status'>Sort by Status</option>
                </select>

                <div className='flex rounded-lg border border-gray-300 overflow-hidden'>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
                  >
                    <CheckSquare className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 ${viewMode === 'kanban' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
                  >
                    <BarChart3 className='w-4 h-4' />
                  </button>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                {selectedTasks.length > 0 && (
                  <div className='flex items-center gap-2'>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedTasks.length}
                      {' '}
                      selected
                    </span>
                    <button className='px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600'>
                      Delete
                    </button>
                    <button className='px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600'>
                      Complete
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowCreateTask(true)}
                  className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                  <span>New Task</span>
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className='space-y-4'>
              {getFilteredTasks().map((task) => (
                <div key={task.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm hover:shadow-md transition-all duration-200`}>
                  <div className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4 flex-1'>
                        <input
                          type='checkbox'
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => toggleTaskSelection(task.id)}
                          className='w-4 h-4 text-purple-600 rounded focus:ring-purple-500'
                        />
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        <div className='flex-1'>
                          <div className='flex items-center gap-3 mb-2'>
                            <h4 className='font-semibold text-lg'>{task.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                              {task.category}
                            </span>
                          </div>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>
                            {task.description}
                          </p>
                          <div className='flex flex-wrap items-center gap-4 text-sm'>
                            <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center`}>
                              <Clock className='w-4 h-4 mr-1' />
                              {task.time}
                            </span>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center`}>
                              <Calendar className='w-4 h-4 mr-1' />
                              {formatDate(task.dueDate)}
                            </span>
                            {task.streak > 0 && (
                              <span className='text-orange-500 flex items-center'>
                                <Flame className='w-4 h-4 mr-1' />
                                {task.streak}
                                {' '}
                                day streak
                              </span>
                            )}
                            <div className='flex gap-1'>
                              {task.tags.map((tag, index) => (
                                <span key={index} className='px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs'>
                                  #
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => toggleTaskExpanded(task.id)}
                          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                        >
                          <svg className={`w-5 h-5 transform transition-transform ${expandedTask === task.id ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleTimer(task.id)}
                          className={`p-3 rounded-lg transition-colors ${activeTimer === task.id
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'}`}
                        >
                          {activeTimer === task.id ? <Pause className='w-5 h-5' /> : <Play className='w-5 h-5' />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Task Details */}
                  {expandedTask === task.id && (
                    <div className={`border-t px-6 py-4 ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {/* Subtasks */}
                        <div>
                          <h5 className='font-semibold mb-3 flex items-center'>
                            <CheckSquare className='w-4 h-4 mr-2' />
                            Subtasks (
                            {task.subtasks.filter((st) => st.completed).length}
                            /
                            {task.subtasks.length}
                            )
                          </h5>
                          <div className='space-y-2'>
                            {task.subtasks.map((subtask) => (
                              <div key={subtask.id} className='flex items-center space-x-3'>
                                <input
                                  type='checkbox'
                                  checked={subtask.completed}
                                  className='w-4 h-4 text-green-600 rounded'
                                  readOnly
                                />
                                <span className={`${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                                  {subtask.title}
                                </span>
                              </div>
                            ))}
                            {task.subtasks.length === 0 && (
                              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No subtasks</p>
                            )}
                          </div>
                        </div>

                        {/* Checklist */}
                        <div>
                          <h5 className='font-semibold mb-3 flex items-center'>
                            <Trophy className='w-4 h-4 mr-2' />
                            Checklist (
                            {task.checklist.filter((item) => item.completed).length}
                            /
                            {task.checklist.length}
                            )
                          </h5>
                          <div className='space-y-2'>
                            {task.checklist.map((item) => (
                              <div key={item.id} className='flex items-center space-x-3'>
                                <input
                                  type='checkbox'
                                  checked={item.completed}
                                  className='w-4 h-4 text-purple-600 rounded'
                                  readOnly
                                />
                                <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {task.notes && (
                        <div className='mt-4'>
                          <h5 className='font-semibold mb-2'>Notes</h5>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} bg-gradient-to-r from-purple-50 to-pink-50 ${darkMode ? 'from-purple-900/20 to-pink-900/20' : ''} p-3 rounded-lg`}>
                            {task.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Page Content */}
        {activeTab === 'analytics' && (
          <div>
            {/* Analytics Header */}
            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8'>
              <div>
                <h3 className='text-2xl font-bold mb-2'>Analytics & Insights</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Track your productivity patterns and goal progress
                </p>
              </div>
              <div className='flex items-center gap-4'>
                <select className={`px-4 py-2 rounded-lg border ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value='7d'>Last 7 days</option>
                  <option value='30d'>Last 30 days</option>
                  <option value='90d'>Last 90 days</option>
                  <option value='1y'>Last year</option>
                </select>
                <button className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                  </svg>
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              {[
                {
                  title: 'Productivity Score',
                  value: '87%',
                  change: '+12%',
                  trend: 'up',
                  icon: '📊',
                  color: 'from-blue-500 to-blue-600',
                  description: 'Overall productivity this week',
                },
                {
                  title: 'Tasks Completed',
                  value: '156',
                  change: '+8',
                  trend: 'up',
                  icon: '✅',
                  color: 'from-green-500 to-green-600',
                  description: 'Tasks completed this month',
                },
                {
                  title: 'Focus Time',
                  value: '28.5h',
                  change: '+3.2h',
                  trend: 'up',
                  icon: '⏱️',
                  color: 'from-purple-500 to-purple-600',
                  description: 'Deep work hours this week',
                },
                {
                  title: 'Goal Progress',
                  value: '73%',
                  change: '+15%',
                  trend: 'up',
                  icon: '🎯',
                  color: 'from-orange-500 to-orange-600',
                  description: 'Average goal completion',
                },
              ].map((metric, index) => (
                <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-200`}>
                  <div className='flex items-center justify-between mb-4'>
                    <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center text-xl`}>
                      {metric.icon}
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${metric.trend === 'up'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'}`}
                    >
                      <svg className={`w-3 h-3 ${metric.trend === 'up' ? 'transform rotate-0' : 'transform rotate-180'}`} fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z' clipRule='evenodd' />
                      </svg>
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className='text-2xl font-bold mb-1'>{metric.value}</h4>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
              {/* Productivity Trend Chart */}
              <div className='lg:col-span-2'>
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <div className='flex items-center justify-between mb-6'>
                    <div>
                      <h4 className='text-xl font-bold mb-1'>Productivity Trend</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily focus hours over time</p>
                    </div>
                    <div className='flex space-x-2'>
                      <button className='px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium'>Hours</button>
                      <button className={`px-3 py-1 rounded-lg text-sm font-medium ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Tasks</button>
                    </div>
                  </div>

                  {/* Chart Placeholder - would use a real chart library like Chart.js or Recharts */}
                  <div className='relative h-64'>
                    <svg className='w-full h-full' viewBox='0 0 400 200'>
                      <defs>
                        <linearGradient id='chartGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                          <stop offset='0%' stopColor='#A855F7' stopOpacity='0.3' />
                          <stop offset='100%' stopColor='#A855F7' stopOpacity='0.05' />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      {[0, 50, 100, 150, 200].map((y) => (
                        <line key={y} x1='40' y1={y} x2='380' y2={y} stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='1' />
                      ))}
                      {[40, 100, 160, 220, 280, 340, 380].map((x) => (
                        <line key={x} x1={x} y1='0' x2={x} y2='200' stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='1' />
                      ))}

                      {/* Chart area */}
                      <path
                        d='M40,140 L80,120 L120,100 L160,80 L200,90 L240,70 L280,85 L320,65 L360,75 L380,60'
                        fill='url(#chartGradient)'
                        stroke='none'
                      />

                      {/* Chart line */}
                      <path
                        d='M40,140 L80,120 L120,100 L160,80 L200,90 L240,70 L280,85 L320,65 L360,75 L380,60'
                        fill='none'
                        stroke='#A855F7'
                        strokeWidth='3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />

                      {/* Data points */}
                      {[[40, 140], [80, 120], [120, 100], [160, 80], [200, 90], [240, 70], [280, 85], [320, 65], [360, 75], [380, 60]].map(([x, y], index) => (
                        <circle key={index} cx={x} cy={y} r='4' fill='#A855F7' stroke='white' strokeWidth='2' />
                      ))}

                      {/* Y-axis labels */}
                      <text x='30' y='15' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>8h</text>
                      <text x='30' y='65' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>6h</text>
                      <text x='30' y='115' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>4h</text>
                      <text x='30' y='165' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>2h</text>

                      {/* X-axis labels */}
                      <text x='35' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Mon</text>
                      <text x='95' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Tue</text>
                      <text x='155' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Wed</text>
                      <text x='215' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Thu</text>
                      <text x='275' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Fri</text>
                      <text x='335' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Sat</text>
                      <text x='375' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Sun</text>
                    </svg>
                  </div>

                  <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center space-x-4 text-sm'>
                      <div className='flex items-center space-x-2'>
                        <div className='w-3 h-3 bg-purple-500 rounded-full' />
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Focus Hours</span>
                      </div>
                      <span className='font-medium'>Peak: Thursday (7.2h)</span>
                    </div>
                    <span className='text-sm text-green-600 font-medium'>+18% vs last week</span>
                  </div>
                </div>
              </div>

              {/* Task Distribution */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                <div className='mb-6'>
                  <h4 className='text-xl font-bold mb-1'>Task Distribution</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks by category this month</p>
                </div>

                {/* Donut Chart Placeholder */}
                <div className='flex items-center justify-center mb-6'>
                  <div className='relative w-40 h-40'>
                    <svg className='w-40 h-40 transform -rotate-90' viewBox='0 0 100 100'>
                      {/* Background circle */}
                      <circle cx='50' cy='50' r='35' stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='8' fill='none' />

                      {/* Development - 40% */}
                      <circle
                        cx='50'
                        cy='50'
                        r='35'
                        stroke='#8B5CF6'
                        strokeWidth='8'
                        fill='none'
                        strokeDasharray='87.96'
                        strokeDashoffset='0'
                        strokeLinecap='round'
                      />

                      {/* Design - 25% */}
                      <circle
                        cx='50'
                        cy='50'
                        r='35'
                        stroke='#06B6D4'
                        strokeWidth='8'
                        fill='none'
                        strokeDasharray='54.98'
                        strokeDashoffset='-87.96'
                        strokeLinecap='round'
                      />

                      {/* Meeting - 20% */}
                      <circle
                        cx='50'
                        cy='50'
                        r='35'
                        stroke='#10B981'
                        strokeWidth='8'
                        fill='none'
                        strokeDasharray='43.98'
                        strokeDashoffset='-142.94'
                        strokeLinecap='round'
                      />

                      {/* Others - 15% */}
                      <circle
                        cx='50'
                        cy='50'
                        r='35'
                        stroke='#F59E0B'
                        strokeWidth='8'
                        fill='none'
                        strokeDasharray='32.99'
                        strokeDashoffset='-186.92'
                        strokeLinecap='round'
                      />
                    </svg>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <div className='text-2xl font-bold'>156</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tasks</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className='space-y-3'>
                  {[
                    { label: 'Development', value: '40%', count: '62', color: '#8B5CF6' },
                    { label: 'Design', value: '25%', count: '39', color: '#06B6D4' },
                    { label: 'Meetings', value: '20%', count: '31', color: '#10B981' },
                    { label: 'Others', value: '15%', count: '24', color: '#F59E0B' },
                  ].map((item, index) => (
                    <div key={index} className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
                        <span className='text-sm font-medium'>{item.label}</span>
                      </div>
                      <div className='flex items-center space-x-2 text-sm'>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.count}</span>
                        <span className='font-medium'>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
              {/* Goal Progress Overview */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <h4 className='text-xl font-bold mb-1'>Goal Progress</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active goals performance</p>
                  </div>
                  <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' />
                    </svg>
                  </button>
                </div>

                <div className='space-y-4'>
                  {[
                    { title: 'Learn React Advanced', progress: 75, target: 'Aug 1', color: '#8B5CF6', weekly: '6/8h' },
                    { title: 'Build Portfolio', progress: 40, target: 'Jul 15', color: '#06B6D4', weekly: '4/10h' },
                    { title: 'Read 12 Books', progress: 60, target: 'Dec 31', color: '#10B981', weekly: '4/3h' },
                    { title: 'Master TypeScript', progress: 25, target: 'Sep 15', color: '#F59E0B', weekly: '3/5h' },
                  ].map((goal, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                      <div className='flex items-center justify-between mb-3'>
                        <h5 className='font-medium'>{goal.title}</h5>
                        <div className='flex items-center space-x-2 text-sm'>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Due
                            {goal.target}
                          </span>
                          <span className='font-medium'>
                            {goal.progress}
                            %
                          </span>
                        </div>
                      </div>
                      <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mb-2`}>
                        <div
                          className='h-2 rounded-full transition-all duration-500'
                          style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
                        />
                      </div>
                      <div className='flex items-center justify-between text-xs'>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          This week:
                          {goal.weekly}
                        </span>
                        <span className={`px-2 py-1 rounded ${goal.progress >= 50
                          ? 'bg-green-100 text-green-600'
                          : goal.progress >= 25
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'}`}
                        >
                          {goal.progress >= 50 ? 'On Track' : goal.progress >= 25 ? 'Behind' : 'Critical'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Tracking Insights */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                <div className='mb-6'>
                  <h4 className='text-xl font-bold mb-1'>Time Insights</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your productivity patterns</p>
                </div>

                {/* Peak Hours */}
                <div className='mb-6'>
                  <h5 className='font-medium mb-3'>Peak Productivity Hours</h5>
                  <div className='grid grid-cols-12 gap-1 mb-2'>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i;
                      const intensity = hour >= 9 && hour <= 11 ? 0.9 :
                        hour >= 14 && hour <= 16 ? 0.7 :
                          hour >= 8 && hour <= 17 ? 0.4 : 0.1;
                      return (
                        <div
                          key={i}
                          className='h-8 rounded-sm relative group cursor-pointer transition-all hover:scale-110'
                          style={{
                            backgroundColor: `rgba(139, 92, 246, ${intensity})`,
                            border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                          }}
                        >
                          <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity'>
                            {hour}
                            :00
                            <br />
                            {Math.round(intensity * 100)}
                            %
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className='flex justify-between text-xs text-gray-500'>
                    <span>12 AM</span>
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM</span>
                    <span>11 PM</span>
                  </div>
                </div>

                {/* Weekly Pattern */}
                <div className='mb-6'>
                  <h5 className='font-medium mb-3'>Weekly Pattern</h5>
                  <div className='space-y-2'>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                      const values = [85, 92, 88, 95, 90, 45, 30];
                      const value = values[index];
                      return (
                        <div key={day} className='flex items-center justify-between'>
                          <span className='text-sm w-20'>{day.slice(0, 3)}</span>
                          <div className='flex-1 mx-3'>
                            <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                              <div
                                className='h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500'
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                          <span className='text-sm font-medium w-10 text-right'>
                            {value}
                            %
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                    <div className='text-lg font-bold text-purple-500'>10:30 AM</div>
                    <div className='text-xs text-gray-500'>Peak Hour</div>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                    <div className='text-lg font-bold text-green-500'>Thursday</div>
                    <div className='text-xs text-gray-500'>Best Day</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Streaks & Achievements */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                <div className='mb-6'>
                  <h4 className='text-xl font-bold mb-1'>Streaks & Achievements</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your milestones and wins</p>
                </div>

                <div className='space-y-4'>
                  {[
                    { title: 'Current Streak', value: '12 days', icon: '🔥', color: 'text-orange-500' },
                    { title: 'Longest Streak', value: '28 days', icon: '⚡', color: 'text-yellow-500' },
                    { title: 'Tasks Completed', value: '847', icon: '✅', color: 'text-green-500' },
                    { title: 'Goals Achieved', value: '23', icon: '🎯', color: 'text-purple-500' },
                  ].map((achievement, index) => (
                    <div key={index} className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <span className='text-xl'>{achievement.icon}</span>
                        <span className='font-medium'>{achievement.title}</span>
                      </div>
                      <span className={`font-bold ${achievement.color}`}>{achievement.value}</span>
                    </div>
                  ))}
                </div>

                <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
                  <h5 className='font-medium mb-3'>Recent Badges</h5>
                  <div className='flex flex-wrap gap-2'>
                    {['Week Warrior', 'Goal Crusher', 'Focus Master', 'Consistency King'].map((badge, index) => (
                      <span key={index} className='inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 rounded-full text-xs font-medium'>
                        🏆
                        {' '}
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Focus Sessions */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                <div className='mb-6'>
                  <h4 className='text-xl font-bold mb-1'>Focus Sessions</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deep work analysis</p>
                </div>

                <div className='space-y-4'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-purple-500 mb-1'>4.2h</div>
                    <div className='text-sm text-gray-500'>Average session today</div>
                  </div>

                  <div className='grid grid-cols-2 gap-4 text-center'>
                    <div>
                      <div className='text-xl font-bold'>8</div>
                      <div className='text-xs text-gray-500'>Sessions</div>
                    </div>
                    <div>
                      <div className='text-xl font-bold'>89%</div>
                      <div className='text-xs text-gray-500'>Efficiency</div>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <h6 className='font-medium text-sm'>Session Breakdown</h6>
                    {[
                      { duration: '2.5h', task: 'Design System', efficiency: 95 },
                      { duration: '1.8h', task: 'Code Review', efficiency: 87 },
                      { duration: '1.2h', task: 'Documentation', efficiency: 82 },
                      { duration: '0.9h', task: 'Planning', efficiency: 78 },
                    ].map((session, index) => (
                      <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                        <div className='flex items-center justify-between mb-1'>
                          <span className='text-sm font-medium'>{session.task}</span>
                          <span className='text-sm text-purple-500'>{session.duration}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <div className={`flex-1 h-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                            <div
                              className='h-1 bg-purple-500 rounded-full'
                              style={{ width: `${session.efficiency}%` }}
                            />
                          </div>
                          <span className='text-xs text-gray-500'>
                            {session.efficiency}
                            %
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Productivity Tips */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                <div className='mb-6'>
                  <h4 className='text-xl font-bold mb-1'>AI Insights</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Personalized recommendations</p>
                </div>

                <div className='space-y-4'>
                  {[
                    {
                      type: 'tip',
                      icon: '💡',
                      title: 'Optimize Your Schedule',
                      message: 'Your peak productivity is 10-11 AM. Schedule important tasks during this time.',
                      action: 'Schedule Now',
                    },
                    {
                      type: 'warning',
                      icon: '⚠️',
                      title: 'Goal Risk Alert',
                      message: 'TypeScript goal is behind schedule. Consider increasing weekly hours.',
                      action: 'Adjust Goal',
                    },
                    {
                      type: 'success',
                      icon: '🎉',
                      title: 'Great Progress!',
                      message: 'You\'re 18% more productive than last week. Keep it up!',
                      action: 'View Details',
                    },
                    {
                      type: 'suggestion',
                      icon: '🔄',
                      title: 'Break Suggestion',
                      message: 'Take a 15-minute break. You\'ve been focused for 2.5 hours.',
                      action: 'Start Break',
                    },
                  ].map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${insight.type === 'tip' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                        insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                          insight.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                            'border-purple-500 bg-purple-50 dark:bg-purple-900/20'}`}
                    >
                      <div className='flex items-start space-x-3'>
                        <span className='text-lg'>{insight.icon}</span>
                        <div className='flex-1'>
                          <h6 className='font-medium text-sm mb-1'>{insight.title}</h6>
                          <p className='text-xs text-gray-600 dark:text-gray-400 mb-2'>{insight.message}</p>
                          <button className={`text-xs font-medium px-2 py-1 rounded ${insight.type === 'tip' ? 'text-blue-600 hover:bg-blue-100' :
                            insight.type === 'warning' ? 'text-yellow-600 hover:bg-yellow-100' :
                              insight.type === 'success' ? 'text-green-600 hover:bg-green-100' :
                                'text-purple-600 hover:bg-purple-100'} transition-colors`}
                          >
                            {insight.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Page Content */}
        {activeTab === 'calendar' && (
          <div>
            {/* Calendar Header */}
            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8'>
              <div>
                <h3 className='text-2xl font-bold mb-2'>Calendar & Schedule</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your tasks, goals, and events in one place
                </p>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex rounded-lg border border-gray-300 overflow-hidden'>
                  <button className='px-4 py-2 bg-purple-500 text-white text-sm font-medium'>Month</button>
                  <button className={`px-4 py-2 text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>Week</button>
                  <button className={`px-4 py-2 text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>Day</button>
                </div>
                <button className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
                  <Plus className='w-4 h-4' />
                  <span>Add Event</span>
                </button>
                <button className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
                  <Clock className='w-4 h-4' />
                  <span>Time Block</span>
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
              {/* Calendar Sidebar */}
              <div className='lg:col-span-1 space-y-6'>
                {/* Mini Calendar */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <div className='flex items-center justify-between mb-4'>
                    <h4 className='font-semibold'>June 2025</h4>
                    <div className='flex space-x-2'>
                      <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                        </svg>
                      </button>
                      <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Mini Calendar Grid */}
                  <div className='grid grid-cols-7 gap-1 text-center text-xs mb-2'>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div key={index} className={`py-2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className='grid grid-cols-7 gap-1 text-center text-xs'>
                    {Array.from({ length: 35 }, (_, i) => {
                      const dayNumber = i - 5; // Start from May 26
                      const isCurrentMonth = dayNumber > 0 && dayNumber <= 30;
                      const isToday = dayNumber === 27;
                      const hasEvents = [15, 18, 22, 27, 29].includes(dayNumber);

                      return (
                        <button
                          key={i}
                          className={`relative h-8 rounded flex items-center justify-center transition-colors ${isToday
                            ? 'bg-purple-500 text-white font-medium'
                            : isCurrentMonth
                              ? `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${hasEvents ? 'font-medium' : ''}`
                              : `${darkMode ? 'text-gray-600' : 'text-gray-400'}`}`}
                        >
                          {dayNumber > 0 ? (dayNumber <= 30 ? dayNumber : dayNumber - 30) : 26 + dayNumber}
                          {hasEvents && (
                            <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full' />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar Categories */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='font-semibold mb-4'>Categories</h4>
                  <div className='space-y-3'>
                    {[
                      { name: 'Tasks', count: 12, color: '#8B5CF6', visible: true },
                      { name: 'Goals', count: 5, color: '#06B6D4', visible: true },
                      { name: 'Meetings', count: 8, color: '#10B981', visible: true },
                      { name: 'Deadlines', count: 3, color: '#F59E0B', visible: true },
                      { name: 'Personal', count: 6, color: '#EF4444', visible: false },
                      { name: 'Reminders', count: 4, color: '#6B7280', visible: true },
                    ].map((category, index) => (
                      <div key={index} className='flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                          <input
                            type='checkbox'
                            checked={category.visible}
                            className='w-4 h-4 text-purple-600 rounded focus:ring-purple-500'
                          />
                          <div className='w-3 h-3 rounded-full' style={{ backgroundColor: category.color }} />
                          <span className='text-sm font-medium'>{category.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button className='w-full mt-4 flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors'>
                    <Plus className='w-4 h-4' />
                    <span className='text-sm'>Add Category</span>
                  </button>
                </div>

                {/* Upcoming Events */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <div className='flex items-center justify-between mb-4'>
                    <h4 className='font-semibold'>Upcoming</h4>
                    <button className='text-purple-500 hover:text-purple-600 text-sm font-medium'>View All</button>
                  </div>
                  <div className='space-y-3'>
                    {[
                      {
                        title: 'Design Review',
                        time: '2:00 PM',
                        type: 'meeting',
                        color: '#10B981',
                        date: 'Today',
                      },
                      {
                        title: 'Portfolio Deadline',
                        time: '11:59 PM',
                        type: 'deadline',
                        color: '#F59E0B',
                        date: 'Tomorrow',
                      },
                      {
                        title: 'React Advanced Course',
                        time: '9:00 AM',
                        type: 'goal',
                        color: '#06B6D4',
                        date: 'Jun 29',
                      },
                      {
                        title: 'Team Standup',
                        time: '10:00 AM',
                        type: 'meeting',
                        color: '#10B981',
                        date: 'Jun 30',
                      },
                    ].map((event, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                        <div className='flex items-center space-x-3'>
                          <div className='w-3 h-3 rounded-full' style={{ backgroundColor: event.color }} />
                          <div className='flex-1'>
                            <h6 className='font-medium text-sm'>{event.title}</h6>
                            <div className='flex items-center space-x-2 text-xs text-gray-500'>
                              <span>{event.date}</span>
                              <span>•</span>
                              <span>{event.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Calendar */}
              <div className='lg:col-span-3'>
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm overflow-hidden`}>
                  {/* Calendar Header */}
                  <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    <div className='flex items-center space-x-4'>
                      <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                        </svg>
                      </button>
                      <h3 className='text-xl font-bold'>June 2025</h3>
                      <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </button>
                    </div>
                    <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm'>
                      Today
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className='p-6'>
                    {/* Days of Week Header */}
                    <div className='grid grid-cols-7 gap-4 mb-4'>
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                        <div key={day} className={`py-3 text-center font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {day.slice(0, 3)}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className='grid grid-cols-7 gap-4'>
                      {Array.from({ length: 35 }, (_, i) => {
                        const dayNumber = i - 5; // Start from May 26
                        const isCurrentMonth = dayNumber > 0 && dayNumber <= 30;
                        const isToday = dayNumber === 27;
                        const isWeekend = i % 7 === 0 || i % 7 === 6;

                        // Sample events for different days
                        const dayEvents = {
                          15: [
                            { title: 'Team Meeting', time: '10:00', color: '#10B981', type: 'meeting' },
                          ],
                          18: [
                            { title: 'Code Review', time: '14:00', color: '#8B5CF6', type: 'task' },
                            { title: 'Client Call', time: '16:00', color: '#10B981', type: 'meeting' },
                          ],
                          22: [
                            { title: 'Project Deadline', time: '23:59', color: '#F59E0B', type: 'deadline' },
                          ],
                          27: [
                            { title: 'Design Review', time: '14:00', color: '#10B981', type: 'meeting' },
                            { title: 'Learning Session', time: '16:00', color: '#06B6D4', type: 'goal' },
                            { title: 'Workout', time: '18:00', color: '#EF4444', type: 'personal' },
                          ],
                          29: [
                            { title: 'Sprint Planning', time: '09:00', color: '#10B981', type: 'meeting' },
                            { title: 'Portfolio Work', time: '15:00', color: '#06B6D4', type: 'goal' },
                          ],
                        };

                        const events = dayEvents[dayNumber as keyof typeof dayEvents] || [];

                        return (
                          <div
                            key={i}
                            className={`min-h-32 p-2 border rounded-lg transition-all hover:shadow-md cursor-pointer ${isToday
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : isCurrentMonth
                                ? `${darkMode ? 'border-gray-700 bg-gray-750 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'}`
                                : `${darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-100 bg-gray-50'}`} ${isWeekend ? 'opacity-75' : ''}`}
                          >
                            <div className='flex items-center justify-between mb-2'>
                              <span className={`text-sm font-medium ${isToday
                                ? 'text-purple-600'
                                : isCurrentMonth
                                  ? ''
                                  : `${darkMode ? 'text-gray-600' : 'text-gray-400'}`}`}
                              >
                                {dayNumber > 0 ? (dayNumber <= 30 ? dayNumber : dayNumber - 30) : 26 + dayNumber}
                              </span>
                              {events.length > 0 && (
                                <span className={`text-xs px-1 py-0.5 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                  {events.length}
                                </span>
                              )}
                            </div>

                            <div className='space-y-1'>
                              {events.slice(0, 3).map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className='text-xs p-1 rounded truncate'
                                  style={{
                                    backgroundColor: `${event.color}20`,
                                    borderLeft: `3px solid ${event.color}`,
                                  }}
                                >
                                  <div className='flex items-center space-x-1'>
                                    <span className='font-medium' style={{ color: event.color }}>
                                      {event.time}
                                    </span>
                                    <span className='truncate'>{event.title}</span>
                                  </div>
                                </div>
                              ))}
                              {events.length > 3 && (
                                <div className={`text-xs p-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                  +
                                  {events.length - 3}
                                  {' '}
                                  more
                                </div>
                              )}
                            </div>

                            {/* Add Event Button */}
                            <button className='w-full mt-2 py-1 text-xs opacity-0 hover:opacity-100 transition-opacity border-2 border-dashed border-gray-300 rounded hover:border-purple-500'>
                              <Plus className='w-3 h-3 mx-auto' />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm mt-6`}>
                  <div className='flex items-center justify-between mb-6'>
                    <div>
                      <h4 className='text-xl font-bold mb-1'>Today's Schedule</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Thursday, June 27, 2025 • 3 events
                      </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='flex items-center space-x-1 text-sm'>
                        <div className='w-2 h-2 bg-green-500 rounded-full' />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Available</span>
                      </div>
                      <button className='p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors'>
                        <Clock className='w-4 h-4' />
                      </button>
                    </div>
                  </div>

                  {/* Time Blocks */}
                  <div className='space-y-4'>
                    {/* Morning Block */}
                    <div className='relative'>
                      <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full' />
                      <div className='ml-6'>
                        <div className='flex items-center justify-between mb-3'>
                          <h5 className='font-semibold text-blue-600'>Morning Focus Block</h5>
                          <span className='text-sm text-gray-500'>9:00 AM - 12:00 PM</span>
                        </div>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                            <div className='flex items-center space-x-3'>
                              <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
                                <CheckSquare className='w-4 h-4 text-white' />
                              </div>
                              <div>
                                <h6 className='font-medium'>Design System Update</h6>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>High priority task</p>
                              </div>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <span className='text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded'>2.5h</span>
                              <button className='p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800'>
                                <Play className='w-4 h-4 text-blue-600' />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Afternoon Block */}
                    <div className='relative'>
                      <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-green-600 rounded-full' />
                      <div className='ml-6'>
                        <div className='flex items-center justify-between mb-3'>
                          <h5 className='font-semibold text-green-600'>Collaboration Block</h5>
                          <span className='text-sm text-gray-500'>2:00 PM - 4:00 PM</span>
                        </div>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'>
                            <div className='flex items-center space-x-3'>
                              <div className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center'>
                                <User className='w-4 h-4 text-white' />
                              </div>
                              <div>
                                <h6 className='font-medium'>Design Review Meeting</h6>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>With Sarah, Mike, and Alex</p>
                              </div>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <span className='text-sm bg-green-100 text-green-600 px-2 py-1 rounded'>1h</span>
                              <button className='p-1 rounded hover:bg-green-100 dark:hover:bg-green-800'>
                                <svg className='w-4 h-4 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Evening Block */}
                    <div className='relative'>
                      <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full' />
                      <div className='ml-6'>
                        <div className='flex items-center justify-between mb-3'>
                          <h5 className='font-semibold text-purple-600'>Learning Block</h5>
                          <span className='text-sm text-gray-500'>4:00 PM - 6:00 PM</span>
                        </div>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                            <div className='flex items-center space-x-3'>
                              <div className='w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center'>
                                <Target className='w-4 h-4 text-white' />
                              </div>
                              <div>
                                <h6 className='font-medium'>React Advanced Patterns</h6>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Goal progress session</p>
                              </div>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <span className='text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded'>2h</span>
                              <button className='p-1 rounded hover:bg-purple-100 dark:hover:bg-purple-800'>
                                <Play className='w-4 h-4 text-purple-600' />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Free Time */}
                    <div className='relative'>
                      <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full' />
                      <div className='ml-6'>
                        <div className='flex items-center justify-between mb-3'>
                          <h5 className='font-semibold text-gray-600'>Free Time</h5>
                          <span className='text-sm text-gray-500'>6:00 PM - 9:00 PM</span>
                        </div>
                        <div className='p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600'>
                          <div className='text-center'>
                            <p className='text-sm text-gray-500 mb-2'>Available for scheduling</p>
                            <button className='text-purple-500 hover:text-purple-600 text-sm font-medium'>
                              + Schedule Something
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Actions */}
                  <div className='flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center space-x-4 text-sm'>
                      <div className='flex items-center space-x-2'>
                        <Clock className='w-4 h-4 text-blue-500' />
                        <span>6.5h scheduled</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Target className='w-4 h-4 text-green-500' />
                        <span>3h on goals</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <User className='w-4 h-4 text-purple-500' />
                        <span>1 meeting</span>
                      </div>
                    </div>
                    <div className='flex space-x-2'>
                      <button className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm'>
                        Reschedule
                      </button>
                      <button className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm'>
                        Optimize Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Stats */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8'>
              {[
                {
                  title: 'This Week',
                  value: '32h',
                  subtitle: 'Total scheduled',
                  trend: '+5h vs last week',
                  icon: Clock,
                  color: 'from-blue-500 to-blue-600',
                },
                {
                  title: 'Focus Time',
                  value: '18h',
                  subtitle: 'Deep work blocks',
                  trend: '+3h vs last week',
                  icon: Target,
                  color: 'from-purple-500 to-purple-600',
                },
                {
                  title: 'Meetings',
                  value: '8h',
                  subtitle: 'Collaboration time',
                  trend: '+2h vs last week',
                  icon: User,
                  color: 'from-green-500 to-green-600',
                },
                {
                  title: 'Free Time',
                  value: '14h',
                  subtitle: 'Available slots',
                  trend: '-2h vs last week',
                  icon: Flame,
                  color: 'from-orange-500 to-orange-600',
                },
              ].map(({ title, value, subtitle, trend, icon: Icon, color }, index) => (
                <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <div className='flex items-center justify-between mb-4'>
                    <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
                      <Icon className='w-6 h-6 text-white' />
                    </div>
                    <div className='text-right'>
                      <div className='text-2xl font-bold'>{value}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</div>
                    </div>
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{subtitle}</div>
                  <div className='text-xs text-green-600 font-medium'>{trend}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Page Content */}
        {activeTab === 'profile' && (
          <div>
            {/* Profile Header */}
            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8'>
              <div>
                <h3 className='text-2xl font-bold mb-2'>Profile & Settings</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your account, preferences, and productivity settings
                </p>
              </div>
              <div className='flex items-center gap-4'>
                <button className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12' />
                  </svg>
                  <span>Export Data</span>
                </button>
                <button className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                  </svg>
                  <span>Backup</span>
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Profile Sidebar */}
              <div className='lg:col-span-1 space-y-6'>
                {/* User Info Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <div className='text-center'>
                    <div className='relative inline-block mb-4'>
                      <div className='w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
                        A
                      </div>
                      <button className='absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
                        </svg>
                      </button>
                    </div>
                    <h4 className='text-xl font-bold mb-1'>Alex Johnson</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      alex.johnson@example.com
                    </p>
                    <div className='flex items-center justify-center space-x-2 mb-4'>
                      <div className='w-2 h-2 bg-green-500 rounded-full' />
                      <span className='text-sm text-green-500'>Active</span>
                    </div>
                    <div className='grid grid-cols-2 gap-4 text-center'>
                      <div>
                        <div className='text-2xl font-bold text-purple-500'>87</div>
                        <div className='text-xs text-gray-500'>Days Active</div>
                      </div>
                      <div>
                        <div className='text-2xl font-bold text-blue-500'>12</div>
                        <div className='text-xs text-gray-500'>Day Streak</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h5 className='font-semibold mb-4'>This Month</h5>
                  <div className='space-y-4'>
                    {[
                      { label: 'Tasks Completed', value: '156', change: '+23%', color: 'text-green-500' },
                      { label: 'Goals Achieved', value: '5', change: '+2', color: 'text-blue-500' },
                      { label: 'Focus Hours', value: '89h', change: '+12h', color: 'text-purple-500' },
                      { label: 'Productivity Score', value: '87%', change: '+8%', color: 'text-orange-500' },
                    ].map((stat, index) => (
                      <div key={index} className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium'>{stat.label}</p>
                          <p className='text-lg font-bold'>{stat.value}</p>
                        </div>
                        <span className={`text-sm font-medium ${stat.color}`}>
                          {stat.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <div className='flex items-center justify-between mb-4'>
                    <h5 className='font-semibold'>Recent Achievements</h5>
                    <button className='text-purple-500 hover:text-purple-600 text-sm font-medium'>View All</button>
                  </div>
                  <div className='space-y-3'>
                    {[
                      { title: 'Week Warrior', description: 'Completed all tasks this week', icon: '⚡', date: 'Today' },
                      { title: 'Goal Crusher', description: 'Achieved 3 goals this month', icon: '🎯', date: '2 days ago' },
                      { title: 'Focus Master', description: '25+ hours of deep work', icon: '🧠', date: '1 week ago' },
                      { title: 'Streak King', description: '30-day activity streak', icon: '🔥', date: '2 weeks ago' },
                    ].map((achievement, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                        <div className='flex items-center space-x-3'>
                          <div className='text-2xl'>{achievement.icon}</div>
                          <div className='flex-1'>
                            <h6 className='font-medium text-sm'>{achievement.title}</h6>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {achievement.description}
                            </p>
                          </div>
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {achievement.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Profile Content */}
              <div className='lg:col-span-2 space-y-8'>
                {/* Personal Information */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <div className='flex items-center justify-between mb-6'>
                    <h4 className='text-xl font-bold'>Personal Information</h4>
                    <button className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm'>
                      Edit Profile
                    </button>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Full Name</label>
                      <input
                        type='text'
                        value='Alex Johnson'
                        readOnly
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'} cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Email Address</label>
                      <input
                        type='email'
                        value='alex.johnson@example.com'
                        readOnly
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'} cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Job Title</label>
                      <input
                        type='text'
                        value='Senior Frontend Developer'
                        readOnly
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'} cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Company</label>
                      <input
                        type='text'
                        value='TechCorp Solutions'
                        readOnly
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'} cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Time Zone</label>
                      <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      >
                        <option value='PST'>Pacific Standard Time (PST)</option>
                        <option value='EST'>Eastern Standard Time (EST)</option>
                        <option value='GMT'>Greenwich Mean Time (GMT)</option>
                        <option value='CET'>Central European Time (CET)</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Language</label>
                      <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      >
                        <option value='en'>English</option>
                        <option value='es'>Español</option>
                        <option value='fr'>Français</option>
                        <option value='de'>Deutsch</option>
                        <option value='zh'>中文</option>
                      </select>
                    </div>
                  </div>

                  <div className='mt-6'>
                    <label className='block text-sm font-medium mb-2'>Bio</label>
                    <textarea
                      value='Passionate frontend developer with 5+ years of experience building modern web applications. Love learning new technologies and optimizing productivity workflows.'
                      rows={3}
                      className={`w-full px-4 py-3 rounded-lg border ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>

                {/* Productivity Preferences */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6'>Productivity Preferences</h4>

                  <div className='space-y-6'>
                    {/* Working Hours */}
                    <div>
                      <h5 className='font-semibold mb-4'>Working Hours</h5>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Start Time</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='8:00'>8:00 AM</option>
                            <option value='9:00' selected>9:00 AM</option>
                            <option value='10:00'>10:00 AM</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>End Time</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='17:00' selected>5:00 PM</option>
                            <option value='18:00'>6:00 PM</option>
                            <option value='19:00'>7:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Work Days */}
                    <div>
                      <h5 className='font-semibold mb-4'>Work Days</h5>
                      <div className='grid grid-cols-7 gap-2'>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                          <button
                            key={day}
                            className={`p-2 rounded-lg border text-sm font-medium transition-colors ${index < 5
                              ? 'bg-purple-500 text-white border-purple-500'
                              : darkMode
                                ? 'border-gray-600 hover:bg-gray-700'
                                : 'border-gray-300 hover:bg-gray-50'}`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Focus Preferences */}
                    <div>
                      <h5 className='font-semibold mb-4'>Focus Preferences</h5>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>
                            Focus Session Duration: 25 minutes
                          </label>
                          <input
                            type='range'
                            min='15'
                            max='90'
                            value='25'
                            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-gray-500 mt-1'>
                            <span>15min</span>
                            <span>45min</span>
                            <span>90min</span>
                          </div>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>
                            Break Duration: 5 minutes
                          </label>
                          <input
                            type='range'
                            min='5'
                            max='30'
                            value='5'
                            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-gray-500 mt-1'>
                            <span>5min</span>
                            <span>15min</span>
                            <span>30min</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Goal Preferences */}
                    <div>
                      <h5 className='font-semibold mb-4'>Goal Preferences</h5>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Default Goal Duration</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='30'>30 days</option>
                            <option value='60'>60 days</option>
                            <option value='90' selected>90 days</option>
                            <option value='180'>6 months</option>
                            <option value='365'>1 year</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Weekly Target Hours</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='5'>5 hours</option>
                            <option value='10' selected>10 hours</option>
                            <option value='15'>15 hours</option>
                            <option value='20'>20 hours</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications Settings */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6'>Notification Settings</h4>

                  <div className='space-y-4'>
                    {[
                      {
                        title: 'Task Reminders',
                        description: 'Get notified when tasks are due',
                        enabled: true,
                        frequency: 'immediate',
                      },
                      {
                        title: 'Goal Progress Updates',
                        description: 'Weekly summaries of your goal progress',
                        enabled: true,
                        frequency: 'weekly',
                      },
                      {
                        title: 'Focus Session Breaks',
                        description: 'Reminders to take breaks during focus sessions',
                        enabled: true,
                        frequency: 'session',
                      },
                      {
                        title: 'Daily Summary',
                        description: 'End-of-day productivity report',
                        enabled: false,
                        frequency: 'daily',
                      },
                      {
                        title: 'Streak Milestones',
                        description: 'Celebrate your productivity streaks',
                        enabled: true,
                        frequency: 'milestone',
                      },
                      {
                        title: 'New Features',
                        description: 'Updates about new TaskFlow Pro features',
                        enabled: false,
                        frequency: 'as-needed',
                      },
                    ].map((notification, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                        <div className='flex-1'>
                          <h6 className='font-medium'>{notification.title}</h6>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {notification.description}
                          </p>
                          <div className='flex items-center space-x-2 mt-2'>
                            <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                              {notification.frequency}
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center space-x-3'>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notification.enabled ? 'bg-purple-500' : 'bg-gray-300'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notification.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy & Security */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6'>Privacy & Security</h4>

                  <div className='space-y-6'>
                    {/* Password Section */}
                    <div>
                      <h5 className='font-semibold mb-4'>Password & Authentication</h5>
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Password</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Last changed 3 months ago
                            </p>
                          </div>
                          <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm'>
                            Change Password
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Two-Factor Authentication</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Add an extra layer of security
                            </p>
                          </div>
                          <button className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm'>
                            Enable 2FA
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Data Privacy */}
                    <div>
                      <h5 className='font-semibold mb-4'>Data Privacy</h5>
                      <div className='space-y-4'>
                        {[
                          {
                            title: 'Analytics & Usage Data',
                            description: 'Help improve TaskFlow Pro by sharing anonymous usage data',
                            enabled: true,
                          },
                          {
                            title: 'Marketing Communications',
                            description: 'Receive product updates and productivity tips',
                            enabled: false,
                          },
                          {
                            title: 'Third-party Integrations',
                            description: 'Allow approved third-party apps to access your data',
                            enabled: true,
                          },
                        ].map((privacy, index) => (
                          <div key={index} className='flex items-center justify-between'>
                            <div className='flex-1'>
                              <h6 className='font-medium'>{privacy.title}</h6>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {privacy.description}
                              </p>
                            </div>
                            <button
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacy.enabled ? 'bg-purple-500' : 'bg-gray-300'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacy.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Data Management */}
                    <div>
                      <h5 className='font-semibold mb-4'>Data Management</h5>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <button className='flex flex-col items-center p-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
                          <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                          </svg>
                          <span className='text-sm font-medium'>Download Data</span>
                        </button>
                        <button className='flex flex-col items-center p-4 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors'>
                          <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                          </svg>
                          <span className='text-sm font-medium'>Import Data</span>
                        </button>
                        <button className='flex flex-col items-center p-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
                          <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                          </svg>
                          <span className='text-sm font-medium'>Delete Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* App Preferences */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6'>App Preferences</h4>

                  <div className='space-y-6'>
                    {/* Theme Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Appearance</h5>
                      <div className='grid grid-cols-3 gap-4'>
                        <button className={`p-4 rounded-lg border-2 transition-all ${!darkMode
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600'}`}
                        >
                          <div className='w-8 h-8 bg-white border border-gray-300 rounded mb-2 mx-auto' />
                          <span className='text-sm font-medium'>Light</span>
                        </button>
                        <button className={`p-4 rounded-lg border-2 transition-all ${darkMode
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600'}`}
                        >
                          <div className='w-8 h-8 bg-gray-800 rounded mb-2 mx-auto' />
                          <span className='text-sm font-medium'>Dark</span>
                        </button>
                        <button className='p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-all hover:border-purple-500'>
                          <div className='w-8 h-8 bg-gradient-to-r from-white to-gray-800 rounded mb-2 mx-auto' />
                          <span className='text-sm font-medium'>Auto</span>
                        </button>
                      </div>
                    </div>

                    {/* Display Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Display Settings</h5>
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Compact Mode</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Show more content in less space
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Show Productivity Tips</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Display helpful tips throughout the app
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Animations</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Enable smooth transitions and animations
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Sound Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Sound Settings</h5>
                      <div className='space-y-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>
                            Master Volume: 75%
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='100'
                            value='75'
                            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                          />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium'>Task Complete Sound</span>
                            <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                              <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                            </button>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium'>Timer Notifications</span>
                            <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                              <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                            </button>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium'>Background Music</span>
                            <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                              <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                            </button>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium'>Keyboard Shortcuts</span>
                            <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                              <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integrations */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <div className='flex items-center justify-between mb-6'>
                    <h4 className='text-xl font-bold'>Integrations</h4>
                    <button className='text-purple-500 hover:text-purple-600 text-sm font-medium'>Browse All</button>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[
                      {
                        name: 'Google Calendar',
                        description: 'Sync tasks with your calendar',
                        icon: '📅',
                        connected: true,
                        color: 'bg-blue-500',
                      },
                      {
                        name: 'Slack',
                        description: 'Get notifications in Slack',
                        icon: '💬',
                        connected: true,
                        color: 'bg-purple-500',
                      },
                      {
                        name: 'GitHub',
                        description: 'Track code commits as tasks',
                        icon: '⚡',
                        connected: false,
                        color: 'bg-gray-800',
                      },
                      {
                        name: 'Notion',
                        description: 'Export tasks to Notion pages',
                        icon: '📝',
                        connected: false,
                        color: 'bg-black',
                      },
                      {
                        name: 'Spotify',
                        description: 'Focus music recommendations',
                        icon: '🎵',
                        connected: true,
                        color: 'bg-green-500',
                      },
                      {
                        name: 'Zapier',
                        description: 'Connect with 5000+ apps',
                        icon: '🔗',
                        connected: false,
                        color: 'bg-orange-500',
                      },
                    ].map((integration, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                        <div className='flex items-center space-x-3 mb-3'>
                          <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center text-white`}>
                            {integration.icon}
                          </div>
                          <div className='flex-1'>
                            <h6 className='font-medium'>{integration.name}</h6>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {integration.description}
                            </p>
                          </div>
                        </div>
                        <button
                          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${integration.connected
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-purple-500 text-white hover:bg-purple-600'}`}
                        >
                          {integration.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Help & Support */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6'>Help & Support</h4>

                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {[
                      {
                        title: 'Help Center',
                        description: 'Browse articles and guides',
                        icon: '📚',
                        action: 'Browse',
                      },
                      {
                        title: 'Contact Support',
                        description: 'Get help from our team',
                        icon: '💬',
                        action: 'Contact',
                      },
                      {
                        title: 'Feature Requests',
                        description: 'Suggest new features',
                        icon: '💡',
                        action: 'Suggest',
                      },
                      {
                        title: 'Community Forum',
                        description: 'Connect with other users',
                        icon: '👥',
                        action: 'Join',
                      },
                    ].map((support, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} hover:shadow-md transition-all cursor-pointer`}>
                        <div className='text-center'>
                          <div className='text-3xl mb-2'>{support.icon}</div>
                          <h6 className='font-medium mb-1'>{support.title}</h6>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                            {support.description}
                          </p>
                          <button className='text-purple-500 hover:text-purple-600 text-sm font-medium'>
                            {support.action}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h6 className='font-medium'>App Version</h6>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          TaskFlow Pro v2.1.4 (Latest)
                        </p>
                      </div>
                      <button className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm'>
                        Check Updates
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Page Content */}
        {activeTab === 'settings' && (
          <div>
            {/* Settings Header */}
            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8'>
              <div>
                <h3 className='text-2xl font-bold mb-2'>Settings & Configuration</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Customize your TaskFlow Pro experience and manage system settings
                </p>
              </div>
              <div className='flex items-center gap-4'>
                <button className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                  </svg>
                  <span>Reset to Defaults</span>
                </button>
                <button className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
              {/* Settings Navigation */}
              <div className='lg:col-span-1'>
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 border shadow-sm sticky top-4`}>
                  <h4 className='font-semibold mb-4'>Settings Categories</h4>
                  <nav className='space-y-2'>
                    {[
                      { id: 'general', icon: '⚙️', label: 'General', active: true },
                      { id: 'appearance', icon: '🎨', label: 'Appearance' },
                      { id: 'productivity', icon: '⚡', label: 'Productivity' },
                      { id: 'notifications', icon: '🔔', label: 'Notifications' },
                      { id: 'data', icon: '💾', label: 'Data & Storage' },
                      { id: 'privacy', icon: '🔒', label: 'Privacy & Security' },
                      { id: 'integrations', icon: '🔗', label: 'Integrations' },
                      { id: 'advanced', icon: '🔧', label: 'Advanced' },
                      { id: 'about', icon: 'ℹ️', label: 'About' },
                    ].map(({ id, icon, label, active }) => (
                      <button
                        key={id}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${active
                          ? 'bg-purple-500 text-white'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        <span className='text-lg'>{icon}</span>
                        <span className='text-sm font-medium'>{label}</span>
                      </button>
                    ))}
                  </nav>

                  <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
                    <button className='w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
                      <span className='text-lg'>🚪</span>
                      <span className='text-sm font-medium'>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Settings Content */}
              <div className='lg:col-span-3 space-y-8'>
                {/* General Settings */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6 flex items-center'>
                    <span className='text-2xl mr-3'>⚙️</span>
                    General Settings
                  </h4>

                  <div className='space-y-6'>
                    {/* Language & Region */}
                    <div>
                      <h5 className='font-semibold mb-4'>Language & Region</h5>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Language</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='en'>English</option>
                            <option value='es'>Español</option>
                            <option value='fr'>Français</option>
                            <option value='de'>Deutsch</option>
                            <option value='it'>Italiano</option>
                            <option value='pt'>Português</option>
                            <option value='ru'>Русский</option>
                            <option value='ja'>日本語</option>
                            <option value='ko'>한국어</option>
                            <option value='zh'>中文</option>
                            <option value='ar'>العربية</option>
                            <option value='hi'>हिन्दी</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Time Zone</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='UTC-12'>(UTC-12:00) Baker Island</option>
                            <option value='UTC-11'>(UTC-11:00) Hawaii</option>
                            <option value='UTC-10'>(UTC-10:00) Alaska</option>
                            <option value='UTC-9'>(UTC-09:00) Alaska</option>
                            <option value='UTC-8'>(UTC-08:00) Pacific Time</option>
                            <option value='UTC-7'>(UTC-07:00) Mountain Time</option>
                            <option value='UTC-6'>(UTC-06:00) Central Time</option>
                            <option value='UTC-5'>(UTC-05:00) Eastern Time</option>
                            <option value='UTC-4'>(UTC-04:00) Atlantic Time</option>
                            <option value='UTC-3'>(UTC-03:00) Argentina</option>
                            <option value='UTC-2'>(UTC-02:00) Mid-Atlantic</option>
                            <option value='UTC-1'>(UTC-01:00) Azores</option>
                            <option value='UTC+0' selected>(UTC+00:00) Greenwich Mean Time</option>
                            <option value='UTC+1'>(UTC+01:00) Central European Time</option>
                            <option value='UTC+2'>(UTC+02:00) Eastern European Time</option>
                            <option value='UTC+3'>(UTC+03:00) Moscow Time</option>
                            <option value='UTC+4'>(UTC+04:00) Gulf Time</option>
                            <option value='UTC+5'>(UTC+05:00) Pakistan Time</option>
                            <option value='UTC+6'>(UTC+06:00) Bangladesh Time</option>
                            <option value='UTC+7'>(UTC+07:00) Indochina Time</option>
                            <option value='UTC+8'>(UTC+08:00) China Standard Time</option>
                            <option value='UTC+9'>(UTC+09:00) Japan Standard Time</option>
                            <option value='UTC+10'>(UTC+10:00) Australian Eastern Time</option>
                            <option value='UTC+11'>(UTC+11:00) Solomon Islands Time</option>
                            <option value='UTC+12'>(UTC+12:00) Fiji Time</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Date Format</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='MM/DD/YYYY'>MM/DD/YYYY (US)</option>
                            <option value='DD/MM/YYYY'>DD/MM/YYYY (UK)</option>
                            <option value='YYYY-MM-DD'>YYYY-MM-DD (ISO)</option>
                            <option value='DD.MM.YYYY'>DD.MM.YYYY (German)</option>
                            <option value='MM-DD-YYYY'>MM-DD-YYYY</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Time Format</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='12'>12-hour (AM/PM)</option>
                            <option value='24'>24-hour</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Week Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Week & Calendar Settings</h5>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>First Day of Week</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='sunday'>Sunday</option>
                            <option value='monday' selected>Monday</option>
                            <option value='saturday'>Saturday</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Work Week</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='5'>Monday to Friday (5 days)</option>
                            <option value='6'>Monday to Saturday (6 days)</option>
                            <option value='7'>Full Week (7 days)</option>
                            <option value='custom'>Custom</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Startup Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Startup & Defaults</h5>
                      <div className='space-y-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Default Page on Startup</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='dashboard' selected>Dashboard</option>
                            <option value='tasks'>Tasks</option>
                            <option value='goals'>Goals</option>
                            <option value='calendar'>Calendar</option>
                            <option value='analytics'>Analytics</option>
                            <option value='last'>Last Visited Page</option>
                          </select>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Auto-start Focus Timer</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Automatically start timer when clicking on tasks
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Remember Window Size</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Save window dimensions and position
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Load Recent Files</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Show recently opened projects on startup
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appearance Settings */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6 flex items-center'>
                    <span className='text-2xl mr-3'>🎨</span>
                    Appearance & Themes
                  </h4>

                  <div className='space-y-6'>
                    {/* Theme Selection */}
                    <div>
                      <h5 className='font-semibold mb-4'>Theme</h5>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <button className={`p-4 rounded-lg border-2 transition-all ${!darkMode
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'}`}
                        >
                          <div className='w-full h-20 bg-white border border-gray-300 rounded mb-3 flex items-center justify-center'>
                            <div className='w-8 h-8 bg-gray-200 rounded' />
                          </div>
                          <span className='text-sm font-medium'>Light</span>
                        </button>
                        <button className={`p-4 rounded-lg border-2 transition-all ${darkMode
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'}`}
                        >
                          <div className='w-full h-20 bg-gray-800 border border-gray-600 rounded mb-3 flex items-center justify-center'>
                            <div className='w-8 h-8 bg-gray-600 rounded' />
                          </div>
                          <span className='text-sm font-medium'>Dark</span>
                        </button>
                        <button className='p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 transition-all'>
                          <div className='w-full h-20 bg-gradient-to-r from-white to-gray-800 border border-gray-400 rounded mb-3 flex items-center justify-center'>
                            <div className='w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-600 rounded' />
                          </div>
                          <span className='text-sm font-medium'>Auto</span>
                        </button>
                      </div>
                    </div>

                    {/* Color Scheme */}
                    <div>
                      <h5 className='font-semibold mb-4'>Accent Color</h5>
                      <div className='grid grid-cols-6 md:grid-cols-8 gap-3'>
                        {[
                          { name: 'Purple', color: '#A855F7', active: true },
                          { name: 'Blue', color: '#3B82F6' },
                          { name: 'Green', color: '#10B981' },
                          { name: 'Red', color: '#EF4444' },
                          { name: 'Orange', color: '#F59E0B' },
                          { name: 'Pink', color: '#EC4899' },
                          { name: 'Indigo', color: '#6366F1' },
                          { name: 'Teal', color: '#14B8A6' },
                          { name: 'Cyan', color: '#06B6D4' },
                          { name: 'Emerald', color: '#059669' },
                          { name: 'Lime', color: '#65A30D' },
                          { name: 'Yellow', color: '#EAB308' },
                          { name: 'Amber', color: '#D97706' },
                          { name: 'Rose', color: '#F43F5E' },
                          { name: 'Fuchsia', color: '#D946EF' },
                          { name: 'Violet', color: '#8B5CF6' },
                        ].map((colorOption, index) => (
                          <button
                            key={index}
                            className={`w-12 h-12 rounded-lg border-2 transition-all ${colorOption.active
                              ? 'border-gray-900 dark:border-white scale-110'
                              : 'border-gray-300 dark:border-gray-600 hover:scale-105'}`}
                            style={{ backgroundColor: colorOption.color }}
                            title={colorOption.name}
                          >
                            {colorOption.active && (
                              <svg className='w-6 h-6 text-white mx-auto' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Typography</h5>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Font Family</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='inter' selected>Inter (Default)</option>
                            <option value='roboto'>Roboto</option>
                            <option value='open-sans'>Open Sans</option>
                            <option value='lato'>Lato</option>
                            <option value='source-sans'>Source Sans Pro</option>
                            <option value='system'>System Default</option>
                            <option value='georgia'>Georgia (Serif)</option>
                            <option value='times'>Times New Roman (Serif)</option>
                            <option value='monaco'>Monaco (Monospace)</option>
                            <option value='fira-code'>Fira Code (Monospace)</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>
                            Font Size: 14px
                          </label>
                          <input
                            type='range'
                            min='12'
                            max='20'
                            value='14'
                            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-gray-500 mt-1'>
                            <span>12px</span>
                            <span>16px</span>
                            <span>20px</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Layout Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Layout & Spacing</h5>
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Compact Mode</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Reduce spacing and padding for more content
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Show Sidebar</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Display navigation sidebar
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Show Breadcrumbs</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Display navigation breadcrumbs
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>
                            Sidebar Width: 256px
                          </label>
                          <input
                            type='range'
                            min='200'
                            max='400'
                            value='256'
                            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-gray-500 mt-1'>
                            <span>200px</span>
                            <span>300px</span>
                            <span>400px</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Productivity Settings */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6 flex items-center'>
                    <span className='text-2xl mr-3'>⚡</span>
                    Productivity & Focus
                  </h4>

                  <div className='space-y-6'>
                    {/* Pomodoro Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Pomodoro Timer</h5>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>
                            Focus Duration: 25 minutes
                          </label>
                          <input
                            type='range'
                            min='15'
                            max='90'
                            value='25'
                            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-gray-500 mt-1'>
                            <span>15min</span>
                            <span>45min</span>
                            <span>90min</span>
                          </div>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>
                            Short Break: 5 minutes
                          </label>
                          <input
                            type='range'
                            min='5'
                            max='15'
                            value='5'
                            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-gray-500 mt-1'>
                            <span>5min</span>
                            <span>10min</span>
                            <span>15min</span>
                          </div>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>
                            Long Break: 30 minutes
                          </label>
                          <input
                            type='range'
                            min='15'
                            max='60'
                            value='30'
                            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-gray-500 mt-1'>
                            <span>15min</span>
                            <span>30min</span>
                            <span>60min</span>
                          </div>
                        </div>
                      </div>
                      <div className='mt-4 space-y-3'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Auto-start Breaks</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Automatically start break timer after focus sessions
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Long Break After</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Take a long break after 4 focus sessions
                            </p>
                          </div>
                          <select className={`px-3 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='2'>2 sessions</option>
                            <option value='3'>3 sessions</option>
                            <option value='4' selected>4 sessions</option>
                            <option value='5'>5 sessions</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Goal Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Goal Management</h5>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Default Goal Duration</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='30'>30 days</option>
                            <option value='60'>60 days</option>
                            <option value='90' selected>90 days</option>
                            <option value='180'>6 months</option>
                            <option value='365'>1 year</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Weekly Target Hours</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='5'>5 hours</option>
                            <option value='10' selected>10 hours</option>
                            <option value='15'>15 hours</option>
                            <option value='20'>20 hours</option>
                            <option value='25'>25 hours</option>
                          </select>
                        </div>
                      </div>
                      <div className='mt-4 space-y-3'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Smart Goal Suggestions</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Get AI-powered suggestions for new goals
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Progress Reminders</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Get weekly progress check-ins for active goals
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Automation Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Automation & AI</h5>
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Smart Task Scheduling</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Automatically schedule tasks based on priority and deadlines
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Auto-categorize Tasks</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Use AI to categorize new tasks automatically
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Productivity Insights</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Generate weekly productivity reports and insights
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Smart Time Blocking</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Automatically create time blocks based on your schedule
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data & Storage Settings */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6 flex items-center'>
                    <span className='text-2xl mr-3'>💾</span>
                    Data & Storage
                  </h4>

                  <div className='space-y-6'>
                    {/* Storage Usage */}
                    <div>
                      <h5 className='font-semibold mb-4'>Storage Usage</h5>
                      <div className='space-y-4'>
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                          <div className='flex items-center justify-between mb-2'>
                            <span className='font-medium'>Total Storage Used</span>
                            <span className='text-lg font-bold'>2.4 GB / 10 GB</span>
                          </div>
                          <div className={`w-full h-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                            <div className='h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full' style={{ width: '24%' }} />
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          {[
                            { label: 'Tasks & Projects', size: '1.2 GB', percentage: 50, color: 'bg-blue-500' },
                            { label: 'Goals & Milestones', size: '450 MB', percentage: 18.75, color: 'bg-green-500' },
                            { label: 'Analytics Data', size: '320 MB', percentage: 13.33, color: 'bg-purple-500' },
                            { label: 'Attachments', size: '280 MB', percentage: 11.67, color: 'bg-orange-500' },
                            { label: 'Backups', size: '150 MB', percentage: 6.25, color: 'bg-gray-500' },
                          ].map((item, index) => (
                            <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                              <div className='flex items-center justify-between mb-2'>
                                <div className='flex items-center space-x-2'>
                                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                  <span className='text-sm font-medium'>{item.label}</span>
                                </div>
                                <span className='text-sm font-medium'>{item.size}</span>
                              </div>
                              <div className={`w-full h-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                                <div className={`h-1 ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Backup Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Backup & Sync</h5>
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Auto Backup</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Automatically backup data every day
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Cloud Sync</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Sync data across all your devices
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Backup Frequency</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='realtime'>Real-time</option>
                            <option value='hourly'>Every Hour</option>
                            <option value='daily' selected>Daily</option>
                            <option value='weekly'>Weekly</option>
                            <option value='manual'>Manual Only</option>
                          </select>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <button className='flex flex-col items-center p-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
                            <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10' />
                            </svg>
                            <span className='text-sm font-medium'>Backup Now</span>
                          </button>
                          <button className='flex flex-col items-center p-4 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors'>
                            <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                            </svg>
                            <span className='text-sm font-medium'>Restore</span>
                          </button>
                          <button className='flex flex-col items-center p-4 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors'>
                            <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                            </svg>
                            <span className='text-sm font-medium'>Sync All</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Data Retention */}
                    <div>
                      <h5 className='font-semibold mb-4'>Data Retention</h5>
                      <div className='space-y-4'>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Keep Completed Tasks</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='30'>30 days</option>
                            <option value='90' selected>90 days</option>
                            <option value='180'>6 months</option>
                            <option value='365'>1 year</option>
                            <option value='forever'>Forever</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>Analytics Data Retention</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value='90'>90 days</option>
                            <option value='180'>6 months</option>
                            <option value='365' selected>1 year</option>
                            <option value='730'>2 years</option>
                            <option value='forever'>Forever</option>
                          </select>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Auto-delete Old Data</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Automatically clean up old data based on retention settings
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6 flex items-center'>
                    <span className='text-2xl mr-3'>🔧</span>
                    Advanced Settings
                  </h4>

                  <div className='space-y-6'>
                    {/* Performance Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Performance & Memory</h5>
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Hardware Acceleration</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Use GPU acceleration for better performance
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Background Sync</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Continue syncing when app is in background
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div>
                          <label className='block text-sm font-medium mb-2'>
                            Cache Size: 500 MB
                          </label>
                          <input
                            type='range'
                            min='100'
                            max='2000'
                            value='500'
                            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-gray-500 mt-1'>
                            <span>100MB</span>
                            <span>1GB</span>
                            <span>2GB</span>
                          </div>
                        </div>
                        <button className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
                          Clear Cache
                        </button>
                      </div>
                    </div>

                    {/* Developer Settings */}
                    <div>
                      <h5 className='font-semibold mb-4'>Developer & Debug</h5>
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Debug Mode</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Enable debug logging and detailed error messages
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Beta Features</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Enable experimental features and early access
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                          </button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h6 className='font-medium'>Analytics & Telemetry</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Send anonymous usage data to help improve the app
                            </p>
                          </div>
                          <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                            <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                          </button>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <button className='flex flex-col items-center p-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
                            <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                            </svg>
                            <span className='text-sm font-medium'>Export Logs</span>
                          </button>
                          <button className='flex flex-col items-center p-4 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors'>
                            <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' />
                            </svg>
                            <span className='text-sm font-medium'>Run Diagnostics</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Experimental Features */}
                    <div>
                      <h5 className='font-semibold mb-4'>Experimental Features</h5>
                      <div className='space-y-4'>
                        <div className={`p-4 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          <div className='flex items-center space-x-3 mb-3'>
                            <span className='text-2xl'>🤖</span>
                            <div>
                              <h6 className='font-medium'>AI Task Assistant</h6>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                AI-powered task creation and management (Beta)
                              </p>
                            </div>
                            <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors ml-auto'>
                              <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                            </button>
                          </div>
                        </div>
                        <div className={`p-4 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          <div className='flex items-center space-x-3 mb-3'>
                            <span className='text-2xl'>📊</span>
                            <div>
                              <h6 className='font-medium'>Advanced Analytics</h6>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Detailed productivity insights and predictions (Alpha)
                              </p>
                            </div>
                            <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors ml-auto'>
                              <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                            </button>
                          </div>
                        </div>
                        <div className={`p-4 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                          <div className='flex items-center space-x-3 mb-3'>
                            <span className='text-2xl'>👥</span>
                            <div>
                              <h6 className='font-medium'>Team Collaboration</h6>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Share projects and collaborate in real-time (Coming Soon)
                              </p>
                            </div>
                            <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors ml-auto opacity-50 cursor-not-allowed'>
                              <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div>
                      <h5 className='font-semibold mb-4 text-red-500'>⚠️ Danger Zone</h5>
                      <div className={`p-4 rounded-lg border-2 border-red-500 ${darkMode ? 'bg-red-900/10' : 'bg-red-50'}`}>
                        <div className='space-y-4'>
                          <div>
                            <h6 className='font-medium text-red-500 mb-2'>Reset All Settings</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                              This will reset all settings to their default values. This action cannot be undone.
                            </p>
                            <button className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
                              Reset Settings
                            </button>
                          </div>
                          <div className='border-t border-red-300 pt-4'>
                            <h6 className='font-medium text-red-500 mb-2'>Delete All Data</h6>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                              Permanently delete all your tasks, goals, and data. This action cannot be undone.
                            </p>
                            <button className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                              Delete All Data
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                  <h4 className='text-xl font-bold mb-6 flex items-center'>
                    <span className='text-2xl mr-3'>ℹ️</span>
                    About TaskFlow Pro
                  </h4>

                  <div className='space-y-6'>
                    {/* App Info */}
                    <div className='text-center'>
                      <div className='w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4'>
                        TF
                      </div>
                      <h5 className='text-2xl font-bold mb-2'>TaskFlow Pro</h5>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                        The ultimate productivity suite for modern professionals
                      </p>
                      <div className='flex items-center justify-center space-x-4 text-sm'>
                        <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                          Version 2.1.4
                        </span>
                        <span className='px-3 py-1 bg-green-100 text-green-600 rounded-full'>
                          Up to date
                        </span>
                      </div>
                    </div>

                    {/* Feature Highlights */}
                    <div>
                      <h6 className='font-semibold mb-4'>What's New in v2.1.4</h6>
                      <div className='space-y-3'>
                        {[
                          '🎨 Enhanced dark mode with better contrast',
                          '⚡ Improved performance and faster load times',
                          '🔔 Smarter notification system',
                          '📊 Advanced analytics dashboard',
                          '🔗 Better integration support',
                          '🐛 Various bug fixes and improvements',
                        ].map((feature, index) => (
                          <div key={index} className='flex items-center space-x-3'>
                            <span className='text-lg'>{feature.split(' ')[0]}</span>
                            <span className='text-sm'>{feature.slice(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* System Info */}
                    <div>
                      <h6 className='font-semibold mb-4'>System Information</h6>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                          <div className='text-xs text-gray-500 mb-1'>Platform</div>
                          <div className='font-medium'>Web Application</div>
                        </div>
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                          <div className='text-xs text-gray-500 mb-1'>Browser</div>
                          <div className='font-medium'>Chrome 91.0.4472.124</div>
                        </div>
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                          <div className='text-xs text-gray-500 mb-1'>Last Updated</div>
                          <div className='font-medium'>June 25, 2025</div>
                        </div>
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                          <div className='text-xs text-gray-500 mb-1'>License</div>
                          <div className='font-medium'>Professional</div>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    <div>
                      <h6 className='font-semibold mb-4'>Resources & Support</h6>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {[
                          { title: 'Documentation', icon: '📚', link: '#' },
                          { title: 'Changelog', icon: '📝', link: '#' },
                          { title: 'Support', icon: '💬', link: '#' },
                          { title: 'Community', icon: '👥', link: '#' },
                          { title: 'Feature Requests', icon: '💡', link: '#' },
                          { title: 'Bug Reports', icon: '🐛', link: '#' },
                          { title: 'Privacy Policy', icon: '🔒', link: '#' },
                          { title: 'Terms of Service', icon: '📄', link: '#' },
                        ].map((resource, index) => (
                          <button key={index} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors text-left`}>
                            <div className='text-2xl mb-2'>{resource.icon}</div>
                            <div className='text-sm font-medium'>{resource.title}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Credits */}
                    <div className='text-center pt-6 border-t border-gray-200 dark:border-gray-700'>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        Made with ❤️ by the TaskFlow Pro Team
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        © 2025 TaskFlow Pro. All rights reserved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Page Content */}
        {activeTab === 'goals' && (
          <div>
            {/* Goal Stats */}
            <div className='grid grid-cols-2 md:grid-cols-6 gap-4 mb-8'>
              {(() => {
                const stats = getGoalStats();
                return [
                  { label: 'Total Goals', value: stats.total, color: 'from-blue-500 to-blue-600', icon: Target },
                  { label: 'Active', value: stats.active, color: 'from-green-500 to-green-600', icon: Play },
                  { label: 'Completed', value: stats.completed, color: 'from-purple-500 to-purple-600', icon: Trophy },
                  { label: 'Paused', value: stats.paused, color: 'from-yellow-500 to-yellow-600', icon: Pause },
                  { label: 'High Priority', value: stats.highPriority, color: 'from-red-500 to-red-600', icon: Flame },
                  { label: 'Avg Progress', value: `${stats.averageProgress}%`, color: 'from-indigo-500 to-indigo-600', icon: BarChart3 },
                ].map(({ label, value, color, icon: Icon }, index) => (
                  <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`w-8 h-8 bg-gradient-to-r ${color} rounded-lg mb-2 flex items-center justify-center`}>
                      <Icon className='w-4 h-4 text-white' />
                    </div>
                    <p className='text-xl font-bold'>{value}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
                  </div>
                ));
              })()}
            </div>

            {/* Goal Controls */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
              <div className='flex flex-wrap items-center gap-4'>
                <select
                  value={goalFilter}
                  onChange={(e) => setGoalFilter(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value='all'>All Goals</option>
                  <option value='active'>Active</option>
                  <option value='completed'>Completed</option>
                  <option value='paused'>Paused</option>
                  <option value='learning'>Learning</option>
                  <option value='career'>Career</option>
                  <option value='personal'>Personal</option>
                  <option value='health'>Health</option>
                  <option value='business'>Business</option>
                </select>

                <select
                  value={goalSort}
                  onChange={(e) => setGoalSort(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value='progress'>Sort by Progress</option>
                  <option value='streak'>Sort by Streak</option>
                  <option value='priority'>Sort by Priority</option>
                  <option value='deadline'>Sort by Deadline</option>
                </select>

                <div className='flex rounded-lg border border-gray-300 overflow-hidden'>
                  <button
                    onClick={() => setGoalViewMode('cards')}
                    className={`p-2 ${goalViewMode === 'cards' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
                  >
                    <Target className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => setGoalViewMode('list')}
                    className={`p-2 ${goalViewMode === 'list' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
                  >
                    <CheckSquare className='w-4 h-4' />
                  </button>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                {selectedGoals.length > 0 && (
                  <div className='flex items-center gap-2'>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedGoals.length}
                      {' '}
                      selected
                    </span>
                    <button className='px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600'>
                      Delete
                    </button>
                    <button className='px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600'>
                      Pause
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowCreateGoal(true)}
                  className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                  <span>New Goal</span>
                </button>
              </div>
            </div>

            {/* Goals Display */}
            {goalViewMode === 'cards' ? (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {getFilteredGoals().map((goal) => (
                  <div key={goal.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm hover:shadow-md transition-all duration-200`}>
                    <div className='p-6'>
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-center space-x-3'>
                          <input
                            type='checkbox'
                            checked={selectedGoals.includes(goal.id)}
                            onChange={() => toggleGoalSelection(goal.id)}
                            className='w-4 h-4 text-purple-600 rounded focus:ring-purple-500'
                          />
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(goal.category)}`} />
                        </div>
                        <button
                          onClick={() => toggleGoalExpanded(goal.id)}
                          className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <svg className={`w-4 h-4 transform transition-transform ${expandedGoal === goal.id ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                          </svg>
                        </button>
                      </div>

                      <div className='mb-4'>
                        <div className='flex items-center gap-2 mb-2'>
                          <h3 className='font-semibold text-lg'>{goal.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(goal.status)}`}>
                            {goal.status}
                          </span>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                          {goal.description}
                        </p>
                      </div>

                      {/* Progress Circle */}
                      <div className='flex items-center justify-center mb-4'>
                        <div className='relative w-24 h-24'>
                          <svg className='w-24 h-24 transform -rotate-90' viewBox='0 0 100 100'>
                            <circle
                              cx='50'
                              cy='50'
                              r='40'
                              stroke={darkMode ? '#374151' : '#E5E7EB'}
                              strokeWidth='8'
                              fill='none'
                            />
                            <circle
                              cx='50'
                              cy='50'
                              r='40'
                              stroke='url(#gradient)'
                              strokeWidth='8'
                              fill='none'
                              strokeLinecap='round'
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - goal.progress / 100)}`}
                              className='transition-all duration-500'
                            />
                            <defs>
                              <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                                <stop offset='0%' stopColor='#A855F7' />
                                <stop offset='100%' stopColor='#EC4899' />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className='absolute inset-0 flex items-center justify-center'>
                            <span className='text-xl font-bold'>
                              {goal.progress}
                              %
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Goal Stats */}
                      <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div className='text-center'>
                          <div className='flex items-center justify-center text-orange-500 mb-1'>
                            <Flame className='w-4 h-4 mr-1' />
                            <span className='font-semibold'>{goal.streak}</span>
                          </div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</p>
                        </div>
                        <div className='text-center'>
                          <div className='flex items-center justify-center mb-1'>
                            <Clock className='w-4 h-4 mr-1' />
                            <span className='font-semibold'>{goal.totalTime}</span>
                          </div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Time</p>
                        </div>
                      </div>

                      {/* Weekly Progress */}
                      <div className='mb-4'>
                        <div className='flex justify-between text-sm mb-1'>
                          <span>This Week</span>
                          <span>
                            {goal.currentWeekHours}
                            h /
                            {' '}
                            {goal.weeklyTarget}
                            h
                          </span>
                        </div>
                        <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                          <div
                            className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500'
                            style={{ width: `${getWeeklyProgress(goal)}%` }}
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div className='flex flex-wrap gap-1 mb-4'>
                        {goal.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className='px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs'>
                            #
                            {tag}
                          </span>
                        ))}
                        {goal.tags.length > 3 && (
                          <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                            +
                            {goal.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Achievements */}
                      {goal.achievements.length > 0 && (
                        <div className='flex flex-wrap gap-1'>
                          {goal.achievements.slice(0, 2).map((achievement, index) => (
                            <span key={index} className='inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-xs'>
                              <Trophy className='w-3 h-3 mr-1' />
                              {achievement}
                            </span>
                          ))}
                          {goal.achievements.length > 2 && (
                            <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                              +
                              {goal.achievements.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className='flex gap-2 mt-4'>
                        <button
                          onClick={() => toggleTimer(goal.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors ${activeTimer === goal.id
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'}`}
                        >
                          {activeTimer === goal.id ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
                          {activeTimer === goal.id ? 'Stop' : 'Start'}
                        </button>
                        <button className={`px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>
                          <Settings className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Goal Details */}
                    {expandedGoal === goal.id && (
                      <div className={`border-t px-6 py-4 ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                        {/* Milestones */}
                        <div className='mb-4'>
                          <h5 className='font-semibold mb-3 flex items-center'>
                            <Target className='w-4 h-4 mr-2' />
                            Milestones (
                            {goal.milestones.filter((m) => m.completed).length}
                            /
                            {goal.milestones.length}
                            )
                          </h5>
                          <div className='space-y-2'>
                            {goal.milestones.map((milestone) => (
                              <div key={milestone.id} className='flex items-center justify-between'>
                                <div className='flex items-center space-x-3'>
                                  <input
                                    type='checkbox'
                                    checked={milestone.completed}
                                    className='w-4 h-4 text-green-600 rounded'
                                    readOnly
                                  />
                                  <span className={`text-sm ${milestone.completed ? 'line-through text-gray-500' : ''}`}>
                                    {milestone.title}
                                  </span>
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {milestone.completed ? milestone.completedDate : milestone.targetDate}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className='mb-4'>
                          <h5 className='font-semibold mb-2'>Timeline</h5>
                          <div className='flex justify-between text-sm'>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Started:
                              {' '}
                              {new Date(goal.startDate).toLocaleDateString()}
                            </span>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Target:
                              {' '}
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Notes */}
                        {goal.notes && (
                          <div>
                            <h5 className='font-semibold mb-2'>Notes</h5>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} bg-gradient-to-r from-purple-50 to-pink-50 ${darkMode ? 'from-purple-900/20 to-pink-900/20' : ''} p-3 rounded-lg`}>
                              {goal.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className='space-y-4'>
                {getFilteredGoals().map((goal) => (
                  <div key={goal.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm hover:shadow-md transition-all duration-200`}>
                    <div className='p-6'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4 flex-1'>
                          <input
                            type='checkbox'
                            checked={selectedGoals.includes(goal.id)}
                            onChange={() => toggleGoalSelection(goal.id)}
                            className='w-4 h-4 text-purple-600 rounded focus:ring-purple-500'
                          />
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(goal.category)}`} />
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                              <h4 className='font-semibold text-lg'>{goal.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                {goal.category}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(goal.status)}`}>
                                {goal.status}
                              </span>
                            </div>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>
                              {goal.description}
                            </p>
                            <div className='flex items-center gap-6 text-sm'>
                              <div className='flex items-center'>
                                <BarChart3 className='w-4 h-4 mr-1' />
                                <span>
                                  {goal.progress}
                                  % complete
                                </span>
                              </div>
                              <div className='flex items-center text-orange-500'>
                                <Flame className='w-4 h-4 mr-1' />
                                <span>
                                  {goal.streak}
                                  {' '}
                                  day streak
                                </span>
                              </div>
                              <div className='flex items-center'>
                                <Clock className='w-4 h-4 mr-1' />
                                <span>
                                  {goal.totalTime}
                                  {' '}
                                  total
                                </span>
                              </div>
                              <div className='flex items-center'>
                                <Calendar className='w-4 h-4 mr-1' />
                                <span>
                                  Due
                                  {formatDate(goal.targetDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center space-x-2'>
                          <div className='w-20 h-2 bg-gray-200 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500'
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <span className='text-sm font-medium w-12 text-right'>
                            {goal.progress}
                            %
                          </span>
                          <button
                            onClick={() => toggleTimer(goal.id)}
                            className={`p-2 rounded-lg transition-colors ${activeTimer === goal.id
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'}`}
                          >
                            {activeTimer === goal.id ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dashboard Content - Original */}
        {activeTab === 'dashboard' && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Recent Tasks */}
            <div className='lg:col-span-2'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold'>Recent Tasks</h3>
                <button className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
                  <Plus className='w-4 h-4' />
                  <span>Add Task</span>
                </button>
              </div>

              <div className='space-y-4'>
                {recentTasks.map((task) => (
                  <div key={task.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow`}>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        <div>
                          <h4 className='font-semibold'>{task.title}</h4>
                          <div className='flex items-center space-x-4 mt-2'>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm flex items-center`}>
                              <Clock className='w-4 h-4 mr-1' />
                              {task.time}
                            </span>
                            {task.streak > 0 && (
                              <span className='text-orange-500 text-sm flex items-center'>
                                <Flame className='w-4 h-4 mr-1' />
                                {task.streak}
                                {' '}
                                day streak
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleTimer(task.id)}
                        className={`p-3 rounded-lg transition-colors ${activeTimer === task.id
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'}`}
                      >
                        {activeTimer === task.id ? <Pause className='w-5 h-5' /> : <Play className='w-5 h-5' />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals Progress */}
            <div>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold'>Active Goals</h3>
                <button className='text-purple-500 hover:text-purple-600 text-sm font-medium'>View All</button>
              </div>

              <div className='space-y-4'>
                {goals.map((goal) => (
                  <div key={goal.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                    <div className='mb-4'>
                      <h4 className='font-semibold mb-2'>{goal.title}</h4>
                      <div className='flex items-center justify-between text-sm mb-2'>
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {goal.progress}
                          % complete
                        </span>
                        <span className='text-orange-500 flex items-center'>
                          <Flame className='w-4 h-4 mr-1' />
                          {goal.streak}
                          {' '}
                          days
                        </span>
                      </div>
                      <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                        <div
                          className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500'
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className={`flex items-center justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className='flex items-center'>
                        <Clock className='w-4 h-4 mr-1' />
                        {goal.totalTime}
                      </span>
                      <button className='text-purple-500 hover:text-purple-600 font-medium'>
                        Continue
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm mt-6`}>
                <h4 className='font-semibold mb-4'>Quick Actions</h4>
                <div className='space-y-3'>
                  <button className='w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-500/10 text-purple-500 transition-colors'>
                    <Plus className='w-5 h-5' />
                    <span>Create New Goal</span>
                  </button>
                  <button className='w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors'>
                    <BarChart3 className='w-5 h-5' />
                    <span>View Analytics</span>
                  </button>
                  <button className='w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-green-500/10 text-green-500 transition-colors'>
                    <Calendar className='w-5 h-5' />
                    <span>Schedule Review</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Creation Modal */}
        {showCreateTask && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                    <CheckSquare className='w-4 h-4 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold'>Create New Task</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Step
                      {' '}
                      {taskCreationStep}
                      {' '}
                      of 3
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCreateTask(false);
                    resetTaskForm();
                  }}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className={`h-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className='h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300'
                  style={{ width: `${(taskCreationStep / 3) * 100}%` }}
                />
              </div>

              <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
                {/* Step 1: Template Selection */}
                {taskCreationStep === 1 && (
                  <div className='p-6'>
                    <div className='text-center mb-8'>
                      <h4 className='text-2xl font-bold mb-2'>Choose a Template</h4>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Start with a template or create from scratch
                      </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                      {taskTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => applyTaskTemplate(template)}
                          className={`p-6 rounded-xl border-2 ${darkMode
                            ? 'border-gray-700 hover:border-purple-500 bg-gray-750'
                            : 'border-gray-200 hover:border-purple-500 bg-white'} transition-all duration-200 hover:shadow-lg text-left group`}
                        >
                          <div className='flex items-center space-x-4 mb-3'>
                            <div className='text-3xl'>{template.icon}</div>
                            <div>
                              <h5 className='font-semibold text-lg group-hover:text-purple-500 transition-colors'>
                                {template.name}
                              </h5>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {template.category}
                                {' '}
                                •
                                {template.priority}
                                {' '}
                                priority
                              </p>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <div>
                              <span className='text-xs font-medium text-purple-500'>Includes:</span>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {template.subtasks.length}
                                {' '}
                                subtasks,
                                {template.checklist.length}
                                {' '}
                                checklist items
                              </p>
                            </div>
                            <div className='flex flex-wrap gap-1'>
                              {template.tags.map((tag, index) => (
                                <span key={index} className='px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs'>
                                  #
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className='text-center'>
                      <button
                        onClick={() => setTaskCreationStep(2)}
                        className={`px-6 py-3 rounded-lg border-2 border-dashed ${darkMode
                          ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-750'
                          : 'border-gray-300 hover:border-purple-500 hover:bg-gray-50'} transition-all duration-200`}
                      >
                        <Plus className='w-5 h-5 mx-auto mb-2' />
                        <span className='font-medium'>Start from scratch</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Basic Information */}
                {taskCreationStep === 2 && (
                  <div className='p-6'>
                    <div className='mb-6'>
                      <h4 className='text-xl font-bold mb-2'>Task Details</h4>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Provide the basic information for your task
                      </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-6'>
                        {/* Title */}
                        <div>
                          <label className='block text-sm font-medium mb-2'>Task Title *</label>
                          <input
                            type='text'
                            value={taskFormData.title}
                            onChange={(e) => updateTaskFormData('title', e.target.value)}
                            placeholder='Enter task title...'
                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className='block text-sm font-medium mb-2'>Description</label>
                          <textarea
                            value={taskFormData.description}
                            onChange={(e) => updateTaskFormData('description', e.target.value)}
                            placeholder='Describe your task...'
                            rows={3}
                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          />
                        </div>

                        {/* Category & Priority */}
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-medium mb-2'>Category</label>
                            <select
                              value={taskFormData.category}
                              onChange={(e) => updateTaskFormData('category', e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            >
                              <option value=''>Select category</option>
                              <option value='Development'>Development</option>
                              <option value='Design'>Design</option>
                              <option value='Meeting'>Meeting</option>
                              <option value='Content'>Content</option>
                              <option value='Research'>Research</option>
                              <option value='Personal'>Personal</option>
                            </select>
                          </div>
                          <div>
                            <label className='block text-sm font-medium mb-2'>Priority</label>
                            <select
                              value={taskFormData.priority}
                              onChange={(e) => updateTaskFormData('priority', e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            >
                              <option value='low'>Low</option>
                              <option value='medium'>Medium</option>
                              <option value='high'>High</option>
                            </select>
                          </div>
                        </div>

                        {/* Due Date */}
                        <div>
                          <label className='block text-sm font-medium mb-2'>Due Date</label>
                          <input
                            type='date'
                            value={taskFormData.dueDate}
                            onChange={(e) => updateTaskFormData('dueDate', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          />
                        </div>
                      </div>

                      <div className='space-y-6'>
                        {/* Tags */}
                        <div>
                          <label className='block text-sm font-medium mb-2'>Tags</label>
                          <div className='flex space-x-2 mb-2'>
                            <input
                              type='text'
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTaskTag())}
                              placeholder='Add tag...'
                              className={`flex-1 px-3 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                            <button
                              onClick={addTaskTag}
                              className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                            >
                              Add
                            </button>
                          </div>
                          <div className='flex flex-wrap gap-2'>
                            {taskFormData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className='inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm'
                              >
                                #
                                {tag}
                                <button
                                  onClick={() => removeTaskTag(tag)}
                                  className='ml-2 hover:text-purple-800'
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                          <label className='block text-sm font-medium mb-2'>Quick Actions</label>
                          <div className='grid grid-cols-2 gap-2'>
                            <button
                              onClick={() => {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                updateTaskFormData('dueDate', tomorrow.toISOString().split('T')[0]);
                              }}
                              className={`px-3 py-2 rounded-lg border ${darkMode
                                ? 'border-gray-600 hover:bg-gray-700'
                                : 'border-gray-300 hover:bg-gray-50'} transition-colors text-sm`}
                            >
                              Due Tomorrow
                            </button>
                            <button
                              onClick={() => {
                                const nextWeek = new Date();
                                nextWeek.setDate(nextWeek.getDate() + 7);
                                updateTaskFormData('dueDate', nextWeek.toISOString().split('T')[0]);
                              }}
                              className={`px-3 py-2 rounded-lg border ${darkMode
                                ? 'border-gray-600 hover:bg-gray-700'
                                : 'border-gray-300 hover:bg-gray-50'} transition-colors text-sm`}
                            >
                              Due Next Week
                            </button>
                            <button
                              onClick={() => updateTaskFormData('priority', 'high')}
                              className={`px-3 py-2 rounded-lg border ${taskFormData.priority === 'high'
                                ? 'border-red-500 bg-red-50 text-red-600'
                                : darkMode
                                  ? 'border-gray-600 hover:bg-gray-700'
                                  : 'border-gray-300 hover:bg-gray-50'} transition-colors text-sm`}
                            >
                              High Priority
                            </button>
                            <button
                              onClick={() => updateTaskFormData('tags', [...taskFormData.tags, 'urgent'].filter((tag, index, arr) => arr.indexOf(tag) === index))}
                              className={`px-3 py-2 rounded-lg border ${taskFormData.tags.includes('urgent')
                                ? 'border-orange-500 bg-orange-50 text-orange-600'
                                : darkMode
                                  ? 'border-gray-600 hover:bg-gray-700'
                                  : 'border-gray-300 hover:bg-gray-50'} transition-colors text-sm`}
                            >
                              Mark Urgent
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Advanced Options */}
                {taskCreationStep === 3 && (
                  <div className='p-6'>
                    <div className='mb-6'>
                      <h4 className='text-xl font-bold mb-2'>Advanced Options</h4>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Add subtasks, checklist items, and notes
                      </p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                      {/* Subtasks */}
                      <div>
                        <h5 className='font-semibold mb-4 flex items-center'>
                          <CheckSquare className='w-4 h-4 mr-2' />
                          Subtasks (
                          {taskFormData.subtasks.length}
                          )
                        </h5>
                        <div className='space-y-3 mb-4'>
                          <div className='flex space-x-2'>
                            <input
                              type='text'
                              value={currentSubtask}
                              onChange={(e) => setCurrentSubtask(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                              placeholder='Add subtask...'
                              className={`flex-1 px-3 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                            <button
                              onClick={addSubtask}
                              className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                            >
                              Add
                            </button>
                          </div>
                          <div className='space-y-2 max-h-40 overflow-y-auto'>
                            {taskFormData.subtasks.map((subtask) => (
                              <div key={subtask.id} className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                                <span className='flex-1'>{subtask.title}</span>
                                <button
                                  onClick={() => removeSubtask(subtask.id)}
                                  className='text-red-500 hover:text-red-700 ml-2'
                                >
                                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Checklist */}
                      <div>
                        <h5 className='font-semibold mb-4 flex items-center'>
                          <Trophy className='w-4 h-4 mr-2' />
                          Checklist (
                          {taskFormData.checklist.length}
                          )
                        </h5>
                        <div className='space-y-3 mb-4'>
                          <div className='flex space-x-2'>
                            <input
                              type='text'
                              value={currentChecklist}
                              onChange={(e) => setCurrentChecklist(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                              placeholder='Add checklist item...'
                              className={`flex-1 px-3 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                            <button
                              onClick={addChecklistItem}
                              className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                            >
                              Add
                            </button>
                          </div>
                          <div className='space-y-2 max-h-40 overflow-y-auto'>
                            {taskFormData.checklist.map((item) => (
                              <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                                <span className='flex-1 text-sm'>{item.text}</span>
                                <button
                                  onClick={() => removeChecklistItem(item.id)}
                                  className='text-red-500 hover:text-red-700 ml-2'
                                >
                                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className='mt-8'>
                      <label className='block text-sm font-medium mb-2'>Notes</label>
                      <textarea
                        value={taskFormData.notes}
                        onChange={(e) => updateTaskFormData('notes', e.target.value)}
                        placeholder='Add any additional notes or context...'
                        rows={4}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <div className='flex space-x-3'>
                  {taskCreationStep > 1 && (
                    <button
                      onClick={() => setTaskCreationStep(taskCreationStep - 1)}
                      className={`px-4 py-2 rounded-lg border ${darkMode
                        ? 'border-gray-600 hover:bg-gray-700'
                        : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                    >
                      Back
                    </button>
                  )}
                </div>
                <div className='flex space-x-3'>
                  <button
                    onClick={() => {
                      setShowCreateTask(false);
                      resetTaskForm();
                    }}
                    className={`px-4 py-2 rounded-lg ${darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    Cancel
                  </button>
                  {taskCreationStep < 3 ? (
                    <button
                      onClick={() => setTaskCreationStep(taskCreationStep + 1)}
                      disabled={taskCreationStep === 2 && !taskFormData.title.trim()}
                      className='px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleCreateTask}
                      disabled={!taskFormData.title.trim()}
                      className='px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Create Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goal Creation Modal */}
        {showCreateGoal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                    <Target className='w-4 h-4 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold'>Create New Goal</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Step
                      {' '}
                      {goalCreationStep}
                      {' '}
                      of 3
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCreateGoal(false);
                    resetGoalForm();
                  }}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className={`h-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className='h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300'
                  style={{ width: `${(goalCreationStep / 3) * 100}%` }}
                />
              </div>

              <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
                {/* Step 1: Template Selection */}
                {goalCreationStep === 1 && (
                  <div className='p-6'>
                    <div className='text-center mb-8'>
                      <h4 className='text-2xl font-bold mb-2'>Choose a Goal Template</h4>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Start with a proven template or create your own goal
                      </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                      {goalTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => applyGoalTemplate(template)}
                          className={`p-6 rounded-xl border-2 ${darkMode
                            ? 'border-gray-700 hover:border-purple-500 bg-gray-750'
                            : 'border-gray-200 hover:border-purple-500 bg-white'} transition-all duration-200 hover:shadow-lg text-left group`}
                        >
                          <div className='flex items-center space-x-4 mb-3'>
                            <div className='text-3xl'>{template.icon}</div>
                            <div>
                              <h5 className='font-semibold text-lg group-hover:text-purple-500 transition-colors'>
                                {template.name}
                              </h5>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {template.category}
                                {' '}
                                •
                                {template.weeklyTarget}
                                h/week
                              </p>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <div>
                              <span className='text-xs font-medium text-purple-500'>Includes:</span>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {template.milestones.length}
                                {' '}
                                milestones, weekly tracking
                              </p>
                            </div>
                            <div className='flex flex-wrap gap-1'>
                              {template.tags.map((tag, index) => (
                                <span key={index} className='px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs'>
                                  #
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className='text-center'>
                      <button
                        onClick={() => setGoalCreationStep(2)}
                        className={`px-6 py-3 rounded-lg border-2 border-dashed ${darkMode
                          ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-750'
                          : 'border-gray-300 hover:border-purple-500 hover:bg-gray-50'} transition-all duration-200`}
                      >
                        <Plus className='w-5 h-5 mx-auto mb-2' />
                        <span className='font-medium'>Create custom goal</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Basic Information */}
                {goalCreationStep === 2 && (
                  <div className='p-6'>
                    <div className='mb-6'>
                      <h4 className='text-xl font-bold mb-2'>Goal Details</h4>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Define your goal and timeline
                      </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-6'>
                        {/* Title */}
                        <div>
                          <label className='block text-sm font-medium mb-2'>Goal Title *</label>
                          <input
                            type='text'
                            value={goalFormData.title}
                            onChange={(e) => updateGoalFormData('title', e.target.value)}
                            placeholder='Enter goal title...'
                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className='block text-sm font-medium mb-2'>Description</label>
                          <textarea
                            value={goalFormData.description}
                            onChange={(e) => updateGoalFormData('description', e.target.value)}
                            placeholder='Describe your goal...'
                            rows={3}
                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          />
                        </div>

                        {/* Category & Priority */}
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-medium mb-2'>Category</label>
                            <select
                              value={goalFormData.category}
                              onChange={(e) => updateGoalFormData('category', e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            >
                              <option value=''>Select category</option>
                              <option value='Learning'>Learning</option>
                              <option value='Career'>Career</option>
                              <option value='Health'>Health</option>
                              <option value='Personal'>Personal</option>
                              <option value='Business'>Business</option>
                              <option value='Creative'>Creative</option>
                            </select>
                          </div>
                          <div>
                            <label className='block text-sm font-medium mb-2'>Priority</label>
                            <select
                              value={goalFormData.priority}
                              onChange={(e) => updateGoalFormData('priority', e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            >
                              <option value='low'>Low</option>
                              <option value='medium'>Medium</option>
                              <option value='high'>High</option>
                            </select>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-medium mb-2'>Start Date</label>
                            <input
                              type='date'
                              value={goalFormData.startDate}
                              onChange={(e) => updateGoalFormData('startDate', e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium mb-2'>Target Date</label>
                            <input
                              type='date'
                              value={goalFormData.targetDate}
                              onChange={(e) => updateGoalFormData('targetDate', e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className='space-y-6'>
                        {/* Weekly Target */}
                        <div>
                          <label className='block text-sm font-medium mb-2'>
                            Weekly Target:
                            {' '}
                            {goalFormData.weeklyTarget}
                            {' '}
                            hours
                          </label>
                          <input
                            type='range'
                            min='1'
                            max='20'
                            value={goalFormData.weeklyTarget}
                            onChange={(e) => updateGoalFormData('weeklyTarget', parseInt(e.target.value))}
                            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-gray-500 mt-1'>
                            <span>1h</span>
                            <span>10h</span>
                            <span>20h</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className='block text-sm font-medium mb-2'>Tags</label>
                          <div className='flex space-x-2 mb-2'>
                            <input
                              type='text'
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoalTag())}
                              placeholder='Add tag...'
                              className={`flex-1 px-3 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                            <button
                              onClick={addGoalTag}
                              className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                            >
                              Add
                            </button>
                          </div>
                          <div className='flex flex-wrap gap-2'>
                            {goalFormData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className='inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm'
                              >
                                #
                                {tag}
                                <button
                                  onClick={() => removeGoalTag(tag)}
                                  className='ml-2 hover:text-purple-800'
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                          <label className='block text-sm font-medium mb-2'>Quick Setup</label>
                          <div className='grid grid-cols-2 gap-2'>
                            <button
                              onClick={() => {
                                const today = new Date();
                                const threeMonths = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
                                updateGoalFormData('startDate', today.toISOString().split('T')[0]);
                                updateGoalFormData('targetDate', threeMonths.toISOString().split('T')[0]);
                              }}
                              className={`px-3 py-2 rounded-lg border ${darkMode
                                ? 'border-gray-600 hover:bg-gray-700'
                                : 'border-gray-300 hover:bg-gray-50'} transition-colors text-sm`}
                            >
                              3 Month Goal
                            </button>
                            <button
                              onClick={() => {
                                const today = new Date();
                                const sixMonths = new Date(today.getTime() + (180 * 24 * 60 * 60 * 1000));
                                updateGoalFormData('startDate', today.toISOString().split('T')[0]);
                                updateGoalFormData('targetDate', sixMonths.toISOString().split('T')[0]);
                              }}
                              className={`px-3 py-2 rounded-lg border ${darkMode
                                ? 'border-gray-600 hover:bg-gray-700'
                                : 'border-gray-300 hover:bg-gray-50'} transition-colors text-sm`}
                            >
                              6 Month Goal
                            </button>
                            <button
                              onClick={() => updateGoalFormData('weeklyTarget', 10)}
                              className={`px-3 py-2 rounded-lg border ${goalFormData.weeklyTarget === 10
                                ? 'border-purple-500 bg-purple-50 text-purple-600'
                                : darkMode
                                  ? 'border-gray-600 hover:bg-gray-700'
                                  : 'border-gray-300 hover:bg-gray-50'} transition-colors text-sm`}
                            >
                              10h/week
                            </button>
                            <button
                              onClick={() => updateGoalFormData('priority', 'high')}
                              className={`px-3 py-2 rounded-lg border ${goalFormData.priority === 'high'
                                ? 'border-red-500 bg-red-50 text-red-600'
                                : darkMode
                                  ? 'border-gray-600 hover:bg-gray-700'
                                  : 'border-gray-300 hover:bg-gray-50'} transition-colors text-sm`}
                            >
                              High Priority
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Milestones & Notes */}
                {goalCreationStep === 3 && (
                  <div className='p-6'>
                    <div className='mb-6'>
                      <h4 className='text-xl font-bold mb-2'>Milestones & Notes</h4>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Break down your goal into achievable milestones
                      </p>
                    </div>

                    <div className='space-y-8'>
                      {/* Milestones */}
                      <div>
                        <h5 className='font-semibold mb-4 flex items-center'>
                          <Target className='w-4 h-4 mr-2' />
                          Milestones (
                          {goalFormData.milestones.length}
                          )
                        </h5>
                        <div className='space-y-4 mb-4'>
                          <div className='flex space-x-2'>
                            <input
                              type='text'
                              value={currentMilestone.title}
                              onChange={(e) => setCurrentMilestone((prev) => ({ ...prev, title: e.target.value }))}
                              placeholder='Milestone title...'
                              className={`flex-1 px-3 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                            <input
                              type='date'
                              value={currentMilestone.targetDate}
                              onChange={(e) => setCurrentMilestone((prev) => ({ ...prev, targetDate: e.target.value }))}
                              className={`px-3 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                            <button
                              onClick={addMilestone}
                              className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                            >
                              Add
                            </button>
                          </div>
                          <div className='space-y-2 max-h-60 overflow-y-auto'>
                            {goalFormData.milestones.map((milestone, index) => (
                              <div key={milestone.id} className={`flex items-center justify-between p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                                <div className='flex-1'>
                                  <h6 className='font-medium'>{milestone.title}</h6>
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Target:
                                    {' '}
                                    {new Date(milestone.targetDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className='flex items-center space-x-2'>
                                  <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                    #
                                    {index + 1}
                                  </span>
                                  <button
                                    onClick={() => removeMilestone(milestone.id)}
                                    className='text-red-500 hover:text-red-700'
                                  >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className='block text-sm font-medium mb-2'>Notes & Strategy</label>
                        <textarea
                          value={goalFormData.notes}
                          onChange={(e) => updateGoalFormData('notes', e.target.value)}
                          placeholder='Add your strategy, motivation, or any additional notes...'
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                      </div>

                      {/* Goal Summary */}
                      <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                        <h6 className='font-semibold mb-2'>Goal Summary</h6>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                          <div>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration:</span>
                            <p className='font-medium'>
                              {goalFormData.startDate && goalFormData.targetDate
                                ? `${Math.ceil((new Date(goalFormData.targetDate).getTime() - new Date(goalFormData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                                : 'Not set'}
                            </p>
                          </div>
                          <div>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weekly:</span>
                            <p className='font-medium'>
                              {goalFormData.weeklyTarget}
                              h
                            </p>
                          </div>
                          <div>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Milestones:</span>
                            <p className='font-medium'>{goalFormData.milestones.length}</p>
                          </div>
                          <div>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Priority:</span>
                            <p className='font-medium capitalize'>{goalFormData.priority}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <div className='flex space-x-3'>
                  {goalCreationStep > 1 && (
                    <button
                      onClick={() => setGoalCreationStep(goalCreationStep - 1)}
                      className={`px-4 py-2 rounded-lg border ${darkMode
                        ? 'border-gray-600 hover:bg-gray-700'
                        : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                    >
                      Back
                    </button>
                  )}
                </div>
                <div className='flex space-x-3'>
                  <button
                    onClick={() => {
                      setShowCreateGoal(false);
                      resetGoalForm();
                    }}
                    className={`px-4 py-2 rounded-lg ${darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    Cancel
                  </button>
                  {goalCreationStep < 3 ? (
                    <button
                      onClick={() => setGoalCreationStep(goalCreationStep + 1)}
                      disabled={goalCreationStep === 2 && !goalFormData.title.trim()}
                      className='px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleCreateGoal}
                      disabled={!goalFormData.title.trim()}
                      className='px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Create Goal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagementAppDesign;