"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/landing";

export default function PublicTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const item = testimonials[activeIndex];

  if (!item) return null;

  function move(direction: -1 | 1) {
    setActiveIndex((index) => (index + direction + testimonials.length) % testimonials.length);
  }

  return (
    <div className="home-testimonial-slider" role="region" aria-roledescription="carousel" aria-label="School community testimonials">
      <figure className="home-testimonial-card" key={item.id || activeIndex} aria-live="polite">
        <Quote size={22} aria-hidden="true" />
        <blockquote>{item.message}</blockquote>
        <figcaption><strong>{item.name}</strong>{item.role ? <span>{item.role}</span> : null}</figcaption>
      </figure>
      {testimonials.length > 1 ? (
        <div className="home-testimonial-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous testimonial"><ChevronLeft size={18} aria-hidden="true" /></button>
          <span>{activeIndex + 1} / {testimonials.length}</span>
          <button type="button" onClick={() => move(1)} aria-label="Next testimonial"><ChevronRight size={18} aria-hidden="true" /></button>
        </div>
      ) : null}
    </div>
  );
}
