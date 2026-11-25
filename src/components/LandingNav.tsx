"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import type { HomepageCopy } from "@/lib/landing";

type Props = {
  schoolName: string;
  /** Cloudinary logo from school settings; falls back to the bundled mark. */
  logo?: string;
  copy: HomepageCopy;
  hasHighlights?: boolean;
  hasAcademics?: boolean;
  hasNews?: boolean;
  hasEvents?: boolean;
  hasFacilities?: boolean;
  hasGallery?: boolean;
};

export default function LandingNav({
  schoolName,
  logo,
  copy,
  hasHighlights = false,
  hasAcademics = false,
  hasNews = false,
  hasEvents = false,
  hasFacilities = false,
  hasGallery = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const links = [
    { label: copy.navHome, href: "/" },
    { label: copy.navAbout, href: "/about-us" },
    ...(hasHighlights ? [{ label: copy.navHighlights, href: "/#highlights" }] : []),
    ...(hasAcademics ? [{ label: copy.navAcademics, href: "/#academics" }] : []),
    ...(hasNews ? [{ label: copy.navNews, href: "/#news" }] : []),
    ...(hasEvents ? [{ label: copy.navEvents, href: "/#events" }] : []),
    ...(hasFacilities ? [{ label: copy.navFacilities, href: "/#facilities" }] : []),
    ...(hasGallery ? [{ label: copy.navGallery, href: "/#gallery" }] : []),
    { label: copy.navContact, href: "/contact" },
  ];

  useEffect(() => {
    function updateScrolledState() {
      setScrolled(window.scrollY > 12);
    }

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    document.body.classList.add("landing-menu-open");

    function closeOnKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const buttons = document.querySelectorAll<HTMLElement>("#landing-mobile-menu button, #landing-mobile-menu a");
      if (!buttons.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function closeOnDesktopResize() {
      if (window.innerWidth >= 1280) setOpen(false);
    }

    closeButtonRef.current?.focus();
    document.addEventListener("keydown", closeOnKeydown);
    window.addEventListener("resize", closeOnDesktopResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("landing-menu-open");
      document.removeEventListener("keydown", closeOnKeydown);
      window.removeEventListener("resize", closeOnDesktopResize);
      if (window.innerWidth < 1280) menuButton?.focus();
    };
  }, [open]);

  return (
    <nav className={`landing-nav sticky top-0 z-30 w-full border-b border-slate-200/80 px-4 py-2.5 sm:px-8 sm:py-3${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`}>
      <div className="mx-auto flex max-w-[86rem] items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-sm font-bold tracking-wide text-slate-900">
          <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo || "/logo.png"} alt="" width={56} height={56} loading="eager" fetchPriority="high" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/logo.png"; }} className="h-full w-full object-contain" />
          </span>
          <span className="min-w-0 max-w-[14rem] line-clamp-2 break-words text-[0.72rem] leading-tight sm:max-w-[20rem] sm:text-sm lg:truncate lg:whitespace-nowrap">{schoolName}</span>
        </Link>
        <div className="hidden items-center gap-1 xl:flex">
          {links.map((item) => (
            <Link key={item.label} href={item.href} className="landing-nav-link whitespace-nowrap rounded-lg px-3 py-2 text-[0.82rem] font-medium">{item.label}</Link>
          ))}
          <Link href="/contact#admissions" className="landing-nav-cta ml-2 inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold">
            {copy.navAdmissionAction} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="landing-mobile-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 xl:hidden"
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
      {open ? (
        <div id="landing-mobile-menu" className="landing-mobile-menu xl:hidden" role="dialog" aria-modal="true" aria-label="School navigation">
          <div className="landing-mobile-menu-inner">
            <div className="landing-mobile-menu-heading">
              <span>Explore our school</span>
              <button ref={closeButtonRef} type="button" onClick={() => setOpen(false)} aria-label="Close navigation menu"><X size={21} aria-hidden="true" /></button>
            </div>
            <nav aria-label="Mobile navigation">
              {links.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="landing-mobile-link block rounded-xl px-4 py-3.5 text-base font-medium">{item.label}</Link>
              ))}
              <Link href="/contact#admissions" onClick={() => setOpen(false)} className="landing-mobile-signin mt-3 flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-center text-sm font-semibold whitespace-nowrap">
                {copy.navAdmissionAction} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
