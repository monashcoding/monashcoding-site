"use client";

import { motion } from "framer-motion";
import { Stat } from "@/lib/sanity/types";

const cutoutVariant = {
  width: 802,
  height: 578,
  path: 'M92.6761 448.109C-58.5903 384.981 -3.55743 317.236 113.443 114.236C230.443 -88.764 297.942 50.7358 515.442 8.73584C732.942 -33.2642 691.941 124.236 765.442 230.736C838.943 337.236 797.442 354.363 657.942 497.236C518.442 640.108 462.559 544.026 324.176 555.608C156.623 569.632 243.942 511.236 92.6761 448.109Z',
};

interface ScrollZoomHeroProps {
  title?: string;
  subtitle?: string;
  stats?: Stat[];
  heroImageUrl?: string;
  heroImageAlt?: string;
}

export default function ScrollZoomHero({
  title = "Partner with Us",
  subtitle,
  stats = [],
  heroImageUrl,
  heroImageAlt = "Hero Background",
}: ScrollZoomHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center bg-background overflow-hidden px-8 py-24 pt-32">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-center">
        {/* Left: Text Content */}
        <motion.div
          className="flex flex-col lg:pl-16"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-foreground text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            {title}
          </h1>

          {subtitle && (
            <p className="text-white/70 text-lg md:text-xl max-w-[550px] leading-relaxed mb-10">
              {subtitle}
            </p>
          )}

          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4 max-w-[500px]">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat._key}
                  className="p-4 md:p-5 bg-white/5 rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-2xl md:text-4xl font-extrabold text-accent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Blob Cutout Image */}
        <motion.div
          className="flex items-center justify-center lg:pr-16"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-full" style={{ aspectRatio: `${cutoutVariant.width}/${cutoutVariant.height}` }}>
            <svg className="absolute" width="0" height="0">
              <defs>
                <clipPath id="hero-blob-cutout" clipPathUnits="objectBoundingBox">
                  <path transform={`scale(${1 / cutoutVariant.width}, ${1 / cutoutVariant.height})`} d={cutoutVariant.path} />
                </clipPath>
              </defs>
            </svg>
            <div className="absolute inset-0" style={{ clipPath: 'url(#hero-blob-cutout)' }}>
              <img
                src={heroImageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"}
                alt={heroImageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${cutoutVariant.width} ${cutoutVariant.height}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={cutoutVariant.path} stroke="var(--color-accent)" vectorEffect="non-scaling-stroke" strokeWidth="2" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
