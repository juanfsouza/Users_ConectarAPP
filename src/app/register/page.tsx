"use client";

import { RegisterForm } from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Conta</h1>
        <RegisterForm />
      </div>
    </div>
  );
}