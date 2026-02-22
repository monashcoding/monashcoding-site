"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { OWeekPageData } from "@/lib/sanity/types";

// Page data (2026 pamphlet)
const pageImages: { src: string; alt: string; w: number; h: number; bg?: string }[] = [
  { src: "/oweek/page-1-cover.webp", alt: "Cover - Welcome to 2026 MAC!", w: 1600, h: 2263 },
  { src: "/oweek/page-2-about.webp", alt: "About Us - Monash Association of Coding", w: 1600, h: 2263 },
  { src: "/oweek/page-3-involved.webp", alt: "How to Get Involved - Events & Workshops", w: 1600, h: 2263 },
  { src: "/oweek/page-4-fyr.webp", alt: "First Year Reps", w: 1600, h: 2263 },
  { src: "/oweek/page-5-sponsors.webp", alt: "Our 2026 Sponsors", w: 1600, h: 2263 },
  { src: "/oweek/page-6-speedfriend.webp", alt: "MAC x CCA Speed Friending", w: 1600, h: 2263 },
  { src: "/oweek/page-7-notwaste.webp", alt: "MAC x IBL - How 2 Not Waste Uni", w: 1600, h: 2263 },
  { src: "/oweek/page-8-touch.webp", alt: "Let's Keep in Touch - Socials", w: 1600, h: 2263 },
  { src: "/oweek/page-9-schedule.webp", alt: "Semester 1 Schedule", w: 1600, h: 2263 },
  { src: "/oweek/page-10-close.webp", alt: "Closing - 2026 MAC", w: 1600, h: 2263, bg: "white" },
];

// QR code overlay buttons (positioned as % of page image)
const qrOverlays: Record<
  number,
  { top: string; left: string; width: string; height: string; url: string; label: string }[]
> = {
  2: [
    {
      top: "69.5%",
      left: "64.8%",
      width: "26%",
      height: "18%",
      url: "https://clubs.msa.monash.edu/organisation/7489/",
      label: "Join",
    },
  ],
  7: [
    { top: "76.5%", left: "9%", width: "18%", height: "11.8%", url: "https://instagram.com/monashcoding", label: "Instagram" },
    { top: "76.5%", left: "30.5%", width: "18%", height: "11.8%", url: "https://facebook.com/monashcoding", label: "Facebook" },
    { top: "76.5%", left: "52%", width: "18%", height: "11.8%", url: "https://discord.gg/2zB6ydCkA5", label: "Discord" },
    { top: "76.5%", left: "73.5%", width: "18%", height: "11.8%", url: "https://linkedin.com/company/monashcoding", label: "LinkedIn" },
  ],
};

// Ocean wave dividers using <use> + animateTransform for smooth continuous drift
const WAVE_W = 1440;
const WAVE_OPACITIES = [1, 0.4, 0.15];
const WAVE_DURATIONS = [12, 22, 20];
const WAVE_DIRECTIONS: [string, string][] = [
  [`-${WAVE_W} 0`, "0 0"],   // solid: right
  [`-${WAVE_W} 0`, "0 0"],   // opaque: right
  ["0 0", `-${WAVE_W} 0`],   // very opaque: left
];

// Build a sine-wave path spanning 2x viewport width for seamless looping
function buildWavePath(center: number, amp: number, fillY: number) {
  const a = amp * 1.35; // bezier control overshoot for sine approximation
  const up = +(center - a).toFixed(1);
  const dn = +(center + a).toFixed(1);
  let d = `M0,${center}`;
  for (let x = 0; x < WAVE_W * 2; x += 360) {
    const cy = (x / 360) % 2 === 0 ? up : dn;
    d += ` C${x + 120},${cy} ${x + 240},${cy} ${x + 360},${center}`;
  }
  d += ` L${WAVE_W * 2},${fillY} L0,${fillY} Z`;
  return d;
}

function OceanWaves({ color, position }: { color: string; position: "top" | "bottom" }) {
  const isTop = position === "top";
  const fillY = isTop ? 0 : 100;
  const centers = isTop ? [82, 84, 86] : [18, 16, 14];

  return (
    <div
      className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 overflow-hidden"
      style={{
        width: "100vw",
        height: "50vh",
        [isTop ? "bottom" : "top"]: "85%",
      }}
    >
      {WAVE_OPACITIES.map((opacity, i) => {
        const id = `wave-${position}-${i}`;
        return (
          <svg
            key={i}
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${WAVE_W} 100`}
            preserveAspectRatio="none"
          >
            <defs>
              <path id={id} d={buildWavePath(centers[i], 1, fillY)} />
            </defs>
            <use href={`#${id}`} fill={color} style={{ opacity }}>
              <animateTransform
                attributeName="transform"
                type="translate"
                from={WAVE_DIRECTIONS[i][0]}
                to={WAVE_DIRECTIONS[i][1]}
                dur={`${WAVE_DURATIONS[i]}s`}
                repeatCount="indefinite"
              />
            </use>
          </svg>
        );
      })}
    </div>
  );
}

