"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);


const USERS_KEY = "users";
const SESSION_KEY = "session_user";

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // { id, name, email, role }

  
  const readUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const writeUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));

  
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async ({ name, email, password, role = "usuario" }) => {
    const users = readUsers();

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("El correo ya está registrado");
    }

    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { id, name, email, password, role };
    users.push(newUser);
    writeUsers(users);

    const session = { id, name, email, role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  };

  const login = async ({ email, password }) => {
    const users = readUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Credenciales inválidas");
    const session = { id: found.id, name: found.name, email: found.email, role: found.role };
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