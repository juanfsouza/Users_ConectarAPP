"use client";

import { InactiveUsersTable } from "../../components/InactiveUsersTable";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export default function InactiveUsersPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Usuários Inativos</h1>
        <InactiveUsersTable />
      </div>
    </ProtectedRoute>
  );
}