import React, { useState } from 'react';

interface Props {
  url: string;
  title: string;
  sourceName: string;
  description: string;
}

const ExternalFrame: React.FC<Props> = ({ url, title, sourceName, description }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative group">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-100 transition-colors text-slate-600"
        >
          打開原網頁
        </a>
      </div>
      
      <div className="flex-grow relative bg-slate-100">
         <iframe 
            src={url} 
            className="w-full h-full border-0" 
            title={title}
            onError={() => setShowOverlay(true)}
          />
          
          {/* Overlay that appears on hover or can be toggled if iframe is blocked */}
          <div className={`absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm pointer-events-none group-hover:pointer-events-auto`}>
            <p className="mb-2 font-semibold text-lg">來源網站可能限制了嵌入顯示</p>
            <p className="text-sm mb-4 text-slate-300">為了獲得最佳體驗，建議前往 {sourceName} 官方網站查看完整數據。</p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              前往 {sourceName}
            </a>
          </div>
      </div>
    </div>
  );
};

export default ExternalFrame;