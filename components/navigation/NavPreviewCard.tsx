"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NavPreviewConfig, NAV_PREVIEWS } from "./navPreviewConfig";

interface NavPreviewCardProps {
  preview: NavPreviewConfig | null;
  isVisible: boolean;
  isNavOpen: boolean;
}

const springAnimation = {
  initial: { y: "100%" },
  animate: {
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
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

export default function NavPreviewCard({ preview, isVisible, isNavOpen }: NavPreviewCardProps) {
  const allPreviews = Object.values(NAV_PREVIEWS);

  return (
    <>
      {/* Hidden iframes for prefetching - render when nav is open */}
      {isNavOpen && (
        <div className="fixed -left-[9999px] w-0 h-0 overflow-hidden">
          {allPreviews.map((p) => (
            <iframe
              key={p.href}
              src={p.href}
              title={`Prefetch ${p.title}`}
              className="w-0 h-0"
            />
          ))}
        </div>
      )}

      {/* Visible preview card - clips at viewport bottom, hidden on mobile */}
      <div
        className="fixed inset-0 z-50 pointer-events-none overflow-hidden hidden lg:block"
      >
        <AnimatePresence mode="wait">
          {isVisible && preview && (
            <motion.div
              key={preview.href}
              className="absolute right-12 w-[40vw] max-w-[600px]"
              style={{
                bottom: '-10vh',
                height: '90vh',
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={springAnimation}
            >
              <div className="relative h-full overflow-hidden rounded-t-3xl border-2 border-b-0 border-white bg-black/95">
                {/* Live iframe preview */}
                <div className="relative w-full h-[70%] overflow-hidden rounded-t-3xl">
                  <iframe
                    src={preview.href}
                    title={preview.title}
                    className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                    style={{
                      border: 'none',
                      background: '#000'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                {/* Content - positioned above the hidden overflow area */}
                <div className="absolute left-0 right-0 p-8 lg:p-10 bg-gradient-to-t from-black via-black to-transparent" style={{ bottom: '10vh' }}>
                  <h3 className="text-3xl lg:text-4xl font-bold text-accent mb-3">
                    {preview.title}
                  </h3>
                  <p className="text-lg lg:text-xl text-white/70 leading-relaxed">
                    {preview.description}
                  </p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
