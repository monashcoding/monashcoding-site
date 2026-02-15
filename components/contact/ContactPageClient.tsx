"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ContactPageData, SocialLink } from "@/lib/sanity/types";
import { PLATFORM_ICONS, PLATFORM_LABELS } from "@/lib/socialPlatforms";
import { RibbonAwareSection } from "@/components/RibbonAwareSection";
import ContactForm from "@/components/contact/ContactForm";

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
  const email = data?.email || "hello@monashcoding.com";
  const discordLink = data?.discordLink || "https://discord.gg/px8UcXcpeC";
  const discordLabel = data?.discordLabel || "Join our community";
  const location = data?.location || "Monash University, Clayton VIC";
  const locationMapLink = data?.locationMapLink || "https://maps.google.com/?q=Monash+University+Clayton";
  const socialLinks = socialLinksProp || defaultSocialLinks;


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
        damping: 12,   // Resistance (lower = more bouncy)
        stiffness: 100 // Speed of the spring
      },
    }

  };


/**
 * RESPONSIVE TEXT SIZE GUIDE - clamp()
 * 
 * Syntax: text-[clamp(MIN, PREFERRED, MAX)]
 * 
 * How it works:
 * - MIN: Smallest size (used on small screens)
 * - PREFERRED: Ideal size that scales with viewport (e.g., 5vw = 5% of viewport width)
 * - MAX: Largest size (caps growth on large screens)
 * 
 * Example: text-[clamp(2.5rem,5vw,4rem)]
 * - Minimum: 2.5rem (40px)
 * - Grows at: 5% of viewport width
 * - Maximum: 4rem (64px)
 * 
 * Adjusting:
 * - Smaller minimum → Lower first value (e.g., 2rem)
 * - Faster scaling → Higher vw value (e.g., 6vw or 7vw)
 * - Larger maximum → Higher last value (e.g., 5rem)
 * 
 * Common units:
 * - rem: 1rem = 16px (recommended for accessibility)
 * - px: Fixed pixels (less flexible)
 * - vw: Viewport width percentage (creates fluidity)
 * 
 * Tips:
 * - Keep vw between 2-8vw for readable scaling
 * - Test on mobile (320px) and desktop (1920px+)
 * - Use rem for min/max to respect user font preferences
 */
  return (
    <RibbonAwareSection as="main" backgroundClassName="" contentClassName="min-h-screen flex flex-col items-center justify-center" >

        {/* Section 1 div at the top of the page */}
        <div className="w-full text-center bg-background h-[30vh] flex px-24 py-8">
          {/* Box inside */}
          <motion.div
            className="w-full bg-gold-700 flex items-center justify-center mt-16 rounded-3xl"
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

        {/* Section 2 div */}
        <div className="bg-blue w-full flex items-center justify-center px-48 py-8">
          {/* Contact form component */}
          {/* <ContactForm  
          /> */}

          {/* Form and newsletter section*/}
          <div className="w-full flex flex-col gap-12 md:flex-row my-12 px-[5vw] h-[30vh]">
            {/* Left side - Form */}
            <motion.div className="md:flex-[1_1_40%] bg-white rounded-4xl" > 
            </motion.div>

            {/* Right side - Newsletter*/}
            {/* TODO make sanity and fallbacks for this */}
            <motion.div className="md:flex-[1_2_10%] bg-white rounded-4xl text-center p-16" >
              <motion.h2 className="text-2xl font-bold text-gray-800">
                Join our Newsletter!
              </motion.h2>

              <motion.p className="mt-4 text-gray-600">
                Keep up with the latest updates throughout the semester on our events and exclusive member perks!
              </motion.p>

              {/* Email input */}
              <motion.div className="mt-6 flex justify-center text-background">
                <input 
                  type="email"
                  placeholder="Enter your email"
                  className="w-full max-w-md px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-700/30"
                />
              </motion.div>

              {/* Join button  temporary*/}
              <motion.button 
                className="mt-4 px-6 py-2 bg-background text-white rounded-3xl hover:bg-gold-800 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
              </motion.button>

            </motion.div>
          </div>
      


          

        </div>


        {/* The sections at the bottom. TODO make a component */}
          <div className="flex flex-col gap-6">
            <motion.a
              href={`mailto:${email}`}
              className="py-6 px-8 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-6 no-underline transition-all duration-300 hover:bg-white/10 hover:border-accent/30 hover:-translate-y-0.5 sm:flex-col sm:text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12.5 h-12.5 bg-gold-700/10 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-gold-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="text-left sm:text-center">
                <div className="text-sm text-white/50 mb-1">Email</div>
                <div className="text-lg text-foreground font-medium">{email}</div>
              </div>
            </motion.a>

            <motion.a
              href={discordLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-6 px-8 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-6 no-underline transition-all duration-300 hover:bg-white/10 hover:border-accent/30 hover:-translate-y-0.5 sm:flex-col sm:text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12.5 h-12.5 bg-gold-700/10 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-gold-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <div className="text-left sm:text-center">
                <div className="text-sm text-white/50 mb-1">Discord</div>
                <div className="text-lg text-foreground font-medium">{discordLabel}</div>
              </div>
            </motion.a>

            <motion.a
              href={locationMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-6 px-8 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-6 no-underline transition-all duration-300 hover:bg-white/10 hover:border-accent/30 hover:-translate-y-0.5 sm:flex-col sm:text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12.5 h-12.5 bg-gold-700/10 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-gold-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="text-left sm:text-center">
                <div className="text-sm text-white/50 mb-1">Location</div>
                <div className="text-lg text-foreground font-medium">{location}</div>
              </div>
            </motion.a>
          </div>
        

        
        
        {/* Footer social media section */}
        <motion.div
          className="mt-12 pt-12 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="text-base text-white/50 mb-6">Follow us on social media</div>
          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => {
              const IconComponent = PLATFORM_ICONS[link.platform];
              const label = PLATFORM_LABELS[link.platform] || link.platform;
              return (
                <a
                  key={link._key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[50px] h-[50px] bg-white/50 border border-black/10 rounded-2xl flex items-center justify-center text-background/50 transition-all duration-300 hover:bg-gold-700/10 hover:border-gold-700/30 hover:text-gold-700"
                  aria-label={label}
                >
                  {IconComponent ? <IconComponent className="w-5 h-5" /> : label}
                </a>
              );
            })}
          </div>
        </motion.div>


    </RibbonAwareSection>
  );
}
