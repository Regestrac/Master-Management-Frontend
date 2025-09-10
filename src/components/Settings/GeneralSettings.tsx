import { SelectOptionType } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import SelectField from 'components/Shared/SelectField';

// Date format options
const dateFormatOptions: SelectOptionType[] = [
  { label: 'MM/DD/YYYY (US)', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY (UK)', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD (ISO)', value: 'YYYY-MM-DD' },
  { label: 'DD.MM.YYYY (German)', value: 'DD.MM.YYYY' },
  { label: 'MM-DD-YYYY', value: 'MM-DD-YYYY' },
  { label: 'DD-MM-YYYY', value: 'DD-MM-YYYY' },
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
// const startupPageOptions: SelectOptionType[] = [
//   { label: 'Dashboard', value: 'dashboard' },
//   { label: 'Tasks', value: 'tasks' },
//   { label: 'Goals', value: 'goals' },
//   { label: 'Calendar', value: 'calendar' },
//   { label: 'Analytics', value: 'analytics' },
//   { label: 'Last Visited Page', value: 'last' },
// ];

const GeneralSettings = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6 flex items-center'>
        <span className='text-2xl mr-3'>⚙️</span>
        General Settings
      </h4>

      <div className='space-y-6'>
        {/* Date & Time Format */}
        <div>
          <h5 className='font-semibold mb-4'>Date & Time Format</h5>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
        {/* <div>
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
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default GeneralSettings;