"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/src/app/components/ui/input";
import { Button } from "@/src/app/components/ui/button";
import { toast } from "sonner";
import { User } from "@/src/types";
import { getCurrentUser } from "@/src/lib/api";
import { updateUser } from "@/src/lib/api";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser.role !== "admin") {
          router.push("/dashboard");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/users/${id}`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Erro ao buscar usuário");
        const data = await response.json();
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
        });
      } catch {
        toast.error("Erro ao carregar dados do usuário");
        router.push("/dashboard");
      }
    };

    fetchUser();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(id as string, formData);
      toast.success("Usuário atualizado com sucesso");
      router.push("/dashboard");
    } catch {
      toast.error("Erro ao atualizar usuário");
    }
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-bold">Editar Usuário</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Nome" />
        <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
        <Button type="submit">Salvar</Button>
      </form>
    </div>
  );
}