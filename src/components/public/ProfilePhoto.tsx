import { cn } from "@/lib/utils";
import { normalizeMediaUrl } from "@/lib/media";

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
    size === "sm" ? 72 : size === "md" ? 120 : size === "xl" ? 300 : 220;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const media = normalizeMediaUrl(src);

  return (
    <div
      className={cn("profile-photo relative overflow-hidden bg-bg-soft", className)}
      style={{ width: dim, height: dim }}
    >
      {media ? (
        // Plain img avoids Next image optimizer 404s on Hostinger uploads
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media}
          alt={alt}
          width={dim}
          height={dim}
          className="h-full w-full object-cover"
          decoding="async"
          fetchPriority={size === "lg" || size === "xl" ? "high" : "auto"}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#2a1218,#0a0a0b_55%,#1a1408)]"
          aria-hidden
        >
          <span className="display text-[clamp(1.5rem,30%,4rem)] font-bold text-accent">
            {initials || "DN"}
          </span>
        </div>
      )}
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15" />
    </div>
  );
}
