import React, { useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProfileStore } from 'stores/profileStore';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from 'components/Shared/Input';

import { login } from 'src/services/auth';
import { getProfile } from 'src/services/profile';

type LoginType = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().nonempty('Email is required!').email('Invalid email address!'),
  password: z.string().nonempty('Password is required!').min(6, 'Password must be at least 6 characters!'),
});

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useProfileStore((state) => state.updateProfile);

  const navigate = useNavigate();

  const methods = useForm<LoginType>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onLoginSubmit = (formData: LoginType) => {
    setError(null); // Reset error state before login attempt
    login(formData).then((res) => {
      navigate('/', { replace: true });
      toast.success(res?.message || 'Login successful! Welcome!');
      getProfile().then((profile) => {
        updateProfile({
          firstName: profile?.data?.first_name || '',
          lastName: profile?.data?.last_name || '',
          email: profile?.data?.email || '',
        });
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch profile. Please try again.');
      });
    }).catch((err) => {
      setError(err.error || 'Login failed. Please try again.');
    });
  };

  return (
    <FormProvider {...methods}>
      <div className='max-w-md mx-auto mt-16 p-8 rounded-2xl bg-secondary-bg shadow-xl border border-white/20 backdrop-blur-sm'>
        <h2 className='text-2xl font-bold text-center mb-8 tracking-wide text-text'>Login</h2>
        <form onSubmit={handleSubmit(onLoginSubmit)}>
          <Input name='email' label='Email' />
          <Input name='password' label='Password' type='password' />
          {error && (
            <div className='text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-4 mb-5 text-center text-sm'>
              {error}
            </div>
          )}
          <button
            type='submit'
            className='w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none rounded-lg font-semibold text-lg tracking-wide cursor-pointer shadow-md transition hover:from-blue-700 hover:to-blue-900'
          >
            Login
          </button>
          <p className='mt-6 text-center text-sm text-text-light'>
            Don't have an account?&nbsp;
            <Link to='/signup' className='text-blue-500 hover:underline'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </FormProvider>
  );
};

export default Login;