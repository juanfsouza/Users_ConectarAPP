"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/src/hooks/useAuth";
import { Toaster } from "sonner";

export function AuthProviderClient({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
