import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import { PriorityType, StatusType } from 'helpers/sharedTypes';
import { STATUS_OPTIONS } from 'helpers/configs';
import { getStatusColor } from 'helpers/utils';

import { useProfileStore } from 'stores/profileStore';
import { useGoalStore } from 'stores/goalsStore';

import { createGoal } from 'services/goals';

import Dropdown from 'components/Shared/Dropdown';
import Input from 'components/Shared/Input';

type CreateGoalFormDataType = {
  new_goal_title: string;
  description: string;
  status: StatusType;
  priority: PriorityType | null;
};

type CreateGoalCardPropsType = {
  handleCancel: () => void;
  view: 'grid' | 'list';
};

const CreateGoalCard = ({ handleCancel, view }: CreateGoalCardPropsType) => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const addGoal = useGoalStore((state) => state.addGoal);

  const bgColor = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  const methods = useForm<CreateGoalFormDataType>({
    defaultValues: {
      new_goal_title: '',
      description: '',
      status: 'todo',
      priority: null,
    },
  });

  const { control, setValue, handleSubmit } = methods;
  const { new_goal_title, status } = useWatch({ control });

  const handleSaveGoal = (formData: CreateGoalFormDataType) => {
    const payload = {
      title: formData.new_goal_title,
      description: formData.description,
      status: formData?.status || 'todo',
      priority: formData?.priority,
      time_spend: 0,
      type: 'goal',
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

  const renderActionButtons = () => (
    <div className={`flex gap-2 ${view === 'list' ? 'items-center space-x-2' : 'mt-16'}`}>
      <button
        className={`${view === 'grid' ? 'flex-1 flex items-center justify-center gap-2 py-2 px-3' : 'p-2'} rounded-lg transition-colors bg-green-500 hover:bg-green-600 text-white disabled:opacity-50`}
        onClick={handleSubmit(handleSaveGoal)}
        disabled={!new_goal_title?.trim()}
      >
        <Save className='h-5 w-5' />
        {view === 'grid' ? 'Create' : null}
      </button>
      <button
        className={`${view === 'grid' ? 'flex-1 flex items-center justify-center gap-2 py-2 px-3' : 'p-2'} rounded-lg transition-colors bg-red-500 hover:bg-red-600 text-white`}
        onClick={handleCancel}
      >
        <X className='h-5 w-5' />
        {view === 'grid' ? 'Cancel' : null}
      </button>
    </div>
  );

  const renderStatusPill = () => (
    <Dropdown options={STATUS_OPTIONS} onSelect={handleStatusSelect} value={status} hideClear>
      <span className={`px-3 py-1 rounded-full text-sm font-medium cursor-grab ${getStatusColor(status!)}`}>
        {status?.toUpperCase()}
      </span>
    </Dropdown>
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
      {renderStatusPill()}
    </div>
  );

  // ----------------------------
  // List View Layout
  if (view === 'list') {
    return (
      <div className={clsx('rounded-xl border shadow-sm hover:shadow-md transition-all duration-200', bgColor)}>
        <FormProvider {...methods}>
          <div className='p-6 flex justify-between items-start'>
            {renderTitle()}
            {renderActionButtons()}
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
        <div className='p-6 h-full'>
          {renderTitle()}
          {renderActionButtons()}
        </div>
      </FormProvider>
    </div>
  );
};

export default CreateGoalCard;
