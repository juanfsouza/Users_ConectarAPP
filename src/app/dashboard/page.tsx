"use client";

import { UserTable } from "../components/UserTable";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="w-full max-w-4xl">
        <UserTable />
      </div>
    </div>
  );
}