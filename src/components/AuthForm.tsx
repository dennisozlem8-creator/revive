"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { loadUsers } from "@/lib/users";
import { todayDateString } from "@/lib/streak";
import type { UserRole } from "@/lib/users";

type AuthFormProps = {
  mode: "login" | "register";
  hideHeader?: boolean;
};

const roles: UserRole[] = ["patient", "doctor", "caregiver"];

const roleLabels: Record<UserRole, string> = {
  patient: "Patient",
  doctor: "Doctor",
  caregiver: "Caregiver",
};

function homeForRole(role: UserRole) {
  if (role === "doctor") return "/doctor";
  if (role === "caregiver") return "/caregiver";
  return "/onboarding";
}

export function AuthForm({ mode, hideHeader }: AuthFormProps) {
  const { login, register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [caregiverEmail, setCaregiverEmail] = useState("");
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
            doctorEmail: role === "patient" ? doctorEmail : undefined,
            caregiverEmail: role === "patient" ? caregiverEmail : undefined,
            notificationsEnabled,
          });

    if (result) {
      setError(result);
      return;
    }

    if (mode === "login") {
      const found = loadUsers().find((u) => u.email === email.trim().toLowerCase());
      if (found?.role === "doctor") {
        router.replace("/doctor");
        return;
      }
      if (found?.role === "caregiver") {
        router.replace("/caregiver");
        return;
      }
      router.replace(
        !found?.setupComplete
          ? "/onboarding"
          : found.lastCheckInDate !== todayDateString()
            ? "/check-in"
            : "/briefing"
      );
      return;
    }

    router.replace(homeForRole(role));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!hideHeader && (
        <div>
          <h1 className="text-2xl font-semibold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "login"
              ? "Sign in as patient, doctor, or caregiver."
              : "Patients recover at home. Doctors manage clinical plans. Caregivers send daily support."}
          </p>
        </div>
      )}

      {hideHeader && mode === "login" && (
        <div className="pb-1">
          <h2 className="text-lg font-semibold text-white">Sign in</h2>
          <p className="mt-1 text-sm text-muted">Use your email and password</p>
        </div>
      )}

      {mode === "register" && (
        <>
          <div>
            <label className="rm-auth-label">I am a</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-xl border px-2 py-3 text-xs font-bold transition sm:text-sm ${
                    role === r
                      ? "border-brand bg-brand-soft text-brand-light"
                      : "border-[var(--border)] bg-background"
                  }`}
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="name" className="rm-auth-label">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rm-auth-input"
              required
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="email" className="rm-auth-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="rm-auth-input"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="rm-auth-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="rm-auth-input"
          required
          minLength={6}
        />
      </div>

      {mode === "register" && role === "patient" && (
        <>
          <div>
            <label htmlFor="doctorEmail" className="rm-auth-label">
              Doctor email (optional)
            </label>
            <input
              id="doctorEmail"
              type="email"
              value={doctorEmail}
              onChange={(e) => setDoctorEmail(e.target.value)}
              placeholder="Links you to your PT / doctor"
              className="rm-auth-input"
            />
          </div>
          <div>
            <label htmlFor="caregiverEmail" className="rm-auth-label">
              Caregiver email (optional)
            </label>
            <input
              id="caregiverEmail"
              type="email"
              value={caregiverEmail}
              onChange={(e) => setCaregiverEmail(e.target.value)}
              placeholder="Links you to a family caregiver"
              className="rm-auth-input"
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

      {error && (
        <p className="rounded-lg border border-alert/30 bg-alert/10 px-3 py-2 text-sm text-alert">
          {error}
        </p>
      )}

      <button type="submit" className="rm-btn rm-btn-primary rm-btn-lg w-full shadow-lg shadow-brand/20">
        {mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
