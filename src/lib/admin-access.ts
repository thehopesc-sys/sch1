import { cookies } from "next/headers";

export const ADMIN_ACCESS_SCOPES = [
  "finance:overview",
  "finance:income",
  "finance:expenses",
  "finance:salaries",
  "analytics:overview",
  "analytics:today",
  "fees:overview",
  "fees:discounts",
  "school-settings:overview",
  "school-settings:landing",
] as const;

export type AdminAccessScope = (typeof ADMIN_ACCESS_SCOPES)[number];
export const FINANCE_ACCESS_SCOPES = {
  overview: "finance:overview",
  income: "finance:income",
  expenses: "finance:expenses",
  salaries: "finance:salaries",
} as const;
export const ADMIN_ACCESS_PASSWORD = process.env.FINANCE_ACCESS_PASSWORD || "todayschool";
export const ADMIN_ACCESS_MAX_AGE = 60 * 30;

export function isAdminAccessScope(value: unknown): value is AdminAccessScope {
  return typeof value === "string" && ADMIN_ACCESS_SCOPES.some((scope) => scope === value);
}

export function financeAccessScope(tab: unknown): AdminAccessScope | null {
  if (tab === "overview") return FINANCE_ACCESS_SCOPES.overview;
  if (tab === "income") return FINANCE_ACCESS_SCOPES.income;
  if (tab === "expenses") return FINANCE_ACCESS_SCOPES.expenses;
  if (tab === "salaries") return FINANCE_ACCESS_SCOPES.salaries;
  return null;
}

export function feesAccessScope(tab: unknown): AdminAccessScope | null {
  if (tab === undefined || tab === null || tab === "overview") return "fees:overview";
  if (tab === "discounts") return "fees:discounts";
  return null;
}

export function adminAccessCookieName(scope: AdminAccessScope) {
  return `admin_access_${scope.replace(":", "_")}`;
}

export async function hasAdminAccess(scope: AdminAccessScope) {
  return (await cookies()).get(adminAccessCookieName(scope))?.value === "1";
}
