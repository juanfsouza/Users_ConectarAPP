let token: string | null = null;

export const setToken = (newToken: string) => {
  token = newToken;
  if (typeof window !== "undefined") {
    localStorage.setItem("token", newToken);
  }
};

export const getToken = () => {
  if (token) return token;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  return token;
};

export const clearToken = () => {
  token = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};
