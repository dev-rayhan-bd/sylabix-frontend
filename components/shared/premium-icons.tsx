"use client";

/* ═══════════════════════════════════════════════════════════════
   Premium Custom SVG Icons for Syllabix
   Hand-crafted for a luxury SaaS aesthetic — NOT generic Lucide
   ═══════════════════════════════════════════════════════════════ */

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

/* ── Sparkles (Hero badge, CTA) ───────────────────────────── */
export function SparklesIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

/* ── Arrow Right (CTAs) ───────────────────────────────────── */
export function ArrowRightIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ── Document Scanner (PDF Syllabus Analysis) ─────────────── */
export function DocumentScanIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
      <path d="M18.5 13.5a1 1 0 1 1 1-1 1 1 0 0 1-1 1z" fill="currentColor" />
      <path d="M19 11v-1" />
      <path d="M20 12h-1" />
    </svg>
  );
}

/* ── Calendar Sync (Adaptive Scheduling) ──────────────────── */
export function CalendarSyncIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M12 14v3" />
      <path d="M10 15l2 2 2-2" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" />
    </svg>
  );
}

/* ── Chat Bubble with AI (RAG-based AI Chat) ──────────────── */
export function ChatAiIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="10" r="2" />
      <path d="M12 12v2" />
      <path d="M9 9l1.5 1.5" />
      <path d="M15 9l-1.5 1.5" />
      <circle cx="8" cy="10" r="0.5" fill="currentColor" />
      <circle cx="16" cy="10" r="0.5" fill="currentColor" />
    </svg>
  );
}

/* ── Flashcard Stack (Smart Flashcards) ───────────────────── */
export function FlashcardIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="14" rx="2" opacity="0.3" />
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" opacity="0.4" />
      <path d="M10 13c-1.5 0-3 1-3 2.5S8.5 18 10 18h4c1.5 0 3-1 3-2.5S15.5 13 14 13" />
      <path d="M12 11v2" />
    </svg>
  );
}

/* ── Analytics Chart (Progress Analytics) ─────────────────── */
export function AnalyticsIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16l4-5 3 3 4-6" />
      <circle cx="7" cy="16" r="1" fill="currentColor" />
      <circle cx="11" cy="11" r="1" fill="currentColor" />
      <circle cx="14" cy="14" r="1" fill="currentColor" />
      <circle cx="18" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

/* ── Shield Lock (Secure & Private) ───────────────────────── */
export function ShieldLockIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <rect x="9" y="11" width="6" height="5" rx="1" />
      <path d="M10 11V9a2 2 0 0 1 4 0v2" />
      <circle cx="12" cy="13.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

/* ── Upload Cloud (How It Works Step 1) ───────────────────── */
export function UploadCloudIcon({ className = "size-10" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <polyline points="9 14 12 11 15 14" />
    </svg>
  );
}

/* ── AI Brain Neural (How It Works Step 2) ────────────────── */
export function NeuralBrainIcon({ className = "size-10" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 5.5v1.5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V14.5c1.5-1 3-3 3-5.5a7 7 0 0 0-7-7z" />
      <circle cx="10" cy="8" r="1" fill="currentColor" />
      <circle cx="14" cy="8" r="1" fill="currentColor" />
      <circle cx="12" cy="11" r="1" fill="currentColor" />
      <circle cx="9" cy="11" r="0.5" fill="currentColor" />
      <circle cx="15" cy="11" r="0.5" fill="currentColor" />
      <line x1="10" y1="8" x2="12" y2="11" opacity="0.5" />
      <line x1="14" y1="8" x2="12" y2="11" opacity="0.5" />
      <line x1="9" y1="11" x2="10" y2="8" opacity="0.5" />
      <line x1="15" y1="11" x2="14" y2="8" opacity="0.5" />
      <line x1="12" y1="15" x2="12" y2="19" />
      <line x1="10" y1="19" x2="14" y2="19" />
    </svg>
  );
}

/* ── Trophy/Achievement (How It Works Step 3) ─────────────── */
export function TrophyIcon({ className = "size-10" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9V2h12v7a6 6 0 0 1-12 0z" />
      <path d="M6 4H3v3a3 3 0 0 0 6 0V4" opacity="0.5" />
      <path d="M18 4h3v3a3 3 0 0 1-6 0V4" opacity="0.5" />
      <line x1="10" y1="18" x2="14" y2="18" />
      <line x1="9" y1="22" x2="15" y2="22" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <path d="M12 6l.5 1 1-.3-.3 1 .8.6-.8.6.3 1-1-.3-.5 1-.5-1-1 .3.3-1-.8-.6.8-.6-.3-1 1 .3z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/* ── Social Icons for Footer ──────────────────────────────── */
export function TwitterIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function GithubIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function InstagramIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
