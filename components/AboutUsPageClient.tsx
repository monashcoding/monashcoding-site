'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { AboutUsPageData } from '@/lib/sanity/types'
import { urlFor } from '@/sanity/lib/image'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import { FadeInImage } from '@/components/ui/FadeInImage'
import { blocksToTextAndBoldRanges, ptBlock, toPortableTextBlocks } from '@/lib/sanity/portableText'

const defaultData: AboutUsPageData = {
  pageTitle: 'About MAC',
  pageSubtitle: [
    ptBlock(
      'Monash Association of Coding (MAC) is the ',
      ['largest student-run computing club', 'strong'],
      ' at ',
      ['Monash University,', 'strong'],
      ' with over 1,500 current members and an online presence that extends ',
      ['across the globe', 'strong'],
      '.',
    ),
  ],
  missionTitle: 'Our Mission',
  missionBody: [
    ptBlock(
      'We strive to ',
      ['upskill students', 'strong', 'underline'],
      ' through high-quality ',
      ['events, workshops and hackathons', 'strong'],
      ', spanning both technical and professional domains.',
    ),
    ptBlock(
      'Through our impact, we aim to make coding enjoyable and accessible to all, offering students ',
      ['real-world experience', 'strong'],
      ' and ',
      ['insight into the tech industry', 'strong'],
      '.',
    ),
  ],
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
      summary: [ptBlock('MAC is ', ['founded by a group of friends', 'strong'], ' who organised mock technical interviews.')],
    },
    {
      _key: '2',
      year: '2020',
      summary: [ptBlock("Awarded '", ["'Most Outstanding New Club'", 'strong'], "' by Monash Clubs & Societies.")],
    },
    {
      _key: '3',
      year: '2021',
      summary: [ptBlock("Held MAC's first hackathon with ", ['200+ participants', 'strong'], '.')],
    },
    {
      _key: '4',
      year: '2022',
      summary: [ptBlock('Launched our ', ['new annual flagship hackathon', 'strong'], " called 'MACathon'.")],
    },
    {
      _key: '5',
      year: '2023',
      summary: [ptBlock('Hosted our biggest networking night yet with ', ['over 175 attendees', 'strong'], '.')],
    },
    {
      _key: '6',
      year: '2024',
      summary: [ptBlock("Awarded '", ['Outstanding Marketing Campaign', 'strong'], "' and '", ['Best Club in Monash', 'strong'], "' by Monash Clubs & Societies.")],
    },
    {
      _key: '7',
      year: '2025',
      summary: [ptBlock("Crowned '", ['Most Popular Club Event', 'strong'], "' at the Monash Awards Night for the MAC x UNIHACK Hackathon with ", ['over 650 participants', 'strong'], '.')],
    },
  ],
  whereAreWeNow: [
    ptBlock(
      "MAC's exponential growth has led us to become ",
      ["one of Australia's ", 'strong'],
      ['leading computing societies', 'strong', 'underline'],
      ['.', 'strong'],
    ),
    ptBlock(
      'We unite ',
      ['over 1500 enthusiastic members', 'strong'],
      ' and a ',
      ['tight-knit committee of over 60 passionate students', 'strong'],
      ' in technology. We endeavour to equip our community with professional skills, industry insights and connections with ambitious individuals.',
    ),
    ptBlock(
      'Through weekly technical events, hackathons and networking nights, totalling ',
      ['2000+ attendees', 'strong'],
      ', we empower our students to thrive holistically in a forever-evolving tech space.',
    ),
  ],
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

/** Purple highlight with slide-over wipe animation (inline-friendly, allows text wrapping) */
function HighlightReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="font-bold text-white"
      style={{
        backgroundImage: 'linear-gradient(to right, var(--color-blue), var(--color-blue))',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone' as never,
        padding: '2px 4px',
        margin: '0 -4px',
      }}
      initial={{ backgroundSize: '0% 100%' }}
      whileInView={{ backgroundSize: '100% 100%' }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.span>
  )
}

