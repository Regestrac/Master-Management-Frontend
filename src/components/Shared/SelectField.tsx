import { FieldValues, Path, useController } from 'react-hook-form';
import Select from 'react-select';
import { useProfileStore } from 'stores/profileStore';

import { SelectOptionType, SelectValueType } from 'src/helpers/sharedTypes';

type SelectProps<T extends FieldValues> = {
  name: Path<T>;
  options: SelectOptionType[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isMulti?: boolean;
  onChange?: (_value: SelectValueType) => void;
};

function SelectField<T extends FieldValues>({
  name,
  options,
  label,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  onChange,
  ...selectProps
}: SelectProps<T>) {
  const darkTheme = useProfileStore((state) => state.data?.theme) === 'dark';

  const { field, fieldState } = useController({ name });

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className='text-sm font-medium text-gray-400 mb-1'>
          {label}
        </label>
      )}
      <Select
        {...field}
        options={options}
        value={field.value || null}
        onChange={(selectedOption) => {
          field.onChange(selectedOption);
          if (onChange && selectedOption) {
            onChange(selectedOption);
          }
        }}
        isDisabled={disabled}
        placeholder={placeholder}
        classNames={darkTheme ? {
          control: (state) => `bg-gray-800! text-gray-300! rounded-md! ${state.isFocused && !fieldState.error ? 'border-primary-500!' : 'border-gray-600!'} ${fieldState.error ? 'border-red-500!' : ''} ${state.isDisabled ? 'cursor-not-allowed! bg-gray-700!' : ''}`,
          menuList: () => 'bg-gray-800 border-gray-600 border-1 rounded-md',
          option: (state) => `cursor-pointer! hover:bg-primary-500/50! ${state.isFocused ? 'bg-primary-500/50!' : ''} ${state.isSelected ? 'bg-primary-600/50! text-white' : 'text-gray-900'}`,
          singleValue: () => 'text-gray-300!',
          multiValue: () => 'bg-gray-700! text-gray-300! rounded-md',
          multiValueLabel: () => 'text-gray-300!',
          multiValueRemove: () => 'text-gray-300! hover:bg-red-700/40! hover:text-white!',
          placeholder: () => 'text-gray-500!',
          input: () => 'text-gray-300!',
        } : {
          control: (state) => `text-gray-800! rounded-md! ${state.isFocused && !fieldState.error ? 'border-primary-500!' : 'border-gray-300!'} ${fieldState.error ? 'border-red-500!' : ''} ${state.isDisabled ? 'cursor-not-allowed!' : ''}`,
          menuList: () => 'border-gray-300 border-1 rounded-md',
          option: (state) => `cursor-pointer! hover:bg-primary-500/50! ${state.isFocused ? 'bg-primary-500/50!' : ''} ${state.isSelected ? 'bg-primary-600/50! text-white' : 'text-gray-900'}`,
          multiValue: () => 'rounded-md',
          multiValueRemove: () => 'text-gray-800!',
          placeholder: () => 'text-gray-600!',
          input: () => 'text-gray-800!',
        }}
        className={`min-w-[150px] transition ${className}`}
        components={{ IndicatorSeparator: null }}
        classNamePrefix='react-select'
        {...selectProps}
      />
      {fieldState.error && (
        <span className='text-xs text-red-500 mt-1'>
          {fieldState.error.message}
        </span>
      )}
    </div>
  );
}

export default SelectField;