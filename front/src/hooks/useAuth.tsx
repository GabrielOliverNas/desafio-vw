import { useState, useEffect } from "react";

export function useAuth() {
  const getToken = (): string | null => {
    const token = localStorage.getItem("token");
    return token && token !== "undefined" && token !== "null" ? token : null;
  };

  const [token, setToken] = useState<string | null>(getToken());
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!token) setRoles([]);
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRoles([]);
  };

  function getUserRoles() {
    if (!token) return [];

    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));

    return payload.roles || [];
  }

  const isAdmin = getUserRoles().includes("ADMIN");

  return {
    getToken,
    logout,
    token,
    roles: getUserRoles(),
    isAdmin
  };
}
