"use strict";

/**
 * Landing-page content model, shared by three places that must always agree:
 *
 *   · the PATCH API that stores it      (app/api/school-settings/landing)
 *   · the admin editor                  (app/dashboard/landing)
 *   · the public page that renders it   (app/page.tsx)
 *
 * Keeping the shape and the normaliser here means a partially filled document
 * (an empty array, a missing photo, a legacy row) can never break the public
 * page — every read is folded into a complete, typed LandingContent.
 *
 * Nothing in this file imports mongoose, so it is safe in client components.
 */

/** One achiever in the "Top students" band. */
export type TopStudent = {
  id: string;
  name: string;
  className: string;
  section: string;
  achievement: string;
  year: string;
  photo: string;
  photoPublicId: string;
};

/** One news / announcement card. */
export type NewsPost = {
  id: string;
  title: string;
  description: string;
  image: string;
  imagePublicId: string;
  published: boolean;
  publishedAt: string;
};

/** One picture in the campus gallery. */
export type GalleryImage = {
  id: string;
  image: string;
  imagePublicId: string;
  caption: string;
  category: string;
};

export type WhyUsItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  tone: string;
};

export type AcademicProgram = {
  id: string;
  title: string;
  gradeRange: string;
  description: string;
  image: string;
  imagePublicId: string;
};

export type Facility = {
  id: string;
  title: string;
  description: string;
  image: string;
  imagePublicId: string;
};

export type SchoolEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  imagePublicId: string;
  published: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  published: boolean;
};

export type AdmissionStep = {
  id: string;
  title: string;
  description: string;
};

export type Recognition = {
  id: string;
  title: string;
  issuer: string;
  year: string;
};

export const DEFAULT_HOMEPAGE_COPY = {
  announcementLabel: "School update",
  heroEyebrow: "Welcome to {schoolName}",
  heroTitle: "A brighter beginning.",
  heroTitleAccent: "A confident future.",
  heroPrimaryAction: "Ask about admissions",
  heroSecondaryAction: "Explore our school",
  academicYearLabel: "Academic year",
  heroPhotoSubtitle: "Learning starts here",
  heroVisualCaption: "A community built around learning",
  trustTitle: "Recognition & affiliations",
  aboutEyebrow: "A little about us",
  aboutTitle: "Every learner deserves a place to",
  aboutTitleAccent: "belong.",
  aboutLink: "More about our school",
  missionLabel: "Our mission",
  visionLabel: "Our vision",
  highlightsEyebrow: "What matters here",
  highlightsTitle: "Learning with purpose.",
  highlightsDescription: "Explore the qualities and priorities our school has chosen to share with families.",
  academicsEyebrow: "Learning pathways",
  academicsTitle: "Our academic programs.",
  academicsDescription: "Explore the programs and grade ranges the school has added for families.",
  academicsAction: "Ask about admissions",
  principalEyebrow: "A message from our principal",
  principalRole: "Principal",
  achievementsEyebrow: "Proud moments",
  achievementsTitle: "Celebrating our learners.",
  achievementsDescription: "Achievements shared by the school community.",
  achievementLabel: "Student achievement",
  testimonialsEyebrow: "Community voices",
  testimonialsTitle: "Words from our community.",
  testimonialsDescription: "Published feedback shared with permission.",
  newsEyebrow: "From the school",
  newsTitle: "News & announcements.",
  newsAction: "Get in touch",
  eventsEyebrow: "On the calendar",
  eventsTitle: "Upcoming events.",
  eventsDescription: "Dates and details confirmed by the school.",
  facilitiesEyebrow: "Around our campus",
  facilitiesTitle: "Spaces for learning.",
  facilitiesDescription: "Facilities shown here are selected and described by the school.",
  galleryEyebrow: "Life at school",
  galleryTitle: "Moments that make us.",
  galleryDescription: "Select a photograph to view it larger.",
  admissionsEyebrow: "Take the next step",
  admissionsTitle: "Come see what learning can look like.",
  admissionsDescription: "Contact the school to ask about admissions, visits, and the information your family needs.",
  admissionsAction: "Contact the school",
  admissionStepsTitle: "How to apply",
  admissionRequirementsTitle: "What to prepare",
  contactEyebrow: "We are here to help",
  contactTitle: "Let’s start a conversation.",
  contactDescription: "Reach the school directly, or view the full contact details.",
  contactAction: "Visit our contact page",
  visitLabel: "Visit us",
  phoneLabel: "Call the school",
  emailLabel: "Email us",
  whatsappAction: "Message us on WhatsApp",
  footerFallbackDescription: "A school community focused on learning and growth.",
  footerTagline: "Made for learning, every day.",
  footerHome: "Home",
  footerAbout: "About us",
  footerContact: "Contact",
  footerLogin: "Sign in",
  navHome: "Home",
  navAbout: "About",
  navHighlights: "Our approach",
  navAcademics: "Academics",
  navNews: "Updates",
  navEvents: "Events",
  navFacilities: "Facilities",
  navGallery: "Gallery",
  navContact: "Contact",
  navAdmissionAction: "Ask about admissions",
} as const;

