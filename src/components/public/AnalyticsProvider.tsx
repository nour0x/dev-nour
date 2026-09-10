"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

const VISITOR_KEY = "dn_vid";
const SESSION_KEY = "dn_sid";
const SESSION_TTL = 30 * 60 * 1000;

function rid(prefix = "e") {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

function getVisitorKey() {
  let key = localStorage.getItem(VISITOR_KEY);
  if (!key) {
    key = rid("v");
    localStorage.setItem(VISITOR_KEY, key);
  }
  return key;
}

function getSessionKey() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  const now = Date.now();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { key: string; at: number };
      if (now - parsed.at < SESSION_TTL) {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ key: parsed.key, at: now })
        );
        return parsed.key;
      }
    } catch {
      /* ignore */
    }
  }
  const key = rid("s");
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ key, at: now }));
  return key;
}

function utm(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

function readableLabel(el: HTMLElement) {
  return (
    el.getAttribute("data-track") ||
    el.getAttribute("aria-label") ||
    el.innerText?.trim().slice(0, 80) ||
    el.tagName.toLowerCase()
  );
}

type Queued = Record<string, unknown> & {
  clientEventId: string;
  type: string;
};

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queue = useRef<Queued[]>([]);
  const viewKey = useRef<string>("");
  const enteredAt = useRef<number>(0);
  const activeMs = useRef<number>(0);
  const activeTick = useRef<number>(0);
  const scrollMax = useRef<number>(0);
  const prevPath = useRef<string>("");
  const flushing = useRef(false);

  async function flush() {
    if (flushing.current || queue.current.length === 0) return;
    flushing.current = true;
    const batch = queue.current.splice(0, 40);
    try {
      await fetch("/api/analytics/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorKey: getVisitorKey(),
          sessionKey: getSessionKey(),
          userAgent: navigator.userAgent,
          language: navigator.language,
          device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
          referrer: document.referrer || null,
          utmSource: utm("utm_source"),
          utmMedium: utm("utm_medium"),
          utmCampaign: utm("utm_campaign"),
          events: batch,
        }),
        keepalive: true,
      });
    } catch {
      queue.current.unshift(...batch);
    } finally {
      flushing.current = false;
    }
  }

  function push(event: Queued) {
    queue.current.push(event);
    if (queue.current.length >= 8) flush();
  }

  useEffect(() => {
    const path = pathname || "/";
    const from = prevPath.current || null;

    if (viewKey.current) {
      const duration = Date.now() - enteredAt.current;
      push({
        clientEventId: rid("leave"),
        type: "page_leave",
        viewKey: viewKey.current,
        path: prevPath.current,
        durationMs: duration,
        activeMs: activeMs.current,
        scrollMax: scrollMax.current,
      });
      if (from && from !== path) {
        push({
          clientEventId: rid("nav"),
          type: "navigate",
          fromPath: from,
          toPath: path,
          path,
          label: `${from} → ${path}`,
        });
      }
    }

    viewKey.current = rid("pv");
    enteredAt.current = Date.now();
    activeMs.current = 0;
    activeTick.current = Date.now();
    scrollMax.current = 0;

    push({
      clientEventId: viewKey.current,
      type: "page_enter",
      viewKey: viewKey.current,
      path,
      title: document.title,
      fromPath: from,
    });

    prevPath.current = path;
    flush();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.round((doc.scrollTop / max) * 100) : 0;
      scrollMax.current = Math.max(scrollMax.current, pct);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        activeMs.current += Date.now() - activeTick.current;
        flush();
      } else {
        activeTick.current = Date.now();
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest(
        "a,button,[role='button'],.btn,[data-track]"
      ) as HTMLElement | null;
      if (!el) return;
      const href = el instanceof HTMLAnchorElement ? el.href : el.getAttribute("href");
      push({
        clientEventId: rid("clk"),
        type: "click",
        path: pathname || "/",
        label: readableLabel(el),
        target: href || el.id || el.className?.toString?.().slice(0, 120) || el.tagName,
        meta: {
          tag: el.tagName.toLowerCase(),
          text: el.innerText?.trim().slice(0, 120) || "",
        },
      });
    };

    const heartbeat = window.setInterval(() => {
      if (!viewKey.current) return;
      if (document.visibilityState === "visible") {
        activeMs.current += Date.now() - activeTick.current;
        activeTick.current = Date.now();
      }
      push({
        clientEventId: rid("hb"),
        type: "heartbeat",
        viewKey: viewKey.current,
        path: pathname || "/",
        durationMs: Date.now() - enteredAt.current,
        activeMs: activeMs.current,
        scrollMax: scrollMax.current,
      });
      flush();
    }, 20000);

    const flushTimer = window.setInterval(flush, 15000);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", flush);

    return () => {
      window.clearInterval(heartbeat);
      window.clearInterval(flushTimer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", flush);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <>{children}</>;
}
