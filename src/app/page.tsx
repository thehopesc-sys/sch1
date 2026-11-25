import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  GraduationCap,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Sparkles,
} from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import { SchoolConfiguration } from "@/Models";
import LandingNav from "@/components/LandingNav";
import PublicGallery from "@/components/PublicGallery";
import PublicHighlights from "@/components/PublicHighlights";
import PublicPageMotion from "@/components/PublicPageMotion";
import PublicTestimonials from "@/components/PublicTestimonials";
import ReadMoreText from "@/components/ReadMoreText";
import {
  publishedNews,
  readLanding,
  visibleAcademicPrograms,
  visibleAdmissionSteps,
  visibleFacilities,
  visibleGallery,
  visibleRecognitions,
  visibleTestimonials,
  visibleTopStudents,
  visibleUpcomingEvents,
} from "@/lib/landing";

export const dynamic = "force-dynamic";

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function excerpt(value: string, limit: number) {
  if (value.length <= limit) return value;
  const boundary = value.lastIndexOf(" ", limit);
  return `${value.slice(0, boundary > limit * 0.6 ? boundary : limit).trimEnd()}…`;
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function phoneHref(value: string) {
  const normalized = value.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "";
}

const loadHomepageSchool = cache(async () => {
  try {
    await connectToDatabase();
    return await SchoolConfiguration.findOne()
      .sort({ updatedAt: -1, createdAt: -1 })
      .select("schoolName schoolDescription schoolAddress schoolPhone schoolEmail socialMedia academicYear tagline mission vision principalName principalMessage principalPhoto coverImage logo topStudents newsPosts gallery whyUs academicPrograms facilities upcomingEvents testimonials admissionSteps admissionRequirements recognitions homepageCopy")
      .lean();
  } catch (error) {
    console.error("School homepage configuration load error:", error);
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const school = await loadHomepageSchool();
  const schoolName = text(school?.schoolName) || "Your School";
  const description = excerpt(
    text(school?.tagline) || text(school?.schoolDescription) || "Explore our school, read announcements, celebrate student achievements, and get in touch.",
    160,
  );
  return {
    title: `${schoolName} | Official School Website`,
    description,
    openGraph: {
      title: schoolName,
      description,
      type: "website",
    },
  };
}

export default async function Home() {
  const school: Record<string, unknown> | null = await loadHomepageSchool();

  const schoolName = text(school?.schoolName) || "Your School";
  const description = text(school?.schoolDescription);
  const content = readLanding(school);
  const copy = content.homepageCopy;
  const logo = content.logo || text(school?.logo) || "/logo.png";
  const coverImage = content.coverImage || text(school?.coverImage) || "/landingcover.png";
  const latestNews = publishedNews(content);
  const achievers = visibleTopStudents(content);
  const gallery = visibleGallery(content);
  const academicPrograms = visibleAcademicPrograms(content);
  const facilities = visibleFacilities(content);
  const events = visibleUpcomingEvents(content);
  const testimonials = visibleTestimonials(content);
  const admissionSteps = visibleAdmissionSteps(content);
  const recognitions = visibleRecognitions(content);
  const phone = text(school?.schoolPhone);
  const email = text(school?.schoolEmail);
  const address = text(school?.schoolAddress);
  const social = (school?.socialMedia ?? {}) as Record<string, unknown>;
  const socialLinks = [
    { label: "Facebook", href: text(social.facebook), mark: "f" },
    { label: "Instagram", href: text(social.instagram), mark: "◎" },
    { label: "YouTube", href: text(social.youtube), mark: "▶" },
    { label: "LinkedIn", href: text(social.linkedin), mark: "in" },
  ].filter((item) => item.href);
  const whatsapp = text(social.whatsapp);
  const whatsappHref = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(whatsapp) ? whatsapp : "";

  const highlights = content.whyUs.filter((item) => item.title || item.description);
  const hasAboutContent = Boolean(description || content.mission || content.vision);

  return (
    <main className="school-home min-h-screen bg-[#f7f8f6] text-slate-900">
      <PublicPageMotion whatsappHref={whatsappHref} />
      {latestNews[0]?.title ? (
        <div className="home-announcement">
          <div className="home-announcement-inner">
            <span className="home-announcement-label"><Sparkles size={14} aria-hidden="true" /> {copy.announcementLabel}</span>
            <Link href="/#news" className="home-announcement-link">
              <span className="truncate">{latestNews[0].title}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            {phone ? <a href={phoneHref(phone)} className="home-announcement-contact">{phone}</a> : null}
          </div>
        </div>
      ) : null}

      <LandingNav
        schoolName={schoolName}
        logo={logo}
        copy={copy}
        hasHighlights={highlights.length > 0}
        hasAcademics={academicPrograms.length > 0}
        hasNews={latestNews.length > 0}
        hasEvents={events.length > 0}
        hasFacilities={facilities.length > 0}
        hasGallery={gallery.length > 0}
      />

      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy" data-reveal>
            <p className="home-eyebrow"><span /> {copy.heroEyebrow.replace("{schoolName}", schoolName)}</p>
            <h1>{copy.heroTitle}<span>{copy.heroTitleAccent}</span></h1>
            <p className="home-hero-description">
              {content.tagline || excerpt(description, 190) || "Discover our school, meet our community, and find the information your family needs."}
            </p>
            <div className="home-hero-actions">
              <Link href="/contact#admissions" className="home-button home-button-primary">
                {copy.heroPrimaryAction} <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/#about" className="home-button home-button-secondary">
                {copy.heroSecondaryAction} <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            {text(school?.academicYear) ? (
              <p className="home-academic-note"><CalendarDays size={16} aria-hidden="true" /> {copy.academicYearLabel} {text(school?.academicYear)}</p>
            ) : null}
          </div>

          <div className="home-hero-visual" data-reveal>
            <div className="home-learning-object" aria-hidden="true">
              <div className="home-learning-object-orbit" />
              <div className="home-learning-object-card">
                <svg viewBox="0 0 64 64" fill="none">
                  <path d="M32 17.5c-6.1-4-13.2-4.8-21-2.6v27.3c7.8-2.2 14.9-1.4 21 2.6m0-27.3c6.1-4 13.2-4.8 21-2.6v27.3c-7.8-2.2-14.9-1.4-21 2.6m0-27.3v27.3" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 22.5c3.4-.5 6.2-.1 9 1.1m19-1.1c-3.4-.5-6.2-.1-9 1.1M18 29c3.4-.5 6.2-.1 9 1.1m19-1.1c-3.4-.5-6.2-.1-9 1.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="m47 9 1.5 3.5L52 14l-3.5 1.5L47 19l-1.5-3.5L42 14l3.5-1.5L47 9Z" fill="currentColor" />
                </svg>
              </div>
              <span className="home-learning-object-dot" />
            </div>
            <div className="home-hero-frame">
              <div className="home-hero-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt={`${schoolName} campus`} fetchPriority="high" />
                <div className="home-photo-shade" />
                <div className="home-photo-label">
                  <span className="home-photo-label-icon"><GraduationCap size={19} aria-hidden="true" /></span>
                  <span><strong>{schoolName}</strong><small>{copy.heroPhotoSubtitle}</small></span>
                </div>
              </div>
            </div>
            <div className="home-hero-orb" aria-hidden="true" />
            <div className="home-visual-orbit" aria-hidden="true" />
            <div className="home-visual-caption"><span>01</span> {copy.heroVisualCaption}</div>
          </div>
        </div>
        <a href="#about" className="home-scroll-cue" aria-label="Scroll to learn about the school"><ArrowDown size={16} aria-hidden="true" /></a>
      </section>

      {recognitions.length ? (
        <section className="home-trust" aria-label="School recognitions and affiliations">
          <div className="home-trust-inner" data-reveal>
            <p className="home-section-kicker">{copy.trustTitle}</p>
            <div className="home-trust-list">
              {recognitions.map((item, index) => (
                <article key={item.id || `${item.title}-${index}`}>
                  <strong>{item.title}</strong>
                  {item.issuer ? <span>{item.issuer}</span> : null}
                  {item.year ? <small>{item.year}</small> : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasAboutContent ? (
        <section id="about" className="home-section home-about">
          <div className="home-section-inner home-about-layout" data-reveal>
            <div className="home-about-heading">
              <p className="home-section-kicker">{copy.aboutEyebrow}</p>
              <h2>{copy.aboutTitle} <em>{copy.aboutTitleAccent}</em></h2>
              {description ? <ReadMoreText text={description} className="home-body-copy" previewLength={480} /> : null}
              <Link href="/about-us" className="home-text-link">{copy.aboutLink} <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            {(content.mission || content.vision) ? (
              <div className="home-values">
                {content.mission ? (
                  <article className="home-value-card">
                    <span className="home-value-index">01</span>
                    <div><p className="home-section-kicker">{copy.missionLabel}</p><p>{content.mission}</p></div>
                  </article>
                ) : null}
                {content.vision ? (
                  <article className="home-value-card">
                    <span className="home-value-index">02</span>
                    <div><p className="home-section-kicker">{copy.visionLabel}</p><p>{content.vision}</p></div>
                  </article>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {highlights.length ? (
        <PublicHighlights
          highlights={highlights}
          eyebrow={copy.highlightsEyebrow}
          title={copy.highlightsTitle}
          description={copy.highlightsDescription}
        />
      ) : null}

      {academicPrograms.length ? (
        <section id="academics" className="home-section home-programs">
          <div className="home-section-inner" data-reveal>
            <div className="home-section-heading">
              <div><p className="home-section-kicker">{copy.academicsEyebrow}</p><h2>{copy.academicsTitle}</h2></div>
              <p>{copy.academicsDescription}</p>
            </div>
            <div className="home-program-grid">
              {academicPrograms.map((program, index) => (
                <article className="home-program-card" key={program.id || `${program.title}-${index}`}>
                  {program.image ? (
                    <div className="home-program-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={program.image} alt={program.title} loading="lazy" />
                    </div>
                  ) : <div className="home-program-placeholder"><BookOpen size={28} aria-hidden="true" /></div>}
                  <div className="home-program-copy">
                    {program.gradeRange ? <p className="home-section-kicker">{program.gradeRange}</p> : null}
                    <h3>{program.title}</h3>
                    {program.description ? <p>{program.description}</p> : null}
                    <Link href="/contact#admissions" className="home-text-link">{copy.academicsAction} <ArrowRight size={16} aria-hidden="true" /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {(content.principalName || content.principalMessage || content.principalPhoto) ? (
        <section className="home-section home-principal">
          <div className="home-section-inner home-principal-layout" data-reveal>
            {content.principalPhoto ? (
              <div className="home-principal-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={content.principalPhoto} alt={content.principalName ? `${content.principalName}, school principal` : "School principal"} loading="lazy" />
              </div>
            ) : null}
            <div className="home-principal-message">
              <Quote className="home-quote-icon" size={30} aria-hidden="true" />
              <p className="home-section-kicker">{copy.principalEyebrow}</p>
              {content.principalMessage ? <blockquote><ReadMoreText text={content.principalMessage} className="home-principal-quote" previewLength={520} /></blockquote> : null}
              {content.principalName ? <p className="home-principal-name">{content.principalName}<span>{copy.principalRole}</span></p> : null}
            </div>
          </div>
        </section>
      ) : null}

      {achievers.length ? (
        <section className="home-section home-achievements">
          <div className="home-section-inner" data-reveal>
            <div className="home-section-heading">
              <div><p className="home-section-kicker">{copy.achievementsEyebrow}</p><h2>{copy.achievementsTitle}</h2></div>
              <p>{copy.achievementsDescription}</p>
            </div>
            <div className="home-achievement-grid">
              {achievers.map((student, index) => (
                <article className="home-achievement-card" key={student.id || `${student.name}-${index}`}>
                  {student.photo ? (
                    <div className="home-achievement-photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={student.photo} alt={student.name} loading="lazy" />
                    </div>
                  ) : <div className="home-achievement-initial" aria-hidden="true">{student.name.charAt(0).toUpperCase()}</div>}
                  <div className="home-achievement-copy">
                    <p className="home-section-kicker">{copy.achievementLabel}</p>
                    <h3>{student.name}</h3>
                    <p className="home-achievement-meta">{[student.className && `Class ${student.className}`, student.section && `Section ${student.section}`, student.year].filter(Boolean).join(" · ")}</p>
                    {student.achievement ? <p className="home-achievement-description">{student.achievement}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {testimonials.length ? (
        <section className="home-section home-testimonials">
          <div className="home-section-inner" data-reveal>
            <div className="home-section-heading">
              <div><p className="home-section-kicker">{copy.testimonialsEyebrow}</p><h2>{copy.testimonialsTitle}</h2></div>
              <p>{copy.testimonialsDescription}</p>
            </div>
            <PublicTestimonials testimonials={testimonials} />
          </div>
        </section>
      ) : null}

      {latestNews.length ? (
        <section id="news" className="home-section home-news">
          <div className="home-section-inner" data-reveal>
            <div className="home-section-heading">
              <div><p className="home-section-kicker">{copy.newsEyebrow}</p><h2>{copy.newsTitle}</h2></div>
              <Link href="/contact" className="home-text-link">{copy.newsAction} <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="home-news-grid">
              {latestNews.slice(0, 3).map((post, index) => (
                <article className={`home-news-card home-news-card-${index}`} key={post.id || `${post.title}-${index}`}>
                  {post.image ? (
                    <div className="home-news-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.image} alt={post.title || "School announcement"} loading="lazy" />
                    </div>
                  ) : <div className="home-news-placeholder"><CalendarDays size={26} aria-hidden="true" /></div>}
                  <div className="home-news-copy">
                    {post.publishedAt ? <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> : null}
                    {post.title ? <h3>{post.title}</h3> : null}
                    {post.description ? <ReadMoreText text={post.description} previewLength={200} className="home-news-description" /> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {events.length ? (
        <section id="events" className="home-section home-events">
          <div className="home-section-inner" data-reveal>
            <div className="home-section-heading">
              <div><p className="home-section-kicker">{copy.eventsEyebrow}</p><h2>{copy.eventsTitle}</h2></div>
              <p>{copy.eventsDescription}</p>
            </div>
            <div className="home-event-grid">
              {events.slice(0, 3).map((event, index) => (
                <article className="home-event-card" key={event.id || `${event.title}-${index}`}>
                  {event.image ? (
                    <div className="home-event-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={event.image} alt={event.title} loading="lazy" />
                    </div>
                  ) : null}
                  <div className="home-event-copy">
                    <time dateTime={event.date}>{formatDate(event.date)}{event.time ? ` · ${event.time}` : ""}</time>
                    <h3>{event.title}</h3>
                    {event.location ? <p className="home-event-location"><MapPin size={15} aria-hidden="true" />{event.location}</p> : null}
                    {event.description ? <p>{event.description}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {facilities.length ? (
        <section id="facilities" className="home-section home-facilities">
          <div className="home-section-inner" data-reveal>
            <div className="home-section-heading">
              <div><p className="home-section-kicker">{copy.facilitiesEyebrow}</p><h2>{copy.facilitiesTitle}</h2></div>
              <p>{copy.facilitiesDescription}</p>
            </div>
            <div className="home-facility-grid">
              {facilities.map((facility, index) => (
                <article className="home-facility-card" key={facility.id || `${facility.title}-${index}`}>
                  {facility.image ? (
                    <div className="home-facility-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={facility.image} alt={facility.title} loading="lazy" />
                    </div>
                  ) : <div className="home-facility-placeholder"><GraduationCap size={24} aria-hidden="true" /></div>}
                  <div><h3>{facility.title}</h3>{facility.description ? <p>{facility.description}</p> : null}</div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {gallery.length ? (
        <section id="gallery" className="home-section home-gallery">
          <div className="home-section-inner" data-reveal>
            <div className="home-section-heading">
              <div><p className="home-section-kicker">{copy.galleryEyebrow}</p><h2>{copy.galleryTitle}</h2></div>
              <p>{copy.galleryDescription}</p>
            </div>
            <PublicGallery images={gallery.slice(0, 8)} />
          </div>
        </section>
      ) : null}

      <section id="admissions" className="home-admissions">
        <div className="home-admissions-inner" data-reveal>
          <div>
            <p className="home-section-kicker">{copy.admissionsEyebrow}</p>
            <h2>{copy.admissionsTitle}</h2>
            <p>{copy.admissionsDescription}</p>
          </div>
          <Link href="/contact#admissions" className="home-button home-button-light">{copy.admissionsAction} <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        {(admissionSteps.length || content.admissionRequirements.length) ? (
          <div className="home-admissions-details">
            {admissionSteps.length ? (
              <div>
                <h3>{copy.admissionStepsTitle}</h3>
                <ol className="home-admission-steps">
                  {admissionSteps.map((step, index) => (
                    <li key={step.id || `${step.title}-${index}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div><strong>{step.title}</strong>{step.description ? <p>{step.description}</p> : null}</div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
            {content.admissionRequirements.length ? (
              <div>
                <h3>{copy.admissionRequirementsTitle}</h3>
                <ul className="home-admission-requirements">
                  {content.admissionRequirements.map((requirement, index) => <li key={`${requirement}-${index}`}><Check size={16} aria-hidden="true" />{requirement}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section id="contact" className="home-section home-contact">
        <div className="home-section-inner home-contact-layout" data-reveal>
          <div>
            <p className="home-section-kicker">{copy.contactEyebrow}</p>
            <h2>{copy.contactTitle}</h2>
            <p className="home-contact-intro">{copy.contactDescription}</p>
            <Link href="/contact#admissions" className="home-text-link">{copy.contactAction} <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="home-contact-details">
            {address ? (
              <a className="home-contact-item" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">
                <span><MapPin size={19} aria-hidden="true" /></span><span><small>{copy.visitLabel}</small><strong>{address}</strong></span><ArrowUpRight className="home-contact-arrow" size={16} aria-hidden="true" />
              </a>
            ) : null}
            {phone ? (
              <a className="home-contact-item" href={phoneHref(phone)}>
                <span><Phone size={19} aria-hidden="true" /></span><span><small>{copy.phoneLabel}</small><strong>{phone}</strong></span><ArrowUpRight className="home-contact-arrow" size={16} aria-hidden="true" />
              </a>
            ) : null}
            {email ? (
              <a className="home-contact-item" href={`mailto:${email}`}>
                <span><MessageCircle size={19} aria-hidden="true" /></span><span><small>{copy.emailLabel}</small><strong>{email}</strong></span><ArrowUpRight className="home-contact-arrow" size={16} aria-hidden="true" />
              </a>
            ) : null}
            {whatsappHref ? (
              <a className="home-whatsapp-link" href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle size={17} aria-hidden="true" /> {copy.whatsappAction}
              </a>
            ) : null}
            {address ? (
              <iframe
                className="home-map-frame"
                title={`${schoolName} location on Google Maps`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : null}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={48} height={48} loading="lazy" />
            <div><strong>{schoolName}</strong><p>{description || copy.footerFallbackDescription}</p></div>
          </div>
          <div className="home-footer-links">
            <Link href="/">{copy.footerHome}</Link><Link href="/about-us">{copy.footerAbout}</Link><Link href="/contact">{copy.footerContact}</Link><Link href="/login">{copy.footerLogin}</Link>
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} className="home-social-link">{item.mark}</a>
            ))}
          </div>
          <div className="home-footer-bottom">
            <span>© {new Date().getFullYear()} {schoolName}</span>
            <span>{copy.footerTagline}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
