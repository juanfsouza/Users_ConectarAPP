"use client";

import { getUsers, getCurrentUser } from "@/src/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { User } from "@/src/types";


export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser: User = await getCurrentUser();

        if (currentUser.role === "admin") {
          const data = await getUsers();
          if (data && Array.isArray(data.users)) {
            setUsers(data.users);
          } else {
            throw new Error("Invalid data from getUsers");
          }
        } else {
          setUsers([currentUser]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Cargo</th>
              <th className="px-4 py-2">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
