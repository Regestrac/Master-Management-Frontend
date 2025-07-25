import { useState } from 'react';

import dayjs from 'dayjs';
import { MessageSquare } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';

const TaskComments = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);

  const [newComment, setNewComment] = useState('');

  const addComment = () => {
    if (newComment.trim()) {
      // const comment = {
      //   id: Date.now(),
      //   user: 'Alex Johnson', // Current user
      //   avatar: 'A',
      //   color: '#8B5CF6',
      //   timestamp: new Date().toISOString(),
      //   content: newComment.trim(),
      //   edited: false,
      // };
      // setTaskData((prev) => ({
      //   ...prev,
      //   comments: [...prev.comments, comment],
      // }));
      setNewComment('');
    }
  };

  return (

    <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-semibold flex items-center'>
          <MessageSquare className='w-5 h-5 mr-2' />
          Comments (
          {taskDetails?.comments?.length || 0}
          )
        </h3>
      </div>
      <div className='p-6'>
        {/* Add new comment */}
        <div className='mb-6'>
          <div className='flex space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium'>
              A
            </div>
            <div className='flex-1'>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='Add a comment...'
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'}`}
              />
              <div className='flex justify-end mt-2'>
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments list */}
        <div className='space-y-4'>
          {taskDetails?.comments?.map((comment) => (
            <div key={comment.id} className='flex space-x-3'>
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0'
                style={{ backgroundColor: comment.color }}
              >
                {comment.avatar}
              </div>
              <div className='flex-1'>
                <div className='flex items-center space-x-2 mb-2'>
                  <span className='font-medium'>{comment.user}</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {dayjs(comment.timestamp).format('MMM D, YYYY h:mm A')}
                  </span>
                  {comment.edited && (
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      (edited)
                    </span>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {comment.content}
                  </p>
                </div>
                <div className='flex items-center space-x-4 mt-2'>
                  <button className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    Reply
                  </button>
                  <button className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskComments;