"use client";

import { motion } from "framer-motion";
import { useMyPlans, useDeletePlan } from "@/src/hooks/useStudyPlans";
import { PlanCardsSkeleton } from "@/src/components/dashboard/SkeletonLoaders";
import { PlanCard } from "@/src/components/dashboard/PlanCard";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export default function MyPlansPage() {
  const { data, isLoading } = useMyPlans();
  const plans = data?.plans ?? [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            My <span className="text-gradient">Plans</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage all your study plans
          </p>
        </div>
        <Link
          href="/dashboard/create-plan"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Plan
        </Link>
      </motion.div>

      {isLoading ? (
        <PlanCardsSkeleton />
      ) : plans.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong flex flex-col items-center rounded-2xl py-16 text-center"
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/5">
            <svg className="size-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No study plans yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first AI-powered study plan
          </p>
          <Link
            href="/dashboard/create-plan"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Create Plan →
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {plans?.map((plan) => (
            <PlanCard key={plan._id} plan={plan} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
