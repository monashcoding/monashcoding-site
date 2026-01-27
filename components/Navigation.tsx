"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram } from "lucide-react";
import { NavigationData, PageVisibility } from "@/lib/sanity/types";
import NavPreviewCard from "./navigation/NavPreviewCard";
import { getPreviewConfig, DEFAULT_PREVIEW_HREF } from "./navigation/navPreviewConfig";

function LinkedInIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function DiscordIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

interface NavItem {
  _key?: string;
  label: string;
  href: string;
}

interface FooterLink {
  _key?: string;
  label: string;
  href: string;
}

// Fallback data
const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Meet the Team", href: "/team" },
  { label: "Recruitment", href: "/recruitment" },
  { label: "Sponsor Us", href: "/sponsor" },
  { label: "Contact", href: "/contact" },
  { label: "O Week", href: "/o-week" },
  { label: "First Year Recruitment", href: "/first-year-recruitment" },
];

// Map paths to pageVisibility keys
const visibilityMap: Record<string, keyof PageVisibility> = {
  "/o-week": "oWeek",
  "/first-year-recruitment": "firstYearRecruitment",
};

const defaultFooterLinks: FooterLink[] = [
  { label: "Instagram", href: "https://instagram.com/monashcoding" },
  { label: "LinkedIn", href: "https://linkedin.com/company/monashcoding" },
  { label: "Discord", href: "https://discord.gg/2zB6ydCkA5" },
];

interface NavigationProps {
  data: NavigationData | null;
}

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

export default function Navigation({ data }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Get preview config for hovered item (falls back to default when nothing hovered
  // or when no preview exists for the hovered path)
  const previewConfig =
    getPreviewConfig(hoveredItem ?? DEFAULT_PREVIEW_HREF) ??
    getPreviewConfig(DEFAULT_PREVIEW_HREF);

  // Use Sanity data or fallbacks
  const rawNavItems: NavItem[] = data?.navItems || defaultNavItems;
  const footerLinks: FooterLink[] = data?.socialLinks || defaultFooterLinks;

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

  useEffect(() => {
    const handleScroll = () => {
      // Consider "past hero" when scrolled more than 80% of viewport height
      setIsPastHero(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show logo text on all pages except homepage (unless scrolled past hero)
  const showLogoText = !isHomePage || isPastHero;

  // Hide navbar on homepage until scrolled past hero
  const showNavbar = !isHomePage || isPastHero || isOpen;

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
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-4 pr-6 py-4 lg:pl-10 lg:pr-12 lg:py-6 pointer-events-none">
        {/* Logo - animates in/out */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: showNavbar ? 0 : -100, opacity: showNavbar ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        >
          <Link href="/" className="relative z-50 no-underline flex items-center pointer-events-auto">
            <Image
              src="/logo/logo.jpg"
              alt="MAC Logo"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover transition-transform duration-300 hover:scale-105"
              priority
            />
          </Link>
        </motion.div>

        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative z-50 flex items-center gap-3 py-3 px-5 rounded-full border cursor-pointer transition-all duration-300 backdrop-blur-[12px] pointer-events-auto ${
            isOpen
              ? "bg-accent border-accent text-accent-foreground hover:bg-[#e6c800]"
              : "bg-black/85 border-accent/30 text-accent hover:bg-black/95 hover:border-accent/50"
          }`}
        >
          <span className="text-sm font-medium tracking-[0.05em] uppercase">
            {isOpen ? "Close" : "Menu"}
          </span>
          <div className="relative w-5 h-5 flex items-center justify-center">
            <motion.span
              className="absolute w-5 h-0.5 rounded-sm bg-current"
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 0 : -4,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute w-5 h-0.5 rounded-sm bg-current"
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 0 : 4,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </button>
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
              <motion.span
                className="text-xs font-semibold tracking-[0.15em] uppercase text-white/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Navigation
              </motion.span>

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
                  const label = link.label.toLowerCase();
                  let icon: React.ReactNode = null;
                  if (label.includes("instagram")) {
                    icon = <Instagram size={iconSize} />;
                  } else if (label.includes("linkedin")) {
                    icon = <LinkedInIcon size={iconSize} />;
                  } else if (label.includes("discord")) {
                    icon = <DiscordIcon size={iconSize} />;
                  }
                  return (
                    <a
                      key={link._key || link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="text-white/50 no-underline transition-colors duration-300 hover:text-white/80"
                    >
                      {icon || link.label}
                    </a>
                  );
                })}
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Preview Card - outside AnimatePresence for prefetching */}
      <NavPreviewCard
        preview={previewConfig}
        isVisible={isOpen}
      />
    </>
  );
}
