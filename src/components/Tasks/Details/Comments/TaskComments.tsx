import { useState } from 'react';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { MessageSquare, Pencil, Trash2, Send } from 'lucide-react';
import { toast } from 'react-toastify';

import { useTaskStore } from 'stores/taskStore';
import { useProfileStore } from 'stores/profileStore';
import { useSettingsStore } from 'stores/settingsStore';

import { addComment as addCommentApi, updateComment as updateCommentApi, deleteComment as deleteCommentApi } from 'services/tasks';

const AVATAR_COLORS = [
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#6366F1', '#14B8A6',
];

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name?.length; i++) {
    hash = name?.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS?.length];
};

const TaskComments = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const addCommentToStore = useTaskStore((state) => state.addComment);
  const updateCommentInStore = useTaskStore((state) => state.updateComment);
  const deleteCommentFromStore = useTaskStore((state) => state.deleteComment);
  const profile = useProfileStore((state) => state.data);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const currentUserName = profile.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : 'You';
  const currentUserInitial = currentUserName?.charAt(0)?.toUpperCase();
  const currentUserColor = getAvatarColor(currentUserName);

  const addComment = async () => {
    const content = newComment?.trim();
    if (!content || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addCommentApi(String(taskDetails.id), { content });
      const comment = res?.comment || {
        id: Date.now(),
        user: currentUserName,
        content,
        timestamp: new Date().toISOString(),
        edited: false,
        color: currentUserColor,
        avatar: currentUserInitial,
      };
      addCommentToStore(comment);
      setNewComment('');
      toast.success('Comment added');
    } catch (err: any) {
      toast.error(err?.error || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStart = (commentId: number, currentContent: string) => {
    setEditingId(commentId);
    setEditContent(currentContent);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleEditSave = async (commentId: number) => {
    const content = editContent.trim();
    if (!content || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateCommentApi(String(taskDetails.id), commentId, { content });
      updateCommentInStore(commentId, { content, edited: true });
      setEditingId(null);
      setEditContent('');
      toast.success('Comment updated');
    } catch (err: any) {
      toast.error(err?.error || 'Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteCommentApi(String(taskDetails.id), commentId);
      deleteCommentFromStore(commentId);
      toast.success('Comment deleted');
    } catch (err: any) {
      toast.error(err?.error || 'Failed to delete comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      addComment();
    }
  };

  return (
    <div
      className={clsx(
        'rounded-xl border transition-colors',
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      )}
    >
      <div className={clsx('p-6 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <h3 className='text-lg font-semibold flex items-center'>
          <MessageSquare className='w-5 h-5 mr-2' />
          {`Comments (${taskDetails?.comments?.length || 0})`}
        </h3>
      </div>
      <div className='p-6'>
        <div className='mb-6'>
          <div className='flex space-x-3'>
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0'
              style={{ backgroundColor: currentUserColor }}
            >
              {currentUserInitial}
            </div>
            <div className='flex-1'>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Add a comment... (Ctrl+Enter to submit)'
                rows={3}
                className={clsx(
                  'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none',
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300',
                )}
              />
              <div className='flex justify-end mt-2'>
                <button
                  onClick={addComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className='flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <Send className='w-4 h-4' />
                  {isSubmitting ? 'Posting...' : 'Add Comment'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          {!taskDetails?.comments?.length && (
            <p className={clsx('text-center py-8', darkMode ? 'text-gray-400' : 'text-gray-500')}>
              No comments yet. Be the first to comment!
            </p>
          )}
          {taskDetails?.comments?.map((comment) => (
            <div key={comment.id} className='flex space-x-3'>
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0'
                style={{ backgroundColor: comment.color || getAvatarColor(comment.user_name) }}
              >
                {comment?.avatar || comment?.user_name?.charAt(0)?.toUpperCase()}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center space-x-2 mb-2'>
                  <span className='font-medium'>{comment.user_name}</span>
                  <span className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                    {dayjs(comment.timestamp).format('MMM D, YYYY h:mm A')}
                  </span>
                  {comment.edited && (
                    <span className='text-xs text-gray-500'>(edited)</span>
                  )}
                </div>
                {editingId === comment.id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className={clsx(
                        'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none',
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300',
                      )}
                    />
                    <div className='flex items-center gap-2 mt-2'>
                      <button
                        onClick={() => handleEditSave(comment.id)}
                        disabled={!editContent.trim() || isSubmitting}
                        className='px-3 py-1 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50'
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className={clsx(
                          'px-3 py-1 text-sm rounded-lg transition-colors',
                          darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300',
                        )}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={clsx('p-3 rounded-lg', darkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                    <p className={clsx(darkMode ? 'text-gray-300' : 'text-gray-700')}>
                      {comment.content}
                    </p>
                  </div>
                )}
                {editingId !== comment.id && (
                  <div className='flex items-center space-x-4 mt-2'>
                    <button
                      onClick={() => handleEditStart(comment.id, comment.content)}
                      className={clsx(
                        'flex items-center gap-1 text-sm transition-colors',
                        darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900',
                      )}
                    >
                      <Pencil className='w-3 h-3' />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className={clsx(
                        'flex items-center gap-1 text-sm transition-colors',
                        darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600',
                      )}
                    >
                      <Trash2 className='w-3 h-3' />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskComments;
