import { Outlet } from 'react-router-dom';

import { useProfileStore } from 'stores/profileStore';

import Header from 'components/Navbar/Header';
import Sidebar from 'components/Layout/Sidebar';

const RootLayout = () => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}>
      <Sidebar />
      <div className='sm:ml-70 min-h-[100vh]'>
        <div className={`fixed top-0 left-0 right-0 z-50 sm:left-70 px-8 py-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <Header />
        </div>
        <div className='pt-32 max-sm:pt-42 p-8'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;