import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (!accessToken || !refreshToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/me/");
      setIsAuthenticated(true);
      setUser(res.data);
    } catch {
      try {
        const refreshRes = await axios.post("token/refresh/", {
          refresh: refreshToken,
        });
        localStorage.setItem("access_token", refreshRes.data.access);
        if (refreshRes.data.refresh) {
          localStorage.setItem("refresh_token", refreshRes.data.refresh);
        }
        const userRes = await api.get("/me/");
        setIsAuthenticated(true);
        setUser(userRes.data);
      } catch {
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
        console.error('Failed to refresh token');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await api.post("login/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    const userRes = await api.get("/me/");
    setIsAuthenticated(true);
    setUser(userRes.data);
    console.log(user)
  };

  const register = async (username,email, password, password2) => {
    try {
      const res = await api.post("register/", {
        username,
        email,
        password,
        password2,
      });
      await login(username, password);
    } catch (error) {
      console.error("Registration Failed", error);
    }
  };

  const logout = async () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
