"use client";

import { AuthForm } from "./components/AuthForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <AuthForm />
      <p className="mt-4">
        Não tem uma conta?{" "}
        <Link href="/register" className="text-blue-500 underline">
          Registre-se
        </Link>
      </p>
    </div>
  );
}
