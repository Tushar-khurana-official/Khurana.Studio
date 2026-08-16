import { prisma } from "@/lib/prisma";
import { MessagesTable } from "@/components/admin/messages-table";

export default async function AdminMessagesPage() {
  let messages: Awaited<ReturnType<typeof prisma.contactMessage.findMany>> = [];
  try {
    messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  } catch {
    console.error("[admin messages] DB unavailable");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enquiries from the contact form.</p>
      </div>
      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No messages yet.
        </p>
      ) : (
        <MessagesTable messages={messages as never} />
      )}
    </div>
  );
}