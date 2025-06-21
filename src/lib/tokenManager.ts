let token: string | null = localStorage.getItem("token");

export const setToken = (newToken: string) => {
  token = newToken;
  localStorage.setItem("token", newToken);
};

export const getToken = () => token;

export const clearToken = () => {
  token = null;
  localStorage.removeItem("token");
};