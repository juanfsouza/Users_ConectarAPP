"use client";

import { getUsers, getCurrentUser } from "@/src/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

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
