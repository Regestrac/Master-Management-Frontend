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
};

const Input = ({ name, label, type = 'text', onBlur, ...props }: PropsType) => {
  const { field, formState: { errors } } = useController({ name });

  const handleOnBlur = () => {
    if (onBlur) {
      onBlur(field.value);
    }
  };

  return (
    <div className='mb-6 w-full'>
      {label ? (
        <label htmlFor={props?.id || name} className='block mb-2 font-medium text-text-light tracking-wide'>
          {label}
        </label>
      ) : null}
      {type === 'textarea' ? (
        <textarea
          {...field}
          {...props}
          rows={props.rows || 4}
          className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-base outline-none transition focus:border-blue-500 bg-primary-bg ${props.className}`}
          onBlur={handleOnBlur}
        />
      ) : (
        <input
          {...field}
          {...props}
          type={type}
          className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-base outline-none transition focus:border-blue-500 bg-primary-bg ${props.className}`}
          onBlur={handleOnBlur}
        />
      )}
      {errors?.[name] ? (
        <span className='p-1 text-red-500'>
          {Array.isArray(errors[name]?.message) ? errors[name]?.message[0] : errors[name]?.message}
        </span>
      ) : null}
    </div>
  );
};

export default Input;