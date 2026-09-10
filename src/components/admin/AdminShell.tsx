"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  Briefcase,
  FolderKanban,
  LayoutDashboard,
  Link2,
  LogOut,
  Mail,
  Menu,
  Settings,
  Sparkles,
  Wrench,
  X,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: Activity },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/experience", label: "Experience", icon: Sparkles },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/social", label: "Social", icon: Share2 },
  { href: "/admin/links", label: "Links", icon: Link2 },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const Nav = (
    <nav className="flex flex-col gap-1 p-3" aria-label="Admin">
      {nav.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fg-muted transition hover:bg-accent-dim hover:text-fg",
              active && "bg-accent-dim text-accent"
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={logout}
        className="focus-ring mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-danger hover:bg-danger/10"
      >
        <LogOut size={18} />
        Logout
      </button>
    </nav>
  );

  return (
    <div className="admin-shell flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-e border-border bg-[#0c1016] lg:block">
        <div className="border-b border-border px-5 py-5">
          <p className="display text-lg font-bold">Dev Nour</p>
          <p className="text-xs text-fg-muted">Admin Panel</p>
        </div>
        {Nav}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border px-4 lg:px-8">
          <button
            type="button"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </button>
          <p className="text-sm text-fg-muted">Control Center</p>
          <Link href="/en" className="text-sm text-accent hover:underline" target="_blank">
            View site
          </Link>
        </header>
        <div className="flex-1 p-4 lg:p-8">{children}</div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 start-0 w-72 bg-[#0c1016]">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <p className="font-semibold">Menu</p>
              <button
                type="button"
                className="focus-ring rounded-lg p-2"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            {Nav}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
