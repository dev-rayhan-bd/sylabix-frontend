"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { usePlanDetail } from "@/src/hooks/useStudyPlans";
import { PlanTimeline } from "@/src/components/dashboard/PlanTimeline";
import { PlanDetailSkeleton } from "@/src/components/dashboard/SkeletonLoaders";
import Link from "next/link";

export default function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = usePlanDetail(id);

  const plan = data?.data;

  const totalTasks =
    plan?.days?.reduce((sum, d) => {
      const dayTasks =
        d.sessions.Morning.length +
        d.sessions.Afternoon.length +
        d.sessions.Evening.length;
      return sum + dayTasks;
    }, 0) ?? 0;

  const completedTasks =
    plan?.days?.reduce((sum, d) => {
      const completed =
        d.sessions.Morning.filter((t) => t.completed).length +
        d.sessions.Afternoon.filter((t) => t.completed).length +
        d.sessions.Evening.filter((t) => t.completed).length;
      return sum + completed;
    }, 0) ?? 0;

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          href="/dashboard/my-plans"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Plans
        </Link>
      </motion.div>

      {isLoading ? (
        <PlanDetailSkeleton />
      ) : !plan ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-lg font-semibold text-foreground">
            Plan not found
          </p>
          <Link
            href="/dashboard/my-plans"
            className="mt-3 text-sm text-emerald-400 hover:text-emerald-300"
          >
            Go back to plans
          </Link>
        </div>
      ) : (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {plan.subject}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {new Date(plan.startDate).toLocaleDateString()} –{" "}
                    {new Date(plan.examDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      plan.difficulty === "easy"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : plan.difficulty === "medium"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {plan.difficulty}
                  </span>
                  <span>{plan.days?.length ?? 0} days</span>
                </div>
              </div>

              {/* Progress */}
              <div className="w-full max-w-xs shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">
                    {progress}%
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400"
                  />
                </div>
                <p className="mt-1 text-right text-[11px] text-muted-foreground">
                  {completedTasks}/{totalTasks} tasks
                </p>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <PlanTimeline days={plan.days} planId={plan._id} />
        </>
      )}
    </div>
  );
}
