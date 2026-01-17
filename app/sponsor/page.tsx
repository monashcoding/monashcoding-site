"use client";

import { motion } from "framer-motion";
import styles from "./page.module.css";

const stats = [
  { number: "2,000+", label: "Active Members" },
  { number: "50+", label: "Events Per Year" },
  { number: "30+", label: "Partner Companies" },
  { number: "95%", label: "Satisfaction Rate" },
];

const tiers = [
  {
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

const benefits = [
  {
    icon: "🎯",
    title: "Access Top Talent",
    description: "Connect directly with motivated computer science students from Monash University, one of Australia's leading tech programs.",
  },
  {
    icon: "🌟",
    title: "Brand Visibility",
    description: "Get your brand in front of thousands of future tech professionals through our events, social media, and newsletter.",
  },
  {
    icon: "🤝",
    title: "Meaningful Engagement",
    description: "Host workshops, tech talks, and networking sessions that create genuine connections with potential future employees.",
  },
  {
    icon: "📈",
    title: "Recruitment Pipeline",
    description: "Build your talent pipeline by showcasing your company culture and opportunities to engaged, career-focused students.",
  },
];

export default function SponsorPage() {
  return (
    <main className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Partner With Us
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Join leading tech companies in supporting the next generation of developers.
          Your partnership helps us create impactful events and opportunities for students.
        </motion.p>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={styles.statCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tiers Section */}
      <section className={styles.tiersSection}>
        <div className={styles.tiersContainer}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Sponsorship Tiers
          </motion.h2>
          <motion.p
            className={styles.sectionSubtitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Choose a partnership level that aligns with your goals and budget
          </motion.p>

          <div className={styles.tiersGrid}>
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                className={`${styles.tierCard} ${tier.featured ? styles.tierCardFeatured : ""}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {tier.featured && <span className={styles.tierBadge}>Most Popular</span>}
                <h3 className={styles.tierName}>{tier.name}</h3>
                <div className={styles.tierPrice}>
                  {tier.price}
                  {tier.price !== "Custom" && <span> /year</span>}
                </div>
                <ul className={styles.tierFeatures}>
                  {tier.features.map((feature) => (
                    <li key={feature}>
                      <span className={styles.checkIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`${styles.tierButton} ${tier.featured ? styles.tierButtonFeatured : ""}`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Partner With MAC?
        </motion.h2>

        <div className={styles.benefitsList}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className={styles.benefitItem}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={styles.benefitIcon}>{benefit.icon}</div>
              <div className={styles.benefitContent}>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <motion.h2
          className={styles.ctaTitle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to Partner?
        </motion.h2>
        <motion.p
          className={styles.ctaSubtitle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Let&apos;s discuss how we can create a partnership that benefits both your organization and our community.
        </motion.p>
        <motion.a
          href="/contact"
          className={styles.ctaButton}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Contact Us
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.a>
      </section>
    </main>
  );
}
