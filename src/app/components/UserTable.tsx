"use client";

import { getUsers } from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function UserTable() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const data = await getUsers(token);
        setUsers(data.users);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (!token) return <p>Please log in to see users.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
