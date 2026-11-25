"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackLink from "@/components/BackLink";
import LandingImageUpload from "@/components/LandingImageUpload";
import {
  EMPTY_LANDING,
  type AcademicProgram,
  type AdmissionStep,
  type Facility,
  type GalleryImage,
  type HomepageCopy,
  type LandingContent,
  type NewsPost,
  type Recognition,
  type SchoolEvent,
  type Testimonial,
  type TopStudent,
  type WhyUsItem,
} from "@/lib/landing";

/**
 * Landing-page editor for the admin.
 *
 * Everything the public home page shows beyond the school's name and contact
 * details is edited here and stored on the school document (images live on
 * Cloudinary). The whole content is held in one piece of state and saved in a
 * single PATCH, so what the admin removes is genuinely gone from the page.
 */

/** A fresh, empty row ready for the admin to fill in. */
const blankStudent = (): TopStudent => ({ id: "", name: "", className: "", section: "", achievement: "", year: "", photo: "", photoPublicId: "" });
const blankNews = (): NewsPost => ({ id: "", title: "", description: "", image: "", imagePublicId: "", published: true, publishedAt: new Date().toISOString() });
const blankGallery = (): GalleryImage => ({ id: "", image: "", imagePublicId: "", caption: "", category: "" });
const blankWhyUs = (index: number): WhyUsItem => ({ id: "", number: String(index + 1).padStart(2, "0"), title: "", description: "", tone: "blue" });
const blankProgram = (): AcademicProgram => ({ id: "", title: "", gradeRange: "", description: "", image: "", imagePublicId: "" });
const blankFacility = (): Facility => ({ id: "", title: "", description: "", image: "", imagePublicId: "" });
const blankEvent = (): SchoolEvent => ({ id: "", title: "", date: "", time: "", location: "", description: "", image: "", imagePublicId: "", published: false });
const blankTestimonial = (): Testimonial => ({ id: "", name: "", role: "", message: "", published: false });
const blankAdmissionStep = (): AdmissionStep => ({ id: "", title: "", description: "" });
const blankRecognition = (): Recognition => ({ id: "", title: "", issuer: "", year: "" });

type HomepageCopyKey = keyof HomepageCopy;
type HomepageCopyField = { key: HomepageCopyKey; label: string; multiline?: boolean };

