import { env } from "@/lib/env";

interface WhatsAppPayload {
  to: string;
  message: string;
}

/**
 * Reuses the existing WhatsApp Business automation infra.
 * Configure WHATSAPP_NUMBER + WHATSAPP_API_KEY to enable; otherwise no-op.
 */
export async function sendWhatsApp({ to, message }: WhatsAppPayload) {
  const apiKey = env.WHATSAPP_API_KEY;
  const from = env.WHATSAPP_NUMBER;
  if (!apiKey || !from) return;

  try {
    const res = await fetch(`https://api.wa.me/send?phone=${encodeURIComponent(to)}&text=${encodeURIComponent(message)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, from, message }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.warn("[whatsapp] send failed", res.status);
  } catch (err) {
    console.warn("[whatsapp] send error", err);
  }
}

export function orderConfirmationMessage(order: { id: string; total: number }) {
  return `Hi! Your Khurana Studio order #${order.id} is confirmed. Amount: ₹${(order.total / 100).toLocaleString("en-IN")}. Thank you!`;
}

export function bookingConfirmationMessage(booking: { id: string; service: string; date: Date; timeSlot: string }) {
  return `Hi! Your Khurana Studio booking #${booking.id} is confirmed for ${booking.service} on ${booking.date.toDateString()} at ${booking.timeSlot}. We look forward to seeing you!`;
}