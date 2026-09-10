import { ServicesManager } from "@/components/admin/ServicesManager";

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <h1 className="display text-3xl font-bold">Services / Activities</h1>
      <p className="text-fg-muted">Start a new activity with pricing and auto SEO.</p>
      <ServicesManager />
    </div>
  );
}
