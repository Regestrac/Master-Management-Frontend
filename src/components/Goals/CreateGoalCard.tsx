import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import { PriorityType, StatusType, TargetType, TargetFrequency } from 'helpers/sharedTypes';
import { STATUS_OPTIONS } from 'helpers/configs';
import { getStatusColor } from 'helpers/utils';

import { useGoalStore } from 'stores/goalsStore';
import { useSettingsStore } from 'stores/settingsStore';

import { createGoal } from 'services/goals';

import Dropdown from 'components/Shared/Dropdown';
import Input from 'components/Shared/Input';
import DatePicker from 'components/Shared/DatePicker';

type CreateGoalFormDataType = {
  new_goal_title: string;
  description: string;
  status: StatusType;
  priority: PriorityType | null;
  target_value: number | null;
  target_type: TargetType | null;
  target_frequency: TargetFrequency | null;
  due_date: Date | null;
};

type CreateGoalCardPropsType = {
  handleCancel: () => void;
  view: 'grid' | 'list';
};

const TARGET_TYPE_OPTIONS = [
  { label: 'Repetition', value: 'repetition' },
  { label: 'Hours', value: 'hours' },
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
  { label: 'Sessions', value: 'sessions' },
  { label: 'Points', value: 'points' },
  { label: 'Percentage', value: 'percentage' },
];

const TARGET_FREQUENCY_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Alternate Days', value: 'alternate_days' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Custom', value: 'custom' },
];

