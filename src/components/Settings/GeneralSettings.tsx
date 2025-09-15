import { DATE_FORMAT_OPTIONS, FIRST_DAY_OPTIONS, TIME_FORMAT_OPTIONS, WORK_WEEK_OPTIONS } from 'helpers/configs';

import { useProfileStore } from 'stores/profileStore';

import SelectField from 'components/Shared/SelectField';

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
              options={DATE_FORMAT_OPTIONS}
              isMulti={false}
              placeholder='Select date format...'
            />
            <SelectField
              name='timeFormat'
              label='Time Format'
              options={TIME_FORMAT_OPTIONS}
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
              options={FIRST_DAY_OPTIONS}
              isMulti={false}
              placeholder='Select first day...'
            />
            <SelectField
              name='workWeek'
              label='Work Week'
              options={WORK_WEEK_OPTIONS}
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