"use client";

import { useEffect, useRef, useState } from "react";
import { getTherapistResponse } from "@/lib/therapist";
import { useAuth } from "./AuthProvider";
import { resolveLocale, t } from "@/lib/i18n";

type Message = { role: "user" | "assistant"; text: string };

export function ChatAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const locale = resolveLocale(user);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        locale === "es"
          ? "¡Hola! Pregúntame sobre ejercicios, dolor, ROM o tu plan de recuperación."
          : "Hi! Ask me about exercises, pain, ROM, or your recovery plan.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!user) return null;

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: getTherapistResponse(text, user, locale) },
      ]);
    }, 400);
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 sm:right-5">
      {open && (
        <div className="flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-surface shadow-[0_8px_40px_rgba(0,0,0,0.4)] sm:w-96">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-brand/10 px-4 py-3">
            <div>
              <p className="text-base font-semibold">{t("automatedTherapist", locale)}</p>
              <p className="text-sm text-muted">Revive Motion</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted hover:text-foreground"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user" ? "ml-auto bg-brand text-white" : "bg-background/80"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-[var(--border)] p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={locale === "es" ? "Pregunta sobre recuperación…" : "Ask about recovery…"}
              className="flex-1 rounded-xl border border-[var(--border)] bg-background px-3 py-2.5 text-base outline-none focus:border-brand"
            />
            <button type="submit" className="rm-btn rm-btn-brand shrink-0 px-4 py-2.5 text-sm">
              Send
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-lg shadow-brand/30 transition hover:scale-105"
        aria-label="Open therapist chat"
      >
        💬
      </button>
    </div>
  );
}
