import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

const StatusStep = ({ label, status }) => {
  // status: 'complete', 'processing', 'waiting'
  
  const styles = {
    complete: {
      box: "bg-green-50 border-green-100 text-green-700",
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    processing: {
      box: "bg-blue-50 border-blue-100 text-blue-700 animate-pulse",
      icon: <Loader2 className="w-4 h-4 animate-spin" />
    },
    waiting: {
      box: "bg-slate-50 border-slate-100 text-slate-400",
      icon: <Circle className="w-4 h-4" />
    }
  };

  const currentStyle = styles[status] || styles.waiting;

  return (
    <div className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-sm ${currentStyle.box}`}>
      {currentStyle.icon}
      {label}
    </div>
  );
};

export default StatusStep;