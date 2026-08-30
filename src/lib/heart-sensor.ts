export const HEART_RATE_SERVICE = "heart_rate";
export const HEART_RATE_MEASUREMENT = "heart_rate_measurement";
export const WIRED_HEART_BAUD = 115200;

export function bluetoothHeartRateSupported() {
  return typeof navigator !== "undefined" && Boolean(navigator.bluetooth?.requestDevice);
}

export function usbHeartRateSupported() {
  return typeof navigator !== "undefined" && Boolean(navigator.serial?.requestPort);
}

/** Bluetooth Heart Rate Measurement (0x2A37). */
export function parseHeartRateMeasurement(value: DataView): number | null {
  if (value.byteLength < 2) return null;
  const flags = value.getUint8(0);
  const hr16 = (flags & 0x01) === 1;
  const bpm = hr16
    ? value.byteLength >= 3
      ? value.getUint16(1, true)
      : null
    : value.getUint8(1);
  if (bpm == null || !Number.isFinite(bpm) || bpm <= 0 || bpm > 250) return null;
  return bpm;
}

export type SerialHeartSample = {
  bpm?: number;
  raw?: number;
  error?: string;
};

/** Lines from the Arduino sketch: `BPM 72`, `RAW 512`, or `{"bpm":72,"raw":512}`. */
export function parseSerialHeartLine(line: string): SerialHeartSample | null {
  const text = line.trim().replace(/\r$/, "");
  if (!text) return null;
  if (text.startsWith("{")) {
    try {
      const obj = JSON.parse(text) as { bpm?: unknown; raw?: unknown; hr?: unknown };
      const bpmValue = obj.bpm ?? obj.hr;
      const bpm = typeof bpmValue === "number" ? bpmValue : Number(bpmValue);
      const raw = typeof obj.raw === "number" ? obj.raw : Number(obj.raw);
      const sample: SerialHeartSample = {};
      if (Number.isFinite(bpm) && bpm > 0 && bpm <= 250) sample.bpm = Math.round(bpm);
      if (Number.isFinite(raw) && raw >= 0) sample.raw = Math.round(raw);
      return sample.bpm != null || sample.raw != null ? sample : null;
    } catch {
      return null;
    }
  }
  const bpmMatch = text.match(/^(?:BPM|HR|HEART)\s*[:=]?\s*(\d{1,3})$/i);
  if (bpmMatch) {
    const bpm = Number(bpmMatch[1]);
    return bpm > 0 && bpm <= 250 ? { bpm } : null;
  }
  const rawMatch = text.match(/^(?:RAW|ADC|SIG|VALUE)\s*[:=]?\s*(\d{1,8})$/i);
  if (rawMatch) {
    return { raw: Number(rawMatch[1]) };
  }
  if (/^ERR\b/i.test(text)) {
    return { error: text.replace(/^ERR\s*/i, "").trim() || text };
  }
  if (/^\d{1,3}$/.test(text)) {
    const bpm = Number(text);
    return bpm > 0 && bpm <= 250 ? { bpm } : null;
  }
  return null;
}

export type HeartRateConnection = {
  deviceName: string;
  source: "bluetooth" | "usb";
  disconnect: () => void;
};

type ConnectOptions = {
  acceptAll?: boolean;
  port?: SerialPort;
  onBpm: (bpm: number) => void;
  onRaw?: (raw: number) => void;
  onErrorLine?: (message: string) => void;
  onLine?: (line: string) => void;
  onDisconnect: () => void;
};

function requestFilters(): BluetoothRequestDeviceFilter[] {
  return [
    { services: [HEART_RATE_SERVICE] },
    { namePrefix: "Polar" },
    { namePrefix: "TICKR" },
    { namePrefix: "Wahoo" },
    { namePrefix: "HRM" },
    { namePrefix: "Coospo" },
    { namePrefix: "Magene" },
    { namePrefix: "Garmin" },
    { namePrefix: "WHOOP" },
    { namePrefix: "Scosche" },
    { namePrefix: "Coros" },
  ];
}

export async function connectHeartRateSensor(
  options: ConnectOptions
): Promise<HeartRateConnection> {
  if (!navigator.bluetooth?.requestDevice) {
    throw new Error("This browser cannot talk to Bluetooth heart sensors. Use Chrome or Edge on a computer, or Chrome on Android.");
  }

  const device = options.acceptAll
    ? await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [HEART_RATE_SERVICE],
      })
    : await navigator.bluetooth.requestDevice({
        filters: requestFilters(),
        optionalServices: [HEART_RATE_SERVICE],
      });

  const server = await device.gatt?.connect();
  if (!server) {
    throw new Error("The sensor was found, but it would not open a connection. Wake the strap and try again.");
  }

  const service = await server.getPrimaryService(HEART_RATE_SERVICE);
  const characteristic = await service.getCharacteristic(HEART_RATE_MEASUREMENT);

  const onValue = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic | null;
    const view = target?.value;
    if (!view) return;
    const bpm = parseHeartRateMeasurement(view);
    if (bpm != null) options.onBpm(bpm);
  };

  const onGone = () => {
    characteristic.removeEventListener("characteristicvaluechanged", onValue);
    device.removeEventListener("gattserverdisconnected", onGone);
    options.onDisconnect();
  };

  characteristic.addEventListener("characteristicvaluechanged", onValue);
  device.addEventListener("gattserverdisconnected", onGone);
  await characteristic.startNotifications();

  return {
    deviceName: device.name?.trim() || "Heart sensor",
    source: "bluetooth",
    disconnect: () => {
      characteristic.removeEventListener("characteristicvaluechanged", onValue);
      device.removeEventListener("gattserverdisconnected", onGone);
      try {
        characteristic.stopNotifications().catch(() => undefined);
      } catch {
        /* ignore */
      }
      try {
        device.gatt?.disconnect();
      } catch {
        /* ignore */
      }
    },
  };
}

