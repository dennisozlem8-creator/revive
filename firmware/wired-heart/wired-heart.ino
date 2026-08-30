/*
  Revive Motion — Elegoo Uno R3 + MAX30102
  Wires: VIN/VCC->5V  GND->GND  SCL->A5  SDA->A4
  If the board has 3.3V and no VIN, use Uno 3.3V instead of 5V.
  After Upload: close Serial Monitor, then Chrome -> Connect with USB
*/

#include <Wire.h>

uint8_t sensorAddr = 0x57;
const int MIN_BPM = 40;
const int MAX_BPM = 180;
const unsigned long MIN_BEAT_MS = 320;
const uint32_t FINGER_MIN = 400;

uint32_t lastSignal = 0;
uint32_t recentMax = 0;
uint32_t recentMin = 0xFFFFFFFFu;
unsigned long lastBeatMs = 0;
unsigned long windowStart = 0;
unsigned long lastNoDataMs = 0;
unsigned long lastScanMs = 0;
bool i2cReady = false;

void writeReg(uint8_t reg, uint8_t value) {
  Wire.beginTransmission(sensorAddr);
  Wire.write(reg);
  Wire.write(value);
  Wire.endTransmission();
}

uint8_t readReg(uint8_t reg) {
  Wire.beginTransmission(sensorAddr);
  Wire.write(reg);
  if (Wire.endTransmission() != 0) return 0;
  Wire.requestFrom(sensorAddr, (uint8_t)1);
  if (Wire.available()) return Wire.read();
  return 0;
}

bool ping(uint8_t addr) {
  Wire.beginTransmission(addr);
  return Wire.endTransmission() == 0;
}

void printScan() {
  Serial.print("SCAN");
  bool any = false;
  for (uint8_t addr = 1; addr < 127; addr++) {
    if (ping(addr)) {
      Serial.print(" 0x");
      Serial.print(addr, HEX);
      any = true;
    }
  }
  if (!any) Serial.print(" none");
  Serial.println();
}

bool findSensor() {
  const uint8_t tries[] = { 0x57, 0x5E, 0x55 };
  for (uint8_t i = 0; i < 3; i++) {
    if (ping(tries[i])) {
      sensorAddr = tries[i];
      return true;
    }
  }
  return false;
}

bool readFifoSample(uint32_t *redOut, uint32_t *irOut) {
  const uint8_t wr = readReg(0x04) & 0x1F;
  const uint8_t rd = readReg(0x06) & 0x1F;
  if (wr == rd) {
    *redOut = 0;
    *irOut = 0;
    return false;
  }

  Wire.beginTransmission(sensorAddr);
  Wire.write(0x07);
  if (Wire.endTransmission() != 0) {
    *redOut = 0;
    *irOut = 0;
    return false;
  }
  Wire.requestFrom(sensorAddr, (uint8_t)6);

  uint32_t red = 0;
  uint32_t ir = 0;
  if (Wire.available() >= 3) {
    red = ((uint32_t)Wire.read() << 16) | ((uint32_t)Wire.read() << 8) | Wire.read();
  }
  if (Wire.available() >= 3) {
    ir = ((uint32_t)Wire.read() << 16) | ((uint32_t)Wire.read() << 8) | Wire.read();
  }
  *redOut = red & 0x03FFFF;
  *irOut = ir & 0x03FFFF;
  return true;
}

void setupSensor() {
  writeReg(0x09, 0x40);
  delay(100);
  writeReg(0x09, 0x03);
  writeReg(0x0A, 0x27);
  writeReg(0x0C, 0x4F);
  writeReg(0x0D, 0x4F);
  writeReg(0x08, 0x4F);
  writeReg(0x04, 0x00);
  writeReg(0x05, 0x00);
  writeReg(0x06, 0x00);
  delay(80);
}

bool startSensor() {
  printScan();
  if (!findSensor()) {
    Serial.println("ERR no I2C. Push in VIN GND SCL->A5 SDA->A4. If the board has no VIN, use 3.3V.");
    return false;
  }
  Serial.print("ADDR 0x");
  Serial.println(sensorAddr, HEX);
  Serial.print("ID ");
  Serial.println(readReg(0xFF));
  Serial.println("I2C OK");
  setupSensor();
  Serial.println("MAX30102 start");
  return true;
}

void setup() {
  Serial.begin(115200);
  Wire.begin();
  delay(200);
  Serial.println("HELLO MAX30102 ELEGOO_UNO_R3");
  Serial.println("SRC ELEGOO_UNO_R3");
  Serial.println("CHIP MAX30102");
  i2cReady = startSensor();
  lastScanMs = millis();
}

void loop() {
  const unsigned long now = millis();

  if (!i2cReady) {
    if (now - lastScanMs > 2000) {
      lastScanMs = now;
      Serial.println("RETRY I2C");
      i2cReady = startSensor();
    }
    delay(20);
    return;
  }

  uint32_t red = 0;
  uint32_t ir = 0;
  const bool gotSample = readFifoSample(&red, &ir);
  const uint32_t signal = ir >= red ? ir : red;

  if (gotSample) {
    Serial.print("RAW ");
    Serial.println(signal);
  }

  if (!gotSample || signal < FINGER_MIN) {
    if (now - lastNoDataMs > 1000) {
      lastNoDataMs = now;
      Serial.println("NODATA cover both LEDs with a fingertip");
    }
    lastSignal = signal;
    delay(20);
    return;
  }

  if (now - windowStart > 1500) {
    recentMax = signal;
    recentMin = signal;
    windowStart = now;
  } else {
    if (signal > recentMax) recentMax = signal;
    if (signal < recentMin) recentMin = signal;
  }

  const uint32_t span = recentMax - recentMin;
  const uint32_t threshold = recentMin + (span * 6UL) / 10UL;
  const bool crossed =
    lastSignal <= threshold &&
    signal > threshold &&
    (now - lastBeatMs) > MIN_BEAT_MS &&
    span > 80;

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

  lastSignal = signal;
  delay(20);
}
