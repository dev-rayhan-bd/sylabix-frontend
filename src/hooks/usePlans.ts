"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "@/src/services/api";
import { toast } from "sonner";

/* ─── Types ─────────────────────────────────────────────── */

export type StudyPlan = {
  id: string;
  title: string;
  description?: string;
  progress: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

/* ─── Keys ──────────────────────────────────────────────── */

const PLANS_KEY = ["study-plans"] as const;

/* ─── Hooks ─────────────────────────────────────────────── */

export function usePlans() {
  return useQuery({
    queryKey: PLANS_KEY,
    queryFn: () => get<StudyPlan[]>("/plans"),
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: [...PLANS_KEY, id],
    queryFn: () => get<StudyPlan>(`/plans/${id}`),
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<StudyPlan>) =>
      post<StudyPlan>("/plans", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANS_KEY });
      toast.success("Study plan created!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<StudyPlan> & { id: string }) =>
      put<StudyPlan>(`/plans/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANS_KEY });
      toast.success("Study plan updated.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => del(`/plans/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANS_KEY });
      toast.success("Study plan deleted.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
