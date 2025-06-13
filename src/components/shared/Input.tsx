import { useController } from 'react-hook-form';

type PropsType = {
  name: string;
  label: string;
  id?: string;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
};

const Input = ({ name, label, type = 'text', ...props }: PropsType) => {
  const { field } = useController({ name });

  return (
    <div className='mb-6'>
      <label htmlFor={props?.id || name} className='block mb-2 font-medium text-text-light tracking-wide'>
        {label}
      </label>
      <input
        {...field}
        {...props}
        type={type}
        className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-base outline-none transition focus:border-blue-500 bg-primary-bg ${props.className}`}
      />
    </div>
  );
};

export default Input;