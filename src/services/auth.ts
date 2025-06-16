import { getHandler, postHandler } from 'services/api';

// Define types for login and signup payloads and responses
type LoginPayload = {
  email: string;
  password: string;
}

type SignupPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Login request
export const login = (payload: LoginPayload) => postHandler({
  path: 'login',
  body: JSON.stringify(payload),
});

// Signup request
export const signup = (payload: SignupPayload) => postHandler({
  path: 'signup',
  body: JSON.stringify(payload),
});

// Validate user session
export const validate = () => getHandler({
  path: 'validate',
});

// Logout request
export const logout = () => postHandler({
  path: 'logout',
});