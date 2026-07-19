"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useDeletePlan } from "@/src/hooks/useStudyPlans";
import type { StudyPlan } from "@/src/hooks/useStudyPlans";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 20 } },
};

function getPlanProgress(plan: StudyPlan): number {
  if (!plan.days || plan.days.length === 0) return 0;
  let total = 0;
  let completed = 0;
  for (const day of plan.days) {
    for (const session of Object.values(day.sessions)) {
      for (const task of session) {
        total++;
        if (task.completed) completed++;
      }
    }
  }
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

function getDaysLeft(examDate: string): string {
  const diff = Math.ceil(
    (new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Today";
  return `${diff}d left`;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-400",
  medium: "bg-amber-500/10 text-amber-400",
  hard: "bg-red-500/10 text-red-400",
};

export function PlanCard({ plan }: { plan: StudyPlan }) {
  const deletePlan = useDeletePlan();
  const progress = getPlanProgress(plan);
  const daysLeft = getDaysLeft(plan.examDate);

  return (
    <motion.div
      variants={item}
      className="glass-strong group relative flex flex-col rounded-2xl p-5 transition-all hover:bg-white/5"
    >
      <div className="flex items-start justify-between">
        <Link
          href={`/dashboard/my-plans/${plan._id}`}
          className="min-w-0 flex-1"
        >
          <h3 className="truncate text-lg font-semibold text-foreground">
            {plan.subject}
          </h3>
        </Link>
        <span
          className={`ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            difficultyColors[plan.difficulty] ?? "bg-white/10 text-muted-foreground"
          }`}
        >
          {plan.difficulty}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          {plan.days?.length ?? 0} days
        </span>
        <span
          className={
            daysLeft === "Overdue"
              ? "text-red-400"
              : daysLeft === "Today"
                ? "text-amber-400"
                : ""
          }
        >
          {daysLeft}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/dashboard/my-plans/${plan._id}`}
          className="flex-1 rounded-xl bg-white/5 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-white/10"
        >
          View Details
        </Link>
        <Dialog>
          <DialogTrigger
            render={
              <button className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400" />
            }
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-white/10 bg-[#0a0f1a]">
            <DialogHeader>
              <DialogTitle>Delete Plan?</DialogTitle>
              <DialogDescription>
                This will permanently delete <strong>{plan.subject}</strong> and all
                its tasks. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose
                render={
                  <Button variant="outline" className="rounded-xl border-white/10 bg-white/5" />
                }
              >
                Cancel
              </DialogClose>
              <DialogClose
                render={
                  <Button
                    className="rounded-xl bg-red-600 text-white hover:bg-red-500"
                  />
                }
                onClick={() => deletePlan.mutate(plan._id)}
              >
                Delete
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
