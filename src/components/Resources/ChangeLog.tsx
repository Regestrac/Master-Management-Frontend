import { useState, useEffect } from 'react';

import { Calendar, Tag, ChevronDown, ChevronRight, GitCommit, Zap, Bug, Plus, ArrowUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

type ChangeLogEntry = {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: {
    type: 'feature' | 'improvement' | 'bugfix' | 'breaking';
    title: string;
    description: string;
  }[];
};

const getVersionTypeColor = (type: string, darkMode: boolean) => {
  switch (type) {
    case 'major': return darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800';
    case 'minor': return darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800';
    case 'patch': return darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800';
    default: return darkMode ? 'bg-gray-900/20 text-gray-400' : 'bg-gray-100 text-gray-800';
  }
};

const getChangeIcon = (type: string) => {
  switch (type) {
    case 'feature': return <Plus className='h-4 w-4 text-green-500' />;
    case 'improvement': return <ArrowUp className='h-4 w-4 text-blue-500' />;
    case 'bugfix': return <Bug className='h-4 w-4 text-orange-500' />;
    case 'breaking': return <Zap className='h-4 w-4 text-red-500' />;
    default: return <GitCommit className='h-4 w-4 text-gray-500' />;
  }
};

const getChangeTypeClass = (type: string, darkMode: boolean) => {
  switch (type) {
    case 'feature': return darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800';
    case 'improvement': return darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800';
    case 'bugfix': return darkMode ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-100 text-orange-800';
    case 'breaking': return darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ChangeLog = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const navigate = useNavigate();
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set(['2.1.0']));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const toggleVersion = (version: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const changeLogData: ChangeLogEntry[] = [
    {
      version: '2.1.0',
      date: '2024-10-08',
      type: 'minor',
      changes: [
        {
          type: 'feature',
          title: 'Enhanced Analytics Dashboard',
          description: 'Added comprehensive productivity metrics and goal tracking visualizations with interactive charts.',
        },
        {
          type: 'feature',
          title: 'Community Forum Integration',
          description: 'Introduced community features for user collaboration and knowledge sharing.',
        },
        {
          type: 'improvement',
          title: 'Performance Optimizations',
          description: 'Improved app loading times by 40% through code splitting and lazy loading.',
        },
        {
          type: 'bugfix',
          title: 'Calendar Sync Issues',
          description: 'Fixed synchronization problems with external calendar providers.',
        },
      ],
    },
    {
      version: '2.0.1',
      date: '2024-09-25',
      type: 'patch',
      changes: [
        {
          type: 'bugfix',
          title: 'Task Completion Notifications',
          description: 'Resolved issue where completion notifications were not being sent consistently.',
        },
        {
          type: 'bugfix',
          title: 'Dark Mode Theme Fixes',
          description: 'Fixed contrast issues in dark mode for better accessibility.',
        },
        {
          type: 'improvement',
          title: 'Mobile Responsiveness',
          description: 'Enhanced mobile experience with better touch interactions and layout adjustments.',
        },
      ],
    },
    {
      version: '2.0.0',
      date: '2024-09-15',
      type: 'major',
      changes: [
        {
          type: 'breaking',
          title: 'New Authentication System',
          description: 'Migrated to OAuth 2.0 authentication. Users will need to re-authenticate on first login.',
        },
        {
          type: 'feature',
          title: 'Workspace Collaboration',
          description: 'Added multi-user workspace support with role-based permissions and real-time collaboration.',
        },
        {
          type: 'feature',
          title: 'Advanced Goal Management',
          description: 'Introduced hierarchical goals, dependencies, and automated progress tracking.',
        },
        {
          type: 'feature',
          title: 'Focus Sessions 2.0',
          description: 'Redesigned focus sessions with customizable timers, ambient sounds, and productivity insights.',
        },
        {
          type: 'improvement',
          title: 'Redesigned User Interface',
          description: 'Complete UI overhaul with modern design principles and improved user experience.',
        },
      ],
    },
    {
      version: '1.5.2',
      date: '2024-08-30',
      type: 'patch',
      changes: [
        {
          type: 'bugfix',
          title: 'Data Export Issues',
          description: 'Fixed problems with CSV and PDF export functionality for reports.',
        },
        {
          type: 'improvement',
          title: 'Search Performance',
          description: 'Optimized search algorithms for faster results across tasks and goals.',
        },
      ],
    },
    {
      version: '1.5.1',
      date: '2024-08-15',
      type: 'patch',
      changes: [
        {
          type: 'bugfix',
          title: 'Notification Settings',
          description: 'Resolved issue where notification preferences were not being saved correctly.',
        },
        {
          type: 'bugfix',
          title: 'Time Zone Handling',
          description: 'Fixed time zone conversion issues in calendar and scheduling features.',
        },
      ],
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm fixed top-0 left-0 right-0 z-50`}>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={handleBack}
                className={`flex items-center space-x-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                aria-label='Go back'
              >
                <ArrowLeft className='w-5 h-5' />
                <span>Back</span>
              </button>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                <GitCommit className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold'>Change Log</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Master Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className='max-w-4xl mx-auto px-6 pt-24 pb-8'>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-8 border shadow-sm`}>
          <div className='mb-6'>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
              Track all updates, improvements, and fixes to Master Management. Stay informed about new features and changes.
            </p>
          </div>

          <div className='space-y-4'>
            {changeLogData.map((entry) => (
              <div
                key={entry.version}
                className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg border`}
              >
                <button
                  onClick={() => toggleVersion(entry.version)}
                  className={`w-full p-4 text-left hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors rounded-lg`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {expandedVersions.has(entry.version) ? (
                        <ChevronDown className='h-5 w-5 text-gray-500' />
                      ) : (
                        <ChevronRight className='h-5 w-5 text-gray-500' />
                      )}
                      <div className='flex items-center gap-3'>
                        <span className='text-lg font-semibold'>
                          v
                          {entry.version}
                        </span>
                        <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getVersionTypeColor(entry.type, darkMode))}>
                          {entry.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                      <Calendar className='h-4 w-4' />
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </button>

                {expandedVersions.has(entry.version) && (
                  <div className='px-4 pb-4'>
                    <div className='ml-8 space-y-3'>
                      {entry.changes.map((change, index) => (
                        <div key={index} className='flex gap-3'>
                          <div className='flex-shrink-0 mt-0.5'>
                            {getChangeIcon(change.type)}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <h4 className='font-medium text-sm'>{change.title}</h4>
                              <span
                                className={clsx('px-2 py-0.5 rounded text-xs font-medium', getChangeTypeClass(change.type, darkMode))}
                              >
                                {change.type}
                              </span>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {change.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-blue-50 border-blue-200'} border`}>
            <div className='flex items-start gap-3'>
              <Tag className='h-5 w-5 text-blue-500 mt-0.5' />
              <div>
                <h3 className='font-medium text-sm mb-1'>Stay Updated</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Follow our development progress and get notified about new releases.
                  Check back regularly for the latest updates and improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangeLog;