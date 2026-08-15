"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import {
  requestNotificationPermission,
  sendDailyNotifications,
} from "@/lib/notifications";

export function NotificationScheduler() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "patient" || !user.notificationsEnabled) return;

    requestNotificationPermission();

    sendDailyNotifications(user.email, user.name, user.doctorEmail);

    const interval = setInterval(() => {
      sendDailyNotifications(user.email, user.name, user.doctorEmail);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  return null;
}
