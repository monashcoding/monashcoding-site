"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SanityImage, SponsorLogo } from "@/lib/sanity/types";
import { urlFor } from "@/sanity/lib/image";

interface SponsorLogosGridProps {
  title?: string;
  sponsors?: SponsorLogo[];
  community?: ReactNode;
  communityLabel?: string;
}

function getImageUrl(image: SanityImage | undefined): string {
  if (!image?.asset?.url) return '';
  // Force a consistent height/width for logos to look good in a row
  return image.asset.url || urlFor(image).height(200).fit('max').url();
}

const defaultLogo: SanityImage = {
  asset: {
    _id: "default-logo-id",
    url: "/default-logo.png",
  },
  alt: "Default Sponsor Logo",
};

const defaultSponsors: SponsorLogo[] = [
  { _key: "1", name: "Sponsor 1", logo: defaultLogo },
  { _key: "2", name: "Sponsor 2", logo: defaultLogo },
  { _key: "3", name: "Sponsor 3", logo: defaultLogo },
  { _key: "4", name: "Sponsor 4", logo: defaultLogo },
  { _key: "5", name: "Sponsor 5", logo: defaultLogo },
  { _key: "6", name: "Sponsor 6", logo: defaultLogo },
];

const CORNER = 56;
const MAX_BIG_CORNER = 200;
const END_INSET = 14;

// Max from /mascot/max-join-mac.svg with the painted sign removed; the real button sits where the sign was.
const MAX_VIEWBOX = { x: 180, y: 190, width: 640, height: 660 };
const SIGN_BOTTOM = ((371 - MAX_VIEWBOX.y) / MAX_VIEWBOX.height) * 100;
const SIGN_AREA = { left: -22, width: 144, height: 36, top: SIGN_BOTTOM - 36 };

