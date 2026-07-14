/*
 * Minimal I2C test — upload this ONLY to debug wiring (no MAX30102 library needed).
 * Elegoo Uno R3 → select Board: Arduino Uno, 115200 baud Serial Monitor.
 *
 * Wiring:
 *   MAX30102 VCC/VIN → 3.3V  (if that fails, try 5V — some modules have onboard regulator)
 *   GND → GND
 *   SDA → A4
 *   SCL → A5
 *
 * Success: "DEVICE FOUND at 0x57"
 * Failure: "NO DEVICES" — power or data wires not reaching the chip
 */

#include <Wire.h>

void setup() {
  Serial.begin(115200);
  while (!Serial) { ; }

  Serial.println(F("=== Revive Motion I2C wiring test ==="));
  Serial.println(F("Expected: device at address 0x57 (prints as 87 decimal)"));
  Serial.println();

  // Weak internal pull-ups — helps if module has none
  pinMode(A4, INPUT_PULLUP);
  pinMode(A5, INPUT_PULLUP);

  Wire.begin();
  Wire.setClock(100000);  // slow 100kHz — most reliable on breadboard
  delay(200);

  runScan();
}

void loop() {
  delay(4000);
  Serial.println(F("--- rescan (fix wires while running, no re-upload needed) ---"));
  runScan();
}

void runScan() {
  byte count = 0;
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      Serial.print(F("DEVICE FOUND at 0x"));
      if (addr < 16) Serial.print('0');
      Serial.print(addr, HEX);
      if (addr == 0x57) {
        Serial.println(F("  <-- MAX30102 OK! Re-upload arduino-max30102-usb.ino"));
      } else {
        Serial.println();
      }
      count++;
    }
  }
  if (count == 0) {
    Serial.println(F("NO DEVICES — check list below:"));
    Serial.println(F("  1. VCC/VIN on module has 3.3V (measure with phone/ meter if possible)"));
    Serial.println(F("  2. GND on module tied to Arduino GND"));
    Serial.println(F("  3. SDA on module -> Arduino A4 (not D4)"));
    Serial.println(F("  4. SCL on module -> Arduino A5 (not D5)"));
    Serial.println(F("  5. Only 4 wires: power, gnd, sda, scl — ignore RD/MID/IRD pins"));
    Serial.println(F("  6. Breadboard: same row connects horizontally, gap in middle separates sides"));
    Serial.println(F("  7. Try 4.7k resistor from SDA to 3.3V AND SCL to 3.3V (optional pull-ups)"));
    Serial.println(F("  8. If module has 5V marking, try VCC -> 5V instead of 3.3V"));
  }
  Serial.println();
}
