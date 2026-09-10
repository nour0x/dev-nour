"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { normalizeMediaUrl } from "@/lib/media";

export function ImageUploader({
  value,
  onChange,
  label = "Upload image",
  hint = "JPG, PNG, WEBP — max 5MB. File upload, not a URL.",
}: {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const preview = normalizeMediaUrl(value);

  async function onFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="admin-label">{label}</p>
      {preview ? (
        <div className="relative w-full max-w-xs overflow-hidden border border-border bg-bg-soft">
          <div className="relative aspect-square w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Uploaded" className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            className="absolute end-2 top-2 rounded-full bg-black/70 p-2 text-white"
            aria-label="Remove image"
            onClick={() => onChange("")}
          >
            <X size={14} />
          </button>
        </div>
      ) : null}
      <button
        type="button"
        className="btn btn-ghost focus-ring inline-flex gap-2"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={16} />
        {busy ? "Uploading..." : value ? "Replace image" : "Choose image file"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
      <p className="text-xs text-fg-muted">{hint}</p>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
