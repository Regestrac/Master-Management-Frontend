import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

interface CustomNavigationEventType extends Event {
  details: {
    url: string;
    replace?: boolean;
  }
};

// To handle navigation to other routes without reloading while triggering from a non react file
const useCustomNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCustomNavigation = (event: Event) => {
      const customEvent = event as CustomNavigationEventType;
      const { url, replace } = customEvent.details;

      navigate(url, { replace });
    };

    window.addEventListener('custom-navigation', handleCustomNavigation);

    return () => {
      window.removeEventListener('custom-navigation', handleCustomNavigation);
    };
  }, [navigate]);
};

export default useCustomNavigation;