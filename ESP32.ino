#include <Arduino.h>
#include <driver/i2s.h>
#include "MAX30105.h"
#include "heartRate.h"

#define I2S_WS 42
#define I2S_SD 41
#define I2S_SCK 1
#define I2S_PORT I2S_NUM_0

MAX30105 particleSensor;

// 패킷 헤더 정의
const uint8_t SYNC_BYTE_1 = 0xAA;
const uint8_t SYNC_BYTE_2 = 0xBB;
const uint8_t TYPE_AUDIO = 0x01;
const uint8_t TYPE_BPM = 0x02;

void sendPacket(uint8_t type, uint8_t* data, size_t len) {
    Serial.write(SYNC_BYTE_1);
    Serial.write(SYNC_BYTE_2);
    Serial.write(type);
    Serial.write((uint8_t)(len >> 8));   // 길이 상위 바이트
    Serial.write((uint8_t)(len & 0xFF)); // 길이 하위 바이트
    Serial.write(data, len);
}

void taskHeartRate(void *pvParameters) {
    long lastBeat = 0;
    for (;;) {
        long irValue = particleSensor.getIR();
        if (checkForBeat(irValue) == true) {
            long delta = millis() - lastBeat;
            lastBeat = millis();
            float bpm = 60 / (delta / 1000.0);
            
            if (bpm < 255 && bpm > 20) {
                // BPM 데이터를 바이트 배열로 변환하여 전송
                uint8_t bpmData[4];
                memcpy(bpmData, &bpm, 4);
                sendPacket(TYPE_BPM, bpmData, 4);
            }
        }
        vTaskDelay(10 / portTICK_PERIOD_MS);
    }
}

void taskAudioStream(void *pvParameters) {
    size_t bytesRead;
    const int bufferSize = 512;
    uint8_t buffer[bufferSize];

    while (true) {
        i2s_read(I2S_PORT, &buffer, bufferSize, &bytesRead, portMAX_DELAY);
        sendPacket(TYPE_AUDIO, buffer, bytesRead);
        vTaskDelay(1 / portTICK_PERIOD_MS);
    }
}

void setup() {
    Serial.begin(921600); // 고속 통신
    
    // I2S 및 센서 초기화 (이전 코드와 동일)
    // ... [중략: I2S 및 MAX30105 설정 코드] ...

    xTaskCreatePinnedToCore(taskHeartRate, "HeartRate", 4096, NULL, 1, NULL, 0);
    xTaskCreatePinnedToCore(taskAudioStream, "AudioStream", 8192, NULL, 2, NULL, 1);
}

void loop() {}