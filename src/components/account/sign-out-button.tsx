"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`text-sm text-muted-foreground underline-offset-4 transition hover:text-red-500 hover:underline ${className ?? ""}`}
    >
      Sign out
    </button>
  );
}