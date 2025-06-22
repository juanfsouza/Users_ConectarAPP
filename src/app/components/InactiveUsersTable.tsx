"use client";

import { useState, useEffect } from "react";
import { User } from "@/src/types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { getInactiveUsers } from "@/src/lib/api";

export function InactiveUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInactiveUsers = async () => {
      try {
        const inactiveUsers = await getInactiveUsers();
        setUsers(inactiveUsers);
      } catch (err) {
        console.error("Failed to fetch inactive users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInactiveUsers();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários Inativos</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Último Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p>Nenhum usuário inativo encontrado.</p>}
      </CardContent>
    </Card>
  );
}