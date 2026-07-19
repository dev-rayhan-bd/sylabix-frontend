"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api, { post, get, del } from "@/src/services/api";
import { toast } from "sonner";
import type { AxiosError } from "axios";

/* ─── Types ─────────────────────────────────────────────── */

/** Raw task returned by the API (inside aiPlan sessions) */
export type ApiAiPlanTask = {
  _id?: string;
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
};

/** One session entry in the API's flat aiPlan array */
export type ApiAiPlanSession = {
  day: number;
  session: "Morning" | "Afternoon" | "Evening";
  topic: string;
  tasks: ApiAiPlanTask[];
  isRevisionDay: boolean;
};

/** Shape of a single plan object as it comes from the API */
export type ApiStudyPlanData = {
  _id: string;
  user: string;
  subject: string;
  examDate: string;
  difficulty: string;
  topics: string[];
  aiPlan: ApiAiPlanSession[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

/* ─── Normalised types (used by UI) ──────────────────── */

export type DayTask = {
  taskId?: string;
  task: string;
  completed: boolean;
  estimatedMinutes?: number;
};

export type DayPlan = {
  day: number;
  date: string;
  sessions: {
    Morning: { topic?: string; tasks: DayTask[] };
    Afternoon: { topic?: string; tasks: DayTask[] };
    Evening: { topic?: string; tasks: DayTask[] };
  };
  isRevisionDay?: boolean;
};

export type StudyPlan = {
  _id: string;
  subject: string;
  startDate: string;
  examDate: string;
  difficulty: string;
  days: DayPlan[];
  topics?: string[];
  createdAt: string;
};

/* ─── Transformer: API → UI format ─────────────────────── */

export function transformPlanData(api: ApiStudyPlanData): StudyPlan {
  const dayMap = new Map<number, ApiAiPlanSession[]>();
  for (const s of api.aiPlan) {
    if (!dayMap.has(s.day)) dayMap.set(s.day, []);
    dayMap.get(s.day)!.push(s);
  }

  const maxDay = Math.max(...dayMap.keys(), 1);
  const examDate = new Date(api.examDate);
  const startDate = new Date(examDate);
  startDate.setDate(startDate.getDate() - maxDay);

  const days: DayPlan[] = Array.from(dayMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([dayNum, sessions]) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayNum - 1);

      const findSession = (
        name: "Morning" | "Afternoon" | "Evening"
      ): { topic?: string; tasks: DayTask[] } => {
        const s = sessions.find((x) => x.session === name);
        if (!s) return { topic: undefined, tasks: [] };
        return {
          topic: s.topic,
          tasks: s.tasks.map((t) => ({
            taskId: t._id,
            task: t.title,
            completed: t.isCompleted,
            estimatedMinutes: t.estimatedMinutes,
          })),
        };
      };

      return {
        day: dayNum,
        date: date.toISOString(),
        sessions: {
          Morning: findSession("Morning"),
          Afternoon: findSession("Afternoon"),
          Evening: findSession("Evening"),
        },
        isRevisionDay: sessions.some((s) => s.isRevisionDay),
      };
    });

  return {
    _id: api._id,
    subject: api.subject,
    startDate: startDate.toISOString(),
    examDate: api.examDate,
    difficulty: api.difficulty,
    days,
    topics: api.topics,
    createdAt: api.createdAt,
  };
}

export type DashboardSummaryTask = {
  title: string;
  isCompleted: boolean;
};

export type DashboardTodayTaskGroup = {
  planId: string;
  subject: string;
  day: number;
  topic: string;
  tasks: DashboardSummaryTask[];
};

export type DashboardNextExam = {
  subject: string;
  daysLeft: number;
};

export type DashboardTotalStats = {
  activePlans: number;
  completedPlans: number;
  totalPlans: number;
  totalTasksCompleted: number;
};

export type DashboardSummary = {
  todaysTasks: DashboardTodayTaskGroup[];
  overallProgress: number;
  nextExam: DashboardNextExam;
  totalStats: DashboardTotalStats;
};

/** Flattened task used by the Today's Focus UI */
export type TodayTask = {
  planId: string;
  planSubject: string;
  day: number;
  session: string;
  taskIndex: number;
  task: string;
  completed: boolean;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

export type SyllabusOption = {
  _id: string;
  subject: string;
};

/* ─── API Response wrappers ──────────────────────────────── */

type PlansResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    meta: { page: number; limit: number; total: number; totalPage: number };
    result: ApiStudyPlanData[];
  };
};

type PlanResponse = {
  success: boolean;
  data: ApiStudyPlanData;
};

type DashboardResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: DashboardSummary;
};

type TodayTasksResponse = {
  success: boolean;
  data: TodayTask[];
};

type CreatePlanResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: ApiStudyPlanData;
};

type ChatResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    answer: string;
    sources: string[];
  };
};

type SyllabusDropdownResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: SyllabusOption[];
};

/* ─── Helper ────────────────────────────────────────────── */

function getErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as AxiosError<{ message?: string; error?: string }>;
  return (
    axiosErr?.response?.data?.message ??
    axiosErr?.response?.data?.error ??
    axiosErr?.message ??
    fallback
  );
}

/* ─── Dashboard Summary ─────────────────────────────────── */

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => get<DashboardResponse>("/study-plans/dashboard/summary"),
    staleTime: 60_000,
  });
}

/* ─── Today's Focus ────────────────────────────────────── */

export function useTodayTasks() {
  return useQuery({
    queryKey: ["today-tasks"],
    queryFn: () => get<TodayTasksResponse>("/study-plans/dashboard/today"),
    staleTime: 60_000,
  });
}

/* ─── Create Study Plan (multipart/form-data) ───────────── */

export function useCreatePlan() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: { jsonData: Record<string, unknown>; pdfFile: File }) => {
      const formData = new FormData();
      formData.append("body", JSON.stringify(payload.jsonData));
      formData.append("syllabus", payload.pdfFile);
      return api
        .post<CreatePlanResponse>("/study-plans/create-plan", formData, {
          timeout: 180_000,
          headers: { "Content-Type": "multipart/form-data" },
          // Note: axios auto-sets boundary when Content-Type is multipart/form-data with FormData body
        })
        .then((res) => res.data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["my-plans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success(res.message || "Study plan created!");
      router.push(`/dashboard/my-plans/${res.data._id}`);
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Failed to create plan."));
    },
  });
}

/* ─── My Plans List ─────────────────────────────────────── */

export function useMyPlans() {
  return useQuery({
    queryKey: ["my-plans"],
    queryFn: async () => {
      const res = await get<PlansResponse>("/study-plans/my-plans");
      const list = Array.isArray(res.data?.result) ? res.data.result : [];
      return { plans: list.map(transformPlanData) };
    },
  });
}

/* ─── Plan Detail ───────────────────────────────────────── */

export function usePlanDetail(id: string) {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await get<PlanResponse>(`/study-plans/my-plans/${id}`);
      return { ...res, data: transformPlanData(res.data) };
    },
    enabled: !!id,
  });
}

/* ─── Delete Plan ───────────────────────────────────────── */

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      del<{ success: boolean; message: string }>(
        `/study-plans/my-plans/${id}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-plans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Plan deleted.");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Failed to delete plan."));
    },
  });
}

/* ─── Toggle Task ───────────────────────────────────────── */

export function useToggleTask(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { taskId: string }) =>
      api
        .patch<{ success: boolean; data: StudyPlan }>(
          `/study-plans/toggle-task/${planId}`,
          payload
        )
        .then((res) => res.data),
    onMutate: async (payload) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["plan", planId] });
      const previous = queryClient.getQueryData<{ success: boolean; data: StudyPlan }>(["plan", planId]);

      if (previous) {
        queryClient.setQueryData<{ success: boolean; data: StudyPlan }>(["plan", planId], (old) => {
          if (!old) return old;
          const updated = JSON.parse(JSON.stringify(old)) as { success: boolean; data: StudyPlan };
          for (const dayPlan of updated.data.days) {
            const allTasks = [
              ...dayPlan.sessions.Morning.tasks,
              ...dayPlan.sessions.Afternoon.tasks,
              ...dayPlan.sessions.Evening.tasks,
            ];
            const task = allTasks.find((t) => t.taskId === payload.taskId);
            if (task) {
              task.completed = !task.completed;
              break;
            }
          }
          return updated;
        });
      }

      return { previous };
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["plan", planId], context.previous);
      }
      toast.error("Failed to update task.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["today-tasks"] });
    },
  });
}

/* ─── RAG Chat ──────────────────────────────────────────── */

export function useSyllabusDropdown() {
  return useQuery({
    queryKey: ["syllabus-dropdown"],
    queryFn: () => get<SyllabusDropdownResponse>("/study-plans/dropdown/subjects"),
    staleTime: 300_000,
  });
}

export function useChat() {
  return useMutation({
    mutationFn: (payload: { syllabusId: string; question: string }) =>
      post<ChatResponse>("/chat/ask-question", payload),
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Failed to get answer."));
    },
  });
}
