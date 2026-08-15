"use client";

import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import {
  getNotificationsForUser,
  markNotificationsRead,
  requestNotificationPermission,
} from "@/lib/notifications";
import { useEffect, useState } from "react";
import type { AppNotification } from "@/lib/notifications";
import Link from "next/link";

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
        <Link href="/" className="text-brand-light">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-2xl px-6 pb-24">
        <h1 className="text-3xl font-semibold">Daily alerts</h1>
        <p className="mt-2 text-muted">
          Daily reminders to keep your recovery on track.
        </p>

        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-surface p-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={user.notificationsEnabled}
              onChange={(e) => {
                updateUser({ notificationsEnabled: e.target.checked });
                if (e.target.checked) requestNotificationPermission();
              }}
              className="accent-brand"
            />
            <span className="text-sm">Enable daily exercise reminders</span>
          </label>
          <p className="mt-2 text-xs text-muted">
            Browser notifications when enabled in your device settings.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <article
                key={n.id}
                className="rounded-xl border border-[var(--border)] bg-surface p-4"
              >
                <p className="font-medium">{n.title}</p>
                <p className="mt-1 text-sm text-muted">{n.message}</p>
                <p className="mt-2 text-xs text-muted">
                  {new Date(n.sentAt).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
