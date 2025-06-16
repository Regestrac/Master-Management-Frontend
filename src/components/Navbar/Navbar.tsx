import { Link } from 'react-router-dom';
import { useProfileStore } from 'stores/profileStore';

import MobileMenu from 'components/Navbar/MobileMenu';
import ValidateUser from 'components/Navbar/ValidateUser';

import { NAVBAR_LINKS } from 'src/helpers/configs';

const Navbar = () => {
  const firstName = useProfileStore((state) => state?.firstName);
  const lastName = useProfileStore((state) => state?.lastName);

  return (
    <nav className='navbar'>
      <ValidateUser />
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
