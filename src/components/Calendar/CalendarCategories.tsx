import clsx from 'clsx';
import { Plus } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';

const CalendarCategories = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={clsx(
      'rounded-xl p-6 border shadow-sm',
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    )}
    >
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
                onChange={() => { }}
                className='w-4 h-4 text-primary-600 rounded focus:ring-primary-500'
              />
              <div className='w-3 h-3 rounded-full' style={{ backgroundColor: category.color }} />
              <span className='text-sm font-medium'>{category.name}</span>
            </div>
            <span className={clsx(
              'text-xs px-2 py-1 rounded-full',
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600',
            )}
            >
              {category.count}
            </span>
          </div>
        ))}
      </div>

      <button className='w-full mt-4 flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors'>
        <Plus className='w-4 h-4' />
        <span className='text-sm'>Add Category</span>
      </button>
    </div>
  );
};

export default CalendarCategories;