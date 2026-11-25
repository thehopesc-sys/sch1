import { NextResponse } from "next/server";
import { ADMIN_ACCESS_SCOPES, adminAccessCookieName } from "@/lib/admin-access";

function clearAdminAccessCookies(response: NextResponse) {
  for (const scope of ADMIN_ACCESS_SCOPES) {
    response.cookies.set(adminAccessCookieName(scope), "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    });
  }
  response.cookies.set("finance_unlocked", "", { httpOnly: true, expires: new Date(0), path: "/" });
  response.cookies.set("finance_unlocked", "", { httpOnly: true, expires: new Date(0), path: "/dashboard/finance" });
}

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    path: "/",
  });
  clearAdminAccessCookies(response);
  return response;
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    path: "/",
  });
  clearAdminAccessCookies(response);
  return response;
}
