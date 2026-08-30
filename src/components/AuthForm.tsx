"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { loadUsers, isCareTeam, type UserRole } from "@/lib/users";
import { todayDateString } from "@/lib/streak";

type AuthFormProps = {
  mode: "login" | "register";
  defaultRole?: UserRole;
};

const roleCopy: Record<UserRole, string> = {
  patient: "Patient",
  doctor: "Doctor",
  caregiver: "Caregiver",
};

export function AuthForm({ mode, defaultRole = "patient" }: AuthFormProps) {
  const { login, register } = useAuth();
  const router = useRouter();
  const role = defaultRole;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [error, setError] = useState("");

  function routeAfterAuth(nextRole: UserRole, setupComplete?: boolean, lastCheckInDate?: string) {
    if (isCareTeam(nextRole)) {
      router.replace("/doctor");
      return;
    }
    if (!setupComplete) {
      router.replace("/onboarding");
      return;
    }
    router.replace(lastCheckInDate !== todayDateString() ? "/check-in" : "/briefing");
  }

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
            doctorEmail: doctorEmail || undefined,
            notificationsEnabled,
          });

    if (result) {
      setError(result);
      return;
    }

    if (mode === "login") {
      const found = loadUsers().find((u) => u.email === email.trim().toLowerCase());
      routeAfterAuth(found?.role ?? "patient", found?.setupComplete, found?.lastCheckInDate);
      return;
    }

    routeAfterAuth(role);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-surface p-8"
    >
      <h1 className="text-2xl font-semibold">
        {mode === "login" ? `Welcome back, ${roleCopy[role]}` : `Create a ${roleCopy[role]} account`}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {role === "patient"
          ? "Sign in to access assessments, quests, and notifications."
          : role === "doctor"
            ? "Doctors can monitor linked patients from the clinic dashboard."
            : "Caregivers can follow a family member’s recovery progress."}
      </p>

      <div className="mt-6 space-y-4">
        {mode === "register" && (
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
          <>
            <div>
              <label htmlFor="doctorEmail" className="mb-1 block text-sm text-muted">
                Doctor or caregiver email (optional)
              </label>
              <input
                id="doctorEmail"
                type="email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-background px-4 py-3 outline-none focus:border-brand"
              />
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="accent-brand"
              />
              Send me daily exercise reminders
            </label>
          </>
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
