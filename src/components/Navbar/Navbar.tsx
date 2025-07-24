import { Link } from 'react-router-dom';

import { NAVBAR_LINKS } from 'helpers/configs';

import { useProfileStore } from 'stores/profileStore';

import MobileMenu from 'components/Navbar/MobileMenu';

const Navbar = () => {
  const firstName = useProfileStore((state) => state?.data?.first_name);
  const lastName = useProfileStore((state) => state?.data?.last_name);
  const userId = useProfileStore((state) => state?.data?.id);

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-content'>
          {/* Logo Section */}
          <div className='logo-section'>
            <Link to='/' className='logo-link'>
              <img
                className='logo-image'
                src='/src/assets/logo.png'
                alt='Logo'
              />
              <span className='logo-text'>
                Master Management
              </span>
            </Link>
          </div>

          {userId ? (
            <>
              {/* Navigation Links */}
              <div className='nav-links'>
                {NAVBAR_LINKS.map((navItem) => (
                  <Link key={navItem.route} to={navItem.route} className='nav-link'>
                    {navItem.label}
                  </Link>
                ))}
              </div>
              {/* Profile Section */}
              <div className='profile-section'>
                <Link to='/profile' className='profile-link'>
                  <span className='profile-name'>{`${firstName} ${lastName}`}</span>
                  <div className='profile-avatar'>
                    <div className='avatar-inner'>
                      <span className='avatar-text'>{(firstName[0] || '') + (lastName[0] || '')}</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Mobile Menu Section */}
              <MobileMenu />
            </>
          ) : (
            <div className='profile-section'>
              <div className='flex gap-4'>
                <Link
                  to='/auth/login'
                  className='px-4 py-2 rounded-md text-sm font-medium text-text hover:bg-primary-bg hover:outline-1 transition'
                >
                  Login
                </Link>
                <Link
                  to='/auth/signup'
                  className='px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-blue-700 transition'
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
