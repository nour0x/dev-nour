"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProfilePhoto({
  src,
  name,
  alt,
  className,
  size = "lg",
}: {
  src?: string | null;
  name: string;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const dim =
    size === "sm" ? 64 : size === "md" ? 112 : size === "xl" ? 280 : 180;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={cn(
        "profile-photo relative overflow-hidden border border-border bg-bg-soft",
        className
      )}
      style={{ width: dim, height: dim }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${dim}px`}
          className="object-cover"
          priority={size === "lg" || size === "xl"}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#1a211c,#0c1014_55%,#24180f)]"
          aria-hidden
        >
          <span className="display text-[clamp(1.5rem,30%,4rem)] font-bold text-accent">
            {initials || "DN"}
          </span>
        </div>
      )}
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
    </div>
  );
}
