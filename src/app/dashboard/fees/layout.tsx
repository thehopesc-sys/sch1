import { redirect } from "next/navigation";
import AdminAccessGate from "@/components/AdminAccessGate";
import { getCurrentUser } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/admin-access";

export default async function FeesLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentUser();
  if (!session.authenticated || session.user?.role !== "admin") redirect("/dashboard");
  if (!await hasAdminAccess()) return <AdminAccessGate area="fees" />;
  return children;
}
