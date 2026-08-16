import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <Section className="flex min-h-[70vh] items-center justify-center py-28">
      <div className="w-full max-w-md">
        <h1 className="font-display text-4xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to view your orders, bookings and downloads.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-7">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Khurana Studio?{" "}
          <Link href="/register" className="font-medium text-gold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </Section>
  );
}