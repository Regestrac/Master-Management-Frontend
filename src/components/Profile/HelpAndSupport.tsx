import { Link } from 'react-router-dom';

import { useSettingsStore } from 'stores/settingsStore';

const helpAndSupportItems = [
  {
    title: 'Help Center',
    description: 'Browse articles and guides',
    icon: '📚',
    action: 'Browse',
    path: '/documentation',
  },
  {
    title: 'Contact Support',
    description: 'Get help from our team',
    icon: '💬',
    action: 'Contact',
    path: '/support',
  },
  {
    title: 'Feature Requests',
    description: 'Suggest new features',
    icon: '💡',
    action: 'Suggest',
    path: '/feature-request',
  },
  {
    title: 'Community Forum',
    description: 'Connect with other users',
    icon: '👥',
    action: 'Join',
    path: '/community',
  },
];

const HelpAndSupport = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6'>Help & Support</h4>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {helpAndSupportItems.map((support, index) => (
          <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} hover:shadow-md transition-all cursor-pointer`}>
            <div className='text-center'>
              <div className='text-3xl mb-2'>{support.icon}</div>
              <h6 className='font-medium mb-1'>{support.title}</h6>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                {support.description}
              </p>
              <Link to={support.path} className='text-primary-500 hover:text-primary-600 text-sm font-medium'>
                {support.action}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <div>
            <h6 className='font-medium'>App Version</h6>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Master Management v2.1.4 (Latest)
            </p>
          </div>
          <button className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm'>
            Check Updates
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default HelpAndSupport;