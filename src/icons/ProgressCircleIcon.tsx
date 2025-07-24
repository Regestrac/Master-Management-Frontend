import { SVGProps } from 'react';

import { useProfileStore } from 'stores/profileStore';

const ProgressCircleIcon = ({ progress, ...props }: { progress: number } & SVGProps<SVGSVGElement>) => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <svg className='w-24 h-24 transform -rotate-90' viewBox='0 0 100 100' {...props}>
      <circle
        cx='50'
        cy='50'
        r='40'
        stroke={darkMode ? '#374151' : '#E5E7EB'}
        strokeWidth='8'
        fill='none'
      />
      <circle
        cx='50'
        cy='50'
        r='40'
        stroke='url(#gradient)'
        strokeWidth='8'
        fill='none'
        strokeLinecap='round'
        strokeDasharray={`${2 * Math.PI * 40}`}
        strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
        className='transition-all duration-500'
      />
      <defs>
        <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop offset='0%' stopColor='#A855F7' />
          <stop offset='100%' stopColor='#EC4899' />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ProgressCircleIcon;