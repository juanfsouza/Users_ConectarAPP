"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/dashboard");
    } else if (user && user.role !== 'admin' && window.location.pathname.includes('/inactive-users')) {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  return <>{children}</>;
}