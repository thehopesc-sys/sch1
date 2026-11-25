import { connectToDatabase } from "@/lib/mongodb";
import { SchoolConfiguration } from "@/Models";
import LandingNav from "@/components/LandingNav";
import { readHomepageCopy } from "@/lib/landing";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  let school: { schoolName?: string; schoolAddress?: string; schoolPhone?: string; schoolEmail?: string; logo?: string; homepageCopy?: unknown } | null = null;
  try {
    await connectToDatabase();
    school = await SchoolConfiguration.findOne().sort({ updatedAt: -1, createdAt: -1 }).select("schoolName schoolAddress schoolPhone schoolEmail logo homepageCopy").lean();
  } catch (error) {
    console.error("School contact configuration load error:", error);
  }
  const name = school?.schoolName || "Your School";
  const copy = readHomepageCopy(school?.homepageCopy);
  const address = school?.schoolAddress || "School address will appear after setup.";
  const mapUrl = school?.schoolAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.schoolAddress)}` : "";
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <LandingNav schoolName={name} logo={school?.logo || "/logo.png"} copy={copy} />
      <section id="admissions" className="public-page mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-10 sm:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400 sm:text-sm sm:tracking-[0.22em]">{copy.contactEyebrow}</p>
          <h1 className="mt-4 text-[clamp(1.75rem,8vw,3.75rem)] font-bold leading-tight">{copy.contactTitle}</h1>
          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">{copy.contactDescription}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-3 md:gap-5">
          <a
            href={school?.schoolEmail ? `mailto:${school.schoolEmail}` : undefined}
            className="public-card public-rgb-card min-h-44 transition"
          >
            <span className="text-2xl" aria-hidden="true">✉</span>
            <h2 className="mt-4 font-semibold">{copy.emailLabel}</h2>
            <p className="public-contact-value">{school?.schoolEmail || "Email not provided"}</p>
            {school?.schoolEmail && <span className="public-contact-action">Send an email →</span>}
          </a>
          <a
            href={school?.schoolPhone ? `tel:${school.schoolPhone.replace(/[^\d+]/g, "")}` : undefined}
            className="public-card public-rgb-card min-h-44 transition"
          >
            <span className="text-2xl" aria-hidden="true">☎</span>
            <h2 className="mt-4 font-semibold">{copy.phoneLabel}</h2>
            <p className="public-contact-value">{school?.schoolPhone || "Phone not provided"}</p>
            {school?.schoolPhone && <span className="public-contact-action">Call the school →</span>}
          </a>
          <a
            href={mapUrl || undefined}
            target="_blank"
            rel="noreferrer"
            className="public-card public-rgb-card min-h-44 transition"
          >
            <span className="text-2xl" aria-hidden="true">⌖</span>
            <h2 className="mt-4 font-semibold">{copy.visitLabel}</h2>
            <p className="public-contact-value">{address}</p>
            {mapUrl && <span className="public-contact-action">Open in Google Maps →</span>}
          </a>
        </div>
      </section>
    </main>
  );
}