/** Handwritten curved underline stroke (matches the hero "MAC" underline) */
function HandwrittenUnderline({ children }: { children: React.ReactNode }) {
  const textLen = typeof children === 'string' ? children.length : 20
  const rotation = -(Math.min(3, Math.max(0.5, 4 - textLen * 0.12)))

  return (
    <span className="relative inline-block">
      {children}
      <svg
        className="absolute bottom-0 left-0 w-full h-[0.35em] text-accent"
        style={{ transform: `translateY(40%) rotate(${rotation}deg)` }}
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
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            pathLength: {
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            },
            opacity: { duration: 0.01 },
          }}
        />
      </svg>
    </span>
  )
}

/** Portable Text components: highlight = purple highlight wipe, strong = plain bold, underline = handwritten SVG */
const aboutUsComponents: PortableTextComponents = {
  marks: {
    highlight: ({ children }) => <HighlightReveal>{children}</HighlightReveal>,
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    underline: ({ children }) => <HandwrittenUnderline>{children}</HandwrittenUnderline>,
    em: ({ children }) => <em>{children}</em>,
  },
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
}

/** Fast typewriter reveal - each character appears sequentially.
 *  Bold ranges are provided directly via the boldRanges prop. */
function TypewriterText({
  text,
  boldRanges: externalBoldRanges,
  charDelay = 0.018,
  startDelay = 0,
  showCursor = false,
  highlightBold = true,
}: {
  text: string
  boldRanges?: [number, number][]
  charDelay?: number
  startDelay?: number
  showCursor?: boolean
  highlightBold?: boolean
}) {
  const renderedText = text
  const isBold = (i: number) => (externalBoldRanges ?? []).some(([s, e]) => i >= s && i < e)

  const totalTypingTime = renderedText.length * charDelay
  const blinkDuration = 0.8
  const numRepeats = Math.ceil((totalTypingTime + 0.3) / blinkDuration)

  // Split into words so each word stays together (no mid-word breaks)
  const words = renderedText.split(' ')
  let globalIndex = 0

  return (
    <>
      {words.map((word, wi) => {
        const wordStart = globalIndex
        globalIndex += word.length
        if (wi < words.length - 1) globalIndex += 1

        return (
          <span key={wi} className="inline-flex whitespace-nowrap align-text-bottom leading-[inherit]">
            {word.split('').map((char, ci) => {
              const idx = wordStart + ci
              const bold = isBold(idx)
              return (
                <motion.span
                  key={ci}
                  className={`inline-block overflow-hidden whitespace-pre leading-[inherit]${bold ? (highlightBold ? ' bg-blue font-bold text-white' : ' font-bold text-white') : ''}`}
                  variants={{
                    hidden: { maxWidth: 0 },
                    show: {
                      maxWidth: '1.2em',
                      transition: { duration: 0, delay: startDelay + idx * charDelay },
                    },
                  }}
                >
                  {char}
                </motion.span>
              )
            })}
            {wi < words.length - 1 && (
              <motion.span
                className={`inline-block overflow-hidden whitespace-pre leading-[inherit]${isBold(wordStart + word.length) && highlightBold ? ' bg-blue' : ''}`}
                variants={{
                  hidden: { maxWidth: 0 },
                  show: {
                    maxWidth: '0.5em',
                    transition: { duration: 0, delay: startDelay + (wordStart + word.length) * charDelay },
                  },
                }}
              >
                {' '}
              </motion.span>
            )}
          </span>
        )
      })}
      {showCursor && (
        <motion.span
          className="inline-block w-[0.55em] h-[1.1em] overflow-hidden align-text-bottom"
          style={{ backgroundColor: 'currentColor' }}
          variants={{
            hidden: { opacity: 0, maxWidth: 0 },
            show: {
              opacity: [1, 1, 0, 0],
              maxWidth: '0.55em',
              transition: {
                opacity: {
                  delay: startDelay,
                  duration: blinkDuration,
                  repeat: numRepeats,
                  repeatType: 'loop' as const,
                  times: [0, 0.499, 0.5, 1],
                  ease: 'linear' as const,
                },
                maxWidth: {
                  delay: startDelay,
                  duration: 0,
                },
              },
            },
          }}
        />
      )}
    </>
  )
}

