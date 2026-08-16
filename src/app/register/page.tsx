import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default function RegisterPage() {
  return (
    <Section className="flex min-h-[70vh] items-center justify-center py-28">
      <div className="w-full max-w-md">
        <h1 className="font-display text-4xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track orders, manage bookings and download your digital prints.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-7">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Section>
  );
}