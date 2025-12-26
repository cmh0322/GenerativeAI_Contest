#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <driver/i2s.h>
#include <SD.h>
#include <SPI.h>
#include "MAX30105.h"
#include "heartRate.h"

// Config - Input your credentials here
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "YOUR_PROJECT_ID.firebaseio.com"
#define STORAGE_BUCKET_ID "YOUR_PROJECT_ID.appspot.com"

// Define pins
#define I2S_WS 42
#define I2S_SD 41
#define I2S_SCK 1
#define SD_CS 10

MAX30105 particleSensor;
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
    Serial.begin(115200);
    
    //Connect to WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
    if (!SD.begin(SD_CS)) { Serial.println("SD Card Mount Failed"); return; }

    //configure Firebase
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

    //configure I2S
    i2s_config_t i2s_config = {
        .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
        .sample_rate = 16000,
        .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
        .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
        .communication_format = I2S_COMM_FORMAT_I2S,
        .dma_buf_count = 8,
        .dma_buf_len = 64
    };
    i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);

    //configure MAX30105
    particleSensor.begin(Wire, I2C_SPEED_FAST);
    particleSensor.setup();
}

void loop() {
    //RTDB
    long irValue = particleSensor.getIR();
    if (checkForBeat(irValue)) {
        float bpm = 60 / ((millis() - lastBeat) / 1000.0);
        Firebase.RTDB.setFloat(&fbdo, "/live_session/bpm", bpm);
    }

    // [중략] 녹음 버튼 감지 시 SD에 저장 후 함수 실행
    uploadToFirebase("/recording.wav", "session_001.wav");
}

void uploadToFirebase(String localPath, String remotePath) {
    if (Firebase.ready()) {
        Firebase.Storage.upload(&fbdo, STORAGE_BUCKET_ID, localPath, mem_storage_type_sd, remotePath, "audio/wav");
    }
}