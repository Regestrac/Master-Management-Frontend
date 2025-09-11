import { useMemo, useState } from 'react';

import { Bell, Moon, Search, Sun, Menu, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLocation, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

import { debounce, omit } from 'helpers/utils';

import { useNavbarStore } from 'stores/navbarStore';
import { useProfileStore } from 'stores/profileStore';

import { updateTheme } from 'services/profile';

const Header = () => {
  const setShowNavbar = useNavbarStore((state) => state.setShowNavbar);
  const showNavbar = useNavbarStore((state) => state.showNavbar);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';
  const firstName = useProfileStore((state) => state?.data?.first_name);

  const [searchParams, setSearchParams] = useSearchParams();

  const searchKey = searchParams.get('searchKey');

  const [searchKeyValue, setSearchKeyValue] = useState(searchKey || '');

  const { pathname } = useLocation();

  const updateColorTheme = () => {
    updateProfile({ theme: darkMode ? 'light' : 'dark' });
    updateTheme({ theme: darkMode ? 'light' : 'dark' }).then((res) => {
      updateProfile({ theme: res?.theme });
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  const handleSidebarToggle = () => {
    setShowNavbar(!showNavbar);
  };

  const urlFilterParams = useMemo(() => {
    let filterObject: { [key: string]: string | string[] } = {};
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key === 'status' || key === 'priority') {
        filterObject = { ...filterObject, [key]: searchParams.getAll(key) };
      } else {
        filterObject = { ...filterObject, [key]: value };
      }
    });
    return filterObject;
  }, [searchParams]);

  const debouncedSearch = useMemo(() => debounce((value: string) => {
    setSearchParams(value ? { ...urlFilterParams, searchKey: value } : omit(urlFilterParams, 'searchKey'));
  }, 200), [urlFilterParams, setSearchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className='flex flex-wrap items-start lg:items-center justify-between mb-8 gap-4'>
      <div className='w-full md:w-auto flex items-center justify-between'>
        <div>
          <h2 className='text-2xl md:text-3xl font-bold mb-1 md:mb-2 lg:whitespace-nowrap'>
            Good Morning,&nbsp;
            {firstName}
            ! 👋
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-base w-full md:w-auto`}>
            You have 5 tasks scheduled for today
          </p>
        </div>
        {/* Hamburger icon visible on small screens */}
        <button
          className={`sm:hidden ml-2 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          onClick={handleSidebarToggle}
          aria-label='Open sidebar'
        >
          {showNavbar ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
        </button>
      </div>

      <div className='flex items-center space-x-2 md:space-x-4 w-full md:w-auto'>
        {!pathname.includes('/dashboard') ? (
          <div className='relative flex-1 md:flex-none w-full md:w-auto'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              value={searchKeyValue}
              placeholder='Search...'
              onChange={handleSearchChange}
              className={clsx(
                'pl-10 pr-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500',
                darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
              )}
            />
          </div>
        ) : null}
        <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
          <Bell className='w-5 h-5' />
        </button>
        <button
          onClick={updateColorTheme}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
        </button>
      </div>
    </div>
  );
};

export default Header;