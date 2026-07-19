"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { usePlanDetail } from "@/src/hooks/useStudyPlans";
import { PlanTimeline } from "@/src/components/dashboard/PlanTimeline";
import { PlanDetailSkeleton } from "@/src/components/dashboard/SkeletonLoaders";
import Link from "next/link";

const difficultyConfig: Record<string, { label: string; color: string; glow: string }> = {
  Easy: { label: "Easy", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", glow: "shadow-emerald-500/10" },
  Medium: { label: "Medium", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", glow: "shadow-amber-500/10" },
  Hard: { label: "Hard", color: "bg-red-500/10 text-red-400 border-red-500/20", glow: "shadow-red-500/10" },
};

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
        d.sessions.Morning.tasks.length +
        d.sessions.Afternoon.tasks.length +
        d.sessions.Evening.tasks.length;
      return sum + dayTasks;
    }, 0) ?? 0;

  const completedTasks =
    plan?.days?.reduce((sum, d) => {
      const completed =
        d.sessions.Morning.tasks.filter((t) => t.completed).length +
        d.sessions.Afternoon.tasks.filter((t) => t.completed).length +
        d.sessions.Evening.tasks.filter((t) => t.completed).length;
      return sum + completed;
    }, 0) ?? 0;

  const totalMinutes =
    plan?.days?.reduce((sum, d) => {
      const mins =
        d.sessions.Morning.tasks.reduce((s, t) => s + (t.estimatedMinutes ?? 30), 0) +
        d.sessions.Afternoon.tasks.reduce((s, t) => s + (t.estimatedMinutes ?? 30), 0) +
        d.sessions.Evening.tasks.reduce((s, t) => s + (t.estimatedMinutes ?? 30), 0);
      return sum + mins;
    }, 0) ?? 0;

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const daysLeft = plan
    ? Math.max(0, Math.ceil((new Date(plan.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const diff = plan ? difficultyConfig[plan.difficulty] ?? difficultyConfig.medium : difficultyConfig.medium;

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
          {/* ── Hero Card ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-emerald-500/8 via-transparent to-teal-500/5 p-6 sm:p-8"
          >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-teal-500/5 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {plan.subject}
                  </h1>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${diff.color}`}>
                    {diff.label}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {new Date(plan.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                    {new Date(plan.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                    </svg>
                    {plan.days.length} days
                  </span>
                  <span className={`flex items-center gap-1.5 ${daysLeft <= 2 ? "text-red-400" : daysLeft <= 5 ? "text-amber-400" : ""}`}>
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {daysLeft}d left
                  </span>
                </div>
              </div>

              {/* Progress ring */}
              <div className="flex shrink-0 items-center gap-4">
                <div className="relative flex size-20 items-center justify-center">
                  <svg className="size-20 -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-white/5"
                    />
                    <motion.circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke="url(#progress-gradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - progress / 100) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-foreground">{progress}%</span>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">{completedTasks}/{totalTasks}</p>
                  <p>tasks done</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Stats Grid ──────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Total Tasks",
                value: totalTasks,
                icon: (
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                ),
                color: "text-emerald-400",
              },
              {
                label: "Completed",
                value: completedTasks,
                icon: (
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: "text-teal-400",
              },
              {
                label: "Study Time",
                value: `${Math.round(totalMinutes / 60)}h`,
                icon: (
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: "text-amber-400",
              },
              {
                label: "Topics",
                value: plan.topics?.length ?? 0,
                icon: (
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                ),
                color: "text-violet-400",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-strong rounded-xl p-4"
              >
                <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Topics ──────────────────────────────────── */}
          {plan.topics && plan.topics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl p-5 sm:p-6"
            >
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                📚 Topics Covered
              </h2>
              <div className="flex flex-wrap gap-2">
                {plan.topics.map((topic, i) => (
                  <motion.span
                    key={topic}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + i * 0.03 }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-foreground"
                  >
                    {topic}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Timeline ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              📅 Study Schedule
            </h2>
            <PlanTimeline days={plan.days} planId={plan._id} />
          </motion.div>
        </>
      )}
    </div>
  );
}
