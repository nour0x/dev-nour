import Image from "next/image";
import { cn } from "@/lib/utils";

function isLocalMedia(src?: string | null) {
  if (!src) return false;
  return (
    src.startsWith("/uploads/") ||
    src.startsWith("/api/media/") ||
    src.startsWith("uploads/")
  );
}

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
    size === "sm" ? 64 : size === "md" ? 112 : size === "xl" ? 280 : 220;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const local = isLocalMedia(src);

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
          width={dim}
          height={dim}
          sizes={`${dim}px`}
          className="h-full w-full object-cover"
          priority={size === "lg" || size === "xl"}
          unoptimized={local}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#1c1c1f,#0a0a0b_55%,#2a1218)]"
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
