import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { ref, onValue } from 'firebase/database';
import { ref as sRef, listAll, getDownloadURL } from 'firebase/storage';
import { Heart, Activity, Video, FileText } from 'lucide-react';

function App() {
  const [bpm, setBpm] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. 실시간 BPM 수신 (ESP32로부터 전송된 데이터)
  useEffect(() => {
    const bpmRef = ref(db, '/live_session/bpm');
    onValue(bpmRef, (snapshot) => {
      const data = snapshot.val();
      setBpm(data || 0);
    });
  }, []);

  // 2. 생성된 영상 목록 가져오기
  useEffect(() => {
    const listRef = sRef(storage, 'processed_videos/');
    listAll(listRef).then((res) => {
      const promises = res.items.map((item) => getDownloadURL(item));
      Promise.all(promises).then((urls) => {
        setVideos(urls);
        setLoading(false);
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* 헤더 */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Healing Horizon Dashboard</h1>
        <p className="text-slate-500">PTSD 노출 치료 및 실시간 생체신호 모니터링</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 실시간 심박수 카드 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-600 font-medium">실시간 심박수</span>
            <Heart className={`w-6 h-6 ${bpm > 100 ? 'text-red-500 animate-ping' : 'text-rose-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-slate-800">{bpm.toFixed(0)}</span>
            <span className="text-slate-400 uppercase text-sm font-semibold">BPM</span>
          </div>
          <div className="mt-4 bg-slate-50 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-400 h-full transition-all duration-500" style={{ width: `${(bpm / 150) * 100}%` }}></div>
          </div>
        </div>

        {/* 세션 상태 카드 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4 text-slate-600 font-medium">
            <Activity className="w-5 h-5" />
            <span>AI 처리 상태</span>
          </div>
          <div className="flex gap-4">
            <StatusStep label="STT 변환" status="complete" />
            <StatusStep label="심리 분석" status="processing" />
            <StatusStep label="영상 생성" status="waiting" />
          </div>
        </div>

        {/* 영상 결과물 리스트 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-full">
          <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-xl">
            <Video className="w-6 h-6" />
            <span>생성된 치유 영상</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((url, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl bg-slate-200 aspect-video">
                <video src={url} className="w-full h-full object-cover" controls />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Session #{index + 1}
                </div>
              </div>
            ))}
            {loading && <p className="text-slate-400">영상을 불러오는 중...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// 상태 단계 표시용 컴포넌트
function StatusStep({ label, status }) {
  const colors = {
    complete: "bg-green-100 text-green-700",
    processing: "bg-blue-100 text-blue-700 animate-pulse",
    waiting: "bg-slate-100 text-slate-400"
  };
  return (
    <div className={`flex-1 p-3 rounded-xl text-center text-sm font-semibold ${colors[status]}`}>
      {label}
    </div>
  );
}

export default App;