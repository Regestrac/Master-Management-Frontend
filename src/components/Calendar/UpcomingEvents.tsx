import { useProfileStore } from 'stores/profileStore';

const UpcomingEvents = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='flex items-center justify-between mb-4'>
        <h4 className='font-semibold'>Upcoming</h4>
        <button className='text-primary-500 hover:text-primary-600 text-sm font-medium'>View All</button>
      </div>
      <div className='space-y-3'>
        {[
          {
            title: 'Design Review',
            time: '2:00 PM',
            type: 'meeting',
            color: '#10B981',
            date: 'Today',
          },
          {
            title: 'Portfolio Deadline',
            time: '11:59 PM',
            type: 'deadline',
            color: '#F59E0B',
            date: 'Tomorrow',
          },
          {
            title: 'React Advanced Course',
            time: '9:00 AM',
            type: 'goal',
            color: '#06B6D4',
            date: 'Jun 29',
          },
          {
            title: 'Team Standup',
            time: '10:00 AM',
            type: 'meeting',
            color: '#10B981',
            date: 'Jun 30',
          },
        ].map((event, index) => (
          <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <div className='flex items-center space-x-3'>
              <div className='w-3 h-3 rounded-full' style={{ backgroundColor: event.color }} />
              <div className='flex-1'>
                <h6 className='font-medium text-sm'>{event.title}</h6>
                <div className='flex items-center space-x-2 text-xs text-gray-500'>
                  <span>{event.date}</span>
                  <span>•</span>
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;