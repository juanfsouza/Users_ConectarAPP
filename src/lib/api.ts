import axios from "axios";
import { AuthResponse, User } from "../types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const loginWithGoogle = async (code: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/google/callback", { code });
    return response.data;
  } catch {
    throw new Error("Network error during authentication");
  }
};

export const getUsers = async (token: string) => {
  const response = await api.get<{ users: User[]; total: number }>("/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};