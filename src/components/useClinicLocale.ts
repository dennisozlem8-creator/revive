"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { loadDeviceLocale, saveDeviceLocale, type Locale } from "@/lib/i18n";

export function useClinicLocale() {
  const { user, updateUser } = useAuth();
  const [device, setDevice] = useState<Locale>("en");

  useEffect(() => {
    setDevice(loadDeviceLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = user?.language ?? device;
  }, [device, user?.language]);


  const locale: Locale = user?.language ?? device;

  const setLocale = useCallback(
    (next: Locale) => {
      saveDeviceLocale(next);
      setDevice(next);
      if (user) updateUser({ language: next });
    },
    [user, updateUser]
  );

  return { locale, setLocale };
}
