import { Edit3 } from 'lucide-react';
import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

import StickyNotesCanvas from 'components/Tasks/Details/Notes/StickyNotesCanvas';

const TaskNotes = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div
      className={clsx(
        'rounded-xl border transition-colors',
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      )}
    >
      <div className={clsx('p-6 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold flex items-center'>
            <Edit3 className='w-5 h-5 mr-2' />
            Sticky Notes
          </h3>
        </div>
      </div>
      <div className='p-6 h-[70vh] w-full'>
        <StickyNotesCanvas />
      </div>
    </div>
  );
};

export default TaskNotes;