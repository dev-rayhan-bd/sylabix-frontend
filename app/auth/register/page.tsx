"use client";

import { RegisterForm } from "@/src/components/auth/RegisterForm";
import { motion } from "framer-motion";
import { HiOutlineBolt } from "react-icons/hi2";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-1/3 left-1/4 h-[200px] w-[200px] rounded-full bg-emerald-500/10 blur-[80px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 mb-6"
          >
            <HiOutlineBolt className="size-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Syllabix
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-foreground"
          >
            Create your account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-2 text-muted-foreground"
          >
            Join thousands of students studying smarter with AI
          </motion.p>
        </div>

        {/* Form Card with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative rounded-3xl p-0.5 gradient-border"
        >
          <div className="rounded-[calc(1.875rem-1px)] bg-card/80 backdrop-blur-xl border border-white/5 p-8">
            <RegisterForm />
          </div>
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <p>Already have an account?{" "}</p>
          <a
            href="/auth/login"
            className="text-primary hover:underline font-medium transition-colors"
          >
            Sign In
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}