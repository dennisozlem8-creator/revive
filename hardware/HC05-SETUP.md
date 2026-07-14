# HC-05 Bluetooth setup (wireless serial)

The **HC-05** is **classic Bluetooth** (not BLE). It does **not** work with the app’s **Real BLE** button — that is for ESP32 only.

Instead, HC-05 creates a **virtual COM port** on your PC. The app connects through **Web Serial**, same as USB, but wireless.

---

## What you need

| Part | Role |
|------|------|
| Elegoo Uno R3 / Arduino Uno | Reads MAX30102, sends JSON over serial |
| MAX30102 | Heart rate sensor (I2C) |
| HC-05 module | Wireless serial bridge to PC |
| 9V battery or USB power bank | Powers Arduino when not plugged into PC |

---

## Wiring

### MAX30102 → Arduino (same as USB build)

| MAX30102 | Arduino Uno |
|----------|---------------|
| VCC / VIN | **5V** |
| GND | GND |
| SDA | **A4** |
| SCL | **A5** |

### HC-05 → Arduino

| HC-05 pin | Arduino Uno |
|-----------|-------------|
| VCC | **5V** |
| GND | GND |
| **TXD** | **Pin 0** (RX) — HC-05 transmits *into* Arduino receive |
| **RXD** | **Pin 1** (TX) — use a **voltage divider** if your HC-05 is 3.3V logic: |
| | Arduino TX → **1 kΩ** → HC-05 RXD |
| | HC-05 RXD → **2 kΩ** → GND |
| KEY / EN | **5V** (keeps module in data mode, not AT config mode) |

```
MAX30102          Arduino Uno          HC-05
────────          ───────────          ─────
  VCC ─────────── 5V ──────────────── VCC
  GND ─────────── GND ─────────────── GND
  SDA ─────────── A4
  SCL ─────────── A5
                  Pin 0 (RX) ◄────── TXD
                  Pin 1 (TX) ──────► RXD (via 1k/2k divider)
                  5V ────────────── KEY/EN
```

> **Upload warning:** Pins 0 and 1 are shared with USB. **Disconnect HC-05 RX** (or unplug HC-05 power) before uploading a new sketch, then reconnect after upload.

---

## Pair HC-05 with Windows

1. Power the Arduino (battery or USB — USB only for upload, not required while running).
2. On Windows: **Settings → Bluetooth & devices → Add device**.
3. Select **HC-05** (default PIN is often **1234** or **0000**).
4. Open **Device Manager → Ports (COM & LPT)**.
5. Note the new port, e.g. **COM7** — “Standard Serial over Bluetooth link”.

---

## Arduino firmware

| Sketch | Use when |
|--------|----------|
| `arduino-max30102-hc05/arduino-max30102-hc05.ino` | Real MAX30102 + HC-05 (9600 baud) |
| `arduino-hc05-demo/arduino-hc05-demo.ino` | Test wireless link only (fake BPM) |
| `arduino-max30102-usb/arduino-max30102-usb.ino` | USB cable only (115200 baud) |

1. Install **SparkFun MAX3010x** library (for real sensor sketch).
2. Board: **Arduino Uno**, upload the HC-05 sketch.
3. **Close Arduino Serial Monitor** — only one program can use the port.

---

## Connect in Revive Motion

1. Open **Chrome or Edge** at `http://localhost:3000`.
2. Go to **Session**.
3. Tap **HC-05 Bluetooth** (not “Real BLE”).
4. Pick the **Bluetooth COM port** (e.g. COM7).
5. Rest finger on MAX30102 — BPM should update within ~10 seconds.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| HC-05 not in Windows Bluetooth list | Hold button on module while powering on (some modules enter pair mode) |
| No COM port after pairing | Remove device in Bluetooth settings, pair again; check Device Manager |
| App connects but no BPM | Baud mismatch — firmware uses **9600**; see AT commands below |
| Garbled text | Wrong baud — set HC-05 to 9600 or re-upload HC-05 sketch |
| Can’t upload sketch | Disconnect HC-05 from pins 0/1 during upload |
| `no_i2c_devices` | Fix MAX30102 wiring first (see `TROUBLESHOOTING.md`) |

---

## Change HC-05 baud (optional)

Default is **9600** (matches our HC-05 firmware). To use **115200**:

1. Wire HC-05 **KEY/EN → 5V**, power on.
2. Open Serial Monitor at **38400** (HC-05 AT mode baud on many modules).
3. Send: `AT+UART=1,115200,0,0`
4. Re-upload `arduino-max30102-usb.ino` (115200) and use **USB Cable** button at 115200, **or** change that sketch’s `Serial.begin` to match.

To check current baud: send `AT+UART?` in AT mode.

---

## HC-05 vs Real BLE in the app

| Button | Hardware | Protocol |
|--------|----------|----------|
| **HC-05 Bluetooth** | Arduino + HC-05 | Classic BT → COM port → Web Serial |
| **Real BLE** | ESP32 + MAX30102 | Web Bluetooth (BLE) |
| **USB Cable** | Arduino USB | Web Serial direct |
