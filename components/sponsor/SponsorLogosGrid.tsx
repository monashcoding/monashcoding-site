"use client";

import { motion } from "framer-motion";
import { RibbonAwareSection } from "@/components/RibbonAwareSection";
import { SanityImage, SponsorLogo } from "@/lib/sanity/types";
import { urlFor } from "@/sanity/lib/image";

interface SponsorLogosGridProps {
  title?: string;
  sponsors?: SponsorLogo[];
}

function getImageUrl(image: SanityImage | undefined): string {
  if (!image?.asset?.url) return '';
  // Force a consistent height/width for logos to look good in a row
  return image.asset.url || urlFor(image).height(200).fit('max').url();
}

const defaultLogo: SanityImage = {
  asset: {
    _id: "default-logo-id",
    url: "/default-logo.png",
  },
  alt: "Default Sponsor Logo",
};

const defaultSponsors: SponsorLogo[] = [
  { _key: "1", name: "Sponsor 1", logo: defaultLogo },
  { _key: "2", name: "Sponsor 2", logo: defaultLogo },
  { _key: "3", name: "Sponsor 3", logo: defaultLogo },
  { _key: "4", name: "Sponsor 4", logo: defaultLogo },
  { _key: "5", name: "Sponsor 5", logo: defaultLogo },
  { _key: "6", name: "Sponsor 6", logo: defaultLogo },
];

export function SponsorLogosGrid({ title = "2025 Sponsors", sponsors = defaultSponsors }: SponsorLogosGridProps) {
  
  // 1. DUPLICATE DATA: We need two sets of sponsors to create the seamless loop.
  // When the first set finishes scrolling, we snap back to the start.
  const marqueeSponsors = [...sponsors, ...sponsors];

  return (
    <RibbonAwareSection
      backgroundClassName="bg-blue"
      contentClassName="py-24" // Removed px-8 to allow full-width scroll
    >
      <div className="w-full">
        
        {/* Title */}
        <motion.h2
          className="text-4xl font-bold text-foreground mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>

        {/* 2. MASKING: 
            This adds a fade effect on the left and right edges so logos 
            don't just pop in/out of existence harshly.
        */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          
          {/* 3. THE TRACK: Moves endlessly to the left */}
          <motion.div
            className="flex gap-8 w-max"
            animate={{ x: "-50%" }} // Move exactly half the width (the length of one set)
            transition={{
              ease: "linear",
              duration: 30, // Adjust speed: Higher = Slower
              repeat: Infinity,
            }}
          >
            {marqueeSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor._key}-${index}`} // Unique key for the duplicate
                className="shrink-0 w-[200px] md:w-[240px]" // Fixed width ensures smooth scrolling
              >
                {/* Card Design
                   (Copied from your grid, but adapted for flex items) 
                */}
                <div 
                  className="group relative p-6 bg-white/80 border border-white/10 rounded-2xl hover:border-background/90 transition-all duration-300 flex items-center justify-center h-[140px] cursor-pointer"
                >
                  {sponsor.logo ? (
                    <img
                      src={getImageUrl(sponsor.logo)}
                      alt={sponsor.logo.alt || sponsor.name}
                      className="w-full h-full object-contain opacity-100 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-2">🏢</div>
                      <p className="text-black/60 text-xs font-medium">{sponsor.name}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </RibbonAwareSection>
  );
}