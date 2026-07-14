# MAX30102 — LED on but NO DEVICES on I2C

**Power is OK** (red LED on or flashing at 5V).  
**I2C is not connected** — SDA/SCL are on the wrong module pins or bad jumpers.

The flashing red LED is often the **pulse LED inside the sensor** (normal when powered). It does **not** mean I2C is wired correctly.

---

## Step 1: Read this line from Serial Monitor

At startup, `i2c-direct-wire-test` prints:

```
SDA(A4) idle=1  SCL(A5) idle=1
```

| Value | Meaning |
|-------|---------|
| Both **1** | Arduino pins OK — problem is module side (wrong SDA/SCL holes) |
| **0** on either | That wire shorted or on wrong pin |

Tell us what numbers you see.

---

## Step 2: Find SDA and SCL on the module (continuity test)

Use a multimeter **beep/continuity** mode (or resistance — 0Ω = connected).

1. **Unplug USB** from Arduino (safety).
2. One probe on **Arduino A4** (the metal part of the pin).
3. Touch the other probe to **each pin/hole on the MAX30102 module** one at a time.
4. The pin that **beeps** is **SDA** → wire that to **A4**.
5. Repeat with **Arduino A5** — that pin is **SCL** → wire to **A5**.

Do **not** trust silkscreen until beep test confirms it. Many clones mislabel pins.

---

## Step 3: Typical pin layouts (verify with beep test)

### 4-pin header (one row)

```
[VCC]  → 5V
[GND]  → GND
[SCL]  → A5
[SDA]  → A4
```

Order may be **GND VCC SCL SDA** or **VCC GND SDA SCL** — order varies!

### 6+ pins — DO NOT use these for I2C

| Label | Purpose |
|-------|---------|
| RD, IRD, MID | LED outputs — **not** I2C |
| INT | optional interrupt — leave unconnected |
| VCC, GND, SDA, SCL | **only these four** |

---

## Step 4: Add pull-up resistors (if you have 4.7kΩ)

Some boards need external pull-ups:

```
5V ──[4.7k]── SDA line ── A4
5V ──[4.7k]── SCL line ── A5
```

(Many modules already have these on the PCB — try without first.)

---

## Step 5: Use labeled SDA/SCL on Arduino

On Elegoo Uno R3, next to **AREF** there are pins labeled **SDA** and **SCL**.  
They are the **same** as A4 and A5 — try wires there instead of the analog header.

---

## Step 6: When the module may be faulty

If beep test finds **no pin** connected to A4 or A5 traces on the module:

- Broken PCB / fake chip
- Replace module (~$5) or use app **demo mode** (Session → Scan → Pulse MAX30102)

---

## Success looks like

```
FOUND 0x57  *** MAX30102 — SUCCESS ***
```

Then upload `arduino-max30102-usb.ino` → `sensor_ok` → Revive Motion → USB Cable.
