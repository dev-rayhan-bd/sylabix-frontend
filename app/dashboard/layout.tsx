"use client";

import { ProtectedRoute } from "@/src/components/dashboard/ProtectedRoute";
import { Sidebar } from "@/src/components/dashboard/Sidebar";
import { ChatBubble } from "@/src/components/dashboard/ChatBubble";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#060a13]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <ChatBubble />
    </ProtectedRoute>
  );
}
