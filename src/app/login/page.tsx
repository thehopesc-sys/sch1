import { connectToDatabase } from "@/lib/mongodb";
import { SchoolConfiguration } from "@/Models";
import LoginPageClient from "./LoginPageClient";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  let schoolName = "Your School";
  let logo = "";
  try {
    await connectToDatabase();
    const school = await SchoolConfiguration.findOne()
      .sort({ updatedAt: -1, createdAt: -1 })
      .select("schoolName logo")
      .lean();
    schoolName = school?.schoolName || schoolName;
    logo = school?.logo || "";
  } catch (error) {
    console.error("Unable to load sign-in school branding:", error);
  }

  return <LoginPageClient schoolName={schoolName} logo={logo} />;
}
