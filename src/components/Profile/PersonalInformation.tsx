import { useProfileStore } from 'stores/profileStore';

const PersonalInformation = () => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='flex items-center justify-between mb-6'>
        <h4 className='text-xl font-bold'>Personal Information</h4>
        <button className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm'>
          Edit Profile
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>Full Name</label>
          <input
            type='text'
            defaultValue='Alex Johnson'
            readOnly
            className={`w-full px-4 py-3 rounded-lg border ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-gray-50 border-gray-300 text-gray-900'} cursor-not-allowed`}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Email Address</label>
          <input
            type='email'
            defaultValue='alex.johnson@example.com'
            readOnly
            className={`w-full px-4 py-3 rounded-lg border ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-gray-50 border-gray-300 text-gray-900'} cursor-not-allowed`}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Job Title</label>
          <input
            type='text'
            defaultValue='Senior Frontend Developer'
            readOnly
            className={`w-full px-4 py-3 rounded-lg border ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-gray-50 border-gray-300 text-gray-900'} cursor-not-allowed`}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Company</label>
          <input
            type='text'
            defaultValue='TechCorp Solutions'
            readOnly
            className={`w-full px-4 py-3 rounded-lg border ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-gray-50 border-gray-300 text-gray-900'} cursor-not-allowed`}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Time Zone</label>
          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value='PST'>Pacific Standard Time (PST)</option>
            <option value='EST'>Eastern Standard Time (EST)</option>
            <option value='GMT'>Greenwich Mean Time (GMT)</option>
            <option value='CET'>Central European Time (CET)</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Language</label>
          <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value='en'>English</option>
            <option value='es'>Español</option>
            <option value='fr'>Français</option>
            <option value='de'>Deutsch</option>
            <option value='zh'>中文</option>
          </select>
        </div>
      </div>

      <div className='mt-6'>
        <label className='block text-sm font-medium mb-2'>Bio</label>
        <textarea
          defaultValue='Passionate frontend developer with 5+ years of experience building modern web applications. Love learning new technologies and optimizing productivity workflows.'
          rows={3}
          className={`w-full px-4 py-3 rounded-lg border ${darkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
      </div>
    </div>
  );
};

export default PersonalInformation;