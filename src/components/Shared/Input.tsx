import { InputHTMLAttributes, ReactNode, useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';
import { useController } from 'react-hook-form';

type PropsType = {
  name: string;
  label: string;
  id?: string;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  rows?: number;
  onBlur?: (_value: string) => void;
  icon?: ReactNode;
  onClick?: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>['onClick'];
  style?: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>['style'];
  autoFocus?: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>['autoFocus'];
};

const Input = ({ name, label, icon, type = 'text', onBlur, ...props }: PropsType) => {
  const [showPassword, setShowPassword] = useState(false);

  const { field, formState: { errors } } = useController({ name });

  const handleOnBlur = () => {
    if (onBlur) {
      onBlur(field.value);
    }
  };

  return (
    <div className='w-full'>
      {label ? (
        <label htmlFor={props?.id || name} className='block text-sm font-medium text-gray-700 mb-2'>
          {label}
        </label>
      ) : null}
      <div className='relative'>
        {icon && (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            {icon}
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            {...field}
            {...props}
            rows={props.rows || 4}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors?.[name]
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'} ${props.className || ''}`}
            onBlur={handleOnBlur}
          />
        ) : (
          <input
            {...field}
            {...props}
            type={showPassword ? 'text' : type}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors?.[name]
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'} ${props.className || ''}`}
            onBlur={handleOnBlur}
          />
        )}
        {type === 'password' && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
          >
            {showPassword ? (
              <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            ) : (
              <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            )}
          </button>
        )}
      </div>
      {errors?.[name] ? (
        <span className='p-1 text-red-500'>
          {Array.isArray(errors[name]?.message) ? errors[name]?.message[0] : errors[name]?.message}
        </span>
      ) : null}
    </div>
  );
};

export default Input;