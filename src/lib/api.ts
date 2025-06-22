import axios from 'axios';
import { User, AuthResponse } from '@/src/types';

const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

export const initiateGoogleLogin = () => {
  window.location.href = `${baseURL}/api/auth/google`;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const getUsers = async (params?: {
  role?: 'admin' | 'user';
  lastLogin?: 'never' | 'last7' | 'over30';
  sortBy?: 'name' | 'createdAt' | 'lastLogin';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}): Promise<{ users: User[]; total: number }> => {
  const response = await api.get<{ users: User[]; total: number }>('api/users', { params });
  return response.data;
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/refresh');
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>("/api/auth/me");
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error && 'response' in err && err.response && typeof err.response === 'object' && 'status' in err.response) {
      if (err.response.status === 401) {
        return Promise.reject("Unauthorized");
      }
    }
    throw err;
  }
};

export const createUser = async (user: { name: string; email: string; password: string }) => {
  const response = await api.post('/api/auth/register', user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/api/users/${id}`);
};

export const updateUser = async (
  id: string,
  data: { name: string; email: string; role: string }
) => {
  const response = await api.patch(`/api/users/${id}`, data);
  return response.data;
};

export const getInactiveUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/api/users/inactive');
  return response.data;
};