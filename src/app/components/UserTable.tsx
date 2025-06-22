"use client";

import { useState, useEffect, useCallback } from "react";
import { getUsers, getCurrentUser, deleteUser } from "@/src/lib/api";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { User } from "@/src/types";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<"admin" | "user" | "">("");
  const [lastLoginFilter, setLastLoginFilter] = useState<"never" | "last7" | "over30" | "">("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "lastLogin">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser.role === "admin") {
        const { users } = await getUsers({
          role: roleFilter === "" ? undefined : roleFilter,
          lastLogin: lastLoginFilter || undefined,
          sortBy,
          order,
          page: currentPage,
          limit: 10,
        });
        const activeUsers = users.filter((u) => {
          if (!u.lastLogin) return false;
          const lastLoginDate = new Date(u.lastLogin);
          const now = new Date();
          const threshold = new Date(now.setDate(now.getDate() - 30));
          return lastLoginDate >= threshold;
        });
        setUsers(activeUsers);
      } else {
        setUsers([currentUser]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Falha ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, [roleFilter, lastLoginFilter, sortBy, order, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await deleteUser(id);
      toast.success("Usuário excluído com sucesso");

      const { users } = await getUsers({
        role: roleFilter || undefined,
        lastLogin: lastLoginFilter || undefined,
        sortBy,
        order,
        page: currentPage,
        limit: 10,
      });
      const activeUsers = users.filter((u) => {
        if (!u.lastLogin) return false;
        const lastLoginDate = new Date(u.lastLogin);
        const now = new Date();
        const threshold = new Date(now.setDate(now.getDate() - 30));
        return lastLoginDate >= threshold;
      });
      setUsers(activeUsers);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir usuário");
    }
  };

  const totalPages = Math.ceil(users.length / 10);

  if (loading) return <p>Carregando...</p>;

  const formatLastLogin = (lastLogin: string | null): string => {
    if (!lastLogin) return "Nunca";
    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastLoginDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} dia${diffDays === 1 ? "" : "s"} atrás`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros visíveis apenas para admins */}
        {user?.role === "admin" && (
          <div className="flex gap-4 flex-wrap mb-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "" | "admin" | "user")}
              className="border p-2 rounded"
            >
              <option value="">Todos os Cargos</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              value={lastLoginFilter}
              onChange={(e) => setLastLoginFilter(e.target.value as "never" | "last7" | "over30" | "")}
              className="border p-2 rounded"
            >
              <option value="">Todos os Últimos Logins</option>
              <option value="last7">Últimos 7 dias</option>
              <option value="over30">Mais de 30 dias</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "createdAt" | "lastLogin")}
              className="border p-2 rounded"
            >
              <option value="createdAt">Criado em</option>
              <option value="name">Nome</option>
              <option value="lastLogin">Último Login</option>
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
        )}

        {/* Tabela */}
        <table className="w-full text-left text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Cargo</th>
              <th className="px-4 py-2">Criado em</th>
              <th className="px-4 py-2">Último Login</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{new Date(user.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{formatLastLogin(user.lastLogin)}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Link
                    href={`/dashboard/users/${user.id}/edit`}
                    className="text-zinc-500 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:underline text-sm"
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