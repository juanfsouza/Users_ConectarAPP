"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { initiateGoogleLogin, login } from "@/src/lib/api";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/src/hooks/useAuth";

interface LoginResponse {
  accessToken: string;
}

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function AuthForm() {
  const { setAuthToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setAuthToken(token);
      toast.success("Login successful");
      router.push("/dashboard");
      window.history.replaceState({}, document.title, "/");
    }
  }, [setAuthToken, router]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await login(data.email, data.password);

      if (
        typeof response === "object" &&
        response !== null &&
        "accessToken" in response &&
        typeof (response as LoginResponse).accessToken === "string"
      ) {
        setAuthToken((response as LoginResponse).accessToken);
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        throw new Error("No access token received");
      }
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
          <p className="text-red-500 text-sm">
            {form.formState.errors.email.message}
          </p>
        )}
        <Input
          {...form.register("password")}
          placeholder="Password"
          type="password"
          disabled={isLoading}
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.password.message}
          </p>
        )}
        <Button type="submit" disabled={isLoading}>
          Login
        </Button>
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Login with Google
        </Button>
      </form>
      <Toaster />
    </>
  );
}