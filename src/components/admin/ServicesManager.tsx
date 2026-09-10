"use client";

import { FormEvent, useEffect, useState } from "react";

type Service = {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  bodyAr: string;
  bodyEn: string;
  priceMin?: number | null;
  priceAvg?: number | null;
  priceMax?: number | null;
  currency: string;
  published: boolean;
  sortOrder: number;
};

const empty = {
  id: "",
  titleAr: "",
  titleEn: "",
  summaryAr: "",
  summaryEn: "",
  bodyAr: "",
  bodyEn: "",
  priceMin: "",
  priceAvg: "",
  priceMax: "",
  currency: "USD",
  published: true,
  sortOrder: 0,
};

export function ServicesManager() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState("");

  async function load() {
    setItems(await (await fetch("/api/admin/services")).json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/services", {
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
        priceMin: form.priceMin === "" ? null : Number(form.priceMin),
        priceAvg: form.priceAvg === "" ? null : Number(form.priceAvg),
        priceMax: form.priceMax === "" ? null : Number(form.priceMax),
        currency: form.currency,
        published: form.published,
        sortOrder: Number(form.sortOrder) || 0,
      }),
    });
    if (!res.ok) {
      setMsg("Save failed");
      return;
    }
    setMsg("Saved — SEO auto-generated for this service");
    setForm(empty);
    load();
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={onSubmit} className="surface space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {form.id ? "Edit activity" : "Start new activity"}
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Title AR" value={form.titleAr} onChange={(v) => setForm({ ...form, titleAr: v })} required />
          <Input label="Title EN" value={form.titleEn} onChange={(v) => setForm({ ...form, titleEn: v })} required />
          <Input label="Summary AR" value={form.summaryAr} onChange={(v) => setForm({ ...form, summaryAr: v })} />
          <Input label="Summary EN" value={form.summaryEn} onChange={(v) => setForm({ ...form, summaryEn: v })} />
          <Input label="Price min" value={form.priceMin} onChange={(v) => setForm({ ...form, priceMin: v })} />
          <Input label="Price avg" value={form.priceAvg} onChange={(v) => setForm({ ...form, priceAvg: v })} />
          <Input label="Price max" value={form.priceMax} onChange={(v) => setForm({ ...form, priceMax: v })} />
          <Input label="Currency" value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} />
        </div>
        <Text label="Body AR" value={form.bodyAr} onChange={(v) => setForm({ ...form, bodyAr: v })} />
        <Text label="Body EN" value={form.bodyEn} onChange={(v) => setForm({ ...form, bodyEn: v })} />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>
        <button type="submit" className="btn btn-primary focus-ring">
          Save activity
        </button>
        {msg ? <p className="text-sm text-ok">{msg}</p> : null}
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="surface flex justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{item.titleEn}</p>
              <p className="text-sm text-fg-muted">
                Avg: {item.priceAvg ?? "—"} {item.currency}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-sm text-accent"
                onClick={() =>
                  setForm({
                    id: item.id,
                    titleAr: item.titleAr,
                    titleEn: item.titleEn,
                    summaryAr: item.summaryAr,
                    summaryEn: item.summaryEn,
                    bodyAr: item.bodyAr,
                    bodyEn: item.bodyEn,
                    priceMin: item.priceMin != null ? String(item.priceMin) : "",
                    priceAvg: item.priceAvg != null ? String(item.priceAvg) : "",
                    priceMax: item.priceMax != null ? String(item.priceMax) : "",
                    currency: item.currency,
                    published: item.published,
                    sortOrder: item.sortOrder,
                  })
                }
              >
                Edit
              </button>
              <button
                type="button"
                className="text-sm text-danger"
                onClick={async () => {
                  if (!confirm("Delete?")) return;
                  await fetch(`/api/admin/services?id=${item.id}`, { method: "DELETE" });
                  load();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string | number;
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

function Text({
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
