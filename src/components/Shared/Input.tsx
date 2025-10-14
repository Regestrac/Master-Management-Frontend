import { InputHTMLAttributes, ReactNode, useState, useEffect, useRef } from 'react';

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
  onKeyDown?: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>['onKeyDown'];
  hideResizeIndicator?: boolean;
};

const Input = ({ name, label, icon, type = 'text', onBlur, id, hideResizeIndicator = false, ...props }: PropsType) => {
  const [showPassword, setShowPassword] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { field, formState: { errors } } = useController({ name });

  useEffect(() => {
    if (props.autoFocus && field.value) {
      const element = type === 'textarea' ? textareaRef.current : inputRef.current;
      if (element) {
        // Set cursor to end of text
        const length = field.value.length;
        element.setSelectionRange(length, length);
        element.focus();
      }
    }
  }, [props.autoFocus, field.value, type]);

  const handleOnBlur = () => {
    if (onBlur) {
      onBlur(field.value);
    }
  };

  return (
    <div className='w-full'>
      {label ? (
        <label htmlFor={id || name} className='block text-sm font-medium text-gray-700 mb-2'>
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
            id={id || name}
            rows={hideResizeIndicator ? 1 : props.rows || 4}
            className={`w-full ${icon ? 'pl-10 pr-4' : 'px-4'} py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors?.[name]
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500'} ${props.className || ''}`}
            style={{
              ...props.style,
              ...(hideResizeIndicator ? { resize: 'none', minHeight: 'auto', overflow: 'hidden' } : {}),
            }}
            onBlur={handleOnBlur}
            onInput={hideResizeIndicator ? (e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.max(target.scrollHeight, 24) + 'px';
            } : undefined}
            ref={(ref) => {
              textareaRef.current = ref;
              if (ref && hideResizeIndicator) {
                // Set initial height on mount
                ref.style.height = 'auto';
                ref.style.height = Math.max(ref.scrollHeight, 24) + 'px';
              }
            }}
          />
        ) : (
          <input
            {...field}
            {...props}
            id={id || name}
            type={showPassword ? 'text' : type}
            className={`w-full ${icon ? 'pl-10' : 'pl-4'} ${type === 'password' ? 'pr-10' : icon ? 'pr-4' : 'pr-4'} py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors?.[name]
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500'} ${props.className || ''}`}
            onBlur={handleOnBlur}
            ref={inputRef}
            autoComplete='on'
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