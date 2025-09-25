"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const AuthContext = createContext(undefined);

const SESSION_KEY = "session_user";

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // { id, name, email, role }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async ({ name, email, password, role = "user" }) => {
    const response = await api.get(`/users?email=${email}`);
    if (response.data.length > 0) {
      throw new Error("El correo ya está registrado");
    }

    const newUserResponse = await api.post("/users", { name, email, password, role });
    const createdUser = newUserResponse.data;

    const session = { id: createdUser.id, name: createdUser.name, email: createdUser.email, role: createdUser.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  };

  const login = async ({ email, password }) => {
    const response = await api.get(`/users?email=${email.toLowerCase()}`);
    const foundUser = response.data[0];

    if (!foundUser || foundUser.password !== password) {
      throw new Error("Credenciales inválidas");
    }

    const session = { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ loading, user, isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}