type GetHandlerParamsType = {
  path: string;
};

type PostHandlerParamsType = {
  path: string
} & RequestInit;

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

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

  // if (response.status === 404) {
  //   return notFound();
  // }

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