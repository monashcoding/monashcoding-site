"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import styles from "./page.module.css";

const Ribbons = dynamic(() => import("@/components/Ribbons"), { ssr: false });

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const storyItems = [
  {
    year: "2019",
    title: "The Beginning",
    content: "MAC was founded by a group of passionate students who wanted to create a space where coding enthusiasts could learn, collaborate, and grow together.",
  },
  {
    year: "2020",
    title: "Going Virtual",
    content: "Despite the global challenges, MAC adapted and thrived. We moved our workshops and events online, reaching more students than ever before.",
  },
  {
    year: "2021",
    title: "Expanding Horizons",
    content: "We launched our first hackathon, bringing together over 200 participants from across Australia. Our community grew to over 1,000 members.",
  },
  {
    year: "2022",
    title: "Industry Partnerships",
    content: "Major tech companies began partnering with MAC, offering exclusive workshops, internship opportunities, and mentorship programs for our members.",
  },
  {
    year: "2023",
    title: "National Recognition",
    content: "MAC was recognized as one of the top student tech communities in Australia, with alumni working at leading tech companies worldwide.",
  },
  {
    year: "2024",
    title: "The Future",
    content: "We continue to innovate and grow, with new initiatives in AI/ML, open source contributions, and career development programs.",
  },
];

const sponsors = [
  { name: "Google", x: 15, y: 20 },
  { name: "Microsoft", x: 70, y: 15 },
  { name: "AWS", x: 40, y: 60 },
  { name: "Atlassian", x: 20, y: 70 },
  { name: "Canva", x: 75, y: 65 },
  { name: "Optiver", x: 50, y: 30 },
];

function SponsorBubble({ name, initialX, initialY }: { name: string; initialX: number; initialY: number }) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      className={styles.sponsorBubble}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        const container = document.querySelector(`.${styles.sponsorsArea}`);
        if (container) {
          const rect = container.getBoundingClientRect();
          const newX = ((info.point.x - rect.left) / rect.width) * 100;
          const newY = ((info.point.y - rect.top) / rect.height) * 100;
          setPosition({
            x: Math.max(10, Math.min(90, newX)),
            y: Math.max(10, Math.min(90, newY)),
          });
        }
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: isDragging ? "0 0 40px rgba(255, 215, 0, 0.4)" : "0 0 20px rgba(255, 215, 0, 0.1)",
      }}
    >
      {name}
    </motion.div>
  );
}

function StoryItem({ item, index }: { item: typeof storyItems[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, 0]);

  return (
    <motion.div
      ref={ref}
      className={styles.timelineItem}
      style={{ opacity, x }}
    >
      <div className={styles.timelineYear}>{item.year}</div>
      <div className={styles.timelineContent}>
        <h3 className={styles.timelineHeading}>{item.title}</h3>
        <p className={styles.timelineText}>{item.content}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const titleLine1 = "MONASH ASSOCIATION";
  const titleLine2 = "OF CODING";
  const heroRef = useRef<HTMLElement>(null);

  return (
    <main className="bg-[#deddda]">
      {/* Hero Section */}
      <section ref={heroRef} className={styles.heroContainer}>
        {/* Ribbons Mouse Trail Effect Layer */}
        <div className="absolute inset-0 w-full h-full">
          <Ribbons
            colors={["#FFD700"]}
            baseSpring={0.03}
            baseFriction={0.9}
            baseThickness={40}
            offsetFactor={0}
            maxAge={500}
            pointCount={50}
            speedMultiplier={0.6}
            enableFade={false}
            enableShaderEffect={false}
            effectAmplitude={2}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none">
          <h1 className={styles.heroTitle}>
            <span className="block">
              {titleLine1.split("").map((char, i) => (
                <motion.span
                  key={`l1-${i}`}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {titleLine2.split("").map((char, i) => (
                <motion.span
                  key={`l2-${i}`}
                  custom={i + titleLine1.length}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Empowering students through code
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span className={styles.scrollText}>Scroll</span>
          <motion.div
            className={styles.scrollLine}
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <div className={styles.storyContainer}>
          <motion.h2
            className={styles.storyTitle}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Story
          </motion.h2>
          <div>
            {storyItems.map((item, index) => (
              <StoryItem key={item.year} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className={styles.instagramSection}>
        <div className={styles.sectionHeader}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Follow Our Journey
          </motion.h2>
          <motion.a
            href="https://instagram.com/monashcoding"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instagramLink}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            @monashcoding
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </motion.a>
        </div>
        <div className={styles.instagramGrid}>
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <motion.div
              key={index}
              className={styles.instagramPost}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                Instagram Post {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sponsors Section */}
      <section className={styles.sponsorsSection}>
        <div className={styles.sponsorsContainer}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Sponsors
          </motion.h2>
          <motion.p
            className="text-white/60 mt-4 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Drag and interact with our amazing partners
          </motion.p>
          <motion.div
            className={styles.sponsorsArea}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {sponsors.map((sponsor) => (
              <SponsorBubble
                key={sponsor.name}
                name={sponsor.name}
                initialX={sponsor.x}
                initialY={sponsor.y}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerTop}>
            <div>
              <div className={styles.footerLogo}>MAC</div>
              <p className={styles.footerDescription}>
                Monash Association of Coding - Empowering students through code since 2019.
              </p>
            </div>
            <div className={styles.footerColumn}>
              <h4>Navigation</h4>
              <ul className={styles.footerLinks}>
                <li><a href="/">Home</a></li>
                <li><a href="/team">Meet the Team</a></li>
                <li><a href="/recruitment">Recruitment</a></li>
                <li><a href="/sponsor">Sponsor Us</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Connect</h4>
              <ul className={styles.footerLinks}>
                <li><a href="https://instagram.com/monashcoding" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://linkedin.com/company/monashcoding" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer">Discord</a></li>
                <li><a href="mailto:hello@monashcoding.com">Email</a></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Resources</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">Events</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">FAQs</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span className={styles.footerCopyright}>
              © {new Date().getFullYear()} Monash Association of Coding. All rights reserved.
            </span>
            <div className={styles.footerSocials}>
              <a href="https://instagram.com/monashcoding" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/monashcoding" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
