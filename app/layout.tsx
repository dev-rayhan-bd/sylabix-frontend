import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/src/components/shared/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Syllabix — AI-Powered Study Planner",
  description:
    "Master your syllabus with AI intelligence. Transform PDF syllabi into adaptive study plans, smart flashcards, and AI-powered chat.",
  keywords: [
    "study planner",
    "AI studying",
    "syllabus analyzer",
    "adaptive scheduling",
    "flashcards",
  ],
  openGraph: {
    title: "Syllabix — AI-Powered Study Planner",
    description:
      "Master your syllabus with AI intelligence. Transform PDF syllabi into adaptive study plans.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
