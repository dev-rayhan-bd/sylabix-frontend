"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="gradient-border mx-auto max-w-3xl rounded-3xl p-0.5"
      >
        <div className="rounded-[calc(1.5rem-1px)] bg-card px-8 py-16 text-center sm:px-16">
          <Sparkles className="mx-auto size-8 text-primary" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Master Your Syllabus?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join thousands of students who are already studying smarter with
            AI. Get started for free in under a minute.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className={buttonVariants({
                size: "lg",
                className: "glow-sm group h-12 px-8 text-base",
              })}
            >
              Get Started Free
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#features"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-12 px-8 text-base",
              })}
            >
              Learn More
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
