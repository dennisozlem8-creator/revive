"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { loadUsers } from "@/lib/users";
import { todayDateString } from "@/lib/streak";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const { login, register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result =
      mode === "login"
        ? login(email, password)
        : register({
            name,
            email,
            password,
            role,
            notificationsEnabled,
          });

    if (result) {
      setError(result);
      return;
    }

    if (mode === "login") {
      const found = loadUsers().find(
        (u) => u.email === email.trim().toLowerCase()
      );
      router.replace(
        found?.role === "doctor"
          ? "/doctor"
          : !found?.setupComplete
            ? "/onboarding"
            : found.lastCheckInDate !== todayDateString()
              ? "/check-in"
              : "/briefing"
      );
      return;
    }

    router.replace(role === "doctor" ? "/doctor" : "/onboarding");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-surface p-8"
    >
      <h1 className="text-2xl font-semibold">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {mode === "login"
          ? "Sign in to access assessments, quests, and notifications."
          : "Patients track recovery at home. Doctors can monitor linked patients."}
      </p>

      <div className="mt-6 space-y-4">
        {mode === "register" && (
          <>
            <div>
              <label className="mb-1 block text-sm text-muted">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {(["patient", "doctor"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-xl border px-4 py-3 text-sm capitalize transition ${
                      role === r
                        ? "border-brand bg-brand-soft text-brand-light"
                        : "border-[var(--border)] bg-background"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-muted">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-background px-4 py-3 outline-none focus:border-brand"
                required
              />
            </div>
          </>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-background px-4 py-3 outline-none focus:border-brand"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-muted">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-background px-4 py-3 outline-none focus:border-brand"
            required
            minLength={6}
          />
        </div>
        {mode === "register" && role === "patient" && (
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="accent-brand"
            />
            Send me daily exercise reminders
          </label>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition hover:bg-brand-light"
      >
        {mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
