import { useProfileStore } from 'stores/profileStore';

const Integrations = () => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='flex items-center justify-between mb-6'>
        <h4 className='text-xl font-bold'>Integrations</h4>
        <button className='text-purple-500 hover:text-purple-600 text-sm font-medium'>Browse All</button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {[
          {
            name: 'Google Calendar',
            description: 'Sync tasks with your calendar',
            icon: '📅',
            connected: true,
            color: 'bg-blue-500',
          },
          {
            name: 'Slack',
            description: 'Get notifications in Slack',
            icon: '💬',
            connected: true,
            color: 'bg-purple-500',
          },
          {
            name: 'GitHub',
            description: 'Track code commits as tasks',
            icon: '⚡',
            connected: false,
            color: 'bg-gray-800',
          },
          {
            name: 'Notion',
            description: 'Export tasks to Notion pages',
            icon: '📝',
            connected: false,
            color: 'bg-black',
          },
          {
            name: 'Spotify',
            description: 'Focus music recommendations',
            icon: '🎵',
            connected: true,
            color: 'bg-green-500',
          },
          {
            name: 'Zapier',
            description: 'Connect with 5000+ apps',
            icon: '🔗',
            connected: false,
            color: 'bg-orange-500',
          },
        ].map((integration, index) => (
          <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <div className='flex items-center space-x-3 mb-3'>
              <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center text-white`}>
                {integration.icon}
              </div>
              <div className='flex-1'>
                <h6 className='font-medium'>{integration.name}</h6>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {integration.description}
                </p>
              </div>
            </div>
            <button
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${integration.connected
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-purple-500 text-white hover:bg-purple-600'}`}
            >
              {integration.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;