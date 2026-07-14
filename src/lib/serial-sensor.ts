import { isValidBpm } from "./heart-rate";

export type SerialSensorPayload = {
  hr?: number;
  spo2?: number;
  angle?: number;
};

let serialPort: SerialPort | null = null;
let serialReadActive = false;
let lineBuffer = "";
let dataHandler: ((payload: SerialSensorPayload) => void) | null = null;

export function isSerialAvailable(): boolean {
  return typeof navigator !== "undefined" && "serial" in navigator;
}

/** Parse JSON line or simple "HR:72,SPO2:98" text from Arduino */
export function parseSerialLine(line: string): SerialSensorPayload | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("//")) return null;

  if (trimmed.startsWith("{")) {
    try {
      const json = JSON.parse(trimmed) as Record<string, unknown>;
      const payload: SerialSensorPayload = {};
      if (typeof json.hr === "number") payload.hr = json.hr;
      if (typeof json.spo2 === "number") payload.spo2 = json.spo2;
      if (typeof json.angle === "number") payload.angle = json.angle;
      return Object.keys(payload).length > 0 ? payload : null;
    } catch {
      return null;
    }
  }

  const payload: SerialSensorPayload = {};
  const hr = trimmed.match(/HR[:\s=]+(\d+)/i);
  const spo2 = trimmed.match(/SPO2[:\s=]+(\d+)/i);
  const angle = trimmed.match(/ANGLE[:\s=]+(\d+)/i);
  if (hr) payload.hr = Number(hr[1]);
  if (spo2) payload.spo2 = Number(spo2[1]);
  if (angle) payload.angle = Number(angle[1]);
  return Object.keys(payload).length > 0 ? payload : null;
}

export function setSerialDataHandler(handler: ((payload: SerialSensorPayload) => void) | null) {
  dataHandler = handler;
}

function emitPayload(payload: SerialSensorPayload) {
  if (!dataHandler) return;
  const cleaned: SerialSensorPayload = {};
  if (payload.hr !== undefined && isValidBpm(payload.hr)) {
    cleaned.hr = payload.hr;
  }
  if (payload.spo2 !== undefined && payload.spo2 >= 70 && payload.spo2 <= 100) {
    cleaned.spo2 = payload.spo2;
  }
  if (payload.angle !== undefined && payload.angle >= 0 && payload.angle <= 180) {
    cleaned.angle = payload.angle;
  }
  if (Object.keys(cleaned).length > 0) dataHandler(cleaned);
}

async function readSerialLoop(port: SerialPort) {
  if (!port.readable) return;
  const reader = port.readable.getReader();
  const decoder = new TextDecoder();
  serialReadActive = true;

  try {
    while (serialReadActive) {
      const { value, done } = await reader.read();
      if (done) break;
      lineBuffer += decoder.decode(value, { stream: true });
      const lines = lineBuffer.split(/\r?\n/);
      lineBuffer = lines.pop() ?? "";
      for (const line of lines) {
        const payload = parseSerialLine(line);
        if (payload) emitPayload(payload);
      }
    }
  } catch {
    /* port closed */
  } finally {
    reader.releaseLock();
  }
}

export async function connectSerialPort(): Promise<string | null> {
  if (!isSerialAvailable() || !navigator.serial) return null;

  await disconnectSerialPort();

  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    serialPort = port;
    void readSerialLoop(port);
    return "Arduino USB";
  } catch {
    return null;
  }
}

export async function disconnectSerialPort() {
  serialReadActive = false;
  dataHandler = null;
  lineBuffer = "";

  if (serialPort) {
    try {
      if (serialPort.readable?.locked) {
        const reader = serialPort.readable.getReader();
        await reader.cancel();
        reader.releaseLock();
      }
      await serialPort.close();
    } catch {
      /* already closed */
    }
    serialPort = null;
  }
}
