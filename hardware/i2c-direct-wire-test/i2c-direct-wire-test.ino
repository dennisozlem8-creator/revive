/*
 * DIRECT WIRE test — bypass breadboard entirely.
 * Open THIS folder alone in Arduino IDE (one .ino per folder).
 *
 * Elegoo Uno R3 + MAX30102:
 *   VCC  →  5V   (red LED on module should stay ON)
 *   GND  →  GND
 *   SDA  →  A4
 *   SCL  →  A5
 */

#include <Wire.h>

const int LED = 13;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  while (!Serial) { ; }

  Serial.println(F("=== DIRECT WIRE I2C TEST ==="));
  Serial.println(F("Power: VCC→5V (LED on module should be lit)"));
  Serial.println();

  blinkOk();

  pinMode(A4, INPUT_PULLUP);
  pinMode(A5, INPUT_PULLUP);
  Wire.begin();
  Wire.setClock(50000);

  Serial.print(F("SDA(A4) idle="));
  Serial.print(digitalRead(A4));
  Serial.print(F("  SCL(A5) idle="));
  Serial.println(digitalRead(A5));
  if (digitalRead(A4) == LOW || digitalRead(A5) == LOW) {
    Serial.println(F("WARNING: line stuck LOW — wrong wire or short to GND"));
  } else {
    Serial.println(F("Arduino I2C pins OK — module SDA/SCL pins are likely wrong"));
    Serial.println(F("Use multimeter: beep A4 to each module pin to find real SDA"));
  }
  Serial.println();

  scan();
}

void loop() {
  delay(5000);
  Serial.println(F("--- rescan ---"));
  scan();
}

void blinkOk() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED, HIGH);
    delay(150);
    digitalWrite(LED, LOW);
    delay(150);
  }
}

void scan() {
  bool found57 = false;
  byte total = 0;

  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      total++;
      Serial.print(F("FOUND 0x"));
      if (addr < 16) Serial.print('0');
      Serial.print(addr, HEX);
      if (addr == 0x57) {
        Serial.println(F("  *** MAX30102 — SUCCESS ***"));
        found57 = true;
      } else {
        Serial.println();
      }
    }
  }

  if (total == 0) {
    Serial.println(F("STILL NO DEVICES (power OK if LED is on — check SDA/SCL)"));
    Serial.println(F("  • SDA → A4, SCL → A5 (not D4/D5)"));
    Serial.println(F("  • Swap SDA and SCL once"));
    Serial.println(F("  • Direct jumpers only, no breadboard"));
  } else if (!found57) {
    Serial.println(F("I2C works but no 0x57 — wrong sensor or faulty MAX30102"));
  } else {
    Serial.println(F("Next: upload hardware/arduino-max30102-usb/arduino-max30102-usb.ino"));
  }
  Serial.println();
}
