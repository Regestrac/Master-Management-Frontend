import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { signup } from 'src/services/auth';

interface SignupFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [form, setForm] = useState<SignupFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signup(form).then(() => {
      navigate('/', { replace: true });
    }).catch((err) => {
      console.log('err?.message: ', err?.message);
    });
  };

  return (
    <div className='max-w-md mx-auto mt-8 p-8 border border-gray-200 rounded-lg shadow bg-secondary-bg'>
      <h2 className='text-2xl font-semibold mb-6 text-center'>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-1 font-medium'>
            First Name
            <input
              type='text'
              name='first_name'
              value={form.first_name}
              onChange={handleChange}
              required
              className='mt-2 w-full px-3 py-2 border border-gray-300 rounded bg-primary-bg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block mb-1 font-medium'>
            Last Name
            <input
              type='text'
              name='last_name'
              value={form.last_name}
              onChange={handleChange}
              required
              className='mt-2 w-full px-3 py-2 border border-gray-300 bg-primary-bg rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block mb-1 font-medium'>
            Email
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              required
              className='mt-2 w-full px-3 py-2 border border-gray-300 bg-primary-bg rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </label>
        </div>
        <div className='mb-6'>
          <label className='block mb-1 font-medium'>
            Password
            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              required
              className='mt-2 w-full px-3 py-2 border border-gray-300 bg-primary-bg rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </label>
        </div>
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
  );
};

export default Signup;