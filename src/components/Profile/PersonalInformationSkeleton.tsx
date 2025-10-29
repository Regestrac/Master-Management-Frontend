import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

import Skeleton from 'components/Shared/Skeleton';

const PersonalInformationSkeleton = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={clsx('border rounded-xl p-6 shadow-sm', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
      <div className='mb-6'>
        <Skeleton height={28} width={200} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* First Name */}
        <div className='space-y-2'>
          <Skeleton height={16} width={80} />
          <Skeleton height={40} width='100%' radius={8} />
        </div>

        {/* Last Name */}
        <div className='space-y-2'>
          <Skeleton height={16} width={80} />
          <Skeleton height={40} width='100%' radius={8} />
        </div>

        {/* Email Address */}
        <div className='space-y-2'>
          <Skeleton height={16} width={100} />
          <Skeleton height={40} width='100%' radius={8} />
        </div>

        {/* Job Title */}
        <div className='space-y-2'>
          <Skeleton height={16} width={70} />
          <Skeleton height={40} width='100%' radius={8} />
        </div>

        {/* Company */}
        <div className='space-y-2'>
          <Skeleton height={16} width={70} />
          <Skeleton height={40} width='100%' radius={8} />
        </div>

        {/* Time Zone */}
        <div className='space-y-2'>
          <Skeleton height={16} width={80} />
          <Skeleton height={40} width='100%' radius={8} />
        </div>

        {/* Language */}
        <div className='space-y-2'>
          <Skeleton height={16} width={70} />
          <Skeleton height={40} width='100%' radius={8} />
        </div>
      </div>

      {/* Bio */}
      <div className='mt-6 space-y-2'>
        <Skeleton height={16} width={40} />
        <Skeleton height={80} width='100%' radius={8} />
      </div>
    </div>
  );
};

export default PersonalInformationSkeleton;
