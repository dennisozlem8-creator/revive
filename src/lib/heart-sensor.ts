export const HEART_RATE_SERVICE = "heart_rate";
export const HEART_RATE_MEASUREMENT = "heart_rate_measurement";

export function bluetoothHeartRateSupported() {
  return typeof navigator !== "undefined" && Boolean(navigator.bluetooth?.requestDevice);
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

export type HeartRateConnection = {
  deviceName: string;
  disconnect: () => void;
};

type ConnectOptions = {
  acceptAll?: boolean;
  onBpm: (bpm: number) => void;
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

export function heartRateBrowserHelp() {
  if (typeof navigator === "undefined") return "";
  if (!navigator.bluetooth) {
    return "Heart sensors need Chrome or Edge. Safari on iPhone cannot pair Bluetooth straps in the browser.";
  }
  return "Put the strap on, wait a few seconds, then tap Connect. A Chrome window will ask which device to use.";
}
