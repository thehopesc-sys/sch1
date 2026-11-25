import { connectToDatabase } from "@/lib/mongodb";
import { SchoolConfiguration } from "@/Models";
import LandingNav from "@/components/LandingNav";
import {
  publishedNews,
  readLanding,
  visibleAcademicPrograms,
  visibleFacilities,
  visibleGallery,
  visibleUpcomingEvents,
} from "@/lib/landing";
import LoginPageClient from "./LoginPageClient";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  let schoolName = "Your School";
  let school: Record<string, unknown> | null = null;
  try {
    await connectToDatabase();
    school = await SchoolConfiguration.findOne()
      .sort({ updatedAt: -1, createdAt: -1 })
      .select("schoolName logo homepageCopy whyUs academicPrograms newsPosts upcomingEvents facilities gallery")
      .lean();
    if (typeof school?.schoolName === "string" && school.schoolName) schoolName = school.schoolName;
  } catch (error) {
    console.error("Unable to load sign-in school branding:", error);
  }

  const content = readLanding(school);
  const hasHighlights = content.whyUs.some((item) => item.title || item.description);
  const hasAcademics = visibleAcademicPrograms(content).length > 0;
  const hasNews = publishedNews(content).length > 0;
  const hasEvents = visibleUpcomingEvents(content).length > 0;
  const hasFacilities = visibleFacilities(content).length > 0;
  const hasGallery = visibleGallery(content).length > 0;

  return (
    <main className="signin-page">
      <LandingNav
        schoolName={schoolName}
        logo={content.logo || "/logo.png"}
        copy={content.homepageCopy}
        hasHighlights={hasHighlights}
        hasAcademics={hasAcademics}
        hasNews={hasNews}
        hasEvents={hasEvents}
        hasFacilities={hasFacilities}
        hasGallery={hasGallery}
        showSignIn={false}
      />
      <LoginPageClient schoolName={schoolName} />
    </main>
  );
}