export type HomepageCopy = {
  -readonly [Key in keyof typeof DEFAULT_HOMEPAGE_COPY]: string;
};

/** Everything the public landing page may show beyond the base school fields. */
export type LandingContent = {
  homepageCopy: HomepageCopy;
  tagline: string;
  mission: string;
  vision: string;
  principalName: string;
  principalMessage: string;
  principalPhoto: string;
  principalPhotoPublicId: string;
  coverImage: string;
  coverImagePublicId: string;
  logo: string;
  logoPublicId: string;
  topStudents: TopStudent[];
  newsPosts: NewsPost[];
  gallery: GalleryImage[];
  whyUs: WhyUsItem[];
  academicPrograms: AcademicProgram[];
  facilities: Facility[];
  upcomingEvents: SchoolEvent[];
  testimonials: Testimonial[];
  admissionSteps: AdmissionStep[];
  admissionRequirements: string[];
  recognitions: Recognition[];
};

/** A blank landing, used before setup or when a field was never filled in. */
export const EMPTY_LANDING: LandingContent = {
  homepageCopy: { ...DEFAULT_HOMEPAGE_COPY },
  tagline: "",
  mission: "",
  vision: "",
  principalName: "",
  principalMessage: "",
  principalPhoto: "",
  principalPhotoPublicId: "",
  coverImage: "",
  coverImagePublicId: "",
  logo: "",
  logoPublicId: "",
  topStudents: [],
  newsPosts: [],
  gallery: [],
  whyUs: [],
  academicPrograms: [],
  facilities: [],
  upcomingEvents: [],
  testimonials: [],
  admissionSteps: [],
  admissionRequirements: [],
  recognitions: [],
};

/** Coerces anything into a trimmed string. */
function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function preservedText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function readHomepageCopy(value: unknown): HomepageCopy {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const copy: HomepageCopy = { ...DEFAULT_HOMEPAGE_COPY };
  for (const key of Object.keys(DEFAULT_HOMEPAGE_COPY) as (keyof HomepageCopy)[]) {
    const textValue = source[key];
    if (typeof textValue === "string" && textValue.trim()) copy[key] = textValue.trim();
  }
  return copy;
}

/** Reads an ObjectId-ish value (or a saved subdocument id) as a string. */
function id(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "_id" in value) return String((value as { _id: unknown })._id);
  return "";
}

/** Normalises a date-ish value to an ISO string (or "" when absent). */
function isoDate(value: unknown): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

/**
 * Folds a raw school document (lean or not) into a complete LandingContent.
 * Every list entry without a usable photo AND without any text is dropped, so
 * an empty "Add" row never shows up on the public page.
 */
