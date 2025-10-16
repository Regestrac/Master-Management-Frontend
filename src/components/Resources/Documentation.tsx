import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
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
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Fixed Header */}
      <div className='fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <button
              onClick={handleBackClick}
              className='flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              <span className='hidden sm:inline'>Back</span>
            </button>

            <div className='flex items-center gap-3'>
              <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg'>
                <FileText className='w-5 h-5 text-white' />
              </div>
              <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
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
              <nav className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>Contents</h3>
                <ul className='space-y-2 text-sm'>
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => handleNavClick(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeSection === section.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
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
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 space-y-12'>

              {/* Getting Started */}
              <section id='getting-started'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>Getting Started</h2>

                <div className='space-y-6'>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Welcome to Master Management</h3>
                    <p className='text-gray-600 dark:text-gray-300 mb-4'>
                      Master Management is a comprehensive productivity platform designed to help you manage tasks, achieve goals,
                      collaborate in workspaces, and track your progress with detailed analytics.
                    </p>
                  </div>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Key Features</h3>
                    <ul className='list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2'>
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
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Quick Start</h3>
                    <ol className='list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2'>
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
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>Dashboard</h2>

                <div className='space-y-6'>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Your Dashboard provides a centralized view of your productivity metrics, recent tasks, and active goals.
                  </p>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Components</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Quick Stats</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Overview of tasks, goals, and productivity metrics</p>
                      </div>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Recent Tasks</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Latest tasks and their current status</p>
                      </div>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Active Goals</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Progress on your current goals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tasks */}
              <section id='tasks'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>Tasks</h2>

                <div className='space-y-6'>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Manage your tasks efficiently with comprehensive features for organization and tracking.
                  </p>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Creating Tasks</h3>
                    <ul className='list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2'>
                      <li>Click "Create Task" from the Tasks page or Dashboard</li>
                      <li>Add title, description, and set priority level</li>
                      <li>Choose status: Todo, In Progress, Pending, Paused, or Complete</li>
                      <li>Set deadlines and frequency (daily, weekly, monthly)</li>
                      <li>Add subtasks for complex projects</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Task Features</h3>
                    <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                      <ul className='list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1'>
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
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>Goals</h2>

                <div className='space-y-6'>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Set and track meaningful goals with customizable targets and frequencies.
                  </p>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Goal Configuration</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Target Types</h4>
                        <ul className='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
                          <li>• Repetition</li>
                          <li>• Hours</li>
                          <li>• Days/Weeks/Months</li>
                          <li>• Sessions</li>
                          <li>• Points</li>
                          <li>• Percentage</li>
                        </ul>
                      </div>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Frequencies</h4>
                        <ul className='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
                          <li>• Daily</li>
                          <li>• Alternate Days</li>
                          <li>• Weekly</li>
                          <li>• Monthly</li>
                          <li>• Custom</li>
                        </ul>
                      </div>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Progress Tracking</h4>
                        <ul className='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
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
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>Workspaces</h2>

                <div className='space-y-6'>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Collaborate with teams in shared workspaces for better project coordination.
                  </p>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Workspace Types</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Personal Workspace</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Private workspace for individual productivity</p>
                      </div>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Team Workspace</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Collaborative space for team projects and goals</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Getting Started</h3>
                    <ol className='list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2'>
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
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>Analytics</h2>

                <div className='space-y-6'>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Gain insights into your productivity patterns with comprehensive analytics and reporting.
                  </p>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Analytics Features</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Productivity Trends</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Track productivity over time</p>
                      </div>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Task Distribution</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Analyze task completion patterns</p>
                      </div>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Goal Progress</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Monitor goal achievement rates</p>
                      </div>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Focus Sessions</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Track focused work periods</p>
                      </div>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Streaks & Achievements</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Celebrate consistency and milestones</p>
                      </div>
                      <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Productivity Tips</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Personalized improvement suggestions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Calendar */}
              <section id='calendar'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>Calendar</h2>

                <div className='space-y-6'>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Manage your schedule with integrated calendar functionality and task planning.
                  </p>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Calendar Features</h3>
                    <ul className='list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2'>
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
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>Settings & Profile</h2>

                <div className='space-y-6'>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Customize your experience with personal preferences and account settings.
                  </p>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Customization Options</h3>
                    <ul className='list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2'>
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
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>Support & Resources</h2>

                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg'>
                      <h3 className='text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3'>Need Help?</h3>
                      <p className='text-blue-700 dark:text-blue-300 mb-4'>
                        Visit our support page for assistance with any issues or questions.
                      </p>
                      <a href='/support' className='text-blue-600 dark:text-blue-400 hover:underline font-medium'>
                        Get Support →
                      </a>
                    </div>

                    <div className='bg-green-50 dark:bg-green-900/20 p-6 rounded-lg'>
                      <h3 className='text-xl font-semibold text-green-900 dark:text-green-100 mb-3'>Feature Requests</h3>
                      <p className='text-green-700 dark:text-green-300 mb-4'>
                        Have an idea for improvement? Share your feature requests with us.
                      </p>
                      <a href='/feature-request' className='text-green-600 dark:text-green-400 hover:underline font-medium'>
                        Request Feature →
                      </a>
                    </div>
                  </div>

                  <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>Additional Resources</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <a href='/community' className='text-blue-600 dark:text-blue-400 hover:underline'>Community Forum</a>
                      <a href='/changelog' className='text-blue-600 dark:text-blue-400 hover:underline'>What's New</a>
                      <a href='/bug-report' className='text-blue-600 dark:text-blue-400 hover:underline'>Report Bug</a>
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