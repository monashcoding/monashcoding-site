"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NavPreviewConfig, NAV_PREVIEWS } from "./navPreviewConfig";

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

export default function NavPreviewCard({ preview, isVisible }: NavPreviewCardProps) {
  const allPreviews = Object.values(NAV_PREVIEWS);
  const activeHref = preview?.href ?? null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden hidden lg:block">
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
            <div className="relative h-full overflow-hidden rounded-t-3xl border-2 border-b-0 border-white bg-black/95">
              {/* Layered iframe previews — all mounted, only active one is visible */}
              <div className="relative w-full h-[70%] overflow-hidden rounded-t-3xl">
                {allPreviews.map((p) => (
                  <motion.div
                    key={p.href}
                    className="absolute inset-0"
                    initial={false}
                    animate={{ opacity: activeHref === p.href ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <iframe
                      src={p.href}
                      title={p.title}
                      className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none overflow-hidden"
                      style={{
                        border: "none",
                        background: "#000",
                      }}
                    />
                  </motion.div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              {/* Layered text content — crossfade between previews */}
              <div
                className="absolute left-0 right-0 bg-gradient-to-t from-black via-black to-transparent"
                style={{ bottom: "10vh" }}
              >
                <div className="relative p-8 lg:p-10">
                  {allPreviews.map((p) => (
                    <motion.div
                      key={p.href}
                      className={
                        activeHref === p.href
                          ? "relative"
                          : "absolute inset-0 p-8 lg:p-10"
                      }
                      initial={false}
                      animate={{ opacity: activeHref === p.href ? 1 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <h3 className="text-3xl lg:text-4xl font-bold text-accent mb-3">
                        {p.title}
                      </h3>
                      <p className="text-lg lg:text-xl text-white/70 leading-relaxed">
                        {p.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
