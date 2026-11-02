import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children, requiredPermission, requiredRole }) {
  const { user, isAuthenticated, loading, hasPermission, hasRole } = useAuth();

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h3>Acesso Negado</h3>
        <p>Você não tem a permissão necessária para acessar esta página.</p>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h3>Acesso Negado</h3>
        <p>Você não tem o papel necessário para acessar esta página.</p>
      </div>
    );
  }

  return children;
}

