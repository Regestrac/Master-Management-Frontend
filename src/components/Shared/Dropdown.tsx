import { useEffect, useRef, useState } from 'react';

import { useProfileStore } from 'stores/profileStore';

type DropdownOption<T> = {
  label: string;
  value: T;
  color?: string; // Optional for color dot
};

type DropdownSelectorWrapperProps<T> = {
  options: DropdownOption<T>[];
  value: T;
  onSelect: (_value: T | null) => void;
  children: React.ReactNode;
  hideClear?: boolean;
};

function DropDown<T>({
  options,
  value,
  onSelect,
  children,
  hideClear,
}: DropdownSelectorWrapperProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  // const selected = options.find((opt) => opt.value === value);

  const handleChildrenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative inline-block text-left' ref={wrapperRef}>
      <div onClick={handleChildrenClick} className='cursor-pointer'>
        {children}
      </div>

      {open && (
        <div className={`absolute z-50 mt-2 w-40 origin-top-right rounded-md ${darkMode ? 'bg-neutral-900 ring-1 ring-neutral-600 ring-opacity-5' : 'bg-neutral-50 ring-1 ring-neutral-300 ring-opacity-5'} shadow-lg focus:outline-none`}>
          <ul className='py-1 text-sm text-gray-700'>
            {options.map((option) => (
              <li
                key={String(option.value)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(option.value);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'hover:bg-primary-900' : 'hover:bg-neutral-100'} cursor-pointer ${value === option.value ? `${darkMode ? 'bg-primary-900' : 'bg-neutral-100'}` : ''}`}
              >
                {option.color && (
                  <span className='w-2.5 h-2.5 rounded-full' style={{ backgroundColor: option.color }} />
                )}
                <span className={darkMode ? 'text-neutral-50' : 'text-neutral-900'}>{option.label}</span>
              </li>
            ))}

            {!hideClear && (
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-red-500 ${darkMode ? 'hover:bg-primary-900' : 'hover:bg-neutral-100'} cursor-pointer`}
              >
                <span>Clear</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropDown;