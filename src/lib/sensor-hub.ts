import {
  connectSerialPort,
  disconnectSerialPort,
  isSerialAvailable,
  setSerialDataHandler,
  type SerialSensorPayload,
} from "./serial-sensor";
import {
  estimateBpmFromActivity,
  isValidBpm,
  parseBpmFromBuffer,
  parseSpO2FromBuffer,
  simulateMax30102Bpm,
  smoothBpm,
  type HeartRateSource,
} from "./heart-rate";
import { nextRomSnapshot, type RomRecordingSnapshot, type RomRecordingStep } from "./rom-session";

export type SensorReading = {
  angle: number;
  emg: number;
  hr: number;
  spo2?: number;
  timestamp: number;
  source: "bluetooth" | "simulated" | "serial";
  hrSource: HeartRateSource;
};

export type SensorDeviceKind = "rom" | "pulse" | "combo";

export type SensorConnection = {
  deviceId: string;
  deviceName: string;
  source: "bluetooth" | "simulated" | "serial";
  kind: SensorDeviceKind;
  hasHeartRate: boolean;
  connectedAt: string;
};

const SENSOR_KEY = "revive-motion-sensor";

/** Revive Motion BLE service — angle + MAX30102 heart rate on same service */
export const REVIVE_SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb";
export const REVIVE_ANGLE_CHAR_UUID = "0000fff1-0000-1000-8000-00805f9b34fb";
/** 1 byte BPM from ESP32 + MAX30102 */
export const REVIVE_HR_CHAR_UUID = "0000fff2-0000-1000-8000-00805f9b34fb";
/** 1 byte SpO2 % (optional, MAX30102) */
export const REVIVE_SPO2_CHAR_UUID = "0000fff3-0000-1000-8000-00805f9b34fb";

export const DEMO_DEVICES = [
  { id: "rm-ankle-01", name: "Revive Motion · Ankle Sensor", kind: "rom" as const },
  { id: "rm-knee-02", name: "Revive Motion · Knee Sensor", kind: "rom" as const },
  { id: "rm-flex-03", name: "Revive Motion · Flex Band", kind: "rom" as const },
  {
    id: "rm-pulse-04",
    name: "Revive Motion · Pulse (MAX30102)",
    kind: "pulse" as const,
  },
];

let activeHrCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
let bleListener: ((reading: SensorReading) => void) | null = null;
let latestSensorAngle = 0;
let latestSensorHr: number | null = null;
let latestSensorSpO2: number | null = null;
let hrSource: HeartRateSource = "none";

export function loadSensorConnection(): SensorConnection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SENSOR_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SensorConnection;
    return {
      ...parsed,
      kind: parsed.kind ?? "rom",
      hasHeartRate: parsed.hasHeartRate ?? parsed.kind === "pulse",
    };
  } catch {
    return null;
  }
}

export function saveSensorConnection(conn: SensorConnection | null) {
  if (typeof window === "undefined") return;
  if (conn) localStorage.setItem(SENSOR_KEY, JSON.stringify(conn));
  else localStorage.removeItem(SENSOR_KEY);
}

export function isBluetoothAvailable(): boolean {
  return typeof navigator !== "undefined" && "bluetooth" in navigator;
}

export { isSerialAvailable };

export function getLiveVitals(): {
  hr: number | null;
  spo2: number | null;
  hrSource: HeartRateSource;
} {
  return { hr: latestSensorHr, spo2: latestSensorSpO2, hrSource };
}

function parseAngleFromBuffer(value: DataView): number {
  if (value.byteLength >= 2) {
    const raw = value.getUint16(0, true);
    return Math.min(180, Math.max(0, raw / 10));
  }
  return Math.min(180, Math.max(0, value.getUint8(0)));
}

function buildReading(angle: number, targetAngle: number, tick: number): SensorReading {
  const conn = loadSensorConnection();
  const exertion = targetAngle > 0 ? angle / targetAngle : 0;

  let hr: number;
  let readingHrSource: HeartRateSource;
  let spo2: number | undefined;

  if (latestSensorHr !== null && (hrSource === "max30102" || conn?.hasHeartRate)) {
    hr = latestSensorHr;
    readingHrSource = hrSource === "max30102" ? "max30102" : "estimated";
  } else if (conn?.kind === "pulse" || conn?.hasHeartRate) {
    hr = simulateMax30102Bpm(tick, exertion);
    readingHrSource = "simulated";
  } else {
    hr = estimateBpmFromActivity(angle, targetAngle);
    readingHrSource = "estimated";
  }

  if (latestSensorSpO2 !== null) spo2 = latestSensorSpO2;

  const readingSource: SensorReading["source"] =
    conn?.source === "bluetooth"
      ? "bluetooth"
      : conn?.source === "serial"
        ? "serial"
        : "simulated";

  return {
    angle: conn?.source === "serial" && latestSensorAngle > 0 ? latestSensorAngle : angle,
    emg: Math.round(35 + exertion * 40),
    hr,
    spo2,
    timestamp: Date.now(),
    source: readingSource,
    hrSource: readingHrSource,
  };
}

