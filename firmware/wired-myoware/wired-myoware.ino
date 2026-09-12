// Revive Motion — Elegoo Uno R3 + MyoWare 2.0
// File → New. Delete everything. Paste this whole file once.
// VIN -> Uno 5V. GND -> GND. ENV -> A0.
// Flip the MyoWare power switch ON. The VIN LED should stay lit.
// Snap electrodes: MID on the muscle, END along the muscle, REF on nearby bone.

const int PIN_ENV = A0;
const unsigned long SAMPLE_MS = 40;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_ENV, INPUT);
  delay(250);
  Serial.println("HELLO MYOWARE ELEGOO_UNO_R3");
  Serial.println("SRC ELEGOO_UNO_R3");
  Serial.println("CHIP MYOWARE2");
}

void loop() {
  if (Serial.available()) {
    while (Serial.available()) {
      Serial.read();
    }
    Serial.println("PONG MYOWARE");
  }

  const int env = analogRead(PIN_ENV);
  int emg = env / 10;
  if (emg > 100) emg = 100;

  Serial.print("ENV ");
  Serial.println(env);
  Serial.print("EMG ");
  Serial.println(emg);

  delay(SAMPLE_MS);
}
