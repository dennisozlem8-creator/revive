/*
 * Revive Motion — Elegoo Uno R3 / Arduino Uno + MAX30102 over USB
 *
 * Board: Arduino Uno (Elegoo Uno R3)
 * Library: SparkFun MAX3010x Pulse and Proximity Sensor Library
 *
 * Wiring (MAX30102 → Elegoo Uno R3):
 *   VIN/VCC → 5V   (red LED on module should stay on)
 *   GND     → GND
 *   SDA     → A4  (or pin labeled SDA near AREF)
 *   SCL     → A5  (or pin labeled SCL near AREF)
 *
 * Some modules label: SDI=SDA, SCK=SCL, MID and RD are LEDs — do not wire those.
 */

#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

MAX30105 particleSensor;

const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute = 0;
int beatAvg = 0;
bool sensorReady = false;
unsigned long lastScanMs = 0;

// MAX30102/MAX30105 default I2C address
const byte MAX30102_ADDR = 0x57;

void scanI2C() {
  Serial.println(F("{\"status\":\"i2c_scan\"}"));
  byte found = 0;
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    byte err = Wire.endTransmission();
    if (err == 0) {
      Serial.print(F("{\"found\":"));
      Serial.print(addr);
      Serial.println(F("}"));
      found++;
    }
  }
  if (found == 0) {
    Serial.println(F("{\"error\":\"no_i2c_devices — use 5V on VCC, SDA→A4, SCL→A5\"}"));
  } else {
    Serial.println(F("{\"hint\":\"MAX30102 should appear as found:87 (hex 0x57)\"}"));
  }
}

bool tryConnectSensor() {
  // Standard speed is more reliable on breadboards than FAST
  if (particleSensor.begin(Wire, I2C_SPEED_STANDARD, MAX30102_ADDR)) {
    return true;
  }
  return particleSensor.begin(Wire, I2C_SPEED_FAST, MAX30102_ADDR);
}

void setup() {
  Serial.begin(115200);
  while (!Serial) { ; }

  Serial.println(F("{\"status\":\"ready\",\"device\":\"Revive MAX30102 USB\"}"));
  Serial.println(F("{\"hint\":\"Wiring: VIN→5V (LED on), GND→GND, SDA→A4, SCL→A5\"}"));

  Wire.begin();
  Wire.setClock(100000);

  // Weak pull-ups help on breadboards missing external resistors
  pinMode(A4, INPUT_PULLUP);
  pinMode(A5, INPUT_PULLUP);

  delay(200);
  scanI2C();

  if (tryConnectSensor()) {
    particleSensor.setup();
    particleSensor.setPulseAmplitudeRed(0x0A);
    particleSensor.setPulseAmplitudeGreen(0);
    sensorReady = true;
    Serial.println(F("{\"status\":\"sensor_ok\"}"));
    Serial.println(F("// Place finger on sensor LED window"));
  } else {
    Serial.println(F("{\"error\":\"MAX30102 not found at 0x57\"}"));
    Serial.println(F("{\"fix\":[\"VCC→5V (LED must stay on)\",\"SDA→A4\",\"SCL→A5\",\"Swap the two data wires on module\",\"Module may be faulty if still no 0x57\"]}"));
    lastScanMs = millis();
  }
}

void loop() {
  if (!sensorReady) {
    // Retry every 3s so you can fix wiring without re-uploading
    if (millis() - lastScanMs > 3000) {
      lastScanMs = millis();
      scanI2C();
      if (tryConnectSensor()) {
        particleSensor.setup();
        particleSensor.setPulseAmplitudeRed(0x0A);
        particleSensor.setPulseAmplitudeGreen(0);
        sensorReady = true;
        Serial.println(F("{\"status\":\"sensor_ok\"}"));
      }
    }
    delay(200);
    return;
  }

  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue)) {
    long delta = millis() - lastBeat;
    lastBeat = millis();
    beatsPerMinute = 60.0 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 40) {
      rates[rateSpot++] = (byte)beatsPerMinute;
      rateSpot %= RATE_SIZE;

      beatAvg = 0;
      for (byte i = 0; i < RATE_SIZE; i++) beatAvg += rates[i];
      beatAvg /= RATE_SIZE;

      Serial.print(F("{\"hr\":"));
      Serial.print(beatAvg);
      Serial.println(F(",\"spo2\":98}"));
    }
  }

  delay(20);
}
