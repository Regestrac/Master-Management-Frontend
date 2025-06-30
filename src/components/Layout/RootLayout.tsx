import { Outlet } from 'react-router-dom';

import Navbar from 'components/Navbar/Navbar';

import Sidebar from './Sidebar';

const RootLayout = () => {
  return (
    <div className='app-container'>
      <Navbar />
      <Sidebar />
      <main className='main-content'>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;