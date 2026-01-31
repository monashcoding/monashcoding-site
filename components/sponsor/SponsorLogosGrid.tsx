"use client";

import { motion } from "framer-motion";
import { RibbonAwareSection } from "@/components/RibbonAwareSection";
import { SanityImage, SponsorLogo } from "@/lib/sanity/types";
import { urlFor } from "@/sanity/lib/image";



interface SponsorLogosGridProps {
  title?: string;
  sponsors?: SponsorLogo[];
}

// Helper to build image URL from Sanity image or fallback
function getImageUrl(image: SanityImage | undefined): string {
  if (!image?.asset?.url) return ''
  return image.asset.url || urlFor(image).width(1200).height(1600).fit('crop').url()
}

const defaultLogo: SanityImage = {
  asset: {
    _id: "default-logo-id",
    url: "/default-logo.png",
  },
  alt: "Default Sponsor Logo",
};

// Default 2025 sponsors - placeholder structure
// In production, these would come from Sanity or the data prop
const defaultSponsors: SponsorLogo[] = [
  { _key: "1", name: "Sponsor 1", logo: defaultLogo },
  { _key: "2", name: "Sponsor 2", logo: defaultLogo },
  { _key: "3", name: "Sponsor 3", logo: defaultLogo },
  { _key: "4", name: "Sponsor 4", logo: defaultLogo },
  { _key: "5", name: "Sponsor 5", logo: defaultLogo },
  { _key: "6", name: "Sponsor 6", logo: defaultLogo },
];

export function SponsorLogosGrid({ title = "2025 Sponsors", sponsors = defaultSponsors }: SponsorLogosGridProps) {
  return (
    <RibbonAwareSection
      backgroundClassName="bg-background"
      contentClassName="py-24 px-8"
    >
      <div className="max-w-8xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-foreground mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6 md:gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor._key}
              className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/30 transition-all duration-300 flex items-center justify-center min-h-[150px] cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4, borderColor: "rgba(180, 83, 9, 0.3)" }}
            >
              {sponsor.logo ? (
                <motion.img
                  src={getImageUrl(sponsor.logo)}
                  alt={sponsor.logo.alt || sponsor.name}
                  className="w-24 h-24 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                />
              ) : (
                // Placeholder for when logo URL isn't provided
                <div className="text-center">
                  <div className="text-3xl mb-2">🏢</div>
                  <p className="text-white/60 text-xs">{sponsor.name}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Note for future implementation */}
        <motion.p
          className="text-white/50 text-sm text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Add sponsor logos from sponsorship partners
        </motion.p>

      </div>
    </RibbonAwareSection>
  );
}
