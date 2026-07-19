"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore, type User } from "@/src/store/auth-store";
import { post, postFormData, get, patchFormData, del } from "@/src/services/api";
import { toast } from "sonner";
import type { AxiosError } from "axios";

/* ─── Types ─────────────────────────────────────────────── */

type LoginPayload = { email: string; password: string };
type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  institution: string;
  image?: File | null;
};
type OtpVerifyPayload = { email: string; otp: string };
type ResendOtpPayload = { email: string };
type ForgotPasswordPayload = { email: string };
type ResetPasswordPayload = { email: string; newPassword: string };

/** Actual shape returned by the backend */
type ApiUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  avatar?: string;
  createdAt?: string;
  [key: string]: unknown;
};

/** Auth response with tokens (login, verify OTP) */
type AuthResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
    user: ApiUser;
  };
};

/** Simple message response (forgot password, reset password, resend OTP) */
type MessageResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: { message?: string };
};

/** Register returns user directly (no tokens) */
type RegisterResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: ApiUser;
};

/** Map backend user to our User type */
function mapUser(apiUser: ApiUser): User {
  return {
    id: apiUser._id,
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    email: apiUser.email,
    avatar: apiUser.image ?? apiUser.avatar,
    createdAt: apiUser.createdAt,
  };
}

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

/* ─── Login ─────────────────────────────────────────────── */

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      post<AuthResponse>("/auth/login", payload),
    onSuccess: (res) => {
      setAuth(mapUser(res.data.user), res.data.accessToken);
      toast.success("Welcome back!");
      router.push("/dashboard");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Login failed. Please try again."));
    },
  });
}

/* ─── Register ──────────────────────────────────────────── */
// Register API returns the user object directly (no tokens).
// Tokens come after OTP verification via useVerifyOtp.

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => {
      const { image, ...jsonData } = payload;
      return postFormData<RegisterResponse>("/auth/register", jsonData, image);
    },
    onSuccess: () => {
      toast.success("Account created! Please verify your email.");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Registration failed. Please try again."));
    },
  });
}

/* ─── OTP Verification (Registration) ───────────────────── */

export function useVerifyOtp() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: OtpVerifyPayload) =>
      post<AuthResponse>("/auth/regOtpVerify", payload),
    onSuccess: (res) => {
      setAuth(mapUser(res.data.user), res.data.accessToken);
      toast.success("Email verified! Welcome to Syllabix.");
      router.push("/dashboard");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Invalid or expired code. Please try again."));
    },
  });
}

/* ─── Resend OTP ────────────────────────────────────────── */

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) =>
      post<MessageResponse>("/auth/resendOtp", payload),
    onSuccess: (res) => {
      toast.success(res.message || "OTP resent successfully!");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Failed to resend OTP. Please try again."));
    },
  });
}

/* ─── Forgot Password (send OTP) ───────────────────────── */

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      post<MessageResponse>("/auth/forgotPass", payload),
    onSuccess: (res) => {
      toast.success(res.message || "OTP sent to your email!");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Failed to send OTP. Please try again."));
    },
  });
}

/* ─── Verify OTP (Forgot Password) ──────────────────────── */

export function useVerifyForgotOtp() {
  return useMutation({
    mutationFn: (payload: OtpVerifyPayload) =>
      post<MessageResponse>("/auth/verifyOtp", payload),
    onSuccess: (res) => {
      toast.success(res.message || "OTP verified!");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Invalid or expired code. Please try again."));
    },
  });
}

/* ─── Reset Password ────────────────────────────────────── */

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      post<MessageResponse>("/auth/resetPass", payload),
    onSuccess: (res) => {
      toast.success(res.message || "Password reset successful!");
      router.push("/auth/login");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Failed to reset password. Please try again."));
    },
  });
}

/* ─── Logout ────────────────────────────────────────────── */

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return () => {
    logout();
    toast.success("Logged out successfully.");
  };
}

/* ─── Profile ─────────────────────────────────────────── */

type ProfileResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: ApiUser;
};

export type EditProfilePayload = {
  firstName?: string;
  lastName?: string;
  institution?: string;
  image?: File | null;
};

export function useMyProfile(enabled = true) {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: () => get<ProfileResponse>("/user/my-profile"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (payload: EditProfilePayload) => {
      const { image, ...jsonData } = payload;
      return patchFormData<ProfileResponse>("/user/edit-profile", jsonData, image);
    },
    onSuccess: (res) => {
      const updated = mapUser(res.data);
      updateUser(updated);
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Failed to update profile."));
    },
  });
}

export function useDeleteAccount() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => del<MessageResponse>("/user/delete-account"),
    onSuccess: () => {
      logout();
      toast.success("Account deleted. We\'re sorry to see you go.");
      router.push("/");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Failed to delete account."));
    },
  });
}