export default function AboutUsPageClient({ data }: AboutUsPageClientProps) {
  const raw = data ?? defaultData

  // Normalize legacy string fields to Portable Text blocks
  const page = {
    ...raw,
    pageSubtitle: toPortableTextBlocks(raw.pageSubtitle),
    missionBody: toPortableTextBlocks(raw.missionBody),
    whereAreWeNow: toPortableTextBlocks(raw.whereAreWeNow),
    journey: raw.journey.map((j) => ({
      ...j,
      summary: toPortableTextBlocks(j.summary),
    })),
  }

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
              className="object-cover object-center opacity-15"
              priority
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-background)_0%,transparent_40%,transparent_60%,var(--color-background)_100%)]" />

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
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 -rotate-3 w-[110%]"
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
                        delay: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.01, delay: 0.8 },
                    }}
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="mx-auto mt-6 max-w-[732px] text-[clamp(1rem,2.5vw,24px)] leading-normal text-white"
            >
              <PortableText value={page.pageSubtitle} components={aboutUsComponents} />
            </motion.div>
          </motion.div>
        </div>
      </RibbonAwareSection>

      {/* Our Mission */}
      <RibbonAwareSection
        backgroundClassName="bg-background"
        className="overflow-hidden"
        contentClassName="relative py-[clamp(4rem,8vw,6rem)] px-6 md:px-8"
      >
        <motion.div
          className="relative mx-auto max-w-[1240px] lg:max-w-[1440px]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
