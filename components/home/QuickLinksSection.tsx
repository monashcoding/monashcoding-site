"use client";

import { useMemo, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NavigationData, NavItem, PageVisibility } from "@/lib/sanity/types";
import { NAV_PREVIEWS } from "@/components/navigation/navPreviewConfig";

const defaultNavItems: Omit<NavItem, "_key">[] = [
  { label: "About Us", href: "/about" },
  { label: "Meet the Team", href: "/team" },
  { label: "Sponsor Us", href: "/sponsor" },
  { label: "Contact", href: "/contact" },
  { label: "O Week", href: "/o-week" },
];

const visibilityMap: Record<string, keyof PageVisibility> = {
  "/o-week": "oWeek",
};

type Decoration = "orbit" | "zigzag" | "triangle" | "arches" | "dots";

interface ShapeStyle {
  fill: string;
  ink: string;
  radius: string;
  height: string;
  grow: number;
  tilt: number;
  decoration: Decoration;
  mascot: string;
  mascotSize: string;
  textInset: string;
}

const SHAPES: Record<string, ShapeStyle> = {
  "/about": {
    fill: "#DAD4FF",
    ink: "#C3B8FF",
    radius: "64px",
    height: "lg:h-[350px]",
    grow: 1.2,
    tilt: -2.5,
    decoration: "orbit",
    mascot: "/mascot/min-max.svg",
    mascotSize: "w-24 sm:w-28 lg:w-32",
    textInset: "pt-8",
  },
  "/team": {
    fill: "#FFF0A3",
    ink: "#FFE36B",
    radius: "56px 190px 56px 56px",
    height: "lg:h-[300px]",
    grow: 1.1,
    tilt: 2,
    decoration: "zigzag",
    mascot: "/mascot/min-mac-linked.svg",
    mascotSize: "w-40 sm:w-44 lg:w-52",
    textInset: "pt-8",
  },
  "/sponsor": {
    fill: "#C8EED9",
    ink: "#A5E2C2",
    radius: "190px 56px 56px 56px",
    height: "lg:h-[370px]",
    grow: 1.05,
    tilt: -1.5,
    decoration: "triangle",
    mascot: "/mascot/max-arms-up.svg",
    mascotSize: "w-28 sm:w-32 lg:w-36",
    textInset: "pt-16 lg:pt-24",
  },
  "/contact": {
    fill: "#FFD3C2",
    ink: "#FFBBA1",
    radius: "999px 999px 56px 56px",
    height: "lg:h-[330px]",
    grow: 0.95,
    tilt: 2.5,
    decoration: "arches",
    mascot: "/mascot/min-arms-up.svg",
    mascotSize: "w-28 sm:w-32 lg:w-36",
    textInset: "pt-20 lg:pt-24",
  },
  "/o-week": {
    fill: "#CDE6FF",
    ink: "#A9D3FF",
    radius: "48px",
    height: "lg:h-[290px]",
    grow: 0.95,
    tilt: -2,
    decoration: "dots",
    mascot: "/mascot/max-join-mac.svg",
    mascotSize: "w-24 sm:w-28 lg:w-32",
    textInset: "pt-8",
  },
};

const FALLBACK_SHAPES = Object.values(SHAPES);

