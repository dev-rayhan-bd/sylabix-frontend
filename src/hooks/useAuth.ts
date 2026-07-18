"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore, type User } from "@/src/store/auth-store";
import { post } from "@/src/services/api";
import { toast } from "sonner";

/* ─── Types ─────────────────────────────────────────────── */

type LoginPayload = { email: string; password: string };
type RegisterPayload = { name: string; email: string; password: string };
type AuthResponse = { user: User; token: string };

/* ─── Login ─────────────────────────────────────────────── */

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      post<AuthResponse>("/auth/login", payload),
    onSuccess: (res) => {
      setAuth(res.user, res.token);
      toast.success("Welcome back!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Login failed. Please try again.");
    },
  });
}

/* ─── Register ──────────────────────────────────────────── */

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      post<AuthResponse>("/auth/register", payload),
    onSuccess: (res) => {
      setAuth(res.user, res.token);
      toast.success("Account created successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Registration failed. Please try again.");
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
