import { Outlet } from 'react-router-dom';
import { useProfileStore } from 'stores/profileStore';

import Header from 'components/Navbar/Header';
import Sidebar from 'components/Layout/Sidebar';

const RootLayout = () => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}>
      <Sidebar />
      <div className='sm:ml-70 p-8'>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;