"use client";

import { useSession } from "next-auth/react";

export function useUserName(): string | null {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  return session?.user?.name || null;
}
