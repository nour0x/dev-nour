import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-fg-muted">
          Precise visits, dwell time, clicks, and path-to-path journeys — deduplicated by event id.
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
