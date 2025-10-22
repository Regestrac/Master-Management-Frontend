import React, { CSSProperties, HTMLAttributes, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

import { isHexColor } from 'src/helpers/utils';

type OutlineProps = {
  /**
   *  @param colors
   *  @type {string[]}
   *
   *  @example
   *  [
   *    '#4802D0',     // Hex codes
   *    'bg-red-500',  // tailwind class (should start with bg)
   *    'bg-primary-500'   // custom variable declared (should start with bg so var --primary-500 should be given as 'bg-primary-500')
   *  ]
   *
   */
  colors: string[];
  width?: CSSProperties['width'];
  children: React.ReactElement;
  className?: string;
  variant?: 'solid' | 'rotate' | 'push-pull';
  animationDuration?: CSSProperties['animationDuration'];
  disabled?: boolean;
};

const makeClassVar = (color: string) => {
  if (!isHexColor(color)) {
    return `var(${color.replace('bg', '--color')})`;
  }
  return color;
};

/**
 * 'key' is required for children.
 */
const Outline = ({
  colors,
  width = '1px',
  children,
  className = '',
  variant = 'solid',
  animationDuration = '2.5s',
  disabled,
}: OutlineProps) => {
  const childRef = useRef<HTMLElement>(null);
  const [borderRadius, setBorderRadius] = useState('0');

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  useEffect(() => {
    if (childRef.current) {
      const computedStyle = window.getComputedStyle(childRef.current);
      if (borderRadius === '0') {
        setBorderRadius(computedStyle.borderRadius || '0');
      }
    }
  }, [borderRadius, children]);

  if (disabled) {
    return children;
  }

  const child = React.Children.only<any>(children);

  const validColors = colors.filter((color) => isHexColor(color) || (color.startsWith('bg-') && color.split('-').length > 1)).map(makeClassVar);

  if (validColors.length === 0) {
    return <div className={className}>{children}</div>;
  }

  // Create gradient string
  const gradientColors = validColors.map((color, index) => {
    const position = (index / (validColors.length - 1)) * 100;
    return `${color} ${position}%`;
  }).join(', ');

  const gradientStyle = {
    padding: width,
    borderRadius: borderRadius,
    background: `linear-gradient(var(--gradient-angle), ${gradientColors})`,
    animationDuration,
  } as CSSProperties;

  const innerStyle = {
    borderRadius: borderRadius.includes(' ') ? borderRadius : `calc(${borderRadius} - ${width})`,
  };

  return (
    <div style={gradientStyle} className={`${variant}-outline ${className}`}>
      <div style={innerStyle} className={clsx('w-full h-full', darkMode ? 'bg-neutral-800' : 'bg-white')}>
        {React.cloneElement(child, {
          ref: childRef,
          style: {
            ...(child?.props?.style || {}),
            ...innerStyle,
            width: '100%',
            height: '100%',
          },
        } as HTMLAttributes<HTMLElement>)}
      </div>
    </div>
  );
};

export default Outline;