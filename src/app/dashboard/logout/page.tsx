"use client";

import { useEffect } from "react";
import { clearToken } from "@/src/lib/tokenManager";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    clearToken();
    router.push("/");
  }, [router]);

  return <p>Saindo...</p>;
}
