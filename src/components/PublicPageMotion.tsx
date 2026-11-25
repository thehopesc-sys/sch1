"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

export default function PublicPageMotion({ whatsappHref = "" }: { whatsappHref?: string }) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".school-home");
    if (!page) return;

    const targets = page.querySelectorAll<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    page.dataset.motionReady = "true";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      delete page.dataset.motionReady;
    };
  }, []);

  useEffect(() => {
    function updateBackToTop() {
      setShowBackToTop(window.scrollY > 560);
    }

    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    return () => window.removeEventListener("scroll", updateBackToTop);
  }, []);

  return (
    <>
      {showBackToTop ? (
        <button
          type="button"
          className="home-back-to-top"
          aria-label="Back to top"
          onClick={() => window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          })}
        >
          <ArrowUp size={19} aria-hidden="true" />
        </button>
      ) : null}
      {whatsappHref ? (
        <a
          className="home-floating-whatsapp"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Message the school on WhatsApp"
        >
          <MessageCircle size={21} aria-hidden="true" />
        </a>
      ) : null}
    </>
  );
}
