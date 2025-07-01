import { Outlet } from 'react-router-dom';
import { useThemeStore } from 'stores/themeStore';

import Header from 'components/Navbar/Header';
import Sidebar from 'components/Layout/Sidebar';

const RootLayout = () => {
  const darkMode = useThemeStore((state) => state.theme) === 'dark';

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}>
      <Sidebar />
      <div className='ml-64 p-8'>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;