const CreateGoalCard = ({ handleCancel, view }: CreateGoalCardPropsType) => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const addGoal = useGoalStore((state) => state.addGoal);

  const bgColor = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  const methods = useForm<CreateGoalFormDataType>({
    defaultValues: {
      new_goal_title: '',
      description: '',
      status: 'todo',
      priority: null,
      target_value: null,
      target_type: null,
      target_frequency: null,
      due_date: null,
    },
  });

  const { control, setValue, handleSubmit } = methods;
  const { new_goal_title, status, target_type, target_frequency } = useWatch({ control });

  const handleSaveGoal = (formData: CreateGoalFormDataType) => {
    const payload = {
      title: formData.new_goal_title,
      description: formData.description,
      status: formData?.status || 'todo',
      priority: formData?.priority,
      time_spend: 0,
      type: 'goal',
      target_value: formData?.target_value,
      target_type: formData?.target_type,
      target_frequency: formData?.target_frequency,
      due_date: formData?.due_date ? formData.due_date.toISOString().split('T')[0] : null,
    };
    createGoal(payload)
      .then((res) => {
        toast.success(res?.message || 'Successfully created goal');
        addGoal(res?.data);
        handleCancel();
      })
      .catch((err) => {
        toast.error(err?.error || 'Failed to create goal');
      });
  };

  const handleStatusSelect = (value?: string | null) => {
    if (value) {
      setValue('status', value as StatusType);
    }
  };

  const handleTargetTypeSelect = (value?: string | null) => {
    if (value) {
      setValue('target_type', value as TargetType);
    }
  };

  const handleTargetFrequencySelect = (value?: string | null) => {
    if (value) {
      setValue('target_frequency', value as TargetFrequency);
    }
  };

  const renderActionButtons = () => (
    <div className={`flex gap-2 ${view === 'list' ? 'items-center' : ''}`}>
      <button
        className={clsx(
          view === 'grid' ? 'flex-1 flex items-center justify-center gap-2 py-2.5 px-4' : 'p-2.5',
          'rounded-lg transition-all duration-200 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md',
        )}
        onClick={handleSubmit(handleSaveGoal)}
        disabled={!new_goal_title?.trim()}
      >
        <Save className='h-4 w-4' />
        {view === 'grid' ? 'Create' : null}
      </button>
      <button
        className={clsx(
          view === 'grid' ? 'flex-1 flex items-center justify-center gap-2 py-2.5 px-4' : 'p-2.5',
          'rounded-lg transition-all duration-200 bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md',
        )}
        onClick={handleCancel}
      >
        <X className='h-4 w-4' />
        {view === 'grid' ? 'Cancel' : null}
      </button>
    </div>
  );

  const renderStatusPill = () => (
    <Dropdown options={STATUS_OPTIONS} onSelect={handleStatusSelect} value={status} hideClear isMulti={false}>
      <span className={`px-3 py-1 rounded-full text-sm font-medium cursor-grab ${getStatusColor(status!, darkMode)}`}>
        {status?.toUpperCase()}
      </span>
    </Dropdown>
  );

  const renderTargetConfiguration = () => (
    <div className={`rounded-md p-3 mb-3 ${darkMode ? 'bg-gray-800/30 border border-gray-700/50' : 'bg-gray-50/70 border border-gray-200/70'}`}>
      <h4 className={`text-xs font-medium mb-2 flex items-center gap-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />
        Target Settings
      </h4>
      <div className={`grid gap-3 ${view === 'grid' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {/* Target Value */}
        <div className='space-y-1'>
          <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Value
          </label>
          <Input
            name='target_value'
            label=''
            type='text'
            placeholder='10'
            className={`text-sm py-1.5 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
          />
        </div>

        {/* Target Type */}
        <div className={view === 'grid' ? 'space-x-2 flex' : 'space-y-1'}>
          <label className={clsx(
            'text-xs font-medium',
            view === 'grid' ? 'flex items-center h-full' : 'block',
            darkMode ? 'text-gray-400' : 'text-gray-600',
          )}
          >
            Type
          </label>
          <Dropdown
            options={TARGET_TYPE_OPTIONS}
            onSelect={handleTargetTypeSelect}
            value={target_type}
            hideClear={false}
            isMulti={false}
          >
            <div
              className={clsx(
                'px-3 py-1 rounded-md border cursor-pointer transition-all duration-200 text-sm', darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:border-gray-500' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400',
                target_type ? 'font-medium' : 'text-opacity-70',
              )}
            >
              {target_type ? TARGET_TYPE_OPTIONS.find((opt) => opt.value === target_type)?.label : 'Type'}
            </div>
          </Dropdown>
        </div>

        {/* Target Frequency */}
        <div className={view === 'grid' ? 'space-x-2 flex' : 'space-y-1'}>
          <label className={clsx(
            'text-xs font-medium',
            view === 'grid' ? 'flex items-center h-full' : 'block',
            darkMode ? 'text-gray-400' : 'text-gray-600',
          )}
          >
            Frequency
          </label>
          <Dropdown
            options={TARGET_FREQUENCY_OPTIONS}
            onSelect={handleTargetFrequencySelect}
            value={target_frequency}
            hideClear={false}
            isMulti={false}
          >
            <div
              className={`px-2.5 py-1.5 rounded-md border cursor-pointer transition-all duration-200 text-sm ${darkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 hover:border-gray-500'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'} ${target_frequency ? 'font-medium' : 'text-opacity-70'}`}
            >
              {target_frequency ? TARGET_FREQUENCY_OPTIONS.find((opt) => opt.value === target_frequency)?.label : 'Frequency'}
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );

  const renderDueDatePicker = () => (
    <div className='w-full'>
      <label className={clsx(
        'text-xs font-medium',
        darkMode ? 'text-gray-400' : 'text-gray-600',
      )}
      >
        Due Date
      </label>
      <div className='w-full'>
        <DatePicker
          name='due_date'
          placeholder='Set due date'
          className='text-sm'
        />
      </div>
    </div>
  );

  const renderTitle = () => (
    <div className='flex flex-1 items-center gap-3 mb-2 flex-wrap'>
      <Input
        name='new_goal_title'
        label=''
        type='textarea'
        autoFocus
        hideResizeIndicator
        placeholder='Goal title...'
        className='font-semibold text-lg cursor-text outline-none p-0! border-none focus:ring-0! bg-transparent'
      />
      <div className={clsx('flex items-center justify-center gap-2', view === 'grid' ? 'w-full' : 'gap-6 w-full max-w-[340px]')}>
        {renderStatusPill()}
        {renderDueDatePicker()}
      </div>
    </div>
  );

  // ----------------------------
  // List View Layout
  if (view === 'list') {
    return (
      <div className={clsx('rounded-xl border shadow-sm hover:shadow-md transition-all duration-200', bgColor)}>
        <FormProvider {...methods}>
          <div className='p-6'>
            <div className='flex justify-between items-start mb-4'>
              <div className='flex-1 mr-4'>
                {renderTitle()}
              </div>
              <div className='flex-shrink-0'>
                {renderActionButtons()}
              </div>
            </div>
            {renderTargetConfiguration()}
          </div>
        </FormProvider>
      </div>
    );
  }

  // ----------------------------
  // Grid View Layout
  return (
    <div className={clsx('rounded-xl border shadow-sm hover:shadow-md transition-all duration-200', bgColor)}>
      <FormProvider {...methods}>
        <div className='p-6 h-full flex flex-col'>
          {renderTitle()}
          <div className='flex-1 py-2'>
            {renderTargetConfiguration()}
          </div>
          <div className='mt-auto pt-2'>
            {renderActionButtons()}
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default CreateGoalCard;
