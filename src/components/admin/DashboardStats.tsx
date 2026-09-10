"use client";

import { useEffect, useState } from "react";

type Stats = {
  projects: number;
  services: number;
  messages: number;
  unread: number;
  skills: number;
  experience: number;
};

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const cards = [
    { label: "Projects", value: stats?.projects },
    { label: "Services", value: stats?.services },
    { label: "Skills", value: stats?.skills },
    { label: "Experience", value: stats?.experience },
    { label: "Messages", value: stats?.messages },
    { label: "Unread", value: stats?.unread },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="surface p-5">
          <p className="text-sm text-fg-muted">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-accent">
            {card.value ?? "—"}
          </p>
        </div>
      ))}
    </div>
  );
}
