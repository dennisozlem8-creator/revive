"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  bluetoothHeartRateSupported,
  connectHeartRateSensor,
  type HeartRateConnection,
} from "@/lib/heart-sensor";

const HISTORY = 24;

type HeartRateContextValue = {
  supported: boolean;
  connecting: boolean;
  connected: boolean;
  deviceName: string;
  bpm: number | null;
  history: number[];
  error: string;
  connect: (acceptAll?: boolean) => Promise<boolean>;
  disconnect: () => void;
};

const HeartRateContext = createContext<HeartRateContextValue | null>(null);

export function HeartRateProvider({ children }: { children: React.ReactNode }) {
  const [supported, setSupported] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [bpm, setBpm] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>(() => Array(HISTORY).fill(0));
  const [error, setError] = useState("");
  const connectionRef = useRef<HeartRateConnection | null>(null);

  useEffect(() => {
    setSupported(bluetoothHeartRateSupported());
    return () => {
      connectionRef.current?.disconnect();
    };
  }, []);

  const disconnect = useCallback(() => {
    connectionRef.current?.disconnect();
    connectionRef.current = null;
    setConnected(false);
    setDeviceName("");
    setBpm(null);
    setConnecting(false);
  }, []);

  const connect = useCallback(
    async (acceptAll = false) => {
      setError("");
      setConnecting(true);
      try {
        connectionRef.current?.disconnect();
        const connection = await connectHeartRateSensor({
          acceptAll,
          onBpm: (next) => {
            setBpm(next);
            setHistory((prev) => [...prev.slice(1), next]);
          },
          onDisconnect: () => {
            connectionRef.current = null;
            setConnected(false);
            setDeviceName("");
            setBpm(null);
            setConnecting(false);
            setError("The heart sensor disconnected. Tap Connect to pair it again.");
          },
        });
        connectionRef.current = connection;
        setDeviceName(connection.deviceName);
        setConnected(true);
        setHistory(Array(HISTORY).fill(0));
        return true;
      } catch (err) {
        const name = err instanceof DOMException ? err.name : "";
      if (name === "NotFoundError" || name === "AbortError") {
        setError("No heart sensor was chosen. Make sure the strap is on and awake, then try again.");
      } else if (name === "SecurityError") {
          setError("Bluetooth was blocked. Use https://www.revivemotion.ai in Chrome or Edge, and allow Bluetooth.");
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Could not connect to the heart sensor. Use Chrome or Edge and a Bluetooth heart-rate strap."
          );
        }
        setConnected(false);
        return false;
      } finally {
        setConnecting(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      supported,
      connecting,
      connected,
      deviceName,
      bpm,
      history,
      error,
      connect,
      disconnect,
    }),
    [supported, connecting, connected, deviceName, bpm, history, error, connect, disconnect]
  );

  return <HeartRateContext.Provider value={value}>{children}</HeartRateContext.Provider>;
}

export function useHeartRate() {
  const ctx = useContext(HeartRateContext);
  if (!ctx) {
    throw new Error("useHeartRate must be used inside HeartRateProvider");
  }
  return ctx;
}
