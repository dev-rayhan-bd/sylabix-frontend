"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  createPlanSchema,
  type CreatePlanInput,
} from "@/src/lib/study-plan-schemas";
import { useCreatePlan } from "@/src/hooks/useStudyPlans";
import { PdfUpload } from "./PdfUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ─── AI Analysis Loading Animation ──────────────────────── */

function AiAnalysisLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 py-16"
    >
      {/* Pulsing brain icon */}
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.15, 0.3],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-emerald-500/20"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex size-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600"
        >
          <svg className="size-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </motion.div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">
          AI is analyzing your syllabus
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Creating a personalized study plan…
        </p>
      </div>

      {/* Animated progress steps */}
      <div className="flex w-full max-w-sm flex-col gap-3">
        {[
          "Extracting syllabus topics",
          "Calculating optimal schedule",
          "Building your study plan",
        ].map((text, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 2, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 2 + 0.3, type: "spring" }}
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 2 + 0.5 }}
              >
                <svg className="size-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </motion.div>
            <span className="text-sm text-muted-foreground">{text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Select Component (inline, since we don't have shadcn Select) ── */
/* We'll use a native select styled with Tailwind for simplicity */

function FormSelect({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value: string;
  onValueChange: (val: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#0a0f1a]">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/* ─── Create Plan Wizard ──────────────────────────────── */

export function CreatePlanWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreatePlanInput>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: { subject: "", startDate: "", examDate: "", difficulty: undefined },
  });

  const createPlan = useCreatePlan();

  const difficulty = watch("difficulty");

  const handleStep1 = async () => {
    const valid = await trigger(["subject", "startDate", "examDate", "difficulty"]);
    if (valid) setStep(2);
  };

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
    setPdfError("");
  };

  const onSubmit = (data: CreatePlanInput) => {
    if (!pdfFile) {
      setPdfError("Please upload a PDF syllabus");
      return;
    }
    setStep(3);
    createPlan.mutate({
      jsonData: {
        subject: data.subject,
        startDate: data.startDate,
        examDate: data.examDate,
        difficulty: data.difficulty,
      },
      pdfFile,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-3">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                step === 3
                  ? "bg-emerald-500 text-white"
                  : step >= s
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/5 text-muted-foreground"
              }`}
            >
              {step === 3 ? (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s
              )}
            </div>
            <span
              className={`text-sm ${
                step >= s ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s === 1 ? "Details" : "Upload Syllabus"}
            </span>
            {s < 2 && (
              <div
                className={`mx-2 h-px w-12 ${
                  step > s ? "bg-emerald-500/50" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 3 ? (
        <AiAnalysisLoader />
      ) : (
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-strong rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-xl font-semibold text-foreground">
                Study Plan Details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us about your study goals
              </p>

              <div className="mt-6 space-y-4">
                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Subject
                  </label>
                  <Input
                    placeholder="e.g. Mathematics, Physics, Biology"
                    className="rounded-xl border-white/10 bg-white/5"
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-400">{errors.subject.message}</p>
                  )}
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    className="rounded-xl border-white/10 bg-white/5"
                    {...register("startDate")}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-red-400">{errors.startDate.message}</p>
                  )}
                </div>

                {/* Exam Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Exam Date
                  </label>
                  <Input
                    type="date"
                    className="rounded-xl border-white/10 bg-white/5"
                    {...register("examDate")}
                  />
                  {errors.examDate && (
                    <p className="text-xs text-red-400">{errors.examDate.message}</p>
                  )}
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Difficulty
                  </label>
                  <FormSelect
                    value={difficulty}
                    onValueChange={(val) => setValue("difficulty", val as "Easy" | "Medium" | "Hard")}
                    placeholder="Select difficulty"
                    options={[
                      { value: "Easy", label: "🟢 Easy — Relaxed pace" },
                      { value: "Medium", label: "🟡 Medium — Balanced" },
                      { value: "Hard", label: "🔴 Hard — Intensive" },
                    ]}
                  />
                  {errors.difficulty && (
                    <p className="text-xs text-red-400">{errors.difficulty.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleStep1}
                className="mt-6 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Continue to Upload →
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-strong rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-xl font-semibold text-foreground">
                Upload Your Syllabus
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Our AI will analyze your PDF to generate a personalized plan
              </p>

              <div className="mt-6">
                <PdfUpload
                  onFileSelect={handleFileSelect}
                  error={pdfError}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="rounded-xl border-white/10 bg-white/5"
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={createPlan.isPending}
                  className="flex-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  {createPlan.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating…
                    </span>
                  ) : (
                    "Generate Study Plan ✨"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
