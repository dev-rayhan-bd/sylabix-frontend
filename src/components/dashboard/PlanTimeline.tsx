"use client";

import { motion } from "framer-motion";
import { TaskCheckbox } from "./TaskCheckbox";
import type { DayPlan } from "@/src/hooks/useStudyPlans";

const sessionConfig = {
  Morning: { icon: "☀️", color: "from-amber-500/10 to-amber-500/5 border-amber-500/20" },
  Afternoon: { icon: "🌤️", color: "from-sky-500/10 to-sky-500/5 border-sky-500/20" },
  Evening: { icon: "🌙", color: "from-violet-500/10 to-violet-500/5 border-violet-500/20" },
} as const;

function SessionBlock({
  session,
  tasks,
  planId,
  day,
  startIndex,
}: {
  session: "Morning" | "Afternoon" | "Evening";
  tasks: { task: string; completed: boolean }[];
  planId: string;
  day: number;
  startIndex: number;
}) {
  if (tasks.length === 0) return null;
  const config = sessionConfig[session];
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div
      className={`rounded-xl border bg-linear-to-br p-4 ${config.color}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          {config.icon} {session}
        </span>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{tasks.length}
        </span>
      </div>
      <div className="space-y-0.5">
        {tasks.map((task, idx) => (
          <TaskCheckbox
            key={`${planId}-${day}-${startIndex + idx}`}
            planId={planId}
            day={day}
            taskIndex={startIndex + idx}
            completed={task.completed}
            task={task.task}
          />
        ))}
      </div>
    </div>
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
    <div className="space-y-6">
      {days.map((day, dayIdx) => {
        const allTasks = [
          ...day.sessions.Morning,
          ...day.sessions.Afternoon,
          ...day.sessions.Evening,
        ];
        const completed = allTasks.filter((t) => t.completed).length;

        return (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIdx * 0.05 }}
            className="relative pl-8"
          >
            {/* Timeline connector */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
            <div className="absolute left-0 top-1 flex size-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
              {day.day}
            </div>

            <div className="space-y-3 pb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold text-foreground">
                  Day {day.day}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="ml-auto rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                  {completed}/{allTasks.length} done
                </span>
              </div>

              <SessionBlock
                session="Morning"
                tasks={day.sessions.Morning}
                planId={planId}
                day={day.day}
                startIndex={0}
              />
              <SessionBlock
                session="Afternoon"
                tasks={day.sessions.Afternoon}
                planId={planId}
                day={day.day}
                startIndex={day.sessions.Morning.length}
              />
              <SessionBlock
                session="Evening"
                tasks={day.sessions.Evening}
                planId={planId}
                day={day.day}
                startIndex={
                  day.sessions.Morning.length +
                  day.sessions.Afternoon.length
                }
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
