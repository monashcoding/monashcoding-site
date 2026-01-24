"use client";

import { motion } from "framer-motion";
import { SponsorPageData, Stat, SponsorTier, Benefit } from "@/lib/sanity/types";

// Fallback data
const defaultStats: Stat[] = [
  { _key: "1", value: "2,000+", label: "Active Members" },
  { _key: "2", value: "50+", label: "Events Per Year" },
  { _key: "3", value: "30+", label: "Partner Companies" },
  { _key: "4", value: "95%", label: "Satisfaction Rate" },
];

const defaultTiers: SponsorTier[] = [
  {
    _key: "1",
    name: "Bronze",
    price: "$500",
    featured: false,
    features: [
      "Logo on website",
      "Social media shoutout",
      "Newsletter mention",
      "1 event ticket",
    ],
  },
  {
    _key: "2",
    name: "Silver",
    price: "$1,500",
    featured: false,
    features: [
      "Everything in Bronze",
      "Logo on event materials",
      "Workshop opportunity",
      "3 event tickets",
      "Resume access",
    ],
  },
  {
    _key: "3",
    name: "Gold",
    price: "$3,500",
    featured: true,
    features: [
      "Everything in Silver",
      "Prominent logo placement",
      "Dedicated social posts",
      "Keynote speaking slot",
      "10 event tickets",
      "Priority resume access",
    ],
  },
  {
    _key: "4",
    name: "Platinum",
    price: "Custom",
    featured: false,
    features: [
      "Everything in Gold",
      "Exclusive naming rights",
      "Custom workshop series",
      "Year-round partnership",
      "Unlimited event tickets",
      "Direct hiring pipeline",
    ],
  },
];

const defaultBenefits: Benefit[] = [
  {
    _key: "1",
    icon: "🎯",
    title: "Access Top Talent",
    description: "Connect directly with motivated computer science students from Monash University, one of Australia's leading tech programs.",
  },
  {
    _key: "2",
    icon: "🌟",
    title: "Brand Visibility",
    description: "Get your brand in front of thousands of future tech professionals through our events, social media, and newsletter.",
  },
  {
    _key: "3",
    icon: "🤝",
    title: "Meaningful Engagement",
    description: "Host workshops, tech talks, and networking sessions that create genuine connections with potential future employees.",
  },
  {
    _key: "4",
    icon: "📈",
    title: "Recruitment Pipeline",
    description: "Build your talent pipeline by showcasing your company culture and opportunities to engaged, career-focused students.",
  },
];

interface SponsorPageClientProps {
  data: SponsorPageData | null;
}

export default function SponsorPageClient({ data }: SponsorPageClientProps) {
  // Use Sanity data or fallbacks
  const stats = data?.stats || defaultStats;
  const tiers = data?.tiers || defaultTiers;
  const benefits = data?.benefits || defaultBenefits;
  const pageTitle = data?.pageTitle || "Partner With Us";
  const pageSubtitle = data?.pageSubtitle || "Join leading tech companies in supporting the next generation of developers. Your partnership helps us create impactful events and opportunities for students.";
  const tiersTitle = data?.tiersTitle || "Sponsorship Tiers";
  const tiersSubtitle = data?.tiersSubtitle || "Choose a partnership level that aligns with your goals and budget";
  const benefitsTitle = data?.benefitsTitle || "Why Partner With MAC?";
  const ctaTitle = data?.ctaTitle || "Ready to Partner?";
  const ctaDescription = data?.ctaDescription || "Let's discuss how we can create a partnership that benefits both your organization and our community.";
  const ctaButtonText = data?.ctaButtonText || "Contact Us";
  const ctaButtonLink = data?.ctaButtonLink || "/contact";

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-secondary pt-32">
      {/* Hero Section */}
      <section className="py-16 px-8 pb-24 text-center">
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
      </section>

      {/* Stats Section */}
      <section className="py-16 px-8 max-w-[1200px] mx-auto">
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
              <div className="text-5xl font-extrabold text-gold-700 mb-2">{stat.value}</div>
              <div className="text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tiers Section */}
      <section className="py-24 px-8 bg-gold-700/[0.03]">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            className="text-4xl font-bold text-foreground mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {tiersTitle}
          </motion.h2>
          <motion.p
            className="text-white/60 text-center max-w-[600px] mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {tiersSubtitle}
          </motion.p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier._key}
                className={`p-10 bg-white/5 border border-white/10 rounded-3xl transition-all duration-300 relative overflow-hidden hover:border-gold-700/30 hover:-translate-y-1 ${
                  tier.featured ? "border-gold-700/40 bg-linear-to-br from-gold-700/[0.08] to-gold-700/[0.02]" : ""
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {tier.featured && (
                  <span className="absolute top-4 right-4 py-1 px-3 bg-gold-700 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gold-800 mb-2">{tier.name}</h3>
                <div className="text-3xl font-extrabold text-foreground mb-6">
                  {tier.price}
                  {tier.price !== "Custom" && <span className="text-base font-normal text-white/50"> /year</span>}
                </div>
                <ul className="list-none p-0 m-0 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="py-3 text-white/70 flex items-center gap-3 border-b border-white/5 last:border-b-0">
                      <span className="text-gold-700">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-4 px-8 bg-transparent border border-gold-700/30 rounded-full text-gold-800 font-semibold cursor-pointer transition-all duration-300 hover:bg-gold-700/10 hover:border-gold-700/50 ${
                    tier.featured ? "bg-gold-700 border-gold-700 text-white hover:bg-gold-800 hover:border-gold-800" : ""
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-8 max-w-[1000px] mx-auto">
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
              <div className="shrink-0 w-[50px] h-[50px] bg-gold-700/10 rounded-2xl flex items-center justify-center text-2xl md:mx-auto">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-white/60 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 text-center bg-linear-to-b from-transparent to-gold-700/5">
        <motion.h2
          className="text-[clamp(2rem,4vw,3rem)] font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {ctaTitle}
        </motion.h2>
        <motion.p
          className="text-white/60 max-w-[500px] mx-auto mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {ctaDescription}
        </motion.p>
        <motion.a
          href={ctaButtonLink}
          className="inline-flex items-center gap-3 py-4 px-10 bg-linear-to-br from-gold-700 to-gold-600 text-white font-semibold text-lg rounded-full no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(180,83,9,0.3)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {ctaButtonText}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.a>
      </section>
    </main>
  );
}
