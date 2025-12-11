"use client";

import { useSession } from "next-auth/react";

export function useUserRole() {
  const { data: session } = useSession();

  const role = session?.user?.role;

  return {
    role,
    isAdmin: role === "admin",
    isTutor: role === "tutor",
    isStudent: role === "student",
  };
}
