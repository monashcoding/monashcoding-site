"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import styles from "./page.module.css";

const positions = [
  {
    id: "education",
    name: "Education Lead",
    icon: "📚",
    description: "Lead our education initiatives, design curriculum, and organize workshops that help students level up their coding skills.",
    requirements: [
      "Strong programming fundamentals",
      "Experience teaching or mentoring",
      "Excellent communication skills",
      "Passion for education and community building",
    ],
  },
  {
    id: "events",
    name: "Events Coordinator",
    icon: "🎉",
    description: "Plan and execute exciting events including hackathons, networking sessions, and industry panels.",
    requirements: [
      "Strong organizational skills",
      "Experience with event planning",
      "Ability to work under pressure",
      "Creative problem-solving abilities",
    ],
  },
  {
    id: "marketing",
    name: "Marketing Lead",
    icon: "📢",
    description: "Drive our social media presence, create engaging content, and grow our community reach.",
    requirements: [
      "Experience with social media management",
      "Strong writing and visual design skills",
      "Understanding of digital marketing",
      "Creative content creation abilities",
    ],
  },
  {
    id: "tech",
    name: "Tech Lead",
    icon: "💻",
    description: "Build and maintain our technical infrastructure, website, and internal tools.",
    requirements: [
      "Strong web development skills",
      "Experience with React/Next.js",
      "Understanding of DevOps practices",
      "Ability to lead technical projects",
    ],
  },
  {
    id: "design",
    name: "Design Lead",
    icon: "🎨",
    description: "Craft our visual identity, design marketing materials, and ensure brand consistency.",
    requirements: [
      "Proficiency in design tools (Figma, etc.)",
      "Strong visual design sense",
      "Understanding of UX principles",
      "Portfolio of previous work",
    ],
  },
  {
    id: "sponsorship",
    name: "Sponsorship Lead",
    icon: "🤝",
    description: "Build relationships with industry partners and secure sponsorships for our events.",
    requirements: [
      "Excellent communication skills",
      "Experience with outreach/sales",
      "Professional demeanor",
      "Strong networking abilities",
    ],
  },
];

const perks = [
  {
    icon: "🚀",
    title: "Leadership Experience",
    description: "Gain valuable leadership and project management skills that look great on your resume.",
  },
  {
    icon: "🌐",
    title: "Industry Connections",
    description: "Network with professionals from leading tech companies like Google, Microsoft, and Atlassian.",
  },
  {
    icon: "📜",
    title: "Certificate of Recognition",
    description: "Receive official recognition for your contributions to the MAC community.",
  },
  {
    icon: "🎓",
    title: "Skill Development",
    description: "Access exclusive workshops and training sessions to enhance your technical and soft skills.",
  },
  {
    icon: "👥",
    title: "Amazing Community",
    description: "Join a supportive team of passionate individuals who share your love for technology.",
  },
  {
    icon: "🎁",
    title: "Exclusive Perks",
    description: "Enjoy exclusive MAC merchandise, event access, and special sponsor perks.",
  },
];

const timeline = [
  {
    date: "Week 1",
    title: "Applications Open",
    description: "Submit your application through our online form. Tell us about yourself and why you want to join MAC.",
  },
  {
    date: "Week 2",
    title: "Application Review",
    description: "Our team reviews all applications and shortlists candidates for interviews.",
  },
  {
    date: "Week 3",
    title: "Interviews",
    description: "Selected candidates participate in a casual interview to get to know you better.",
  },
  {
    date: "Week 4",
    title: "Offers & Onboarding",
    description: "Successful candidates receive offers and begin their MAC journey with team onboarding.",
  },
];

export default function RecruitmentPage() {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const currentPosition = positions.find((p) => p.id === selectedPosition);

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
          Join Our Team
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Be part of something amazing. Help us empower the next generation of coders.
        </motion.p>
      </section>

      {/* Positions Section */}
      <section className={styles.positionsSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Open Positions
        </motion.h2>
        <div className={styles.pillsContainer}>
          {positions.map((position, index) => (
            <motion.button
              key={position.id}
              className={`${styles.pill} ${selectedPosition === position.id ? styles.pillActive : ""}`}
              onClick={() => setSelectedPosition(selectedPosition === position.id ? null : position.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.pillIcon}>{position.icon}</span>
              {position.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {currentPosition && (
            <motion.div
              className={styles.positionDetails}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={styles.positionTitle}>{currentPosition.name}</h3>
              <p className={styles.positionDescription}>{currentPosition.description}</p>
              <h4 style={{ color: "white", marginBottom: "1rem", fontWeight: 600 }}>Requirements</h4>
              <ul className={styles.positionRequirements}>
                {currentPosition.requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {req}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Perks Section */}
      <section className={styles.perksSection}>
        <div className={styles.perksContainer}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Perks of Joining MAC
          </motion.h2>
          <div className={styles.perksGrid}>
            {perks.map((perk, index) => (
              <motion.div
                key={perk.title}
                className={styles.perkCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className={styles.perkIcon}>{perk.icon}</div>
                <h3 className={styles.perkTitle}>{perk.title}</h3>
                <p className={styles.perkDescription}>{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.timelineSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Recruitment Timeline
        </motion.h2>
        <div className={styles.timeline}>
          {timeline.map((item, index) => (
            <motion.div
              key={item.date}
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <span className={styles.timelineDate}>{item.date}</span>
              <h3 className={styles.timelineTitle}>{item.title}</h3>
              <p className={styles.timelineDescription}>{item.description}</p>
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
          Ready to Make an Impact?
        </motion.h2>
        <motion.p
          className={styles.ctaSubtitle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Applications are now open. Join us in building the future of tech education at Monash.
        </motion.p>
        <motion.a
          href="#apply"
          className={styles.ctaButton}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Apply Now
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.a>
      </section>
    </main>
  );
}
