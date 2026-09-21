"use client";

import { GoInScreen } from "@/components/GoInScreen";
import { LandingHeader } from "@/components/LandingHeader";

export function AccountGate({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="min-h-full bg-background">
      <LandingHeader mode={mode} />
      <main className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6">
        <section className="rounded-[1.25rem] bg-white p-4 shadow-[0_16px_36px_rgba(27,51,72,0.1)] ring-1 ring-[#4f90c6]/15 sm:p-5">
          <GoInScreen mode={mode} />
        </section>
      </main>
    </div>
  );
}
