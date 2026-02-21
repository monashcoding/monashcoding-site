"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { NavigationData, NavItem, PageVisibility } from "@/lib/sanity/types";
import { NAV_PREVIEWS } from "@/components/navigation/navPreviewConfig";
import { urlFor } from "@/sanity/lib/image";

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

// The parallelogram skews 40px over 500px height ≈ 4.6°
const SLANT_DEG = 4.6;

interface QuickLinksSectionProps {
  data: NavigationData | null;
}

export function QuickLinksSection({ data }: QuickLinksSectionProps) {
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
    <section className="relative w-full">


      {/* Desktop: expandable parallelogram row */}
      <div className="hidden lg:flex h-[500px] overflow-hidden">
        {navItems.map((item, index) => {
          const preview = NAV_PREVIEWS[item.href];
          const isFirst = index === 0;
          const isLast = index === navItems.length - 1;

          const clipPath = isFirst
            ? "polygon(0 0, calc(100% + 1px) 0, calc(100% - 40px) 100%, 0 100%)"
            : isLast
              ? "polygon(40px 0, 100% 0, 100% 100%, -1px 100%)"
              : "polygon(40px 0, calc(100% + 1px) 0, calc(100% - 39px) 100%, -1px 100%)";

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="quick-link-card group relative"
              style={{
                clipPath,
                marginLeft: isFirst ? 0 : -41,
                zIndex: index + 1,
              }}
            >
              <Link
                href={item.href}
                className="absolute inset-0 flex items-center overflow-hidden no-underline"
              >
                {/* Background image */}
                {item.image?.asset && (
                  <>
                    <Image
                      src={urlFor(item.image).width(800).height(500).fit("crop").url()}
                      alt={item.label}
                      fill
                      className="object-cover"
                    />
                    {/* Dark overlay — fades out on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[#1a1a1a]/80 transition-opacity duration-500 group-hover:opacity-0"
                    />
                    {/* Gradient overlay — fades in on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-[linear-gradient(95deg,rgba(26,26,26,0.7)_40%,transparent_100%)]"
                    />
                  </>
                )}
                {/* Vertical slanted title — slides right on hover */}
                <span
                  className="quick-link-title absolute left-1/2 top-1/2 z-10 text-[clamp(1rem,1.2vw,1.5rem)] font-bold uppercase tracking-[0.2em] text-white/70 whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-accent group-hover:translate-x-[60%]"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${-90 + SLANT_DEG}deg)`,
                  }}
                >
                  {item.label}
                </span>

                {/* Expanded content — fades in on hover */}
                <div className="relative z-10 flex flex-col justify-center h-full w-full px-12 opacity-0 translate-x-[-20px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-x-0">
                  <h3 className="text-2xl font-bold text-accent uppercase tracking-[0.08em] mb-3">
                    {item.label}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-[280px]">
                    {preview?.description ?? ""}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: 2-column grid */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-6">
        {navItems.map((item, index) => {
          const preview = NAV_PREVIEWS[item.href];
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={item.href}
                className="group relative block rounded-xl border border-white/[0.08] p-5 no-underline overflow-hidden transition-colors duration-300 hover:border-accent/[0.3]"
              >
                {/* Background image */}
                {item.image?.asset && (
                  <>
                    <Image
                      src={urlFor(item.image).width(600).height(300).fit("crop").url()}
                      alt={item.label}
                      fill
                      className="object-cover rounded-xl"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-black/60 rounded-xl"
                    />
                  </>
                )}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-accent/0 transition-colors duration-300 group-hover:bg-accent/5"
                />
                <div className="relative z-10">
                  <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-white/70 transition-colors duration-300 group-hover:text-accent">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-xs text-white/40 leading-relaxed line-clamp-2">
                    {preview?.description ?? ""}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
