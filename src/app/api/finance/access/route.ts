import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import {
  ADMIN_ACCESS_MAX_AGE,
  ADMIN_ACCESS_PASSWORD,
  ADMIN_ACCESS_SCOPES,
  adminAccessCookieName,
  isAdminAccessScope,
} from "@/lib/admin-access";

export async function POST(request: Request) {
  const session = await getCurrentUser();
  if (!session.authenticated || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  }
  const body = await request.json().catch(() => null) as { password?: unknown; scope?: unknown } | null;
  if (typeof body?.password !== "string" || body.password !== ADMIN_ACCESS_PASSWORD) {
    return NextResponse.json({ error: "Incorrect admin access password" }, { status: 401 });
  }
  if (!isAdminAccessScope(body.scope)) {
    return NextResponse.json({ error: "A valid protected section is required" }, { status: 400 });
  }
  (await cookies()).set(adminAccessCookieName(body.scope), "1", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_ACCESS_MAX_AGE,
    path: "/",
  });
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const session = await getCurrentUser();
  if (!session.authenticated || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  }
  const cookieStore = await cookies();
  for (const scope of ADMIN_ACCESS_SCOPES) {
    cookieStore.set(adminAccessCookieName(scope), "", { httpOnly: true, expires: new Date(0), path: "/" });
  }
  cookieStore.set("finance_unlocked", "", { httpOnly: true, expires: new Date(0), path: "/" });
  cookieStore.set("finance_unlocked", "", { httpOnly: true, expires: new Date(0), path: "/dashboard/finance" });
  return NextResponse.json({ success: true });
}
