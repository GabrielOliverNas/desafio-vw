import { jwtDecode } from 'jwt-decode';
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const roles: string[] = decoded.roles || [];

    if (requiredRole && !roles.includes(requiredRole)) {
      return <Navigate to="/acesso-negado" replace />;
    }

    return children;

  } catch (err) {
    return <Navigate to="/login" replace />;
  }
}
