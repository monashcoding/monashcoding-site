"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactPageData, SocialLink } from "@/lib/sanity/types";
import { PLATFORM_ICONS, PLATFORM_LABELS } from "@/lib/socialPlatforms";
import { RibbonAwareSection } from "@/components/RibbonAwareSection";

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
  const socialLinks = socialLinksProp || defaultSocialLinks;

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
      <div className="max-w-[600px] w-full py-16 px-8 text-center">
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
      </div>
    </RibbonAwareSection>
  );
}
