import { memo, useState } from 'react';

import clsx from 'clsx';

import { Member } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

type MemberAvatarProps = {
  member: Member;
  size: 'sm' | 'md' | 'lg';
  className?: string;
  color: 'rose' | 'orange' | 'amber' | 'lime' | 'emerald' | 'sky' | 'violet' | 'pink';
};

const getInitials = (fullName: string) => {
  const parts = fullName?.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const colorClassesMap: Record<string, Record<'bg' | 'ring' | 'darkRing', string>> = {
  rose: { bg: 'bg-rose-500', ring: 'ring-rose-300', darkRing: 'ring-rose-900/40' },
  orange: { bg: 'bg-orange-500', ring: 'ring-orange-300', darkRing: 'ring-orange-900/40' },
  amber: { bg: 'bg-amber-500', ring: 'ring-amber-300', darkRing: 'ring-amber-900/40' },
  lime: { bg: 'bg-lime-500', ring: 'ring-lime-300', darkRing: 'ring-lime-900/40' },
  emerald: { bg: 'bg-emerald-500', ring: 'ring-emerald-300', darkRing: 'ring-emerald-900/40' },
  sky: { bg: 'bg-sky-500', ring: 'ring-sky-300', darkRing: 'ring-sky-900/40' },
  violet: { bg: 'bg-violet-500', ring: 'ring-violet-300', darkRing: 'ring-violet-900/40' },
  pink: { bg: 'bg-pink-500', ring: 'ring-pink-300', darkRing: 'ring-pink-900/40' },
};

const sizeClasses = {
  sm: { container: 'w-7 h-7', text: 'text-[10px]' },
  md: { container: 'w-9 h-9', text: 'text-xs' },
  lg: { container: 'w-10 h-10', text: 'text-sm' },
};

export const MemberAvatar = memo(({ member, size, className = '', color }: MemberAvatarProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const darkMode = useProfileStore((s) => s.data.theme) === 'dark';
  const colorClass = colorClassesMap[color || 'rose'];
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={clsx(
        'relative group rounded-full ring flex items-center justify-center transitio',
        sizeClass.container,
        darkMode ? colorClass?.darkRing : colorClass?.ring,
        className,
      )}
      aria-label={member.name}
    >
      {showTooltip && (
        <span
          className={clsx(
            'pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition z-10 shadow-lg',
            darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-900 text-gray-200',
          )}
        >
          {member.name}
        </span>
      )}
      <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className='w-full h-full rounded-full overflow-hidden flex items-center justify-center'>
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.name}
            className={clsx(
              'w-full h-full object-cover ring-2',
              darkMode ? colorClass?.darkRing : colorClass?.ring,
            )}
          />
        ) : (
          <span
            className={clsx(
              'font-semibold text-white w-full h-full flex items-center justify-center',
              sizeClass.text, colorClass?.bg,
            )}
          >
            {getInitials(member?.name || '')}
          </span>
        )}
      </div>
    </div>
  );
});
