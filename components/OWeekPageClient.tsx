"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { OWeekPageData } from "@/lib/sanity/types";

// ─── Animation variant ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Schedule data (exact from booklet page 9) ─────────────────────
type Cat = "social" | "mac" | "collabs" | "competitions" | "industry";
const catColor: Record<Cat, string> = {
  social: "#2DD4BF",
  mac: "#EF4444",
  collabs: "#A78BFA",
  competitions: "#FBBF24",
  industry: "#FB923C",
};
const catLabel: Record<Cat, string> = {
  social: "Social",
  mac: "MAC",
  collabs: "Collabs",
  competitions: "Competitions",
  industry: "Industry",
};

interface Evt { name: string; cat: Cat }
interface Week { wk: string; events: Evt[] }
const schedule: Week[] = [
  { wk: "0", events: [{ name: "MAC O-Week Stall", cat: "mac" }, { name: "Jaffy Series: Speed Friending", cat: "social" }] },
  { wk: "1", events: [{ name: "How to: Not Waste Uni (IT Edition)", cat: "collabs" }, { name: "Trivia Night", cat: "social" }] },
  { wk: "2", events: [{ name: "All Things Interviews", cat: "mac" }, { name: "Optiver Jane Street", cat: "industry" }, { name: "UNIHACK 2025", cat: "competitions" }] },
  { wk: "3", events: [{ name: "Crack the Case Study Interview", cat: "mac" }, { name: "Jaffy Series: Amazing Race", cat: "social" }] },
  { wk: "4", events: [{ name: "Beat the Behavioural", cat: "mac" }, { name: "MAC Games Night", cat: "social" }, { name: "MAC x GDSoC: Intro to DevOps", cat: "collabs" }] },
  { wk: "5", events: [{ name: "Cracking the Coding Interview", cat: "mac" }] },
  { wk: "6", events: [{ name: "MAC Networking Night", cat: "industry" }] },
  { wk: "7", events: [{ name: "MACathon 2025", cat: "competitions" }, { name: "How Hackathons are Won: For Winners, by Winners", cat: "mac" }] },
  { wk: "8", events: [] },
  { wk: "9", events: [] },
  { wk: "10", events: [{ name: "MAC Study Rooms", cat: "mac" }] },
  { wk: "11", events: [{ name: "MAC Study Rooms", cat: "mac" }] },
  { wk: "12", events: [{ name: "MAC Study Rooms", cat: "mac" }] },
];

// ─── Page image data for small-screen view ──────────────────────────
const pageImages = [
  { src: "/oweek/page-1-cover.webp", alt: "Cover – What's Cooking at MAC?", w: 1600, h: 2263 },
  { src: "/oweek/page-2-about.webp", alt: "About Us", w: 1600, h: 2263 },
  { src: "/oweek/page-3-involved.webp", alt: "How to Get Involved", w: 1600, h: 2263 },
  { src: "/oweek/page-4-fyr.webp", alt: "First Year Reps", w: 1600, h: 2263 },
  { src: "/oweek/page-5-sponsors.webp", alt: "Our Sponsors", w: 1600, h: 2263 },
  { src: "/oweek/page-6-speedfriend.webp", alt: "Speed Friending Event", w: 1600, h: 2263 },
  { src: "/oweek/page-7-notwaste.webp", alt: "How to Not Waste Uni", w: 1600, h: 2263 },
  { src: "/oweek/page-8-touch.webp", alt: "Let's Keep in Touch", w: 1600, h: 2263 },
  { src: "/oweek/page-9-schedule.webp", alt: "Semester Schedule", w: 1600, h: 2263 },
  { src: "/oweek/page-10-closing.webp", alt: "Closing", w: 1600, h: 2263 },
];

// QR code overlay buttons – positioned as % of page image dimensions
// Page 3 (index 2): QR at bottom-left → links to linktr.ee/monashcoding
// Page 8 (index 7): 4 QR codes for socials
const qrOverlays: Record<number, { top: string; left: string; width: string; height: string; url: string; label: string }[]> = {
  2: [
    { top: "72%", left: "5%", width: "35%", height: "22%", url: "https://linktr.ee/monashcoding", label: "Become a MAC Member" },
  ],
  7: [
    { top: "30%", left: "3%", width: "22%", height: "16%", url: "https://instagram.com/monashcoding", label: "Instagram" },
    { top: "30%", left: "27%", width: "22%", height: "16%", url: "https://facebook.com/monashcoding", label: "Facebook" },
    { top: "30%", left: "51%", width: "22%", height: "16%", url: "https://discord.gg/2zB6ydCkA5", label: "Discord" },
    { top: "30%", left: "75%", width: "22%", height: "16%", url: "https://linkedin.com/company/monashcoding", label: "LinkedIn" },
  ],
};

