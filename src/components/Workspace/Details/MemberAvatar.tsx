import { memo, useState } from 'react';

import { Member } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

type MemberAvatarProps = {
  member: Member;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const getInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const colorClasses = [
  { bg: 'bg-rose-500', ring: 'ring-rose-300 dark:ring-rose-900/40' },
  { bg: 'bg-orange-500', ring: 'ring-orange-300 dark:ring-orange-900/40' },
  { bg: 'bg-amber-500', ring: 'ring-amber-300 dark:ring-amber-900/40' },
  { bg: 'bg-lime-500', ring: 'ring-lime-300 dark:ring-lime-900/40' },
  { bg: 'bg-emerald-500', ring: 'ring-emerald-300 dark:ring-emerald-900/40' },
  { bg: 'bg-sky-500', ring: 'ring-sky-300 dark:ring-sky-900/40' },
  { bg: 'bg-violet-500', ring: 'ring-violet-300 dark:ring-violet-900/40' },
  { bg: 'bg-pink-500', ring: 'ring-pink-300 dark:ring-pink-900/40' },
];

const sizeClasses = {
  sm: { container: 'w-7 h-7', text: 'text-[10px]' },
  md: { container: 'w-9 h-9', text: 'text-xs' },
  lg: { container: 'w-10 h-10', text: 'text-sm' },
};

export const MemberAvatar = memo(({ member, size = 'md', className = '' }: MemberAvatarProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const darkMode = useProfileStore((s) => s.data.theme) === 'dark';
  const color = colorClasses[member.id % colorClasses.length];
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`relative group ${sizeClass.container} rounded-full border flex items-center justify-center transition ${darkMode ? 'border-gray-600' : 'border-gray-300'} ${className}`}
      aria-label={member.name}
    >
      {showTooltip && (
        <span className='pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-xs bg-gray-900 text-gray-200 dark:bg-gray-900 dark:text-gray-200 opacity-0 group-hover:opacity-100 transition z-10 shadow-lg'>
          {member.name}
        </span>
      )}
      <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className='w-full h-full rounded-full overflow-hidden flex items-center justify-center'>
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt={member.name}
            className={`w-full h-full object-cover ring-2 ${color.ring}`}
          />
        ) : (
          <span className={`${sizeClass.text} font-semibold text-white ${color.bg} w-full h-full flex items-center justify-center`}>
            {getInitials(member.name)}
          </span>
        )}
      </div>
    </div>
  );
});
