"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
import CircularText from "./CircularText";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Meet the Team", href: "/team" },
  { label: "Recruitment", href: "/recruitment" },
  { label: "Sponsor Us", href: "/sponsor" },
  { label: "Contact", href: "/contact" },
];

const footerLinks = [
  { label: "Instagram", href: "https://instagram.com/monashcoding" },
  { label: "LinkedIn", href: "https://linkedin.com/company/monashcoding" },
  { label: "Discord", href: "#" },
];

function NavLink({ item, onClick }: { item: NavItem; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={styles.navLink}
    >
      <div className={styles.navLinkText}>
        {/* Original text that slides up */}
        <motion.span
          className={styles.navLinkTextPrimary}
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
          className={styles.navLinkTextSecondary}
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

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
      <motion.header
        className={styles.header}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.jpg"
            alt="MAC Logo"
            width={48}
            height={48}
            className={styles.logoImage}
            priority
          />
        </Link>

        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${styles.menuButton} ${isOpen ? styles.menuButtonOpen : ""}`}
        >
          <span className={styles.menuText}>
            {isOpen ? "Close" : "Menu"}
          </span>
          <div className={styles.menuIcon}>
            <motion.span
              className={styles.menuLine}
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 0 : -4,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className={styles.menuLine}
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 0 : 4,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </button>
      </motion.header>

      {/* Circular Text - separate from header for z-index control */}
      <div className={styles.circularTextWrapper}>
        <CircularText
          text="MNSH*ASSOC*OF*CODING*"
          onHover={null}
          spinDuration={20}
          className={styles.circularText}
        />
      </div>

      {/* Full screen navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background overlay with bezier curve animation */}
            <motion.div
              className={styles.overlay}
              initial={{ clipPath: "circle(0% at calc(100% - 80px) 48px)" }}
              animate={{ clipPath: "circle(150% at calc(100% - 80px) 48px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 80px) 48px)" }}
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className={styles.overlayBackground} />
            </motion.div>

            {/* Navigation content */}
            <motion.nav
              className={styles.nav}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {/* Top label */}
              <motion.span
                className={styles.navLabel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Navigation
              </motion.span>

              {/* Main navigation links */}
              <div className={styles.navLinks}>
                <div className={styles.navLinksInner}>
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
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
                className={styles.navFooter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                {footerLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.navFooterLink}
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