<div className="lg:grid lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-12">
            {/* Text content */}
            <motion.div
              variants={itemVariants}
              className="relative z-10 mx-auto text-center lg:mx-0 lg:text-left"
            >
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold text-accent">
                {page.missionTitle}
              </h2>
              <div className="mt-6 space-y-6 text-[clamp(1rem,2.5vw,24px)] leading-normal text-white">
                <PortableText value={page.missionBody} components={aboutUsComponents} />
              </div>
            </motion.div>

            {/* Mission image - clipped to variant-1 blob */}
            {page.missionImage?.asset?.url && (
              <motion.div
                variants={itemVariants}
                className="mt-10 w-full lg:mt-0"
              >
                <div className="relative aspect-885/659 w-full">
                  <svg className="absolute" width="0" height="0">
                    <defs>
                      <clipPath id="blob-mission" clipPathUnits="objectBoundingBox">
                        <path transform={`scale(${1/885}, ${1/659})`} d="M24.0324 582.821C-46.8515 422.792 83.5324 401.321 280.532 85.321C359.854 -41.9148 464.649 -4.64854 657.148 58.8219C849.648 122.292 761.648 227.322 835.148 333.822C908.649 440.322 896.148 544.322 770.148 569.322C644.148 594.322 615.032 543.74 476.649 555.322C309.096 569.346 94.9164 742.85 24.0324 582.821Z" />
                      </clipPath>
                    </defs>
                  </svg>
                  <div className="absolute inset-0" style={{ clipPath: 'url(#blob-mission)' }}>
                    <FadeInImage
                      src={urlFor(page.missionImage).width(1440).height(1070).fit('crop').url()}
                      alt="MAC mission"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 885 659" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.0324 582.821C-46.8515 422.792 83.5324 401.321 280.532 85.321C359.854 -41.9148 464.649 -4.64854 657.148 58.8219C849.648 122.292 761.648 227.322 835.148 333.822C908.649 440.322 896.148 544.322 770.148 569.322C644.148 594.322 615.032 543.74 476.649 555.322C309.096 569.346 94.9164 742.85 24.0324 582.821Z" stroke="yellow" vectorEffect="non-scaling-stroke" strokeWidth="2" />
                  </svg>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </RibbonAwareSection>

      {/* MAC's Values */}
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

      {/* Our Journey */}
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
              {/* Left column - year milestones */}
              <div className="space-y-0">
                {leftYears.map((j, index) => {
                  const { text: summaryText, boldRanges } = blocksToTextAndBoldRanges(j.summary)
                  const prefixed = `> ${summaryText}`
                  const offsetRanges = boldRanges.map(([s, e]) => [s + 2, e + 2] as [number, number])
                  return (
                    <motion.div
                      key={j._key}
                      className="py-4"
                      variants={{ hidden: {}, show: {} }}
                    >
                      <h3 className="text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-none text-foreground">
                        <TypewriterText text={j.year} startDelay={index * 0.1} />
                      </h3>
                      <p className="mt-2 text-[clamp(1rem,2vw,20px)] leading-normal text-[#9a9a9a]">
                        <TypewriterText text={prefixed} boldRanges={offsetRanges} startDelay={index * 0.1 + 0.15} showCursor highlightBold={false} />
                      </p>
                    </motion.div>
                  )
                })}
              </div>

              {/* Right column - latest year + image */}
              <div className="space-y-6">
                {lastYear && (() => {
                  const { text: lastText, boldRanges: lastBold } = blocksToTextAndBoldRanges(lastYear.summary)
                  const prefixed = `> ${lastText}`
                  const offsetRanges = lastBold.map(([s, e]) => [s + 2, e + 2] as [number, number])
                  return (
                    <motion.div
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.8 }}
                    >
                      <h3 className="text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-none text-foreground">
                        <TypewriterText text={lastYear.year} />
                      </h3>
                      <p className="mt-2 text-[clamp(1rem,2vw,20px)] leading-normal text-[#9a9a9a]">
                        <TypewriterText text={prefixed} boldRanges={offsetRanges} startDelay={0.15} showCursor highlightBold={false} />
                      </p>
                    </motion.div>
                  )
                })()}

                {/* Journey image */}
                {page.journeyImage?.asset?.url && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="relative aspect-525/645 w-full max-w-131.25">
                      <svg className="absolute" width="0" height="0">
                        <defs>
                          <clipPath id="blob-journey" clipPathUnits="objectBoundingBox">
                            <path transform={`scale(${1/525}, ${1/645})`} d="M215 10.6221C133.388 37.923 62.6385 81.8857 62.6385 204.056C62.6386 326.226 -38.865 318.683 18.6387 494.056C76.1424 669.429 175.164 684.831 345.312 569.755C515.46 454.678 567.556 280.204 485.639 145.056C403.721 9.90742 296.612 -16.6789 215 10.6221Z" />
                          </clipPath>
                        </defs>
                      </svg>
                      <div className="absolute inset-0" style={{ clipPath: 'url(#blob-journey)' }}>
                        <FadeInImage
                          src={urlFor(page.journeyImage).width(1050).height(1290).fit('crop').url()}
                          alt="MAC journey"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 525 645" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M215 10.6221C133.388 37.923 62.6385 81.8857 62.6385 204.056C62.6386 326.226 -38.865 318.683 18.6387 494.056C76.1424 669.429 175.164 684.831 345.312 569.755C515.46 454.678 567.556 280.204 485.639 145.056C403.721 9.90742 296.612 -16.6789 215 10.6221Z" stroke="yellow" vectorEffect="non-scaling-stroke" strokeWidth="2" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Where are we now? */}
            {page.whereAreWeNow && page.whereAreWeNow.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="mt-16 rounded-xl bg-accent/20 px-8 py-10 md:px-14 md:py-12"
              >
                <h3 className="text-[clamp(1.6rem,3vw,2rem)] font-semibold text-accent">
                  Where are we now?
                </h3>
                <div className="mt-4 space-y-4 text-[clamp(1rem,2vw,20px)] leading-normal text-white">
                  <PortableText value={page.whereAreWeNow} components={aboutUsComponents} />
                </div>
              </motion.div>
            )}
          </motion.div>
        </RibbonAwareSection>
      )}
    </>
  )
}
