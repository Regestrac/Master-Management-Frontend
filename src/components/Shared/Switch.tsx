import { useController } from 'react-hook-form';
import clsx from 'clsx';

type SwitchPropsType = {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (_value: boolean) => void;
};

const Switch = ({
  name,
  label,
  description,
  disabled = false,
  className = '',
  onChange,
}: SwitchPropsType) => {
  const { field } = useController({ name });

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    const newValue = !field.value;
    field.onChange(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={clsx('flex items-center justify-between', className)}>
      {(label || description) && (
        <div className='flex-1'>
          {label && (
            <h6 className='font-medium'>{label}</h6>
          )}
          {description && (
            <p className='text-sm text-gray-400'>
              {description}
            </p>
          )}
        </div>
      )}
      <button
        type='button'
        onClick={handleToggle}
        disabled={disabled}
        className={clsx(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          {
            'bg-primary-500': field.value,
            'bg-gray-300': !field.value,
            'opacity-50 cursor-not-allowed': disabled,
            'cursor-pointer': !disabled,
          },
        )}
      >
        <span
          className={clsx(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            {
              'translate-x-6': field.value,
              'translate-x-1': !field.value,
            },
          )}
        />
      </button>
    </div>
  );
};

export default Switch;
