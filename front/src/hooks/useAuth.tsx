import { useState, useEffect } from "react";

export function useAuth() {

  const getToken = (): string | null => {
    const token = localStorage.getItem("Authorization");
    return token && token !== "undefined" && token !== "null" ? token : null;
  };

  const [token, setToken] = useState<string | null>(getToken());
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!token) setRoles([]);
  }, [token]);

  const saveTokenSession = (newToken: string, userRoles: string[] = []) => {
    const cleanToken = newToken.startsWith("Bearer ") ? newToken.slice(7) : newToken;
    localStorage.setItem("Authorization", cleanToken);
    setToken(cleanToken);
    setRoles(userRoles);
  };

  const logout = () => {
    localStorage.removeItem("Authorization");
    setToken(null);
    setRoles([]);
  };

  const isLoggedIn = () => !!token;

  const authHeader = token ? `Bearer ${token}` : "";

  return {
    getToken,
    saveTokenSession,
    logout,
    isLoggedIn,
    token,
    roles,
    authHeader, // <--- cabeçalho montado pronto pra usar
  };
}
