"use client";

import { useState, useEffect, useCallback } from "react";
import { HiOutlineCamera } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineArrowLeft } from "react-icons/hi2";

import { registerSchema, otpSchema, type RegisterInput, type OtpInput } from "./auth-schemas";
import { useRegister, useVerifyOtp, useResendOtp } from "@/src/hooks/useAuth";
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

type Step = 1 | 2;
const RESEND_COOLDOWN = 60; // seconds

export function RegisterForm() {
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutate: register, isPending: isRegistering } = useRegister();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
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

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      institution: "",
    },
  });

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onRegisterSubmit = (data: RegisterInput) => {
    register({ ...data, image: imageFile ?? undefined }, {
      onSuccess: () => {
        setEmail(data.email);
        setStep(2);
        setCountdown(RESEND_COOLDOWN);
      },
    });
  };

  const onOtpSubmit = (data: OtpInput) => {
    verifyOtp({ email, otp: data.otp });
  };

  const goBack = () => {
    if (step === 2) setStep(1);
  };

  return (
    <div className="w-full">
      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-center gap-2"
      >
        {[1, 2].map((s) => (
          <motion.div
            key={s}
            initial={{ scale: 0.8 }}
            animate={{ scale: step >= s ? 1 : 0.8 }}
            className={cn(
              "flex h-2 w-24 items-center",
              s === 1 ? "rounded-l-lg" : "rounded-r-lg",
              step >= s ? "bg-primary" : "bg-white/10"
            )}
          />
        ))}
        <motion.span
          key="label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground"
        >
          {step === 1 ? "Create Account" : "Verify Email"}
        </motion.span>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Registration Form */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                {/* Name Row */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" autoComplete="given-name" {...field} disabled={isRegistering} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" autoComplete="family-name" {...field} disabled={isRegistering} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@university.edu" autoComplete="email" {...field} disabled={isRegistering} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Institution */}
                <FormField
                  control={registerForm.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="University of Technology" autoComplete="organization" {...field} disabled={isRegistering} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                            disabled={isRegistering}
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
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" {...field} disabled={isRegistering} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Profile Image (optional) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Photo (optional)</label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-white/10 bg-white/5">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="size-full object-cover" />
                      ) : (
                        <HiOutlineCamera className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
                        <HiOutlineCamera className="size-4" />
                        <span>{imageFile ? imageFile.name : "Choose a photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isRegistering}
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setImageFile(file);
                            setImagePreview(file ? URL.createObjectURL(file) : null);
                          }}
                        />
                      </label>
                      {imageFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="mt-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isRegistering}
                  className={cn(buttonVariants({ size: "lg", className: "w-full" }), "group")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <AnimatePresence mode="wait">
                    {isRegistering ? (
                      <motion.span key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-center gap-2">
                        <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                        Creating account...
                      </motion.span>
                    ) : (
                      <motion.span key="default" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        Create Account
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </Form>
          </motion.div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
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
                        Verify & Continue
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
                  onClick={goBack}
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
      </AnimatePresence>
    </div>
  );
}