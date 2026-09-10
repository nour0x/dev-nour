"use client";

import { FormEvent, useEffect, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function SettingsManager() {
  const [profile, setProfile] = useState({
    brandName: "Dev Nour",
    nameAr: "",
    nameEn: "",
    titleAr: "",
    titleEn: "",
    bioAr: "",
    bioEn: "",
    email: "",
    phone: "",
    githubUrl: "",
    locationAr: "",
    locationEn: "",
    avatarUrl: "",
    resumeUrl: "",
    age: "",
    yearsExperience: "5",
  });
  const [settings, setSettings] = useState({
    siteUrl: "http://localhost:3000",
    defaultMetaTitleAr: "",
    defaultMetaTitleEn: "",
    defaultMetaDescAr: "",
    defaultMetaDescEn: "",
    ogImageUrl: "",
    accentColor: "#ff2d55",
    googleVerificationMeta: "",
    googleVerificationFile: "",
    googleVerificationHtml: "",
  });
  const [msg, setMsg] = useState("");
  const [gBusy, setGBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setProfile({
            brandName: data.profile.brandName || "Dev Nour",
            nameAr: data.profile.nameAr || "",
            nameEn: data.profile.nameEn || "",
            titleAr: data.profile.titleAr || "",
            titleEn: data.profile.titleEn || "",
            bioAr: data.profile.bioAr || "",
            bioEn: data.profile.bioEn || "",
            email: data.profile.email || "",
            phone: data.profile.phone || "",
            githubUrl: data.profile.githubUrl || "",
            locationAr: data.profile.locationAr || "",
            locationEn: data.profile.locationEn || "",
            avatarUrl: data.profile.avatarUrl || "",
            resumeUrl: data.profile.resumeUrl || "",
            age: data.profile.age != null ? String(data.profile.age) : "",
            yearsExperience:
              data.profile.yearsExperience != null
                ? String(data.profile.yearsExperience)
                : "5",
          });
        }
        if (data.settings) {
          setSettings({
            siteUrl: data.settings.siteUrl || "",
            defaultMetaTitleAr: data.settings.defaultMetaTitleAr || "",
            defaultMetaTitleEn: data.settings.defaultMetaTitleEn || "",
            defaultMetaDescAr: data.settings.defaultMetaDescAr || "",
            defaultMetaDescEn: data.settings.defaultMetaDescEn || "",
            ogImageUrl: data.settings.ogImageUrl || "",
            accentColor: data.settings.accentColor || "#ff2d55",
            googleVerificationMeta: data.settings.googleVerificationMeta || "",
            googleVerificationFile: data.settings.googleVerificationFile || "",
            googleVerificationHtml: data.settings.googleVerificationHtml || "",
          });
        }
      });
  }, []);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    const payload = {
      ...profile,
      age: profile.age ? Number(profile.age) : null,
      yearsExperience: Number(profile.yearsExperience || 5),
    };
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "profile", data: payload }),
    });
    setMsg(res.ok ? "Profile saved" : "Profile save failed");
  }

  async function saveSettings(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "settings", data: settings }),
    });
    setMsg(res.ok ? "Settings saved" : "Settings save failed");
  }

  async function uploadGoogleFile(file: File | null) {
    if (!file) return;
    setGBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", "google-verification");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setGBusy(false);
    if (!res.ok) {
      setMsg(data.error || "Google file upload failed");
      return;
    }
    setSettings((s) => ({
      ...s,
      googleVerificationFile: data.filename,
      googleVerificationHtml: data.html,
    }));
    setMsg(`Google verification file live at /${data.filename} — click Save settings`);
  }

  return (
    <div className="space-y-8">
      {msg ? <p className="text-sm text-ok">{msg}</p> : null}

      <form onSubmit={saveProfile} className="surface space-y-4 p-5">
        <h2 className="text-lg font-semibold">Profile & photo</h2>
        <ImageUploader
          label="Profile photo (file upload)"
          value={profile.avatarUrl}
          onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["brandName", "Brand"],
              ["nameAr", "Name AR"],
              ["nameEn", "Name EN"],
              ["titleAr", "Title AR"],
              ["titleEn", "Title EN"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["githubUrl", "GitHub"],
              ["locationAr", "Location AR"],
              ["locationEn", "Location EN"],
              ["age", "Age"],
              ["yearsExperience", "Years of experience"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="admin-label">{label}</label>
              <input
                className="admin-input focus-ring"
                value={profile[key]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div>
          <label className="admin-label">Bio AR</label>
          <textarea
            className="admin-textarea focus-ring"
            value={profile.bioAr}
            onChange={(e) => setProfile({ ...profile, bioAr: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Bio EN</label>
          <textarea
            className="admin-textarea focus-ring"
            value={profile.bioEn}
            onChange={(e) => setProfile({ ...profile, bioEn: e.target.value })}
          />
        </div>
        <button className="btn btn-primary focus-ring" type="submit">
          Save profile
        </button>
      </form>

      <form onSubmit={saveSettings} className="surface space-y-4 p-5">
        <h2 className="text-lg font-semibold">SEO & Google Search Console</h2>
        <ImageUploader
          label="OG image (file upload)"
          value={settings.ogImageUrl}
          onChange={(url) => setSettings({ ...settings, ogImageUrl: url })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="admin-label">Site URL</label>
            <input
              className="admin-input focus-ring"
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Meta title AR</label>
            <input
              className="admin-input focus-ring"
              value={settings.defaultMetaTitleAr}
              onChange={(e) =>
                setSettings({ ...settings, defaultMetaTitleAr: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">Meta title EN</label>
            <input
              className="admin-input focus-ring"
              value={settings.defaultMetaTitleEn}
              onChange={(e) =>
                setSettings({ ...settings, defaultMetaTitleEn: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">Meta desc AR</label>
            <textarea
              className="admin-textarea focus-ring"
              value={settings.defaultMetaDescAr}
              onChange={(e) =>
                setSettings({ ...settings, defaultMetaDescAr: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">Meta desc EN</label>
            <textarea
              className="admin-textarea focus-ring"
              value={settings.defaultMetaDescEn}
              onChange={(e) =>
                setSettings({ ...settings, defaultMetaDescEn: e.target.value })
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label">
              Google meta verification content (optional)
            </label>
            <input
              className="admin-input focus-ring"
              placeholder="paste content value only from google-site-verification"
              value={settings.googleVerificationMeta}
              onChange={(e) =>
                setSettings({ ...settings, googleVerificationMeta: e.target.value })
              }
            />
          </div>
        </div>

        <div className="rounded-none border border-border p-4">
          <p className="font-medium">Google HTML verification file</p>
          <p className="mt-1 text-sm text-fg-muted">
            Upload the exact `googleXXXX.html` file from Search Console. It will be
            served at your domain root.
          </p>
          <input
            type="file"
            accept=".html,text/html"
            className="mt-3 block w-full text-sm"
            disabled={gBusy}
            onChange={(e) => uploadGoogleFile(e.target.files?.[0] || null)}
          />
          {settings.googleVerificationFile ? (
            <p className="mt-2 text-sm text-accent">
              Active file: /{settings.googleVerificationFile}
            </p>
          ) : null}
        </div>

        <p className="text-sm text-fg-muted">
          Mudiri Digi links stay locked as your company (founder attribution).
        </p>
        <button className="btn btn-primary focus-ring" type="submit">
          Save settings
        </button>
      </form>
    </div>
  );
}
