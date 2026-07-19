"use client";

import { LoginForm } from "@/src/components/auth/LoginForm";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineSparkles, HiOutlineAcademicCap, HiOutlineChartBar } from "react-icons/hi2";

const features = [
  { icon: HiOutlineSparkles, text: "AI-Powered Study Plans" },
  { icon: HiOutlineAcademicCap, text: "Smart Progress Tracking" },
  { icon: HiOutlineChartBar, text: "Performance Analytics" },
];

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1fr_1fr]">
      {/* ─── Brand Panel (Left) ─────────────────────── */}
      <div className="relative hidden overflow-hidden bg-linear-to-br from-[#0a0f1a] via-[#0d1a1a] to-[#0a0f1a] lg:flex lg:flex-col lg:items-center lg:justify-center">
        {/* Animated orbs */}
        <motion.div
          className="absolute -left-32 -top-32 h-125 w-125 rounded-full bg-primary/15 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 h-100 w-100 rounded-full bg-emerald-500/10 blur-[100px]"
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/3 h-62.5 w-62.5 -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[80px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10"
          >
            <Link href="/" className="group flex items-center gap-3">
              <Image
                src="/sylabixlogo.png"
                alt="Syllabix"
                width={48}
                height={48}
                className="h-14 w-auto object-contain drop-shadow-[0_0_30px_rgba(52,211,153,0.3)] transition-transform group-hover:scale-105"
                priority
                unoptimized
              />
              <span className="text-3xl font-bold tracking-tight text-foreground drop-shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                Syllabix
              </span>
            </Link>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4 text-4xl font-bold tracking-tight text-foreground"
          >
            Study Smarter with
            <br />
            <span className="text-gradient-glow">AI-Powered Planning</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10 max-w-md text-lg text-muted-foreground"
          >
            Join thousands of students transforming their study habits with intelligent scheduling and real-time analytics.
          </motion.p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/3 px-5 py-3 backdrop-blur-sm"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="size-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground/80">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Form Panel (Right) ────────────────────── */}
      <div className="relative flex items-center justify-center px-4 py-12 sm:px-8">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/4 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 h-62.5 w-62.5 rounded-full bg-emerald-500/8 blur-[80px]" />
        </div>

        <div className="w-full max-w-md">
          {/* Mobile logo (visible only on small screens) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 text-center lg:hidden"
          >
            <Link href="/" className="group inline-flex items-center gap-2">
              <Image src="/sylabixlogo.png" alt="Syllabix" width={32} height={32} className="h-8 w-auto object-contain transition-transform group-hover:scale-105" priority unoptimized />
              <span className="text-xl font-bold tracking-tight text-foreground">Syllabix</span>
            </Link>
          </motion.div>

          {/* Header */}
          <div className="mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight text-foreground"
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-2 text-muted-foreground"
            >
              Sign in to continue to your dashboard
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-3xl p-px gradient-border"
          >
            <div className="glass-strong rounded-[calc(1.875rem-1px)] p-8">
              <LoginForm />
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary transition-colors hover:underline">
              Get Started Free
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}