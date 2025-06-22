"use client";

import { useState, useEffect } from "react";
import { User } from "@/src/types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { getInactiveUsers } from "@/src/lib/api";
import { useAuth } from "@/src/hooks/useAuth";

export function InactiveUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  if (user?.role !== "admin") {
    return <p>Apenas administradores podem visualizar esta lista.</p>;
  }

  const getDaysSinceLastLogin = (lastLogin: string | null): string => {
    if (!lastLogin) return "Nunca";
    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastLoginDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} dia${diffDays === 1 ? '' : 's'} atrás`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários Inativos <span className="warning-icon">!</span></CardTitle>
      </CardHeader>
      <CardContent>
        <style>
          {`
            .warning-icon {
              position: relative;
              color: #ff9800;
              cursor: pointer;
              font-size: 0.8em;
              margin-left: 5px;
            }
            .warning-icon:hover::after {
              content: "Pessoas que ficaram 30 dias ou mais ou nunca logaram";
              position: absolute;
              top: -30px;
              left: 50%;
              transform: translateX(-50%);
              background-color: #333;
              color: #fff;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 0.8em;
              white-space: nowrap;
              z-index: 10;
            }
          `}
        </style>
        <table className="w-full text-left text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Dias sem Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  {getDaysSinceLastLogin(user.lastLogin)}
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