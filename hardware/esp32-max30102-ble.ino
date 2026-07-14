/*
 * Revive Motion — ESP32 + MAX30102 → Web Bluetooth
 *
 * Libraries (Arduino Library Manager):
 *   - SparkFun MAX3010x Pulse and Proximity Sensor Library
 *   - ESP32 BLE Arduino (built-in on ESP32 board package)
 *
 * Wiring (MAX30102 → ESP32):
 *   VIN  → 3.3V
 *   GND  → GND
 *   SDA  → GPIO 21
 *   SCL  → GPIO 22
 *
 * BLE service (must match src/lib/sensor-hub.ts):
 *   Service  0000fff0-0000-1000-8000-00805f9b34fb
 *   HR char  0000fff2-0000-1000-8000-00805f9b34fb  → 1 byte BPM
 *   SpO2     0000fff3-0000-1000-8000-00805f9b34fb  → 1 byte %
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

#define SERVICE_UUID        "0000fff0-0000-1000-8000-00805f9b34fb"
#define CHAR_HR_UUID        "0000fff2-0000-1000-8000-00805f9b34fb"
#define CHAR_SPO2_UUID      "0000fff3-0000-1000-8000-00805f9b34fb"

MAX30105 particleSensor;

const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute = 0;
int beatAvg = 0;

BLECharacteristic* hrCharacteristic = nullptr;
BLECharacteristic* spo2Characteristic = nullptr;
bool deviceConnected = false;

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) { deviceConnected = true; }
  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    BLEDevice::startAdvertising();
  }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Revive Motion MAX30102 BLE");

  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 not found. Check wiring.");
    while (1);
  }

  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);

  BLEDevice::init("Revive MAX30102");
  BLEServer* server = BLEDevice::createServer();
  server->setCallbacks(new ServerCallbacks());

  BLEService* service = server->createService(SERVICE_UUID);

  hrCharacteristic = service->createCharacteristic(
    CHAR_HR_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  hrCharacteristic->addDescriptor(new BLE2902());

  spo2Characteristic = service->createCharacteristic(
    CHAR_SPO2_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  spo2Characteristic->addDescriptor(new BLE2902());

  service->start();

  BLEAdvertising* advertising = BLEDevice::getAdvertising();
  advertising->addServiceUUID(SERVICE_UUID);
  advertising->setScanResponse(true);
  BLEDevice::startAdvertising();

  Serial.println("BLE advertising — open Revive Motion app → Real BLE");
}

void loop() {
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

      if (deviceConnected && hrCharacteristic) {
        uint8_t bpm = (uint8_t)beatAvg;
        hrCharacteristic->setValue(&bpm, 1);
        hrCharacteristic->notify();

        // SpO2 estimation placeholder — replace with proper algorithm if needed
        uint8_t spo2 = 98;
        spo2Characteristic->setValue(&spo2, 1);
        spo2Characteristic->notify();

        Serial.print("BPM: ");
        Serial.println(beatAvg);
      }
    }
  }

  delay(20);
}
