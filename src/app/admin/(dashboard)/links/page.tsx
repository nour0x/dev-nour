import { LinksManager } from "@/components/admin/LinksManager";

export default function AdminLinksPage() {
  return (
    <div className="space-y-6">
      <h1 className="display text-3xl font-bold">Links</h1>
      <LinksManager />
    </div>
  );
}
