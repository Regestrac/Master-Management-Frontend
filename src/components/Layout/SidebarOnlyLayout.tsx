import { Outlet } from 'react-router-dom';

import { useSettingsStore } from 'stores/settingsStore';

import Sidebar from 'components/Layout/Sidebar';

const SidebarOnlyLayout = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}>
      <Sidebar />
      <div className='sm:ml-70 p-8 min-h-[100vh]'>
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarOnlyLayout;
