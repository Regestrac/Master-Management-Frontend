import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useProfileStore } from 'stores/profileStore';

import Input from 'components/shared/Input';

import { signup } from 'src/services/auth';
import { getProfile } from 'src/services/profile';

type SignupFormDataType = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

const schema = z.object({
  first_name: z.string().nonempty('First Name is required!'),
  last_name: z.string().nonempty('Last Name is required!'),
  email: z.string().nonempty('Email is required!').email('Invalid email address!'),
  password: z.string().nonempty('Password is required!').min(6, 'Password must be at least 6 characters!'),
});

const Signup: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useProfileStore((state) => state.updateProfile);

  const navigate = useNavigate();

  const methods = useForm<SignupFormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = methods;

  const onSignUpSubmit = (formData: SignupFormDataType) => {
    setError(null);
    signup(formData).then(() => {
      navigate('/', { replace: true });
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
      setError(err?.message || 'Failed to signup!');
    });
  };

  return (
    <FormProvider {...methods}>
      <div className='max-w-md mx-auto mt-8 p-8 border border-gray-200 rounded-lg shadow bg-secondary-bg'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Sign Up</h2>
        <form onSubmit={handleSubmit(onSignUpSubmit)}>
          <Input name='first_name' label='First Name' />
          <Input name='last_name' label='Last Name' />
          <Input name='email' label='Email' />
          <Input name='password' label='Password' type='password' />
          {error && (
            <div className='text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-4 mb-5 text-center text-sm'>
              {error}
            </div>
          )}
          <button
            type='submit'
            className='w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition'
          >
            Sign Up
          </button>
          <p className='mt-4 text-center text-sm text-text-light'>
            Already have an account?&nbsp;
            <Link to='/login' className='text-blue-500 hover:underline'>Login</Link>
          </p>
        </form>
      </div>
    </FormProvider>
  );
};

export default Signup;