"use client";

import { useEffect, useState } from "react";

type AnalyticsPayload = {
  kpis: {
    visitors: number;
    sessions: number;
    pageViews: number;
    clicks: number;
    avgSessionMs: number;
    avgPages: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    avgDurationMs: number;
    avgActiveMs: number;
    avgScroll: number;
  }>;
  topClicks: Array<{ label: string; target: string; count: number }>;
  journeys: Array<{ from: string | null; to: string | null; at: string }>;
  sessions: Array<{
    id: string;
    visitorKey: string;
    device: string | null;
    language: string | null;
    durationMs: number;
    pageCount: number;
    eventCount: number;
    landingPath: string | null;
    exitPath: string | null;
    referrer: string | null;
    lastActiveAt: string;
    path: Array<{
      path: string;
      from: string | null;
      durationMs: number;
      activeMs: number;
      scrollMax: number;
    }>;
    actions: Array<{
      type: string;
      label: string | null;
      target: string | null;
      fromPath: string | null;
      toPath: string | null;
      path: string | null;
    }>;
  }>;
};

function fmtMs(ms: number) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

export function AnalyticsDashboard() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/analytics?range=${range}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [range]);

  if (!data) {
    return <p className="text-fg-muted">Loading analytics…</p>;
  }

  const k = data.kpis;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {["1d", "7d", "30d"].map((r) => (
          <button
            key={r}
            type="button"
            className={`btn focus-ring !min-h-9 !px-3 !py-1.5 text-sm ${
              range === r ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Visitors", k.visitors],
          ["Sessions", k.sessions],
          ["Page views", k.pageViews],
          ["Clicks", k.clicks],
          ["Avg session", fmtMs(k.avgSessionMs)],
          ["Avg pages / session", k.avgPages],
        ].map(([label, value]) => (
          <div key={String(label)} className="surface p-5">
            <p className="text-sm text-fg-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-accent">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="surface p-5">
          <h2 className="text-lg font-semibold">Top pages</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.topPages.map((p) => (
              <li key={p.path} className="border-b border-border pb-3">
                <p className="font-medium">{p.path}</p>
                <p className="mt-1 text-fg-muted">
                  {p.views} views · stay {fmtMs(p.avgDurationMs)} · active{" "}
                  {fmtMs(p.avgActiveMs)} · scroll {p.avgScroll}%
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-5">
          <h2 className="text-lg font-semibold">Top clicks</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.topClicks.map((c, i) => (
              <li key={`${c.label}-${i}`} className="border-b border-border pb-3">
                <p className="font-medium">{c.label}</p>
                <p className="mt-1 truncate text-fg-muted">
                  {c.count}× · {c.target}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="surface p-5">
        <h2 className="text-lg font-semibold">Navigation flow</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {data.journeys.map((j, i) => (
            <li key={`${j.at}-${i}`} className="text-fg-muted">
              <span className="text-fg">{j.from || "(entry)"}</span>
              {" → "}
              <span className="text-accent">{j.to}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sessions (precise journeys)</h2>
        {data.sessions.map((s) => (
          <article key={s.id} className="surface p-4">
            <button
              type="button"
              className="flex w-full items-start justify-between gap-3 text-start"
              onClick={() => setOpen(open === s.id ? null : s.id)}
            >
              <div>
                <p className="font-medium">
                  {s.device || "device"} · {s.language || "lang"} ·{" "}
                  {fmtMs(s.durationMs)}
                </p>
                <p className="mt-1 text-sm text-fg-muted">
                  {s.landingPath} → {s.exitPath} · {s.pageCount} pages ·{" "}
                  {s.eventCount} events
                </p>
              </div>
              <span className="text-accent">{open === s.id ? "−" : "+"}</span>
            </button>
            {open === s.id ? (
              <div className="mt-4 space-y-4 border-t border-border pt-4 text-sm">
                <p className="text-fg-muted">
                  Visitor {s.visitorKey.slice(0, 12)}… · ref {s.referrer || "direct"}
                </p>
                <div>
                  <p className="mb-2 font-medium">Pages & dwell</p>
                  <ol className="space-y-2">
                    {s.path.map((p, i) => (
                      <li key={`${p.path}-${i}`}>
                        {i + 1}. {p.from ? `${p.from} → ` : ""}
                        <strong>{p.path}</strong> — stay {fmtMs(p.durationMs)},
                        active {fmtMs(p.activeMs)}, scroll {p.scrollMax}%
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="mb-2 font-medium">Clicks & moves</p>
                  <ul className="space-y-1 text-fg-muted">
                    {s.actions.map((a, i) => (
                      <li key={i}>
                        [{a.type}] {a.label || a.target || `${a.fromPath} → ${a.toPath}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
