import { useProfileStore } from 'stores/profileStore';

const FocusSessions = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='mb-6'>
        <h4 className='text-xl font-bold mb-1'>Focus Sessions</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deep work analysis</p>
      </div>

      <div className='space-y-4'>
        <div className='text-center'>
          <div className='text-3xl font-bold text-primary-500 mb-1'>4.2h</div>
          <div className='text-sm text-gray-500'>Average session today</div>
        </div>

        <div className='grid grid-cols-2 gap-4 text-center'>
          <div>
            <div className='text-xl font-bold'>8</div>
            <div className='text-xs text-gray-500'>Sessions</div>
          </div>
          <div>
            <div className='text-xl font-bold'>89%</div>
            <div className='text-xs text-gray-500'>Efficiency</div>
          </div>
        </div>

        <div className='space-y-2'>
          <h6 className='font-medium text-sm'>Session Breakdown</h6>
          {[
            { duration: '2.5h', task: 'Design System', efficiency: 95 },
            { duration: '1.8h', task: 'Code Review', efficiency: 87 },
            { duration: '1.2h', task: 'Documentation', efficiency: 82 },
            { duration: '0.9h', task: 'Planning', efficiency: 78 },
          ].map((session, index) => (
            <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
              <div className='flex items-center justify-between mb-1'>
                <span className='text-sm font-medium'>{session.task}</span>
                <span className='text-sm text-primary-500'>{session.duration}</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className={`flex-1 h-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                  <div
                    className='h-1 bg-primary-500 rounded-full'
                    style={{ width: `${session.efficiency}%` }}
                  />
                </div>
                <span className='text-xs text-gray-500'>
                  {session.efficiency}
                  %
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocusSessions;