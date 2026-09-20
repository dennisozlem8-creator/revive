// Revive Motion — Elegoo Uno R3 + MPU-6050 (GY-521)
// File → New. Delete everything. Paste this whole file once.
// VCC -> Uno 5V (if the pin is labeled only 3.3V, use Uno 3.3V instead).
// GND -> GND. SCL -> A5. SDA -> A4. INT empty. AD0 empty.
// Tools → Board → Arduino Uno. Upload. Close Serial Monitor.

#include <Wire.h>

const uint8_t ADDRS[] = { 0x68, 0x69 };
uint8_t addr = 0x68;
bool i2cReady = false;
unsigned long lastScanMs = 0;
unsigned long lastHelloMs = 0;

void printHello() {
  Serial.println("HELLO MPU6050 ELEGOO_UNO_R3");
  Serial.println("SRC ELEGOO_UNO_R3");
  Serial.println("CHIP MPU6050");
}

bool ping(uint8_t a) {
  Wire.beginTransmission(a);
  return Wire.endTransmission() == 0;
}

bool wake(uint8_t a) {
  Wire.beginTransmission(a);
  Wire.write(0x6B);
  Wire.write(0x00);
  return Wire.endTransmission() == 0;
}

uint8_t whoAmI(uint8_t a) {
  Wire.beginTransmission(a);
  Wire.write(0x75);
  if (Wire.endTransmission(false) != 0) return 0;
  if (Wire.requestFrom(a, (uint8_t)1) < 1) return 0;
  return Wire.read();
}

bool readAccel(int16_t *ax, int16_t *ay, int16_t *az) {
  Wire.beginTransmission(addr);
  Wire.write(0x3B);
  if (Wire.endTransmission(false) != 0) return false;
  if (Wire.requestFrom(addr, (uint8_t)6) < 6) return false;
  *ax = (int16_t)((Wire.read() << 8) | Wire.read());
  *ay = (int16_t)((Wire.read() << 8) | Wire.read());
  *az = (int16_t)((Wire.read() << 8) | Wire.read());
  return true;
}

bool startSensor() {
  Wire.begin();
  Wire.setClock(100000);
  delay(40);
  Serial.print("SCAN");
  bool any = false;
  for (uint8_t i = 0; i < 2; i++) {
    if (ping(ADDRS[i])) {
      Serial.print(" 0x");
      Serial.print(ADDRS[i], HEX);
      addr = ADDRS[i];
      any = true;
    }
  }
  if (!any) {
    Serial.println(" none");
    Serial.println("ERR no I2C. VCC to Uno 5V (or 3.3V if that pin is labeled only 3.3V). GND to GND. SCL to A5. SDA to A4.");
    return false;
  }
  Serial.println();
  wake(addr);
  delay(40);
  const uint8_t who = whoAmI(addr);
  Serial.print("WHO ");
  Serial.println(who);
  Serial.print("ADDR 0x");
  Serial.println(addr, HEX);
  Serial.println("I2C OK");
  return true;
}

void setup() {
  Serial.begin(115200);
  delay(400);
  printHello();
  i2cReady = startSensor();
  lastScanMs = millis();
  lastHelloMs = millis();
}

void loop() {
  const unsigned long now = millis();

  if (Serial.available()) {
    while (Serial.available()) Serial.read();
    printHello();
    Serial.println(i2cReady ? "PONG MPU6050" : "PONG NONE");
  }

  if (!i2cReady && now - lastHelloMs > 4000) {
    lastHelloMs = now;
    printHello();
  }

  if (!i2cReady) {
    if (now - lastScanMs > 2500) {
      lastScanMs = now;
      Serial.println("RETRY I2C");
      i2cReady = startSensor();
    }
    delay(40);
    return;
  }

  int16_t ax = 0, ay = 0, az = 0;
  if (!readAccel(&ax, &ay, &az)) {
    Serial.println("ERR I2C dropped. Recovering.");
    i2cReady = false;
    lastScanMs = 0;
    delay(40);
    return;
  }

  float pitch = atan2((float)ay, (float)az) * 57.2957795f;
  if (pitch < 0) pitch += 360.0f;
  if (pitch > 180.0f) pitch = 360.0f - pitch;
  int angle = (int)(pitch + 0.5f);
  if (angle < 0) angle = 0;
  if (angle > 180) angle = 180;

  Serial.print("ANGLE ");
  Serial.println(angle);

  delay(50);
}
