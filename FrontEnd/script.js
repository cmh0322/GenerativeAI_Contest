import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase 설정 (ESP32와 동일한 키 사용)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  databaseURL: "YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const db = getFirestore(app);

/**
 * 실시간 심박수 모니터링 연동 [cite: 222]
 * ESP32에서 보낸 BPM 데이터를 대시보드에 반영합니다.
 */
export function listenToHeartRate(callback) {
  const bpmRef = ref(rtdb, '/live_session/bpm');
  onValue(bpmRef, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
}

/**
 * GPT-4o 분석 요청 (Python 백엔드로 전달) [cite: 82, 231]
 */
export async function requestAIAnalysis(audioUrl) {
  try {
    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_path: audioUrl })
    });
    return await response.json();
  } catch (error) {
    console.error("AI Analysis Failed:", error);
  }
}