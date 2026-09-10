"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesManager() {
  const [items, setItems] = useState<Message[]>([]);

  async function load() {
    setItems(await (await fetch("/api/admin/messages")).json());
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-fg-muted">No messages yet.</p>
      ) : (
        items.map((item) => (
          <article key={item.id} className="surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">
                  {item.name}{" "}
                  {!item.read ? (
                    <span className="ms-2 rounded-full bg-accent-dim px-2 py-0.5 text-xs text-accent">
                      new
                    </span>
                  ) : null}
                </h2>
                <p className="text-sm text-fg-muted">
                  {item.email} · {new Date(item.createdAt).toLocaleString()}
                </p>
                {item.subject ? <p className="mt-2 font-medium">{item.subject}</p> : null}
              </div>
              <div className="flex gap-2">
                {!item.read ? (
                  <button
                    type="button"
                    className="text-sm text-accent"
                    onClick={async () => {
                      await fetch("/api/admin/messages", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: item.id, read: true }),
                      });
                      load();
                    }}
                  >
                    Mark read
                  </button>
                ) : null}
                <button
                  type="button"
                  className="text-sm text-danger"
                  onClick={async () => {
                    await fetch(`/api/admin/messages?id=${item.id}`, { method: "DELETE" });
                    load();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-fg-muted">{item.message}</p>
          </article>
        ))
      )}
    </div>
  );
}
