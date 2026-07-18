"use client";

import { motion } from "framer-motion";
import {
  UploadCloudIcon,
  NeuralBrainIcon,
  TrophyIcon,
} from "@/components/shared/premium-icons";

const STEPS = [
  {
    step: 1,
    icon: UploadCloudIcon,
    title: "Upload Your Syllabus",
    description:
      "Drop any PDF syllabus onto Syllabix. Our AI instantly reads and structures it — extracting topics, deadlines, and key concepts.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    step: 2,
    icon: NeuralBrainIcon,
    title: "AI Generates Your Plan",
    description:
      "An adaptive study schedule is created for you, with smart flashcards, priority topics, and daily goals tailored to your timeline.",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    step: 3,
    icon: TrophyIcon,
    title: "Study & Track Progress",
    description:
      "Follow your personalized plan, chat with AI about any topic, and watch your mastery grow with real-time analytics.",
    gradient: "from-cyan-500 to-sky-600",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 h-[300px] w-[300px] translate-x-1/3 rounded-full bg-primary/5 blur-[100px]" />
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
            Get started in{" "}
            <span className="text-gradient">three simple steps</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            From syllabus to study plan in minutes — no setup required.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-20 grid gap-12 md:grid-cols-3">
          {/* Connecting line (desktop) */}
          <div className="absolute top-12 left-[15%] right-[15%] hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number + icon */}
                <div
                  className={`relative z-10 flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-xl shadow-primary/10`}
                >
                  <Icon className="size-10 text-white" />
                  {/* Step number badge */}
                  <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full border-2 border-background bg-foreground text-[11px] font-bold text-background">
                    {step.step}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
