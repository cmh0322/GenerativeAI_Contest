<div align="center">

# 🌿 Healing Horizon
### AI-Powered PTSD Exposure Therapy & Bio-Signal Monitoring System

<p>
  <img src="https://img.shields.io/badge/ESP32--S3-E74C3C?style=for-the-badge&logo=espressif&logoColor=white"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
</p>

<br/>

> **"기술로 마음을 치유하다"** <br/> 실시간 생체 신호와 생성형 AI를 결합한 차세대 디지털 치료제(DTx) 솔루션

[데모 영상 보기(링크)] | [프로젝트 발표 자료(링크)]

</div>

---

## 📖 Overview

**Healing Horizon**은 PTSD(외상 후 스트레스 장애) 환자의 효과적인 노출 치료(Exposure Therapy)를 돕기 위해 설계된 통합 시스템입니다.

기존의 고비용/고정된 치료 방식에서 벗어나, **임베디드 하드웨어**를 통해 환자의 심박수($BPM$)와 음성을 실시간으로 수집하고, **멀티모달 AI 파이프라인(STT → LLM → Video Gen)**을 거쳐 환자 개인에게 최적화된 시네마틱 치유 영상을 자동으로 생성합니다.

### 🌟 Key Features

* ❤️ **실시간 바이오피드백**: ESP32-S3 기반 엣지 디바이스로 심박수를 모니터링하고 과각성 상태를 즉각 감지합니다.
* 🧠 **멀티모달 AI 분석**: 환자의 구술 내용(Text)과 생체 신호(Data)를 결합하여 심리 상태를 입체적으로 분석합니다.
* 🎬 **시네마틱 영상 생성**: 분석된 데이터를 바탕으로 Luma/Runway AI를 활용해 고화질의 맞춤형 치료 영상을 생성합니다.
* 🖥️ **직관적인 대시보드**: React 기반 웹 인터페이스로 치료 과정과 결과를 한눈에 시각화합니다.

---

## 🏗️ System Architecture

<div align="center">
  <img src="./images/system_architecture.png" width="80%" alt="System Architecture Diagram">
  <p><i>Fig 1. Healing Horizon 전체 시스템 구성도</i></p>
</div>

---

## 🎥 Preview (Demo)

| **Hardware (Edge Device)** | **Software (Web Dashboard)** |
| :---: | :---: |
| <img src="./images/hardware_demo.gif" width="400px" alt="Hardware Demo"> | <img src="./images/dashboard_demo.gif" width="400px" alt="Dashboard Demo"> |
| *ESP32 & 실시간 심박 센서 작동 모습* | *실시간 BPM 그래프 및 영상 생성 결과* |

---

## 🛠️ Tech Stack & Tools

| Category | Technology Stack |
| :--- | :--- |
| **Embedded (Edge)** | ![ESP32](https://img.shields.io/badge/-ESP32--S3-black?logo=espressif) `Arduino Core` `FreeRTOS` <br/> **Sensors:** MAX30102 (PPG), INMP441 (I2S Mic) |
| **Cloud & DB** | ![Firebase](https://img.shields.io/badge/-Firebase-black?logo=firebase) `Realtime Database` `Cloud Storage` |
| **AI Backend** | ![Python](https://img.shields.io/badge/-Python-black?logo=python) <br/> **Models:** `OpenAI Whisper (STT)` `GPT-4o (Reasoning)` `Luma/Runway (Video Gen)` |
| **Frontend** | ![React](https://img.shields.io/badge/-React.js-black?logo=react) ![Tailwind](https://img.shields.io/badge/-Tailwind-black?logo=tailwindcss) `Lucide Icons` |

---

## 🚀 Getting Started

### Prerequisites
* ESP32-S3 보드 및 센서 모듈
* Firebase 프로젝트 계정 및 API Key
* OpenAI / Luma API Key

### Installation

**1. Clone the repository**
```bash
git clone [https://github.com/username/healing-horizon.git](https://github.com/username/healing-horizon.git)
