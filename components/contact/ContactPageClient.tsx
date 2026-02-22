"use client";


import { motion, Variants } from "framer-motion";
import { ContactPageData, SocialLink } from "@/lib/sanity/types";

import { RibbonAwareSection } from "@/components/RibbonAwareSection";
import ContactForm from "@/components/contact/ContactForm";
import { SocialTiltCard } from "@/components/home/CommunitySection";

// Fallback data
const defaultSocialLinks: SocialLink[] = [
  { _key: "1", platform: "instagram", url: "https://instagram.com/monashcoding" },
  { _key: "2", platform: "linkedin", url: "https://linkedin.com/company/monashcoding" },
  { _key: "3", platform: "github", url: "https://github.com/monashcoding" },
  { _key: "4", platform: "youtube", url: "https://www.youtube.com/@MonashAssociationofCoding" },
  { _key: "5", platform: "tiktok", url: "https://www.tiktok.com/@monashcoding" },
  { _key: "6", platform: "facebook", url: "https://www.facebook.com/monashcoding/" },
];

interface ContactPageClientProps {
  data: ContactPageData | null;
  socialLinks: SocialLink[] | null;
}


export default function ContactPageClient({ data, socialLinks: socialLinksProp }: ContactPageClientProps) {
  // Use Sanity data or fallbacks
  const pageTitle = data?.pageTitle || "Get in Touch";
  const pageSubtitle = data?.pageSubtitle || "Have a question or want to collaborate? We'd love to hear from you.";
  const socialLinks = socialLinksProp || defaultSocialLinks;
  const image = data?.bottomImage || null;

  // Motion variants for the heading animation
  const headingAnimations: Variants = {
    hidden: {}, // No animation for the container itself, but it will control the stagger of its children
    visible: {  // Stagger the animation of child elements (words/characters)
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  // Motion variants for words/characters
  const wordOrCharAnimations: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      rotateX: 45 
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        type: "spring",
        damping: 6.7,   // Resistance (lower = more bouncy)
        stiffness: 100 // Speed of the spring
      },
    }

  };


  return (
    <main className="flex flex-col">

        {/* Section 1 div at the top of the page */}
        <div className="w-full text-center bg-background h-[30vh] flex px-4 md:px-32 lg:px-36 py-8">
          <div className="w-full px-[5vw] flex">
            {/* Box inside */}
            <motion.div
              className="w-full bg-gold-700 flex items-center justify-center mt-16 rounded-xl"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Heading text*/}
              <motion.h1
                variants={headingAnimations}
                initial="hidden"
                animate="visible"
                className="text-[clamp(2.5rem,4vw,8rem)] font-extrabold"
              >
                {/* Individual characters bouncing. This is inheriting the animations from the parent container. Thus doing "hidden" and "visible" */}
                {Array.from(pageTitle).map((char, i) => (
                  <motion.span 
                    key={i} 
                    variants={wordOrCharAnimations} 
                    className="inline-block whitespace-pre text-background" // Preserve spaces between words for bounciness
                    >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
            </motion.div>
          </div>
        </div>

        {/* Section 2 div - form and newsletter*/}
        <div className="bg-blue w-full flex items-center justify-center px-4 md:px-32 lg:px-36 py-8">
          <div className="w-full flex flex-col gap-12 my-12 px-[5vw]">
            <motion.div className="w-full rounded-xl overflow-y-auto" >
                <ContactForm/>
            </motion.div>
          </div>
        </div>

        {/* Section 3 - Socials */}
        <motion.div
          className="bg-background flex flex-col justify-center items-center py-12 gap-6"
        >
          <motion.div className="text-base font-semibold text-white text-[clamp(2rem,3vw,6rem)]">
            Talk to us
          </motion.div>

          <div className="w-full px-[5vw]">
            <div className="mx-auto max-w-310 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {socialLinks.map((link, index) => (
                <SocialTiltCard
                  key={link._key}
                  platform={link.platform}
                  url={link.url}
                  description={link.description}
                  isPlaceholder={false}
                  index={index}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom image - clipped to variant-3 blob */}
        <div className="w-full -mb-24">
          {image && (
            <div className="relative aspect-1440/580 w-full md:mt-10">
              <svg className="absolute" width="0" height="0">
                <defs>
                  <clipPath id="blob-contact" clipPathUnits="objectBoundingBox">
                    <path transform={`scale(${1/1440}, ${1/580})`} d="M1391.28 164.084C1546.22 362.45 1441.26 579.5 1441.26 579.5C961.682 579.5 189.505 577.851 4.80788 577.851C4.80788 577.851 -161.26 409.533 4.80788 322.337C212.393 213.342 670.495 325.885 783.869 132.419C897.242 -61.047 1236.34 -34.2831 1391.28 164.084Z" />
                  </clipPath>
                </defs>
              </svg>
              <div className="absolute inset-0" style={{ clipPath: 'url(#blob-contact)' }}>
                <img
                  src={image.asset.url}
                  alt={image.alt || "Contact page bottom image"}
                  className="w-full h-full object-cover"
                />
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 580" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1391.28 164.084C1546.22 362.45 1441.26 579.5 1441.26 579.5C961.682 579.5 189.505 577.851 4.80788 577.851C4.80788 577.851 -161.26 409.533 4.80788 322.337C212.393 213.342 670.495 325.885 783.869 132.419C897.242 -61.047 1236.34 -34.2831 1391.28 164.084Z" stroke="yellow" vectorEffect="non-scaling-stroke" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>

    </main>
      
  );
}


