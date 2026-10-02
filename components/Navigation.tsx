"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { NavigationData, PageVisibility, SocialLink } from "@/lib/sanity/types";
import { PLATFORM_ICONS, PLATFORM_LABELS } from "@/lib/socialPlatforms";
import { MEMBER_SIGNUP_URL } from "@/lib/links";
import { AppLauncher } from "./launcher/AppLauncher";

const MacLogo3D = dynamic(() => import("./MacLogo3D"), { ssr: false });
import NavPreviewCard from "./navigation/NavPreviewCard";
import { getPreviewConfig, DEFAULT_PREVIEW_HREF } from "./navigation/navPreviewConfig";

interface NavItem {
  _key?: string;
  label: string;
  href: string;
}

// Fallback data
const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Meet the Team", href: "/team" },
  { label: "Sponsor Us", href: "/sponsor" },
  { label: "Contact", href: "/contact" },
  { label: "O Week", href: "/o-week" },
];

// Map paths to pageVisibility keys
const visibilityMap: Record<string, keyof PageVisibility> = {
  "/o-week": "oWeek",
};

const defaultFooterLinks: SocialLink[] = [
  { _key: "instagram", platform: "instagram", url: "https://instagram.com/monashcoding" },
  { _key: "linkedin", platform: "linkedin", url: "https://linkedin.com/company/monashcoding" },
  { _key: "discord", platform: "discord", url: "https://discord.gg/2zB6ydCkA5" },
];

interface NavigationProps {
  data: NavigationData | null;
  socialLinks: SocialLink[] | null;
}

const MENU_LINES = [
  {
    top: 0,
    delay: 0,
    variants: {
      closed: { y: 0, rotate: 0, scaleX: 1, opacity: 1 },
      hover: { y: 0, rotate: 0, scaleX: 0.55, opacity: 1 },
      open: { y: 6.25, rotate: 45, scaleX: 1, opacity: 1 },
      openHover: { y: 6.25, rotate: 135, scaleX: 1, opacity: 1 },
    },
  },
  {
    top: 6.25,
    delay: 0.05,
    variants: {
      closed: { scaleX: 0.6, opacity: 1 },
      hover: { scaleX: 1, opacity: 1 },
      open: { scaleX: 0, opacity: 0 },
      openHover: { scaleX: 0, opacity: 0 },
    },
  },
  {
    top: 12.5,
    delay: 0.1,
    variants: {
      closed: { y: 0, rotate: 0, scaleX: 0.8, opacity: 1 },
      hover: { y: 0, rotate: 0, scaleX: 0.4, opacity: 1 },
      open: { y: -6.25, rotate: -45, scaleX: 1, opacity: 1 },
      openHover: { y: -6.25, rotate: 45, scaleX: 1, opacity: 1 },
    },
  },
];

interface NavLinkProps {
  item: NavItem;
  onClick: () => void;
  onHoverChange: (href: string | null) => void;
}

