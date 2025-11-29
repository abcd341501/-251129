import React from 'react';

interface Props {
  content: string;
}

const FlowChart: React.FC<Props> = ({ content }) => {
  const isInflow = /流入|买入|吸纳|增持/g.test(content);
  const isOutflow = /流出|卖出|减持|拋售/g.test(content);
  
  const numberMatch = content.match(/(\d+(\.\d+)?)亿/);
  const amount = numberMatch ? parseFloat(numberMatch[1]) : 1; 
  const intensity = Math.min(100, Math.max(20, amount * 10));

  // CN Market: Red = Good (Inflow), Green = Bad (Outflow)
  let colorClass = "bg-slate-300";
  let label = "平稳 (NEUTRAL)";
  let width = "10%";

  if (isInflow && !isOutflow) {
    colorClass = "bg-red-500"; 
    label = "净流入 (NET INFLOW)";
    width = `${intensity}%`;
  } else if (isOutflow && !isInflow) {
    colorClass = "bg-green-500";
    label = "净流出 (NET OUTFLOW)";
    width = `${intensity}%`;
  }

  return (
    <div className="w-full mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex justify-between text-xs text-slate-400 mb-2 font-bold uppercase">
        <span>流出 (Out)</span>
        <span>资金强度</span>
        <span>流入 (In)</span>
      </div>
      
      <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center">
         <div className="absolute w-[2px] h-full bg-slate-400 z-10"></div>
         <div 
            className={`h-full absolute transition-all duration-1000 ease-out ${colorClass}`}
            style={{
                width: width,
                left: isInflow && !isOutflow ? '50%' : 'auto',
                right: isOutflow && !isInflow ? '50%' : 'auto',
            }}
         ></div>
      </div>
      
      <div className="mt-2 text-center">
         <span className={`text-xs font-bold px-2 py-1 rounded ${isInflow && !isOutflow ? 'text-red-600 bg-red-100' : isOutflow ? 'text-green-600 bg-green-100' : 'text-slate-500'}`}>
            {label} {amount !== 1 ? `~${amount}亿` : ''}
         </span>
      </div>
    </div>
  );
};

export default FlowChart;