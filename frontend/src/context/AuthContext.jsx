import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../axios/config";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao iniciar o app, valida a sessão checando o cookie via /usuario/me
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await API.get("/usuario/me");
        setUser(response.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (dados) => {
    const response = await API.post("/usuario/login", dados);
    setUser(response.data);
    return response.data;
  };

  const logout = async () => {
    try {
      await API.post("/usuario/logout");
    } catch (err) {
      console.error("Erro ao realizar logout:", err);
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

