import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { validate } from 'src/services/auth';

const ValidateUser = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    validate().then(() => setIsAuthenticated(true)).catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated !== null) {
      if (isAuthenticated && (pathname.includes('login') || pathname.includes('signup'))) {
        navigate('/', { replace: true });
      } else if (!isAuthenticated && (!pathname.includes('login') && !pathname.includes('signup'))) {
        navigate('/login', { replace: true });
      }
    }
    return () => {
      setIsAuthenticated(null);
    };
  }, [isAuthenticated, navigate, pathname]);

  return null;
};

export default ValidateUser;