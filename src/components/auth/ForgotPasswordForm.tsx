"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineArrowLeft } from "react-icons/hi2";

import {
  forgotPasswordSchema,
  otpSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type OtpInput,
  type ResetPasswordInput,
} from "./auth-schemas";
import {
  useForgotPassword,
  useVerifyForgotOtp,
  useResetPassword,
  useResendOtp,
} from "@/src/hooks/useAuth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type Step = 1 | 2 | 3;
const RESEND_COOLDOWN = 60;

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  const { mutate: forgotPassword, isPending: isSendingOtp } = useForgotPassword();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyForgotOtp();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  /* ── Countdown timer ──────────────────────────────────── */
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendOtp = useCallback(() => {
    if (countdown > 0 || isResending) return;
    resendOtp(
      { email },
      {
        onSettled: () => {
          setCountdown(RESEND_COOLDOWN);
        },
      }
    );
  }, [email, countdown, isResending, resendOtp]);

  /* ── Forms ────────────────────────────────────────────── */
  const emailForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  /* ── Handlers ─────────────────────────────────────────── */
  const onEmailSubmit = (data: ForgotPasswordInput) => {
    forgotPassword(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep(2);
        setCountdown(RESEND_COOLDOWN);
      },
    });
  };

  const onOtpSubmit = (data: OtpInput) => {
    verifyOtp(
      { email, otp: data.otp },
      { onSuccess: () => setStep(3) }
    );
  };

  const onResetSubmit = (data: ResetPasswordInput) => {
    resetPassword({ email, newPassword: data.password });
  };

  return (
    <div className="w-full">
      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-center gap-2"
      >
        {[1, 2, 3].map((s) => (
          <motion.div
            key={s}
            initial={{ scale: 0.8 }}
            animate={{ scale: step >= s ? 1 : 0.8 }}
            className={cn(
              "flex h-2 w-16 items-center",
              s === 1
                ? "rounded-l-lg"
                : s === 3
                  ? "rounded-r-lg"
                  : "",
              step >= s ? "bg-primary" : "bg-white/10"
            )}
          />
        ))}
        <motion.span
          key="label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap"
        >
          {step === 1 ? "Find Account" : step === 2 ? "Verify OTP" : "New Password"}
        </motion.span>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Enter Email */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6 text-center">
              <p className="text-muted-foreground">
                Enter your email address and we&apos;ll send you a verification code.
              </p>
            </div>

            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@university.edu"
                          autoComplete="email"
                          {...field}
                          disabled={isSendingOtp}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.button
                  type="submit"
                  disabled={isSendingOtp}
                  className={cn(buttonVariants({ size: "lg", className: "w-full" }), "group")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <AnimatePresence mode="wait">
                    {isSendingOtp ? (
                      <motion.span key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-center gap-2">
                        <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                        Sending code...
                      </motion.span>
                    ) : (
                      <motion.span key="default" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        Send Verification Code
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </Form>
          </motion.div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6 text-center">
              <p className="text-muted-foreground">We sent a 6-digit code to</p>
              <p className="font-medium text-foreground">{email}</p>
            </div>

            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-5">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="123456"
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          maxLength={6}
                          {...field}
                          disabled={isVerifying}
                          className="text-center text-2xl tracking-widest"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.button
                  type="submit"
                  disabled={isVerifying}
                  className={cn(buttonVariants({ size: "lg", className: "w-full" }), "group")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <AnimatePresence mode="wait">
                    {isVerifying ? (
                      <motion.span key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-center gap-2">
                        <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                        Verifying...
                      </motion.span>
                    ) : (
                      <motion.span key="default" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        Verify Code
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Resend OTP */}
                <div className="text-center text-sm text-muted-foreground">
                  {countdown > 0 ? (
                    <p>Resend code in <span className="font-medium text-foreground">{countdown}s</span></p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-primary hover:underline font-medium transition-colors"
                    >
                      {isResending ? "Sending..." : "Resend OTP"}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isVerifying}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
                >
                  <HiOutlineArrowLeft className="size-4" />
                  Back
                </button>
              </form>
            </Form>
          </motion.div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6 text-center">
              <p className="text-muted-foreground">Enter your new password below.</p>
            </div>

            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-5">
                {/* New Password */}
                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                            disabled={isResetting}
                            className="pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <HiOutlineEyeSlash className="size-5" /> : <HiOutlineEye className="size-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                          disabled={isResetting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.button
                  type="submit"
                  disabled={isResetting}
                  className={cn(buttonVariants({ size: "lg", className: "w-full" }), "group")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <AnimatePresence mode="wait">
                    {isResetting ? (
                      <motion.span key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-center gap-2">
                        <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                        Resetting password...
                      </motion.span>
                    ) : (
                      <motion.span key="default" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        Reset Password
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to login link */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/auth/login"
          className="text-primary hover:underline font-medium transition-colors inline-flex items-center gap-1"
        >
          <HiOutlineArrowLeft className="size-3.5" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
