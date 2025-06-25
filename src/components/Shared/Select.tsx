import { ChangeEvent } from 'react';

import { FieldValues, Path, useController } from 'react-hook-form';

type Option = {
  label: string;
  value: string | number;
};

type SelectProps<T extends FieldValues> = {
  name: Path<T>;
  options: Option[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (_value: Option) => void;
};

function Select<T extends FieldValues>({
  name,
  options,
  label,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  onChange,
}: SelectProps<T>) {
  const { field, fieldState } = useController({ name });

  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    field.onChange(JSON.parse(event?.target.value));
    if (onChange) {
      onChange(JSON.parse(event?.target.value));
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className='text-sm font-medium text-gray-700 mb-1'>
          {label}
        </label>
      )}
      <select
        id={name}
        {...field}
        disabled={disabled}
        className={`
          block w-full rounded-md border 
          ${fieldState.error ? 'border-red-500' : 'border-gray-300'}
          bg-secondary-bg px-2 py-2 text-sm shadow-sm 
          focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition
        `}
        value={JSON.stringify(field.value)}
        onChange={handleOnChange}
      >
        <option value='' disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={JSON.stringify(opt)}>
            {opt.label}
          </option>
        ))}
      </select>
      {fieldState.error && (
        <span className='text-xs text-red-500 mt-1'>
          {fieldState.error.message}
        </span>
      )}
    </div>
  );
}

export default Select;