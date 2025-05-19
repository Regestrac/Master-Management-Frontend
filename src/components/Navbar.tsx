import { useState } from 'react';

import { Link } from 'react-router-dom';

import 'components/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link to='/dashboard' className='nav-link'>
              Dashboard
            </Link>
            <Link to='/projects' className='nav-link'>
              Projects
            </Link>
            <Link to='/tasks' className='nav-link'>
              Tasks
            </Link>
            <Link to='/settings' className='nav-link'>
              Settings
            </Link>
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

          {/* Mobile Menu Button */}
          <div className='mobile-menu-button'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='menu-button'
              aria-label='Open menu'
            >
              {!isOpen ? (
                <svg className='menu-icon' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              ) : (
                <svg className='menu-icon' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className='mobile-menu-content'>
          <div className='mobile-menu-header'>
            <span className='mobile-menu-title'>Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className='mobile-close-button'
              aria-label='Close menu'
            >
              <svg className='menu-icon' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
          <Link
            to='/dashboard'
            className='mobile-nav-link'
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to='/projects'
            className='mobile-nav-link'
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            to='/tasks'
            className='mobile-nav-link'
            onClick={() => setIsOpen(false)}
          >
            Tasks
          </Link>
          <Link
            to='/settings'
            className='mobile-nav-link'
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>

          <div className='mobile-divider' />

          <Link
            to='/profile'
            className='mobile-profile-link'
            onClick={() => setIsOpen(false)}
          >
            <div className='profile-avatar'>
              <div className='avatar-inner'>
                <span className='avatar-text'>JD</span>
              </div>
            </div>
            <span className='mobile-profile-name'>John Doe</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