function NavLink({ item, onClick, onHoverChange }: NavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange(item.href);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(null);
  };

  return (
    <Link
      href={item.href}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative block no-underline py-1"
    >
      <div className="relative overflow-hidden h-[clamp(2.4rem,9.6vw,3.6rem)] lg:h-[clamp(3.6rem,7.2vw,6rem)]">
        {/* Original text that slides up */}
        <motion.span
          className="block text-[clamp(2rem,8vw,3rem)] lg:text-[clamp(3rem,6vw,5rem)] font-semibold text-foreground leading-[1.2] transition-colors duration-300"
          animate={{
            y: isHovered ? "-100%" : "0%",
          }}
          transition={{
            duration: 0.4,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {item.label}
        </motion.span>

        {/* New text that slides in from bottom - MAC Yellow */}
        <motion.span
          className="absolute top-0 left-0 w-full block text-[clamp(2rem,8vw,3rem)] lg:text-[clamp(3rem,6vw,5rem)] font-semibold text-accent leading-[1.2] transition-colors duration-300"
          initial={{ y: "100%" }}
          animate={{
            y: isHovered ? "0%" : "100%",
          }}
          transition={{
            duration: 0.4,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {item.label}
        </motion.span>
      </div>
    </Link>
  );
}

export default function Navigation({ data, socialLinks }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  // Get preview config for hovered item (falls back to default when nothing hovered
  // or when no preview exists for the hovered path)
  const previewConfig =
    getPreviewConfig(hoveredItem ?? DEFAULT_PREVIEW_HREF) ??
    getPreviewConfig(DEFAULT_PREVIEW_HREF);

  // Use Sanity data or fallbacks
  const rawNavItems: NavItem[] = data?.navItems || defaultNavItems;
  const footerLinks: SocialLink[] = socialLinks || defaultFooterLinks;

  // Filter nav items based on page visibility
  const navItems = useMemo(() => {
    const pageVisibility = data?.pageVisibility;
    if (!pageVisibility) return rawNavItems;

    return rawNavItems.filter((item) => {
      const visibilityKey = visibilityMap[item.href];
      // If no visibility key for this path, always show
      if (!visibilityKey) return true;
      // Only show if the page is visible (shown === true)
      return pageVisibility[visibilityKey] === true;
    });
  }, [rawNavItems, data?.pageVisibility]);

  // Desktop detection — prevents mounting preview card on mobile
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Prefetch all menu routes on mount so navigation is instant
  useEffect(() => {
    navItems.forEach((item) => router.prefetch(item.href));
  }, [navItems, router]);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showNavBacking = !isHomePage || hasScrolled || isOpen || isLauncherOpen;

  const handleLauncherChange = useCallback((open: boolean) => {
    setIsLauncherOpen(open);
    if (open) setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Fixed header bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 pl-4 pr-6 py-4 lg:pl-10 lg:pr-12 lg:py-6 pointer-events-none">
        <div className="relative z-50 shrink-0">
          <Link
            href="/"
            aria-label="Monash Association of Coding home"
            className="relative grid size-14 place-items-center no-underline pointer-events-auto lg:size-[4.5rem]"
          >
            <span
              aria-hidden
              className={`pointer-events-none absolute -inset-1.5 rounded-full border border-white/10 bg-[#0c0c0c] transition-opacity duration-300 lg:-inset-2 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <MacLogo3D className="relative h-12 w-9 lg:h-16 lg:w-12" />
          </Link>
        </div>

        <motion.div
          layout
          className="relative z-50 flex flex-1 items-center justify-end pointer-events-auto"
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        >
          <div
            className={`flex min-w-0 flex-1 items-center gap-2 rounded-[14px] border p-1.5 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex-none lg:gap-2.5 ${
              showNavBacking ? "border-white/10 bg-[#0c0c0c]/90 backdrop-blur-sm" : "border-transparent bg-transparent"
            }`}
          >
          <motion.a
            layout
            href={MEMBER_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:hidden min-w-0 flex-1 flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.09em] text-accent-foreground truncate h-10.5"
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          >
            <span className="sm:hidden">Join MAC</span>
            <span className="hidden sm:inline">Become a Member</span>
          </motion.a>

          <motion.a
            key="header-member-cta"
            layout
            href={MEMBER_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center rounded-md bg-accent px-5 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-accent-foreground"
            initial={{ y: -24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            whileHover={{ y: -2, scale: 1.02 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            Become a Member
          </motion.a>

          <AppLauncher open={isLauncherOpen} onOpenChange={handleLauncherChange} />

          <motion.button
            type="button"
            onClick={() => {
              setIsLauncherOpen(false);
              setIsOpen(!isOpen);
            }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            initial={false}
            animate={isOpen ? "open" : "closed"}
            whileHover={isOpen ? "openHover" : "hover"}
            className={`relative shrink-0 flex items-center gap-3 py-2.5 px-3 sm:px-5 rounded-md border cursor-pointer transition-colors duration-300 h-10.5 lg:h-auto lg:py-2 ${
              isOpen
                ? "bg-accent border-accent text-accent-foreground hover:bg-[#e6c800]"
                : "bg-white/[0.06] border-white/15 text-white hover:border-white/40"
            }`}
          >
            <span className="relative hidden h-5 w-[3.4rem] overflow-hidden text-sm font-medium uppercase leading-5 tracking-[0.05em] sm:block">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={isOpen ? "close" : "menu"}
                  className="absolute inset-0 text-left"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-110%" }}
                  transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                >
                  {isOpen ? "Close" : "Menu"}
                </motion.span>
              </AnimatePresence>
            </span>
            <span aria-hidden className="relative block h-3.5 w-5">
              {MENU_LINES.map((line) => (
                <motion.span
                  key={line.top}
                  className="absolute left-0 h-[1.5px] w-full rounded-full bg-current"
                  style={{ top: line.top }}
                  variants={line.variants}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: line.delay }}
                />
              ))}
            </span>
          </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Full screen navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background overlay with bezier curve animation */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ clipPath: "circle(0% at calc(100% - 80px) 48px)" }}
              animate={{ clipPath: "circle(200% at calc(100% - 80px) 48px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 80px) 48px)" }}
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className="absolute inset-0 bg-background" />
            </motion.div>

            {/* Navigation content */}
            <motion.nav
              className="fixed inset-0 z-45 flex flex-col justify-between pt-20 pb-8 px-6 lg:pt-24 lg:pb-12 lg:px-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {/* Top label */}
              <motion.div
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-white/50">
                  Navigation
                </span>

              </motion.div>

              {/* Main navigation links */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={(item as { _key?: string })._key || item.label}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + index * 0.1,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                    >
                      <NavLink
                        item={item}
                        onClick={() => setIsOpen(false)}
                        onHoverChange={setHoveredItem}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer links */}
              <motion.div
                className="flex flex-wrap gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                {footerLinks.map((link) => {
                  const iconSize = 36;
                  const IconComponent = PLATFORM_ICONS[link.platform];
                  const label = PLATFORM_LABELS[link.platform] || link.platform;
                  return (
                    <a
                      key={link._key || link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-white/50 no-underline transition-colors duration-300 hover:text-white/80"
                    >
                      {IconComponent ? <IconComponent size={iconSize} /> : label}
                    </a>
                  );
                })}
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Preview Card — only mounted on desktop when menu is open */}
      {isDesktop && (
        <NavPreviewCard
          preview={previewConfig}
          isVisible={isOpen}
        />
      )}
    </>
  );
}
