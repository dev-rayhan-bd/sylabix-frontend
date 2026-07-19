import { z } from "zod";

/* ─── Create Study Plan ─────────────────────────────── */

export const createPlanSchema = z
  .object({
    subject: z.string().min(2, "Subject must be at least 2 characters"),
    startDate: z.string().min(1, "Start date is required"),
    examDate: z.string().min(1, "Exam date is required"),
    difficulty: z.enum(["Easy", "Medium", "Hard"], {
      message: "Select a difficulty level",
    }),
  })
  .refine(
    (data) => new Date(data.examDate) > new Date(data.startDate),
    { message: "Exam date must be after start date", path: ["examDate"] }
  );

export type CreatePlanInput = z.infer<typeof createPlanSchema>;

/* ─── Chat / Ask Question ───────────────────────────── */

export const chatSchema = z.object({
  planId: z.string().min(1, "Select a syllabus"),
  question: z.string().min(3, "Question must be at least 3 characters"),
});

export type ChatInput = z.infer<typeof chatSchema>;
