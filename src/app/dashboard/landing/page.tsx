import { redirect } from "next/navigation";
import AdminAccessGate from "@/components/AdminAccessGate";
import { getCurrentUser } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/admin-access";
import LandingWorkspace from "./LandingWorkspace";

export default async function LandingPage() {
  const session = await getCurrentUser();
  if (!session.authenticated || session.user?.role !== "admin") redirect("/dashboard");
  if (!await hasAdminAccess("school-settings:landing")) {
    return <AdminAccessGate scope="school-settings:landing" />;
  }
  return <LandingWorkspace />;
}
