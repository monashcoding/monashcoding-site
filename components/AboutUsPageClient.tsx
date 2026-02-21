'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image, { ImageProps } from 'next/image'
import { AboutUsPageData } from '@/lib/sanity/types'
import { urlFor } from '@/sanity/lib/image'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'

function FadeInImage({ className, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Image
      {...props}
      className={`${className ?? ''} transition-opacity duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={() => setLoaded(true)}
    />
  )
}

const defaultData: AboutUsPageData = {
  pageTitle: 'About MAC',
  pageSubtitle:
    'Monash Association of Coding (MAC) is the **largest student-run computing club** at **Monash University,** with over 1,500 current members and an online presence that extends **across the globe**.',
  missionTitle: 'Our Mission',
  missionBody:
    'We strive to **upskill students** through high-quality **events, workshops and hackathons**, spanning both technical and professional domains.\n\nThrough our impact, we aim to make coding enjoyable and accessible to all, offering students **real-world experience** and **insight into the tech industry**.',
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

/** Purple highlight with slide-over wipe animation */
function HighlightReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="relative inline-block">
      {/* Purple background that slides in from left */}
      <motion.span
        className="absolute inset-x-[-4px] inset-y-[-2px] bg-blue"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{
          duration: 0.6,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      <span className="relative font-bold text-white">{children}</span>
    </span>
  )
}

/** Render **bold** markdown segments with purple highlight + slide animation */
function renderHighlight(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  let highlightIndex = 0
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      const delay = 0.8 + highlightIndex * 0.2
      highlightIndex++
      return (
        <HighlightReveal key={i} delay={delay}>
          {part}
        </HighlightReveal>
      )
    }
    return part
  })
}

/** Render **bold** markdown segments */
function renderBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-white">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

export default function AboutUsPageClient({ data }: AboutUsPageClientProps) {
  const page = data ?? defaultData

  // Split journey: all except last go left, last goes right
  const leftYears = page.journey.slice(0, -1)
  const lastYear = page.journey[page.journey.length - 1]

  return (
    <>
      {/* Hero */}
      <RibbonAwareSection
        backgroundClassName="bg-background"
        className="overflow-hidden"
        contentClassName="relative"
      >
        <div className="relative min-h-screen flex items-center justify-center">
          {/* Background image with gradient overlays */}
          {page.heroImage?.asset?.url && (
            <Image
              src={urlFor(page.heroImage).width(1440).height(900).fit('crop').url()}
              alt=""
              fill
              className="object-cover object-center opacity-40"
              priority
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-background)_0%,transparent_25%,transparent_75%,var(--color-background)_100%)]" />

          {/* Content */}
          <motion.div
            className="relative z-10 mx-auto max-w-[732px] px-6 text-center"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            <motion.h1
              variants={itemVariants}
              className="text-[clamp(3rem,7vw,88px)] font-semibold leading-none"
            >
              <span className="text-foreground">About </span>
              <span className="relative inline-block text-accent">
                MAC
                {/* Curved handwriting-style underline */}
                <svg
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 -rotate-5 w-[110%]"
                  viewBox="0 0 120 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2 7 Q 60 2, 118 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      pathLength: {
                        duration: 0.8,
                        delay: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.01, delay: 0.6 },
                    }}
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-[732px] text-[clamp(1rem,2.5vw,24px)] leading-normal text-white"
            >
              {renderHighlight(page.pageSubtitle)}
            </motion.p>
          </motion.div>
        </div>
      </RibbonAwareSection>

      {/* ── Our Mission ── */}
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
<div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* Text content */}
            <motion.div
              variants={itemVariants}
              className="relative z-10 mx-auto text-center lg:mx-0 lg:text-left"
            >
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold text-accent">
                {page.missionTitle}
              </h2>
              <div className="mt-6 space-y-6">
                {page.missionBody.split('\n\n').map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[clamp(1rem,2.5vw,24px)] leading-normal text-white"
                  >
                    {renderBold(paragraph)}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Mission image */}
            {page.missionImage?.asset?.url && (
              <motion.div
                variants={itemVariants}
                className="mt-10 w-full lg:mt-0"
              >
                <div className="relative aspect-[876/650] w-full">
                  <FadeInImage
                    src={urlFor(page.missionImage).width(1440).height(1070).fit('crop').url()}
                    alt="MAC mission"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </RibbonAwareSection>

      {/* ── MAC's Values ── */}
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
            {/* Heading */}
            <motion.h2
              variants={itemVariants}
              className="text-center text-[clamp(2.5rem,5vw,4rem)] font-semibold"
            >
              <span className="text-accent">MAC</span>
              <span className="text-foreground">&apos;s Values</span>
            </motion.h2>

            {/* Values grid: 3 top, 2 bottom centered */}
            <div className="mt-12">
              {/* Top row */}
              <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-3">
                {page.values.slice(0, 3).map((value) => (
                  <motion.div
                    key={value._key}
                    variants={itemVariants}
                    className="group flex flex-col items-center text-center"
                  >
                    {value.image?.asset?.url ? (
                      <div className="relative h-[200px] w-[200px] overflow-hidden md:h-[294px] md:w-[294px]">
                        <FadeInImage
                          src={urlFor(value.image).width(588).height(588).fit('crop').url()}
                          alt={value.title}
                          fill
                          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 bg-[linear-gradient(155deg,rgba(87,87,210,0.25)_0%,rgba(87,87,210,0.08)_45%,transparent_100%)]"
                        />
                      </div>
                    ) : (
                      <div className="h-[200px] w-[200px] bg-white/5 md:h-[294px] md:w-[294px]" />
                    )}
                    <p className="mt-4 max-w-[255px] text-[clamp(1rem,2.5vw,24px)] text-white transition-colors duration-300 group-hover:text-blue-light">
                      {value.title}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Bottom row — centered */}
              {page.values.length > 3 && (
                <div className="mt-8 flex flex-wrap justify-center gap-8">
                  {page.values.slice(3).map((value) => (
                    <motion.div
                      key={value._key}
                      variants={itemVariants}
                      className="group flex flex-col items-center text-center"
                    >
                      {value.image?.asset?.url ? (
                        <div className="relative h-[200px] w-[200px] overflow-hidden md:h-[294px] md:w-[294px]">
                          <FadeInImage
                            src={urlFor(value.image).width(588).height(588).fit('crop').url()}
                            alt={value.title}
                            fill
                            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                          />
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 bg-[linear-gradient(155deg,rgba(87,87,210,0.25)_0%,rgba(87,87,210,0.08)_45%,transparent_100%)]"
                          />
                        </div>
                      ) : (
                        <div className="h-[200px] w-[200px] bg-white/5 md:h-[294px] md:w-[294px]" />
                      )}
                      <p className="mt-4 max-w-[255px] text-[clamp(1rem,2.5vw,24px)] text-white transition-colors duration-300 group-hover:text-blue-light">
                        {value.title}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </RibbonAwareSection>
      )}

      {/* ── Our Journey ── */}
      {page.journey && page.journey.length > 0 && (
        <RibbonAwareSection
          backgroundClassName="bg-background"
          className="overflow-hidden"
          contentClassName="relative py-[clamp(4rem,8vw,6rem)] px-6 md:px-8"
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
              <span className="block text-[clamp(1.4rem,2.5vw,2rem)] font-semibold text-foreground">
                OUR
              </span>
              <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-[0.95] text-blue">
                Journey
              </h2>
            </motion.div>

            {/* Two-column layout */}
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
              {/* Left column — year milestones (2019–2024) */}
              <motion.div variants={itemVariants} className="space-y-0">
                {leftYears.map((j) => (
                  <div key={j._key} className="py-4">
                    <h3 className="text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-none text-foreground">
                      {j.year}
                    </h3>
                    <p className="mt-2 text-[clamp(1rem,2vw,20px)] leading-normal text-[#9a9a9a]">
                      <span className="mr-1">&gt;</span>
                      {j.summary}
                    </p>
                  </div>
                ))}
              </motion.div>

              {/* Right column — latest year + image */}
              <motion.div variants={itemVariants} className="space-y-6">
                {lastYear && (
                  <div>
                    <h3 className="text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-none text-foreground">
                      {lastYear.year}
                    </h3>
                    <p className="mt-2 text-[clamp(1rem,2vw,20px)] leading-normal text-[#9a9a9a]">
                      <span className="mr-1">&gt;</span>
                      {lastYear.summary}
                    </p>
                  </div>
                )}

                {/* Journey image */}
                {page.journeyImage?.asset?.url && (
                  <div className="relative aspect-[523/643] w-full max-w-[523px]">
                    <FadeInImage
                      src={urlFor(page.journeyImage).width(1046).height(1286).url()}
                      alt="MAC journey"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Where are we now? */}
            {page.whereAreWeNow && (
              <motion.div
                variants={itemVariants}
                className="mt-16 rounded-[2.5rem] bg-accent/20 px-8 py-10 md:px-14 md:py-12"
              >
                <h3 className="text-[clamp(1.6rem,3vw,2rem)] font-semibold text-accent">
                  Where are we now?
                </h3>
                <div className="mt-4 space-y-4">
                  {page.whereAreWeNow.split('\n\n').map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-[clamp(1rem,2vw,20px)] leading-normal text-white"
                    >
                      {renderBold(paragraph)}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </RibbonAwareSection>
      )}
    </>
  )
}
