import { useState } from 'react';

import { useController } from 'react-hook-form';
import clsx from 'clsx';

type SliderPropsType = {
  name: string;
  label?: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  showValue?: boolean;
  showLabels?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (_value: number) => void;
};

const Slider = ({
  name,
  label,
  min,
  max,
  step = 1,
  unit = '',
  showValue = true,
  showLabels = true,
  disabled = false,
  className = '',
  onChange,
}: SliderPropsType) => {
  const { field } = useController({ name });
  const [currentValue, setCurrentValue] = useState(field.value || min);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) { return; }

    const newValue = Number(event.target.value);
    setCurrentValue(newValue);
    field.onChange(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const getLabels = () => {
    const range = max - min;
    const midPoint = min + range / 2;
    return [min, midPoint, max];
  };

  return (
    <div className={clsx('space-y-2', className)}>
      {label && (
        <label className='block text-sm font-medium' htmlFor={name}>
          {label}
          {showValue && (
            <span className='ml-2 text-gray-500'>
              {currentValue}
              {unit}
            </span>
          )}
        </label>
      )}

      <div className='relative'>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          name={name}
          id={name}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className={clsx(
            'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
            'focus:outline-none focus:ring-1 focus:ring-primary-500',
            'slider-thumb:appearance-none slider-thumb:w-4 slider-thumb:h-4',
            'slider-thumb:rounded-full slider-thumb:bg-primary-500',
            'slider-thumb:cursor-pointer slider-thumb:border-0',
            'slider-thumb:shadow-md slider-thumb:transition-all',
            'hover:slider-thumb:scale-110',
            {
              'opacity-50 cursor-not-allowed': disabled,
              'slider-thumb:bg-gray-400': disabled,
            },
          )}
          style={{
            background: disabled
              ? '#e5e7eb'
              : `linear-gradient(to right, var(--color-primary-500) 0%, var(--color-primary-500) ${((currentValue - min) / (max - min)) * 100}%, #e5e7eb ${((currentValue - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
          }}
        />
      </div>

      {showLabels && (
        <div className='flex justify-between text-xs text-gray-500'>
          {getLabels().map((labelValue, index) => (
            <span key={index}>
              {labelValue}
              {unit}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
