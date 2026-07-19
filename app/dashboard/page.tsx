"use client";

import { motion } from "framer-motion";
import {
  useDashboardSummary,
  useTodayTasks,
  useToggleTask,
} from "@/src/hooks/useStudyPlans";
import { useAuthStore } from "@/src/store/auth-store";
import {
  DashboardCardsSkeleton,
  TodayFocusSkeleton,
} from "@/src/components/dashboard/SkeletonLoaders";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 20 } },
};

/* ─── Summary Stat Cards ─────────────────────────────── */

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      variants={item}
      className="glass-strong relative overflow-hidden rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Dashboard Overview Page ────────────────────────── */

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: todayData, isLoading: todayLoading } = useTodayTasks();
  const toggleTask = useToggleTask("today");

  const summaryData = summary?.data;
  const todayTasks = todayData?.data ?? [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">
          {greeting()},{" "}
          <span className="text-gradient">{user?.name?.split(" ")[0] || "there"}</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s your study overview for today
        </p>
      </motion.div>

      {/* Summary Cards */}
      {summaryLoading ? (
        <DashboardCardsSkeleton />
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            label="Overall Progress"
            value={`${summaryData?.overallProgress ?? 0}%`}
            icon={
              <svg className="size-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            color="bg-emerald-500/10"
          />
          <StatCard
            label="Today's Tasks"
            value={summaryData?.todayTasksCount ?? 0}
            icon={
              <svg className="size-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            color="bg-blue-500/10"
          />
          <StatCard
            label="Next Exam"
            value={summaryData?.nextExamCountdown ?? "—"}
            icon={
              <svg className="size-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="bg-amber-500/10"
          />
          <StatCard
            label="Total Plans"
            value={summaryData?.totalPlans ?? 0}
            icon={
              <svg className="size-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            color="bg-violet-500/10"
          />
        </motion.div>
      )}

      {/* Today's Focus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Today&apos;s Focus
          </h2>
          <Link
            href="/dashboard/my-plans"
            className="text-sm text-emerald-400 transition-colors hover:text-emerald-300"
          >
            View all →
          </Link>
        </div>

        {todayLoading ? (
          <TodayFocusSkeleton />
        ) : todayTasks.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">
              No tasks for today. Enjoy your free time!
            </p>
            <Link
              href="/dashboard/create-plan"
              className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create a study plan
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task, idx) => (
              <motion.div
                key={`${task.planId}-${task.day}-${task.taskIndex}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 rounded-xl bg-white/3 px-4 py-3 transition-colors hover:bg-white/5"
              >
                <button
                  onClick={() =>
                    toggleTask.mutate({
                      day: task.day,
                      taskIndex: task.taskIndex,
                    })
                  }
                  className={`flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                    task.completed
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                      : "border-white/20 hover:border-emerald-500/50"
                  }`}
                >
                  {task.completed && (
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${
                      task.completed
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {task.task}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {task.planSubject} · {task.session}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Day {task.day}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
