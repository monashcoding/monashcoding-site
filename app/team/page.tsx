"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import styles from "./page.module.css";

const teams = [
  {
    name: "Executive",
    members: [
      { name: "Alex Chen", role: "President", bio: "Leading MAC's vision to empower students through code." },
      { name: "Sarah Kim", role: "Vice President", bio: "Coordinating club activities and partnerships." },
      { name: "James Liu", role: "Secretary", bio: "Keeping everything organized and running smoothly." },
      { name: "Emily Zhang", role: "Treasurer", bio: "Managing finances and budgets for all events." },
    ],
  },
  {
    name: "Education",
    members: [
      { name: "Michael Park", role: "Education Lead", bio: "Designing curriculum and workshop content." },
      { name: "Lisa Wang", role: "Workshop Coordinator", bio: "Organizing weekly coding workshops." },
      { name: "David Nguyen", role: "Mentor Lead", bio: "Managing our peer mentorship program." },
    ],
  },
  {
    name: "Events",
    members: [
      { name: "Rachel Lee", role: "Events Lead", bio: "Planning hackathons and networking events." },
      { name: "Tom Anderson", role: "Logistics Coordinator", bio: "Handling venues and equipment." },
      { name: "Amy Patel", role: "Sponsorship Coordinator", bio: "Building relationships with industry partners." },
    ],
  },
  {
    name: "Marketing",
    members: [
      { name: "Chris Wu", role: "Marketing Lead", bio: "Growing our community reach and engagement." },
      { name: "Jessica Brown", role: "Content Creator", bio: "Creating engaging social media content." },
      { name: "Ryan Martinez", role: "Designer", bio: "Crafting visual identity and materials." },
    ],
  },
  {
    name: "Technology",
    members: [
      { name: "Kevin Tran", role: "Tech Lead", bio: "Building and maintaining club infrastructure." },
      { name: "Anna Johnson", role: "Web Developer", bio: "Creating our digital presence." },
      { name: "Mark Wilson", role: "DevOps", bio: "Managing deployments and systems." },
    ],
  },
];

export default function TeamPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const currentTeam = teams.find((t) => t.name === selectedTeam);

  return (
    <main className={styles.container}>
      <section className={styles.heroSection}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Meet the Team
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Click on a branch to explore each team
        </motion.p>
      </section>

      <AnimatePresence mode="wait">
        {!selectedTeam ? (
          <motion.div
            key="tree"
            className={styles.treeContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.treeVisualization}>
              {/* Tree Trunk */}
              <motion.div
                className={styles.trunk}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />

              {/* Branches */}
              <div className={styles.branchesContainer}>
                {teams.map((team, index) => (
                  <motion.div
                    key={team.name}
                    className={styles.branch}
                    onClick={() => setSelectedTeam(team.name)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div className={styles.branchLine} />
                    <motion.div
                      className={styles.branchNode}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {team.name}
                      <div style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.7 }}>
                        {team.members.length} members
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.section
            key="team"
            className={styles.teamSection}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            <button
              className={styles.backButton}
              onClick={() => setSelectedTeam(null)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Tree
            </button>

            <h2 className={styles.teamTitle}>{selectedTeam} Team</h2>

            <div className={styles.teamGrid}>
              {currentTeam?.members.map((member, index) => (
                <motion.div
                  key={member.name}
                  className={styles.memberCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className={styles.memberAvatar}>
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                  <p className={styles.memberBio}>{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
