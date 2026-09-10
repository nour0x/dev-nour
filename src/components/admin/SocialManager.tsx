"use client";

import { FormEvent, useEffect, useState } from "react";

type Social = {
  id: string;
  platform: string;
  labelAr: string;
  labelEn: string;
  url: string;
  sortOrder: number;
  published: boolean;
};

export function SocialManager() {
  const [items, setItems] = useState<Social[]>([]);
  const [form, setForm] = useState({
    id: "",
    platform: "",
    labelAr: "",
    labelEn: "",
    url: "",
    sortOrder: 0,
    published: true,
  });

  async function load() {
    setItems(await (await fetch("/api/admin/social")).json());
  }
  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: form.id || undefined }),
    });
    setForm({ id: "", platform: "", labelAr: "", labelEn: "", url: "", sortOrder: 0, published: true });
    load();
  }

  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <form onSubmit={onSubmit} className="surface space-y-3 p-5">
        <h2 className="text-lg font-semibold">Social links</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="admin-label">Platform</label>
            <input className="admin-input focus-ring" required value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">URL</label>
            <input className="admin-input focus-ring" required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Label AR</label>
            <input className="admin-input focus-ring" required value={form.labelAr} onChange={(e) => setForm({ ...form, labelAr: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Label EN</label>
            <input className="admin-input focus-ring" required value={form.labelEn} onChange={(e) => setForm({ ...form, labelEn: e.target.value })} />
          </div>
        </div>
        <button className="btn btn-primary focus-ring" type="submit">Save</button>
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="surface flex justify-between p-4">
            <div>
              <p className="font-medium">{item.labelEn}</p>
              <p className="text-sm text-fg-muted">{item.url}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-sm text-accent" onClick={() => setForm(item)}>Edit</button>
              <button type="button" className="text-sm text-danger" onClick={async () => {
                await fetch(`/api/admin/social?id=${item.id}`, { method: "DELETE" });
                load();
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
