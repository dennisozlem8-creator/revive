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
  applyMyoWareSampleToProof,
  connectWiredMyoWare,
  EMPTY_MYOWARE_PROOF,
  parseSerialMyoWareLine,
  type MyoWareConnection,
  type UsbMyoWareProof,
} from "@/lib/myoware-sensor";
import { usbHeartRateSupported } from "@/lib/heart-sensor";
import {
  saveMyoWareRecording,
  summarizeMyoWareSamples,
  type MyoWareSample,
} from "@/lib/myoware-log";

const HISTORY = 24;

type MyoWareContextValue = {
  usbSupported: boolean;
  connecting: boolean;
  connected: boolean;
  deviceName: string;
  emg: number | null;
  env: number | null;
  history: number[];
  error: string;
  serialLog: string[];
  usbProof: UsbMyoWareProof;
  recording: boolean;
  recordCount: number;
  connectUsb: (port?: SerialPort) => Promise<boolean>;
  disconnect: () => void;
  startRecording: () => void;
  stopAndSave: (userEmail: string) => string;
};

const MyoWareContext = createContext<MyoWareContextValue | null>(null);

export function MyoWareProvider({ children }: { children: React.ReactNode }) {
  const [usbSupported, setUsbSupported] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [emg, setEmg] = useState<number | null>(null);
  const [env, setEnv] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>(() => Array(HISTORY).fill(0));
  const [error, setError] = useState("");
  const [serialLog, setSerialLog] = useState<string[]>([]);
  const [usbProof, setUsbProof] = useState<UsbMyoWareProof>(EMPTY_MYOWARE_PROOF);
  const [recording, setRecording] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const connectionRef = useRef<MyoWareConnection | null>(null);
  const recordingRef = useRef(false);
  const recordStartRef = useRef(0);
  const samplesRef = useRef<MyoWareSample[]>([]);
  const deviceNameRef = useRef("");

  useEffect(() => {
    setUsbSupported(usbHeartRateSupported());
    return () => {
      connectionRef.current?.disconnect();
    };
  }, []);

  const ingestEmg = useCallback((next: number) => {
    setEmg(next);
    setHistory((prev) => [...prev.slice(1), next]);
    if (!recordingRef.current) return;
    const time = (performance.now() - recordStartRef.current) / 1000;
    samplesRef.current.push({ time: Number(time.toFixed(2)), emg: next });
    setRecordCount(samplesRef.current.length);
  }, []);

  const ingestEnv = useCallback((next: number) => {
    setEnv(next);
    if (!recordingRef.current) return;
    const last = samplesRef.current[samplesRef.current.length - 1];
    if (last && last.env == null) last.env = next;
  }, []);

  const disconnect = useCallback(() => {
    connectionRef.current?.disconnect();
    connectionRef.current = null;
    recordingRef.current = false;
    setConnected(false);
    setDeviceName("");
    deviceNameRef.current = "";
    setEmg(null);
    setEnv(null);
    setUsbProof(EMPTY_MYOWARE_PROOF);
    setConnecting(false);
    setRecording(false);
  }, []);

  const handleGone = useCallback(() => {
    connectionRef.current = null;
    recordingRef.current = false;
    setConnected(false);
    setDeviceName("");
    deviceNameRef.current = "";
    setEmg(null);
    setEnv(null);
    setUsbProof(EMPTY_MYOWARE_PROOF);
    setConnecting(false);
    setRecording(false);
    setError("The MyoWare disconnected. Plug the Elegoo in and tap Connect with USB.");
  }, []);

  const connectUsb = useCallback(
    async (port?: SerialPort) => {
      setError("");
      setConnecting(true);
      try {
        connectionRef.current?.disconnect();
        setUsbProof(EMPTY_MYOWARE_PROOF);
        setSerialLog([]);
        const connection = await connectWiredMyoWare({
          port,
          onEmg: ingestEmg,
          onEnv: ingestEnv,
          onLine: (line) => {
            setSerialLog((prev) => [...prev.slice(-7), line]);
            const sample = parseSerialMyoWareLine(line);
            if (!sample) return;
            setUsbProof((prev) => {
              const next = applyMyoWareSampleToProof(prev, sample);
              if (next.board || next.chip) {
                const name = [next.board ?? "Elegoo Uno R3", next.chip ?? "MyoWare 2.0"].join(" · ");
                setDeviceName(name);
                deviceNameRef.current = name;
              }
              return next;
            });
          },
          onDisconnect: handleGone,
        });
        connectionRef.current = connection;
        if (!/MYOWARE/i.test(deviceNameRef.current)) {
          setDeviceName(connection.deviceName);
          deviceNameRef.current = connection.deviceName;
        }
        setConnected(true);
        setHistory(Array(HISTORY).fill(0));
        return true;
      } catch (err) {
        const name = err instanceof DOMException ? err.name : "";
        if (name === "NotFoundError" || name === "AbortError") {
          setError("No USB device was chosen. Plug in the Elegoo, then tap Connect with USB.");
        } else if (name === "SecurityError") {
          setError("USB access was blocked. Use Chrome or Edge on a computer, and allow the serial port.");
        } else {
          setError(err instanceof Error ? err.message : "Could not open the MyoWare USB connection.");
        }
        setConnected(false);
        return false;
      } finally {
        setConnecting(false);
      }
    },
    [handleGone, ingestEmg, ingestEnv]
  );

  const startRecording = useCallback(() => {
    if (!connected) {
      setError("Connect the MyoWare with USB first.");
      return;
    }
    samplesRef.current = [];
    recordStartRef.current = performance.now();
    recordingRef.current = true;
    setRecordCount(0);
    setRecording(true);
    setError("");
  }, [connected]);

  const stopAndSave = useCallback((userEmail: string) => {
    recordingRef.current = false;
    setRecording(false);
    const samples = samplesRef.current;
    const summary = summarizeMyoWareSamples(samples);
    if (!summary || !userEmail) {
      return "Need a few live EMG numbers first. Flex the muscle, then record again.";
    }
    saveMyoWareRecording({
      id: crypto.randomUUID(),
      userEmail,
      date: new Date().toISOString(),
      deviceName: deviceNameRef.current || "MyoWare 2.0",
      durationSec: summary.durationSec,
      avgEmg: summary.avgEmg,
      maxEmg: summary.maxEmg,
      samples,
    });
    samplesRef.current = [];
    setRecordCount(0);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("revive-myoware-saved"));
    }
    return `Saved ${samples.length} muscle readings · avg ${summary.avgEmg}% · peak ${summary.maxEmg}%.`;
  }, []);

  const value = useMemo(
    () => ({
      usbSupported,
      connecting,
      connected,
      deviceName,
      emg,
      env,
      history,
      error,
      serialLog,
      usbProof,
      recording,
      recordCount,
      connectUsb,
      disconnect,
      startRecording,
      stopAndSave,
    }),
    [
      usbSupported,
      connecting,
      connected,
      deviceName,
      emg,
      env,
      history,
      error,
      serialLog,
      usbProof,
      recording,
      recordCount,
      connectUsb,
      disconnect,
      startRecording,
      stopAndSave,
    ]
  );

  return <MyoWareContext.Provider value={value}>{children}</MyoWareContext.Provider>;
}

export function useMyoWare() {
  const ctx = useContext(MyoWareContext);
  if (!ctx) {
    throw new Error("useMyoWare must be used inside MyoWareProvider");
  }
  return ctx;
}