export function requestUsbHeartPort() {
  if (!navigator.serial?.requestPort) {
    throw new Error(usbBlockReason());
  }
  return navigator.serial.requestPort();
}

export async function connectWiredHeartSensor(
  options: ConnectOptions
): Promise<HeartRateConnection> {
  const port = options.port ?? (await requestUsbHeartPort());
  try {
    await port.open({ baudRate: WIRED_HEART_BAUD });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const name = error instanceof DOMException ? error.name : "";
    if (name === "InvalidStateError") {
      /* already open from a previous try */
    } else if (name === "NetworkError" || /failed to open/i.test(message)) {
      throw new Error(
        "Chrome could not open the USB port. Close Arduino Serial Monitor and Arduino IDE, unplug the Elegoo, plug it back in, then tap Connect with USB again. Pick the Arduino / USB Serial Device in the Chrome list."
      );
    } else {
      throw error;
    }
  }
  const decoder = new TextDecoder();
  let buffer = "";
  let stopped = false;
  const reader = port.readable?.getReader();
  if (!reader) {
    await port.close().catch(() => undefined);
    throw new Error("The USB port opened, but this browser could not read from it.");
  }

  const onGone = () => {
    if (stopped) return;
    stopped = true;
    options.onDisconnect();
  };
  port.addEventListener("disconnect", onGone);

  void (async () => {
    try {
      while (!stopped) {
        const result = await reader.read();
        if (result.done) break;
        if (!result.value) continue;
        buffer += decoder.decode(result.value, { stream: true });
        let nl = buffer.indexOf("\n");
        while (nl >= 0) {
          const line = buffer.slice(0, nl).replace(/\r$/, "").trim();
          buffer = buffer.slice(nl + 1);
          if (line) options.onLine?.(line);
          const sample = parseSerialHeartLine(line);
          if (sample?.bpm != null) options.onBpm(sample.bpm);
          if (sample?.raw != null) options.onRaw?.(sample.raw);
          if (sample?.error) options.onErrorLine?.(sample.error);
          nl = buffer.indexOf("\n");
        }
      }
    } catch {
      /* port closed */
    } finally {
      try {
        reader.releaseLock();
      } catch {
        /* ignore */
      }
      onGone();
    }
  })();

  const info = port.getInfo?.() ?? {};
  const label =
    info.usbVendorId != null
      ? `USB heart sensor (${info.usbVendorId.toString(16)})`
      : "USB heart sensor";

  return {
    deviceName: label,
    source: "usb",
    disconnect: () => {
      stopped = true;
      port.removeEventListener("disconnect", onGone);
      void (async () => {
        try {
          await reader.cancel();
        } catch {
          /* ignore */
        }
        try {
          await port.close();
        } catch {
          /* ignore */
        }
      })();
    },
  };
}

export function usbBlockReason() {
  if (typeof navigator === "undefined") return "";
  if (usbHeartRateSupported()) return "";
  const ua = navigator.userAgent;
  const iPhone = /iPhone|iPad|iPod/i.test(ua);
  const safari = /Safari/i.test(ua) && !/Chrome|CriOS|Edg|Firefox|Chromium/i.test(ua);
  if (iPhone) {
    return "You are on a phone. The Elegoo USB cable cannot connect here. Use the Mac or Windows computer where Arduino IDE is installed, and open Google Chrome — not this phone.";
  }
  if (safari) {
    return "You are in Safari. Safari cannot talk to USB. On this same computer, open Google Chrome (the round red-yellow-green icon), go to https://www.revivemotion.ai/heart, then tap Connect with USB.";
  }
  return "This browser cannot use USB. Open Google Chrome or Microsoft Edge on the computer the Elegoo is plugged into.";
}

export function heartRateBrowserHelp() {
  if (typeof navigator === "undefined") return "";
  const blocked = usbBlockReason();
  if (blocked) return blocked;
  if (usbHeartRateSupported()) {
    return "Close Serial Monitor in Arduino IDE. Tap Connect with USB, then pick Arduino Uno in the Chrome list. Rest a finger on the MAX30102 lights.";
  }
  if (bluetoothHeartRateSupported()) {
    return "Put the strap on, wait a few seconds, then tap Connect. A Chrome window will ask which device to use.";
  }
  return usbBlockReason();
}
