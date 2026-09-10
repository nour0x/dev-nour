import { ProjectsManager } from "@/components/admin/ProjectsManager";

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="display text-3xl font-bold">Projects</h1>
      <ProjectsManager />
    </div>
  );
}
