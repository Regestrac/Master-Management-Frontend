import { NavigateFunction } from 'react-router-dom';

/**
 * Navigation utility functions for handling URL-based navigation history
 * Replaces the prevPath state with URL parameters for persistence across reloads
 */

type NavigationHistoryType = {
  path: string;
}

/**
 * Get navigation history from URL search params
 */
export const getNavigationHistory = (searchParams: URLSearchParams): NavigationHistoryType[] => {
  const historyParam = searchParams.get('nav_history');
  if (!historyParam) {
    return [];
  }

  try {
    const decoded = decodeURIComponent(historyParam);
    return JSON.parse(decoded);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to parse navigation history:', error);
    return [];
  }
};

/**
 * Set navigation history in URL search params
 */
export const setNavigationHistory = (searchParams: URLSearchParams, history: NavigationHistoryType[]): URLSearchParams => {
  const newParams = new URLSearchParams(searchParams);

  if (history.length === 0) {
    newParams.delete('nav_history');
  } else {
    // Keep only the last 5 items to prevent URL from becoming too long
    const limitedHistory = history.slice(-5);
    const encoded = encodeURIComponent(JSON.stringify(limitedHistory));
    newParams.set('nav_history', encoded);
  }

  return newParams;
};

/**
 * Add a path to navigation history
 */
export const addToNavigationHistory = (currentPath: string, searchParams: URLSearchParams): URLSearchParams => {
  const history = getNavigationHistory(searchParams);

  // Don't add the same path consecutively
  if (history.length > 0 && history[history.length - 1].path === currentPath) {
    return searchParams;
  }

  const newHistoryItem: NavigationHistoryType = {
    path: currentPath,
  };

  const updatedHistory = [...history, newHistoryItem];
  return setNavigationHistory(searchParams, updatedHistory);
};

/**
 * Get the previous path from navigation history without navigating
 */
export const getPreviousPath = (
  searchParams: URLSearchParams,
  fallbackPath: string = '/dashboard',
): string => {
  const history = getNavigationHistory(searchParams);

  if (history.length === 0) {
    return fallbackPath;
  }

  return history[history.length - 1].path;
};

/**
 * Clear navigation history
 */
export const clearNavigationHistory = (searchParams: URLSearchParams): URLSearchParams => {
  const newParams = new URLSearchParams(searchParams);
  newParams.delete('nav_history');
  return newParams;
};

/**
 * Hook-like function to get current navigation state
 */
export const useNavigationState = (searchParams: URLSearchParams) => {
  const history = getNavigationHistory(searchParams);
  const previousPath = getPreviousPath(searchParams);
  const canGoBack = history.length > 0;

  return {
    history,
    previousPath,
    canGoBack,
    historyLength: history.length,
  };
};

/**
 * Navigate to a path while preserving navigation history
 */
export const navigateWithHistory = (
  navigate: NavigateFunction,
  targetPath: string,
  currentPath: string,
  currentSearchParams?: URLSearchParams,
) => {
  const searchParams = currentSearchParams || new URLSearchParams();
  const updatedParams = addToNavigationHistory(currentPath, searchParams);

  // Navigate to target path with updated history
  const targetUrl = updatedParams.toString()
    ? `${targetPath}?${updatedParams.toString()}`
    : targetPath;

  navigate(targetUrl);
};

/**
 * Navigate back using navigation history
 */
export const navigateBack = (
  navigate: NavigateFunction,
  searchParams: URLSearchParams,
  fallbackPath: string = '/dashboard',
) => {
  const history = getNavigationHistory(searchParams);

  if (history.length === 0) {
    // No history, go to fallback
    navigate(fallbackPath);
    return;
  }

  // Get the previous path (last item in history)
  const previousPath = history[history.length - 1].path;

  // Remove the last item from history for the back navigation
  const updatedHistory = history.slice(0, -1);
  const updatedParams = setNavigationHistory(new URLSearchParams(), updatedHistory);

  // Navigate back with updated history
  const backUrl = updatedParams.toString()
    ? `${previousPath}?${updatedParams.toString()}`
    : previousPath;

  navigate(backUrl);
};
