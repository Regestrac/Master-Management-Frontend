import clsx from 'clsx';

type ProgressBarPropsType = {
  progress: number; // Progress percentage (0-100)
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
  darkMode?: boolean;
};

const ProgressBar = ({
  progress,
  size = 'sm',
  showPercentage = false,
  className = '',
  darkMode = false,
}: ProgressBarPropsType) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) {
      return 'bg-green-500';
    }
    if (progress >= 60) {
      return 'bg-blue-500';
    }
    if (progress >= 40) {
      return 'bg-yellow-500';
    }
    if (progress >= 20) {
      return 'bg-orange-500';
    }
    return 'bg-red-500';
  };

  return (
    <div className={clsx('flex items-center space-x-2', className)}>
      <div
        className={clsx(
          'flex-1 rounded-full overflow-hidden',
          sizeClasses[size],
          darkMode ? 'bg-gray-700' : 'bg-gray-200',
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300 ease-out',
            getProgressColor(normalizedProgress),
          )}
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <span
          className={clsx(
            'text-xs font-medium min-w-[2.5rem] text-right',
            darkMode ? 'text-gray-300' : 'text-gray-600',
          )}
        >
          {Math.round(normalizedProgress)}
          %
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
