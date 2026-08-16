"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn, initials } from "@/lib/utils";

export function SessionStatus({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-muted" aria-hidden />;
  }

  if (session?.user) {
    const isAdmin = session.user.role === "ADMIN";
    return (
      <Link
        href={isAdmin ? "/admin" : "/account"}
        aria-label="Account"
        title={session.user.name ?? "Account"}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/50 text-xs font-semibold transition hover:border-accent/50",
          className
        )}
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={session.user.image} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          initials(session.user.name ?? "U")
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="flex h-9 items-center rounded-full border border-border bg-muted/50 px-4 text-sm font-medium transition hover:border-accent/50"
    >
      Sign in
    </Link>
  );
}