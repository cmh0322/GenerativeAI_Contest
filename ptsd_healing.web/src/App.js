import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { ref, onValue } from 'firebase/database';
import { ref as sRef, listAll, getDownloadURL } from 'firebase/storage';

// 컴포넌트 임포트
import BPMCard from './components/BPMCard';
import VideoCard from './components/VideoCard';
import StatusStep from './components/StatusStep';

function App() {
  const [bpm, setBpm] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bpmRef = ref(db, '/live_session/bpm');
    onValue(bpmRef, (snapshot) => setBpm(snapshot.val() || 0));

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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Healing Horizon</h1>
          <p className="text-slate-500">AI-Powered Exposure Therapy System</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <BPMCard bpm={bpm} />
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-2">
            <h2 className="text-slate-600 font-medium mb-4 text-sm uppercase tracking-wider">System Pipeline Status</h2>
            <div className="flex flex-col sm:flex-row gap-4 h-full justify-center">
              <StatusStep label="Voice Transcription" status="complete" />
              <StatusStep label="Emotional Analysis" status="processing" />
              <StatusStep label="Cinematic Rendering" status="waiting" />
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            Generated Therapy Videos
            <span className="bg-slate-200 text-slate-600 text-xs py-1 px-2 rounded-full">{videos.length}</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((url, index) => (
              <VideoCard key={index} url={url} index={index} />
            ))}
          </div>
          {loading && <div className="text-center py-20 text-slate-400">Loading your healing sessions...</div>}
        </section>
      </div>
    </div>
  );
}

export default App;