import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const initiateGoogleLogin = () => {
  window.location.href = `${baseURL}/api/auth/google`;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post('/api/auth/refresh');
  return response.data;
};
