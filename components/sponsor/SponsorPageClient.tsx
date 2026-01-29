"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SponsorPageData, Stat, SponsorTier, Benefit } from "@/lib/sanity/types";
import { RibbonAwareSection } from "@/components/RibbonAwareSection";
import { SponsorLogosGrid } from "./SponsorLogosGrid";

// Fallback data
const defaultStats: Stat[] = [
  { _key: "1", value: "1,500+", label: "Members" },
  { _key: "2", value: "2,000+", label: "Event Attendees" },
  { _key: "3", value: "230M+", label: "Total Social Views" },
  { _key: "4", value: "35+", label: "Events Per Year" },
];

const defaultTiers: SponsorTier[] = [];

const defaultBenefits: Benefit[] = [
  {
    _key: "1",
    icon: "🎓",
    title: "Access Top Talent",
    description: "Engage with highly motivated students from 7+ disciplines including Computer Science, Data Science, and Software Engineering through workshops and hackathons.",
  },
  {
    _key: "2",
    icon: "💼",
    title: "Promote Opportunities",
    description: "Champion graduate and intern roles through our publications, tailored campaigns, and custom-built job board reaching engaged, career-focused students.",
  },
  {
    _key: "3",
    icon: "🌟",
    title: "Strengthen Brand Presence",
    description: "Align with Monash's largest tech society to build authentic engagement across a global member base and authentic community connections.",
  },
];

interface SponsorPageClientProps {
  data: SponsorPageData | null;
}

export default function SponsorPageClient({ data }: SponsorPageClientProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);

  // Use Sanity data or fallbacks
  const stats = data?.stats || defaultStats;
  const benefits = data?.benefits || defaultBenefits;
  const pageTitle = data?.pageTitle || "Partner With Us";
  const pageSubtitle = data?.pageSubtitle || "Join leading tech companies in supporting the next generation of developers. Your partnership helps us create impactful events and opportunities for students.";
  const benefitsTitle = data?.benefitsTitle || "Why Partner With MAC?";
  const ctaTitle = data?.ctaTitle || "Ready to Partner?";
  const ctaDescription = data?.ctaDescription || "Let's discuss how we can create a partnership that benefits both your organization and our community.";

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sponsor",
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setFormStatus("success");
        setFormData({ companyName: "", contactName: "", email: "", message: "" });
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        setFormStatus("error");
        setTimeout(() => setFormStatus("idle"), 5000);
      }
    } catch (error) {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("sponsorship@monashcoding.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen pt-32">
      {/* Hero Section */}
      <RibbonAwareSection
        backgroundClassName="bg-linear-to-b from-background to-secondary"
        contentClassName="py-16 px-8 pb-24 text-center"
      >
        <motion.h1
          className="text-[clamp(3rem,6vw,5rem)] font-extrabold text-foreground mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {pageTitle}
        </motion.h1>
        <motion.p
          className="text-xl text-white/60 max-w-[700px] mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {pageSubtitle}
        </motion.p>
      </RibbonAwareSection>

      {/* Stats Section */}
      <RibbonAwareSection
        backgroundClassName="bg-secondary"
        contentClassName="py-16 px-8 max-w-[1200px] mx-auto"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat._key}
              className="text-center p-8 bg-white/5 border border-white/10 rounded-3xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-5xl font-extrabold text-accent mb-2">{stat.value}</div>
              <div className="text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </RibbonAwareSection>

      {/* Benefits Section */}
      <RibbonAwareSection
        backgroundClassName="bg-secondary"
        contentClassName="py-24 px-8 max-w-[1000px] mx-auto"
      >
        <motion.h2
          className="text-4xl font-bold text-foreground mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {benefitsTitle}
        </motion.h2>

        <div className="grid gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit._key}
              className="flex gap-6 items-start md:flex-col md:text-center"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="shrink-0 w-[50px] h-[50px] bg-accent/10 rounded-2xl flex items-center justify-center text-2xl md:mx-auto">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-white/60 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </RibbonAwareSection>

      {/* 2025 Sponsors Section */}
      <SponsorLogosGrid title="2025 Sponsors" />

      {/* Contact Section - Become a Sponsor */}
      <RibbonAwareSection
        backgroundClassName="bg-linear-to-b from-transparent to-accent/5"
        contentClassName="py-24 px-8"
      >
        <div className="max-w-[800px] mx-auto">
          <motion.h2
            className="text-[clamp(2rem,4vw,3rem)] font-bold text-foreground mb-4 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {ctaTitle}
          </motion.h2>
          <motion.p
            className="text-white/60 max-w-[600px] mx-auto mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {ctaDescription}
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <motion.form
              onSubmit={handleFormSubmit}
              className="space-y-4 p-8 bg-white/5 border border-white/10 rounded-3xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all resize-none"
                  placeholder="Tell us about your sponsorship interests..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full py-3 px-6 bg-accent text-background font-semibold rounded-full hover:bg-accent/90 transition-all disabled:opacity-50 cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                {formStatus === "loading" ? "Sending..." : formStatus === "success" ? "Sent! ✓" : "Send Message"}
              </motion.button>

              <AnimatePresence>
                {formStatus === "error" && (
                  <motion.p
                    className="text-red-400 text-sm text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Failed to send message. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>

            {/* Direct Contact Info */}
            <motion.div
              className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col justify-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">Direct Contact</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-white/60 text-sm mb-2">Email</p>
                  <div className="flex items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-foreground font-medium">sponsorship@monashcoding.com</span>
                    <motion.button
                      onClick={handleCopyEmail}
                      className="px-3 py-2 bg-accent/20 hover:bg-accent/30 border border-accent/30 rounded-lg text-accent text-sm font-medium transition-all cursor-pointer"
                      whileTap={{ scale: 0.95 }}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </motion.button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-white/70 text-sm leading-relaxed">
                    Prefer to reach out directly? Our sponsorship team is ready to discuss partnership opportunities tailored to your company's goals.
                  </p>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </RibbonAwareSection>
    </main>
  );
}

