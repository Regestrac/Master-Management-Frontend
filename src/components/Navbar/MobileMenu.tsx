import { useState } from 'react';

import { Link } from 'react-router-dom';

import { NAVBAR_LINKS } from 'src/helpers/configs';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
          {NAVBAR_LINKS.map((navItem) => (
            <Link
              key={navItem.route}
              to={navItem.route}
              className='mobile-nav-link'
              onClick={() => setIsOpen(false)}
            >
              {navItem.label}
            </Link>
          ))}
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
    </>
  );
};

export default MobileMenu;