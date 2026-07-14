"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  connectSimulatedDevice,
  disconnectSensor,
  getLiveVitals,
  isBluetoothAvailable,
  isSerialAvailable,
  loadSensorConnection,
  tryConnectBluetooth,
  tryConnectSerial,
  type SensorConnection,
  type SensorDeviceKind,
} from "@/lib/sensor-hub";

type SensorContextValue = {
  connection: SensorConnection | null;
  connected: boolean;
  bluetoothAvailable: boolean;
  serialAvailable: boolean;
  liveHr: number | null;
  liveSpO2: number | null;
  connectSimulated: (deviceId: string, deviceName: string, kind?: SensorDeviceKind) => Promise<void>;
  connectBluetooth: () => Promise<boolean>;
  connectSerial: () => Promise<boolean>;
  connectHc05: () => Promise<boolean>;
  disconnect: () => void;
  refresh: () => void;
};

const SensorContext = createContext<SensorContextValue | null>(null);

export function SensorProvider({ children }: { children: React.ReactNode }) {
  const [connection, setConnection] = useState<SensorConnection | null>(null);
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
  const [serialAvailable, setSerialAvailable] = useState(false);
  const [vitals, setVitals] = useState(() => getLiveVitals());

  const refresh = useCallback(() => {
    const conn = loadSensorConnection();
    setConnection((prev) => {
      if (
        prev?.deviceId === conn?.deviceId &&
        prev?.connectedAt === conn?.connectedAt &&
        prev?.source === conn?.source
      ) {
        return prev;
      }
      return conn;
    });
    setVitals((prev) => {
      const next = getLiveVitals();
      if (prev.hr === next.hr && prev.spo2 === next.spo2 && prev.hrSource === next.hrSource) {
        return prev;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    setConnection(loadSensorConnection());
    setBluetoothAvailable(isBluetoothAvailable());
    setSerialAvailable(isSerialAvailable());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setVitals((prev) => {
        const next = getLiveVitals();
        if (prev.hr === next.hr && prev.spo2 === next.spo2 && prev.hrSource === next.hrSource) {
          return prev;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const connectSimulated = useCallback(
    async (deviceId: string, deviceName: string, kind: SensorDeviceKind = "rom") => {
      const conn = await connectSimulatedDevice(deviceId, deviceName, kind);
      setConnection(conn);
    },
    []
  );

  const attemptConnect = useCallback(async (connect: () => Promise<SensorConnection | null>) => {
    const conn = await connect();
    if (!conn) return false;
    setConnection(conn);
    return true;
  }, []);

  const connectBluetooth = useCallback(
    () => attemptConnect(tryConnectBluetooth),
    [attemptConnect]
  );

  const connectSerial = useCallback(
    () => attemptConnect(() => tryConnectSerial("usb")),
    [attemptConnect]
  );

  const connectHc05 = useCallback(
    () => attemptConnect(() => tryConnectSerial("hc05")),
    [attemptConnect]
  );

  const disconnect = useCallback(() => {
    disconnectSensor();
    setConnection(null);
  }, []);

  const value = useMemo(
    () => ({
      connection,
      connected: connection !== null,
      bluetoothAvailable,
      serialAvailable,
      liveHr: vitals.hr,
      liveSpO2: vitals.spo2,
      connectSimulated,
      connectBluetooth,
      connectSerial,
      connectHc05,
      disconnect,
      refresh,
    }),
    [connection, bluetoothAvailable, serialAvailable, vitals, connectSimulated, connectBluetooth, connectSerial, connectHc05, disconnect, refresh]
  );

  return <SensorContext.Provider value={value}>{children}</SensorContext.Provider>;
}

export function useSensor() {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error("useSensor must be used within SensorProvider");
  return ctx;
}
