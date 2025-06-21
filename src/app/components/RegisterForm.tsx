"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createUser } from "@/src/lib/api";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createUser(data);
      toast.success("Account created! Please login.");
      router.push("/");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input {...form.register("name")} placeholder="Name" />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
        )}
        <Input {...form.register("email")} placeholder="Email" type="email" />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
        )}
        <Input {...form.register("password")} placeholder="Password" type="password" />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
        )}
        <Button type="submit">Register</Button>
      </form>
      <Toaster />
    </>
  );
}