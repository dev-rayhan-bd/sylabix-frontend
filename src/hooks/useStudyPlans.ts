"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api, { post, get, del } from "@/src/services/api";
import { toast } from "sonner";
import type { AxiosError } from "axios";

/* ─── Types ─────────────────────────────────────────────── */

export type DayTask = {
  task: string;
  completed: boolean;
};

export type DayPlan = {
  day: number;
  date: string;
  sessions: {
    Morning: DayTask[];
    Afternoon: DayTask[];
    Evening: DayTask[];
  };
};

export type StudyPlan = {
  _id: string;
  subject: string;
  startDate: string;
  examDate: string;
  difficulty: string;
  days: DayPlan[];
  createdAt: string;
};

export type DashboardSummary = {
  overallProgress: number;
  todayTasksCount: number;
  nextExamCountdown: string;
  totalPlans: number;
};

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

/* ─── API Response wrappers ──────────────────────────────── */

type PlansResponse = {
  success: boolean;
  data: StudyPlan[];
};

type PlanResponse = {
  success: boolean;
  data: StudyPlan;
};

type DashboardResponse = {
  success: boolean;
  data: DashboardSummary;
};

type TodayTasksResponse = {
  success: boolean;
  data: TodayTask[];
};

type CreatePlanResponse = {
  success: boolean;
  message: string;
  data: StudyPlan;
};

type ChatResponse = {
  success: boolean;
  data: {
    answer: string;
    sources: string[];
  };
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
          headers: { "Content-Type": "multipart/form-data" },
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
    queryFn: () => get<PlansResponse>("/study-plans/my-plans"),
  });
}

/* ─── Plan Detail ───────────────────────────────────────── */

export function usePlanDetail(id: string) {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: () => get<PlanResponse>(`/study-plans/my-plans/${id}`),
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
    mutationFn: (payload: { day: number; taskIndex: number }) =>
      api
        .patch<{ success: boolean; data: StudyPlan }>(
          `/study-plans/toggle-task/${planId}`,
          payload
        )
        .then((res) => res.data),
    onMutate: async (payload) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["plan", planId] });
      const previous = queryClient.getQueryData<PlanResponse>(["plan", planId]);

      if (previous) {
        queryClient.setQueryData<PlanResponse>(["plan", planId], (old) => {
          if (!old) return old;
          const updated = JSON.parse(JSON.stringify(old)) as PlanResponse;
          const dayPlan = updated.data.days.find(
            (d) => d.day === payload.day
          );
          if (dayPlan) {
            const allTasks = [
              ...dayPlan.sessions.Morning,
              ...dayPlan.sessions.Afternoon,
              ...dayPlan.sessions.Evening,
            ];
            const task = allTasks[payload.taskIndex];
            if (task) task.completed = !task.completed;
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

export function useChat() {
  return useMutation({
    mutationFn: (payload: { planId: string; question: string }) =>
      post<ChatResponse>("/chat/ask-question", payload),
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Failed to get answer."));
    },
  });
}
