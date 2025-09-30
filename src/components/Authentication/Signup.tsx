import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { ArrowRight, Check, Lock, Mail, Target, User, X } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';

import { signup } from 'services/auth';
import { getProfile } from 'services/profile';

import Input from 'components/Shared/Input';

type SignupFormDataType = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  agreeToTerms: boolean;
  marketingConsent: boolean;
};

const schema = z.object({
  first_name: z.string().nonempty('First Name is required!'),
  last_name: z.string().nonempty('Last Name is required!'),
  email: z.string().nonempty('Email is required!').email('Invalid email address!'),
  password: z.string().nonempty('Password is required!').min(6, 'Password must be at least 6 characters!'),
  confirm_password: z.string().nonempty('Password is required!').min(6, 'Password must be at least 6 characters!'),
  agreeToTerms: z.boolean().refine((value) => value === true, { message: 'You must agree to the Terms of Service and Privacy Policy' }),
  marketingConsent: z.boolean(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

const getPasswordStrength = (password: string) => {
  if (!password) { return { score: 0, text: '', color: 'gray', checks: {} }; }

  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  score = Object.values(checks).filter(Boolean).length;

  const strength: Record<number, { text: string; color: string; }> = {
    0: { text: 'Very Weak', color: 'red' },
    1: { text: 'Weak', color: 'red' },
    2: { text: 'Fair', color: 'yellow' },
    3: { text: 'Good', color: 'yellow' },
    4: { text: 'Strong', color: 'green' },
    5: { text: 'Very Strong', color: 'green' },
  };

  return { score, ...strength[score], checks };
};

const Signup: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useProfileStore((state) => state.updateProfile);
  const updateLoading = useProfileStore((state) => state.updateLoading);

  const navigate = useNavigate();

  const methods = useForm<SignupFormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      agreeToTerms: false,
      marketingConsent: false,
    },
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors: { agreeToTerms: agreeToTermsError } },
    watch,
  } = methods;

  const onSignUpSubmit = (formData: SignupFormDataType) => {
    setError(null);
    setIsLoading(true);
    signup(formData).then(() => {
      navigate('/dashboard', { replace: true });
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
      setError(err?.error || 'Failed to signup!');
      setIsLoading(false);
    });
  };

  const passwordStrength = getPasswordStrength(getValues('password'));

  return (
    <FormProvider {...methods}>
      <div className='relative w-full max-w-lg'>
        {/* Signup Card */}
        <div className='bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='flex items-center justify-center space-x-3 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
                <Target className='w-7 h-7 text-white' />
              </div>
              <h1 className='text-2xl font-bold text-gray-900'>TaskFlow Pro</h1>
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Create your account</h2>
            <p className='text-gray-600'>Join thousands of productive professionals</p>
          </div>

          {/* Social Signup */}
          {/* <div className='space-y-3 mb-6'>
              <button
                onClick={() => handleSocialSignup('google')}
                className='w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200'
              >
                <Chrome className='w-5 h-5 text-gray-600' />
                <span className='text-gray-700 font-medium'>Continue with Google</span>
              </button>
              <div className='grid grid-cols-2 gap-3'>
                <button
                  onClick={() => handleSocialSignup('github')}
                  className='flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200'
                >
                  <Github className='w-5 h-5 text-gray-600' />
                  <span className='text-gray-700 font-medium'>GitHub</span>
                </button>
                <button
                  onClick={() => handleSocialSignup('apple')}
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
                <span className='px-2 bg-white text-gray-500'>Or create account with email</span>
              </div>
            </div> */}

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSignUpSubmit)} className='space-y-6'>
            {error && (
              <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-600 text-sm'>{error}</p>
              </div>
            )}

            <div className='grid grid-cols-2 gap-4 mb-0'>
              <Input name='first_name' label='First Name' icon={<User className='h-5 w-5 text-gray-400' />} />
              <Input name='last_name' label='Last Name' />
            </div>

            <Input name='email' label='Email' icon={<Mail className='h-5 w-5 text-gray-400' />} />

            <div>
              <Input name='password' label='Password' type='password' icon={<Lock className='h-5 w-5 text-gray-400' />} />

              {/* Password Strength Indicator */}
              {watch('password') && (
                <div className='mt-2'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <div className='flex-1 bg-gray-200 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color === 'red' ? 'bg-red-500' :
                          passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                            'bg-green-500'}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${passwordStrength.color === 'red' ? 'text-red-600' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                        'text-green-600'}`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className='grid grid-cols-2 gap-2 text-xs'>
                    {Object.entries(passwordStrength.checks || {}).map(([key, met]) => (
                      <div key={key} className={`flex items-center space-x-1 ${met ? 'text-green-600' : 'text-gray-400'}`}>
                        {met ? <Check className='w-3 h-3' /> : <X className='w-3 h-3' />}
                        <span>
                          {key === 'length' ? '8+ characters' :
                            key === 'lowercase' ? 'Lowercase' :
                              key === 'uppercase' ? 'Uppercase' :
                                key === 'number' ? 'Number' :
                                  'Special char'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <Input name='confirm_password' label='Confirm password' type='password' icon={<Lock className='h-5 w-5 text-gray-400' />} />
              {watch('confirm_password') && getValues('password') === getValues('confirm_password') && (
                <p className='text-sm text-green-600 flex items-center'>
                  <Check className='w-4 h-4 mr-1' />
                  Passwords match
                </p>
              )}
            </div>

            {/* Terms and Marketing */}
            <div className='space-y-4'>
              <label className='flex items-start'>
                <input
                  type='checkbox'
                  checked={watch('agreeToTerms')}
                  onChange={(e) => setValue('agreeToTerms', e.target.checked)}
                  className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1'
                />
                <span className='ml-3 text-sm text-gray-600'>
                  I agree to the
                  {' '}
                  <a href='#' className='text-purple-600 hover:text-purple-500 font-medium'>
                    Terms of Service
                  </a>
                  {' '}
                  and
                  {' '}
                  <a href='#' className='text-purple-600 hover:text-purple-500 font-medium'>
                    Privacy Policy
                  </a>
                </span>
              </label>
              {agreeToTermsError ? (
                <p className='text-sm text-red-600'>{agreeToTermsError?.message}</p>
              ) : null}

              <label className='flex items-start'>
                <input
                  type='checkbox'
                  checked={watch('marketingConsent')}
                  onChange={(e) => setValue('marketingConsent', e.target.checked)}
                  className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1'
                />
                <span className='ml-3 text-sm text-gray-600'>
                  I'd like to receive productivity tips and product updates via email
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                <>
                  <span className='font-medium'>Create account</span>
                  <ArrowRight className='w-5 h-5' />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className='mt-8 text-center'>
            <p className='text-gray-600'>
              Already have an account?
              {' '}
              <Link to='/auth/login' className='text-purple-600 hover:text-purple-500 font-medium'>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default Signup;