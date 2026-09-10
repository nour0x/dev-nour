import { SettingsManager } from "@/components/admin/SettingsManager";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="display text-3xl font-bold">Settings</h1>
      <SettingsManager />
    </div>
  );
}
