import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Razorpay webhook/payment signature verification.
 * Signature = base64(HMAC-SHA256(body, secret)).
 */
export function verifyRazorpaySignature(body: string, signature: string, secret: string) {
  try {
    const expected = createHmac("sha256", secret).update(body).digest();
    const received = Buffer.from(signature, "base64");
    return received.length === expected.length && timingSafeEqual(received, expected);
  } catch {
    return false;
  }
}