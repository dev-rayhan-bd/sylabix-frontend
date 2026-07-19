"use client";

import { motion } from "framer-motion";
import { TaskCheckbox } from "./TaskCheckbox";
import type { DayPlan, DayTask } from "@/src/hooks/useStudyPlans";

const sessionConfig = {
  Morning: { icon: "☀️", label: "Morning Session", color: "from-amber-500/10 to-amber-500/5 border-amber-500/20", dot: "bg-amber-400" },
  Afternoon: { icon: "🌤️", label: "Afternoon Session", color: "from-sky-500/10 to-sky-500/5 border-sky-500/20", dot: "bg-sky-400" },
  Evening: { icon: "🌙", label: "Evening Session", color: "from-violet-500/10 to-violet-500/5 border-violet-500/20", dot: "bg-violet-400" },
} as const;

function SessionBlock({
  session,
  topic,
  tasks,
  planId,
  day,
  startIndex,
}: {
  session: "Morning" | "Afternoon" | "Evening";
  topic?: string;
  tasks: DayTask[];
  planId: string;
  day: number;
  startIndex: number;
}) {
  if (tasks.length === 0) return null;
  const config = sessionConfig[session];
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalMinutes = tasks.reduce((s, t) => s + (t.estimatedMinutes ?? 30), 0);
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative overflow-hidden rounded-xl border bg-linear-to-br p-4 ${config.color}`}
    >
      {/* Session header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{config.icon}</span>
          <span className="text-sm font-semibold text-foreground">
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {totalMinutes} min
          </span>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{tasks.length}
          </span>
        </div>
      </div>

      {/* Topic label */}
      {topic && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
          <div className={`size-1.5 rounded-full ${config.dot}`} />
          <span className="text-xs font-medium text-muted-foreground">
            {topic}
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400"
        />
      </div>

      {/* Tasks */}
      <div className="space-y-0.5">
        {tasks.map((task, idx) => (
          <TaskCheckbox
            key={`${planId}-${day}-${startIndex + idx}`}
            planId={planId}
            day={day}
            taskIndex={startIndex + idx}
            completed={task.completed}
            task={task.task}
            estimatedMinutes={task.estimatedMinutes}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function PlanTimeline({
  days,
  planId,
}: {
  days: DayPlan[];
  planId: string;
}) {
  return (
    <div className="relative space-y-1">
      {days.map((day, dayIdx) => {
        const allTasks = [
          ...day.sessions.Morning.tasks,
          ...day.sessions.Afternoon.tasks,
          ...day.sessions.Evening.tasks,
        ];
        const completed = allTasks.filter((t) => t.completed).length;
        const totalMinutes = allTasks.reduce((s, t) => s + (t.estimatedMinutes ?? 30), 0);
        const dayProgress = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;

        return (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIdx * 0.05 }}
            className="relative pl-10"
          >
            {/* Timeline connector */}
            <div className="absolute left-3.25 top-0 bottom-0 w-px bg-linear-to-b from-emerald-500/30 via-white/10 to-transparent" />

            {/* Day dot */}
            <div
              className={`absolute left-0 top-1.5 flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                dayProgress === 100
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : dayProgress > 0
                    ? "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30"
                    : "bg-white/10 text-muted-foreground"
              }`}
            >
              {dayProgress === 100 ? (
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                day.day
              )}
            </div>

            <div className="space-y-3 rounded-2xl bg-white/3 p-5 pb-6">
              {/* Day header */}
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold text-foreground">
                  Day {day.day}
                </h3>
                {day.isRevisionDay && (
                  <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-violet-400">
                    🔄 Revision
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{totalMinutes} min</span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px]">
                    {completed}/{allTasks.length}
                  </span>
                </span>
              </div>

              {/* Day progress */}
              <div className="h-1 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dayProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: dayIdx * 0.05 + 0.2 }}
                  className={`h-full rounded-full ${
                    dayProgress === 100
                      ? "bg-emerald-500"
                      : "bg-linear-to-r from-emerald-500/60 to-teal-400/60"
                  }`}
                />
              </div>

              {/* Sessions */}
              <SessionBlock
                session="Morning"
                topic={day.sessions.Morning.topic}
                tasks={day.sessions.Morning.tasks}
                planId={planId}
                day={day.day}
                startIndex={0}
              />
              <SessionBlock
                session="Afternoon"
                topic={day.sessions.Afternoon.topic}
                tasks={day.sessions.Afternoon.tasks}
                planId={planId}
                day={day.day}
                startIndex={day.sessions.Morning.tasks.length}
              />
              <SessionBlock
                session="Evening"
                topic={day.sessions.Evening.topic}
                tasks={day.sessions.Evening.tasks}
                planId={planId}
                day={day.day}
                startIndex={
                  day.sessions.Morning.tasks.length +
                  day.sessions.Afternoon.tasks.length
                }
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
