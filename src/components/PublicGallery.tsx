"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/landing";

export default function PublicGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const categories = [...new Set(images.map((item) => item.category).filter(Boolean))];
  const visibleImages = selectedCategory === null ? images : images.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    if (activeIndex === null) {
      triggerRef.current?.focus();
      return;
    }

    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((index) => (index === null ? null : (index - 1 + visibleImages.length) % visibleImages.length));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((index) => (index === null ? null : (index + 1) % visibleImages.length));
      }
      if (event.key === "Tab") {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
        if (!buttons?.length) return;
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
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, visibleImages.length]);

  const activeImage = activeIndex === null ? null : visibleImages[activeIndex];

  return (
    <>
      {categories.length ? (
        <div className="home-gallery-filters" role="group" aria-label="Filter school photos">
          <button type="button" aria-pressed={selectedCategory === null} onClick={() => { setSelectedCategory(null); setActiveIndex(null); }}>
            All photos
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              aria-pressed={selectedCategory === category}
              onClick={() => {
                setSelectedCategory(category);
                setActiveIndex(null);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}
      <div className="home-gallery-grid">
        {visibleImages.map((item, index) => (
          <button
            type="button"
            key={item.id || item.image}
            className={`home-gallery-item home-gallery-item-${index % 5}`}
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setActiveIndex(index);
            }}
            aria-label={`View photo${item.caption ? `: ${item.caption}` : ` ${index + 1}`}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.caption || "School life"} loading="lazy" />
            <span className="home-gallery-caption">{item.caption || "School life"}</span>
          </button>
        ))}
      </div>

      {activeImage && activeIndex !== null ? (
        <div
          className="home-lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="School photo gallery"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <button ref={closeButtonRef} type="button" className="home-lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close gallery">
            <X aria-hidden="true" />
          </button>
          {visibleImages.length > 1 ? (
            <button type="button" className="home-lightbox-arrow home-lightbox-previous" onClick={() => setActiveIndex((activeIndex - 1 + visibleImages.length) % visibleImages.length)} aria-label="Previous photo">
              <ChevronLeft aria-hidden="true" />
            </button>
          ) : null}
          <figure className="home-lightbox-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeImage.image} alt={activeImage.caption || "School life"} />
            {activeImage.caption ? <figcaption>{activeImage.caption}</figcaption> : null}
          </figure>
          {visibleImages.length > 1 ? (
            <button type="button" className="home-lightbox-arrow home-lightbox-next" onClick={() => setActiveIndex((activeIndex + 1) % visibleImages.length)} aria-label="Next photo">
              <ChevronRight aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
