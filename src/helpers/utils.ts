import { PriorityType, StatusType } from 'helpers/sharedTypes';

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

export const copyToClipboard = (text: string) => {
  try {
    navigator.clipboard.writeText(text);
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

export const getPriorityColor = (priority: PriorityType) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'normal':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusColor = (status: StatusType) => {
  switch (status) {
    case 'completed':
      return 'text-green-400 bg-green-400/10';
    case 'todo':
      return 'text-blue-400 bg-blue-400/10';
    case 'inprogress':
      return 'text-purple-600 bg-purple-600/20';
    case 'paused':
      return 'text-gray-400 bg-gray-400/10';
    case 'pending':
      return 'text-yellow-400 bg-yellow-400/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
};

export const isHexColor = (color: string): boolean => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
};

export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  return false;
};

/**
 * Converts a string to title case, inserting spaces between camelCase, PascalCase,
 * and separating words by non-alphanumeric characters.
 *
 * This function is useful for formatting identifiers or labels for display purposes.
 *
 * @param str - The input string to convert.
 * @returns The title-cased string with words separated by spaces.
 *
 * @example
 * titleCase('helloWorld'); // "Hello World"
 * titleCase('ThisIsATest'); // "This Is A Test"
 * titleCase('already title case'); // "Already Title Case"
 * titleCase('snake_case_example'); // "Snake Case Example"
 * titleCase('kebab-case-example'); // "Kebab Case Example"
 * titleCase('XMLHttpRequest'); // "Xml Http Request"
 */
export const titleCase = (str: string) => {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
    // Replace all non-alphabetic word boundaries with space
    .replace(/[^A-Za-z0-9]+/g, ' ')
    // Trim and convert to title case
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Removes one or more specified keys from an object.
 *
 * - For a single key, it uses the spread method for optimal performance.
 * - For multiple keys, it uses a more generalized approach with `Object.fromEntries` for flexibility.
 *
 * @param {T} obj - The source object to omit keys from.
 * @param {K | K[]} keys - The key or array of keys to omit.
 * @returns {Omit<T, K>} A new object without the specified keys.
 *
 * @example
 * // Single key removal
 * const user = { id: 1, name: "Alice", role: "admin" };
 * const result = omit(user, "role");
 * console.log(result); // { id: 1, name: "Alice" }
 *
 * @example
 * // Multiple keys removal
 * const data = { id: 1, name: "Alice", role: "admin", active: true };
 * const result = omit(data, ["role", "active"]);
 * console.log(result); // { id: 1, name: "Alice" }
 */
export const omit = <T extends object, K extends keyof T>(obj: T, keys: K | K[]): Omit<T, K> => {
  if (!Array.isArray(keys)) {
    // Use the spread method for single key removal
    const { [keys]: _, ...rest } = obj;
    return rest as Omit<T, K>;
  }

  // Use Object.entries for multiple keys
  const keysToOmit = new Set(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.has(key as K)),
  ) as Omit<T, K>;
};

export function parseJsonArray(jsonString: string) {
  let cleanedJsonString = jsonString.trim(); // Trim whitespace from both ends

  // Check if the string starts with '```json' and ends with '```'
  if (cleanedJsonString.startsWith('```json') && cleanedJsonString.endsWith('```')) {
    // Remove '```json' from the beginning (and the newline after it)
    cleanedJsonString = cleanedJsonString.substring('```json\n'.length);
    // Remove '```' from the end
    cleanedJsonString = cleanedJsonString.substring(0, cleanedJsonString.length - '```'.length);
    cleanedJsonString = cleanedJsonString.replace(/\n/g, '');
    cleanedJsonString = cleanedJsonString.trim(); // Trim again in case of extra newlines/spaces
  }
  try {
    const parsedData = JSON.parse(cleanedJsonString);

    // Ensure the parsed data is indeed an array
    if (!Array.isArray(parsedData)) {
      throw new Error('The provided JSON string does not represent an array.');
    }

    return parsedData;
  } catch {
    return [];
  }
}

export function parseMarkdownJson(markdownString: string) {
  const regex = /```(?:json)?\n([\s\S]*?)\n```/;
  const match = markdownString.match(regex);

  if (!match || match.length < 2) {
    throw new Error('No valid JSON block found in the input string.');
  }

  try {
    const jsonStr = match[1];
    return JSON.parse(jsonStr);
  } catch (error) {
    throw new Error('Failed to parse JSON: ' + (error as Error).message);
  }
}