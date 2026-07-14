/*
 * DEMO — tests HC-05 wireless link without MAX30102.
 *
 * Wire HC-05 to Arduino pins 0/1 (see hardware/HC05-SETUP.md).
 * Pair HC-05 with Windows, upload this sketch, close Serial Monitor.
 * App → Session → HC-05 Bluetooth → pick the Bluetooth COM port.
 */

void setup() {
  Serial.begin(9600);
  while (!Serial) { ; }
  Serial.println(F("{\"status\":\"demo\",\"device\":\"Revive HC-05 demo\"}"));
}

void loop() {
  int hr = 68 + (millis() / 2000) % 18;
  Serial.print(F("{\"hr\":"));
  Serial.print(hr);
  Serial.println(F(",\"spo2\":98}"));
  delay(1000);
}
