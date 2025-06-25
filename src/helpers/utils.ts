/**
 * Capitalizes the first character of a string and converts the rest to lowercase.
 *
 * @param {string | null | undefined} word - The input string to capitalize.
 * @returns {string} The capitalized string. Returns an empty string for null, undefined, or empty input.
 *
 * @example
 * capitalize('hello');       // "Hello"
 * capitalize('wORLD');       // "World"
 * capitalize('javaScript');  // "Javascript"
 * capitalize(null);          // ""
 * capitalize('');            // ""
 */
export const capitalize = (word: string): string => {
  if (!word) { return ''; }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

/**
 * Converts a time duration from seconds into a formatted string.
 *
 * - If the duration is less than 24 hours: "HH:MM:SS"
 * - If the duration is 24 hours or more: "X day(s) HH:MM:SS"
 *
 * @param {number} totalSeconds - The total duration in seconds. Must be non-negative.
 * @returns {string} A formatted time string.
 *
 * @example
 * formatDuration(3661);    // "01:01:01"
 * formatDuration(86400);   // "1 day 00:00:00"
 * formatDuration(90061);   // "1 day 01:01:01"
 */
export function formatDuration(totalSeconds: number) {
  if (totalSeconds < 0) { return 'Invalid time'; }

  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  const pad = (num: number) => String(num).padStart(2, '0');

  const time = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ${time}`;
  } else {
    return time;
  }
}

/**
 * Formats a given time duration in seconds into a human-readable string.
 *
 * The function returns a string representing the largest appropriate time unit:
 * - "Not started" if seconds is 0
 * - "Less than 1 min" if less than 60 seconds
 * - "X min(s)" if less than 60 minutes
 * - "X hour(s)" if less than 24 hours
 * - "X day(s)" if less than 7 days
 * - "X week(s)" if less than 4 weeks
 * - "X month(s)" if less than 12 months
 * - "X year(s)" otherwise
 *
 * @param seconds - The elapsed time in seconds.
 * @returns A human-readable string representing the elapsed time.
 */
export const formatTimeElapsed = (seconds: number) => {
  if (seconds === 0) {
    return 'Not started';
  }

  if (seconds < 60) {
    return 'Less than 1 min';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }

  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? 'year' : 'years'}`;
};

/**
 * Creates a debounced function that delays invoking `func` until after
 * `wait` milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} - The new debounced function.
 */
export function debounce<T extends (..._args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
