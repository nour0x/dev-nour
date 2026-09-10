import { SkillsManager } from "@/components/admin/SkillsManager";

export default function AdminSkillsPage() {
  return (
    <div className="space-y-6">
      <h1 className="display text-3xl font-bold">Skills</h1>
      <SkillsManager />
    </div>
  );
}
