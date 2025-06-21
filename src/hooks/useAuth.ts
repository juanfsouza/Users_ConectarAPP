import { useState, useEffect } from "react";
import { setToken, getToken, clearToken } from "@/src/lib/tokenManager";

export const useAuth = () => {
  const [token, setLocalToken] = useState<string | null>(getToken());

  useEffect(() => {
    setLocalToken(getToken());
  }, []);

  const setAuthToken = (newToken: string) => {
    setToken(newToken);
    setLocalToken(newToken);
  };

  const logout = () => {
    clearToken();
    setLocalToken(null);
  };

  return { token, setAuthToken, logout };
};