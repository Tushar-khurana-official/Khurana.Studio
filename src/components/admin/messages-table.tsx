"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function MessagesTable({
  messages,
}: {
  messages: {
    id: string;
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    read: boolean;
    createdAt: string;
  }[];
}) {
  const router = useRouter();

  const markRead = async (id: string, read: boolean) => {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    if (res.ok) router.refresh();
  };

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div
          key={m.id}
          className={cn(
            "rounded-2xl border bg-card p-5",
            m.read ? "border-border opacity-70" : "border-gold/40"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">
              {m.name} <span className="text-xs font-normal text-muted-foreground">· {m.email}</span>
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {new Date(m.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
              <button
                type="button"
                onClick={() => markRead(m.id, !m.read)}
                className="text-xs text-muted-foreground transition hover:text-gold"
              >
                {m.read ? "Mark unread" : "Mark read"}
              </button>
            </div>
          </div>
          {m.subject && <p className="mt-2 text-sm font-medium">{m.subject}</p>}
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.message}</p>
        </div>
      ))}
    </div>
  );
}