"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const Ribbons = dynamic(() => import("@/components/Ribbons"), { ssr: false });
const MacLogo3D = dynamic(() => import("@/components/MacLogo3D"), { ssr: false });

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
      className="absolute px-8 py-4 bg-gold-700/10 border border-gold-700/30 rounded-full text-gold-800 font-medium cursor-grab select-none transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(180,83,9,0.2)] active:cursor-grabbing"
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
        const container = document.querySelector("[data-sponsors-area]");
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

function StoryItem({ item }: { item: typeof storyItems[0] }) {
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
      className="flex gap-12 mb-16 relative md:flex-col md:gap-4"
      style={{ opacity, x }}
    >
      <div className="text-2xl font-semibold text-gold-700 min-w-[120px] sticky top-24 h-fit md:static">{item.year}</div>
      <div className="flex-1 pb-8 border-l border-black/10 pl-8 md:border-l-0 md:pl-0 md:border-t md:pt-4">
        <h3 className="text-2xl font-semibold text-foreground mb-4">{item.title}</h3>
        <p className="text-lg text-black/60 leading-relaxed">{item.content}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const titleLines = ["MONASH", "ASSOCIATION", "OF CODING"];
  const heroRef = useRef<HTMLElement>(null);

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#ffffff_0%,#deddda_50%)]">
        {/* Ribbons Mouse Trail Effect */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
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
        <div className="relative z-30 flex flex-col items-center justify-center w-full h-full max-w-full p-4 gap-4 pointer-events-none md:p-6 md:gap-6 lg:flex-row lg:p-8 lg:gap-8">
          {/* Left: Title */}
          <div className="flex flex-col items-center justify-center flex-1 order-2 lg:items-end lg:order-0">
            <h1 className="text-[clamp(2rem,8vw,3rem)] font-extrabold text-center tracking-tight leading-[1.1] text-foreground whitespace-nowrap md:text-[clamp(2.5rem,5vw,5rem)] lg:text-right">
              {titleLines.map((line, lineIndex) => {
                const charOffset = titleLines.slice(0, lineIndex).join("").length;
                return (
                  <span key={lineIndex} className="block">
                    {line.split("").map((char, i) => (
                      <motion.span
                        key={`l${lineIndex}-${i}`}
                        custom={charOffset + i}
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-block"
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </span>
                );
              })}
            </h1>
            <motion.p
              className="text-[clamp(1rem,1.5vw,1.25rem)] font-normal text-center text-black/60 mt-4 lg:text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              Empowering students through code
            </motion.p>
          </div>

          {/* Center: Logo */}
          <motion.div
            className="flex items-center justify-center shrink-0 order-1 lg:order-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <MacLogo3D className="w-[100px] h-[150px] md:w-[clamp(120px,30vw,200px)] md:h-[clamp(180px,45vw,300px)] lg:w-[clamp(150px,20vw,280px)] lg:h-[clamp(220px,30vw,400px)]" />
          </motion.div>

          {/* Right: Description + Image */}
          <div className="flex flex-col justify-center items-center flex-1 gap-6 order-3 lg:items-start lg:order-0">
            <motion.p
              className="text-sm text-black/70 leading-relaxed w-full max-w-[280px] text-center relative z-30 md:max-w-[350px] lg:max-w-[500px] lg:text-left lg:text-[clamp(0.875rem,1.1vw,1.1rem)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              At MAC, we aim to impart <span className="bg-yellow-300 px-1 py-0.5">technical skills and industry-relevant experiences</span> to students to <span className="bg-yellow-300 px-1 py-0.5">bridge the gap between the classroom</span> and industry. We want to make coding a fun experience for all—regardless of degree, year level, and experience—by providing <span className="bg-yellow-300 px-1 py-0.5">collaborative learning opportunities</span> for our members.
            </motion.p>
            <motion.div
              className="relative z-10 rounded-3xl overflow-hidden w-full max-w-[280px] md:max-w-[350px] lg:max-w-[500px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              <img
                src="/hero-image.jpg"
                alt="MAC community"
                className="w-full h-40 object-cover rounded-3xl md:h-[clamp(180px,25vh,250px)] lg:h-[clamp(280px,40vh,400px)]"
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 flex flex-col items-center gap-2 text-black/50 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
          <motion.div
            className="w-px h-[60px] bg-linear-to-b from-black/50 to-transparent"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="min-h-screen py-32 px-8 bg-linear-to-b from-background to-secondary relative">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            className="text-[clamp(2.5rem,5vw,4rem)] font-bold mb-16 text-foreground"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Story
          </motion.h2>
          <div>
            {storyItems.map((item) => (
              <StoryItem key={item.year} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-24 px-8 bg-background">
        <div className="max-w-[1200px] mx-auto mb-16 flex justify-between items-center flex-wrap gap-4">
          <motion.h2
            className="text-[clamp(2rem,4vw,3rem)] font-bold text-foreground"
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
            className="flex items-center gap-2 text-gold-700 font-medium no-underline transition-opacity duration-300 hover:opacity-80"
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
        <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <motion.div
              key={index}
              className="aspect-square rounded-2xl overflow-hidden bg-black/5 relative cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
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
      <section className="min-h-[80vh] py-24 px-8 bg-linear-to-b from-background to-secondary relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2
            className="text-[clamp(2rem,4vw,3rem)] font-bold text-foreground"
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
            data-sponsors-area
            className="relative min-h-[400px] border border-dashed border-black/15 rounded-[2rem] mt-12 flex items-center justify-center"
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
      <footer className="py-24 px-8 pb-12 bg-secondary border-t border-black/10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-12 mb-16">
            <div>
              <div className="text-3xl font-extrabold text-foreground mb-4">MAC</div>
              <p className="text-black/60 leading-relaxed">
                Monash Association of Coding - Empowering students through code since 2019.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground mb-6">Navigation</h4>
              <ul className="list-none p-0 m-0 space-y-3">
                <li><a href="/" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">Home</a></li>
                <li><a href="/team" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">Meet the Team</a></li>
                <li><a href="/recruitment" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">Recruitment</a></li>
                <li><a href="/sponsor" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">Sponsor Us</a></li>
                <li><a href="/contact" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground mb-6">Connect</h4>
              <ul className="list-none p-0 m-0 space-y-3">
                <li><a href="https://instagram.com/monashcoding" target="_blank" rel="noopener noreferrer" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">Instagram</a></li>
                <li><a href="https://linkedin.com/company/monashcoding" target="_blank" rel="noopener noreferrer" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">LinkedIn</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">Discord</a></li>
                <li><a href="mailto:hello@monashcoding.com" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">Email</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground mb-6">Resources</h4>
              <ul className="list-none p-0 m-0 space-y-3">
                <li><a href="#" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">Events</a></li>
                <li><a href="#" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">Blog</a></li>
                <li><a href="#" className="text-black/60 no-underline transition-colors duration-300 hover:text-gold-700">FAQs</a></li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between items-center flex-wrap gap-4 pt-8 border-t border-black/10">
            <span className="text-black/50 text-sm">
              © {new Date().getFullYear()} Monash Association of Coding. All rights reserved.
            </span>
            <div className="flex gap-6">
              <a href="https://instagram.com/monashcoding" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-black/50 transition-colors duration-300 hover:text-gold-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/monashcoding" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-black/50 transition-colors duration-300 hover:text-gold-700">
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