async function subscribeHeartRate(
  server: BluetoothRemoteGATTServer
): Promise<boolean> {
  try {
    const service = await server.getPrimaryService(REVIVE_SERVICE_UUID);
    const hrChar = await service.getCharacteristic(REVIVE_HR_CHAR_UUID);
    activeHrCharacteristic = hrChar;

    await hrChar.startNotifications();
    hrChar.addEventListener("characteristicvaluechanged", (event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const value = target.value;
      if (!value) return;
      const bpm = parseBpmFromBuffer(value);
      if (bpm !== null) {
        latestSensorHr = smoothBpm(latestSensorHr, bpm);
        hrSource = "max30102";
      }
      pushLiveReading();
    });

    try {
      const spo2Char = await service.getCharacteristic(REVIVE_SPO2_CHAR_UUID);
      await spo2Char.startNotifications();
      spo2Char.addEventListener("characteristicvaluechanged", (event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (!value) return;
        const spo2 = parseSpO2FromBuffer(value);
        if (spo2 !== null) latestSensorSpO2 = spo2;
      });
    } catch {
      /* SpO2 optional */
    }

    return true;
  } catch {
    return false;
  }
}

async function subscribeAngle(server: BluetoothRemoteGATTServer): Promise<boolean> {
  try {
    const service = await server.getPrimaryService(REVIVE_SERVICE_UUID);
    const characteristic = await service.getCharacteristic(REVIVE_ANGLE_CHAR_UUID);

    await characteristic.startNotifications();
    characteristic.addEventListener("characteristicvaluechanged", (event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const value = target.value;
      if (!value) return;
      latestSensorAngle = parseAngleFromBuffer(value);
      pushLiveReading();
    });
    return true;
  } catch {
    return false;
  }
}

let streamTargetAngle = 90;

function pushLiveReading() {
  if (!bleListener) return;
  bleListener(buildReading(latestSensorAngle, streamTargetAngle, 0));
}

function handleSerialPayload(payload: SerialSensorPayload) {
  if (payload.hr !== undefined && isValidBpm(payload.hr)) {
    latestSensorHr = smoothBpm(latestSensorHr, payload.hr);
    hrSource = "max30102";
  }
  if (payload.spo2 !== undefined) latestSensorSpO2 = payload.spo2;
  if (payload.angle !== undefined) latestSensorAngle = payload.angle;
  pushLiveReading();
}

function resetSensorVitals() {
  latestSensorHr = null;
  latestSensorSpO2 = null;
  latestSensorAngle = 0;
  hrSource = "none";
}

export async function tryConnectSerial(): Promise<SensorConnection | null> {
  resetSensorVitals();
  setSerialDataHandler(handleSerialPayload);

  const portName = await connectSerialPort();
  if (!portName) {
    setSerialDataHandler(null);
    return null;
  }

  const conn: SensorConnection = {
    deviceId: `serial-${Date.now()}`,
    deviceName: portName,
    source: "serial",
    kind: "pulse",
    hasHeartRate: true,
    connectedAt: new Date().toISOString(),
  };
  saveSensorConnection(conn);
  return conn;
}

export async function tryConnectBluetooth(): Promise<SensorConnection | null> {
  if (!isBluetoothAvailable() || !navigator.bluetooth) return null;

  await disconnectSerialPort();
  resetSensorVitals();

  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [REVIVE_SERVICE_UUID] }],
      optionalServices: [REVIVE_SERVICE_UUID],
    });

    const server = await device.gatt?.connect();
    if (!server) return null;

    const hasHr = await subscribeHeartRate(server);
    const hasAngle = await subscribeAngle(server);

    if (!hasHr && !hasAngle) return null;

    const kind: SensorDeviceKind =
      hasHr && hasAngle ? "combo" : hasHr ? "pulse" : "rom";

    const conn: SensorConnection = {
      deviceId: device.id,
      deviceName: device.name ?? (hasHr ? "MAX30102 Pulse" : "BLE Sensor"),
      source: "bluetooth",
      kind,
      hasHeartRate: hasHr,
      connectedAt: new Date().toISOString(),
    };
    saveSensorConnection(conn);
    return conn;
  } catch {
    return null;
  }
}

