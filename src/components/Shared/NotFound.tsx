import React from 'react';

import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center text-center'>
      <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
      <p className='mb-6 text-lg text-text-light'>The page you are looking for does not exist.</p>
      <button
        onClick={handleGoHome}
        className='mt-2 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors'
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
