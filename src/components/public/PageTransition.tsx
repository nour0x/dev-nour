"use client";

import type { ReactNode } from "react";

/** Lightweight wrapper — no framer route transitions (PageSpeed). */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-shell">{children}</div>;
}
