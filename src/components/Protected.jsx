"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Protected({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) router.replace("/auth/login");
      else if (role && user?.role !== role) router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, role, user, router]);

  if (loading || !isAuthenticated) return null;
  if (role && user?.role !== role) return null;

  return children;
}