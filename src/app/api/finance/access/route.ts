import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { ADMIN_ACCESS_COOKIE, ADMIN_ACCESS_MAX_AGE, ADMIN_ACCESS_PASSWORD } from "@/lib/admin-access";

export async function POST(request: Request) {
  const session = await getCurrentUser();
  if (!session.authenticated || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  }
  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  if (typeof body?.password !== "string" || body.password !== ADMIN_ACCESS_PASSWORD) {
    return NextResponse.json({ error: "Incorrect admin access password" }, { status: 401 });
  }
  (await cookies()).set(ADMIN_ACCESS_COOKIE, "1", {
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
  cookieStore.set(ADMIN_ACCESS_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
  cookieStore.set(ADMIN_ACCESS_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/dashboard/finance" });
  return NextResponse.json({ success: true });
}
