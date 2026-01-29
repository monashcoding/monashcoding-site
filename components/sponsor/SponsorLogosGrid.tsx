"use client";

import { motion } from "framer-motion";
import { RibbonAwareSection } from "@/components/RibbonAwareSection";

interface SponsorLogo {
  id: string;
  name: string;
  logoUrl: string;
}

interface SponsorLogosGridProps {
  title?: string;
  sponsors?: SponsorLogo[];
}

// Default 2025 sponsors - placeholder structure
// In production, these would come from Sanity or the data prop
const defaultSponsors: SponsorLogo[] = [
  { id: "1", name: "Sponsor 1", logoUrl: "" },
  { id: "2", name: "Sponsor 2", logoUrl: "" },
  { id: "3", name: "Sponsor 3", logoUrl: "" },
  { id: "4", name: "Sponsor 4", logoUrl: "" },
  { id: "5", name: "Sponsor 5", logoUrl: "" },
  { id: "6", name: "Sponsor 6", logoUrl: "" },
];

export function SponsorLogosGrid({ title = "2025 Sponsors", sponsors = defaultSponsors }: SponsorLogosGridProps) {
  return (
    <RibbonAwareSection
      backgroundClassName="bg-secondary"
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
              key={sponsor.id}
              className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/30 transition-all duration-300 flex items-center justify-center min-h-[150px] cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4, borderColor: "rgba(180, 83, 9, 0.3)" }}
            >
              {sponsor.logoUrl ? (
                <motion.img
                  src={sponsor.logoUrl}
                  alt={sponsor.name}
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
          Add sponsor logos from your 2025 sponsorship partners
        </motion.p>
      </div>
    </RibbonAwareSection>
  );
}
