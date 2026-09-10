"use client";

import { FormEvent, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export function ContactForm() {
  const s = useTranslations("sections");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject") || (locale === "ar" ? "استشارة مجانية" : "Free consultation"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="surface mt-10 max-w-xl space-y-4 p-6">
      <div>
        <label htmlFor="name" className="admin-label">
          {s("name")}
        </label>
        <input
          id="name"
          name="name"
          required
          className="admin-input focus-ring"
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="email" className="admin-label">
          {s("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="admin-input focus-ring"
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="subject" className="admin-label">
          {s("subject")}
        </label>
        <select
          id="subject"
          name="subject"
          className="admin-select focus-ring"
          defaultValue={locale === "ar" ? "استشارة مجانية" : "Free consultation"}
        >
          <option value={locale === "ar" ? "استشارة مجانية" : "Free consultation"}>
            {s("consult")}
          </option>
          <option value={locale === "ar" ? "مشروع جديد" : "New project"}>
            {locale === "ar" ? "مشروع جديد" : "New project"}
          </option>
          <option value={locale === "ar" ? "تخصيص متجر" : "Store customization"}>
            {locale === "ar" ? "تخصيص متجر" : "Store customization"}
          </option>
          <option value={locale === "ar" ? "أخرى" : "Other"}>
            {locale === "ar" ? "أخرى" : "Other"}
          </option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="admin-label">
          {s("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="admin-textarea focus-ring"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary focus-ring"
        disabled={status === "loading"}
      >
        {status === "loading" ? "..." : s("send")}
      </button>
      {status === "ok" ? (
        <p className="text-sm text-ok" role="status">
          {s("success")}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-danger" role="alert">
          {s("error")}
        </p>
      ) : null}
    </form>
  );
}
