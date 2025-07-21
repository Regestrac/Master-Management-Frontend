import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useProfileStore } from 'stores/profileStore';

import { isHexColor } from 'src/helpers/utils';

type DropdownOption<T> = {
  label: string;
  value: T;
  /**
   * Color for the option.
   * If provided, it will display a colored dot next to the label.
   * Should be a valid hex code or tailwind class (should start with bg-).
   *
   * @example
   * '#ff0000' or 'bg-red-500' or 'bg-primary'
   */
  color?: string; // Optional for color dot
  /**
   * Icon for the option.
   * If provided, it will display an icon next to the label.
   * Should be a valid React node (e.g., an SVG or icon component).
   */
  icon?: React.ReactNode; // Optional for icon
  /**
   * Background color for the option.
   * If provided, it will override the default hover and selected background colors.
   * Should be a valid hex code or tailwind class (should start with bg-).
   *
   * @example
   * '#ff0000' or 'bg-red-500' or 'bg-primary'
   */
  bgColor?: string;
  disabled?: boolean;
};

type DropdownSelectorWrapperProps<T> = {
  options: DropdownOption<T>[];
  value: T;
  onSelect: (_value: T | null) => void;
  children: React.ReactNode;
  hideClear?: boolean;
};

function Dropdown<T>({
  options,
  value,
  onSelect,
  children,
  hideClear,
}: DropdownSelectorWrapperProps<T>) {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useLayoutEffect(() => {
    if (open && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // If dropdown is wider than viewport, stick to left
      if (dropdownRect.width > viewportWidth) {
        dropdownRef.current.style.left = '0px';
        dropdownRef.current.style.right = 'auto';
        return;
      }

      // If overflows right, align left
      if (dropdownRect.right > viewportWidth) {
        dropdownRef.current.style.left = 'auto';
        dropdownRef.current.style.right = '0px';
        return;
      }

      // If overflows left, align right and stick to left
      if (dropdownRect.left < 0) {
        dropdownRef.current.style.left = '0px';
        dropdownRef.current.style.right = 'auto';
        return;
      }

      // Reset inline styles if not overflowing
      dropdownRef.current.style.left = 'auto';
      dropdownRef.current.style.right = 'auto';
    }
  }, [open]);

  return (
    <div className='relative inline-block text-left' ref={wrapperRef}>
      <div onClick={handleChildrenClick} className='cursor-pointer'>
        {children}
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className={`
            absolute z-50 mt-2 w-max origin-top-right rounded-md
            ${darkMode ? 'bg-neutral-900 ring-1 ring-neutral-600 ring-opacity-5' : 'bg-neutral-50 ring-1 ring-neutral-300 ring-opacity-5'}
            shadow-lg focus:outline-none`
          }
        >
          <ul className='py-1 text-sm text-gray-700'>
            {options.map((option) => {
              return (
                <li
                  key={String(option.value)}
                  onClick={(e) => {
                    if (option.disabled) { return; }
                    e.stopPropagation();
                    onSelect(option.value);
                    setOpen(false);
                  }}
                  className={`
                    flex items-center gap-2 p-2 cursor-pointer mx-2 my-1 rounded-md
                    ${option.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                    ${value === option.value ? (darkMode ? 'bg-primary-900' : 'bg-neutral-100') : ''}
                    ${!option.disabled && !option.bgColor ? (darkMode ? 'hover:bg-primary-900' : 'hover:bg-neutral-100') : ''}
                    ${option.bgColor && !isHexColor(option.bgColor) ? `${option.bgColor} hover:opacity-80` : ''}
                    group
                  `}
                  aria-disabled={option.disabled}
                  style={option.bgColor && isHexColor(option.bgColor) ? { backgroundColor: option.bgColor, position: 'relative', overflow: 'hidden' } : undefined}
                >
                  {option.color && (
                    <span className={`w-2.5 h-2.5 rounded-full mr-2 ${!isHexColor(option.color) ? option.color : ''}`} style={isHexColor(option.color) ? { backgroundColor: option.color } : undefined} />
                  )}
                  {option.icon && <span className='text-sm mr-2'>{option.icon}</span>}
                  <span className={darkMode ? 'text-neutral-50' : 'text-neutral-900'}>{option.label}</span>
                </li>
              );
            })}

            {!hideClear && (
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 p-2 mx-2 my-1 rounded-md text-red-500 ${darkMode ? 'bg-red-800/30 hover:bg-red-800/40' : 'bg-red-50 hover:bg-red-100'} cursor-pointer`}
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

export default Dropdown;