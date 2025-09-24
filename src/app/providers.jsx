"use client";
import { AuthProvider } from "@/context/AuthContext"; 
import { UserProvider } from "@/context/UserContext";

export default function Providers({ children }) {
  return <AuthProvider>
            <UserProvider>
            {children}
            </UserProvider>
        </AuthProvider>;
}
