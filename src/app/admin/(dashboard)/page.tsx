import { DashboardStats } from "@/components/admin/DashboardStats";

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-fg-muted">Overview of Dev Nour portfolio content.</p>
      </div>
      <DashboardStats />
    </div>
  );
}
