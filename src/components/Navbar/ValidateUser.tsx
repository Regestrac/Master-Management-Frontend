import { useCallback, useEffect, useRef } from 'react';

// import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useProfileStore } from 'stores/profileStore';

import { validate } from 'services/auth';
import { getProfile } from 'services/profile';

const ValidateUser = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const updateProfile = useProfileStore((state) => state.updateProfile);

  const isValidated = useRef(false);

  // const navigate = useNavigate();

  // const { pathname } = useLocation();

  const getProfileInfo = useCallback(() => {
    getProfile().then((profile) => {
      updateProfile(profile?.data);
    }).catch((err) => {
      toast.error(err?.error || 'Failed to fetch profile. Please try again.');
    });
  }, [updateProfile]);

  useEffect(() => {
    if (!isValidated.current) {
      validate().then(() => {
        getProfileInfo();
        // setIsAuthenticated(true);
      }).catch(() => null);
      isValidated.current = true;
    }
  }, [getProfileInfo]);

  // useEffect(() => {
  //   if (isAuthenticated !== null) {
  //     if (isAuthenticated && (pathname.includes('login') || pathname.includes('signup'))) {
  //       navigate('/', { replace: true });
  //     } else if (!isAuthenticated && (!pathname.includes('login') && !pathname.includes('signup'))) {
  //       navigate('/login', { replace: true });
  //     }
  //   }
  //   return () => {
  //     setIsAuthenticated(null);
  //   };
  // }, [isAuthenticated, navigate, pathname]);

  return null;
};

export default ValidateUser;