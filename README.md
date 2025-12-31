<div align="center">

# 🧠 MindStep: Gen-AI 기반 PTSD 맞춤형 치료 시스템
### AI-Powered Personalized PTSD Therapy via Bio-data & Generative AI

<p>
  <img src="https://img.shields.io/badge/ESP32-E74C3C?style=for-the-badge&logo=espressif&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white"/>
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
</p>

<br/>

> **"기술을 통해 트라우마를 이겨낼 수 있는 가장 안전한 한 걸음"** <br/> 실시간 생체 데이터 모니터링과 생성형 AI를 결합한 환자 맞춤형 단계별 노출 치료 플랫폼

</div>

---

## 🏗️ System Architecture

본 시스템은 환자의 안전을 최우선으로 하며, 데이터 수집부터 분석, 콘텐츠 생성까지의 워크플로우를 최적화했습니다.

1. **Edge Device (ESP32)**: 
    * MAX30105 센서를 통한 실시간 심박수(BPM) 및 산소포화도 측정
    * 환자의 상태에 따른 즉각적인 피드백(Safe Zone Alert) 하드웨어 제어
2. **Backend Server (Flask & AI)**: 
    * **Analysis**: Whisper STT를 이용한 상담 데이터 텍스트화 및 GPT-4o 기반 PTSD 키워드 분석
    * **Bridge**: Edge 데이터와 Frontend 간의 실시간 동기화 (Firebase Admin SDK)
3. **Gen-AI Content Generator**: 
    * 분석된 트라우마 키워드를 프롬프트로 변환하여 Luma/Runway AI를 통해 맞춤형 영상 생성
    * 전문가 대시보드를 통한 4단계(이완~시뮬레이션) 노출 치료 시나리오 구성

---

## 🧠 Core Logic: Safe Zone Alert

환자의 과각성 상태를 방지하기 위해 실시간 심박수 데이터를 기반으로 콘텐츠 노출을 자동 제어합니다.

$$Alert_{status} = \begin{cases} \text{Critical (STOP)} & \text{if } BPM > 138 \\ \text{Normal (CONTINUE)} & \text{if } BPM \le 138 \end{cases}$$

* **PTSD Analysis Index**: 상담 내용에서 추출된 5가지 카테고리(감각, 신체, 인지, 감정, 회피)의 가중치를 합산하여 치료 영상의 노출 강도를 결정합니다.

---

## 🛠️ Tech Stack & Tools

| Category | Technology Stack |
| :--- | :--- |
| **Edge (Hardware)** | `ESP32`, `MAX30105`, `I2S Mic`, `Arduino C++` |
| **Backend (AI)** | `Python`, `Flask`, `Whisper`, `GPT-4o` |
| **Frontend** | `React`, `Tailwind CSS`, `Lucide-react` |
| **Cloud/DB** | `Firebase (Realtime DB, Firestore, Storage)` |
| **Video Engine** | `Luma Dream Machine`, `Runway Gen-3` |

---

## 📂 Project Structure

```plaintext
MindStep/
├── ESP32.ino              # Edge: 데이터 수집 및 Firebase 전송
├── main.py                # Backend: 분석 엔진 및 API 서버
├── config.py              # Settings: API Keys & Env Variables
├── src/                   # Frontend: React Source Code
│   ├── components/        # Dashboard & EMDR Components
│   └── hooks/             # Firebase Realtime Hooks
├── serviceAccountKey.json # Firebase 인증 키
└── requirements.txt       # Python 의존성 목록