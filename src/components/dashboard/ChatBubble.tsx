"use client";

import { use, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMyPlans, useChat, type ChatMessage } from "@/src/hooks/useStudyPlans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: plansData } = useMyPlans();
  const chat = useChat();

  const plans = plansData?.data ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !selectedPlanId) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    chat.mutate(
      { planId: selectedPlanId, question: trimmed },
      {
        onSuccess: (res) => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: res.data.answer,
              sources: res.data.sources,
            },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I couldn't process that question. Please try again.",
            },
          ]);
        },
      }
    );
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-24 right-4 z-50 flex w-95 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1a]/95 shadow-2xl backdrop-blur-xl sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <svg className="size-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Syllabix AI
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Plan Selector */}
            <div className="border-b border-white/5 px-4 py-2">
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              >
                <option value="" className="bg-[#0a0f1a]">
                  Select a syllabus to ask about…
                </option>
                {plans?.map((p) => (
                  <option key={p._id} value={p._id} className="bg-[#0a0f1a]">
                    {p.subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3" style={{ maxHeight: 350 }}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <svg className="size-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    Ask anything about your syllabus
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select a syllabus and type your question
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                          msg.role === "user"
                            ? "bg-emerald-600 text-white"
                            : "bg-white/5 text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2 border-t border-white/10 pt-2">
                            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
                              Sources
                            </p>
                            <div className="space-y-1">
                              {msg.sources.map((src, j) => (
                                <div
                                  key={j}
                                  className="rounded-lg bg-white/5 px-2 py-1 text-[11px] text-muted-foreground"
                                >
                                  {src.length > 120
                                    ? src.slice(0, 120) + "…"
                                    : src}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {chat.isPending && (
                    <div className="flex justify-start">
                      <div className="rounded-xl bg-white/5 px-4 py-3">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((d) => (
                            <motion.div
                              key={d}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: d * 0.2,
                              }}
                              className="size-2 rounded-full bg-emerald-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-white/5 px-4 py-3">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    selectedPlanId
                      ? "Ask a question…"
                      : "Select a syllabus first"
                  }
                  disabled={!selectedPlanId || chat.isPending}
                  className="rounded-xl border-white/10 bg-white/5 text-sm"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || !selectedPlanId || chat.isPending}
                  size="icon"
                  className="shrink-0 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40 sm:right-8"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
