import { useState } from 'react';

import { BarChart3, Calendar, CheckSquare, Home, Settings, Target, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNavbarStore } from 'stores/navbarStore';
import { useProfileStore } from 'stores/profileStore';

const navbarItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  { id: 'goals', icon: Target, label: 'Goals' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';
  const showNavbar = useNavbarStore((state) => state.showNavbar);

  const navigate = useNavigate();

  const handleNavLinkClick = (id: string) => {
    setActiveTab(id);
    navigate(`/${id}`);
  };

  return (
    <div className={`${showNavbar ? 'translate transition-transform duration-700' : '-translate-x-full transition-transform duration-700'} fixed left-0 top-0 h-full w-70 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-colors duration-300 z-20`}>
      <div className='p-6'>
        <div className='flex items-center space-x-3 mb-8'>
          <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
            <Target className='w-6 h-6 text-white' />
          </div>
          <h1 className='text-xl font-bold'>Master Management</h1>
        </div>

        <nav className='space-y-2'>
          {navbarItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleNavLinkClick(id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${activeTab === id
                ? 'bg-purple-500 text-white'
                : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Icon className='w-5 h-5' />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;