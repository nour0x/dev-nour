export function normalizeMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }
  const cleaned = trimmed.replace(/^\/+/, "");
  if (cleaned.startsWith("api/media/")) {
    return `/${cleaned}`;
  }
  if (cleaned.startsWith("uploads/")) {
    return `/api/media/${cleaned.slice("uploads/".length)}`;
  }
  // bare filename saved in DB
  if (!cleaned.includes("/")) {
    return `/api/media/${cleaned}`;
  }
  return `/${cleaned}`;
}
