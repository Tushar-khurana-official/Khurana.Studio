import Razorpay from "razorpay";
import { env } from "@/lib/env";
import { verifyRazorpaySignature } from "@/lib/razorpay-signature";

export function getRazorpay() {
  return new Razorpay({
    key_id: env.RAZORPAY_KEY_ID!,
    key_secret: env.RAZORPAY_KEY_SECRET!,
  });
}

export interface CreateOrderInput {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder({ amountPaise, receipt, notes }: CreateOrderInput) {
  const rzp = getRazorpay();
  const order = await rzp.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes,
  });
  return order as { id: string; amount: number; currency: string };
}

export async function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const body = `${orderId}|${paymentId}`;
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  return verifyRazorpaySignature(body, signature, secret);
}

export function validateRazorpaySignature(body: string, signature: string, secret: string) {
  return verifyRazorpaySignature(body, signature, secret);
}