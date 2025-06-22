"use client";

import { useState, useEffect, useCallback } from "react";
import { getUsers, getCurrentUser, deleteUser } from "@/src/lib/api";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { User } from "@/src/types";
import Link from "next/link";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser.role === "admin") {
        const { users, total } = await getUsers({
          role: roleFilter === "admin" || roleFilter === "user" ? roleFilter : undefined,
          sortBy,
          order,
          page: currentPage,
          limit: 10,
        });
        setUsers(users);
        setTotal(total);
      } else {
        setUsers([currentUser]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Falha ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, [roleFilter, sortBy, order, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await deleteUser(id);
      toast.success("Usuário excluído com sucesso");

      const { users, total } = await getUsers({
        role: roleFilter === "admin" || roleFilter === "user" ? roleFilter : undefined,
        sortBy,
        order,
        page: currentPage,
        limit: 10,
      });

      setUsers(users);
      setTotal(total);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir usuário");
    }
  };

  const totalPages = Math.ceil(total / 10);

  if (loading) return <p>Carregando...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex gap-4 flex-wrap mb-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Todos os Cargos</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "createdAt")}
            className="border p-2 rounded"
          >
            <option value="createdAt">Criado em</option>
            <option value="name">Nome</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
            className="border p-2 rounded"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>

        {/* Tabela */}
        <table className="w-full text-left text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Cargo</th>
              <th className="px-4 py-2">Criado em</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Link
                    href={`/dashboard/users/${user.id}/edit`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginação */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="text-sm px-4 py-2 bg-gray-200 rounded"
          >
            Anterior
          </button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-sm px-4 py-2 bg-gray-200 rounded"
          >
            Próxima
          </button>
        </div>
      </CardContent>
    </Card>
  );
}