"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import axios from "axios";

const api = axios.create({
  baseURL: "https://users-conectar.onrender.com",
  withCredentials: true,
});

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  setAuthToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = () => {
    console.log('Token set, relying on cookie');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://users-conectar.onrender.com/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);
          // Remover chamada a /api/users/update-last-login, pois o backend já atualiza
        } else {
          console.error("Failed to fetch user:", res.status, res.statusText);
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch("https://users-conectar.onrender.com/api/auth/logout", {
        credentials: "include",
        method: "POST",
      });
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const updateUser = async (id: string, data: { name: string; email: string; role: string }) => {
  const response = await api.patch(`api/users/${id}`, data);
  return response.data;
};