import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { toast } from 'react-toastify';

import { PriorityType, StatusType } from 'helpers/sharedTypes';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from 'helpers/configs';
import { getPriorityColor, getStatusColor } from 'helpers/utils';

import { useTaskStore } from 'stores/taskStore';
import { useSettingsStore } from 'stores/settingsStore';

import { createTask } from 'services/tasks';

import Dropdown from 'components/Shared/Dropdown';
import Input from 'components/Shared/Input';
import { DatePicker } from 'components/Shared/DatePicker';

type CreateTaskFormDataType = {
  new_task_title: string;
  status: StatusType;
  priority: PriorityType | null;
  due_date: Date | null;
};

const CreateTaskCard = ({ handleCancel }: { handleCancel: () => void }) => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const addTask = useTaskStore((state) => state.addTask);

  const methods = useForm<CreateTaskFormDataType>({
    defaultValues: {
      new_task_title: '',
      status: 'todo',
      priority: null,
      due_date: null,
    },
  });

  const { control, setValue, handleSubmit } = methods;

  const { new_task_title, status, priority } = useWatch({ control });

  const handleSaveTask = (formData: CreateTaskFormDataType) => {
    const payload = {
      title: formData.new_task_title,
      status: formData?.status || 'todo' satisfies StatusType,
      priority: formData?.priority,
      time_spend: 0,
      type: 'task',
      due_date: formData?.due_date ? formData.due_date.toISOString().split('T')[0] : null,
    };
    createTask(payload).then((res) => {
      toast.success(res?.message || 'Successfully created task');
      addTask(res?.data);
      handleCancel();
    }).catch((err) => {
      toast.error(err?.error || 'Failed to create task');
    });
  };

  const handlePrioritySelect = (value?: string | null) => {
    setValue('priority', value as PriorityType);
  };

  const handleStatusSelect = (value?: string | null) => {
    if (value) {
      setValue('status', value as StatusType);
    }
  };

  return (
    <div
      className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer py-4 px-6`}
    >
      <div className='flex flex-row justify-between'>
        <FormProvider {...methods}>
          <div className='flex items-center gap-3'>
            <Dropdown options={PRIORITY_OPTIONS} onSelect={handlePrioritySelect} value={priority ?? undefined} isMulti={false}>
              <div className={`w-3 h-3 rounded-full cursor-pointer hover:scale-120 ${getPriorityColor(priority!)}`} />
            </Dropdown>
            <div className='flex flex-col gap-2 ms-2'>
              <Input
                name='new_task_title'
                label=''
                autoFocus
                placeholder='Enter title...'
                className='font-semibold text-lg cursor-text outline-none p-0! text-white border-none focus:ring-0!'
              />
              <div className='flex items-center gap-2 flex-wrap'>
                <Dropdown options={STATUS_OPTIONS} onSelect={handleStatusSelect} value={status} hideClear isMulti={false}>
                  <span className={`px-3 py-1 rounded-full font-medium cursor-grab ${getStatusColor(status!)}`}>
                    {status?.toUpperCase()}
                  </span>
                </Dropdown>
                <div className='min-w-[140px]'>
                  <DatePicker
                    name='due_date'
                    placeholder='Set due date'
                    className='text-sm'
                  />
                </div>
              </div>
            </div>
          </div>
        </FormProvider>
        <div className='flex flex-row gap-3 items-center'>
          {new_task_title?.trim() && (
            <button className='p-2 bg-green-500 rounded-md' onClick={handleSubmit(handleSaveTask)}>
              <Save className='h-6 w-6' />
            </button>
          )}
          <button className='p-2 bg-red-500 rounded-md' onClick={handleCancel}>
            <X className='h-6 w-6' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskCard;