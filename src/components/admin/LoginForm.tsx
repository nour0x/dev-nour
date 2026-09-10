"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="surface mx-auto w-full max-w-md space-y-4 p-8">
      <div>
        <h1 className="display text-3xl font-bold">Admin</h1>
        <p className="mt-2 text-sm text-fg-muted">Dev Nour control panel</p>
      </div>
      <div>
        <label htmlFor="email" className="admin-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="admin-input focus-ring"
          autoComplete="username"
        />
      </div>
      <div>
        <label htmlFor="password" className="admin-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="admin-input focus-ring"
          autoComplete="current-password"
        />
      </div>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary focus-ring w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
