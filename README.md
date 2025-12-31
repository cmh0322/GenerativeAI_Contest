<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>MindStep README</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; line-height: 1.6; color: #24292e; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; margin-top: 24px; }
        code { background-color: rgba(27,31,35,0.05); padding: 0.2em 0.4em; border-radius: 3px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; }
        pre { background-color: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        table th, table td { border: 1px solid #dfe2e5; padding: 6px 13px; }
        table tr:nth-child(even) { background-color: #f6f8fa; }
        blockquote { padding: 0 1em; color: #6a737d; border-left: 0.25em solid #dfe2e5; margin: 0; }
        .emoji { font-style: normal; }
    </style>
</head>
<body>

    <h1><span class="emoji">🧠</span> MindStep: Gen-AI 기반 PTSD 맞춤형 치료 시스템</h1>
    <p><strong>MindStep</strong>은 생체 데이터 분석과 생성형 AI 기술을 결합하여 PTSD(외상 후 스트레스 장애) 환자를 위한 개인 맞춤형 단계별 치료 콘텐츠를 제공하는 차세대 심리 치료 솔루션입니다.</p>

    <hr>

    <h2><span class="emoji">🌟</span> 주요 기능 (Key Features)</h2>
    
    <h3>1. 실시간 생체 데이터 모니터링 (Edge Device)</h3>
    <ul>
        <li><strong>Heart Rate Monitoring</strong>: MAX30105 센서를 활용하여 환자의 심박수(BPM)를 실시간으로 측정합니다.</li>
        <li><strong>Safe Zone Alert</strong>: 환자의 심박수가 임계치(예: 138 BPM)를 초과하여 과각성 상태가 감지될 경우 즉시 시청 중단 경고를 발생시킵니다.</li>
    </ul>

    <h3>2. AI 기반 상담 심층 분석 (Backend)</h3>
    <ul>
        <li><strong>Whisper STT</strong>: 상담 중 발생하는 음성 데이터를 텍스트로 정교하게 변환합니다.</li>
        <li><strong>GPT-4o 분석</strong>: 상담 내용을 바탕으로 감각, 신체, 인지, 감정, 회피의 5가지 핵심 카테고리별 PTSD 키워드를 추출합니다.</li>
    </ul>

    <h3>3. 맞춤형 치료 콘텐츠 생성 (Gen-AI)</h3>
    <ul>
        <li><strong>Adaptive Video Generation</strong>: 분석된 트라우마 맥락을 바탕으로 Luma/Runway AI를 통해 단계별 치료 영상을 생성합니다.</li>
        <li><strong>4단계 노출 치료</strong>: 호흡 이완(1단계)부터 실제 상황 시뮬레이션(4단계)까지 전문가의 판단에 따른 점진적 노출을 지원합니다.</li>
    </ul>

    <h2><span class="emoji">🛠</span> 기술 스택 (Tech Stack)</h2>
    <table>
        <thead>
            <tr>
                <th>구분</th>
                <th>기술</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Edge</strong></td>
                <td>ESP32, MAX30105, I2S Mic, Arduino C++</td>
            </tr>
            <tr>
                <td><strong>Backend</strong></td>
                <td>Python, Flask, OpenAI (Whisper, GPT-4o), Firebase Admin SDK</td>
            </tr>
            <tr>
                <td><strong>Frontend</strong></td>
                <td>React, Tailwind CSS, Lucide-react, Firebase SDK</td>
            </tr>
            <tr>
                <td><strong>Storage</strong></td>
                <td>Firebase Realtime Database, Firestore, Cloud Storage</td>
            </tr>
            <tr>
                <td><strong>Video AI</strong></td>
                <td>Luma Dream Machine, Runway Gen-3</td>
            </tr>
        </tbody>
    </table>

    <h2><span class="emoji">📂</span> 파일 구조 (Project Structure)</h2>
<pre><code>MindStep/
├── ESP32.ino              # 엣지 디바이스: 데이터 수집 및 전송
├── main.py                # 백엔드: AI 분석 및 API 서버
├── config.py              # 설정: API 키 및 환경 변수
├── index.html             # 프론트엔드: 전문의용 대시보드 UI
├── script.js              # 프론트엔드: Firebase 연동 및 동적 로직
├── style.css              # 디자인: EMDR 애니메이션 및 CSS 스타일링
├── serviceAccountKey.json # 인증: Firebase 서비스 계정 키
└── requirements.txt       # 의존성: 파이썬 라이브러리 목록</code></pre>

    <h2><span class="emoji">🚀</span> 시작 가이드 (Quick Start)</h2>

    <h3>1. Backend 설정</h3>
<pre><code>pip install -r requirements.txt
python main.py</code></pre>
    <blockquote>config.py에 OpenAI 및 Firebase API 키를 설정해야 합니다.</blockquote>

    <h3>2. Frontend 설정</h3>
    <ul>
        <li>index.html을 브라우저에서 실행하거나 React 환경에서 빌드합니다.</li>
        <li>script.js에 본인의 Firebase 프로젝트 설정을 입력하세요.</li>
    </ul>

    <h3>3. Edge Device 설정</h3>
    <ul>
        <li>Arduino IDE를 통해 ESP32.ino를 보드에 업로드합니다.</li>
        <li>WiFi 크리덴셜 및 Firebase 호스트 주소를 수정하세요.</li>
    </ul>

    <hr>
    <p><em>MindStep은 기술을 통해 트라우마를 이겨낼 수 있는 가장 안전한 한 걸음을 함께합니다.</em></p>

</body>
</html>