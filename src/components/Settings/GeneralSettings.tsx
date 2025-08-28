import { SelectOptionType } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import SelectField from 'components/Shared/SelectField';
import Switch from 'components/Shared/Switch';

// Language options
const languageOptions: SelectOptionType[] = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Italiano', value: 'it' },
  { label: 'Português', value: 'pt' },
  { label: 'Русский', value: 'ru' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
  { label: '中文', value: 'zh' },
  { label: 'العربية', value: 'ar' },
  { label: 'हिन्दी', value: 'hi' },
];

// Timezone options
const timezoneOptions: SelectOptionType[] = [
  { label: '(UTC-12:00) Baker Island', value: 'UTC-12' },
  { label: '(UTC-11:00) Hawaii', value: 'UTC-11' },
  { label: '(UTC-10:00) Alaska', value: 'UTC-10' },
  { label: '(UTC-09:00) Alaska', value: 'UTC-9' },
  { label: '(UTC-08:00) Pacific Time', value: 'UTC-8' },
  { label: '(UTC-07:00) Mountain Time', value: 'UTC-7' },
  { label: '(UTC-06:00) Central Time', value: 'UTC-6' },
  { label: '(UTC-05:00) Eastern Time', value: 'UTC-5' },
  { label: '(UTC-04:00) Atlantic Time', value: 'UTC-4' },
  { label: '(UTC-03:00) Argentina', value: 'UTC-3' },
  { label: '(UTC-02:00) Mid-Atlantic', value: 'UTC-2' },
  { label: '(UTC-01:00) Azores', value: 'UTC-1' },
  { label: '(UTC+00:00) Greenwich Mean Time', value: 'UTC+0' },
  { label: '(UTC+01:00) Central European Time', value: 'UTC+1' },
  { label: '(UTC+02:00) Eastern European Time', value: 'UTC+2' },
  { label: '(UTC+03:00) Moscow Time', value: 'UTC+3' },
  { label: '(UTC+04:00) Gulf Time', value: 'UTC+4' },
  { label: '(UTC+05:00) Pakistan Time', value: 'UTC+5' },
  { label: '(UTC+06:00) Bangladesh Time', value: 'UTC+6' },
  { label: '(UTC+07:00) Indochina Time', value: 'UTC+7' },
  { label: '(UTC+08:00) China Standard Time', value: 'UTC+8' },
  { label: '(UTC+09:00) Japan Standard Time', value: 'UTC+9' },
  { label: '(UTC+10:00) Australian Eastern Time', value: 'UTC+10' },
  { label: '(UTC+11:00) Solomon Islands Time', value: 'UTC+11' },
  { label: '(UTC+12:00) Fiji Time', value: 'UTC+12' },
];

// Date format options
const dateFormatOptions: SelectOptionType[] = [
  { label: 'MM/DD/YYYY (US)', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY (UK)', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD (ISO)', value: 'YYYY-MM-DD' },
  { label: 'DD.MM.YYYY (German)', value: 'DD.MM.YYYY' },
  { label: 'MM-DD-YYYY', value: 'MM-DD-YYYY' },
];

// Time format options
const timeFormatOptions: SelectOptionType[] = [
  { label: '12-hour (AM/PM)', value: '12' },
  { label: '24-hour', value: '24' },
];

// First day of week options
const firstDayOptions: SelectOptionType[] = [
  { label: 'Sunday', value: 'sunday' },
  { label: 'Monday', value: 'monday' },
  { label: 'Saturday', value: 'saturday' },
];

// Work week options
const workWeekOptions: SelectOptionType[] = [
  { label: 'Monday to Friday (5 days)', value: '5' },
  { label: 'Monday to Saturday (6 days)', value: '6' },
  { label: 'Full Week (7 days)', value: '7' },
  { label: 'Custom', value: 'custom' },
];

// Default startup page options
const startupPageOptions: SelectOptionType[] = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Tasks', value: 'tasks' },
  { label: 'Goals', value: 'goals' },
  { label: 'Calendar', value: 'calendar' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Last Visited Page', value: 'last' },
];

const GeneralSettings = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6 flex items-center'>
        <span className='text-2xl mr-3'>⚙️</span>
        General Settings
      </h4>

      <div className='space-y-6'>
        {/* Language & Region */}
        <div>
          <h5 className='font-semibold mb-4'>Language & Region</h5>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SelectField
              name='language'
              label='Language'
              options={languageOptions}
              isMulti={false}
              placeholder='Select language...'
            />
            <SelectField
              name='timezone'
              label='Time Zone'
              options={timezoneOptions}
              isMulti={false}
              placeholder='Select timezone...'
            />
            <SelectField
              name='dateFormat'
              label='Date Format'
              options={dateFormatOptions}
              isMulti={false}
              placeholder='Select date format...'
            />
            <SelectField
              name='timeFormat'
              label='Time Format'
              options={timeFormatOptions}
              isMulti={false}
              placeholder='Select time format...'
            />
          </div>
        </div>

        {/* Week Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Week & Calendar Settings</h5>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SelectField
              name='firstDayOfWeek'
              label='First Day of Week'
              options={firstDayOptions}
              isMulti={false}
              placeholder='Select first day...'
            />
            <SelectField
              name='workWeek'
              label='Work Week'
              options={workWeekOptions}
              isMulti={false}
              placeholder='Select work week...'
            />
          </div>
        </div>

        {/* Startup Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Startup & Defaults</h5>
          <div className='space-y-4'>
            <SelectField
              name='startupPage'
              label='Default Page on Startup'
              options={startupPageOptions}
              isMulti={false}
              placeholder='Select startup page...'
            />
            <Switch
              name='autoStartTimer'
              label='Auto-start Focus Timer'
              description='Automatically start timer when clicking on tasks'
            />
            <Switch
              name='rememberWindowSize'
              label='Remember Window Size'
              description='Save window dimensions and position'
            />
            <Switch
              name='loadRecentFiles'
              label='Load Recent Files'
              description='Show recently opened projects on startup'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;