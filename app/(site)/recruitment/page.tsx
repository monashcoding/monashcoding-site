"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
    <main className="min-h-screen bg-linear-to-b from-background to-secondary pt-32">
      {/* Hero Section */}
      <section className="py-16 px-8 pb-24 text-center">
        <motion.h1
          className="text-[clamp(3rem,6vw,5rem)] font-extrabold text-foreground mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Join Our Team
        </motion.h1>
        <motion.p
          className="text-xl text-black/60 max-w-[600px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Be part of something amazing. Help us empower the next generation of coders.
        </motion.p>
      </section>

      {/* Positions Section */}
      <section className="py-16 px-8 max-w-[1200px] mx-auto">
        <motion.h2
          className="text-3xl font-bold text-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Open Positions
        </motion.h2>
        <div className="flex flex-wrap gap-4 justify-center md:flex-col md:items-stretch">
          {positions.map((position, index) => (
            <motion.button
              key={position.id}
              className={`py-4 px-8 bg-white/50 border border-black/10 rounded-full text-foreground font-medium cursor-pointer transition-all duration-300 flex items-center gap-3 hover:bg-gold-700/10 hover:border-gold-700/30 hover:text-gold-800 hover:-translate-y-0.5 md:justify-center ${
                selectedPosition === position.id ? "bg-gold-700/15 border-gold-700/40 text-gold-800" : ""
              }`}
              onClick={() => setSelectedPosition(selectedPosition === position.id ? null : position.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="w-6 h-6 flex items-center justify-center">{position.icon}</span>
              {position.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {currentPosition && (
            <motion.div
              className="mt-12 p-8 bg-white/50 border border-black/10 rounded-3xl"
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gold-800 mb-4">{currentPosition.name}</h3>
              <p className="text-black/70 leading-relaxed mb-6">{currentPosition.description}</p>
              <h4 className="text-foreground font-semibold mb-4">Requirements</h4>
              <ul className="list-none p-0 m-0">
                {currentPosition.requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    className="text-black/60 py-2 pl-6 relative before:content-['→'] before:absolute before:left-0 before:text-gold-700"
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
      <section className="py-24 px-8 bg-gold-700/[0.03]">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            className="text-3xl font-bold text-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Perks of Joining MAC
          </motion.h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 mt-12">
            {perks.map((perk, index) => (
              <motion.div
                key={perk.title}
                className="p-8 bg-white/50 border border-black/10 rounded-3xl transition-all duration-300 hover:bg-white/80 hover:border-gold-700/20 hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-[60px] h-[60px] bg-linear-to-br from-gold-700/15 to-gold-700/5 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                  {perk.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{perk.title}</h3>
                <p className="text-black/60 leading-relaxed">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-8 max-w-[800px] mx-auto">
        <motion.h2
          className="text-3xl font-bold text-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Recruitment Timeline
        </motion.h2>
        <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-linear-to-b before:from-gold-700 before:to-gold-700/20">
          {timeline.map((item, index) => (
            <motion.div
              key={item.date}
              className="relative pb-12 pl-8 before:content-[''] before:absolute before:-left-8 before:top-2 before:w-3 before:h-3 before:bg-gold-700 before:rounded-full before:-translate-x-[5px]"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <span className="text-sm text-gold-700 font-semibold mb-2 block">{item.date}</span>
              <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-black/60 leading-relaxed">{item.description}</p>
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
          Ready to Make an Impact?
        </motion.h2>
        <motion.p
          className="text-black/60 max-w-[500px] mx-auto mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Applications are now open. Join us in building the future of tech education at Monash.
        </motion.p>
        <motion.a
          href="#apply"
          className="inline-flex items-center gap-3 py-4 px-10 bg-linear-to-br from-gold-700 to-gold-600 text-white font-semibold text-lg rounded-full no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(180,83,9,0.3)]"
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
