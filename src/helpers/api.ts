type GetHandlerParamsType = {
  path: string;
};

type PostHandlerParamsType = {
  path: string
} & RequestInit;

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const handleNotFound = () => {
  const event = new CustomEvent('custom-navigation', {
    detail: { url: '/not-found', replace: true },
  });
  window.dispatchEvent(event);
};

const handleUnauthenticated = () => {
  const event = new CustomEvent('custom-navigation', {
    detail: { url: '/login', replace: false },
  });
  window.dispatchEvent(event);
};

export const postHandler = async ({ path, ...options }: PostHandlerParamsType) => {
  const url = `${BASE_URL}/${path}`;

  const response = await fetch(url, {
    method: options?.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    ...options,
  });

  if (response.status === 404) {
    return handleNotFound();
  }
  if (response.status === 401) {
    return handleUnauthenticated();
  }

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      responseData?.error ||
      responseData?.message ||
      responseData?.errors?.[0]?.message ||
      `Error ${response.status}: ${response.statusText}` ||
      'Something went wrong';

    throw new Error(errorMessage);
  }

  return responseData;
};

export const getHandler = async ({ path }: GetHandlerParamsType) => {
  const url = `${BASE_URL}/${path}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  if (response.status === 404) {
    return handleNotFound();
  }
  if (response.status === 401) {
    return handleUnauthenticated();
  }

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      responseData?.error ||
      responseData?.message ||
      responseData?.errors?.[0]?.message ||
      `Error ${response.status}: ${response.statusText}` ||
      'Something went wrong';
    throw new Error(errorMessage);
  }

  return responseData;
};