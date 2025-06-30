import Navbar from 'components/Navbar/Navbar';

import Sidebar from './Sidebar';

const RootLayout = () => {
  return (
    <div className='app-container'>
      <Navbar />
      <main className='main-content'>
        <Sidebar />
      </main>
    </div>
  );
};

export default RootLayout;