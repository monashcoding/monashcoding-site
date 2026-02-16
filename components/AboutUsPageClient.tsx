'use client'

import { motion } from 'framer-motion'
import { AboutUsPageData } from '@/lib/sanity/types'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'

const defaultData: AboutUsPageData = {
  pageTitle: 'About Us',
  pageSubtitle: 'Learn more about who we are and what drives us.',
  mission:
    'To impart technical skills and industry-relevant experiences to students, bridging the gap between the classroom and the industry.',
  vision:
    'To make coding a fun experience for all\u2014regardless of degree, year level, and experience\u2014by providing collaborative learning opportunities.',
  values: [
    {
      _key: '1',
      title: 'Inclusivity',
      description:
        'We welcome everyone regardless of their degree, year level, or experience with coding.',
    },
    {
      _key: '2',
      title: 'Collaboration',
      description:
        'We believe the best learning happens when we work together and share knowledge.',
    },
    {
      _key: '3',
      title: 'Industry Readiness',
      description:
        'We bridge the gap between university coursework and real-world industry expectations.',
    },
    {
      _key: '4',
      title: 'Community',
      description:
        'We foster a supportive environment where members can grow, connect, and have fun.',
    },
  ],
  stats: [
    { _key: '1', value: '1000+', label: 'Members' },
    { _key: '2', value: '50+', label: 'Events per year' },
    { _key: '3', value: '9', label: 'Teams' },
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
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

interface AboutUsPageClientProps {
  data: AboutUsPageData | null
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
              About MAC
            </span>
            <h1 className="text-[clamp(2.6rem,5.5vw,4.5rem)] font-semibold leading-[1.01] text-foreground">
              {page.pageTitle}
            </h1>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-[38rem] text-base leading-relaxed text-white/55 md:text-lg"
          >
            {page.pageSubtitle}
          </motion.p>
        </motion.div>
      </RibbonAwareSection>

      {/* Mission & Vision */}
      <RibbonAwareSection
        backgroundClassName="bg-background"
        className="overflow-hidden"
        contentClassName="relative py-[clamp(4rem,8vw,6rem)] px-6 md:px-8"
      >
        <motion.div
          className="relative mx-auto max-w-[1240px] grid gap-8 lg:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 md:p-10"
          >
            <h2 className="mb-1 text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-accent">
              Our Mission
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
              {page.mission}
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 md:p-10"
          >
            <h2 className="mb-1 text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-accent">
              Our Vision
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
              {page.vision}
            </p>
          </motion.div>
        </motion.div>
      </RibbonAwareSection>

      {/* Stats */}
      {page.stats && page.stats.length > 0 && (
        <RibbonAwareSection
          backgroundClassName="bg-background"
          className="overflow-hidden"
          contentClassName="relative py-[clamp(3rem,6vw,5rem)] px-6 md:px-8"
        >
          <motion.div
            className="relative mx-auto max-w-[1240px] grid grid-cols-2 gap-6 md:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {page.stats.map((stat) => (
              <motion.div
                key={stat._key}
                variants={itemVariants}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 text-center md:p-8"
              >
                <p className="text-[clamp(2rem,4vw,3rem)] font-bold leading-none text-accent">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.78rem] font-semibold tracking-[0.1em] uppercase text-white/50">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </RibbonAwareSection>
      )}

      {/* Values */}
      {page.values && page.values.length > 0 && (
        <RibbonAwareSection
          backgroundClassName="bg-background"
          className="overflow-hidden"
          contentClassName="relative py-[clamp(4rem,8vw,6rem)] pb-[clamp(6rem,10vw,8rem)] px-6 md:px-8"
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {page.values.map((value, index) => (
                <motion.div
                  key={value._key}
                  variants={itemVariants}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-colors duration-300 hover:border-accent/20 hover:bg-accent/[0.04] md:p-8"
                >
                  <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-bold text-white/50 transition-colors duration-300 group-hover:border-accent/30 group-hover:text-accent">
                    {index + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-accent">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </RibbonAwareSection>
      )}
    </>
  )
}
