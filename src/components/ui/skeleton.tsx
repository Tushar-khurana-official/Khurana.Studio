import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-md bg-muted", className)} aria-hidden />;
}

export function ImageSkeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-lg bg-muted", className)} aria-hidden />;
}