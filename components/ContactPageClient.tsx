"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactPageData, ContactSocialLink } from "@/lib/sanity/types";
import { RibbonAwareSection } from "@/components/RibbonAwareSection";

// Platform icon components
const SocialIcon = ({ platform }: { platform: ContactSocialLink["platform"] }) => {
  switch (platform) {
    case "instagram":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    case "linkedin":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case "github":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    case "twitter":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case "facebook":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      );
    default:
      return null;
  }
};

// Fallback data
const defaultSocialLinks: ContactSocialLink[] = [
  { _key: "1", platform: "instagram", url: "https://instagram.com/monashcoding" },
  { _key: "2", platform: "linkedin", url: "https://linkedin.com/company/monashcoding" },
  { _key: "3", platform: "github", url: "https://github.com/monashcoding" },
];

interface ContactPageClientProps {
  data: ContactPageData | null;
}

export default function ContactPageClient({ data }: ContactPageClientProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});


  // Use Sanity data or fallbacks
  const pageTitle = data?.pageTitle || "Get in Touch";
  const pageSubtitle = data?.pageSubtitle || "Have a question or want to collaborate? We'd love to hear from you.";
  const email = data?.email || "hello@monashcoding.com";
  const discordLink = data?.discordLink || "https://discord.gg/monashcoding";
  const discordLabel = data?.discordLabel || "Join our community";
  const location = data?.location || "Monash University, Clayton VIC";
  const locationMapLink = data?.locationMapLink || "https://maps.google.com/?q=Monash+University+Clayton";
  const socialLinks = data?.socialLinks || defaultSocialLinks;

  // Handle form input changes. Clears errors on change.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  // Validate form fields
const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.name.trim()) newErrors.name = "Name is required";
  if (!formData.email.trim()) newErrors.email = "Email is required";
  if (!formData.subject.trim()) newErrors.subject = "Subject is required";
  if (!formData.message.trim()) newErrors.message = "Message is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSendEmail = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const response = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        emailAddress: formData.email,
        subject: formData.subject,
        message: formData.message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    alert("Email sent successfully!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    alert("Error sending email");
  }
};


  return (
    <RibbonAwareSection
      as="main"
      backgroundClassName=""
      contentClassName="min-h-screen pt-32 flex flex-col items-center justify-center"
    >
      <div className="max-w-150 w-full py-16 px-8 text-center">
        <motion.h1
          className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold text-foreground mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {pageTitle}
        </motion.h1>
        <motion.p
          className="text-lg text-white/80 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {pageSubtitle}
        </motion.p>

        <motion.form
          noValidate
          onSubmit={handleSendEmail}
          className="mb-12 p-8 bg-white/50 border border-black/10 rounded-2xl w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="grid grid-cols-1 gap-4 mb-6">

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-background mb-2">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg bg-white/80 transition-all placeholder:text-black/40
                  ${errors.name
                    ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                    : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"}
                `}
                placeholder="Your name"
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-background mb-2">
            Email
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 rounded-lg bg-white/80 transition-all placeholder:text-black/40
              ${errors.email
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"}
            `}
            placeholder="your@email.com"
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* SUBJECT */}
        <div>
          <label className="block text-sm font-medium text-background mb-2">
            Subject
          </label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 rounded-lg bg-white/80 transition-all placeholder:text-black/40
              ${errors.subject
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"}
            `}
            placeholder="Subject of your message"
          />
          <AnimatePresence>
            {errors.subject && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.subject}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* MESSAGE */}
        <div>
          <label className="block text-sm font-medium text-background mb-2">
            Message
          </label>
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 rounded-lg bg-white/80 resize-none transition-all placeholder:text-black/40
              ${errors.message
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"}
            `}
            placeholder="Your message here..."
          />
          <AnimatePresence>
            {errors.message && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        type="submit"
        className="w-full py-3 px-6 bg-gold-700 text-background rounded-lg font-medium hover:bg-gold-800 active:scale-95"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Send Message
      </motion.button>
    </motion.form>

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

        <motion.div
          className="mt-12 pt-12 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="text-base text-white/50 mb-6">Follow us on social media</div>
          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link._key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12.5 h-12.5 bg-white/50 border border-black/10 rounded-2xl flex items-center justify-center text-background/50 transition-all duration-300 hover:bg-gold-700/10 hover:border-gold-700/30 hover:text-gold-700"
                aria-label={link.platform}
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </RibbonAwareSection>
  );
}
