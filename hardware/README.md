# Sensors → Revive Motion

Three ways to get live data into the app:

| Method | Hardware | Best for |
|--------|----------|----------|
| **USB Cable** | Arduino + MAX30102 | No ESP32 — plug Arduino into PC |
| **Real BLE** | ESP32 + MAX30102 | Wireless |
| **Scan (demo)** | None | Testing UI without hardware |

---

## Option A: Arduino + USB (recommended without ESP32)

Works with **Arduino Uno**, **Elegoo Uno R3**, and other Uno-compatible boards (same pinout).

The MAX30102 uses **I2C**. Your board reads it and sends heart rate over the **USB cable** to the browser (Web Serial API).

### Breadboard wiring (Elegoo Uno R3 / Arduino Uno)

| MAX30102 pin | Elegoo Uno R3 |
|--------------|---------------|
| VIN / VCC | **5V** (try first — LED on module should light up) |
| GND | GND |
| SDA | **A4** |
| SCL | **A5** |

> **Power tip:** If the module’s **red LED only turns on at 5V** (not 3.3V), always use **5V** on VCC. These boards have an onboard regulator; 3.3V at VIN is often too low to power the chip.

```
MAX30102          Elegoo Uno R3
────────          ─────────────
  VIN ─────────── 3.3V
  GND ─────────── GND
  SDA ─────────── A4
  SCL ─────────── A5
    USB-B cable ──────► Your PC
```

> **Elegoo note:** Most Elegoo Uno R3 boards use a **CH340** USB chip. If your PC does not see a COM port, install the [CH340 driver](https://www.wch-ic.com/downloads/CH341SER_EXE.html) (Windows), then replug the board.

### Arduino setup

1. Install **Arduino IDE**.
2. Library Manager → install **SparkFun MAX3010x Pulse and Proximity Sensor Library**.
3. Open `arduino-max30102-usb.ino` and upload to your board.
4. **Close Arduino Serial Monitor** after upload (only one program can use the port at a time).
5. Open Serial Monitor once to verify you see lines like: `{"hr":72,"spo2":98}`

### Connect in the app

1. Run Revive Motion in **Chrome or Edge** (`localhost:3000`).
2. Go to **Session**.
3. Tap **USB Cable**.
4. Pick your Arduino COM port (e.g. COM3 / USB Serial).
5. Rest finger on MAX30102 — **BPM** updates live.

### Troubleshooting USB

| Problem | Fix |
|---------|-----|
| No COM port in picker | Install CH340/CP2102 USB drivers for clone Arduinos |
| "Connection failed" | Close Arduino Serial Monitor and any other serial tools |
| No BPM readings | Check 3.3V wiring; finger covering LED; wait 10 seconds |
| `MAX30102 not found` | See checklist below — re-upload sketch with I2C scanner |

### MAX30102 not found — fix checklist (Elegoo Uno R3)

1. **Power:** VIN → **3.3V** pin (between 3.3V and 5V headers). Never 5V.
2. **I2C pins:** SDA → **A4**, SCL → **A5** (or the **SDA/SCL** pins next to AREF — same thing).
   - Do **not** use digital D4/D5 unless you know your board maps I2C there (Uno does not).
3. **Labels on module:** Some boards say **SDI** (=SDA) and **SCK** (=SCL). Ignore **MID** and **RD** — those are LEDs.
4. **Breadboard:** Push wires and module pins firmly all the way in. Try a different row.
5. **Swap test:** If still failing, swap SDA and SCL once.
6. **Re-upload** `arduino-max30102-usb.ino` — open Serial Monitor at 115200. You should see:
   - `{"found":87}` — means sensor detected (0x57 = address 87 decimal) ✓
   - `{"status":"sensor_ok"}` — ready for the app
   - `{"error":"no_i2c_devices"}` — wiring or power still wrong

---

## Option B: ESP32 + Bluetooth

See `esp32-max30102-ble.ino` — same sensor, wireless via BLE.

| MAX30102 | ESP32 |
|----------|-------|
| VIN | 3.3V |
| GND | GND |
| SDA | GPIO 21 |
| SCL | GPIO 22 |

In app: Session → **Real BLE** → select **Revive MAX30102**.

---

## Data format (USB & BLE)

Arduino sends one JSON line per heartbeat:

```json
{"hr":72,"spo2":98}
```

Optional angle for future ROM sensors:

```json
{"hr":72,"spo2":98,"angle":45}
```

---

## Demo mode (no wiring)

Session → **Scan** → **Revive Motion · Pulse (MAX30102)** — simulated BPM for UI testing.

---

## Requirements

- **Browser:** Chrome or Edge (Web Serial + Web Bluetooth)
- **URL:** `https://` or `http://localhost`
- **Sensor power:** 3.3V only on MAX30102 modules
