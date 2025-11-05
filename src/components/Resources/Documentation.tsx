import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();

  const sections = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'goals', label: 'Goals' },
    { id: 'workspaces', label: 'Workspaces' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'settings', label: 'Settings' },
  ];

  const handleBackClick = () => {
    // navigateBack(navigate, searchParams, '/');
    navigate(-1);
  };

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const handleScroll = () => {
      const sections = ['getting-started', 'dashboard', 'tasks', 'goals', 'workspaces', 'analytics', 'calendar', 'settings'];

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={clsx('min-h-screen', darkMode ? 'bg-gray-900' : 'bg-gray-50')}>
      {/* Fixed Header */}
      <div
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 shadow-sm border-b',
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        )}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <button
              onClick={handleBackClick}
              className={clsx(
                'flex items-center gap-2 transition-colors',
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900',
              )}
            >
              <ArrowLeft className='w-5 h-5' />
              <span className='hidden sm:inline'>Back</span>
            </button>

            <div className='flex items-center gap-3'>
              <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg'>
                <FileText className='w-5 h-5 text-white' />
              </div>
              <h1 className={clsx('text-xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
                Documentation
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>

          {/* Sidebar Navigation */}
          <div className='lg:col-span-1'>
            <div className='sticky top-24'>
              <nav className={clsx('rounded-lg shadow-sm p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
                <h3 className={clsx('font-semibold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>Contents</h3>
                <ul className='space-y-2 text-sm'>
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => handleNavClick(section.id)}
                        className={clsx(
                          'w-full text-left px-3 py-2 rounded-md transition-colors',
                          activeSection === section.id
                            ? [
                              darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700',
                              'font-medium',
                            ]
                            : [
                              darkMode
                                ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700/50'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50',
                            ],
                        )}
                      >
                        {section.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Documentation Content */}
          <div className='lg:col-span-3'>
            <div className={clsx('rounded-lg shadow-sm p-8 space-y-12', darkMode ? 'bg-gray-800' : 'bg-white')}>

              {/* Getting Started */}
              <section id='getting-started'>
                <h2 className={clsx('text-3xl font-bold mb-6', darkMode ? 'text-white' : 'text-gray-900')}>Getting Started</h2>

                <div className='space-y-6'>
                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Welcome to Master Management</h3>
                    <p className={clsx('mb-4', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                      Master Management is a comprehensive productivity platform designed to help you manage tasks, achieve goals,
                      collaborate in workspaces, and track your progress with detailed analytics.
                    </p>
                  </div>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Key Features</h3>
                    <ul className={clsx('list-disc list-inside space-y-2', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                      <li>
                        <strong>Task Management:</strong>
                        {' '}
                        Create, organize, and track tasks with subtasks, priorities, and deadlines
                      </li>
                      <li>
                        <strong>Goal Setting:</strong>
                        {' '}
                        Set SMART goals with custom targets, frequencies, and progress tracking
                      </li>
                      <li>
                        <strong>Workspaces:</strong>
                        {' '}
                        Collaborate with teams in shared workspaces
                      </li>
                      <li>
                        <strong>Analytics:</strong>
                        {' '}
                        Comprehensive productivity insights and performance metrics
                      </li>
                      <li>
                        <strong>Calendar Integration:</strong>
                        {' '}
                        View and manage your schedule with task integration
                      </li>
                      <li>
                        <strong>Dark Mode:</strong>
                        {' '}
                        Eye-friendly interface with theme customization
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Quick Start</h3>
                    <ol className={clsx('list-decimal list-inside space-y-2', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                      <li>Sign up for an account or log in</li>
                      <li>Explore the Dashboard to get an overview</li>
                      <li>Create your first task or goal</li>
                      <li>Set up a workspace for collaboration</li>
                      <li>Customize your settings and preferences</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Dashboard */}
              <section id='dashboard'>
                <h2 className={clsx('text-3xl font-bold mb-6', darkMode ? 'text-white' : 'text-gray-900')}>Dashboard</h2>

                <div className='space-y-6'>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Your Dashboard provides a centralized view of your productivity metrics, recent tasks, and active goals.
                  </p>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Components</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Quick Stats</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Overview of tasks, goals, and productivity metrics</p>
                      </div>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Recent Tasks</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Latest tasks and their current status</p>
                      </div>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Active Goals</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Progress on your current goals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tasks */}
              <section id='tasks'>
                <h2 className={clsx('text-3xl font-bold mb-6', darkMode ? 'text-white' : 'text-gray-900')}>Tasks</h2>

                <div className='space-y-6'>
                  <p className={clsx(darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    Manage your tasks efficiently with comprehensive features for organization and tracking.
                  </p>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Creating Tasks</h3>
                    <ul className={clsx('list-disc list-inside space-y-2', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                      <li>Click "Create Task" from the Tasks page or Dashboard</li>
                      <li>Add title, description, and set priority level</li>
                      <li>Choose status: Todo, In Progress, Pending, Paused, or Complete</li>
                      <li>Set deadlines and frequency (daily, weekly, monthly)</li>
                      <li>Add subtasks for complex projects</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Task Features</h3>
                    <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                      <ul className={clsx('list-disc list-inside space-y-1', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                        <li>
                          <strong>Subtasks:</strong>
                          {' '}
                          Break down complex tasks into manageable steps
                        </li>
                        <li>
                          <strong>Sticky Notes:</strong>
                          {' '}
                          Add quick notes and reminders
                        </li>
                        <li>
                          <strong>Progress Tracking:</strong>
                          {' '}
                          Visual progress indicators
                        </li>
                        <li>
                          <strong>Inline Editing:</strong>
                          {' '}
                          Quick title and description updates
                        </li>
                        <li>
                          <strong>Status Management:</strong>
                          {' '}
                          Easy status transitions
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Goals */}
              <section id='goals'>
                <h2 className={clsx('text-3xl font-bold mb-6', darkMode ? 'text-white' : 'text-gray-900')}>Goals</h2>

                <div className='space-y-6'>
                  <p className={clsx(darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    Set and track meaningful goals with customizable targets and frequencies.
                  </p>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Goal Configuration</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Target Types</h4>
                        <ul className={clsx('text-sm space-y-1', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                          <li>• Repetition</li>
                          <li>• Hours</li>
                          <li>• Days/Weeks/Months</li>
                          <li>• Sessions</li>
                          <li>• Points</li>
                          <li>• Percentage</li>
                        </ul>
                      </div>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Frequencies</h4>
                        <ul className={clsx('text-sm space-y-1', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                          <li>• Daily</li>
                          <li>• Alternate Days</li>
                          <li>• Weekly</li>
                          <li>• Monthly</li>
                          <li>• Custom</li>
                        </ul>
                      </div>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Progress Tracking</h4>
                        <ul className={clsx('text-sm space-y-1', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                          <li>• Visual progress circles</li>
                          <li>• Completion percentages</li>
                          <li>• Target vs. actual metrics</li>
                          <li>• Historical data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Workspaces */}
              <section id='workspaces'>
                <h2 className={clsx('text-3xl font-bold mb-6', darkMode ? 'text-white' : 'text-gray-900')}>Workspaces</h2>

                <div className='space-y-6'>
                  <p className={clsx(darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    Collaborate with teams in shared workspaces for better project coordination.
                  </p>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Workspace Types</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Personal Workspace</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Private workspace for individual productivity</p>
                      </div>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Team Workspace</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Collaborative space for team projects and goals</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Getting Started</h3>
                    <ol className={clsx('list-decimal list-inside space-y-2', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                      <li>Create a new workspace or join existing one with invite code</li>
                      <li>Set up workspace goals and tasks</li>
                      <li>Invite team members to collaborate</li>
                      <li>Track collective progress and achievements</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Analytics */}
              <section id='analytics'>
                <h2 className={clsx('text-3xl font-bold mb-6', darkMode ? 'text-white' : 'text-gray-900')}>Analytics</h2>

                <div className='space-y-6'>
                  <p className={clsx(darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    Gain insights into your productivity patterns with comprehensive analytics and reporting.
                  </p>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Analytics Features</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Productivity Trends</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Track productivity over time</p>
                      </div>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Task Distribution</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Analyze task completion patterns</p>
                      </div>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Goal Progress</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Monitor goal achievement rates</p>
                      </div>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Focus Sessions</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Track focused work periods</p>
                      </div>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Streaks & Achievements</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Celebrate consistency and milestones</p>
                      </div>
                      <div className={clsx('p-4 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                        <h4 className={clsx('font-semibold mb-2', darkMode ? 'text-white' : 'text-gray-900')}>Productivity Tips</h4>
                        <p className={clsx('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>Personalized improvement suggestions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Calendar */}
              <section id='calendar'>
                <h2 className={clsx('text-3xl font-bold mb-6', darkMode ? 'text-white' : 'text-gray-900')}>Calendar</h2>

                <div className='space-y-6'>
                  <p className={clsx(darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    Manage your schedule with integrated calendar functionality and task planning.
                  </p>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Calendar Features</h3>
                    <ul className={clsx('list-disc list-inside space-y-2', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                      <li>View tasks and goals in calendar format</li>
                      <li>Schedule upcoming events and deadlines</li>
                      <li>Track daily, weekly, and monthly progress</li>
                      <li>Integrate with task management workflow</li>
                      <li>Category-based event organization</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Settings */}
              <section id='settings'>
                <h2 className={clsx('text-3xl font-bold mb-6', darkMode ? 'text-white' : 'text-gray-900')}>Settings & Profile</h2>

                <div className='space-y-6'>
                  <p className={clsx(darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    Customize your experience with personal preferences and account settings.
                  </p>

                  <div>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Customization Options</h3>
                    <ul className={clsx('list-disc list-inside space-y-2', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                      <li>
                        <strong>Theme:</strong>
                        {' '}
                        Switch between light and dark modes
                      </li>
                      <li>
                        <strong>Profile:</strong>
                        {' '}
                        Update personal information and preferences
                      </li>
                      <li>
                        <strong>Notifications:</strong>
                        {' '}
                        Configure alert preferences
                      </li>
                      <li>
                        <strong>Privacy:</strong>
                        {' '}
                        Manage data and sharing settings
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Support */}
              <section id='support'>
                <h2 className={clsx('text-3xl font-bold mb-6', darkMode ? 'text-white' : 'text-gray-900')}>Support & Resources</h2>

                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className={clsx('p-6 rounded-lg', darkMode ? 'bg-blue-900/20' : 'bg-blue-50')}>
                      <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-blue-100' : 'text-blue-900')}>Need Help?</h3>
                      <p className={clsx('mb-4', darkMode ? 'text-blue-300' : 'text-blue-700')}>
                        Visit our support page for assistance with any issues or questions.
                      </p>
                      <a href='/support' className={clsx('hover:underline font-medium', darkMode ? 'text-blue-400' : 'text-blue-600')}>
                        Get Support →
                      </a>
                    </div>

                    <div className={clsx('p-6 rounded-lg', darkMode ? 'bg-green-900/20' : 'bg-green-50')}>
                      <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-green-100' : 'text-green-900')}>Feature Requests</h3>
                      <p className={clsx('mb-4', darkMode ? 'text-green-300' : 'text-green-700')}>
                        Have an idea for improvement? Share your feature requests with us.
                      </p>
                      <a href='/feature-request' className={clsx('hover:underline font-medium', darkMode ? 'text-green-400' : 'text-green-600')}>
                        Request Feature →
                      </a>
                    </div>
                  </div>

                  <div className={clsx('p-6 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                    <h3 className={clsx('text-xl font-semibold mb-3', darkMode ? 'text-white' : 'text-gray-900')}>Additional Resources</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <a href='/community' className={clsx('hover:underline', darkMode ? 'text-blue-400' : 'text-blue-600')}>Community Forum</a>
                      <a href='/changelog' className={clsx('hover:underline', darkMode ? 'text-blue-400' : 'text-blue-600')}>What's New</a>
                      <a href='/bug-report' className={clsx('hover:underline', darkMode ? 'text-blue-400' : 'text-blue-600')}>Report Bug</a>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;