// Brochure Paginator with scroll-snap

interface OWeekPageClientProps {
  data: OWeekPageData | null;
}

export default function OWeekPageClient({ data }: OWeekPageClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstPageRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageH, setPageH] = useState(0);
  const [snapPad, setSnapPad] = useState(0);
  const totalPages = pageImages.length;

  // Measure first page height for scroll centering
  useEffect(() => {
    const el = firstPageRef.current;
    const ct = scrollRef.current;
    if (!el || !ct) return;
    const measure = () => {
      const h = el.clientHeight;
      setPageH(h);
      setSnapPad(Math.max(0, (ct.clientHeight - h) / 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(ct);
    return () => ro.disconnect();
  }, []);

  // Lock body scrolling and prevent pull-to-refresh
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevPos = body.style.position;
    const prevWidth = body.style.width;
    const prevOverscrollHtml = html.style.overscrollBehavior;
    const prevOverscrollBody = body.style.overscrollBehavior;
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.overscrollBehavior = "none";
    return () => {
      html.style.overflow = prevHtml;
      html.style.overscrollBehavior = prevOverscrollHtml;
      body.style.overflow = prevBody;
      body.style.position = prevPos;
      body.style.width = prevWidth;
      body.style.overscrollBehavior = prevOverscrollBody;
    };
  }, []);

  // Track current page from scroll position
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || pageH === 0) return;
    const onScroll = () => {
      setCurrentPage(Math.min(Math.round(container.scrollTop / pageH), totalPages - 1));
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [totalPages, pageH]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const container = scrollRef.current;
      if (!container || pageH === 0) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        container.scrollBy({ top: pageH, behavior: "smooth" });
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        container.scrollBy({ top: -pageH, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageH]);

  const scrollToPage = useCallback((page: number) => {
    const container = scrollRef.current;
    if (!container || page < 0 || page >= totalPages || pageH === 0) return;
    container.scrollTo({ top: page * pageH, behavior: "smooth" });
  }, [totalPages, pageH]);

  return (
    <main className="relative h-dvh overflow-hidden bg-background">
      {/* Wave frame - mirrors brochure position so waves align to page edges */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center md:hidden">
        <div
          className="relative w-full"
          style={{
            maxWidth: "800px",
            maxHeight: "calc(100dvh - 140px)",
            aspectRatio: "1600 / 2263",
          }}
        >
          <OceanWaves color="#252525" position="top" />
          <OceanWaves color="#252525" position="bottom" />
        </div>
      </div>

      {/* Scroll-snap container */}
      <div
        ref={scrollRef}
        className="relative z-20 h-full snap-y snap-mandatory md:snap-proximity overflow-y-auto"
        style={{
          overscrollBehavior: "contain",
          paddingTop: snapPad,
          paddingBottom: snapPad,
          scrollPaddingTop: snapPad,
        }}
      >
        {pageImages.map((page, idx) => (
          <div
            key={idx}
            ref={idx === 0 ? firstPageRef : undefined}
            className="relative mx-auto w-full max-w-200 max-h-[calc(100dvh-140px)] md:max-h-none aspect-1600/2263 md:aspect-auto snap-start"
            style={{
              ...(page.bg && { backgroundColor: page.bg }),
            }}
          >
            <Image
              src={page.src}
              alt={page.alt}
              width={1600}
              height={2263}
              className="block h-full w-full md:h-auto"
              priority={idx < 2}
            />

            {/* QR code overlay buttons */}
            {qrOverlays[idx]?.map((ov, i) => (
              <a
                key={i}
                href={ov.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute flex items-center justify-center rounded-lg bg-gold-400/80 outline-1 outline-background transition-colors hover:bg-gold-300/90"
                style={{ top: ov.top, left: ov.left, width: ov.width, height: ov.height }}
              >
                <span className="px-2 text-center text-xs font-bold leading-tight text-background">
                  {ov.label}
                  <svg
                    className="ml-1 -mt-0.5 inline-block h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Page counter / navigation */}
      <div className="absolute inset-x-0 bottom-0 z-40 flex items-center justify-center gap-5 py-3">
        <button
          onClick={() => scrollToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          aria-label="Previous page"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 15l-7-7-7 7" />
          </svg>
        </button>

        <span className="font-mono text-sm text-muted-foreground">
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() => scrollToPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          aria-label="Next page"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7" />
          </svg>
        </button>
      </div>
    </main>
  );
}
