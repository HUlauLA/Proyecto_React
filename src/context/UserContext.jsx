"use client";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(undefined);
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/users";

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error cargando usuarios", err))
      .finally(() => setLoading(false));
  }, []);

  const addUser = async (user) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const newUser = await res.json();
    setUsers([...users, newUser]);
  };

  const updateUser = async (id, updatedFields) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    const updated = await res.json();
    setUsers(users.map(u => (u.id === id ? updated : u)));
  };

  const removeUser = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, loading, addUser, updateUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers debe usarse dentro de <UserProvider>");
  return ctx;
}
