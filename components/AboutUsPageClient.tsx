'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { AboutUsPageData } from '@/lib/sanity/types'
import { urlFor } from '@/sanity/lib/image'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'

const defaultData: AboutUsPageData = {
  pageTitle: 'About MAC',
  pageSubtitle:
    'Monash Association of Coding (MAC) is the largest student-run computing club at Monash University, with over 1,500 current members and an online presence that extends across the globe.',
  missionTitle: 'Our Mission',
  missionBody:
    'We strive to upskill students through high-quality events, workshops and hackathons, spanning both technical and professional domains.\n\nThrough our impact, we aim to make coding enjoyable and accessible to all, offering students real-world experience and insight into the tech industry.',
  values: [
    { _key: '1', title: 'Share your success with others', description: '' },
    { _key: '2', title: 'Make it happen', description: '' },
    { _key: '3', title: 'Challenge your own assumptions', description: '' },
    { _key: '4', title: 'Keep learning', description: '' },
    { _key: '5', title: 'Go above and beyond', description: '' },
  ],
  journey: [
    {
      _key: '1',
      year: '2019',
      summary:
        'MAC is founded by a group of friends who organised mock technical interviews.',
    },
    {
      _key: '2',
      year: '2020',
      summary:
        "Awarded 'Most Outstanding New Club' by Monash Clubs & Societies.",
    },
    {
      _key: '3',
      year: '2021',
      summary:
        "Held MAC's first hackathon with 200+ participants.",
    },
    {
      _key: '4',
      year: '2022',
      summary:
        "Launched our new annual flagship hackathon called 'MACathon'.",
    },
    {
      _key: '5',
      year: '2023',
      summary:
        'Hosted our biggest networking night yet with over 175 attendees.',
    },
    {
      _key: '6',
      year: '2024',
      summary:
        "Awarded 'Outstanding Marketing Campaign' and 'Best Club in Monash' by Monash Clubs & Societies.",
    },
    {
      _key: '7',
      year: '2025',
      summary:
        "Crowned 'Most Popular Club Event' at the Monash Awards Night for the MAC x UNIHACK Hackathon with over 650 participants.",
    },
  ],
  whereAreWeNow:
    "MAC's exponential growth has led us to become **one of Australia's leading computing societies.**\n\nWe unite **over 1500 enthusiastic members** and a **tight-knit committee of over 60 passionate students** in technology. We endeavour to equip our community with professional skills, industry insights and connections with ambitious individuals.\n\nThrough weekly technical events, hackathons and networking nights, totalling **2000+ attendees**, we empower our students to thrive holistically in a forever-evolving tech space.",
  stats: [
    { _key: '1', value: '1,500+', label: 'Members' },
    { _key: '2', value: '60+', label: 'Committee members' },
    { _key: '3', value: '2,000+', label: 'Event attendees' },
    { _key: '4', value: '2019', label: 'Founded' },
  ],
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

interface AboutUsPageClientProps {
  data: AboutUsPageData | null
}

/** Render **bold** markdown segments */
function renderBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-white/90">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

export default function AboutUsPageClient({ data }: AboutUsPageClientProps) {
  const page = data ?? defaultData

  return (
    <>
      {/* Header */}
      <RibbonAwareSection
        backgroundClassName="bg-background"
        className="overflow-hidden"
        contentClassName="relative pt-[clamp(8rem,14vw,12rem)] pb-[clamp(4rem,8vw,6rem)] px-6 md:px-8"
      >
        <motion.div
          className="relative mx-auto max-w-[1240px]"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="space-y-3">
            <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-white/70">
              About Us
            </span>
            <h1 className="text-[clamp(2.6rem,5.5vw,4.5rem)] font-semibold leading-[1.01] text-foreground">
              {page.pageTitle}
            </h1>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-[42rem] text-base leading-relaxed text-white/60 md:text-lg"
          >
            {page.pageSubtitle}
          </motion.p>
        </motion.div>
      </RibbonAwareSection>

      {/* Stats */}
      {page.stats && page.stats.length > 0 && (
        <RibbonAwareSection
          backgroundClassName="bg-background"
          className="overflow-hidden"
          contentClassName="relative py-[clamp(2rem,4vw,3rem)] px-6 md:px-8"
        >
          <motion.div
            className="relative mx-auto max-w-[1240px] grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {page.stats.map((stat) => (
              <motion.div
                key={stat._key}
                variants={itemVariants}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 text-center md:p-8"
              >
                <p className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-none text-accent">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-white/50">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </RibbonAwareSection>
      )}

      {/* Mission */}
      <RibbonAwareSection
        backgroundClassName="bg-background"
        className="overflow-hidden"
        contentClassName="relative py-[clamp(4rem,8vw,6rem)] px-6 md:px-8"
      >
        <motion.div
          className="relative mx-auto max-w-[1240px]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 md:p-12"
          >
            <h2 className="mb-1 text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-accent">
              {page.missionTitle}
            </h2>
            <div className="mt-5 space-y-4">
              {page.missionBody.split('\n\n').map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-white/70 md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </RibbonAwareSection>

      {/* Values */}
      {page.values && page.values.length > 0 && (
        <RibbonAwareSection
          backgroundClassName="bg-background"
          className="overflow-hidden"
          contentClassName="relative py-[clamp(4rem,8vw,6rem)] px-6 md:px-8"
        >
          <motion.div
            className="relative mx-auto max-w-[1240px]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.14 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-10 space-y-3">
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] text-foreground">
                Our Values
              </h2>
              <p className="max-w-[30rem] text-sm leading-relaxed text-white/55 md:text-base">
                The principles that guide everything we do at MAC.
              </p>
            </motion.div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {page.values.map((value) => (
                <motion.div
                  key={value._key}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-colors duration-300 hover:border-accent/20 hover:bg-accent/[0.04] md:p-8"
                >
                  {/* Value image/icon */}
                  {value.image?.asset?.url && (
                    <div className="mb-5 h-16 w-16 overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={urlFor(value.image).width(128).height(128).fit('crop').url()}
                        alt={value.title}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-accent">
                    {value.title}
                  </h3>
                  {value.description && (
                    <p className="mt-2 text-sm leading-relaxed text-white/50">
                      {value.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </RibbonAwareSection>
      )}

      {/* Our Journey */}
      {page.journey && page.journey.length > 0 && (() => {
        // Split: all years except the last go left, last year goes top-right
        const leftYears = page.journey.slice(0, -1)
        const lastYear = page.journey[page.journey.length - 1]

        return (
          <RibbonAwareSection
            backgroundClassName="bg-background"
            className="overflow-hidden"
            contentClassName="relative py-[clamp(4rem,8vw,6rem)] pb-[clamp(6rem,10vw,8rem)] px-6 md:px-8"
          >
            <motion.div
              className="relative mx-auto max-w-[1240px]"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
            >
              {/* Heading */}
              <motion.div variants={itemVariants} className="mb-10">
                <span className="block text-[0.85rem] font-bold uppercase tracking-[0.12em] text-accent">
                  Our
                </span>
                <h2 className="text-[clamp(2.8rem,5.5vw,4.5rem)] font-extrabold leading-[0.95] text-foreground">
                  Journey
                </h2>
              </motion.div>

              {/* Two-column layout */}
              <div className="grid gap-10 lg:grid-cols-2">
                {/* Left column — year milestones */}
                <motion.div variants={itemVariants} className="space-y-0">
                  {leftYears.map((j, i) => (
                    <div key={j._key}>
                      <div className="py-5">
                        <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-none text-foreground">
                          {j.year}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/60 md:text-base">
                          <span className="text-white/35 mr-1">&gt;</span>
                          {j.summary}
                        </p>
                      </div>
                      {i < leftYears.length - 1 && (
                        <div className="h-px bg-white/10" />
                      )}
                    </div>
                  ))}
                </motion.div>

                {/* Right column — latest year + where are we now */}
                <motion.div variants={itemVariants} className="space-y-6">
                  {/* Latest year */}
                  <div>
                    <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-none text-foreground">
                      {lastYear.year}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60 md:text-base">
                      <span className="text-white/35 mr-1">&gt;</span>
                      {lastYear.summary}
                    </p>
                  </div>

                  {/* Where are we now? */}
                  {page.whereAreWeNow && (
                    <div className="rounded-2xl bg-accent/10 p-7 md:p-9">
                      <h3 className="text-[clamp(1.4rem,2.5vw,1.8rem)] font-bold text-accent">
                        Where are we now?
                      </h3>
                      <div className="mt-4 space-y-4">
                        {page.whereAreWeNow.split('\n\n').map((paragraph, i) => (
                          <p
                            key={i}
                            className="text-sm leading-relaxed text-white/70 md:text-base"
                          >
                            {renderBold(paragraph)}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </RibbonAwareSection>
        )
      })()}
    </>
  )
}
