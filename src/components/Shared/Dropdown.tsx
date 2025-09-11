import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { X } from 'lucide-react';

import { isHexColor } from 'helpers/utils';

import { useProfileStore } from 'stores/profileStore';

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

type DropdownSelectorWrapperProps<T, U extends boolean> = {
  options: DropdownOption<T>[];
  value: U extends true ? T[] | [] : (T | undefined);
  onSelect: (_value: (U extends true ? T[] : T) | null) => void;
  children: React.ReactNode;
  hideClear?: boolean;
  isMulti?: U;
};

function Dropdown<T, U extends boolean>({
  options,
  value,
  onSelect,
  children,
  hideClear,
  isMulti,
}: DropdownSelectorWrapperProps<T, U>) {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  const isSelected = (optionValue: T): boolean => {
    if (isMulti) {
      return Array.isArray(value) && (value as T[]).includes(optionValue);
    }
    return (value as T) === optionValue;
  };

  const handleOptionSelect = (optionValue: T) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? (value as T[]) : [];
      if (currentValues.includes(optionValue)) {
        // Remove from selection
        const newValues = currentValues.filter((v) => v !== optionValue);
        onSelect(newValues as (U extends true ? T[] : T) | null);
      } else {
        // Add to selection
        onSelect([...currentValues, optionValue] as (U extends true ? T[] : T) | null);
      }
    } else {
      onSelect(optionValue as (U extends true ? T[] : T) | null);
      setOpen(false);
    }
  };

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
    if (open && dropdownRef.current && wrapperRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Position dropdown below the trigger element
      let top = wrapperRect.bottom + 8;
      let left = wrapperRect.left;

      // If dropdown would overflow right edge, align to right
      if (left + dropdownRect.width > viewportWidth) {
        left = wrapperRect.right - dropdownRect.width;
      }

      // If dropdown would overflow left edge, align to left
      if (left < 0) {
        left = 8;
      }

      // If dropdown would overflow bottom, position above
      if (top + dropdownRect.height > viewportHeight) {
        top = wrapperRect.top - dropdownRect.height - 8;
      }

      // Apply positioning
      dropdownRef.current.style.top = `${top}px`;
      dropdownRef.current.style.left = `${left}px`;
      dropdownRef.current.style.right = 'auto';
    }
  }, [open]);

  return (
    <div className='relative inline-block text-left' ref={wrapperRef}>
      <div onClick={handleChildrenClick} className='cursor-pointer flex items-center'>
        {children}
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className={`
            fixed z-[9999] w-max rounded-md
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
                    handleOptionSelect(option.value);
                  }}
                  className={`
                    flex items-center gap-2 p-2 cursor-pointer mx-2 my-1 rounded-md relative
                    ${option.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                    ${isSelected(option.value) ? (darkMode ? 'bg-primary-900' : 'bg-neutral-100') : ''}
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
                  {option.icon && (
                    <span className='text-sm'>{option.icon}</span>
                  )}
                  <span className={`flex-1 ${darkMode ? 'text-neutral-50' : 'text-neutral-900'}`}>{option.label}</span>
                  {isMulti && isSelected(option.value) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionSelect(option.value);
                      }}
                      className={`ml-2 p-1 rounded-full ${darkMode ? 'hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200' : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700'} transition-colors`}
                    >
                      <X size={12} />
                    </button>
                  )}
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