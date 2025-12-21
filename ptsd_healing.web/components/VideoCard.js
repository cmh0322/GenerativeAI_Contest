import React from 'react';
import { PlayCircle, Download } from 'lucide-react';

const VideoCard = ({ url, index }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-slate-900">
        <video 
          src={url} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
          <PlayCircle className="text-white w-12 h-12" />
        </div>
      </div>
      
      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-800">치유 세션 #{index + 1}</h3>
          <p className="text-xs text-slate-400">AI Generated Video</p>
        </div>
        <button 
          onClick={() => window.open(url)}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-500 transition-colors"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;