export function readLanding(raw: unknown): LandingContent {
  const source = (raw ?? {}) as Record<string, unknown>;
  const list = (value: unknown) => (Array.isArray(value) ? value : []);

  const topStudents: TopStudent[] = list(source.topStudents).map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return {
      id: id(item._id ?? item.id),
      name: text(item.name),
      className: text(item.className),
      section: text(item.section),
      achievement: preservedText(item.achievement),
      year: text(item.year),
      photo: text(item.photo),
      photoPublicId: text(item.photoPublicId),
    };
  });

  const newsPosts: NewsPost[] = list(source.newsPosts).map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return {
      id: id(item._id ?? item.id),
      title: text(item.title),
      description: preservedText(item.description),
      image: text(item.image),
      imagePublicId: text(item.imagePublicId),
      published: item.published === undefined ? true : Boolean(item.published),
      publishedAt: isoDate(item.publishedAt),
    };
  });

  const gallery: GalleryImage[] = list(source.gallery).map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return {
      id: id(item._id ?? item.id),
      image: text(item.image),
      imagePublicId: text(item.imagePublicId),
      caption: preservedText(item.caption),
      category: text(item.category),
    };
  });
  const whyUs: WhyUsItem[] = list(source.whyUs).map((entry, index) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return { id: id(item._id ?? item.id), number: text(item.number) || String(index + 1).padStart(2, "0"), title: text(item.title), description: preservedText(item.description), tone: text(item.tone) || "blue" };
  });
  const academicPrograms: AcademicProgram[] = list(source.academicPrograms).map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return {
      id: id(item._id ?? item.id),
      title: text(item.title),
      gradeRange: text(item.gradeRange),
      description: preservedText(item.description),
      image: text(item.image),
      imagePublicId: text(item.imagePublicId),
    };
  });
  const facilities: Facility[] = list(source.facilities).map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return {
      id: id(item._id ?? item.id),
      title: text(item.title),
      description: preservedText(item.description),
      image: text(item.image),
      imagePublicId: text(item.imagePublicId),
    };
  });
  const upcomingEvents: SchoolEvent[] = list(source.upcomingEvents).map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return {
      id: id(item._id ?? item.id),
      title: text(item.title),
      date: isoDate(item.date),
      time: text(item.time),
      location: text(item.location),
      description: preservedText(item.description),
      image: text(item.image),
      imagePublicId: text(item.imagePublicId),
      published: item.published === true,
    };
  });
  const testimonials: Testimonial[] = list(source.testimonials).map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return {
      id: id(item._id ?? item.id),
      name: text(item.name),
      role: text(item.role),
      message: preservedText(item.message),
      published: item.published === true,
    };
  });
  const admissionSteps: AdmissionStep[] = list(source.admissionSteps).map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return {
      id: id(item._id ?? item.id),
      title: text(item.title),
      description: preservedText(item.description),
    };
  });
  const recognitions: Recognition[] = list(source.recognitions).map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return {
      id: id(item._id ?? item.id),
      title: text(item.title),
      issuer: text(item.issuer),
      year: text(item.year),
    };
  });
  const admissionRequirements = list(source.admissionRequirements)
    .map((item) => text(item))
    .filter(Boolean);

  return {
    homepageCopy: readHomepageCopy(source.homepageCopy),
    tagline: text(source.tagline),
    mission: preservedText(source.mission),
    vision: preservedText(source.vision),
    principalName: text(source.principalName),
    principalMessage: preservedText(source.principalMessage),
    principalPhoto: text(source.principalPhoto),
    principalPhotoPublicId: text(source.principalPhotoPublicId),
    coverImage: text(source.coverImage),
    coverImagePublicId: text(source.coverImagePublicId),
    logo: text(source.logo),
    logoPublicId: text(source.logoPublicId),
    topStudents,
    newsPosts,
    gallery,
    whyUs,
    academicPrograms,
    facilities,
    upcomingEvents,
    testimonials,
    admissionSteps,
    admissionRequirements,
    recognitions,
  };
}

/** Only the news posts the admin marked as published, newest first. */
export function publishedNews(content: LandingContent): NewsPost[] {
  return content.newsPosts
    .filter((post) => post.published && (post.title || post.description.trim() || post.image))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

/** Top students that carry at least a name, for the achiever band. */
export function visibleTopStudents(content: LandingContent): TopStudent[] {
  return content.topStudents.filter((student) => student.name);
}

/** Gallery pictures that actually carry an image. */
export function visibleGallery(content: LandingContent): GalleryImage[] {
  return content.gallery.filter((item) => item.image);
}

export function visibleAcademicPrograms(content: LandingContent): AcademicProgram[] {
  return content.academicPrograms.filter((item) => item.title);
}

export function visibleFacilities(content: LandingContent): Facility[] {
  return content.facilities.filter((item) => item.title);
}

export function visibleUpcomingEvents(content: LandingContent, now = new Date()): SchoolEvent[] {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return content.upcomingEvents
    .filter((item) => {
      if (!item.published || !item.title || !item.date) return false;
      const eventDate = new Date(item.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function visibleTestimonials(content: LandingContent): Testimonial[] {
  return content.testimonials.filter((item) => item.published && item.name && item.message);
}

export function visibleAdmissionSteps(content: LandingContent): AdmissionStep[] {
  return content.admissionSteps.filter((item) => item.title);
}

export function visibleRecognitions(content: LandingContent): Recognition[] {
  return content.recognitions.filter((item) => item.title);
}