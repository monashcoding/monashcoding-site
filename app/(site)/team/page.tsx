"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
    <main className="min-h-screen bg-linear-to-b from-background to-secondary pt-32">
      <section className="py-16 px-8 pb-24 text-center">
        <motion.h1
          className="text-[clamp(3rem,6vw,5rem)] font-extrabold text-foreground mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Meet the Team
        </motion.h1>
        <motion.p
          className="text-xl text-black/60 max-w-[600px] mx-auto"
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
            className="relative w-full max-w-[1400px] mx-auto p-8 min-h-[70vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative w-full h-[600px] flex flex-col items-center md:h-auto">
              {/* Tree Trunk */}
              <motion.div
                className="w-2 h-[100px] bg-linear-to-b from-[#8B4513] to-[#654321] rounded"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />

              {/* Branches */}
              <div className="flex justify-center gap-8 flex-wrap -mt-5 md:flex-col md:items-center">
                {teams.map((team, index) => (
                  <motion.div
                    key={team.name}
                    className="flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => setSelectedTeam(team.name)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="w-1 h-[60px] bg-linear-to-b from-[#654321] to-[#8B4513] rounded" />
                    <motion.div
                      className="py-6 px-8 bg-gold-700/10 border-2 border-gold-700/30 rounded-2xl text-gold-800 font-semibold text-lg text-center transition-all duration-300 min-w-[150px] hover:bg-gold-700/15 hover:border-gold-700/50 hover:shadow-[0_0_30px_rgba(180,83,9,0.15)]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {team.name}
                      <div className="text-xs mt-2 opacity-70">
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
            className="py-16 px-8 max-w-[1200px] mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            <button
              className="inline-flex items-center gap-2 py-3 px-6 bg-black/5 border border-black/10 rounded-full text-foreground text-sm cursor-pointer transition-all duration-300 mb-8 hover:bg-black/10"
              onClick={() => setSelectedTeam(null)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Tree
            </button>

            <h2 className="text-3xl font-bold text-gold-800 mb-12 text-center">{selectedTeam} Team</h2>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
              {currentTeam?.members.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="bg-white/50 border border-black/10 rounded-2xl p-8 text-center transition-all duration-300 hover:bg-white/80 hover:border-gold-700/30 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-[100px] h-[100px] rounded-full bg-linear-to-br from-gold-700 to-gold-600 mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-sm text-gold-800 mb-4">{member.role}</p>
                  <p className="text-sm text-black/60 leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
