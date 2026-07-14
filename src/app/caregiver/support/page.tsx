"use client";

import { useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/PortalShell";
import { useAuth } from "@/components/AuthProvider";
import { t } from "@/lib/i18n";

const quickMessages = [
  "So proud of you — keep going one day at a time! 💚",
  "Remember to take it slow today. I'm cheering for you!",
  "Great job staying consistent. You've got this!",
  "Rest is part of recovery too. Listen to your body today.",
];

export default function CaregiverSupportPage() {
  const { user, getPatientsForCaregiver, sendEncouragementToPatient } = useAuth();
  const [selectedEmail, setSelectedEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const locale = user?.language ?? "en";
  const patients = getPatientsForCaregiver();

  if (user?.role !== "caregiver") {
    return (
      <div className="flex min-h-full items-center justify-center rm-glow-patient p-6">
        <Link href="/login" className="text-brand-light">
          Sign in
        </Link>
      </div>
    );
  }

  function handleSend() {
    if (!selectedEmail || !message.trim()) return;
    sendEncouragementToPatient(selectedEmail, message.trim());
    setSent(true);
    setMessage("");
  }

  return (
    <PortalShell
      variant="caregiver"
      maxWidth="2xl"
      label={t("caregiverPortal", locale)}
      title={t("supportCenter", locale)}
      subtitle={t("supportCenterHint", locale)}
      backHref="/caregiver"
      backLabel={t("backToDashboard", locale)}
    >
      <select
        value={selectedEmail}
        onChange={(e) => {
          setSelectedEmail(e.target.value);
          setSent(false);
        }}
        className="w-full rounded-2xl border border-[#fcd9bd] bg-white px-4 py-4 text-base shadow-sm"
      >
        <option value="">{t("selectLovedOne", locale)}</option>
        {patients.map((p) => (
          <option key={p.email} value={p.email}>
            {p.name}
          </option>
        ))}
      </select>

      <div className="space-y-3 rounded-2xl border border-[#fcd9bd] bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-orange">{t("quickNotes", locale)}</p>
        <div className="flex flex-wrap gap-2">
          {quickMessages.map((note) => (
            <button
              key={note}
              type="button"
              onClick={() => setMessage(note)}
              className="rounded-full border border-orange/30 bg-orange/10 px-3 py-2 text-xs font-medium text-orange transition hover:bg-orange/20"
            >
              {note.slice(0, 36)}…
            </button>
          ))}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("writeEncouragement", locale)}
          rows={4}
          className="w-full rounded-xl border border-[#fde8d8] bg-[#fffaf5] px-4 py-4 text-base"
        />

        <button type="button" onClick={handleSend} className="rm-btn rm-btn-warm w-full min-h-[3rem]">
          {t("sendEncouragement", locale)}
        </button>

        {sent && (
          <p className="text-center text-sm font-semibold text-correct">{t("encouragementSent", locale)}</p>
        )}
      </div>

      <section className="rounded-2xl border border-[#fcd9bd] bg-[#fffaf5] p-5">
        <h2 className="font-bold text-[var(--caregiver-text)]">{t("caregiverTips", locale)}</h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--caregiver-muted)]">
          <li>· {t("caregiverTip1", locale)}</li>
          <li>· {t("caregiverTip2", locale)}</li>
          <li>· {t("caregiverTip3", locale)}</li>
        </ul>
      </section>
    </PortalShell>
  );
}
