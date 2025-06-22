"use client";

import { ProtectedRoute } from "../components/ProtectedRoute";
import { SidebarDemo } from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarDemo>{children}</SidebarDemo>
    </ProtectedRoute>
  );
}
