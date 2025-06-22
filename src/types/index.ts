export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
}

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type ApiError = {
  message: string;
  status?: number;
};

