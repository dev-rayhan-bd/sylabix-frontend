"use client";

import { useToggleTask } from "@/src/hooks/useStudyPlans";

export function TaskCheckbox({
  planId,
  day,
  taskIndex,
  completed,
  task,
}: {
  planId: string;
  day: number;
  taskIndex: number;
  completed: boolean;
  task: string;
}) {
  const toggleTask = useToggleTask(planId);

  return (
    <button
      onClick={() => toggleTask.mutate({ day, taskIndex })}
      disabled={toggleTask.isPending}
      className="group flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/3"
    >
      <div
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
          completed
            ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
            : "border-white/20 group-hover:border-emerald-500/50"
        }`}
      >
        {completed && (
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span
        className={`text-sm leading-relaxed ${
          completed
            ? "text-muted-foreground line-through"
            : "text-foreground"
        }`}
      >
        {task}
      </span>
    </button>
  );
}
