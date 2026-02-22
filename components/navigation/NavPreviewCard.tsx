"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { NavPreviewConfig } from "./navPreviewConfig";

interface NavPreviewCardProps {
  preview: NavPreviewConfig | null;
  isVisible: boolean;
}

const frameAnimation = {
  initial: { y: "100%" },
  animate: {
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
      delay: 0.3,
    },
  },
  exit: {
    y: "100%",
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function NavPreviewCard({ preview, isVisible }: NavPreviewCardProps) {
  // Track whether ANY iframe has loaded since the menu opened.
  // Once true, text stays at the bottom — no resetting on hover switch.
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentLoaded, setCurrentLoaded] = useState<string | null>(null);
  const activeHrefRef = useRef<string | null>(null);

  // Reset only when menu closes
  useEffect(() => {
    if (!isVisible) {
      setHasLoaded(false);
      setCurrentLoaded(null);
      activeHrefRef.current = null;
    }
  }, [isVisible]);

  const handleIframeLoad = (href: string) => {
    if (activeHrefRef.current === href) {
      setHasLoaded(true);
      setCurrentLoaded(href);
    }
  };

  activeHrefRef.current = preview?.href ?? null;

  const isCurrentLoaded = currentLoaded === preview?.href;

  if (!isVisible || !preview) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute right-12 w-[40vw] max-w-[600px]"
            style={{
              bottom: "-10vh",
              height: "90vh",
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={frameAnimation}
          >
            <div className="relative h-full overflow-hidden rounded-t-xl border-2 border-b-0 border-white bg-black/95">
              {/* Loading mascot placeholder */}
              <AnimatePresence>
                {!isCurrentLoaded && (
                  <motion.div
                    className="absolute inset-0 z-1 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                  >
                    <motion.div
                      animate={{ opacity: [0.15, 0.35, 0.15] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Image
                        src="/mascot/min-max.svg"
                        alt=""
                        width={160}
                        height={160}
                        className="grayscale brightness-75"
                        priority
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Iframe layer */}
              <div className="absolute inset-0 overflow-hidden rounded-t-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={preview.href}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isCurrentLoaded ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  >
                    <iframe
                      src={preview.href}
                      title={preview.title}
                      className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none overflow-hidden"
                      style={{ border: "none", background: "#000" }}
                      onLoad={() => handleIframeLoad(preview.href)}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              {/* Text layer — starts centered, slides to bottom on first load */}
              <motion.div
                className="absolute left-0 right-0 z-10 px-8 lg:px-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent py-10"
                style={{ bottom: "10vh", x: 0 }}
                initial={{ y: "-30vh" }}
                animate={{ y: hasLoaded ? 0 : "-30vh" }}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={preview.href}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <h3 className="mb-3 text-3xl font-bold text-accent lg:text-4xl">
                      {preview.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-white/70 lg:text-xl">
                      {preview.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
