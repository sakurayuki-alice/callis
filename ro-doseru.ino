#include <Arduino.h>
// https://github.com/bogde/HX711
#include "HX711.h"

const int DT_PIN = 2;
const int SCK_PIN = 3;
double Weight_Excel;
HX711 scale;

void setup() {
  Serial.begin(9600);
  Serial.println("start");
  scale.begin(DT_PIN, SCK_PIN);

  Serial.print("read:");
  Serial.println(scale.read());

  scale.set_scale();
  scale.tare();　//ゼロ点補正

  Serial.print("calibrating...");
  delay(5000);
  Serial.println(scale.get_units(10));

  scale.set_scale(-1536.00);　//ロードセルの調整
  scale.tare(); //ゼロ点補正

  Serial.print("read (calibrated):");
  Serial.println(scale.get_units(10));
}


void loop() {
  Serial.print("Weight:");
  Weight_Excel = scale.get_units(10)*41.6*1.3136-2271.2;     //消しゴム補正
  Serial.print(Weight_Excel, 1);
  Serial.println(" g");
  
  scale.power_down();
  delay(500);
  scale.power_up();
}
