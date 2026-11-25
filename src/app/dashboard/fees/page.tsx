import { redirect } from "next/navigation";
import AdminAccessGate from "@/components/AdminAccessGate";
import { getCurrentUser } from "@/lib/auth";
import { hasAdminAccess } from "@/lib/admin-access";
import FeesWorkspace from "./FeesWorkspace";

export default async function FeesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getCurrentUser();
  if (!session.authenticated || session.user?.role !== "admin") redirect("/dashboard");
  const params = await searchParams;
  const scope = params.tab === "discounts" ? "fees:discounts" : "fees:overview";
  if (!await hasAdminAccess(scope)) return <AdminAccessGate scope={scope} />;
  return <FeesWorkspace />;
}
