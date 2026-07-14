/*
 * DEMO — no sensor needed. Tests Revive Motion USB Cable connection.
 *
 * Upload this, close Serial Monitor, open app → Session → USB Cable.
 * Prints fake heart rate every second.
 */

void setup() {
  Serial.begin(115200);
  while (!Serial) { ; }
  Serial.println(F("{\"status\":\"demo\",\"device\":\"Revive serial demo\"}"));
}

void loop() {
  int hr = 68 + random(0, 18);
  Serial.print(F("{\"hr\":"));
  Serial.print(hr);
  Serial.println(F(",\"spo2\":98}"));
  delay(1000);
}
