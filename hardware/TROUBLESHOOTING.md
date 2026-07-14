# MAX30102 still shows NO DEVICES?

If `i2c-wiring-test` keeps printing **NO DEVICES**, the Arduino I2C bus is not electrically connected to the chip. Fix hardware before using the app.

## Step 1: Bypass the breadboard

Use **4 jumper wires only** — Arduino ↔ sensor module. No breadboard.

```
Elegoo Uno R3                    MAX30102 module
─────────────                    ───────────────
     5V ─────────────────────── VCC  (or VIN)
    GND ─────────────────────── GND
     A4 ─────────────────────── SDA  (or SDI)
     A5 ─────────────────────── SCL  (or SCK)
```

Upload `hardware/i2c-direct-wire-test/i2c-direct-wire-test.ino` — open **that folder only** in Arduino IDE (one sketch per folder).

Success looks like:
```
FOUND 0x57  *** MAX30102 — SUCCESS ***
```

## Step 2: Power — try 5V first

Many red MAX30102 boards sold with Elegoo/Keyes kits have an **onboard 3.3V regulator** and expect **5V on VCC**.

| Try first | Wire |
|-----------|------|
| **5V** | VCC → Arduino **5V** |
| If that fails | VCC → Arduino **3.3V** |

GND always → GND.

## Step 3: Identify your module pins

Only connect **4 pins**. Ignore LED-related pins.

| Label on board | Connect to |
|----------------|------------|
| VCC, VIN, + | 5V (or 3.3V) |
| GND, - | GND |
| SDA, SDI, D | A4 |
| SCL, SCK, C | A5 |
| RD, IRD, MID | **Do not wire** |
| INT | Optional — leave unconnected |

### Common 4-pin header orders (top → bottom)

Read the silkscreen on **your** board. Examples:

```
VCC
GND
SCL
SDA
```

or

```
GND
VCC
SCL
SDA
```

## Step 4: Check SDA/SCL lines

Upload `i2c-direct-wire-test.ino`. At startup it prints:

```
SDA(A4) idle=1  SCL(A5) idle=1
```

| Reading | Meaning |
|---------|---------|
| Both **1** | Lines OK (floating high with pull-ups) |
| **0** on either | Shorted to GND, wrong wire, or damaged |

## Step 5: Prove Arduino I2C works (optional)

If your Elegoo kit includes an **MPU6050** gyro:

| MPU6050 | Uno |
|---------|-----|
| VCC | 5V |
| GND | GND |
| SDA | A4 |
| SCL | A5 |

Scanner should show **0x68**. If MPU6050 works but MAX30102 does not → MAX30102 wiring or dead sensor.

## Step 6: When the sensor may be dead

- Was VCC ever connected to wrong voltage for long?
- No LED activity on module when powered?
- Never appears at 0x57 after direct wires + 5V + swapped SDA/SCL?

→ Try a replacement MAX30102 module (~$5) or use **demo mode** in the app (Session → Scan → Pulse MAX30102) until hardware works.

## After 0x57 appears

1. Upload `arduino-max30102-usb.ino`
2. Serial Monitor shows `{"status":"sensor_ok"}`
3. Close Serial Monitor
4. Revive Motion → Session → **USB Cable**
