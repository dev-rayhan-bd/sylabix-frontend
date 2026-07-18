"use client";

import { motion } from "framer-motion";
import {
  DocumentScanIcon,
  CalendarSyncIcon,
  ChatAiIcon,
  FlashcardIcon,
  AnalyticsIcon,
  ShieldLockIcon,
} from "@/components/shared/premium-icons";

const FEATURES = [
  {
    icon: DocumentScanIcon,
    title: "PDF Syllabus Analysis",
    description:
      "Upload any syllabus PDF and our AI instantly extracts topics, deadlines, and key concepts into a structured study plan.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: CalendarSyncIcon,
    title: "Adaptive Scheduling",
    description:
      "Your study schedule adapts in real-time based on your progress, upcoming exams, and available study time.",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: ChatAiIcon,
    title: "RAG-based AI Chat",
    description:
      "Ask questions about your course material and get instant answers powered by Retrieval-Augmented Generation.",
    gradient: "from-cyan-500 to-sky-500",
  },
  {
    icon: FlashcardIcon,
    title: "Smart Flashcards",
    description:
      "Auto-generated flashcards from your syllabus with spaced repetition to maximize retention.",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    icon: AnalyticsIcon,
    title: "Progress Analytics",
    description:
      "Visual dashboards showing your study hours, topic mastery, and predicted exam readiness.",
    gradient: "from-teal-400 to-cyan-500",
  },
  {
    icon: ShieldLockIcon,
    title: "Secure & Private",
    description:
      "Your data is encrypted end-to-end. We never share your study materials with third parties.",
    gradient: "from-sky-500 to-indigo-500",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] translate-y-[-50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to{" "}
            <span className="text-gradient">ace your courses</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful AI features designed to transform how you study, from
            syllabus analysis to exam readiness.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="card-hover group relative overflow-hidden rounded-2xl border border-white/5 bg-card p-6"
              >
                {/* Hover gradient overlay */}
                <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Icon */}
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg shadow-primary/10`}
                >
                  <Icon className="size-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
