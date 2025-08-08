import { useState } from 'react';

import { Check, X } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';

const RestOfTaskDetails = () => {
  const [editingField, setEditingField] = useState<any>(null);

  // Sample task data
  const [taskData, setTaskData] = useState({
    id: 1,
    title: 'Design System Implementation',
    description: 'Create a comprehensive design system for the new product launch including components, patterns, and documentation. This system will serve as the foundation for all future design and development work.',
    status: 'in-progress',
    priority: 'high',
    category: 'Design',
    dueDate: '2025-07-15',
    createdDate: '2025-06-01',
    completedAt: null,
    progress: 65,
    estimatedTime: '40h',
    timeSpent: '26h',
    assignees: [
      { id: 1, name: 'Alex Johnson', avatar: 'A', color: '#8B5CF6' },
      { id: 2, name: 'Sarah Chen', avatar: 'S', color: '#06B6D4' },
    ],
    tags: ['design-system', 'components', 'documentation', 'high-priority'],
    notes: `<div>
      <h3>Design System Progress Notes</h3>
      <p>Working on the component library implementation. Key achievements so far:</p>
      <ul>
        <li><strong>Completed:</strong> Color palette and typography scale</li>
        <li><strong>In Progress:</strong> Button and form components</li>
        <li><strong>Next:</strong> Navigation and layout components</li>
      </ul>
      <blockquote>
        <p>Remember to maintain consistency with the brand guidelines throughout the process.</p>
      </blockquote>
      <p>Next review scheduled for <strong>Friday at 2 PM</strong> with the design team.</p>
    </div>`,
    subtasks: [
      { id: 1, title: 'Define color palette and tokens', completed: true, dueDate: '2025-06-10', completedDate: '2025-06-08' },
      { id: 2, title: 'Create typography scale', completed: true, dueDate: '2025-06-15', completedDate: '2025-06-14' },
      { id: 3, title: 'Design button components', completed: true, dueDate: '2025-06-20', completedDate: '2025-06-19' },
      { id: 4, title: 'Build form components', completed: false, dueDate: '2025-06-30' },
      { id: 5, title: 'Create navigation patterns', completed: false, dueDate: '2025-07-05' },
      { id: 6, title: 'Document component usage', completed: false, dueDate: '2025-07-10' },
      { id: 7, title: 'Conduct team review', completed: false, dueDate: '2025-07-15' },
    ],
    checklist: [
      { id: 1, item: 'Set up design tokens in Figma', completed: true },
      { id: 2, item: 'Create component library structure', completed: true },
      { id: 3, item: 'Define naming conventions', completed: true },
      { id: 4, item: 'Establish design principles', completed: false },
      { id: 5, item: 'Create accessibility guidelines', completed: false },
      { id: 6, item: 'Set up version control', completed: false },
      { id: 7, item: 'Plan migration strategy', completed: false },
    ],
    attachments: [
      { id: 1, name: 'Design_System_Spec.pdf', size: '2.4 MB', type: 'PDF', uploadDate: '2025-06-20' },
      { id: 2, name: 'Component_Wireframes.fig', size: '1.8 MB', type: 'Figma', uploadDate: '2025-06-18' },
      { id: 3, name: 'Brand_Guidelines.pdf', size: '3.2 MB', type: 'PDF', uploadDate: '2025-06-15' },
    ],
    stickyNotes: [
      {
        id: 1,
        text: 'Remember to review the color accessibility guidelines before finalizing the palette.',
        bgColor: '#FFE066',
        textColor: '#000000',
        createdAt: '2025-06-15T14:30:00Z',
      },
      {
        id: 2,
        text: 'Check with Sarah about the iconography requirements for the mobile version.',
        bgColor: '#FF9AA2',
        textColor: '#000000',
        createdAt: '2025-06-18T09:15:00Z',
      },
      {
        id: 3,
        text: 'Schedule user testing session for next week - need 5 participants minimum.',
        bgColor: '#B5EAD7',
        textColor: '#000000',
        createdAt: '2025-06-20T16:45:00Z',
      },
    ],
    comments: [
      {
        id: 1,
        user: 'Sarah Chen',
        avatar: 'S',
        color: '#06B6D4',
        timestamp: '2025-06-20T14:30:00Z',
        content: 'Great progress on the color palette! The tokens are well-organized and follow our brand guidelines perfectly.',
        edited: false,
      },
      {
        id: 2,
        user: 'Alex Johnson',
        avatar: 'A',
        color: '#8B5CF6',
        timestamp: '2025-06-22T10:15:00Z',
        content: "Thanks Sarah! Next, I'll focus on the button components. Should we schedule a quick review session for the typography scale before moving forward?",
        edited: false,
      },
      {
        id: 3,
        user: 'Sarah Chen',
        avatar: 'S',
        color: '#06B6D4',
        timestamp: '2025-06-22T15:45:00Z',
        content: "Absolutely! How about Friday at 2 PM? I'll prepare some feedback on the current implementation.",
        edited: false,
      },
    ],
  });
  const [tempValues, setTempValues] = useState({} as Record<string, string>);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const statusOptions = ['pending', 'in-progress', 'completed', 'on-hold'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: any) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const startEditing = (field: any, currentValue: any) => {
    setEditingField(field);
    setTempValues((prev) => ({ ...prev, [field]: currentValue }));
  };

  const saveField = (field: any) => {
    setTaskData((prev) => ({ ...prev, [field]: tempValues?.[field as keyof object] }));
    setEditingField(null);
    setTempValues((prev) => ({ ...prev, [field]: undefined }));
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValues({});
  };

  return (
    <>
      {/* Sidebar */}
      <div className='lg:col-span-1 space-y-6'>
        {/* Task Info */}
        <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-semibold'>Task Information</h3>
          </div>
          <div className='p-6 space-y-4'>
            {/* Status - Editable */}
            <div className='flex justify-between items-center'>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</span>
              {editingField === 'status' ? (
                <div className='flex items-center space-x-2'>
                  <select
                    value={tempValues.status}
                    onChange={(e) => setTempValues((prev) => ({ ...prev, status: e.target.value }))}
                    className={`px-2 py-1 text-xs rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => saveField('status')} className='text-green-500 hover:text-green-600'>
                    <Check className='w-3 h-3' />
                  </button>
                  <button onClick={cancelEditing} className='text-red-500 hover:text-red-600'>
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('status', taskData.status)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(taskData.status)} hover:opacity-80 transition-opacity`}
                >
                  {taskData.status.replace('-', ' ')}
                </button>
              )}
            </div>

            {/* Priority - Editable */}
            <div className='flex justify-between items-center'>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Priority</span>
              {editingField === 'priority' ? (
                <div className='flex items-center space-x-2'>
                  <select
                    value={tempValues.priority}
                    onChange={(e) => setTempValues((prev) => ({ ...prev, priority: e.target.value }))}
                    className={`px-2 py-1 text-xs rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    {priorityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => saveField('priority')} className='text-green-500 hover:text-green-600'>
                    <Check className='w-3 h-3' />
                  </button>
                  <button onClick={cancelEditing} className='text-red-500 hover:text-red-600'>
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('priority', taskData.priority)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(taskData.priority)} hover:opacity-80 transition-opacity`}
                >
                  {taskData.priority}
                </button>
              )}
            </div>

            {/* Category - Editable */}
            <div className='flex justify-between items-center'>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category</span>
              {editingField === 'category' ? (
                <div className='flex items-center space-x-2'>
                  <input
                    type='text'
                    value={tempValues.category}
                    onChange={(e) => setTempValues((prev) => ({ ...prev, category: e.target.value }))}
                    className={`px-2 py-1 text-xs rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <button onClick={() => saveField('category')} className='text-green-500 hover:text-green-600'>
                    <Check className='w-3 h-3' />
                  </button>
                  <button onClick={cancelEditing} className='text-red-500 hover:text-red-600'>
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('category', taskData.category)}
                  className='text-sm font-medium hover:text-purple-500 transition-colors'
                >
                  {taskData.category}
                </button>
              )}
            </div>

            <div className='flex justify-between items-center'>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Created</span>
              <span className='text-sm font-medium'>{formatDate(taskData.createdDate)}</span>
            </div>

            {/* Due Date - Editable */}
            <div className='flex justify-between items-center'>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Due Date</span>
              {editingField === 'dueDate' ? (
                <div className='flex items-center space-x-2'>
                  <input
                    type='date'
                    value={tempValues.dueDate}
                    onChange={(e) => setTempValues((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className={`px-2 py-1 text-xs rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <button onClick={() => saveField('dueDate')} className='text-green-500 hover:text-green-600'>
                    <Check className='w-3 h-3' />
                  </button>
                  <button onClick={cancelEditing} className='text-red-500 hover:text-red-600'>
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('dueDate', taskData.dueDate)}
                  className='text-sm font-medium hover:text-purple-500 transition-colors'
                >
                  {formatDate(taskData.dueDate)}
                </button>
              )}
            </div>

            {/* Time Spent - Editable */}
            <div className='flex justify-between items-center'>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time Spent</span>
              {editingField === 'timeSpent' ? (
                <div className='flex items-center space-x-2'>
                  <input
                    type='text'
                    value={tempValues.timeSpent}
                    onChange={(e) => setTempValues((prev) => ({ ...prev, timeSpent: e.target.value }))}
                    className={`px-2 py-1 text-xs rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder='e.g., 25h'
                  />
                  <button onClick={() => saveField('timeSpent')} className='text-green-500 hover:text-green-600'>
                    <Check className='w-3 h-3' />
                  </button>
                  <button onClick={cancelEditing} className='text-red-500 hover:text-red-600'>
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('timeSpent', taskData.timeSpent)}
                  className='text-sm font-medium hover:text-purple-500 transition-colors'
                >
                  {taskData.timeSpent}
                </button>
              )}
            </div>

            {/* Estimated Time - Editable */}
            <div className='flex justify-between items-center'>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Estimated</span>
              {editingField === 'estimatedTime' ? (
                <div className='flex items-center space-x-2'>
                  <input
                    type='text'
                    value={tempValues.estimatedTime}
                    onChange={(e) => setTempValues((prev) => ({ ...prev, estimatedTime: e.target.value }))}
                    className={`px-2 py-1 text-xs rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder='e.g., 40h'
                  />
                  <button onClick={() => saveField('estimatedTime')} className='text-green-500 hover:text-green-600'>
                    <Check className='w-3 h-3' />
                  </button>
                  <button onClick={cancelEditing} className='text-red-500 hover:text-red-600'>
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('estimatedTime', taskData.estimatedTime)}
                  className='text-sm font-medium hover:text-purple-500 transition-colors'
                >
                  {taskData.estimatedTime}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default RestOfTaskDetails;