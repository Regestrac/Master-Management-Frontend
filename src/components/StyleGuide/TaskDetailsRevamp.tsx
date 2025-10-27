import { useState } from 'react';

import { Calendar, Tag, Clock, FileText, Activity, MessageSquare, Plus, Edit2, Trash2, MoreVertical, Target, Flag, Users, Paperclip, StickyNote, X, Send } from 'lucide-react';

export default function TaskDetailsRevamp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [type, setType] = useState('goal'); // 'task' or 'goal'
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelType, setSidePanelType] = useState(null); // 'notes' or 'comments'
  const [commentText, setCommentText] = useState('');
  const [noteText, setNoteText] = useState('');

  // Sample data
  const item = {
    title: 'Read 12 Books This Year',
    type: 'goal',
    status: 'TODO',
    priority: 'High',
    streak: 0,
    progress: 5.00,
    dueDate: 'Set due date',
    category: 'Add category',
    description: 'Enter task description...',
    target: {
      current: 1,
      total: 12,
      unit: 'books',
    },
    subtasks: [
      { id: 1, title: 'Define color palette and tokens', completed: true },
      { id: 2, title: 'Added detailed specification and requirements', completed: false },
      { id: 3, title: 'Setup project structure', completed: false },
    ],
    checklist: [
      { id: 1, text: 'Research best practices', checked: true },
      { id: 2, text: 'Create wireframes', checked: false },
    ],
    tags: ['Personal', 'Reading', 'Self-improvement'],
    activities: [
      { type: 'created', user: 'Alex Johnson', description: 'Initial task creation with basic requirements', time: 'Jun 01, 02:30 PM' },
      { type: 'updated', user: 'Alex Johnson', description: 'Added detailed specification and requirements', time: 'Jun 01, 04:00 PM' },
      { type: 'assignee', user: 'Alex Johnson', description: 'Added Sarah Chen as collaborator', time: 'Jun 02, 07:50 PM' },
      { type: 'completed', user: 'Sarah Chen', description: 'Completed "Define color palette and tokens"', time: 'Jun 08, 10:15 PM' },
    ],
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  const toggleSidePanel = (type: any) => {
    if (sidePanelType === type && sidePanelOpen) {
      setSidePanelOpen(false);
      setSidePanelType(null);
    } else {
      setSidePanelType(type);
      setSidePanelOpen(true);
    }
  };

  const statusColors: Record<string, string> = {
    TODO: 'bg-blue-500',
    'IN PROGRESS': 'bg-yellow-500',
    COMPLETED: 'bg-green-500',
    BLOCKED: 'bg-red-500',
  };

  const priorityColors: Record<string, string> = {
    High: 'text-red-400',
    Medium: 'text-yellow-400',
    Low: 'text-green-400',
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 relative'>
      {/* Header Section */}
      <div className='bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-6 py-6'>
          {/* Top Bar */}
          <div className='flex items-start justify-between mb-6'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-3'>
                <button className='p-2 hover:bg-slate-700/50 rounded-lg transition-colors'>
                  ←
                </button>
                <div className='flex items-center gap-2'>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status]}`}>
                    {item.status}
                  </span>
                  {item.priority && (
                    <div className='flex items-center gap-1 px-3 py-1 bg-slate-700/50 rounded-full'>
                      <Flag className={`w-3 h-3 ${priorityColors[item.priority]}`} />
                      <span className='text-xs font-medium'>
                        {item.priority}
                        {' '}
                        Priority
                      </span>
                    </div>
                  )}
                  {item.type === 'goal' && (
                    <div className='flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full'>
                      <Target className='w-3 h-3 text-blue-400' />
                      <span className='text-xs font-medium text-blue-400'>Goal</span>
                    </div>
                  )}
                </div>
              </div>

              <h1 className='text-3xl font-bold text-white mb-2'>{item.title}</h1>

              {/* Goal Progress */}
              {item.type === 'goal' && item.target && (
                <div className='mt-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm text-gray-400'>Progress</span>
                    <span className='text-lg font-bold text-blue-400'>
                      {item.progress}
                      %
                    </span>
                  </div>
                  <div className='w-full h-2 bg-slate-600/50 rounded-full overflow-hidden mb-2'>
                    <div
                      className='h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500'
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-400'>
                      {item.target.current}
                      {' '}
                      of
                      {item.target.total}
                      {' '}
                      {item.target.unit}
                    </span>
                    <div className='flex items-center gap-1 text-orange-400'>
                      <span className='text-xl'>🔥</span>
                      <span className='font-semibold'>
                        {item.streak}
                        {' '}
                        day streak
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2 ml-6'>
              <button className='p-2 hover:bg-slate-700/50 rounded-lg transition-colors'>
                <Edit2 className='w-5 h-5 text-gray-400' />
              </button>
              <button className='p-2 hover:bg-slate-700/50 rounded-lg transition-colors'>
                <Trash2 className='w-5 h-5 text-gray-400' />
              </button>
              <button className='p-2 hover:bg-slate-700/50 rounded-lg transition-colors'>
                <MoreVertical className='w-5 h-5 text-gray-400' />
              </button>
              <button className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2'>
                <Clock className='w-4 h-4' />
                Start Timer
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className='flex items-center gap-6 text-sm'>
            <div className='flex items-center gap-2 text-gray-400'>
              <Calendar className='w-4 h-4' />
              <span>{item.dueDate}</span>
            </div>
            <div className='flex items-center gap-2 text-gray-400'>
              <Tag className='w-4 h-4' />
              <span>{item.category}</span>
            </div>
            <div className='flex items-center gap-2 text-gray-400'>
              <Users className='w-4 h-4' />
              <span>No assignees</span>
            </div>
            <div className='flex items-center gap-2 text-gray-400'>
              <Paperclip className='w-4 h-4' />
              <span>0 attachments</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className='flex items-center justify-between mt-6 border-b border-slate-700/50'>
            <div className='flex gap-1'>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${activeTab === tab.id
                      ? 'text-blue-400'
                      : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    <Icon className='w-4 h-4' />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400' />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Access Buttons */}
            <div className='flex gap-2 pb-3'>
              <button
                onClick={() => toggleSidePanel('notes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${sidePanelType === 'notes' && sidePanelOpen
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-gray-300'}`}
              >
                <StickyNote className='w-4 h-4' />
                Notes
                <span className='px-2 py-0.5 bg-slate-600/50 rounded text-xs'>3</span>
              </button>
              <button
                onClick={() => toggleSidePanel('comments')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${sidePanelType === 'comments' && sidePanelOpen
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-gray-300'}`}
              >
                <MessageSquare className='w-4 h-4' />
                Comments
                <span className='px-2 py-0.5 bg-blue-500/30 text-blue-400 rounded text-xs font-semibold'>2</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className='max-w-7xl mx-auto px-6 py-8' style={{ marginRight: sidePanelOpen ? '420px' : '0', transition: 'margin-right 0.3s ease' }}>
        {activeTab === 'overview' && (
          <div className='grid grid-cols-3 gap-6'>
            {/* Main Content */}
            <div className='col-span-2 space-y-6'>
              {/* Description */}
              <div className='bg-slate-800/50 rounded-xl border border-slate-700/50 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-white'>Description</h2>
                  <button className='text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1'>
                    <Edit2 className='w-4 h-4' />
                    Edit
                  </button>
                </div>
                <p className='text-gray-400 leading-relaxed'>{item.description}</p>
              </div>

              {/* Subtasks */}
              <div className='bg-slate-800/50 rounded-xl border border-slate-700/50 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <h2 className='text-lg font-semibold text-white'>Subtasks</h2>
                    <span className='px-2 py-1 bg-slate-700/50 rounded text-xs font-medium text-gray-400'>
                      {item.subtasks.filter((s) => s.completed).length}
                      /
                      {item.subtasks.length}
                    </span>
                  </div>
                  <button className='text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1'>
                    <Plus className='w-4 h-4' />
                    Add Subtask
                  </button>
                </div>
                <div className='space-y-2'>
                  {item.subtasks.map((subtask) => (
                    <div key={subtask.id} className='flex items-center gap-3 p-3 hover:bg-slate-700/30 rounded-lg transition-colors group'>
                      <input
                        type='checkbox'
                        checked={subtask.completed}
                        className='w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800'
                      />
                      <span className={`flex-1 ${subtask.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                        {subtask.title}
                      </span>
                      <button className='opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600/50 rounded transition-all'>
                        <MoreVertical className='w-4 h-4 text-gray-400' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div className='bg-slate-800/50 rounded-xl border border-slate-700/50 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <h2 className='text-lg font-semibold text-white'>Checklist</h2>
                    <span className='px-2 py-1 bg-slate-700/50 rounded text-xs font-medium text-gray-400'>
                      {item.checklist.filter((c) => c.checked).length}
                      /
                      {item.checklist.length}
                    </span>
                  </div>
                  <button className='text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1'>
                    <Plus className='w-4 h-4' />
                    Add Item
                  </button>
                </div>
                <div className='space-y-2'>
                  {item.checklist.map((checkItem) => (
                    <div key={checkItem.id} className='flex items-center gap-3 p-3 hover:bg-slate-700/30 rounded-lg transition-colors group'>
                      <input
                        type='checkbox'
                        checked={checkItem.checked}
                        className='w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800'
                      />
                      <span className={`flex-1 ${checkItem.checked ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                        {checkItem.text}
                      </span>
                      <button className='opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600/50 rounded transition-all'>
                        <MoreVertical className='w-4 h-4 text-gray-400' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className='space-y-6'>
              {/* Tags */}
              <div className='bg-slate-800/50 rounded-xl border border-slate-700/50 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>Tags</h3>
                  <button className='text-blue-400 hover:text-blue-300'>
                    <Plus className='w-4 h-4' />
                  </button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {item.tags.map((tag, index) => (
                    <span key={index} className='px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className='bg-slate-800/50 rounded-xl border border-slate-700/50 p-6'>
                <h3 className='text-sm font-semibold text-white uppercase tracking-wider mb-4'>Statistics</h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-400 text-sm'>Time Tracked</span>
                    <span className='text-white font-semibold'>0h 0m</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-400 text-sm'>Created</span>
                    <span className='text-white font-semibold'>Jul 21, 2025</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-400 text-sm'>Last Updated</span>
                    <span className='text-white font-semibold'>2 days ago</span>
                  </div>
                </div>
              </div>

              {/* Type Toggle Demo */}
              <div className='bg-slate-800/50 rounded-xl border border-slate-700/50 p-6'>
                <h3 className='text-sm font-semibold text-white uppercase tracking-wider mb-4'>Demo Controls</h3>
                <div className='space-y-2'>
                  <button
                    onClick={() => setType('task')}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${type === 'task'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'}`}
                  >
                    View as Task
                  </button>
                  <button
                    onClick={() => setType('goal')}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${type === 'goal'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'}`}
                  >
                    View as Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className='bg-slate-800/50 rounded-xl border border-slate-700/50 p-6'>
            <h2 className='text-lg font-semibold text-white mb-6'>Activity Log</h2>
            <div className='space-y-4'>
              {item.activities.map((activity, index) => (
                <div key={index} className='flex gap-4 p-4 hover:bg-slate-700/30 rounded-lg transition-colors'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0'>
                    {activity.user.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold text-white'>{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span>
                      <span className='text-gray-500'>
                        by
                        {activity.user}
                      </span>
                    </div>
                    <p className='text-gray-400 text-sm mb-1'>{activity.description}</p>
                    <span className='text-gray-500 text-xs'>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-slate-800 border-l border-slate-700/50 shadow-2xl transition-transform duration-300 ease-in-out z-50 ${sidePanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '420px' }}
      >
        {sidePanelType === 'notes' && (
          <div className='h-full flex flex-col'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-slate-700/50'>
              <div className='flex items-center gap-3'>
                <StickyNote className='w-5 h-5 text-blue-400' />
                <h2 className='text-lg font-semibold text-white'>Notes</h2>
                <span className='px-2 py-1 bg-slate-700/50 rounded text-xs text-gray-400'>3 notes</span>
              </div>
              <button
                onClick={() => setSidePanelOpen(false)}
                className='p-2 hover:bg-slate-700/50 rounded-lg transition-colors'
              >
                <X className='w-5 h-5 text-gray-400' />
              </button>
            </div>

            {/* Notes Content */}
            <div className='flex-1 overflow-y-auto p-6 space-y-4'>
              {/* Sample Notes */}
              <div className='bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 hover:shadow-lg transition-shadow'>
                <div className='flex items-start justify-between mb-2'>
                  <span className='text-xs text-gray-400'>2 hours ago</span>
                  <button className='p-1 hover:bg-slate-700/50 rounded'>
                    <MoreVertical className='w-4 h-4 text-gray-400' />
                  </button>
                </div>
                <p className='text-sm text-gray-300 leading-relaxed'>
                  Remember to break down the reading into weekly chunks - roughly 1 book per month
                </p>
              </div>

              <div className='bg-blue-400/10 border border-blue-400/20 rounded-lg p-4 hover:shadow-lg transition-shadow'>
                <div className='flex items-start justify-between mb-2'>
                  <span className='text-xs text-gray-400'>Yesterday</span>
                  <button className='p-1 hover:bg-slate-700/50 rounded'>
                    <MoreVertical className='w-4 h-4 text-gray-400' />
                  </button>
                </div>
                <p className='text-sm text-gray-300 leading-relaxed'>
                  Focus on non-fiction and self-improvement books this quarter
                </p>
              </div>

              <div className='bg-green-400/10 border border-green-400/20 rounded-lg p-4 hover:shadow-lg transition-shadow'>
                <div className='flex items-start justify-between mb-2'>
                  <span className='text-xs text-gray-400'>3 days ago</span>
                  <button className='p-1 hover:bg-slate-700/50 rounded'>
                    <MoreVertical className='w-4 h-4 text-gray-400' />
                  </button>
                </div>
                <p className='text-sm text-gray-300 leading-relaxed'>
                  Consider joining a book club for accountability
                </p>
              </div>
            </div>

            {/* Add Note Input */}
            <div className='p-6 border-t border-slate-700/50'>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder='Add a quick note...'
                className='w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-3'
                rows={3}
              />
              <button className='w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2'>
                <Plus className='w-4 h-4' />
                Add Note
              </button>
            </div>
          </div>
        )}

        {sidePanelType === 'comments' && (
          <div className='h-full flex flex-col'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-slate-700/50'>
              <div className='flex items-center gap-3'>
                <MessageSquare className='w-5 h-5 text-blue-400' />
                <h2 className='text-lg font-semibold text-white'>Comments</h2>
                <span className='px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400 font-semibold'>2 new</span>
              </div>
              <button
                onClick={() => setSidePanelOpen(false)}
                className='p-2 hover:bg-slate-700/50 rounded-lg transition-colors'
              >
                <X className='w-5 h-5 text-gray-400' />
              </button>
            </div>

            {/* Comments Content */}
            <div className='flex-1 overflow-y-auto p-6 space-y-6'>
              {/* Sample Comments */}
              <div className='flex gap-3'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0'>
                  SC
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='font-semibold text-white text-sm'>Sarah Chen</span>
                    <span className='text-gray-500 text-xs'>2 hours ago</span>
                  </div>
                  <p className='text-gray-300 text-sm leading-relaxed mb-2'>
                    Great goal! Have you thought about tracking which genres you want to focus on?
                  </p>
                  <button className='text-blue-400 hover:text-blue-300 text-xs font-medium'>
                    Reply
                  </button>
                </div>
              </div>

              <div className='flex gap-3'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0'>
                  AJ
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='font-semibold text-white text-sm'>Alex Johnson</span>
                    <span className='text-gray-500 text-xs'>Yesterday</span>
                  </div>
                  <p className='text-gray-300 text-sm leading-relaxed mb-2'>
                    I'm doing something similar! Let's share book recommendations 📚
                  </p>
                  <button className='text-blue-400 hover:text-blue-300 text-xs font-medium'>
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {/* Add Comment Input */}
            <div className='p-6 border-t border-slate-700/50'>
              <div className='flex gap-3'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0'>
                  U
                </div>
                <div className='flex-1'>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder='Write a comment...'
                    className='w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-3'
                    rows={3}
                  />
                  <button className='w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2'>
                    <Send className='w-4 h-4' />
                    Send Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay when panel is open */}
      {sidePanelOpen && (
        <div
          className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300'
          onClick={() => setSidePanelOpen(false)}
        />
      )}

      {/* Floating Action Buttons (Mobile/Quick Access) */}
      {!sidePanelOpen && (
        <div className='fixed right-6 bottom-6 flex flex-col gap-3 z-30'>
          <button
            onClick={() => toggleSidePanel('notes')}
            className='w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group relative'
          >
            <StickyNote className='w-6 h-6' />
            <span className='absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
              Quick Notes
            </span>
            <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center'>
              3
            </span>
          </button>
          <button
            onClick={() => toggleSidePanel('comments')}
            className='w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group relative'
          >
            <MessageSquare className='w-6 h-6' />
            <span className='absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
              Comments
            </span>
            <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse'>
              2
            </span>
          </button>
        </div>
      )}
    </div>
  );
}