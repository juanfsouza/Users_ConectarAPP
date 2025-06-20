export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type ApiError = {
  message: string;
  status?: number;
};