"use client";

import React, { useState, useEffect } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { getCurrentUser } from "@/src/lib/api";
import { User } from "@/src/types";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";

export function SidebarDemo({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      onClick: handleLogout,
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch((err) => {
        console.warn("Usuário não autenticado:", err);
        setUser(null);
      });
  }, []);
  
  const [open, setOpen] = useState(false);
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-neutral-900">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 py-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo name="Users Manager" />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-2 px-2 py-3">
              <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                {avatarLetter}
              </div>
              <span className="text-sm text-neutral-800 dark:text-neutral-200">
                {user.name}
              </span>
            </div>
          )}
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}

export const Logo = ({ name }: { name: string }) => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-semibold text-black dark:text-white"
    >
      <div className="h-5 w-1 shrink-0 rounded-lg bg-black dark:bg-white" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {name}
      </motion.span>
    </a>
  );
};
