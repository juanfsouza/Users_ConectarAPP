"use client";

import { AuthForm } from "./components/AuthForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <AuthForm />
        <p className="mt-6 text-center text-sm">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}