import React from 'react';
import { Heart } from 'lucide-react';

const BPMCard = ({ bpm }) => {
  const isHigh = bpm > 100;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-600 font-medium">실시간 심박수</span>
        <Heart 
          className={`w-6 h-6 transition-colors duration-300 ${
            isHigh ? 'text-red-500 animate-ping' : 'text-rose-400'
          }`} 
        />
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold text-slate-800">
          {bpm ? bpm.toFixed(0) : '--'}
        </span>
        <span className="text-slate-400 uppercase text-sm font-semibold">BPM</span>
      </div>

      {/* 강도 표시 바 */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Stability</span>
          <span>{isHigh ? 'High Stress' : 'Normal'}</span>
        </div>
        <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              isHigh ? 'bg-red-500' : 'bg-rose-400'
            }`}
            style={{ width: `${Math.min((bpm / 160) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BPMCard;