const homepageCopyGroups: { title: string; fields: HomepageCopyField[] }[] = [
  {
    title: "Announcement, hero, and navigation",
    fields: [
      { key: "announcementLabel", label: "Announcement label" },
      { key: "heroEyebrow", label: "Hero welcome line (use {schoolName} for the school name)" },
      { key: "heroPrimaryAction", label: "Primary hero button" },
      { key: "heroSecondaryAction", label: "Secondary hero button" },
      { key: "academicYearLabel", label: "Academic year prefix" },
      { key: "heroPhotoSubtitle", label: "Text over hero image" },
      { key: "heroVisualCaption", label: "Caption below hero image" },
      { key: "navHome", label: "Navigation: Home" },
      { key: "navAbout", label: "Navigation: About" },
      { key: "navHighlights", label: "Navigation: Our approach" },
      { key: "navAcademics", label: "Navigation: Academics" },
      { key: "navNews", label: "Navigation: Updates" },
      { key: "navEvents", label: "Navigation: Events" },
      { key: "navFacilities", label: "Navigation: Facilities" },
      { key: "navGallery", label: "Navigation: Gallery" },
      { key: "navContact", label: "Navigation: Contact" },
      { key: "navAdmissionAction", label: "Navigation admissions button" },
    ],
  },
  {
    title: "About the school",
    fields: [
      { key: "trustTitle", label: "Recognition section label" },
      { key: "aboutEyebrow", label: "About section label" },
      { key: "aboutTitle", label: "About heading" },
      { key: "aboutTitleAccent", label: "About heading accent" },
      { key: "aboutLink", label: "About page link" },
      { key: "missionLabel", label: "Mission label" },
      { key: "visionLabel", label: "Vision label" },
      { key: "highlightsEyebrow", label: "School strengths section label" },
      { key: "highlightsTitle", label: "School strengths heading" },
      { key: "highlightsDescription", label: "School strengths introduction", multiline: true },
      { key: "academicsEyebrow", label: "Academics section label" },
      { key: "academicsTitle", label: "Academics heading" },
      { key: "academicsDescription", label: "Academics introduction", multiline: true },
      { key: "academicsAction", label: "Program contact link" },
      { key: "principalEyebrow", label: "Principal message label" },
      { key: "principalRole", label: "Principal role" },
    ],
  },
  {
    title: "Community and school life",
    fields: [
      { key: "achievementsEyebrow", label: "Achievements section label" },
      { key: "achievementsTitle", label: "Achievements heading" },
      { key: "achievementsDescription", label: "Achievements introduction", multiline: true },
      { key: "achievementLabel", label: "Achievement card label" },
      { key: "testimonialsEyebrow", label: "Testimonials section label" },
      { key: "testimonialsTitle", label: "Testimonials heading" },
      { key: "testimonialsDescription", label: "Testimonials introduction", multiline: true },
      { key: "newsEyebrow", label: "News section label" },
      { key: "newsTitle", label: "News heading" },
      { key: "newsAction", label: "News contact link" },
      { key: "eventsEyebrow", label: "Events section label" },
      { key: "eventsTitle", label: "Events heading" },
      { key: "eventsDescription", label: "Events introduction", multiline: true },
      { key: "facilitiesEyebrow", label: "Facilities section label" },
      { key: "facilitiesTitle", label: "Facilities heading" },
      { key: "facilitiesDescription", label: "Facilities introduction", multiline: true },
      { key: "galleryEyebrow", label: "Gallery section label" },
      { key: "galleryTitle", label: "Gallery heading" },
      { key: "galleryDescription", label: "Gallery introduction", multiline: true },
    ],
  },
  {
    title: "Admissions and contact",
    fields: [
      { key: "admissionsEyebrow", label: "Admissions section label" },
      { key: "admissionsTitle", label: "Admissions heading" },
      { key: "admissionsDescription", label: "Admissions introduction", multiline: true },
      { key: "admissionsAction", label: "Admissions button" },
      { key: "admissionStepsTitle", label: "Application steps heading" },
      { key: "admissionRequirementsTitle", label: "Requirements heading" },
      { key: "contactEyebrow", label: "Contact section label" },
      { key: "contactTitle", label: "Contact heading" },
      { key: "contactDescription", label: "Contact introduction", multiline: true },
      { key: "contactAction", label: "Contact page link" },
      { key: "visitLabel", label: "Address link label" },
      { key: "phoneLabel", label: "Phone link label" },
      { key: "emailLabel", label: "Email link label" },
      { key: "whatsappAction", label: "WhatsApp button" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { key: "footerFallbackDescription", label: "Fallback school introduction", multiline: true },
      { key: "footerTagline", label: "Footer closing line" },
      { key: "footerHome", label: "Footer: Home" },
      { key: "footerAbout", label: "Footer: About" },
      { key: "footerContact", label: "Footer: Contact" },
      { key: "footerLogin", label: "Footer: Sign in" },
    ],
  },
];

/** A labelled single-line text input. */
function Field({ label, value, onChange, placeholder, className = "", maxLength = 160 }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; className?: string; maxLength?: number }) {
  return (
    <label className={`block text-sm font-medium text-slate-700 ${className}`}>
      {label}
      <input
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      <span className="mt-1 block text-right text-xs font-normal text-slate-400">{value.length}/{maxLength}</span>
    </label>
  );
}

/** A labelled multi-line text area. */
function Area({ label, value, onChange, placeholder, rows = 4, maxLength = 600 }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number; maxLength?: number }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <textarea
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      <span className="mt-1 block text-right text-xs font-normal text-slate-400">{value.length}/{maxLength}</span>
    </label>
  );
}

