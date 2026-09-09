/*
  Revive Motion — Elegoo Uno R3 + MAX30102

  Open THIS file only (File → Open → wired-heart.ino).
  Do not paste it into an old sketch. That makes two setup() and two loop()
  and Arduino says "redefinition of void setup()".

  Wires (one power wire only):
    VIN or VCC -> Uno 5V   OR   3.3V -> Uno 3.3V if the board has no VIN
    GND -> GND
    SCL -> A5
    SDA -> A4
    INT / IRD / RD empty

  If the red light was on once and then died, try Uno 3.3V instead of 5V.
  If I2C still fails, this sketch also tries SDA/SCL swapped in software.

  After Upload: close Serial Monitor, then Chrome -> Connect with USB
*/

#include <Wire.h>

const int PIN_SDA = A4;
const int PIN_SCL = A5;
const int MIN_BPM = 40;
const int MAX_BPM = 180;
const unsigned long MIN_BEAT_MS = 320;
const uint32_t FINGER_MIN = 120;

uint8_t sensorAddr = 0x57;
int sdaPin = PIN_SDA;
int sclPin = PIN_SCL;
bool useSoft = false;
uint32_t lastSignal = 0;
uint32_t recentMax = 0;
uint32_t recentMin = 0xFFFFFFFFu;
unsigned long lastBeatMs = 0;
unsigned long windowStart = 0;
unsigned long lastNoDataMs = 0;
unsigned long lastScanMs = 0;
unsigned long lastHelloMs = 0;
uint8_t fifoFailStreak = 0;
bool i2cReady = false;
bool lastBusOk = true;

void i2cDelay() {
  delayMicroseconds(20);
}

void sdaHigh() {
  pinMode(sdaPin, INPUT_PULLUP);
}

void sdaLow() {
  pinMode(sdaPin, OUTPUT);
  digitalWrite(sdaPin, LOW);
}

void sclHigh() {
  pinMode(sclPin, INPUT_PULLUP);
}

void sclLow() {
  pinMode(sclPin, OUTPUT);
  digitalWrite(sclPin, LOW);
}

int sdaRead() {
  pinMode(sdaPin, INPUT_PULLUP);
  return digitalRead(sdaPin);
}

void softStart() {
  sdaHigh();
  sclHigh();
  i2cDelay();
  sdaLow();
  i2cDelay();
  sclLow();
  i2cDelay();
}

void softStop() {
  sdaLow();
  i2cDelay();
  sclHigh();
  i2cDelay();
  sdaHigh();
  i2cDelay();
}

bool softWriteByte(uint8_t value) {
  for (uint8_t i = 0; i < 8; i++) {
    if (value & 0x80) sdaHigh();
    else sdaLow();
    i2cDelay();
    sclHigh();
    i2cDelay();
    sclLow();
    i2cDelay();
    value <<= 1;
  }
  sdaHigh();
  i2cDelay();
  sclHigh();
  i2cDelay();
  const bool ack = sdaRead() == LOW;
  sclLow();
  i2cDelay();
  return ack;
}

uint8_t softReadByte(bool ack) {
  uint8_t value = 0;
  sdaHigh();
  for (uint8_t i = 0; i < 8; i++) {
    value <<= 1;
    sclHigh();
    i2cDelay();
    if (sdaRead()) value |= 1;
    sclLow();
    i2cDelay();
  }
  if (ack) sdaLow();
  else sdaHigh();
  i2cDelay();
  sclHigh();
  i2cDelay();
  sclLow();
  i2cDelay();
  sdaHigh();
  return value;
}

void recoverBus() {
  Serial.println("BUS RECOVER");
  Wire.end();
  pinMode(PIN_SDA, INPUT_PULLUP);
  pinMode(PIN_SCL, OUTPUT);
  for (uint8_t i = 0; i < 9; i++) {
    digitalWrite(PIN_SCL, HIGH);
    delayMicroseconds(8);
    digitalWrite(PIN_SCL, LOW);
    delayMicroseconds(8);
  }
  pinMode(PIN_SDA, OUTPUT);
  digitalWrite(PIN_SDA, LOW);
  digitalWrite(PIN_SCL, HIGH);
  delayMicroseconds(8);
  digitalWrite(PIN_SDA, HIGH);
  delayMicroseconds(8);
  pinMode(PIN_SDA, INPUT_PULLUP);
  pinMode(PIN_SCL, INPUT_PULLUP);
}

void beginWire(uint32_t hz, bool pullups) {
  useSoft = false;
  sdaPin = PIN_SDA;
  sclPin = PIN_SCL;
  Wire.end();
  pinMode(PIN_SDA, pullups ? INPUT_PULLUP : INPUT);
  pinMode(PIN_SCL, pullups ? INPUT_PULLUP : INPUT);
  Wire.begin();
  Wire.setClock(hz);
#if defined(WIRE_HAS_TIMEOUT)
  Wire.setWireTimeout(3000, true);
#endif
}

void beginSoft(int sda, int scl) {
  useSoft = true;
  sdaPin = sda;
  sclPin = scl;
  Wire.end();
  sdaHigh();
  sclHigh();
  delay(20);
}

bool ping(uint8_t addr) {
  if (useSoft) {
    softStart();
    const bool ack = softWriteByte((uint8_t)(addr << 1));
    softStop();
    return ack;
  }
  Wire.beginTransmission(addr);
  return Wire.endTransmission() == 0;
}

void writeReg(uint8_t reg, uint8_t value) {
  if (useSoft) {
    softStart();
    if (!softWriteByte((uint8_t)(sensorAddr << 1))) {
      softStop();
      return;
    }
    softWriteByte(reg);
    softWriteByte(value);
    softStop();
    return;
  }
  Wire.beginTransmission(sensorAddr);
  Wire.write(reg);
  Wire.write(value);
  Wire.endTransmission();
}

uint8_t readReg(uint8_t reg) {
  if (useSoft) {
    softStart();
    if (!softWriteByte((uint8_t)(sensorAddr << 1))) {
      softStop();
      return 0;
    }
    softWriteByte(reg);
    softStart();
    if (!softWriteByte((uint8_t)((sensorAddr << 1) | 1))) {
      softStop();
      return 0;
    }
    const uint8_t value = softReadByte(false);
    softStop();
    return value;
  }
  Wire.beginTransmission(sensorAddr);
  Wire.write(reg);
  if (Wire.endTransmission() != 0) return 0;
  Wire.requestFrom(sensorAddr, (uint8_t)1);
  if (Wire.available()) return Wire.read();
  return 0;
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
  const uint8_t tries[] = { 0x57, 0x5E, 0x55, 0x54 };
  for (uint8_t i = 0; i < 4; i++) {
    if (ping(tries[i])) {
      sensorAddr = tries[i];
      return true;
    }
  }
  return false;
}

void setupSensor() {
  writeReg(0x09, 0x40);
  unsigned long started = millis();
  while (millis() - started < 200) {
    if ((readReg(0x09) & 0x40) == 0) break;
    delay(10);
  }
  delay(50);
  writeReg(0x02, 0x00);
  writeReg(0x03, 0x00);
  writeReg(0x04, 0x00);
  writeReg(0x05, 0x00);
  writeReg(0x06, 0x00);
  writeReg(0x08, 0x5F);
  writeReg(0x09, 0x03);
  writeReg(0x0A, 0x27);
  writeReg(0x0C, 0x24);
  writeReg(0x0D, 0x24);
  delay(80);
  writeReg(0x04, 0x00);
  writeReg(0x06, 0x00);
}

void tryTurnLedsOn() {
  const uint8_t saved = sensorAddr;
  sensorAddr = 0x57;
  Serial.println("LED TRY");
  setupSensor();
  writeReg(0x0C, 0x3F);
  writeReg(0x0D, 0x3F);
  sensorAddr = saved;
}

void printHello() {
  Serial.println("HELLO MAX30102 ELEGOO_UNO_R3");
  Serial.println("SRC ELEGOO_UNO_R3");
  Serial.println("CHIP MAX30102");
}

bool configureFoundSensor() {
  Serial.print("ADDR 0x");
  Serial.println(sensorAddr, HEX);
  const uint8_t partId = readReg(0xFF);
  Serial.print("ID ");
  Serial.println(partId);
  setupSensor();
  Serial.println("I2C OK");
  Serial.println("MAX30102 start");
  fifoFailStreak = 0;
  return true;
}

