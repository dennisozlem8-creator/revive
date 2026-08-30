/** Minimal Web Bluetooth types for heart-rate pairing in Chromium browsers. */

interface BluetoothRequestDeviceFilter {
  services?: BluetoothServiceUUID[];
  name?: string;
  namePrefix?: string;
}

interface RequestDeviceOptions {
  filters?: BluetoothRequestDeviceFilter[];
  optionalServices?: BluetoothServiceUUID[];
  acceptAllDevices?: boolean;
}

type BluetoothServiceUUID = number | string;
type BluetoothCharacteristicUUID = number | string;

interface BluetoothRemoteGATTDescriptor {
  uuid: string;
}

interface BluetoothRemoteGATTCharacteristic {
  uuid: string;
  value?: DataView;
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  addEventListener(
    type: "characteristicvaluechanged",
    listener: (ev: Event) => void
  ): void;
  removeEventListener(
    type: "characteristicvaluechanged",
    listener: (ev: Event) => void
  ): void;
}

interface BluetoothRemoteGATTService {
  getCharacteristic(
    characteristic: BluetoothCharacteristicUUID
  ): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTServer {
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothDevice extends EventTarget {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
  addEventListener(
    type: "gattserverdisconnected",
    listener: () => void
  ): void;
  removeEventListener(
    type: "gattserverdisconnected",
    listener: () => void
  ): void;
}

interface Bluetooth {
  getAvailability?(): Promise<boolean>;
  requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
}

interface Navigator {
  bluetooth?: Bluetooth;
}
