"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

interface ScrollZoomHeroProps {
  title?: string;
}

export default function ScrollZoomHero({ title = "Partner with Us" }: ScrollZoomHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // offset controls WHEN the animation triggers during scroll:
    // - "start center" = animation starts when container top reaches viewport center
    // - "center start" = animation ends when container center reaches viewport top
    // - Adjust these to "start start"/"end end" for longer scroll range, or "start bottom"/"top end" for shorter
    offset: ["start start", "end end"],
  });

  // 1. Remove the general opacity transform that was applied to the image
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const blur = useTransform(scrollYProgress, [0, 1], ["0px", "10px"]);
  
  // 2. Create a specific opacity transform JUST for the text
  // It fades out by the time you scroll 50% of the way through
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[150vh]">
      
      <div className="absolute inset-0 h-screen overflow-hidden">
        
        {/* Background Image: No opacity prop here anymore */}
        <motion.div
          style={{ scale, filter: `blur(${blur})` }} 
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          
          {/* Optional: Dark overlay to make text pop, if image is bright */}
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
        
        {/* Text Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.h1 
            // Text fades out while image stays
            style={{ opacity: textOpacity }}
            className="text-white text-6xl md:text-9xl font-bold tracking-tighter"
          >
            {title}
          </motion.h1>
        </div>
      </div>

    </div>
  );
}