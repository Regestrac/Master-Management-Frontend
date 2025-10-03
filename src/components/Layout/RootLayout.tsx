import { Outlet } from 'react-router-dom';

import { useSettingsStore } from 'stores/settingsStore';

import Header from 'components/Navbar/Header';
import Sidebar from 'components/Layout/Sidebar';

const RootLayout = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}>
      <Sidebar />
      <div className='sm:ml-70 min-h-[100vh]'>
        <div className={`fixed top-0 left-0 right-0 z-50 sm:left-70 px-8 py-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <Header />
        </div>
        <div className='pt-32 max-[1200px]:pt-44 p-8'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;