import React from 'react';

interface Props {
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: string;
}

const SentimentGauge: React.FC<Props> = ({ action, confidence }) => {
  const confValue = parseInt(confidence.replace('%', '')) || 50;
  
  // Logic: 0 = Strong Sell (Green), 50 = Hold, 100 = Strong Buy (Red)
  let gaugeValue = 50;
  if (action === 'BUY') gaugeValue = 50 + (confValue / 2); // 50-100
  else if (action === 'SELL') gaugeValue = 50 - (confValue / 2); // 0-50
  
  gaugeValue = Math.max(0, Math.min(100, gaugeValue));

  // Screenshot Style: Red is Positive/High, Green is Negative/Low
  let color = '#94a3b8'; // gray
  if (gaugeValue > 55) color = '#ef4444'; // Red-500 (Bullish)
  if (gaugeValue < 45) color = '#22c55e'; // Green-500 (Bearish)

  return (
    <div className="relative flex flex-col items-center justify-end h-32 w-full">
      {/* Half Circle Gauge */}
      <svg viewBox="0 0 200 110" className="w-48 h-28 overflow-visible">
        {/* Track */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeWidth="20" strokeLinecap="round" />
        
        {/* Progress */}
        <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke={color} 
            strokeWidth="20" 
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 * (1 - gaugeValue / 100)}
            className="transition-all duration-1000 ease-out"
        />
        
        {/* Needle/Text Center */}
        <text x="100" y="90" textAnchor="middle" fill={color} className="text-3xl font-bold font-sans">
            {confidence}
        </text>
        <text x="100" y="115" textAnchor="middle" fill="#64748b" className="text-sm font-bold tracking-widest uppercase">
            {action === 'BUY' ? '看涨 (BUY)' : action === 'SELL' ? '看跌 (SELL)' : '观望 (HOLD)'}
        </text>
      </svg>
      
      <div className="flex justify-between w-48 mt-2 text-[10px] font-bold text-slate-400 uppercase px-2">
          <span>Bearish</span>
          <span>Bullish</span>
      </div>
    </div>
  );
};

export default SentimentGauge;