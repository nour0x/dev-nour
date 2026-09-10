"use client";

import { FormEvent, useEffect, useState } from "react";

type Skill = {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  level: number;
  sortOrder: number;
  published: boolean;
};

export function SkillsManager() {
  const [items, setItems] = useState<Skill[]>([]);
  const [form, setForm] = useState({
    id: "",
    nameAr: "",
    nameEn: "",
    categoryAr: "عام",
    categoryEn: "General",
    level: 80,
    sortOrder: 0,
    published: true,
  });

  async function load() {
    setItems(await (await fetch("/api/admin/skills")).json());
  }
  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: form.id || undefined }),
    });
    setForm({
      id: "",
      nameAr: "",
      nameEn: "",
      categoryAr: "عام",
      categoryEn: "General",
      level: 80,
      sortOrder: 0,
      published: true,
    });
    load();
  }

  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <form onSubmit={onSubmit} className="surface space-y-3 p-5">
        <h2 className="text-lg font-semibold">{form.id ? "Edit skill" : "Add skill"}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="admin-label">Name AR</label>
            <input className="admin-input focus-ring" required value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Name EN</label>
            <input className="admin-input focus-ring" required value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Category AR</label>
            <input className="admin-input focus-ring" value={form.categoryAr} onChange={(e) => setForm({ ...form, categoryAr: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Category EN</label>
            <input className="admin-input focus-ring" value={form.categoryEn} onChange={(e) => setForm({ ...form, categoryEn: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Level (0-100)</label>
            <input type="number" min={0} max={100} className="admin-input focus-ring" value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} />
          </div>
        </div>
        <button className="btn btn-primary focus-ring" type="submit">Save</button>
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="surface flex justify-between p-4">
            <div>
              <p className="font-medium">{item.nameEn}</p>
              <p className="text-sm text-fg-muted">{item.level}%</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-sm text-accent" onClick={() => setForm(item)}>Edit</button>
              <button type="button" className="text-sm text-danger" onClick={async () => {
                await fetch(`/api/admin/skills?id=${item.id}`, { method: "DELETE" });
                load();
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
