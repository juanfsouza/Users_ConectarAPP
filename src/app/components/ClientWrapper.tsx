"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  return <>{children}</>;
}