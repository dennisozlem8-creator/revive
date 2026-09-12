import { usbBlockReason, usbHeartRateSupported, usbPortLabel } from "@/lib/heart-sensor";

export const WIRED_MYOWARE_BAUD = 115200;

export type SerialMyoWareSample = {
  env?: number;
  emg?: number;
  hello?: boolean;
  board?: string;
  chip?: string;
};

export type UsbMyoWareProof = {
  board: string | null;
  chip: string | null;
  started: boolean;
  lastEnv: number | null;
  lastEmg: number | null;
  lastPacketAt: number | null;
  packetCount: number;
};

export const EMPTY_MYOWARE_PROOF: UsbMyoWareProof = {
  board: null,
  chip: null,
  started: false,
  lastEnv: null,
  lastEmg: null,
  lastPacketAt: null,
  packetCount: 0,
};

export function applyMyoWareSampleToProof(
  proof: UsbMyoWareProof,
  sample: SerialMyoWareSample,
  now = Date.now()
): UsbMyoWareProof {
  const next = { ...proof };
  if (sample.board) next.board = sample.board;
  if (sample.chip) next.chip = sample.chip;
  if (sample.hello) {
    next.started = true;
    next.chip = next.chip ?? "MyoWare 2.0";
    next.board = next.board ?? "Elegoo Uno R3";
  }
  if (sample.env != null) {
    next.lastEnv = sample.env;
    next.lastPacketAt = now;
    next.packetCount += 1;
    next.started = true;
  }
  if (sample.emg != null) {
    next.lastEmg = sample.emg;
    next.lastPacketAt = now;
    next.packetCount += 1;
    next.started = true;
  }
  return next;
}

export function myoWareHasSignal(proof: UsbMyoWareProof) {
  return (proof.lastEnv ?? 0) > 8 || (proof.lastEmg ?? 0) > 1;
}

export function parseSerialMyoWareLine(line: string): SerialMyoWareSample | null {
  const text = line.trim().replace(/\r$/, "");
  if (!text) return null;
  if (/^HELLO\b/i.test(text) && /MYOWARE/i.test(text)) {
    return {
      hello: true,
      chip: "MyoWare 2.0",
      board: /ELEGOO/i.test(text) ? "Elegoo Uno R3" : undefined,
    };
  }
  if (/^SRC\s+/i.test(text)) {
    return { board: "Elegoo Uno R3", hello: true };
  }
  if (/^CHIP\s+/i.test(text)) {
    return { chip: "MyoWare 2.0", hello: true };
  }
  if (/^PONG\b/i.test(text) && /MYOWARE/i.test(text)) {
    return { hello: true, chip: "MyoWare 2.0" };
  }
  const envMatch = text.match(/^(?:ENV|ADC)\s*[:=]?\s*(\d{1,4})$/i);
  if (envMatch) {
    return { env: Number(envMatch[1]), hello: true };
  }
  const emgMatch = text.match(/^(?:EMG|EFFORT)\s*[:=]?\s*(\d{1,3})$/i);
  if (emgMatch) {
    return { emg: Math.min(100, Number(emgMatch[1])), hello: true };
  }
  return null;
}

export type MyoWareConnection = {
  deviceName: string;
  disconnect: () => void;
};

type ConnectOptions = {
  port?: SerialPort;
  onEnv?: (env: number) => void;
  onEmg: (emg: number) => void;
  onLine?: (line: string) => void;
  onDisconnect: () => void;
};

export function requestUsbMyoWarePort() {
  if (!navigator.serial?.requestPort) {
    throw new Error(usbBlockReason().replace("/heart", "/muscle") || "This browser cannot use USB.");
  }
  return navigator.serial.requestPort();
}

export async function connectWiredMyoWare(
  options: ConnectOptions
): Promise<MyoWareConnection> {
  const port = options.port ?? (await requestUsbMyoWarePort());
  try {
    await port.open({ baudRate: WIRED_MYOWARE_BAUD });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const name = error instanceof DOMException ? error.name : "";
    if (name === "InvalidStateError") {
      /* already open */
    } else if (name === "NetworkError" || /failed to open/i.test(message)) {
      throw new Error(
        "Chrome could not open the USB port. Close Serial Monitor, tap Disconnect on the Heart page if that tab is open, unplug the Elegoo, plug it back in, then tap Connect with USB."
      );
    } else {
      throw error;
    }
  }
  try {
    await port.setSignals?.({ dataTerminalReady: true, requestToSend: false });
  } catch {
    /* some adapters ignore DTR */
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

  const pingUsb = async () => {
    if (stopped || !port.writable) return;
    const writer = port.writable.getWriter();
    try {
      await writer.write(new TextEncoder().encode("PING\n"));
    } catch {
      /* ignore */
    } finally {
      try {
        writer.releaseLock();
      } catch {
        /* ignore */
      }
    }
  };
  const pingTimer = setTimeout(() => {
    void pingUsb();
  }, 1200);

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
          const sample = parseSerialMyoWareLine(line);
          if (sample?.env != null) options.onEnv?.(sample.env);
          if (sample?.emg != null) options.onEmg(sample.emg);
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
  return {
    deviceName: usbPortLabel(info),
    disconnect: () => {
      stopped = true;
      clearTimeout(pingTimer);
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

export function myoWareBrowserHelp() {
  if (typeof navigator === "undefined") return "";
  if (!usbHeartRateSupported()) {
    return usbBlockReason().replace("/heart", "/muscle");
  }
  return "Close Serial Monitor. Tap Connect with USB, pick the Arduino, then flex the muscle under the pads.";
}
