/*
  Revive Motion — Elegoo Uno R3 + MAX30102
  Wires: VIN->5V  GND->GND  SCL->A5  SDA->A4
  After Upload: close Serial Monitor, then Chrome -> Connect with USB
*/

#include <Wire.h>

const uint8_t MAX_ADDR = 0x57;
const int MIN_BPM = 40;
const int MAX_BPM = 180;
const unsigned long MIN_BEAT_MS = 320;
const uint32_t FINGER_MIN_IR = 2000;

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

bool sensorAck() {
  Wire.beginTransmission(MAX_ADDR);
  return Wire.endTransmission() == 0;
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
  Serial.println("HELLO MAX30102 ELEGOO_UNO_R3");
  Serial.println("SRC ELEGOO_UNO_R3");
  Serial.println("CHIP MAX30102");
  Serial.print("ID ");
  Serial.println(readReg(0xFF));
  if (!sensorAck()) {
    Serial.println("ERR no I2C. Check VIN GND SCL->A5 SDA->A4");
  } else {
    Serial.println("I2C OK");
  }
  setupSensor();
  Serial.println("MAX30102 start");
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
    span > 200;

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
