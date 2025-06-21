import axios from "axios";
import { User, AuthResponse } from "@/src/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
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
