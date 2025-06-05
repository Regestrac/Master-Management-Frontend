import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // TODO: Replace with real authentication logic
    alert(`Logging in as ${email}`);
  };

  return (
    <div className='max-w-md mx-auto mt-16 p-8 rounded-2xl bg-secondary-bg shadow-xl border border-white/20 backdrop-blur-sm'>
      <h2 className='text-2xl font-bold text-center mb-8 tracking-wide text-text'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <label
            htmlFor='email'
            className='block mb-2 font-medium text-text-light tracking-wide'
          >
            Email
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-3 rounded-lg border border-gray-300 text-base outline-none transition focus:border-blue-500 bg-primary-bg'
            required
          />
        </div>
        <div className='mb-6'>
          <label
            htmlFor='password'
            className='block mb-2 font-medium text-text-light tracking-wide'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-3 rounded-lg border border-gray-300 text-base outline-none transition focus:border-blue-500 bg-primary-bg'
            required
          />
        </div>
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
      </form>
    </div>
  );
};

export default Login;