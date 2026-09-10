"use client";

import { FormEvent, useEffect, useState } from "react";

type Item = {
  id: string;
  companyAr: string;
  companyEn: string;
  roleAr: string;
  roleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  locationAr?: string | null;
  locationEn?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  sortOrder: number;
  published: boolean;
};

const empty = {
  id: "",
  companyAr: "",
  companyEn: "",
  roleAr: "",
  roleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  locationAr: "",
  locationEn: "",
  startDate: "",
  endDate: "",
  current: false,
  sortOrder: 0,
  published: true,
};

export function ExperienceManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(empty);

  async function load() {
    setItems(await (await fetch("/api/admin/experience")).json());
  }
  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        id: form.id || undefined,
        locationAr: form.locationAr || null,
        locationEn: form.locationEn || null,
        endDate: form.endDate || null,
        sortOrder: Number(form.sortOrder) || 0,
      }),
    });
    setForm(empty);
    load();
  }

  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <form onSubmit={onSubmit} className="surface space-y-3 p-5">
        <h2 className="text-lg font-semibold">{form.id ? "Edit" : "Add experience"}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <F label="Company AR" v={form.companyAr} set={(v) => setForm({ ...form, companyAr: v })} />
          <F label="Company EN" v={form.companyEn} set={(v) => setForm({ ...form, companyEn: v })} />
          <F label="Role AR" v={form.roleAr} set={(v) => setForm({ ...form, roleAr: v })} />
          <F label="Role EN" v={form.roleEn} set={(v) => setForm({ ...form, roleEn: v })} />
          <F label="Start" v={form.startDate} set={(v) => setForm({ ...form, startDate: v })} />
          <F label="End" v={form.endDate} set={(v) => setForm({ ...form, endDate: v })} />
        </div>
        <div>
          <label className="admin-label">Description EN</label>
          <textarea className="admin-textarea focus-ring" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Description AR</label>
          <textarea className="admin-textarea focus-ring" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} />
          Current role
        </label>
        <button className="btn btn-primary focus-ring" type="submit">Save</button>
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="surface flex justify-between p-4">
            <div>
              <p className="font-medium">{item.roleEn}</p>
              <p className="text-sm text-fg-muted">{item.companyEn}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-sm text-accent" onClick={() => setForm({
                id: item.id,
                companyAr: item.companyAr,
                companyEn: item.companyEn,
                roleAr: item.roleAr,
                roleEn: item.roleEn,
                descriptionAr: item.descriptionAr,
                descriptionEn: item.descriptionEn,
                locationAr: item.locationAr || "",
                locationEn: item.locationEn || "",
                startDate: item.startDate,
                endDate: item.endDate || "",
                current: item.current,
                sortOrder: item.sortOrder,
                published: item.published,
              })}>Edit</button>
              <button type="button" className="text-sm text-danger" onClick={async () => {
                await fetch(`/api/admin/experience?id=${item.id}`, { method: "DELETE" });
                load();
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function F({ label, v, set }: { label: string; v: string; set: (v: string) => void }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <input className="admin-input focus-ring" value={v} required onChange={(e) => set(e.target.value)} />
    </div>
  );
}
