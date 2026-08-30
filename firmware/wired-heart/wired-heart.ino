/*
  Revive Motion wired heart sensor
  -------------------------------
  Parts:
    - Arduino Uno or Nano
    - Pulse sensor (PulseSensor, KY-039, or similar analog PPG)
    - USB cable to the computer

  Wires:
    Sensor VCC  -> Arduino 5V (or 3.3V if your sensor says so)
    Sensor GND  -> Arduino GND
    Sensor OUT  -> Arduino A0

  Then:
    1. Open this file in Arduino IDE
    2. Tools -> Board = your Arduino
    3. Tools -> Port = the USB port
    4. Click Upload
    5. In Revive Motion (Chrome/Edge), tap Connect with USB and pick the Arduino
*/

const int SENSOR_PIN = A0;
const unsigned long SAMPLE_MS = 20;
const int MIN_BPM = 40;
const int MAX_BPM = 180;
const unsigned long MIN_BEAT_MS = 320;

int lastSignal = 0;
int recentMax = 512;
int recentMin = 512;
unsigned long lastBeatMs = 0;
unsigned long windowStart = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    /* wait for USB */
  }
  pinMode(SENSOR_PIN, INPUT);
}

void loop() {
  const unsigned long now = millis();
  const int signal = analogRead(SENSOR_PIN);

  Serial.print("RAW ");
  Serial.println(signal);

  if (now - windowStart > 1500) {
    const int span = recentMax - recentMin;
    if (span < 20) {
      /* no pulse yet — keep watching */
    }
    recentMax = signal;
    recentMin = signal;
    windowStart = now;
  } else {
    if (signal > recentMax) recentMax = signal;
    if (signal < recentMin) recentMin = signal;
  }

  const int threshold = recentMin + (recentMax - recentMin) * 6 / 10;
  const bool crossed =
    lastSignal <= threshold &&
    signal > threshold &&
    (now - lastBeatMs) > MIN_BEAT_MS &&
    (recentMax - recentMin) > 25;

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
  delay(SAMPLE_MS);
}
