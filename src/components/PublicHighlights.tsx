"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, GraduationCap, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import type { WhyUsItem } from "@/lib/landing";

const highlightIcons = [BookOpen, UsersRound, ShieldCheck, GraduationCap, Sparkles];
const initialVisibleCount = 4;

type Props = {
  highlights: WhyUsItem[];
  eyebrow: string;
  title: string;
  description: string;
};

export default function PublicHighlights({ highlights, eyebrow, title, description }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visibleHighlights = expanded ? highlights : highlights.slice(0, initialVisibleCount);
  const hasMore = highlights.length > initialVisibleCount;

  return (
    <section id="highlights" className="home-section home-highlights">
      <div className="home-section-inner home-highlights-inner" data-reveal>
        <div className="home-section-heading home-highlights-heading">
          <div>
            <p className="home-section-kicker">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <div className="home-highlights-heading-aside">
            <p>{description}</p>
            <div className="home-highlights-book-scene" aria-hidden="true">
              <span className="home-highlights-book-orbit home-highlights-book-orbit-one" />
              <span className="home-highlights-book-orbit home-highlights-book-orbit-two" />
              <div className="home-highlights-book">
                <svg viewBox="0 0 96 72" fill="none">
                  <path d="M48 22C36 14 22 13 9 18v36c14-4 27-2 39 7m0-39c12-8 26-9 39-4v36c-14-4-27-2-39 7m0-39v39" fill="currentColor" fillOpacity=".14" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M18 27c7-2 14-.7 20 2M18 34c7-2 14-.7 20 2m20-7c6-1.3 13-1.8 20 0m-20 7c6-1.3 13-1.8 20 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="m75 11 2 4.5 4.5 2-4.5 2L75 24l-2-4.5-4.5-2 4.5-2 2-4.5Z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="home-highlights-grid" id="home-highlights-grid">
          {visibleHighlights.map((item, index) => {
            const Icon = highlightIcons[index % highlightIcons.length];
            return (
              <article
                className="home-highlight-card"
                key={item.id || `${item.title}-${index}`}
                style={{ animationDelay: `${index * 55}ms` }}
              >
                <div className="home-highlight-content">
                  <span className="home-highlight-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span>
                  <span className="home-highlight-number">{item.number || String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}
                </div>
              </article>
            );
          })}
        </div>

        {hasMore ? (
          <div className="home-highlights-actions">
            <button
              type="button"
              className="home-highlights-more"
              aria-expanded={expanded}
              aria-controls="home-highlights-grid"
              onClick={() => setExpanded((current) => !current)}
            >
              {expanded ? "Show fewer" : "See more"}
              <ChevronDown size={17} aria-hidden="true" />
            </button>
            <span className="sr-only" aria-live="polite">
              Showing {visibleHighlights.length} of {highlights.length} school strengths.
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
