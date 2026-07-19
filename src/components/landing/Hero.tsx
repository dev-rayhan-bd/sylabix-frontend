"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiOutlineBolt, HiArrowRight } from "react-icons/hi2";
import { buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/src/store/auth-store";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

export function Hero() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8"
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-1/3 left-1/4 h-[200px] w-[200px] rounded-full bg-emerald-500/10 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary badge-shimmer"
        >
          <HiOutlineBolt className="size-3.5" />
          AI-Powered Study Planning
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Master Your Syllabus with{" "}
          <span className="text-gradient-glow">AI Intelligence</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Syllabix transforms your PDF syllabi into adaptive study plans,
          intelligent flashcards, and AI-powered chat — so you can learn
          smarter, not harder.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={isAuthenticated ? "/dashboard" : "/auth/register"}
            className={buttonVariants({
              size: "lg",
              className: "glow-sm group h-12 px-8 text-base",
            })}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            <HiArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#features"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "h-12 px-8 text-base",
            })}
          >
            See Features
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-10"
        >
          {[
            { value: "10K+", label: "Active Students" },
            { value: "50K+", label: "Syllabi Analyzed" },
            { value: "99%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
