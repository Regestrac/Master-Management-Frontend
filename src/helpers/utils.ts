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
export function formatDuration(totalSeconds:number) {
  if (totalSeconds < 0) {return 'Invalid time';}

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
