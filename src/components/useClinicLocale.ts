"use client";

import { useCallback, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import type { Locale } from "@/lib/i18n";

export function useClinicLocale() {
  const { user, updateUser, deviceLocale, setDeviceLocale } = useAuth();
  const locale: Locale = user?.language ?? deviceLocale;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      setDeviceLocale(next);
      if (user) updateUser({ language: next });
    },
    [user, updateUser, setDeviceLocale]
  );

  return { locale, setLocale };
}
