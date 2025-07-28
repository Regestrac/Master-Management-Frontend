import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';

const TaskProgress = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);

  const taskProgress = 67;
  const estimatedTime = '125h';

  return (
    <div className='mt-4 2xl:mx-12'>
      <div className='flex items-center justify-between text-sm mb-2'>
        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Progress:
          {' '}
          {taskProgress}
          %
        </span>
        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {taskDetails.time_spend}
          {' '}
          of
          {estimatedTime}
        </span>
      </div>
      <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div
          className='h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500'
          style={{ width: `${taskProgress}%` }}
        />
      </div>
    </div>
  );
};

export default TaskProgress;