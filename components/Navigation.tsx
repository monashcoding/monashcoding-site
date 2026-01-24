"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CircularText from "./CircularText";
import { NavigationData } from "@/lib/sanity/types";

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
];

const defaultFooterLinks: FooterLink[] = [
  { label: "Instagram", href: "https://instagram.com/monashcoding" },
  { label: "LinkedIn", href: "https://linkedin.com/company/monashcoding" },
  { label: "Discord", href: "https://discord.gg/monashcoding" },
];

const defaultCircularText = "MNSH*ASSOC*OF*CODING*";

interface NavigationProps {
  data: NavigationData | null;
}

function NavLink({ item, onClick }: { item: NavItem; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

        {/* New text that slides in from bottom */}
        <motion.span
          className="absolute top-0 left-0 w-full block text-[clamp(2rem,8vw,3rem)] lg:text-[clamp(3rem,6vw,5rem)] font-semibold text-foreground leading-[1.2] transition-colors duration-300"
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
  const [isPastDither, setIsPastDither] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isTeamPage = pathname === "/team";

  // Use Sanity data or fallbacks
  const navItems: NavItem[] = data?.navItems || defaultNavItems;
  const footerLinks: FooterLink[] = data?.socialLinks || defaultFooterLinks;
  const circularText = data?.circularText || defaultCircularText;

  useEffect(() => {
    const handleScroll = () => {
      // Consider "past hero" when scrolled more than 80% of viewport height
      setIsPastHero(window.scrollY > window.innerHeight * 0.8);
      // Consider "past dither" when scrolled more than 300px (before timeline starts at 400px)
      // This ensures the text turns black before reaching the dark timeline
      setIsPastDither(window.scrollY > 300);
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

      {/* Circular Text - separate from header for z-index control */}
      <motion.div
        className="fixed top-[calc(1rem+24px-45px)] left-[calc(1rem+24px-45px)] lg:top-[calc(1.5rem+24px-45px)] lg:left-[calc(2.5rem+24px-45px)] w-22.5 h-22.5 z-35 flex items-center justify-center pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: showNavbar ? 0 : -100, opacity: showNavbar ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      >
        <CircularText
          text={circularText}
          onHover={undefined}
          spinDuration={20}
          className="absolute inset-0"
          textColor={isTeamPage && !isPastDither ? "text-white" : "text-foreground"}
        />
      </motion.div>

      {/* Full screen navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background overlay with bezier curve animation */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ clipPath: "circle(0% at calc(100% - 80px) 48px)" }}
              animate={{ clipPath: "circle(150% at calc(100% - 80px) 48px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 80px) 48px)" }}
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className="absolute inset-0 bg-linear-to-b from-card via-background to-secondary" />
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
                      <NavLink item={item} onClick={() => setIsOpen(false)} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer links */}
              <motion.div
                className="flex flex-wrap gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                {footerLinks.map((link) => (
                  <a
                    key={link._key || link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/50 no-underline transition-colors duration-300 hover:text-white/80"
                  >
                    {link.label}
                  </a>
                ))}
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
