import { themes, useTheme } from 'context/themeHelpers';

import 'components/Settings.css';

const Settings = () => {
  const { theme: currentTheme, setTheme } = useTheme();

  const themeOptions = Object.keys(themes) as Array<keyof typeof themes>;

  return (
    <div className='settings-container'>
      <h1 className='settings-title'>Settings</h1>

      <div className='settings-section'>
        <h2 className='settings-section-title'>Theme</h2>
        <div className='theme-grid'>
          {themeOptions.map((themeName) => (
            <div
              key={themeName}
              className={`theme-option ${currentTheme === themeName ? 'active' : ''}`}
              onClick={() => setTheme(themeName)}
            >
              <div className={`theme-preview theme-preview-${themeName}`} />
              <span className='theme-name'>
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
