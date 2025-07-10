import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {

  const navigate = useNavigate();

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
    localStorage.removeItem("token");
    setToken(null);
    setRoles([]);
  };

  const isLoggedIn = () => !!token;

  const authHeader = token ? `Bearer ${token}` : "";

  async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const headers = {
      ...(options.headers || {}),
      Authorization: authHeader,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (response.status === 401) {
        logout();
        navigate("/login");
        return null;
      }
      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  return {
    getToken,
    saveTokenSession,
    logout,
    isLoggedIn,
    fetchWithAuth,
  };
}
