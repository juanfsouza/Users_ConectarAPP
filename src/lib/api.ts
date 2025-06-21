import axios from "axios";
import { useAuth } from "@/src/hooks/useAuth";
import { User, AuthResponse } from "@/src/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true, // Keeps cookies (e.g., accessToken) for cross-origin requests
});

// Add interceptor to include token in headers
api.interceptors.request.use((config) => {
  const { token } = useAuth(); // This won't work directly; see below for a workaround
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const initiateGoogleLogin = () => {
  window.location.href = `${baseURL}/api/auth/google`;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const getUsers = async (): Promise<{ users: User[] }> => {
  const response = await api.get<{ users: User[] }>("/api/users");
  return response.data;
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/refresh");
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/api/auth/me");
  return response.data;
};

export const createUser = async (user: { name: string; email: string; password: string }) => {
  const response = await api.post("/api/auth/register", user);
  return response.data;
};