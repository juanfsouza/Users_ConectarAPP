"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { initiateGoogleLogin, login } from "@/src/lib/api";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/src/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function AuthForm() {
  const router = useRouter();
  const { setAuthToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const googleLogin = urlParams.get("googleLogin");

    if (googleLogin === "success") {
      setAuthToken();
      toast.success("Login com Google feito com sucesso");
      router.push("/dashboard");
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [setAuthToken, router]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    initiateGoogleLogin();
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...form.register("email")}
          placeholder="Email"
          type="email"
          disabled={isLoading}
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
        )}
        <Input
          {...form.register("password")}
          placeholder="Password"
          type="password"
          disabled={isLoading}
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
        )}
        <Button type="submit" disabled={isLoading}>
          Login
        </Button>
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Login com Google
        </Button>
      </form>
      <Toaster />
    </>
  );
}