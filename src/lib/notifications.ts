import type { User } from "./users";

export type AppNotification = {
  id: string;
  toEmail: string;
  role: "patient" | "doctor" | "caregiver";
  title: string;
  message: string;
  sentAt: string;
  read: boolean;
};

const NOTIFICATIONS_KEY = "revive-motion-notifications";

function dailyKey(email: string) {
  return `revive-motion-last-daily-${email}`;
}

export function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveNotifications(notifications: AppNotification[]) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

export function addNotification(
  notification: Omit<AppNotification, "id" | "sentAt" | "read">
) {
  const all = loadNotifications();
  all.unshift({
    ...notification,
    id: crypto.randomUUID(),
    sentAt: new Date().toISOString(),
    read: false,
  });
  saveNotifications(all.slice(0, 100));
}

export function markNotificationsRead(email: string) {
  const all = loadNotifications().map((n) =>
    n.toEmail === email ? { ...n, read: true } : n
  );
  saveNotifications(all);
}

export function getNotificationsForUser(email: string) {
  return loadNotifications().filter((n) => n.toEmail === email);
}

function isReminderWindow(sessionTime: User["sessionTime"]): boolean {
  const hour = new Date().getHours();
  if (sessionTime === "morning") return hour >= 7 && hour < 11;
  if (sessionTime === "afternoon") return hour >= 12 && hour < 17;
  return hour >= 17 && hour < 21;
}

export function shouldSendDailyReminder(user: User): boolean {
  if (!user.notificationsEnabled) return false;
  if (!isReminderWindow(user.sessionTime)) return false;

  const last = localStorage.getItem(dailyKey(user.email));
  if (!last) return true;
  const lastDate = new Date(last);
  const now = new Date();
  return now.getTime() - lastDate.getTime() > 12 * 60 * 60 * 1000;
}

export function markDailyReminderSent(email: string) {
  localStorage.setItem(dailyKey(email), new Date().toISOString());
}

export async function sendBrowserNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/exercises/mobility.svg" });
  }
}

export function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

export function sendDailyNotifications(user: User) {
  if (!shouldSendDailyReminder(user)) return;

  const first = user.name.split(" ")[0];
  const isEs = user.language === "es";

  addNotification({
    toEmail: user.email,
    role: "patient",
    title: isEs ? "Recordatorio diario" : "Daily exercise reminder",
    message: isEs
      ? `Hola ${first}, es hora de tus ejercicios de Revive Motion.`
      : `Hi ${first}, time for today's Revive Motion exercises.`,
  });

  sendBrowserNotification(
    "Revive Motion",
    isEs ? `Hola ${first}, ¡hora de ejercitar!` : `Hi ${first}, time for your exercises today!`
  );

  if (user.doctorEmail) {
    addNotification({
      toEmail: user.doctorEmail,
      role: "doctor",
      title: isEs ? "Recordatorio del paciente" : "Patient reminder",
      message: isEs
        ? `${user.name} recibió un recordatorio diario.`
        : `${user.name} received a daily exercise reminder.`,
    });
  }

  markDailyReminderSent(user.email);
}
