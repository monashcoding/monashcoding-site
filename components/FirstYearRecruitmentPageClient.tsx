"use client";

import { motion } from "framer-motion";
import { FirstYearRecruitmentPageData } from "@/lib/sanity/types";
import { RibbonAwareSection } from "@/components/RibbonAwareSection";

interface FirstYearRecruitmentPageClientProps {
  data: FirstYearRecruitmentPageData | null;
}

export default function FirstYearRecruitmentPageClient({ data }: FirstYearRecruitmentPageClientProps) {
  const pageTitle = data?.pageTitle || "First Year Recruitment";
  const pageSubtitle = data?.pageSubtitle || "Start your coding journey with us. First-year students welcome!";

  return (
    <RibbonAwareSection
      as="main"
      backgroundClassName="bg-linear-to-b from-background to-secondary"
      contentClassName="min-h-screen pt-32 flex flex-col items-center justify-center"
    >
      <div className="max-w-[800px] w-full py-16 px-8 text-center">
        <motion.h1
          className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold text-foreground mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {pageTitle}
        </motion.h1>
        <motion.p
          className="text-lg text-white/60 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {pageSubtitle}
        </motion.p>
      </div>
    </RibbonAwareSection>
  );
}