function MaxHoldingSign({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(false);
  return (
    <motion.div
      className="w-full"
      animate={reduced ? undefined : { y: [0, -3, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
    >
    <motion.div
      className="@container relative w-full"
      style={{ aspectRatio: `${MAX_VIEWBOX.width} / ${MAX_VIEWBOX.height}` }}
      initial={false}
      animate={reduced ? undefined : active ? { y: -6, rotate: 2 } : { y: 0, rotate: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        aria-hidden
        viewBox={`${MAX_VIEWBOX.x} ${MAX_VIEWBOX.y} ${MAX_VIEWBOX.width} ${MAX_VIEWBOX.height}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path d="M584 641.82C663.502 629.803 806.651 564.979 743.235 401.82" stroke="#5757D2" strokeWidth="32" fill="none" />
        <path d="M406.973 641.82C327.471 629.803 184.322 564.979 247.738 401.82" stroke="#5757D2" strokeWidth="32" fill="none" />
        <path
          d="M500 838C489.77 838 484.655 838 480.368 835.838C479.287 835.293 478.258 834.651 477.292 833.922C473.462 831.028 471.208 826.438 466.702 817.259L283.496 444.092C270.701 418.029 264.303 404.998 270.226 395.499C276.148 386 290.671 386 319.717 386H395.993C407.957 386 413.94 386 418.774 388.943C423.608 391.885 426.352 397.198 431.842 407.824L464.151 470.359C479.859 500.763 487.713 515.965 500 515.965C512.287 515.965 520.141 500.763 535.849 470.359L568.158 407.824C573.648 397.198 576.392 391.885 581.226 388.943C586.06 386 592.043 386 604.007 386H680.283C709.329 386 723.852 386 729.774 395.499C735.697 404.998 729.299 418.029 716.504 444.092L533.298 817.259C528.792 826.438 526.538 831.028 522.708 833.922C521.742 834.651 520.713 835.293 519.632 835.838C515.345 838 510.23 838 500 838Z"
          fill="#FFE330"
        />
        <circle cx="423.763" cy="588.78" r="17.041" fill="#151515" />
        <circle cx="577.134" cy="588.78" r="16.742" fill="#151515" />
        <path
          d="M526.041 632.357C528.265 630.384 531.668 630.587 533.642 632.809C535.616 635.031 535.414 638.431 533.19 640.404C514.399 657.072 486.146 657.214 467.189 640.734L466.85 640.44C464.607 638.489 464.37 635.091 466.322 632.849C468.274 630.607 471.675 630.371 473.919 632.321L474.258 632.616C489.131 645.545 511.298 645.434 526.041 632.357Z"
          fill="#151515"
        />
        <path d="M740.059 363.594C768.205 358.601 767.627 395.857 763.819 415.109L736.919 420.529C709.917 403.546 710.611 398.628 714.012 394.784C717.832 390.866 728.819 398.854 733.684 402.959C719.605 380.054 730.922 365.648 740.059 363.594Z" fill="#5757D2" />
        <path d="M250.913 364.594C222.767 359.601 223.346 396.857 227.154 416.109L254.053 421.529C281.056 404.546 280.361 399.628 276.96 395.784C273.14 391.866 262.154 399.854 257.289 403.959C271.368 381.054 260.051 366.648 250.913 364.594Z" fill="#5757D2" />
      </svg>
      <Link
        href="/sponsor"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="group absolute flex items-center justify-center gap-[4cqw] whitespace-nowrap rounded-[14%/40%] bg-[#252525] text-[clamp(0.85rem,10.5cqw,1.6rem)] font-extrabold tracking-[-0.01em] text-white no-underline outline-none focus-visible:ring-4 focus-visible:ring-accent"
        style={{
          left: `${SIGN_AREA.left}%`,
          top: `${SIGN_AREA.top}%`,
          width: `${SIGN_AREA.width}%`,
          height: `${SIGN_AREA.height}%`,
        }}
      >
        Sponsor MAC
        <span className="grid size-[clamp(1.3rem,13cqw,2.3rem)] shrink-0 place-items-center rounded-full bg-[#FFE330] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-focus-visible:rotate-45">
          <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#252525" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
      </Link>
    </motion.div>
    </motion.div>
  );
}

export function SponsorLogosGrid({
  title = "2026 Sponsors",
  sponsors = defaultSponsors,
  community,
  communityLabel,
}: SponsorLogosGridProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const marqueeSponsors = [...sponsors, ...sponsors];
  const sectionRef = useRef<HTMLElement>(null);
  const [startInset, setStartInset] = useState(48);
  const [compact, setCompact] = useState(false);
  const [bigCorner, setBigCorner] = useState(MAX_BIG_CORNER);

  useEffect(() => {
    const update = () => {
      setStartInset(Math.max(16, Math.round(window.innerWidth * 0.06)));
      setCompact(window.innerWidth < 768);
      setBigCorner(Math.min(MAX_BIG_CORNER, Math.round(window.innerWidth * 0.1)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start 0.3"] });
  const expand = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [0, 1]);
  const inset = useTransform(expand, [0, 1], [startInset, END_INSET]);
  const radius = `${CORNER}px ${CORNER}px ${CORNER}px ${bigCorner}px`;
  const clipPath = useMotionTemplate`inset(0px ${inset}px round ${radius})`;
  const slotWidth = compact ? "calc(100% - 24px)" : `calc(100% - ${2 * (bigCorner + END_INSET)}px)`;
  const mascotY = useTransform(expand, [0, 1], [40, 0]);
  const mascotX = useTransform(expand, [0, 1], [90, 0]);
  const decorY = useTransform(expand, [0, 1], [-40, 20]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip pb-8 pt-14 md:pb-10 md:pt-24 lg:pb-14 lg:pt-28"
      style={{ "--slot-width": slotWidth } as CSSProperties}
    >
      <div className="relative">
        {pathname === "/sponsor" && (
          <motion.div
            className="pointer-events-none absolute -top-[4.4rem] right-[14%] z-10 w-24 sm:w-28 lg:-top-[5.4rem] lg:w-32"
            style={{ y: mascotY }}
          >
            <Image src="/mascot/max-arms-up.svg" alt="" width={160} height={160} className="h-auto w-full" />
          </motion.div>
        )}

        <motion.div
          className={`relative isolate z-10 overflow-hidden bg-[#FFF4C7] pt-8 md:pt-10 md:[clip-path:var(--sponsor-clip)] lg:pt-14 ${
            community ? "pb-8 md:pb-[4.25rem] lg:pb-[5rem]" : "pb-8 md:pb-10 lg:pb-14"
          }`}
          style={{ "--sponsor-clip": clipPath } as unknown as MotionStyle}
        >
          <div className="relative mx-auto max-w-[96rem] px-8 sm:px-14 lg:px-24">
            <motion.svg
              aria-hidden
              viewBox="0 0 200 200"
              className="pointer-events-none absolute -left-14 -top-20 -z-10 size-48 md:-left-16 md:-top-28 md:size-80"
              style={{ y: decorY }}
            >
              <circle cx="100" cy="100" r="64" fill="#FFE98A" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="#FFE98A" strokeWidth="7" />
            </motion.svg>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#252525]/60">Backed by</p>
            <h2 className="mt-2 text-[clamp(2rem,4.2vw,3.6rem)] font-extrabold leading-[1] tracking-[-0.03em] text-[#252525]">
              {title}
            </h2>
            {pathname !== "/sponsor" && (
              <Link
                href="/sponsor"
                className="group mt-5 inline-flex items-center gap-2.5 rounded-full bg-[#252525] py-2.5 pl-5 pr-2.5 text-sm font-bold text-white no-underline md:hidden"
              >
                Sponsor MAC
                <span className="grid size-7 place-items-center rounded-full bg-[#FFE330] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-active:rotate-45">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#252525" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
              </Link>
            )}
          </div>

          <div className="relative z-10 mt-7 md:mt-8 lg:mt-12">
            <motion.ul
              className="flex w-max gap-4"
              animate={prefersReducedMotion ? undefined : { x: "-50%" }}
              transition={{ ease: "linear", duration: 34, repeat: Infinity }}
            >
              {marqueeSponsors.map((sponsor, index) => (
                <li
                  key={`${sponsor._key}-${index}`}
                  aria-hidden={index >= sponsors.length}
                  className="grid h-20 w-40 shrink-0 place-items-center rounded-[20px] bg-white px-5 md:h-28 md:w-52 md:rounded-[28px] md:px-6 lg:h-32 lg:w-60"
                >
                  {sponsor.logo ? (
                    <img
                      src={getImageUrl(sponsor.logo)}
                      alt={sponsor.logo.alt || sponsor.name}
                      className="max-h-10 max-w-full object-contain md:max-h-16 lg:max-h-[4.5rem]"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-[#252525]/70">{sponsor.name}</span>
                  )}
                </li>
              ))}
            </motion.ul>
          </div>

          {pathname !== "/sponsor" && (
            <motion.div
              className={`absolute right-7 z-0 hidden w-[10rem] origin-bottom-right -rotate-[9deg] md:block lg:right-12 lg:w-[12.5rem] ${
                community ? "bottom-[9.25rem] lg:bottom-[11.75rem]" : "bottom-[7.5rem] lg:bottom-[10rem]"
              }`}
              style={{ x: mascotX, y: mascotY }}
            >
              <MaxHoldingSign reduced={Boolean(prefersReducedMotion)} />
            </motion.div>
          )}

          {community && (
            <>
              <p className="absolute bottom-0 left-1/2 z-10 hidden h-8 w-[var(--slot-width)] -translate-x-1/2 items-center justify-center gap-3 rounded-t-[12px] bg-[#252525] text-[11px] font-bold uppercase tracking-[0.2em] text-white/75 md:flex">
                <span aria-hidden className="h-px w-6 bg-white/25" />
                {communityLabel ?? "Our Community"}
                <span aria-hidden className="h-px w-6 bg-white/25" />
              </p>
            </>
          )}
        </motion.div>

        {community}
      </div>
    </section>
  );
}
