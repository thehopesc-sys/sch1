import { cookies } from "next/headers";

export const ADMIN_ACCESS_COOKIE = "finance_unlocked";
export const ADMIN_ACCESS_PASSWORD = process.env.FINANCE_ACCESS_PASSWORD || "todayschool";
export const ADMIN_ACCESS_MAX_AGE = 60 * 30;

export async function hasAdminAccess() {
  return (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value === "1";
}
