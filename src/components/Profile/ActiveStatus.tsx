import { useEffect, useState } from 'react';

import { Wifi, WifiOff } from 'lucide-react';

const ActiveStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className='flex items-center justify-center space-x-2 mb-4'>
      {isOnline ? (
        <>
          <Wifi className='w-4 h-4 text-green-500' />
          <span className='text-sm text-green-500'>Online</span>
        </>
      ) : (
        <>
          <WifiOff className='w-4 h-4 text-amber-500' />
          <span className='text-sm text-amber-500'>Offline</span>
        </>
      )}
    </div>
  );
};

export default ActiveStatus;