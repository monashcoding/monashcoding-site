"use client";

import Image from "next/image";
import { OWeekPageData } from "@/lib/sanity/types";

// ── Page data (2026 pamphlet) ────────────────────────────────────────
const pageImages = [
  { src: "/oweek/page-1-cover.webp", alt: "Cover – Welcome to 2026 MAC!", w: 1600, h: 2263 },
  { src: "/oweek/page-2-about.webp", alt: "About Us – Monash Association of Coding", w: 1600, h: 2263 },
  { src: "/oweek/page-3-involved.webp", alt: "How to Get Involved – Events & Workshops", w: 1600, h: 2263 },
  { src: "/oweek/page-4-fyr.webp", alt: "First Year Reps", w: 1600, h: 2263 },
  { src: "/oweek/page-5-sponsors.webp", alt: "Our 2026 Sponsors", w: 1600, h: 2263 },
  { src: "/oweek/page-6-speedfriend.webp", alt: "MAC x CCA Speed Friending", w: 1600, h: 2263 },
  { src: "/oweek/page-7-notwaste.webp", alt: "MAC x IBL – How 2 Not Waste Uni", w: 1600, h: 2263 },
  { src: "/oweek/page-8-touch.webp", alt: "Let's Keep in Touch – Socials", w: 1600, h: 2263 },
  { src: "/oweek/page-9-schedule.webp", alt: "Semester 1 Schedule", w: 1600, h: 2263 },
  { src: "/oweek/page-10-closing.webp", alt: "Closing – 2026 MAC", w: 1600, h: 2263 },
];

// Edge colors for smooth fade transitions between pages
const pageBgColors = [
  "#fdf8e8", // 1 cover – warm cream
  "#1a1a1a", // 2 about – dark
  "#fdf8e8", // 3 get involved – warm cream
  "#0a0a14", // 4 FYR – dark blue-black
  "#f5f5f5", // 5 sponsors – light
  "#f8f8f8", // 6 speed friending – white
  "#4a7a3c", // 7 not waste uni – green
  "#252525", // 8 keep in touch – dark
  "#2a2a2a", // 9 schedule – dark
  "#fdf8e8", // 10 closing – warm cream
];

// QR code overlay buttons (positioned as % of page image)
// Page 3 (index 2): QR at bottom-right → linktr.ee/monashcoding
// Page 8 (index 7): 4 QR codes for socials
const qrOverlays: Record<number, { top: string; left: string; width: string; height: string; url: string; label: string }[]> = {
  2: [
    { top: "72%", left: "55%", width: "35%", height: "20%", url: "https://linktr.ee/monashcoding", label: "Become a MAC Member" },
  ],
  7: [
    { top: "68%", left: "2%", width: "22%", height: "24%", url: "https://instagram.com/monashcoding", label: "Instagram" },
    { top: "68%", left: "26%", width: "22%", height: "24%", url: "https://facebook.com/monashcoding", label: "Facebook" },
    { top: "68%", left: "50%", width: "22%", height: "24%", url: "https://discord.gg/2zB6ydCkA5", label: "Discord" },
    { top: "68%", left: "74%", width: "22%", height: "24%", url: "https://linkedin.com/company/monashcoding", label: "LinkedIn" },
  ],
};

// ── Main Component ───────────────────────────────────────────────────
interface OWeekPageClientProps {
  data: OWeekPageData | null;
}

export default function OWeekPageClient({ data }: OWeekPageClientProps) {
  return (
    <main className="relative overflow-x-hidden">
      {pageImages.map((page, idx) => (
        <div
          key={idx}
          className="relative mx-auto w-full max-w-[800px]"
          style={{ backgroundColor: pageBgColors[idx] }}
        >
          <Image
            src={page.src}
            alt={page.alt}
            width={page.w}
            height={page.h}
            className="block h-auto w-full"
            priority={idx === 0}
          />

          {/* Fade into next page */}
          {idx < pageImages.length - 1 && (
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-[14%]"
              style={{
                background: `linear-gradient(to bottom, transparent 0%, ${pageBgColors[idx + 1]}10 25%, ${pageBgColors[idx + 1]}50 50%, ${pageBgColors[idx + 1]}BB 75%, ${pageBgColors[idx + 1]} 100%)`,
              }}
            />
          )}

          {/* Fade from previous page (top edge) */}
          {idx > 0 && (
            <div
              className="pointer-events-none absolute left-0 right-0 top-0 h-[10%]"
              style={{
                background: `linear-gradient(to bottom, ${pageBgColors[idx]} 0%, ${pageBgColors[idx]}BB 30%, ${pageBgColors[idx]}50 55%, ${pageBgColors[idx]}10 80%, transparent 100%)`,
              }}
            />
          )}

          {/* QR code overlay buttons */}
          {qrOverlays[idx]?.map((overlay, oi) => (
            <a
              key={oi}
              href={overlay.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm transition-colors hover:bg-black/80"
              style={{
                top: overlay.top,
                left: overlay.left,
                width: overlay.width,
                height: overlay.height,
              }}
            >
              <span className="px-2 text-center text-sm font-bold leading-tight text-white drop-shadow-md">
                {overlay.label}
                <svg className="ml-1 -mt-0.5 inline-block h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      ))}
    </main>
  );
}
