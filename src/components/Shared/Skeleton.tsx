import React, { useEffect } from 'react';

import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

export type SkeletonVariant = 'pulse' | 'shimmer';

export type SkeletonProps = {
  height?: number | string;
  width?: number | string;
  radius?: number | string;
  className?: string;
  style?: React.CSSProperties;
  variant?: SkeletonVariant;
  durationMs?: number; // optional animation duration override
};

let skeletonStylesInjected = false;

const ensureSkeletonStyles = () => {
  if (skeletonStylesInjected) { return; }
  const style = document.createElement('style');
  style.setAttribute('data-skeleton-styles', '');
  style.innerHTML = `
  @keyframes skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  `;
  document.head.appendChild(style);
  skeletonStylesInjected = true;
};

const Skeleton: React.FC<SkeletonProps> = ({
  height = 16,
  width = '100%',
  radius = 6,
  className = '',
  style = {},
  variant = 'shimmer',
  durationMs,
}) => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  useEffect(() => {
    ensureSkeletonStyles();
  }, []);

  const inlineStyle: React.CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
    borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
    ...style,
  };

  // Resolve animation styles based on variant
  const baseClass = clsx('overflow-hidden', darkMode ? 'bg-gray-700' : 'bg-gray-200');

  if (variant === 'pulse') {
    return (
      <div
        className={clsx('animate-pulse', baseClass, className)}
        style={inlineStyle}
      />
    );
  }

  // shimmer (default alternative): animated gradient passes through
  const shimmerStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(135deg, rgba(229,231,235,0.05) 10%, rgba(243,244,246,0.4) 20%, rgba(229,231,235,0.05) 30%)',
    backgroundSize: '400% 400%',
    animation: `skeleton-shimmer ${durationMs ? durationMs : 3500}ms linear infinite` as any,
  };

  // adapt colors for dark mode via currentColor overlay trick is tricky; keep base dark bg via baseClass
  return (
    <div
      className={clsx(baseClass, className)}
      style={{ ...inlineStyle, ...shimmerStyle }}
    />
  );
};

export default Skeleton;
