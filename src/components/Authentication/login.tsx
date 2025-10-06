import React, { useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Lock, Mail } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';

import { login } from 'services/auth';
import { getProfile } from 'services/profile';

import Input from 'components/Shared/Input';

type LoginType = {
  email: string;
  password: string;
  remember_me: boolean;
};

const schema = z.object({
  email: z.string().nonempty('Email is required!').email('Invalid email address!'),
  password: z.string().nonempty('Password is required!').min(6, 'Password must be at least 6 characters!'),
  remember_me: z.boolean(),
});

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useProfileStore((state) => state.updateProfile);
  const updateLoading = useProfileStore((state) => state.updateLoading);

  const navigate = useNavigate();

  const methods = useForm<LoginType>({
    defaultValues: { email: '', password: '', remember_me: false },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, setValue, getValues } = methods;

  const onLoginSubmit = (formData: LoginType) => {
    setError(null); // Reset error state before login attempt
    setIsLoading(true);
    login(formData).then((res) => {
      navigate('/dashboard', { replace: true });
      toast.success(res?.message || 'Login successful! Welcome!');
      updateLoading(true);
      getProfile().then((profile) => {
        updateProfile(profile?.data);
        updateLoading(false);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch profile. Please try again.');
        setIsLoading(false);
        updateLoading(false);
      });
    }).catch((err) => {
      setError(err.error || 'Login failed. Please try again.');
      setIsLoading(false);
    });
  };

  return (
    <FormProvider {...methods}>
      <div className='bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center space-x-3 mb-4'>
            <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
              {/* <Target className='w-7 h-7 text-white' /> */}
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>Master Management</h1>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Welcome back</h2>
          <p className='text-gray-600'>Sign in to your account to continue your productivity journey</p>
        </div>

        {/* Social Login */}
        {/* <div className='space-y-3 mb-6'>
          <button
            onClick={() => handleSocialLogin('google')}
            className='w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200'
          >
            <Chrome className='w-5 h-5 text-gray-600' />
            <span className='text-gray-700 font-medium'>Continue with Google</span>
          </button>
          <div className='grid grid-cols-2 gap-3'>
            <button
              onClick={() => handleSocialLogin('github')}
              className='flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200'
            >
              <Github className='w-5 h-5 text-gray-600' />
              <span className='text-gray-700 font-medium'>GitHub</span>
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              className='flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200'
            >
              <Apple className='w-5 h-5 text-gray-600' />
              <span className='text-gray-700 font-medium'>Apple</span>
            </button>
          </div>
        </div> */}

        {/* Divider */}
        {/* <div className='relative mb-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>Or continue with email</span>
          </div>
        </div> */}

        <div className='relative w-full max-w-md'>
          {/* Login Form */}
          <form onSubmit={handleSubmit(onLoginSubmit)} className='space-y-6'>
            {error && (
              <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-600 text-sm'>{error}</p>
              </div>
            )}
            <Input
              name='email'
              label='Email'
              placeholder='Enter your email'
              icon={<Mail className='h-5 w-5 text-gray-400' />}
            />
            <Input
              name='password'
              label='Password'
              type='password'
              placeholder='Enter your password'
              icon={<Lock className='h-5 w-5 text-gray-400' />}
            />
            <div className='flex items-center justify-between'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={getValues('remember_me')}
                  onChange={(e) => setValue('remember_me', e.target.checked)}
                  className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
                />
                <span className='ml-2 text-sm text-gray-600'>Remember me</span>
              </label>
              <button
                type='button'
                className='text-sm text-purple-600 hover:text-purple-500 font-medium'
              >
                Forgot password?
              </button>
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                <>
                  <span className='font-medium'>Sign in</span>
                  <ArrowRight className='w-5 h-5' />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-500'>
              By signing in, you agree to our
              {' '}
              <Link to='/legal/terms' className='text-purple-600 hover:text-purple-500'>
                Terms of Service
              </Link>
              {' '}
              and
              {' '}
              <Link to='/legal/privacy' className='text-purple-600 hover:text-purple-500'>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className='mt-8 text-center'>
          <p className='text-gray-600'>
            Don't have an account yet?
            {' '}
            <Link to='/auth/signup' className='text-purple-600 hover:text-purple-500 font-medium'>
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </FormProvider>
  );
};

export default Login;