export async function connectSimulatedDevice(
  deviceId: string,
  deviceName: string,
  kind: SensorDeviceKind = "rom"
): Promise<SensorConnection> {
  await new Promise((r) => setTimeout(r, 1500));
  const conn: SensorConnection = {
    deviceId,
    deviceName,
    source: "simulated",
    kind,
    hasHeartRate: kind === "pulse" || kind === "combo",
    connectedAt: new Date().toISOString(),
  };
  saveSensorConnection(conn);
  return conn;
}

export function disconnectSensor() {
  activeHrCharacteristic = null;
  bleListener = null;
  resetSensorVitals();
  void disconnectSerialPort();
  setSerialDataHandler(null);
  saveSensorConnection(null);
}

export function isSensorConnected(): boolean {
  return loadSensorConnection() !== null;
}

export type ReadingListener = (reading: SensorReading) => void;

export function startSensorStream(
  targetAngle: number,
  listener: ReadingListener,
  intervalMs = 800
): () => void {
  streamTargetAngle = targetAngle;
  const conn = loadSensorConnection();
  let snapshot: RomRecordingSnapshot = {
    tick: 0,
    angle: 0,
    peakAngle: 0,
    decliningTicks: 0,
    reps: 0,
    lastRepTick: -99,
    emg: 42,
    hr: 72,
  };

  if (conn?.source === "bluetooth") {
    if (conn.kind === "pulse") {
      let pulseSnapshot: RomRecordingSnapshot = {
        tick: 0,
        angle: 0,
        peakAngle: 0,
        decliningTicks: 0,
        reps: 0,
        lastRepTick: -99,
        emg: 42,
        hr: 72,
      };
      const interval = setInterval(() => {
        const step = nextRomSnapshot(pulseSnapshot, targetAngle, 10);
        pulseSnapshot = step;
        const reading = buildReading(step.angle, targetAngle, step.tick);
        listener({
          ...reading,
          emg: step.emg,
          hr: latestSensorHr ?? reading.hr,
          hrSource: latestSensorHr !== null ? "max30102" : reading.hrSource,
        });
      }, intervalMs);
      return () => clearInterval(interval);
    }

    bleListener = (reading) => listener(reading);
    return () => {
      bleListener = null;
    };
  }

  if (conn?.source === "serial") {
    bleListener = (reading) => listener({ ...reading, source: "serial" });

    const interval = setInterval(() => {
      const step = nextRomSnapshot(snapshot, targetAngle, 10);
      snapshot = step;
      const angle = latestSensorAngle > 0 ? latestSensorAngle : step.angle;
      const reading = buildReading(angle, targetAngle, step.tick);
      listener({
        ...reading,
        angle,
        emg: step.emg,
        hr: latestSensorHr ?? reading.hr,
        hrSource: latestSensorHr !== null ? "max30102" : reading.hrSource,
        source: "serial",
      });
    }, intervalMs);

    return () => {
      bleListener = null;
      clearInterval(interval);
    };
  }

  const interval = setInterval(() => {
    const step = nextRomSnapshot(snapshot, targetAngle, 10);
    snapshot = step;

    const reading = buildReading(step.angle, targetAngle, step.tick);
    listener({
      ...reading,
      emg: step.emg,
      hr: conn?.hasHeartRate ? reading.hr : step.hr,
      hrSource: conn?.hasHeartRate ? reading.hrSource : "estimated",
    });
  }, intervalMs);

  return () => clearInterval(interval);
}

export function applyReadingToRom(
  prev: RomRecordingSnapshot,
  reading: SensorReading,
  targetAngle: number,
  targetReps: number
): RomRecordingStep {
  const tick = prev.tick + 1;
  const angle = reading.angle;
  const peakAngle = Math.max(prev.peakAngle, angle);
  const declining = angle < prev.angle - 2;
  const decliningTicks = declining ? prev.decliningTicks + 1 : angle >= peakAngle * 0.95 ? prev.decliningTicks : 0;

  let reps = prev.reps;
  let lastRepTick = prev.lastRepTick;
  const repCooldown = 3;
  if (angle >= targetAngle * 0.88 && tick - lastRepTick >= repCooldown) {
    reps = Math.min(targetReps, reps + 1);
    lastRepTick = tick;
  }

  const peakedEnough = peakAngle >= targetAngle * 0.78;
  const movementComplete = peakedEnough && decliningTicks >= 3;
  const repsComplete = reps >= targetReps && peakedEnough;
  const timeout = tick >= 40;
  const shouldStop = movementComplete || repsComplete || timeout;

  return {
    tick,
    angle,
    peakAngle,
    decliningTicks,
    reps,
    lastRepTick,
    emg: reading.emg,
    hr: reading.hr,
    shouldStop,
    stopReason: movementComplete
      ? "Movement complete — peak ROM captured"
      : repsComplete
        ? "Target reps reached"
        : timeout
          ? "Recording window complete"
          : null,
  };
}
