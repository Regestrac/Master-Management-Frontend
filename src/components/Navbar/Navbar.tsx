import { Link } from 'react-router-dom';

import MobileMenu from 'components/Navbar/MobileMenu';

import { NAVBAR_LINKS } from 'src/helpers/configs';

const Navbar = () => {
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
              <span className='profile-name'>John Doe</span>
              <div className='profile-avatar'>
                <div className='avatar-inner'>
                  <span className='avatar-text'>JD</span>
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
