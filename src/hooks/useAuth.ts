import { useState, useEffect } from "react";

export const useAuth = () => {
  const [token, setLocalToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) setLocalToken(storedToken);
    }
  }, []);

  const setAuthToken = (newToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", newToken);
    }
    setLocalToken(newToken);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setLocalToken(null);
  };

  return { token, setAuthToken, logout };
};