bool startSensor() {
  recoverBus();

  const uint32_t speeds[] = { 25000UL, 50000UL, 10000UL, 100000UL };
  const bool pullModes[] = { false, true };

  for (uint8_t p = 0; p < 2; p++) {
    for (uint8_t s = 0; s < 4; s++) {
      beginWire(speeds[s], pullModes[p]);
      delay(40);
      Serial.print("I2C MODE pullup=");
      Serial.print(pullModes[p] ? "on" : "off");
      Serial.print(" hz=");
      Serial.println(speeds[s]);
      printScan();
      if (!findSensor()) continue;
      Serial.println("I2C PINS SDA=A4 SCL=A5");
      return configureFoundSensor();
    }
  }

  Serial.println("I2C SWAP try SDA=A5 SCL=A4");
  beginSoft(PIN_SCL, PIN_SDA);
  delay(40);
  printScan();
  if (findSensor()) {
    Serial.println("I2C PINS SDA=A5 SCL=A4");
    return configureFoundSensor();
  }

  Serial.println("I2C SWAP try SDA=A4 SCL=A5 soft");
  beginSoft(PIN_SDA, PIN_SCL);
  delay(40);
  printScan();
  if (findSensor()) {
    Serial.println("I2C PINS SDA=A4 SCL=A5");
    return configureFoundSensor();
  }

  beginWire(25000UL, false);
  tryTurnLedsOn();
  Serial.println("ERR no I2C. One power wire only. Try Uno 3.3V if the light died. GND to GND. SCL->A5 SDA->A4.");
  return false;
}

bool readFifoSample(uint32_t *redOut, uint32_t *irOut) {
  if (!ping(sensorAddr)) {
    lastBusOk = false;
    *redOut = 0;
    *irOut = 0;
    return false;
  }

  const uint8_t wr = readReg(0x04) & 0x1F;
  const uint8_t rd = readReg(0x06) & 0x1F;
  if (wr == rd) {
    lastBusOk = true;
    *redOut = 0;
    *irOut = 0;
    return false;
  }

  if (useSoft) {
    softStart();
    if (!softWriteByte((uint8_t)(sensorAddr << 1))) {
      lastBusOk = false;
      *redOut = 0;
      *irOut = 0;
      softStop();
      return false;
    }
    softWriteByte(0x07);
    softStart();
    if (!softWriteByte((uint8_t)((sensorAddr << 1) | 1))) {
      lastBusOk = false;
      *redOut = 0;
      *irOut = 0;
      softStop();
      return false;
    }
    uint32_t red = ((uint32_t)softReadByte(true) << 16) | ((uint32_t)softReadByte(true) << 8) | softReadByte(true);
    uint32_t ir = ((uint32_t)softReadByte(true) << 16) | ((uint32_t)softReadByte(true) << 8) | softReadByte(false);
    softStop();
    *redOut = red & 0x03FFFF;
    *irOut = ir & 0x03FFFF;
    lastBusOk = true;
    return true;
  }

  Wire.beginTransmission(sensorAddr);
  Wire.write(0x07);
  if (Wire.endTransmission() != 0) {
    lastBusOk = false;
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
  lastBusOk = true;
  return true;
}

void setup() {
  Serial.begin(115200);
  delay(800);
  printHello();
  i2cReady = startSensor();
  lastScanMs = millis();
  lastHelloMs = millis();
}

void loop() {
  const unsigned long now = millis();

  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.equalsIgnoreCase("PING")) {
      printHello();
      Serial.print("PONG ");
      Serial.println(i2cReady ? sensorAddr : 0, HEX);
    }
  }

  if (!i2cReady && now - lastHelloMs > 4000) {
    lastHelloMs = now;
    printHello();
  }

  if (!i2cReady) {
    if (now - lastScanMs > 3000) {
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

  if (!lastBusOk) {
    fifoFailStreak++;
    if (fifoFailStreak >= 30) {
      Serial.println("ERR I2C dropped. Recovering.");
      i2cReady = false;
      lastScanMs = 0;
      fifoFailStreak = 0;
      return;
    }
  } else {
    fifoFailStreak = 0;
  }

  if (gotSample) {
    Serial.print("RAW ");
    Serial.println(signal);
    if (signal > 0 && signal < 80) {
      writeReg(0x0C, 0x3F);
      writeReg(0x0D, 0x3F);
    }
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
