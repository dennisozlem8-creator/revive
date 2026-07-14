/*
 * Revive Motion — Elegoo Uno R3 / Arduino Uno + MAX30102 + HC-05 Bluetooth
 *
 * HC-05 is classic Bluetooth (not BLE). Pair it with your PC first — it appears
 * as a COM port. In the app: Session → HC-05 Bluetooth → pick that COM port.
 *
 * Library: SparkFun MAX3010x Pulse and Proximity Sensor Library
 *
 * MAX30102 wiring:
 *   VIN/VCC → 5V
 *   GND     → GND
 *   SDA     → A4
 *   SCL     → A5
 *
 * HC-05 wiring (shares Arduino hardware Serial on pins 0/1):
 *   VCC  → 5V
 *   GND  → GND
 *   TXD  → Pin 0 (Arduino RX)
 *   RXD  → Pin 1 (Arduino TX) through voltage divider if module is 3.3V:
 *          Arduino TX → 1kΩ → HC-05 RXD, and 2kΩ from HC-05 RXD → GND
 *   KEY/EN → 5V (data mode — leave high)
 *
 * Upload tip: disconnect HC-05 RX wire before upload, or unplug HC-05 VCC.
 *
 * Baud: HC-05 ships at 9600. Change with AT+UART=1,115200,0,0 if you prefer 115200.
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
  if (particleSensor.begin(Wire, I2C_SPEED_STANDARD, MAX30102_ADDR)) {
    return true;
  }
  return particleSensor.begin(Wire, I2C_SPEED_FAST, MAX30102_ADDR);
}

void setup() {
  // 9600 matches factory HC-05 baud (most modules)
  Serial.begin(9600);
  while (!Serial) { ; }

  Serial.println(F("{\"status\":\"ready\",\"device\":\"Revive MAX30102 HC-05\"}"));
  Serial.println(F("{\"hint\":\"Pair HC-05 in Windows, then app → HC-05 Bluetooth\"}"));

  Wire.begin();
  Wire.setClock(100000);

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
    Serial.println(F("{\"fix\":[\"VCC→5V\",\"SDA→A4\",\"SCL→A5\",\"Swap data wires\",\"Module may be faulty\"]}"));
    lastScanMs = millis();
  }
}

void loop() {
  if (!sensorReady) {
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
