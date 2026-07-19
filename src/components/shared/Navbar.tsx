"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/src/store/auth-store";
import {
  useMyProfile,
  useUpdateProfile,
  useDeleteAccount,
  useLogout,
  type EditProfilePayload,
} from "@/src/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ─── Constants ──────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

/* ─── Avatar URL resolver ────────────────────────────── */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1")
  .replace(/\/api\/v1\/?$/, "");

function resolveAvatar(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

/* ─── Avatar helper ──────────────────────────────────── */

function UserAvatar({
  src,
  name,
  size = "md",
  className,
}: {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-20 text-xl",
  };
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full ring-2 ring-emerald-500/30",
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 font-bold text-white ring-2 ring-emerald-500/30",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

/* ─── My Profile Dialog (read-only) ─────────────────── */

function MyProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: profileRes } = useMyProfile(open);
  const profile = profileRes?.data;
  const { user } = useAuthStore();

  const name = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.name ?? "User";
  const avatar = resolveAvatar(profile?.avatar) ?? user?.avatar;
  const email = profile?.email ?? user?.email ?? "";
  const institution = (profile?.institution as string) ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">My Profile</DialogTitle>
          <DialogDescription>Your account information</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <UserAvatar src={avatar} name={name} size="lg" />
          <div className="w-full space-y-3">
            <div className="rounded-xl border border-white/5 bg-white/3 p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Full Name</p>
                <p className="text-sm font-medium text-foreground">{name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                <p className="text-sm font-medium text-foreground">{email}</p>
              </div>
              {institution && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Institution</p>
                  <p className="text-sm font-medium text-foreground">{institution}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Edit Profile Dialog ────────────────────────────── */

function EditProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: profileRes } = useMyProfile(open);
  const profile = profileRes?.data;
  const updateProfile = useUpdateProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [institution, setInstitution] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form with profile data when dialog opens
  useEffect(() => {
    if (open && profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setInstitution((profile.institution as string) ?? "");
      setImageFile(null);
      setImagePreview(null);
    }
  }, [open, profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const payload: Record<string, unknown> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };
    if (institution.trim()) {
      payload.institution = institution.trim();
    }
    updateProfile.mutate(
      {
        ...payload,
        image: imageFile,
      } as EditProfilePayload,
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and profile picture.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Avatar upload */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative cursor-pointer"
            >
              {imagePreview ? (
                <div className="relative size-20 overflow-hidden rounded-full ring-2 ring-emerald-500/30">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <UserAvatar
                  src={profile?.avatar}
                  name={profile ? `${profile.firstName} ${profile.lastName}` : "User"}
                  size="lg"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <svg
                  className="size-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </button>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Profile Photo</p>
              <p>Click to change your photo</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-first">First Name</Label>
              <Input
                id="edit-first"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-last">Last Name</Label>
              <Input
                id="edit-last"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Institution */}
          <div className="space-y-2">
            <Label htmlFor="edit-inst">Institution</Label>
            <Input
              id="edit-inst"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Your university / school"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose
            className={buttonVariants({ variant: "ghost" })}
          >
            Cancel
          </DialogClose>
          <button
            onClick={handleSubmit}
            disabled={updateProfile.isPending}
            className={buttonVariants({ className: "min-w-25" })}
          >
            {updateProfile.isPending ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Delete Account Dialog ──────────────────────────── */

function DeleteAccountDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const deleteAccount = useDeleteAccount();
  const [confirmText, setConfirmText] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-400">
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action is irreversible. All your data will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm text-red-300">
              ⚠️ This will permanently delete your account, study plans, notes,
              and all associated data. This cannot be undone.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              Type <span className="font-bold text-red-400">DELETE</span> to
              confirm
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="border-red-500/30 focus-visible:ring-red-500/30"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose
            className={buttonVariants({ variant: "ghost" })}
            onClick={() => setConfirmText("")}
          >
            Cancel
          </DialogClose>
          <button
            onClick={() => {
              deleteAccount.mutate();
              setConfirmText("");
            }}
            disabled={confirmText !== "DELETE" || deleteAccount.isPending}
            className={cn(
              buttonVariants({ variant: "destructive" }),
              "min-w-30"
            )}
          >
            {deleteAccount.isPending ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Deleting...
              </span>
            ) : (
              "Delete Account"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Navbar ────────────────────────────────────── */

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const { data: profileRes } = useMyProfile(isAuthenticated);
  const logout = useLogout();

  // Use profile data if available, fall back to store user
  const profile = profileRes?.data;
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.name ?? "User";
  const displayAvatar = resolveAvatar(profile?.avatar) ?? user?.avatar;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/sylabixlogo.png"
            alt="Syllabix"
            width={48}
            height={48}
            className="h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
            priority
            unoptimized
          />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Syllabix
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth / profile */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pr-4 pl-1.5 transition-all hover:bg-white/10 hover:ring-2 hover:ring-emerald-500/20 cursor-pointer">
                  <UserAvatar
                    src={displayAvatar}
                    name={displayName}
                    size="sm"
                  />
                  <span className="max-w-30 truncate text-sm font-medium text-foreground">
                    {displayName}
                  </span>
                  <svg
                    className="size-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 overflow-hidden p-0"
              >
                {/* User info header */}
                <div className="border-b border-white/5 bg-white/2 p-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={displayAvatar}
                      name={displayName}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {profile?.email ?? user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
                    onClick={() => setProfileOpen(true)}
                  >
                    <svg
                      className="size-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    My Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
                    onClick={() => setEditOpen(true)}
                  >
                    <svg
                      className="size-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 focus:text-red-400"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Account
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
                    onClick={() => logout()}
                  >
                    <svg
                      className="size-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className={buttonVariants({ size: "sm" })}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex size-10 items-center justify-center rounded-lg md:hidden hover:bg-accent transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span className="sr-only">{isOpen ? "Close" : "Menu"}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="glass-strong absolute top-0 right-0 bottom-0 flex w-[min(85vw,360px)] flex-col overflow-y-auto"
            >
              {/* Close */}
              <div className="flex h-16 items-center justify-end px-5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex size-10 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-1 flex-col px-6 pt-2">
                {/* Profile section (authenticated only) */}
                {isAuthenticated && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="mb-4 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/3 p-4"
                    >
                      <UserAvatar
                        src={displayAvatar}
                        name={displayName}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {profile?.email ?? user?.email}
                        </p>
                      </div>
                    </motion.div>

                    {/* Profile actions */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 }}
                    >
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setProfileOpen(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <svg
                          className="size-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        My Profile
                      </button>
                    </motion.div>
                  </>
                )}

                {/* Nav links */}
                <div className={cn("flex flex-col gap-1", isAuthenticated && "mt-2")}>
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-white/5" />

                {/* Auth / Profile buttons */}
                <div className="flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            setEditOpen(true);
                          }}
                          className={buttonVariants({
                            variant: "outline",
                            className: "w-full",
                          })}
                        >
                          Edit Profile
                        </button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            logout();
                          }}
                          className={buttonVariants({
                            variant: "destructive",
                            className: "w-full",
                          })}
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <Link
                          href="/auth/login"
                          onClick={() => setIsOpen(false)}
                          className={buttonVariants({
                            variant: "outline",
                            className: "w-full",
                          })}
                        >
                          Sign In
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          href="/auth/register"
                          onClick={() => setIsOpen(false)}
                          className={buttonVariants({ className: "w-full" })}
                        >
                          Get Started
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dialogs ── */}
      <MyProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
      <DeleteAccountDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
    </header>
  );
}