// ─── Main Component ─────────────────────────────────────────────────
interface OWeekPageClientProps {
  data: OWeekPageData | null;
}

export default function OWeekPageClient({ data }: OWeekPageClientProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsSmallScreen(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isSmallScreen) {
    return <SmallScreenView />;
  }

  return (
    <main className="relative overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <GetInvolvedSection />
      <FirstYearRepsSection />
      <SponsorsSection />
      <SpeedFriendingSection />
      <NotWasteUniSection />
      <KeepInTouchSection />
      <ScheduleSection />
      <ClosingSection />
    </main>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SMALL SCREEN VIEW – page images with QR code → button overlays
   ════════════════════════════════════════════════════════════════════ */
// Background colors that roughly match each page's dominant edge color for smooth fades
const pageBgColors = [
  "#f5f5f5", // 1 cover – light gray
  "#fff8e1", // 2 about – warm yellow
  "#3a2266", // 3 involved – dark purple
  "#fce4ec", // 4 FYR – pink
  "#f5f5f5", // 5 sponsors – white/light
  "#ffffff", // 6 speed friending – white
  "#e8f5e9", // 7 not waste uni – light green
  "#1a1a1a", // 8 keep in touch – dark
  "#263238",  // 9 schedule – dark slate
  "#ffffff", // 10 closing – white
];

function SmallScreenView() {
  return (
    <main className="relative overflow-x-hidden">
      {pageImages.map((page, idx) => (
        <div key={idx} className="relative w-full" style={{ backgroundColor: pageBgColors[idx] }}>
          <Image
            src={page.src}
            alt={page.alt}
            width={page.w}
            height={page.h}
            className="w-full h-auto block"
            priority={idx === 0}
          />
          {/* Fade into next page */}
          {idx < pageImages.length - 1 && (
            <div
              className="absolute bottom-0 left-0 right-0 h-[8%] pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, transparent, ${pageBgColors[idx + 1]})`,
              }}
            />
          )}
          {/* Fade from previous page (top edge) */}
          {idx > 0 && (
            <div
              className="absolute top-0 left-0 right-0 h-[5%] pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, ${pageBgColors[idx]}, transparent)`,
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
              className="absolute flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors rounded-lg backdrop-blur-sm"
              style={{
                top: overlay.top,
                left: overlay.left,
                width: overlay.width,
                height: overlay.height,
              }}
            >
              <span className="text-white font-bold text-sm text-center px-2 leading-tight drop-shadow-md">
                {overlay.label}
                <svg className="inline-block w-4 h-4 ml-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

/* ════════════════════════════════════════════════════════════════════
   INLINE SVG MASCOT CHARACTERS
   Recreated from the booklet cover – simple geometric shapes + faces
   ════════════════════════════════════════════════════════════════════ */

function GreenCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="95" fill="#6BBF59" />
      {/* Face – small dots for eyes, triangle nose, curved smile */}
      <circle cx="80" cy="100" r="4" fill="#2d5a1e" />
      <circle cx="108" cy="100" r="4" fill="#2d5a1e" />
      <polygon points="92,112 96,112 94,118" fill="#2d5a1e" />
      <path d="M82 126 Q94 136 106 126" stroke="#2d5a1e" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function BlueHourglass({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 260" fill="none">
      {/* Top dome – wide semicircle at top */}
      <path d="M5 10 Q5 130 100 130 Q195 130 195 10 Z" fill="#4285F4" />
      {/* Bottom dome – wide semicircle at bottom */}
      <path d="M5 250 Q5 130 100 130 Q195 130 195 250 Z" fill="#4285F4" />
      {/* Face in upper portion */}
      <circle cx="80" cy="62" r="5" fill="#1a3566" />
      <circle cx="115" cy="62" r="5" fill="#1a3566" />
      <polygon points="95,76 100,76 97.5,82" fill="#1a3566" />
      <path d="M84 90 Q98 100 112 90" stroke="#1a3566" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function RedButterfly({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 200" fill="none">
      {/* Left wing – large rounded bowtie shape */}
      <path d="M120 100 Q40 10 10 50 Q-10 80 10 100 Q-10 120 10 150 Q40 190 120 100Z" fill="#F06449" />
      {/* Right wing */}
      <path d="M120 100 Q200 10 230 50 Q250 80 230 100 Q250 120 230 150 Q200 190 120 100Z" fill="#F06449" />
      {/* Face in left-center area */}
      <circle cx="82" cy="88" r="4.5" fill="#6b2015" />
      <circle cx="105" cy="88" r="4.5" fill="#6b2015" />
      <polygon points="91,100 95,100 93,106" fill="#6b2015" />
      <path d="M84 112 Q94 121 104 112" stroke="#6b2015" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function YellowQuarter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none">
      {/* Quarter circle – top-left corner rounded into bottom-right */}
      <path d="M0 0 H200 V200 A200 200 0 0 1 0 0Z" fill="#FFD93D" />
      {/* Face in bottom-right area */}
      <circle cx="120" cy="120" r="4.5" fill="#6b5a00" />
      <circle cx="148" cy="120" r="4.5" fill="#6b5a00" />
      <polygon points="132,132 136,132 134,138" fill="#6b5a00" />
      <path d="M122 146 Q134 156 146 146" stroke="#6b5a00" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function MacLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo/logo.jpg"
      alt="MAC Logo"
      width={100}
      height={100}
      className={`${className} rounded-full object-cover`}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   DECORATIVE BLOB SHAPES (CSS-based, matching booklet style)
   ════════════════════════════════════════════════════════════════════ */

function GrayBlob({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 300" fill="none">
      <path
        d="M50 150 Q0 50 100 30 Q200 0 280 50 Q380 100 350 200 Q320 280 200 270 Q80 260 50 150Z"
        fill="#e8e8e8"
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   1. HERO / COVER
   White bg, 4 character shapes in 2×2 grid, "What's Cooking at MAC?"
   ════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#f5f5f5] overflow-hidden flex flex-col items-center justify-center px-4 py-20">
      {/* Background gray blobs */}
      <GrayBlob className="absolute top-[-5%] left-[-10%] w-[50vw] max-w-[600px] opacity-60 pointer-events-none" />
      <GrayBlob className="absolute top-[20%] right-[-15%] w-[55vw] max-w-[650px] opacity-50 pointer-events-none rotate-45" />
      <GrayBlob className="absolute bottom-[-5%] left-[10%] w-[45vw] max-w-[500px] opacity-50 pointer-events-none -rotate-30" />

      {/* Characters 2×2 grid */}
      <motion.div
        className="relative z-10 grid grid-cols-2 gap-2 sm:gap-4 w-[70vw] max-w-[500px] mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
          <GreenCircle className="w-full h-auto" />
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
          <BlueHourglass className="w-full h-auto" />
        </motion.div>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          <RedButterfly className="w-full h-auto" />
        </motion.div>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}>
          <YellowQuarter className="w-full h-auto" />
        </motion.div>
      </motion.div>

      {/* Title text */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h1 className="text-[clamp(1.8rem,5vw,3.5rem)] font-extrabold text-[#252525] leading-tight tracking-tight uppercase">
          What&apos;s Cooking at
        </h1>
        <div className="flex items-center justify-center gap-3 mt-1">
          <MacLogo className="w-[clamp(2rem,5vw,3.5rem)] h-[clamp(2rem,5vw,3.5rem)]" />
          <span className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold text-[#252525] tracking-tight">
            MAC?
          </span>
        </div>
      </motion.div>

      {/* Gradient into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#fff8e1] pointer-events-none" />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   2. ABOUT US
   Yellow/grey theme, decorative blobs & characters on sides, content center
   ════════════════════════════════════════════════════════════════════ */
function AboutSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#fff8e1] via-[#fef9ef] to-[#f5f5f5] py-20 md:py-28 px-4 overflow-hidden">
      {/* Decorative – left side */}
      <div className="absolute left-0 top-[30%] w-[12vw] max-w-[100px] -translate-x-[30%] opacity-80 pointer-events-none">
        <svg viewBox="0 0 100 200" fill="none"><ellipse cx="50" cy="100" rx="50" ry="100" fill="#FF9800" /></svg>
      </div>
      {/* Decorative – yellow flower top-left */}
      <div className="absolute top-6 left-[8%] w-8 h-8 md:w-12 md:h-12 pointer-events-none">
        <svg viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="10" r="8" fill="#FFD93D" />
          <circle cx="20" cy="30" r="8" fill="#FFD93D" />
          <circle cx="10" cy="20" r="8" fill="#FFD93D" />
          <circle cx="30" cy="20" r="8" fill="#FFD93D" />
        </svg>
      </div>
      {/* Decorative – right side character */}
      <motion.div
        className="absolute right-[3%] top-[5%] w-[15vw] max-w-[100px] pointer-events-none"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="#FF9800" />
          <circle cx="38" cy="45" r="4" fill="#5c2e00" />
          <circle cx="58" cy="45" r="4" fill="#5c2e00" />
          <polygon points="47,55 53,55 50,60" fill="#5c2e00" />
          <path d="M40 65 Q50 74 60 65" stroke="#5c2e00" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </motion.div>
      {/* Decorative – yellow ring bottom-right */}
      <div className="absolute bottom-[10%] right-[5%] w-[10vw] max-w-[80px] pointer-events-none">
        <svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="30" stroke="#FFD93D" strokeWidth="10" /></svg>
      </div>
      {/* Small smiley at bottom center */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 pointer-events-none"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <GreenCircle className="w-full h-full" />
      </motion.div>

      {/* Content – center */}
      <div className="relative z-10 max-w-xl mx-auto">
        <motion.h2
          className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold text-[#252525] italic"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <span className="relative inline-block">
            About Us
            <span className="absolute bottom-1 left-0 w-full h-3 bg-[#FFD93D] -z-10 rounded-sm" />
          </span>
        </motion.h2>

        <motion.div
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#e0e0e0]"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-[#252525] italic leading-relaxed text-base md:text-lg text-center">
            We are a club dedicated to growing the confidence and coding skills of our community, encouraging
            members&apos; to excel and get them industry ready.
          </p>
        </motion.div>

        <motion.div
          className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#e0e0e0]"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-[#252525] leading-relaxed text-sm md:text-base text-center">
            With a thriving community of <strong>over 1,000 members</strong>, we aim to foster a warm, welcoming
            environment where <strong>beginners</strong> and <strong>experienced</strong> coders can learn exciting new
            technical and soft skills. From our highly anticipated &apos;How to Beat IBL&apos; and &apos;Mock Behavioural
            Interview&apos; events, to our Tech Careers Evening night,{" "}
            <strong>we empower students to collectively succeed!</strong>
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#ede7f6] pointer-events-none" />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   3. HOW TO GET INVOLVED
   Purple/lavender theme
   ════════════════════════════════════════════════════════════════════ */
function GetInvolvedSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#ede7f6] via-[#e8e0f0] to-[#ede7f6] py-20 md:py-28 px-4 overflow-hidden">
      {/* Purple blobs */}
      <div className="absolute top-[-5%] right-[-5%] w-[30vw] max-w-[250px] pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="90" fill="#b39ddb" opacity="0.35" /></svg>
      </div>
      <div className="absolute bottom-[10%] left-[-5%] w-[25vw] max-w-[200px] pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="80" fill="#9575cd" opacity="0.25" /></svg>
      </div>
      {/* Smiley characters */}
      <motion.div
        className="absolute top-[15%] right-[5%] w-[8vw] max-w-[50px] pointer-events-none opacity-70"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 50 50" fill="none">
          <circle cx="25" cy="25" r="22" fill="#b39ddb" />
          <circle cx="18" cy="22" r="2.5" fill="#4a148c" />
          <circle cx="30" cy="22" r="2.5" fill="#4a148c" />
          <path d="M19 32 Q25 37 31 32" stroke="#4a148c" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.h2
          className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#4a148c]"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          How to get involved?
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="space-y-4"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-[#252525] text-sm md:text-base leading-relaxed">
              The best way to get involved is through <strong>attending our events!</strong> You&apos;ll have the
              opportunity to connect with fellow students and network with our esteemed industry partners.
              With MAC, you can build meaningful social connections and gain valuable industry skills along the way!
            </p>
            <a
              href="https://linktr.ee/monashcoding"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#6a1b9a] text-white font-bold rounded-full text-sm hover:bg-[#8e24aa] transition-colors"
            >
              Become a MAC Member Today!
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-[#252525] text-sm md:text-base leading-relaxed">
              We take pride in up-skilling our members through a{" "}
              <strong>variety of informative workshops</strong>. In the coming weeks, you can look forward to
              interview preparation workshops, social events and a nation-wide hackathon!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#fce4ec] pointer-events-none" />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   4. FIRST YEAR REPS
   Red/pink theme with ribbon decorations
   ════════════════════════════════════════════════════════════════════ */
function FirstYearRepsSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#fce4ec] via-[#fce4ec] to-[#fff3e0] py-20 md:py-28 px-4 overflow-hidden">
      {/* Decorative pink ribbons/swirls */}
      <div className="absolute top-0 left-0 w-full pointer-events-none opacity-30">
        <svg viewBox="0 0 800 200" fill="none" className="w-full">
          <path d="M-20 80 Q100 20 200 80 Q300 140 400 80 Q500 20 600 80 Q700 140 820 80" stroke="#e91e63" strokeWidth="3" fill="none" />
          <path d="M-20 120 Q100 60 200 120 Q300 180 400 120 Q500 60 600 120 Q700 180 820 120" stroke="#f06292" strokeWidth="2" fill="none" />
        </svg>
      </div>
      {/* Red flower decorations */}
      <div className="absolute top-[40%] left-[3%] w-10 h-10 md:w-14 md:h-14 pointer-events-none">
        <svg viewBox="0 0 50 50" fill="none">
          <circle cx="25" cy="15" r="10" fill="#e53935" />
          <circle cx="25" cy="35" r="10" fill="#e53935" />
          <circle cx="15" cy="25" r="10" fill="#e53935" />
          <circle cx="35" cy="25" r="10" fill="#e53935" />
          <circle cx="25" cy="25" r="6" fill="#b71c1c" />
        </svg>
      </div>
      <div className="absolute bottom-[20%] right-[4%] w-8 h-8 md:w-12 md:h-12 pointer-events-none">
        <svg viewBox="0 0 50 50" fill="none">
          <circle cx="25" cy="15" r="8" fill="#ef5350" />
          <circle cx="25" cy="35" r="8" fill="#ef5350" />
          <circle cx="15" cy="25" r="8" fill="#ef5350" />
          <circle cx="35" cy="25" r="8" fill="#ef5350" />
          <circle cx="25" cy="25" r="5" fill="#c62828" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.h2
          className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#c62828] text-right"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          First Year Reps
        </motion.h2>

        <div className="mt-8 space-y-6">
          <motion.p
            className="text-[#252525] text-sm md:text-base leading-relaxed"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            For all <strong>first-year students</strong>, MAC has you covered with a series of upcoming workshops to
            help you tackle the transition to university life, as well as some exciting social events to ensure you
            get off to the strongest start possible! Check out the events calendar on the back for details.
          </motion.p>

          <motion.p
            className="text-[#252525] text-sm md:text-base leading-relaxed"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          >
            We&apos;re also on the lookout for enthusiastic students to join our committee as{" "}
            <strong>First Year Representatives!</strong> This is a fantastic opportunity to be part of a vibrant
            culture full of learning, leadership and community. As a FYR, you&apos;ll get the opportunity to participate
            in two rotations, working with one team at a time to make meaningful contributions to the club. It&apos;s
            like a mini internship! <strong>No technical experience is required</strong> – just bring your creativity
            and a willingness to rock up to some awesome stuff!
          </motion.p>

          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#f48fb1]/40"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-[#252525] text-sm md:text-base">
              Apply now to create lasting memories in your first year while making a difference!
            </p>
            <p className="text-[#c62828] text-xl md:text-2xl font-extrabold mt-2">
              Applications close March 16.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#fff3e0] pointer-events-none" />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   5. OUR SPONSORS
   White/orange theme, sponsor logos image
   ════════════════════════════════════════════════════════════════════ */
function SponsorsSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#fff3e0] via-[#f5f5f5] to-[#f5f5f5] py-20 md:py-28 px-4 overflow-hidden">
      {/* Orange wavy decorations */}
      <div className="absolute top-0 right-[-5%] w-[20vw] max-w-[150px] pointer-events-none">
        <svg viewBox="0 0 100 200" fill="none">
          <path d="M50 0 Q100 50 50 100 Q0 150 50 200" stroke="#FF9800" strokeWidth="20" fill="none" opacity="0.5" />
          <path d="M30 0 Q80 50 30 100 Q-20 150 30 200" stroke="#FFB74D" strokeWidth="12" fill="none" opacity="0.4" />
        </svg>
      </div>
      {/* Orange character bottom-right */}
      <motion.div
        className="absolute bottom-[5%] right-[3%] w-[12vw] max-w-[80px] pointer-events-none"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="#FF9800" />
          <circle cx="38" cy="45" r="4" fill="#4e2c00" />
          <circle cx="58" cy="45" r="4" fill="#4e2c00" />
          <path d="M40 60 Q50 68 60 60" stroke="#4e2c00" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </motion.div>
      {/* Flower top-right */}
      <div className="absolute top-[8%] right-[15%] w-[12vw] max-w-[90px] pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="25" r="20" fill="#FFB74D" />
          <circle cx="50" cy="75" r="20" fill="#FFB74D" />
          <circle cx="25" cy="50" r="20" fill="#FFB74D" />
          <circle cx="75" cy="50" r="20" fill="#FFB74D" />
          <circle cx="50" cy="50" r="15" fill="#FF9800" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.h2
          className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#E65100]"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          Our Sponsors
        </motion.h2>

        <motion.p
          className="mt-4 text-[#252525] text-sm md:text-base leading-relaxed"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
        >
          We&apos;re proud to work with some of the best and most <strong>sought-after companies</strong> in the tech
          industry. Through these partnerships, we bring you unparalleled <strong>opportunities, resources</strong> and{" "}
          <strong>insider insights</strong> that will give you an edge in your job applications!
        </motion.p>

        <motion.div
          className="mt-8"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Image
            src="/oweek/sponsor-logos.webp"
            alt="Sponsors: Atlassian, Canva, IMC Trading, Jane Street, Origin, Macquarie, Accenture, Optiver, Citadel"
            width={1400}
            height={1050}
            className="w-full h-auto rounded-xl"
          />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none" />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   6. SPEED FRIENDING
   Orange wavy lines, poster-style event page – kept as image for fidelity
   ════════════════════════════════════════════════════════════════════ */
function SpeedFriendingSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-white to-[#f1f8e9] py-20 md:py-28 px-4 overflow-hidden">
      {/* Orange wavy borders on sides */}
      <div className="absolute top-0 left-0 h-full w-[15vw] max-w-[120px] pointer-events-none">
        <svg viewBox="0 0 100 600" fill="none" className="h-full w-full">
          <path d="M80 0 Q20 100 80 200 Q140 300 80 400 Q20 500 80 600" stroke="#FF9800" strokeWidth="25" fill="none" opacity="0.4" />
          <path d="M50 0 Q-10 100 50 200 Q110 300 50 400 Q-10 500 50 600" stroke="#FFB74D" strokeWidth="18" fill="none" opacity="0.3" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 h-full w-[15vw] max-w-[120px] pointer-events-none">
        <svg viewBox="0 0 100 600" fill="none" className="h-full w-full">
          <path d="M20 0 Q80 100 20 200 Q-40 300 20 400 Q80 500 20 600" stroke="#FF9800" strokeWidth="25" fill="none" opacity="0.4" />
          <path d="M50 0 Q110 100 50 200 Q-10 300 50 400 Q110 500 50 600" stroke="#FFB74D" strokeWidth="18" fill="none" opacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center">
        <motion.p
          className="text-sm md:text-base font-bold tracking-[0.15em] text-[#252525]/70 uppercase"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          MAC X CCA
        </motion.p>
        <motion.h2
          className="text-[clamp(3rem,8vw,5.5rem)] font-extrabold text-[#252525] leading-none mt-2"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          Speed<br />Friending
        </motion.h2>

        <motion.div
          className="mt-10 space-y-3"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="inline-block px-6 py-2 bg-[#252525] text-white font-bold text-lg md:text-xl">
            Tuesday 25th Feb, 4-6PM
          </div>
          <br />
          <div className="inline-block px-6 py-2 bg-[#252525] text-white font-bold text-base md:text-lg">
            LTB G31
          </div>
        </motion.div>

        <motion.a
          href="https://monash.club/mac-cca-speedfriend"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-12 px-6 py-2 bg-[#252525] text-white font-medium text-sm hover:bg-[#404040] transition-colors"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }}
        >
          monash.club/mac-cca-speedfriend
        </motion.a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#f1f8e9] pointer-events-none" />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   7. HOW TO NOT WASTE UNI
   Green/white theme with stars and crumpled paper vibe
   ════════════════════════════════════════════════════════════════════ */
function NotWasteUniSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#f1f8e9] via-white to-[#e0e0e0] py-20 md:py-28 px-4 overflow-hidden">
      {/* Green star decorations scattered */}
      {[
        { top: "8%", left: "5%", size: 12 },
        { top: "15%", right: "10%", size: 8 },
        { top: "35%", left: "8%", size: 10 },
        { top: "50%", right: "6%", size: 14 },
        { top: "70%", left: "12%", size: 9 },
        { top: "80%", right: "15%", size: 11 },
      ].map((star, i) => (
        <div
          key={i}
          className="absolute pointer-events-none text-[#4caf50]"
          style={{ top: star.top, left: "left" in star ? star.left : undefined, right: "right" in star ? star.right : undefined }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 20 20" fill="currentColor">
            <polygon points="10,0 12,8 20,8 14,13 16,20 10,16 4,20 6,13 0,8 8,8" />
          </svg>
        </div>
      ))}

      <div className="relative z-10 max-w-lg mx-auto text-center">
        <motion.p
          className="text-sm md:text-base font-bold tracking-[0.15em] text-[#252525]/60 uppercase"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          MAC x IBL
        </motion.p>
        <motion.h2
          className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold text-[#252525] leading-tight mt-2"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          How to:<br />Not Waste Uni<br />
          <span className="text-[clamp(1.5rem,4vw,2.5rem)]">(IT Edition)</span>
        </motion.h2>

        <motion.div
          className="mt-10 space-y-3"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="inline-block px-6 py-2 bg-[#4caf50] text-white font-bold text-lg md:text-xl rounded-md">
            Wednesday 5th March, 6-8PM
          </div>
          <br />
          <div className="inline-block px-6 py-2 bg-[#4caf50] text-white font-bold text-base md:text-lg rounded-md">
            S7 Lecture Theatre
          </div>
        </motion.div>

        <motion.a
          href="https://monash.club/how-to-uni"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-12 px-6 py-2 bg-[#252525] text-white font-medium text-sm hover:bg-[#404040] transition-colors rounded"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }}
        >
          monash.club/how-to-uni
        </motion.a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#6d4c6e] pointer-events-none" />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   8. LET'S KEEP IN TOUCH
   Pink/grey theme, social links + group photo
   ════════════════════════════════════════════════════════════════════ */
const socialLinksData = [
  { name: "Instagram", url: "https://instagram.com/monashcoding", color: "#E91E63" },
  { name: "Facebook", url: "https://facebook.com/monashcoding", color: "#E91E63" },
  { name: "Discord", url: "https://discord.gg/2zB6ydCkA5", color: "#E91E63" },
  { name: "LinkedIn", url: "https://linkedin.com/company/monashcoding", color: "#E91E63" },
];

function KeepInTouchSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#6d4c6e] via-[#8e6690] to-[#f8bbd0] py-20 md:py-28 px-4 overflow-hidden">
      {/* Decorative pink blobs */}
      <div className="absolute top-[5%] left-[-5%] w-[25vw] max-w-[200px] pointer-events-none opacity-40">
        <svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="90" fill="#e91e63" /></svg>
      </div>
      <div className="absolute top-[30%] right-[-3%] w-[15vw] max-w-[120px] pointer-events-none opacity-30">
        <svg viewBox="0 0 200 300" fill="none">
          <path d="M100 0 Q180 80 100 150 Q20 80 100 0Z" fill="#f48fb1" />
          <circle cx="70" cy="60" r="5" fill="#880e4f" />
          <circle cx="120" cy="60" r="5" fill="#880e4f" />
        </svg>
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center">
        <motion.h2
          className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold text-[#f48fb1] italic"
          style={{ fontFamily: "cursive, serif" }}
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          Let&apos;s keep in touch!
        </motion.h2>

        <motion.p
          className="mt-4 text-white/80 text-sm md:text-base leading-relaxed"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
        >
          Make sure to also follow! Access our LinkTree, product reviews on YouTube and stay up to date on announcements, opportunities and your timely dose of CS humour!
        </motion.p>

        <motion.div
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          {socialLinksData.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-[#e91e63] rounded-xl text-white hover:bg-[#c2185b] transition-colors"
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <SocialIcon name={link.name} className="w-10 h-10" />
              <span className="text-xs font-medium">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Group photo */}
        <motion.div
          className="mt-10 rounded-2xl overflow-hidden border-4 border-white/30"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Image
            src="/oweek/group-photo.webp"
            alt="MAC Committee Group Photo"
            width={1400}
            height={550}
            className="w-full h-auto"
          />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#f5f0e0] pointer-events-none" />
    </section>
  );
}

function SocialIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "Instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "Facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z" />
        </svg>
      );
    case "Discord":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ════════════════════════════════════════════════════════════════════
   9. SEMESTER SCHEDULE
   Dark bg, weekly event grid with color-coded categories
   ════════════════════════════════════════════════════════════════════ */
function ScheduleSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#f5f0e0] via-[#37474f] to-[#263238] py-20 md:py-28 px-4 overflow-hidden">
      {/* Decorative characters on sides */}
      <motion.div
        className="absolute top-[5%] left-[2%] w-[10vw] max-w-[60px] pointer-events-none"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 50 50" fill="none">
          <circle cx="25" cy="25" r="22" fill="#FF9800" />
          <circle cx="18" cy="22" r="3" fill="#4e2c00" />
          <circle cx="30" cy="22" r="3" fill="#4e2c00" />
          <path d="M19 32 Q25 37 31 32" stroke="#4e2c00" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute top-[2%] right-[5%] w-[8vw] max-w-[50px] pointer-events-none"
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 40 40" fill="none">
          <polygon points="20,0 24,15 40,15 27,24 31,40 20,30 9,40 13,24 0,15 16,15" fill="#FFD93D" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute right-[3%] top-[45%] w-[14vw] max-w-[90px] pointer-events-none"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="35" fill="#FFD93D" />
          <circle cx="40" cy="45" r="3.5" fill="#5c4a00" />
          <circle cx="58" cy="45" r="3.5" fill="#5c4a00" />
          <path d="M42 58 Q50 65 58 58" stroke="#5c4a00" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Flower petals around */}
          <ellipse cx="50" cy="10" rx="15" ry="12" fill="#FFD93D" opacity="0.5" />
          <ellipse cx="85" cy="35" rx="12" ry="15" fill="#FFD93D" opacity="0.5" />
          <ellipse cx="85" cy="65" rx="12" ry="15" fill="#FFD93D" opacity="0.5" />
          <ellipse cx="50" cy="90" rx="15" ry="12" fill="#FFD93D" opacity="0.5" />
          <ellipse cx="15" cy="65" rx="12" ry="15" fill="#FFD93D" opacity="0.5" />
          <ellipse cx="15" cy="35" rx="12" ry="15" fill="#FFD93D" opacity="0.5" />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.h2
          className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-white text-center mb-4"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          Semester Schedule
        </motion.h2>

        {/* Legend */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
        >
          {(Object.entries(catLabel) as [Cat, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: catColor[key], color: "#252525" }}>
              {label}
            </div>
          ))}
        </motion.div>

        {/* Schedule rows */}
        <motion.div
          className="space-y-2"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          {schedule.map((week) => (
            <motion.div
              key={week.wk}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-[#252525] rounded-lg"
              variants={fadeUp}
              transition={{ duration: 0.35 }}
            >
              <span className="text-white font-extrabold text-base w-8 shrink-0">{week.wk}</span>
              <div className="flex flex-wrap gap-2">
                {week.events.length === 0 ? (
                  <span className="text-white/30 text-sm italic">—</span>
                ) : (
                  week.events.map((evt) => (
                    <span
                      key={evt.name}
                      className="px-3 py-1 rounded-md text-xs sm:text-sm font-semibold text-[#252525]"
                      style={{ backgroundColor: catColor[evt.cat] }}
                    >
                      {evt.name}
                    </span>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none" />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   10. CLOSING
   White bg, scattered small character shapes, MAC logo
   ════════════════════════════════════════════════════════════════════ */
function ClosingSection() {
  return (
    <section className="relative min-h-[60vh] bg-white flex items-center justify-end overflow-hidden px-4 py-20">
      {/* Gray squiggly background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg viewBox="0 0 800 600" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <path d="M100 100 Q200 50 300 150 Q400 250 500 100 Q600 -50 700 150 Q800 350 600 400 Q400 450 300 300 Q200 150 100 300 Q0 450 200 500" stroke="#ccc" strokeWidth="40" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Scattered characters */}
      <motion.div className="absolute top-[10%] left-[15%] w-[6vw] max-w-[45px]" animate={{ y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <BlueHourglass className="w-full h-auto" />
      </motion.div>
      <motion.div className="absolute top-[12%] right-[30%] w-[7vw] max-w-[50px]" animate={{ y: [0, 4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
        <RedButterfly className="w-full h-auto" />
      </motion.div>
      <motion.div className="absolute top-[40%] left-[5%] w-[6vw] max-w-[40px]" animate={{ y: [0, 6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        <GreenCircle className="w-full h-auto" />
      </motion.div>
      <motion.div className="absolute top-[35%] left-[25%] w-[10vw] max-w-[80px]" animate={{ y: [0, -4, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}>
        <YellowQuarter className="w-full h-auto" />
      </motion.div>
      {/* Small colored shapes */}
      <div className="absolute top-[55%] right-[35%] w-4 h-4 rounded-full bg-[#FF9800] pointer-events-none" />
      <div className="absolute top-[45%] left-[35%] w-3 h-3 rounded-full bg-[#9C27B0] pointer-events-none" />
      <div className="absolute bottom-[30%] left-[30%] w-3 h-3 bg-[#00BCD4] pointer-events-none" />
      {/* Pink mini butterfly */}
      <div className="absolute bottom-[40%] left-[20%] w-[5vw] max-w-[35px] pointer-events-none opacity-70">
        <svg viewBox="0 0 40 30" fill="none">
          <path d="M20 15 Q5 2 2 15 Q5 28 20 15Z" fill="#E91E63" />
          <path d="M20 15 Q35 2 38 15 Q35 28 20 15Z" fill="#E91E63" />
        </svg>
      </div>

      {/* MAC logo bottom-right */}
      <motion.div
        className="relative z-10 flex items-center gap-3 mr-[5%]"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.8 }}
      >
        <MacLogo className="w-14 h-14 md:w-20 md:h-20" />
        <span className="text-[clamp(2rem,5vw,4rem)] font-extrabold text-[#252525] tracking-tight">
          MAC
        </span>
      </motion.div>
    </section>
  );
}
