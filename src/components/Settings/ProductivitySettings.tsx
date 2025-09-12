import { SelectOptionType } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import SelectField from 'components/Shared/SelectField';
import Switch from 'components/Shared/Switch';
import Slider from 'components/Shared/Slider';

// Long break sessions options
const longBreakSessionsOptions: SelectOptionType[] = [
  { label: '2 sessions', value: 2 },
  { label: '3 sessions', value: 3 },
  { label: '4 sessions', value: 4 },
  { label: '5 sessions', value: 5 },
];

// Goal duration options
const goalDurationOptions: SelectOptionType[] = [
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 1 },
  { label: '2 hours', value: 2 },
  { label: '3 hours', value: 3 },
  { label: '4 hours', value: 4 },
];

// Weekly target hours options
const weeklyTargetOptions: SelectOptionType[] = [
  { label: '5 hours', value: 5 },
  { label: '10 hours', value: 10 },
  { label: '15 hours', value: 15 },
  { label: '20 hours', value: 20 },
  { label: '25 hours', value: 25 },
];

const ProductivitySettings = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6 flex items-center'>
        <span className='text-2xl mr-3'>⚡</span>
        Productivity & Focus
      </h4>

      <div className='space-y-6'>
        {/* Pomodoro Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Pomodoro Timer</h5>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Slider
              name='focusDuration'
              label='Focus Duration'
              min={15}
              max={90}
              step={5}
              unit=' minutes'
              showValue={true}
              showLabels={true}
            />
            <Slider
              name='shortBreak'
              label='Short Break'
              min={1}
              max={15}
              step={1}
              unit=' minutes'
              showValue={true}
              showLabels={true}
            />
            <Slider
              name='longBreak'
              label='Long Break'
              min={15}
              max={60}
              step={1}
              unit=' minutes'
              showValue={true}
              showLabels={true}
            />
          </div>
          <div className='mt-4 space-y-3'>
            <Switch
              name='autoStartBreaks'
              label='Auto-start Breaks'
              description='Automatically start break timer after focus sessions'
            />
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Long Break After</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Take a long break after 4 focus sessions
                </p>
              </div>
              <SelectField
                name='longBreakAfter'
                options={longBreakSessionsOptions}
                isMulti={false}
              />
            </div>
          </div>
        </div>

        {/* Goal Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Goal Management</h5>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Default Goal Duration</label>
              <SelectField
                name='defaultGoalDuration'
                options={goalDurationOptions}
                isMulti={false}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Weekly Target Hours</label>
              <SelectField
                name='weeklyTargetHours'
                options={weeklyTargetOptions}
                isMulti={false}
              />
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        {/* <div>
          <h5 className='font-semibold mb-4'>Automation & AI</h5>
          <div className='space-y-3'>
            <Switch
              name='smartTaskScheduling'
              label='Smart Task Scheduling'
              description='Automatically schedule tasks based on priority and deadlines'
            />
            <Switch
              name='autoCategorizeTasksAI'
              label='Auto-categorize Tasks'
              description='Use AI to categorize new tasks automatically'
            />
            <Switch
              name='productivityInsights'
              label='Productivity Insights'
              description='Generate weekly productivity reports and insights'
            />
            <Switch
              name='smartTimeBlocking'
              label='Smart Time Blocking'
              description='Automatically create time blocks based on your schedule'
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProductivitySettings;