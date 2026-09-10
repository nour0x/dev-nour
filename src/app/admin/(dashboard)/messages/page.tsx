import { MessagesManager } from "@/components/admin/MessagesManager";

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="display text-3xl font-bold">Messages</h1>
      <MessagesManager />
    </div>
  );
}
