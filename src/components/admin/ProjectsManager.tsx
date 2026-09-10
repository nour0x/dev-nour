"use client";

import { FormEvent, useEffect, useState } from "react";
import { parseTags } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Project = {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  bodyAr: string;
  bodyEn: string;
  tags: string;
  githubUrl?: string | null;
  demoUrl?: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  coverUrl?: string | null;
};

const empty = {
  titleAr: "",
  titleEn: "",
  summaryAr: "",
  summaryEn: "",
  bodyAr: "",
  bodyEn: "",
  tags: "",
  githubUrl: "",
  demoUrl: "",
  coverUrl: "",
  featured: false,
  published: true,
  sortOrder: 0,
};

export function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState({ ...empty, id: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/admin/projects");
    setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.id || undefined,
        titleAr: form.titleAr,
        titleEn: form.titleEn,
        summaryAr: form.summaryAr,
        summaryEn: form.summaryEn,
        bodyAr: form.bodyAr,
        bodyEn: form.bodyEn,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        githubUrl: form.githubUrl || null,
        demoUrl: form.demoUrl || null,
        coverUrl: form.coverUrl || null,
        featured: form.featured,
        published: form.published,
        sortOrder: Number(form.sortOrder) || 0,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setMsg("Save failed");
      return;
    }
    setMsg("Saved — SEO generated automatically");
    setForm({ ...empty, id: "" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete project?")) return;
    await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    load();
  }

  function edit(item: Project) {
    setForm({
      id: item.id,
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      summaryAr: item.summaryAr,
      summaryEn: item.summaryEn,
      bodyAr: item.bodyAr,
      bodyEn: item.bodyEn,
      tags: parseTags(item.tags).join(", "),
      githubUrl: item.githubUrl || "",
      demoUrl: item.demoUrl || "",
      coverUrl: item.coverUrl || "",
      featured: item.featured,
      published: item.published,
      sortOrder: item.sortOrder,
    });
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={onSubmit} className="surface space-y-3 p-5">
        <h2 className="text-lg font-semibold">
          {form.id ? "Edit project" : "New project"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title AR" value={form.titleAr} onChange={(v) => setForm({ ...form, titleAr: v })} required />
          <Field label="Title EN" value={form.titleEn} onChange={(v) => setForm({ ...form, titleEn: v })} required />
          <Field label="Summary AR" value={form.summaryAr} onChange={(v) => setForm({ ...form, summaryAr: v })} />
          <Field label="Summary EN" value={form.summaryEn} onChange={(v) => setForm({ ...form, summaryEn: v })} />
        </div>
        <Area label="Body AR" value={form.bodyAr} onChange={(v) => setForm({ ...form, bodyAr: v })} />
        <Area label="Body EN" value={form.bodyEn} onChange={(v) => setForm({ ...form, bodyEn: v })} />
        <ImageUploader
          label="Project cover (file upload)"
          value={form.coverUrl}
          onChange={(url) => setForm({ ...form, coverUrl: url })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tags (comma)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
          <Field label="GitHub URL" value={form.githubUrl} onChange={(v) => setForm({ ...form, githubUrl: v })} />
          <Field label="Demo URL" value={form.demoUrl} onChange={(v) => setForm({ ...form, demoUrl: v })} />
          <Field label="Sort" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary focus-ring" disabled={busy}>
            {busy ? "Saving..." : "Save"}
          </button>
          {form.id ? (
            <button
              type="button"
              className="btn btn-ghost focus-ring"
              onClick={() => setForm({ ...empty, id: "" })}
            >
              Cancel
            </button>
          ) : null}
        </div>
        {msg ? <p className="text-sm text-ok">{msg}</p> : null}
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="surface flex items-start justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{item.titleEn}</p>
              <p className="text-sm text-fg-muted">{item.titleAr}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-sm text-accent" onClick={() => edit(item)}>
                Edit
              </button>
              <button type="button" className="text-sm text-danger" onClick={() => remove(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <input
        className="admin-input focus-ring"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <textarea
        className="admin-textarea focus-ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