function Decoration({ kind, color }: { kind: Decoration; color: string }) {
  switch (kind) {
    case "orbit":
      return (
        <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -right-20 -top-20 size-72">
          <circle cx="100" cy="100" r="62" fill={color} />
          <circle cx="100" cy="100" r="88" fill="none" stroke={color} strokeWidth="7" />
        </svg>
      );
    case "zigzag":
      return (
        <svg
          aria-hidden
          viewBox="0 0 300 40"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-[58%] h-14 w-full"
        >
          <polyline
            points="-10,32 20,8 50,32 80,8 110,32 140,8 170,32 200,8 230,32 260,8 290,32 320,8"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    case "triangle":
      return (
        <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute -bottom-14 left-[28%] size-56 -rotate-6">
          <path
            d="M50 8c4 0 7 2 9 6l36 66c4 7-1 14-9 14H14C6 94 1 87 5 80l36-66c2-4 5-6 9-6z"
            fill={color}
          />
        </svg>
      );
    case "arches":
      return (
        <svg
          aria-hidden
          viewBox="0 0 200 100"
          className="pointer-events-none absolute -bottom-1 left-1/2 h-40 w-[130%] -translate-x-1/2"
        >
          <path d="M18 100a82 82 0 0 1 164 0" fill="none" stroke={color} strokeWidth="13" />
          <path d="M48 100a52 52 0 0 1 104 0" fill="none" stroke={color} strokeWidth="13" />
          <path d="M78 100a22 22 0 0 1 44 0z" fill={color} />
        </svg>
      );
    case "dots":
      return (
        <svg aria-hidden viewBox="0 0 48 48" className="pointer-events-none absolute right-7 top-7 size-24">
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={i} cx={6 + (i % 4) * 12} cy={6 + Math.floor(i / 4) * 12} r="3.4" fill={color} />
          ))}
        </svg>
      );
  }
}

interface QuickLinksSectionProps {
  data: NavigationData | null;
}

export function QuickLinksSection({ data }: QuickLinksSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const navItems = useMemo(() => {
    const raw = (data?.navItems?.filter((i) => i.href !== "/") ?? defaultNavItems) as NavItem[];
    const pageVisibility = data?.pageVisibility;
    if (!pageVisibility) return raw;

    return raw.filter((item) => {
      const key = visibilityMap[item.href];
      if (!key) return true;
      return pageVisibility[key] === true;
    });
  }, [data]);

  return (
    <section
      aria-label="Explore MAC"
      className="relative z-20 -mb-12 w-full overflow-x-clip pb-6 pt-8 lg:-mb-16 lg:pb-6 lg:pt-12"
    >
      <ul className="-ml-4 flex w-[calc(100%+2rem)] flex-col lg:-ml-10 lg:w-[calc(100%+5rem)] lg:flex-row lg:items-end">
        {navItems.map((item, index) => {
          const shape = SHAPES[item.href] ?? FALLBACK_SHAPES[index % FALLBACK_SHAPES.length];
          const description = NAV_PREVIEWS[item.href]?.description;
          const isFirst = index === 0;
          const isLast = index === navItems.length - 1;
          return (
            <motion.li
              key={item.href}
              className={`relative h-[230px] sm:h-[240px] lg:min-w-0 lg:[flex:var(--grow)_1_0%] ${shape.height} ${index > 0 ? "-mt-6 lg:-ml-10 lg:mt-0" : ""}`}
              style={{ "--grow": shape.grow, zIndex: index + 1 } as CSSProperties}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 60, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: shape.tilt }}
              whileHover={prefersReducedMotion ? undefined : { y: -10, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={item.href}
                className={`group relative isolate flex h-full flex-col px-11 pb-7 no-underline outline-none focus-visible:ring-4 focus-visible:ring-accent lg:px-9 lg:pb-9 ${isFirst ? "lg:pl-[4.75rem]" : ""} ${shape.textInset}`}
                style={{
                  backgroundColor: shape.fill,
                  borderRadius: shape.radius,
                  clipPath: `inset(0 round ${shape.radius})`,
                }}
              >
                <Decoration kind={shape.decoration} color={shape.ink} />

                <span className="relative z-10 block text-[clamp(1.6rem,2.3vw,2.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[#252525]">
                  {item.label}
                </span>
                {description && (
                  <span className="relative z-10 mt-2 block max-w-[24ch] text-sm leading-snug text-[#252525]/70">
                    {description}
                  </span>
                )}

                <span className="relative z-10 mt-auto grid size-11 shrink-0 place-items-center rounded-full bg-[#252525] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-focus-visible:rotate-45">
                  <ArrowUpRight size={20} strokeWidth={2.5} style={{ color: shape.fill }} />
                </span>

                <Image
                  src={shape.mascot}
                  alt=""
                  width={160}
                  height={160}
                  className={`pointer-events-none absolute -bottom-5 right-8 z-10 h-auto transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-hover:-rotate-6 lg:-bottom-6 ${isLast ? "lg:right-[3.75rem]" : "lg:right-5"} ${shape.mascotSize}`}
                />
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
