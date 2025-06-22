"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/src/lib/api";
import { User } from "@/src/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => {});
  }, []);

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Perfil</h1>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}
