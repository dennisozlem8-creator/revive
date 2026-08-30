/*
  Revive Motion — Elegoo Uno R3 + MAX30102
  ---------------------------------------
  Wires (MAX30102 module  ->  Elegoo Uno R3):

    VIN or VCC  ->  5V     (if your board only says 3.3V, use 3.3V instead)
    GND         ->  GND
    SCL         ->  A5     (or the pin labeled SCL)
    SDA         ->  A4     (or the pin labeled SDA)
    INT         ->  leave empty
    IRD / RD    ->  leave empty

  Arduino IDE (needed once):
    1. Install Arduino IDE from arduino.cc
    2. Open this file
    3. Tools -> Board -> Arduino Uno
    4. Tools -> Port -> the COM port for the Elegoo
    5. Click Upload
    6. CLOSE the Serial Monitor (Chrome cannot share the USB port)
    7. In Revive Motion, tap Connect with USB

  Put a fingertip on the MAX30102 LEDs and hold still.
*/

#include <Wire.h>

const uint8_t MAX_ADDR = 0x57;
const int MIN_BPM = 40;
const int MAX_BPM = 180;
const unsigned long MIN_BEAT_MS = 320;
const uint32_t FINGER_MIN_IR = 20000;

uint32_t lastIr = 0;
uint32_t recentMax = 0;
uint32_t recentMin = 0xFFFFFFFFu;
unsigned long lastBeatMs = 0;
unsigned long windowStart = 0;

void writeReg(uint8_t reg, uint8_t value) {
  Wire.beginTransmission(MAX_ADDR);
  Wire.write(reg);
  Wire.write(value);
  Wire.endTransmission();
}

uint8_t readReg(uint8_t reg) {
  Wire.beginTransmission(MAX_ADDR);
  Wire.write(reg);
  Wire.endTransmission(false);
  Wire.requestFrom(MAX_ADDR, (uint8_t)1);
  if (Wire.available()) return Wire.read();
  return 0;
}

uint32_t readIr() {
  Wire.beginTransmission(MAX_ADDR);
  Wire.write(0x07);
  Wire.endTransmission(false);
  Wire.requestFrom(MAX_ADDR, (uint8_t)6);
  uint32_t red = 0;
  uint32_t ir = 0;
  if (Wire.available() >= 6) {
    red = ((uint32_t)Wire.read() << 16) | ((uint32_t)Wire.read() << 8) | Wire.read();
    ir = ((uint32_t)Wire.read() << 16) | ((uint32_t)Wire.read() << 8) | Wire.read();
  }
  red &= 0x03FFFF;
  ir &= 0x03FFFF;
  (void)red;
  return ir;
}

bool sensorFound() {
  Wire.beginTransmission(MAX_ADDR);
  if (Wire.endTransmission() != 0) return false;
  return readReg(0xFF) == 0x15;
}

void setupSensor() {
  writeReg(0x09, 0x40);
  delay(100);
  writeReg(0x09, 0x03);
  writeReg(0x0A, 0x27);
  writeReg(0x0C, 0x24);
  writeReg(0x0D, 0x24);
  writeReg(0x08, 0x4F);
  writeReg(0x04, 0x00);
  writeReg(0x05, 0x00);
  writeReg(0x06, 0x00);
}

void setup() {
  Serial.begin(115200);
  Wire.begin();
  delay(50);
  if (!sensorFound()) {
    Serial.println("ERR MAX30102 not found. Check VIN GND SCL=A5 SDA=A4");
    while (true) {
      delay(1000);
    }
  }
  setupSensor();
  Serial.println("MAX30102 ready");
}

void loop() {
  const uint32_t ir = readIr();
  const unsigned long now = millis();

  Serial.print("RAW ");
  Serial.println(ir);

  if (ir < FINGER_MIN_IR) {
    lastIr = ir;
    delay(20);
    return;
  }

  if (now - windowStart > 1500) {
    recentMax = ir;
    recentMin = ir;
    windowStart = now;
  } else {
    if (ir > recentMax) recentMax = ir;
    if (ir < recentMin) recentMin = ir;
  }

  const uint32_t span = recentMax - recentMin;
  const uint32_t threshold = recentMin + (span * 6UL) / 10UL;
  const bool crossed =
    lastIr <= threshold &&
    ir > threshold &&
    (now - lastBeatMs) > MIN_BEAT_MS &&
    span > 400;

  if (crossed) {
    if (lastBeatMs > 0) {
      const int bpm = (int)(60000UL / (now - lastBeatMs));
      if (bpm >= MIN_BPM && bpm <= MAX_BPM) {
        Serial.print("BPM ");
        Serial.println(bpm);
      }
    }
    lastBeatMs = now;
  }

  lastIr = ir;
  delay(20);
}
