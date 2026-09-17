"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashCard, DashIntro, DashShell } from "@/components/clinic/DashKit";
import { useAuth } from "@/components/AuthProvider";
import {
  getNotificationsForUser,
  markNotificationsRead,
  requestNotificationPermission,
} from "@/lib/notifications";
import type { AppNotification } from "@/lib/notifications";

export default function NotificationsPage() {
  const { user, updateUser } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (user) {
      setNotifications(getNotificationsForUser(user.email));
      markNotificationsRead(user.email);
    }
  }, [user]);

  if (!user || user.role !== "patient") {
    return (
      <div className="flex min-h-full items-center justify-center bg-background p-6">
        <Link href="/" className="font-semibold text-[#1b3348]">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <DashShell nav={false} wide={false}>
      <DashIntro
        kicker="Alerts"
        title="Daily reminders"
        text="Turn on reminders to keep the measure-coach-report loop going."
      />
      <DashCard className="mt-6 p-6">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={user.notificationsEnabled}
            onChange={(event) => {
              updateUser({ notificationsEnabled: event.target.checked });
              if (event.target.checked) requestNotificationPermission();
            }}
            className="h-5 w-5 accent-[#4f90c6]"
          />
          <span className="text-base text-[#1b3348]">Enable daily exercise reminders</span>
        </label>
        <p className="mt-2 text-sm text-[#2f4a60]">Browser notifications when allowed in device settings.</p>
      </DashCard>
      <div className="mt-6 space-y-3">
        {notifications.length === 0 ? (
          <DashCard className="p-6">
            <p className="rm-serif text-xl font-semibold text-[#1b3348]">No notifications yet</p>
            <p className="mt-2 text-base leading-7 text-[#2f4a60]">
              After a session, check-in, or clinician update, alerts land here.
            </p>
          </DashCard>
        ) : (
          notifications.map((note) => (
            <DashCard key={note.id} className="p-5">
              <p className="font-semibold text-[#1b3348]">{note.title}</p>
              <p className="mt-1 text-sm text-[#2f4a60]">{note.message}</p>
              <p className="mt-2 text-sm text-[#2f4a60]">{new Date(note.sentAt).toLocaleString()}</p>
            </DashCard>
          ))
        )}
      </div>
    </DashShell>
  );
}