/** A section wrapper with a heading and an optional action on the right. */
function Panel({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export default function LandingEditorPage() {
  const router = useRouter();
  const [content, setContent] = useState<LandingContent>(EMPTY_LANDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/school-settings/landing", { cache: "no-store" })
      .then((response) => response.json())
      .then((result) => {
        if (result.landing) setContent(result.landing);
        else setError(result.error ?? "Unable to load the landing page content");
      })
      .catch(() => setError("Unable to load the landing page content"))
      .finally(() => setLoading(false));
  }, []);

  function patch(part: Partial<LandingContent>) {
    setMessage("");
    setContent((current) => ({ ...current, ...part }));
  }
  const setHomepageCopy = (key: HomepageCopyKey, value: string) => patch({ homepageCopy: { ...content.homepageCopy, [key]: value } });
  const setStudent = (index: number, part: Partial<TopStudent>) => patch({ topStudents: content.topStudents.map((item, i) => (i === index ? { ...item, ...part } : item)) });
  const setNews = (index: number, part: Partial<NewsPost>) => patch({ newsPosts: content.newsPosts.map((item, i) => (i === index ? { ...item, ...part } : item)) });
  const setGallery = (index: number, part: Partial<GalleryImage>) => patch({ gallery: content.gallery.map((item, i) => (i === index ? { ...item, ...part } : item)) });
  const setWhyUs = (index: number, part: Partial<WhyUsItem>) => patch({ whyUs: content.whyUs.map((item, i) => (i === index ? { ...item, ...part } : item)) });
  const setProgram = (index: number, part: Partial<AcademicProgram>) => patch({ academicPrograms: content.academicPrograms.map((item, i) => (i === index ? { ...item, ...part } : item)) });
  const setFacility = (index: number, part: Partial<Facility>) => patch({ facilities: content.facilities.map((item, i) => (i === index ? { ...item, ...part } : item)) });
  const setEvent = (index: number, part: Partial<SchoolEvent>) => patch({ upcomingEvents: content.upcomingEvents.map((item, i) => (i === index ? { ...item, ...part } : item)) });
  const setTestimonial = (index: number, part: Partial<Testimonial>) => patch({ testimonials: content.testimonials.map((item, i) => (i === index ? { ...item, ...part } : item)) });
  const setAdmissionStep = (index: number, part: Partial<AdmissionStep>) => patch({ admissionSteps: content.admissionSteps.map((item, i) => (i === index ? { ...item, ...part } : item)) });
  const setRecognition = (index: number, part: Partial<Recognition>) => patch({ recognitions: content.recognitions.map((item, i) => (i === index ? { ...item, ...part } : item)) });

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/school-settings/landing", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Unable to save the landing page content");
      } else {
        setContent(result.landing);
        setMessage("Landing page saved. Open the public page to see it live.");
        router.refresh();
      }
    } catch {
      setError("Unable to connect to the server");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="app-page bg-slate-100 p-6 text-slate-900">Loading landing page content…</main>;
  }
  return (
    <main className="app-page bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-4xl">
        <BackLink />
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Landing page</h1>
            <p className="mt-2 max-w-2xl text-slate-500">Edit everything visitors see on your public home page. Images are stored on Cloudinary.</p>
          </div>
          <Link href="/" target="_blank" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Preview public page ↗
          </Link>
        </div>

        <div className="mt-6 space-y-6">
          <Panel title="Homepage text and headings" description="Change the public-facing wording while keeping the page layout and interaction labels clear.">
            <section className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <h3 className="text-sm font-semibold text-slate-800">Homepage hero headline</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">These two saved fields control the large headline at the top of your public homepage.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Headline — first line"
                  value={content.homepageCopy.heroTitle}
                  onChange={(value) => setHomepageCopy("heroTitle", value)}
                  maxLength={600}
                />
                <Field
                  label="Headline — accent line"
                  value={content.homepageCopy.heroTitleAccent}
                  onChange={(value) => setHomepageCopy("heroTitleAccent", value)}
                  maxLength={600}
                />
              </div>
            </section>
            {homepageCopyGroups.map((group) => (
              <details key={group.title} className="rounded-xl border border-slate-200 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-800">{group.title}</summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {group.fields.map((field) => field.multiline ? (
                    <Area
                      key={field.key}
                      label={field.label}
                      value={content.homepageCopy[field.key]}
                      onChange={(value) => setHomepageCopy(field.key, value)}
                      rows={2}
                      maxLength={600}
                    />
                  ) : (
                    <Field
                      key={field.key}
                      label={field.label}
                      value={content.homepageCopy[field.key]}
                      onChange={(value) => setHomepageCopy(field.key, value)}
                      maxLength={600}
                    />
                  ))}
                </div>
              </details>
            ))}
          </Panel>

          <Panel title="Hero banner" description="The first thing visitors see: a cover photo and a short tagline under the school name.">
            <LandingImageUpload kind="cover" label="Cover photo" frameClass="aspect-video w-full sm:w-56" value={content.coverImage} onChange={(url, publicId) => patch({ coverImage: url, coverImagePublicId: publicId })} hint="Use a 16:9 landscape photo. The homepage displays the full image in a matching 16:9 frame." />
            <Field label="Tagline" value={content.tagline} onChange={(value) => patch({ tagline: value })} placeholder="A clearer school day for every learner." />
          </Panel>

          <Panel title="Mission & vision" description="Two short statements about why the school exists and where it is headed.">
            <Area label="Our mission" value={content.mission} onChange={(value) => patch({ mission: value })} placeholder="To give every learner a strong, supportive start…" maxLength={4000} />
            <Area label="Our vision" value={content.vision} onChange={(value) => patch({ vision: value })} placeholder="To be the school families trust most…" maxLength={4000} />
          </Panel>

          <Panel
            title="Recognition and affiliations"
            description="List only verified awards, accreditation, and educational affiliations."
            action={<button type="button" disabled={content.recognitions.length >= 12} onClick={() => patch({ recognitions: [...content.recognitions, blankRecognition()] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">+ Add recognition</button>}
          >
            {content.recognitions.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No verified recognitions added. This trust section stays hidden until the school adds one.</p> : (
              <div className="space-y-4">
                {content.recognitions.map((item, index) => (
                  <div key={item.id || index} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-700">Recognition {index + 1}</p><button type="button" onClick={() => patch({ recognitions: content.recognitions.filter((_, i) => i !== index) })} className="text-xs font-semibold text-rose-600 hover:underline">Remove</button></div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <Field label="Award or affiliation" value={item.title} onChange={(value) => setRecognition(index, { title: value })} placeholder="Official recognition name" className="sm:col-span-1" />
                      <Field label="Awarding organization" value={item.issuer} onChange={(value) => setRecognition(index, { issuer: value })} placeholder="Verified organization" className="sm:col-span-1" />
                      <Field label="Year" value={item.year} onChange={(value) => setRecognition(index, { year: value })} placeholder="e.g. 2025" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Why families choose us"
            description="These cards appear in the Why us section on the public landing page. Keep each one short and specific."
            action={<button type="button" onClick={() => patch({ whyUs: [...content.whyUs, blankWhyUs(content.whyUs.length)] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">+ Add card</button>}
          >
            {content.whyUs.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">No Why us cards yet. Add the benefits your school is known for.</p> : (
              <div className="space-y-4">
                {content.whyUs.map((item, index) => (
                  <div key={item.id || index} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-700">Card {index + 1}</p><button type="button" onClick={() => patch({ whyUs: content.whyUs.filter((_, i) => i !== index) })} className="text-xs font-semibold text-rose-600 hover:underline">Remove</button></div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <Field label="Number" value={item.number} onChange={(value) => setWhyUs(index, { number: value })} placeholder="01" />
                      <Field label="Title" value={item.title} onChange={(value) => setWhyUs(index, { title: value })} placeholder="Supportive learning" className="sm:col-span-2" />
                      <Area label="Description" value={item.description} onChange={(value) => setWhyUs(index, { description: value })} placeholder="Describe this school's strength…" rows={3} maxLength={600} />
                      <label className="text-sm font-medium">Accent
                        <select value={item.tone} onChange={(event) => setWhyUs(index, { tone: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="blue">Blue</option><option value="emerald">Emerald</option><option value="violet">Violet</option><option value="amber">Amber</option></select>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Academic programs"
            description="Add only the learning programs and grade ranges the school currently offers. Empty drafts stay off the public page."
            action={<button type="button" disabled={content.academicPrograms.length >= 12} onClick={() => patch({ academicPrograms: [...content.academicPrograms, blankProgram()] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">+ Add program</button>}
          >
            {content.academicPrograms.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No programs yet. Add real programs before this section appears publicly.</p> : (
              <div className="space-y-4">
                {content.academicPrograms.map((item, index) => (
                  <div key={item.id || index} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-700">Program {index + 1}</p><button type="button" onClick={() => patch({ academicPrograms: content.academicPrograms.filter((_, i) => i !== index) })} className="text-xs font-semibold text-rose-600 hover:underline">Remove</button></div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-start">
                      <LandingImageUpload kind="program" label="Program image" frameClass="h-28 w-40 rounded-xl" value={item.image} onChange={(url, publicId) => setProgram(index, { image: url, imagePublicId: publicId })} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Program name" value={item.title} onChange={(value) => setProgram(index, { title: value })} placeholder="Use the school's official program name" />
                        <Field label="Grades or age range" value={item.gradeRange} onChange={(value) => setProgram(index, { gradeRange: value })} placeholder="e.g. Grades 1–5" />
                        <Area label="Description" value={item.description} onChange={(value) => setProgram(index, { description: value })} placeholder="Describe this program accurately…" rows={3} maxLength={600} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Campus facilities"
            description="Show facilities that families can actually find at the school. These cards are hidden until a title is added."
            action={<button type="button" disabled={content.facilities.length >= 16} onClick={() => patch({ facilities: [...content.facilities, blankFacility()] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">+ Add facility</button>}
          >
            {content.facilities.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No facilities yet. Add verified campus facilities to show this section.</p> : (
              <div className="space-y-4">
                {content.facilities.map((item, index) => (
                  <div key={item.id || index} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-700">Facility {index + 1}</p><button type="button" onClick={() => patch({ facilities: content.facilities.filter((_, i) => i !== index) })} className="text-xs font-semibold text-rose-600 hover:underline">Remove</button></div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-start">
                      <LandingImageUpload kind="facility" label="Facility image" frameClass="h-28 w-40 rounded-xl" value={item.image} onChange={(url, publicId) => setFacility(index, { image: url, imagePublicId: publicId })} />
                      <div className="space-y-3">
                        <Field label="Facility name" value={item.title} onChange={(value) => setFacility(index, { title: value })} placeholder="Use a real facility name" />
                        <Area label="Description" value={item.description} onChange={(value) => setFacility(index, { description: value })} placeholder="Add a short, factual description…" rows={3} maxLength={600} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Upcoming events"
            description="Only published events with a future date appear on the public page."
            action={<button type="button" disabled={content.upcomingEvents.length >= 24} onClick={() => patch({ upcomingEvents: [...content.upcomingEvents, blankEvent()] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">+ Add event</button>}
          >
            {content.upcomingEvents.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No events yet. Add a confirmed event date before publishing.</p> : (
              <div className="space-y-4">
                {content.upcomingEvents.map((item, index) => (
                  <div key={item.id || index} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={item.published} onChange={(event) => setEvent(index, { published: event.target.checked })} className="h-4 w-4 rounded border-slate-300" />Published</label>
                      <button type="button" onClick={() => patch({ upcomingEvents: content.upcomingEvents.filter((_, i) => i !== index) })} className="text-xs font-semibold text-rose-600 hover:underline">Remove</button>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-start">
                      <LandingImageUpload kind="event" label="Event image" frameClass="h-28 w-40 rounded-xl" value={item.image} onChange={(url, publicId) => setEvent(index, { image: url, imagePublicId: publicId })} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Event name" value={item.title} onChange={(value) => setEvent(index, { title: value })} placeholder="Use the confirmed event name" />
                        <label className="block text-sm font-medium text-slate-700">Date
                          <input type="date" value={item.date ? item.date.slice(0, 10) : ""} onChange={(event) => setEvent(index, { date: event.target.value ? `${event.target.value}T12:00:00.000Z` : "" })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </label>
                        <Field label="Time" value={item.time} onChange={(value) => setEvent(index, { time: value })} placeholder="e.g. 9:00 AM" />
                        <Field label="Location" value={item.location} onChange={(value) => setEvent(index, { location: value })} placeholder="e.g. School auditorium" />
                        <Area label="Description" value={item.description} onChange={(value) => setEvent(index, { description: value })} placeholder="Event details for families…" rows={3} maxLength={600} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Parent and student testimonials"
            description="Publish only genuine feedback that the person has approved for public use."
            action={<button type="button" disabled={content.testimonials.length >= 12} onClick={() => patch({ testimonials: [...content.testimonials, blankTestimonial()] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">+ Add testimonial</button>}
          >
            {content.testimonials.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No testimonials yet. Add authentic feedback with permission; nothing is invented for visitors.</p> : (
              <div className="space-y-4">
                {content.testimonials.map((item, index) => (
                  <div key={item.id || index} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={item.published} onChange={(event) => setTestimonial(index, { published: event.target.checked })} className="h-4 w-4 rounded border-slate-300" />Published</label>
                      <button type="button" onClick={() => patch({ testimonials: content.testimonials.filter((_, i) => i !== index) })} className="text-xs font-semibold text-rose-600 hover:underline">Remove</button>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Field label="Name" value={item.name} onChange={(value) => setTestimonial(index, { name: value })} placeholder="Use only a name approved for publication" />
                      <Field label="Relationship" value={item.role} onChange={(value) => setTestimonial(index, { role: value })} placeholder="e.g. Parent or former student" />
                      <Area label="Approved testimonial" value={item.message} onChange={(value) => setTestimonial(index, { message: value })} placeholder="Enter the person's genuine words…" rows={3} maxLength={600} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Principal's message" description="A short welcome from the head of the school, shown with an optional portrait.">
            <div className="grid gap-4 sm:grid-cols-[14rem_1fr] sm:items-start">
              <LandingImageUpload kind="principal" label="Portrait" frameClass="h-40 w-40 rounded-2xl" value={content.principalPhoto} onChange={(url, publicId) => patch({ principalPhoto: url, principalPhotoPublicId: publicId })} />
              <div className="space-y-4">
                <Field label="Principal's name" value={content.principalName} onChange={(value) => patch({ principalName: value })} placeholder="e.g. Mrs. Ayesha Khan" />
                <Area label="Message" value={content.principalMessage} onChange={(value) => patch({ principalMessage: value })} placeholder="Welcome to our school. We believe…" maxLength={4000} />
              </div>
            </div>
          </Panel>

          <Panel
            title="Top students"
            description="Celebrate outstanding learners — they appear in an achievers band on the public page."
            action={
              <button type="button" onClick={() => patch({ topStudents: [...content.topStudents, blankStudent()] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                + Add student
              </button>
            }
          >
            {content.topStudents.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">No students yet. Add your first achiever.</p>
            ) : (
              <div className="space-y-4">
                {content.topStudents.map((student, index) => (
                  <div key={student.id || index} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-700">Student {index + 1}</p>
                      <button type="button" onClick={() => patch({ topStudents: content.topStudents.filter((_, i) => i !== index) })} className="text-xs font-semibold text-rose-600 hover:underline">
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-start">
                      <LandingImageUpload kind="topStudent" label="Photo" frameClass="h-32 w-32 rounded-2xl" value={student.photo} onChange={(url, publicId) => setStudent(index, { photo: url, photoPublicId: publicId })} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Name" value={student.name} onChange={(value) => setStudent(index, { name: value })} placeholder="e.g. Hamza Ali" />
                        <Field label="Class" value={student.className} onChange={(value) => setStudent(index, { className: value })} placeholder="e.g. 10" />
                        <Field label="Section" value={student.section} onChange={(value) => setStudent(index, { section: value })} placeholder="e.g. A" />
                        <Field label="Year" value={student.year} onChange={(value) => setStudent(index, { year: value })} placeholder="e.g. 2025" />
                        <Area label="Achievement" value={student.achievement} onChange={(value) => setStudent(index, { achievement: value })} placeholder="e.g. Top of the board exams" rows={3} maxLength={600} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
          <Panel
            title="News & announcements"
            description="Share updates on the public page. Unpublished posts stay hidden from visitors."
            action={
              <button type="button" onClick={() => patch({ newsPosts: [blankNews(), ...content.newsPosts] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                + Add news
              </button>
            }
          >
            {content.newsPosts.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">No news posts yet. Add your first update.</p>
            ) : (
              <div className="space-y-4">
                {content.newsPosts.map((post, index) => (
                  <div key={post.id || index} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <input type="checkbox" checked={post.published} onChange={(event) => setNews(index, { published: event.target.checked })} className="h-4 w-4 rounded border-slate-300" />
                        Published
                      </label>
                      <button type="button" onClick={() => patch({ newsPosts: content.newsPosts.filter((_, i) => i !== index) })} className="text-xs font-semibold text-rose-600 hover:underline">
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-start">
                      <LandingImageUpload kind="news" label="Image" frameClass="h-28 w-40 rounded-2xl" value={post.image} onChange={(url, publicId) => setNews(index, { image: url, imagePublicId: publicId })} />
                      <div className="space-y-3">
                        <Field label="Headline" value={post.title} onChange={(value) => setNews(index, { title: value })} placeholder="e.g. Annual sports day" />
                        <Area label="Details" rows={3} value={post.description} onChange={(value) => setNews(index, { description: value })} placeholder="A short paragraph about the update…" maxLength={4000} />
                        <label className="block text-sm font-medium text-slate-700">
                          Date
                          <input
                            type="date"
                            value={post.publishedAt ? post.publishedAt.slice(0, 10) : ""}
                            onChange={(event) => setNews(index, { publishedAt: event.target.value ? new Date(event.target.value).toISOString() : new Date().toISOString() })}
                            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-48"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
          <Panel
            title="Gallery"
            description="A grid of campus photos shown near the bottom of the public page."
            action={
              <button type="button" onClick={() => patch({ gallery: [...content.gallery, blankGallery()] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                + Add photo
              </button>
            }
          >
            {content.gallery.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">No photos yet. Add your first campus picture.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {content.gallery.map((item, index) => (
                  <div key={item.id || index} className="rounded-xl border border-slate-200 p-4">
                    <LandingImageUpload kind="gallery" label={`Photo ${index + 1}`} frameClass="h-36 w-full rounded-xl" value={item.image} onChange={(url, publicId) => setGallery(index, { image: url, imagePublicId: publicId })} />
                    <div className="mt-3">
                      <Area label="Caption" value={item.caption} onChange={(value) => setGallery(index, { caption: value })} placeholder="Optional caption" rows={2} maxLength={160} />
                      <Field label="Category" value={item.category} onChange={(value) => setGallery(index, { category: value })} placeholder="e.g. Sports, classroom, celebrations" className="mt-3" />
                    </div>
                    <button type="button" onClick={() => patch({ gallery: content.gallery.filter((_, i) => i !== index) })} className="mt-3 text-xs font-semibold text-rose-600 hover:underline">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Admissions" description="Add the school's real application steps and required documents. Only completed items appear publicly.">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-700">Application steps</h3>
                <button type="button" disabled={content.admissionSteps.length >= 8} onClick={() => patch({ admissionSteps: [...content.admissionSteps, blankAdmissionStep()] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">+ Add step</button>
              </div>
              {content.admissionSteps.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">No steps yet. Add the actual process before showing it to families.</p> : content.admissionSteps.map((item, index) => (
                <div key={item.id || index} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-700">Step {index + 1}</p><button type="button" onClick={() => patch({ admissionSteps: content.admissionSteps.filter((_, i) => i !== index) })} className="text-xs font-semibold text-rose-600 hover:underline">Remove</button></div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Field label="Step title" value={item.title} onChange={(value) => setAdmissionStep(index, { title: value })} placeholder="e.g. Contact the admissions office" />
                    <Area label="Details" value={item.description} onChange={(value) => setAdmissionStep(index, { description: value })} placeholder="Describe this step accurately…" rows={3} maxLength={600} />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-700">Required documents</h3>
                <button type="button" disabled={content.admissionRequirements.length >= 16} onClick={() => patch({ admissionRequirements: [...content.admissionRequirements, ""] })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">+ Add requirement</button>
              </div>
              {content.admissionRequirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Field label={`Requirement ${index + 1}`} value={requirement} onChange={(value) => patch({ admissionRequirements: content.admissionRequirements.map((item, i) => i === index ? value : item) })} placeholder="Enter a real required document" className="flex-1" />
                  <button type="button" onClick={() => patch({ admissionRequirements: content.admissionRequirements.filter((_, i) => i !== index) })} className="mt-7 text-xs font-semibold text-rose-600 hover:underline">Remove</button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Brand logo" description="Shown in the site header and on the sign-in screen.">
            <LandingImageUpload kind="logo" label="Logo" frameClass="h-28 w-28" value={content.logo} onChange={(url, publicId) => patch({ logo: url, logoPublicId: publicId })} hint="Use a transparent PNG at least 1024 × 1024 px for crisp details. Re-upload the original high-resolution logo if the current one looks blurry." />
          </Panel>
        </div>

        <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <button type="button" onClick={() => void save()} disabled={saving} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">
            {saving ? "Saving…" : "Save landing page"}
          </button>
          <Link href="/" target="_blank" className="text-sm font-semibold text-slate-500 hover:text-slate-800">
            Preview ↗
          </Link>
          {message ? <span className="text-sm font-medium text-emerald-600">{message}</span> : null}
          {error ? <span className="text-sm font-medium text-rose-600">{error}</span> : null}
        </div>
      </div>
    </main>
  );
}