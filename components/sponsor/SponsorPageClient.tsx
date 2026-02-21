"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { SponsorPageData, Stat, SponsorTier } from "@/lib/sanity/types";
import { RibbonAwareSection } from "@/components/RibbonAwareSection";
import { SponsorLogosGrid } from "@/components/sponsor/SponsorLogosGrid";
import ScrollZoomHero  from "@/components/sponsor/SponsorHeroSectionTop";
import { urlFor } from "@/sanity/lib/image";

// Fallback data
const defaultStats: Stat[] = [
  { _key: "1", value: "1,500+", label: "Members" },
  { _key: "2", value: "2,000+", label: "Event Attendees" },
  { _key: "3", value: "230M+", label: "Total Social Views" },
  { _key: "4", value: "35+", label: "Events Per Year" },
];


const cutoutVariants = [
  {
    width: 859,
    height: 592,
    path: 'M160.418 491.357C-12.5824 491.357 -89.5816 175.731 160.418 175.731C410.418 175.731 420.565 -51.7921 613.065 11.6784C805.565 75.1488 757.414 161.356 830.915 267.857C904.416 374.357 820.766 617.535 691.415 561.857C562.065 506.178 521.301 578.274 382.918 589.857C215.365 603.88 333.418 491.357 160.418 491.357Z',
  },
  {
    width: 802,
    height: 578,
    path: 'M92.6761 448.109C-58.5903 384.981 -3.55743 317.236 113.443 114.236C230.443 -88.764 297.942 50.7358 515.442 8.73584C732.942 -33.2642 691.941 124.236 765.442 230.736C838.943 337.236 797.442 354.363 657.942 497.236C518.442 640.108 462.559 544.026 324.176 555.608C156.623 569.632 243.942 511.236 92.6761 448.109Z',
  },
  {
    width: 769,
    height: 535,
    path: 'M61.6674 415.256C78.3438 265.364 -98.0093 184.147 82.434 81.383C262.877 -21.3811 353.548 -25.5888 512.491 65.1471C671.433 155.883 660.932 91.3827 734.433 197.883C807.934 304.383 757.876 356.619 626.933 464.383C495.991 572.147 431.55 511.173 293.167 522.756C125.615 536.779 44.991 565.147 61.6674 415.256Z',
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Use Sanity data or fallbacks
  const stats = data?.stats || defaultStats;

  const pageTitle = data?.pageTitle || "Partner With Us";
  const reasons = data?.reasons || [];
  const pageSubtitle = data?.pageSubtitle || "Join leading tech companies in supporting the next generation of developers. Your partnership helps us create impactful events and opportunities for students.";

  const sponsorsTitle = data?.sponsorsTitle || "Our Sponsors";
  const sponsors = data?.sponsors || [];
  const ctaTitle = data?.ctaTitle || "Ready to Partner?";
  const ctaDescription = data?.ctaDescription || "Let's discuss how we can create a partnership that benefits both your organization and our community.";

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate form fields
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validate()) return;
  setFormStatus("loading");

  try {
    const response = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, type: 'sponsor' }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send");
    }

    setFormStatus("success");
    setFormData({ companyName: "", contactName: "", email: "", message: "" });
  } catch (error) {
    console.error("Submission error:", error);
    setFormStatus("error");
  } finally {
    // Optional: reset to idle after 5 seconds
    setTimeout(() => setFormStatus("idle"), 5000);
  }
};

  // Handle copy email to clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("sponsorship@monashcoding.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    // Trigger the animation once the component mounts
    setIsLoaded(true);
  }, []);


  return (
    <main className="">
      {/* SECTION 1: Zooming scroll hero with stats */}
      <ScrollZoomHero
        title={pageTitle}
        subtitle={pageSubtitle}
        stats={stats}
        heroImageUrl={data?.heroImage ? urlFor(data.heroImage).width(2072).quality(80).url() : undefined}
        heroImageAlt={data?.heroImage?.alt}
      />

      {/* SECTION 2: Why Sponsor MAC */}
      <div className="bg-background mt-[-100vh] py-24 px-8">
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-12 relative">

          {/* Curved connector lines from heading to each reason - desktop only */}
          <svg
            className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
          >
            <path d="M 11 40 Q 13 20, 34 16" stroke="var(--color-accent)" vectorEffect="non-scaling-stroke" strokeWidth="12" strokeLinecap="round" />
            <path d="M 25 50 L 34 50" stroke="var(--color-accent)" vectorEffect="non-scaling-stroke" strokeWidth="12" strokeLinecap="round" />
            <path d="M 11 60 Q 13 90, 34 84" stroke="var(--color-accent)" vectorEffect="non-scaling-stroke" strokeWidth="12" strokeLinecap="round" />
          </svg>

          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Why Sponsor MAC?</h2>
            <p className="text-lg text-white/70">Partner with us to reach talented students.</p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              {reasons.map((reason, index) => {
                const variant = cutoutVariants[index % cutoutVariants.length];
                return (
                  <div key={reason._key} className="flex flex-col md:flex-row items-center gap-6">
                    {reason.image && (
                      <div className="shrink-0 w-80" style={{ aspectRatio: `${variant.width}/${variant.height}` }}>
                        <div className="relative w-full h-full">
                          <svg className="absolute" width="0" height="0">
                            <defs>
                              <clipPath id={`blob-reason-${index}`} clipPathUnits="objectBoundingBox">
                                <path transform={`scale(${1 / variant.width}, ${1 / variant.height})`} d={variant.path} />
                              </clipPath>
                            </defs>
                          </svg>
                          <div className="absolute inset-0" style={{ clipPath: `url(#blob-reason-${index})` }}>
                            <img
                              src={urlFor(reason.image).width(500).height(400).url()}
                              alt={reason.image.alt || reason.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${variant.width} ${variant.height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d={variant.path} stroke="var(--color-accent)" vectorEffect="non-scaling-stroke" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-xl font-semibold mb-2 text-foreground">{reason.title}</h3>
                      <p className="text-white/80">{reason.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2025 Sponsors Section */}
      <SponsorLogosGrid title={sponsorsTitle} sponsors={sponsors} />





      {/* Contact Section - Become a Sponsor */}
      <RibbonAwareSection
        backgroundClassName="bg-linear-to-b from-transparent to-gold-700/5"
        contentClassName="py-24 px-8"
      >
        <div className="max-w-[1200px] mx-auto ">
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
          
          {/* Div for form and direct contact */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            {/* Contact Form */}
            <motion.form
              onSubmit={handleFormSubmit}
              className="space-y-4 p-8 lg:col-span-3 bg-white/5 border border-white/10 rounded-3xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">Contact form</h3>

              {/* Company name  */}
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
              
              {/* Contact name */}
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

              {/* Email */}
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

              {/* Message */}
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
              className="max-h-[400px] p-8 lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl flex flex-col justify-center"
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

