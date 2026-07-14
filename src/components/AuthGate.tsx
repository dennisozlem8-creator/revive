"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { todayDateString } from "@/lib/streak";

const PUBLIC_PATHS = ["/login", "/register", "/kids"];
const ONBOARDING_PATH = "/onboarding";
const CHECK_IN_PATH = "/check-in";
/** Patient paths reachable without completing onboarding */
const ONBOARDING_EXEMPT = [ONBOARDING_PATH, "/kids"];
/** Patient paths reachable without completing daily check-in */
const CHECK_IN_EXEMPT = [CHECK_IN_PATH, ONBOARDING_PATH, "/kids"];

function patientNeedsCheckIn(lastCheckInDate?: string) {
  return lastCheckInDate !== todayDateString();
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) {
      router.replace("/login");
      return;
    }
    // Logged-in users may stay on /login or /register to reset or switch accounts.
    if (user && isPublic) return;
    if (
      user?.role === "patient" &&
      !user.setupComplete &&
      !ONBOARDING_EXEMPT.includes(pathname)
    ) {
      router.replace(ONBOARDING_PATH);
      return;
    }
    if (
      user?.role === "patient" &&
      user.setupComplete &&
      patientNeedsCheckIn(user.lastCheckInDate) &&
      !CHECK_IN_EXEMPT.includes(pathname)
    ) {
      router.replace(CHECK_IN_PATH);
    }
  }, [user, loading, isPublic, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background text-muted">
        Loading...
      </div>
    );
  }

  if (!user && !isPublic) return null;

  return <>{children}</>;
}
