import { useSettingsStore } from 'stores/settingsStore';

const AboutSection = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6 flex items-center'>
        <span className='text-2xl mr-3'>ℹ️</span>
        About Master Management
      </h4>

      <div className='space-y-6'>
        {/* App Info */}
        <div className='text-center'>
          <div className='w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4'>
            TF
          </div>
          <h5 className='text-2xl font-bold mb-2'>Master Management</h5>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            The ultimate productivity suite for modern professionals
          </p>
          <div className='flex items-center justify-center space-x-4 text-sm'>
            <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              Version 2.1.4
            </span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className='mb-8'>
          <h6 className='font-semibold mb-4'>What's New in v2.1.4</h6>
          <div className='space-y-3'>
            {[
              '🎨 Enhanced dark mode with better contrast',
              '⚡ Improved performance and faster load times',
              '🔔 Smarter notification system',
              '📊 Advanced analytics dashboard',
              '🔗 Better integration support',
              '🐛 Various bug fixes and improvements',
            ].map((feature, index) => (
              <div key={index} className='flex items-center space-x-3'>
                <span className='text-lg'>{feature.split(' ')[0]}</span>
                <span className='text-sm'>{feature.slice(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h6 className='font-semibold mb-4'>Resources & Support</h6>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              { title: 'Documentation', icon: '📚', link: '#' },
              { title: 'Changelog', icon: '📝', link: '#' },
              { title: 'Support', icon: '💬', link: '#' },
              { title: 'Community', icon: '👥', link: '#' },
              { title: 'Feature Requests', icon: '💡', link: '#' },
              { title: 'Bug Reports', icon: '🐛', link: '#' },
              { title: 'Privacy Policy', icon: '🔒', link: '#' },
              { title: 'Terms of Service', icon: '📄', link: '#' },
            ].map((resource, index) => (
              <button key={index} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors text-left`}>
                <div className='text-2xl mb-2'>{resource.icon}</div>
                <div className='text-sm font-medium'>{resource.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Credits */}
        <div className='text-center pt-6 border-t border-gray-200 dark:border-gray-700'>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            Made with ❤️ by the Master Management Team
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            © 2025 Master Management. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;