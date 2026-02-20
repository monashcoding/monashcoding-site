"use client";

import { RefObject, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ContactPageData, SocialLink } from "@/lib/sanity/types";
import { PLATFORM_ICONS, PLATFORM_LABELS } from "@/lib/socialPlatforms";
import { RibbonAwareSection } from "@/components/RibbonAwareSection";
import ContactForm from "@/components/contact/ContactForm";
import { set } from "sanity";

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
  const [emailCopied, setEmailCopied] = useState(false);

  // Use Sanity data or fallbacks
  const pageTitle = data?.pageTitle || "Get in Touch";
  const pageSubtitle = data?.pageSubtitle || "Have a question or want to collaborate? We'd love to hear from you.";
  const email = data?.email || "coding@monash.clubs.org";
  const socialLinks = socialLinksProp || defaultSocialLinks;
  const image = data?.bottomImage || null;

  const handleEmailCopy = () => {
    navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 5000); // Reset after 5 seconds
  };
``

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

        {/* Section 2 div - form and newsletter*/}
        <div className="bg-blue w-full flex items-center justify-center px-4 md:px-32 lg:px-36 py-8">
          {/* Form and newsletter horizontal section */}
          <div className="w-full flex flex-col gap-12 lg:flex-row my-12 px-[5vw] lg:items-center">
            {/* Left side - Form */}
            <motion.div className="flex-2  rounded-4xl  overflow-y-auto outline-black outline-2  shadow-lg shadow-accent" > 
                <ContactForm/>
            </motion.div>

            {/* Right side - Newsletter*/}
            {/* TODO make sanity and fallbacks for this */}
            <motion.div className="flex-1  bg-white shadow-lg shadow-accent rounded-4xl text-center px-12 py-8 flex flex-col items-center justify-center outline-black outline-2 overflow-hidden gap-4 " >
              <motion.h2 className="text-2xl font-bold text-gray-800"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              
              >
                Join our Newsletter!
              </motion.h2>

              <motion.p className=" text-gray-600"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              >
                Keep up with the latest updates throughout the semester on our events and exclusive member perks!
              </motion.p>

              {/* Email input */}
              <motion.div className="flex justify-center text-background"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              >
                <input 
                  type="email"
                  placeholder="Email"
                  className="w-full max-w-md bg-gray-900/15 px-4 py-2 rounded-4xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-700/30"
                />
              </motion.div>

              {/* Join button*/}
              <motion.div className="justify-center text-background"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              >
                <motion.button 
                  className="flex justify-center max-w-md px-6 py-2 bg-background text-white rounded-3xl  transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join!
                </motion.button>
              </motion.div>
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

          <motion.div className="flex justify-center gap-6 flex-wrap"
          >
            {socialLinks.map((link, index) => {
              const IconComponent = PLATFORM_ICONS[link.platform];
              const label = PLATFORM_LABELS[link.platform] || link.platform;
              const description = link.description ? `${link.description}` : "";
              return (
                <motion.a
                  key={link._key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-36 h-30 flex flex-col items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-2xl text-white/50 transition-all  hover:bg-gold-700/10 hover:border-gold-700/30 hover:text-gold-700 no-underline"
                  aria-label={label}
                  whileHover={{ scale: 1.05 }}>
                  {IconComponent && <IconComponent className="w-8 h-8" />}
                  <span className="text-xs text-center font-medium capitalize">{label}</span>
                  <span className="text-xs text-cente">{description}</span>
                </motion.a>
              );
            })}

            {/* Email copy*/}
            {(() => {
              const EmailIconComponent = PLATFORM_ICONS["email" as const];
              return (
                <motion.button
                  onClick={handleEmailCopy}
                  className="px-5 py-2 w-50 h-30 flex flex-col items-center justify-center gap-2 bg-white/5 border rounded-2xl text-white/50 duration-100 hover:bg-gold-700/10 hover:border-gold-700/30 hover:text-gold-700 cursor-pointer"
                  aria-label="Copy email"
                  whileHover={{ scale: 1.05 }}>
                  <EmailIconComponent className="w-8 h-8" />
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={emailCopied ? "copied" : "email"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-center font-medium"
                    >
                      {emailCopied ? "Copied to clipboard!" : "Email coding@monashclubs.org"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              );
            })()}       


          </motion.div>
        </motion.div>

        {/* Svg and image*/}
        <div className="w-full overflow-hidden"> 
       
          {image && (
            <div className="z-10 md:mt-10">
              <img
                src={image.asset.url}
                alt={image.alt || "Contact page bottom image"}
                className="w-full h-auto block"
              />
            </div>
          )}
        </div>

    </main>
      
  );
}


