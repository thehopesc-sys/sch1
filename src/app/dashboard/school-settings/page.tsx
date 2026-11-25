import { redirect } from "next/navigation";
import AdminAccessGate from "@/components/AdminAccessGate";
import { getCurrentUser } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/admin-access";
import SchoolSettingsWorkspace from "./SchoolSettingsWorkspace";

export default async function SchoolSettingsPage() {
  const session = await getCurrentUser();
  if (!session.authenticated || session.user?.role !== "admin") redirect("/dashboard");
  if (!await hasAdminAccess("school-settings:overview")) {
    return <AdminAccessGate scope="school-settings:overview" />;
  }
  return <SchoolSettingsWorkspace />;
}
