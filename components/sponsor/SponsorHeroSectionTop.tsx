"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { Stat } from "@/lib/sanity/types";

interface ScrollZoomHeroProps {
  title?: string;
  subtitle?: string;
  stats?: Stat[];
}

export default function ScrollZoomHero({
  title = "Partner with Us",
  subtitle,
  stats = [],
}: ScrollZoomHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const blur = useTransform(scrollYProgress, [0, 1], ["0px", "10px"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[200vh]">

      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Background Image */}
        <motion.div
          style={{ scale, filter: `blur(${blur})` }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-8"
        >
          <h1 className="text-white text-6xl md:text-9xl font-bold tracking-tighter mb-6">
            {title}
          </h1>

          {subtitle && (
            <p className="text-white/70 text-lg md:text-xl max-w-[700px] text-center leading-relaxed mb-10">
              {subtitle}
            </p>
          )}

          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-[900px] w-full">
              {stats.map((stat) => (
                <div
                  key={stat._key}
                  className="text-center p-4 md:p-6 bg-neutral-800 rounded-2xl"
                >
                  <div className="text-3xl md:text-5xl font-extrabold text-accent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

    </div>
  );
}