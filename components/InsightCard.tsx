import React from 'react';
import FlowChart from './FlowChart';

interface Props {
  title: string;
  sourceName: string;
  content: string;
  url: string;
  loading: boolean;
  icon?: React.ReactNode;
}

const InsightCard: React.FC<Props> = ({ title, sourceName, content, url, loading, icon }) => {
  const isFlowCard = title.includes("资金");

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
           {icon}
           <h3>{title}</h3>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 hover:underline">查看原文</a>
      </div>
      
      <div className="flex-grow p-5 overflow-y-auto custom-scrollbar flex flex-col">
        {loading ? (
           <div className="space-y-3 animate-pulse">
              <div className="h-2 bg-slate-100 rounded w-full"></div>
              <div className="h-2 bg-slate-100 rounded w-3/4"></div>
           </div>
        ) : content ? (
           <>
             <div className="text-base text-slate-600 leading-7 text-justify mb-3 font-medium">
                 {content}
             </div>
             {isFlowCard && <div className="mt-auto"><FlowChart content={content} /></div>}
           </>
        ) : (
           <div className="text-center text-slate-400 text-sm mt-4">暂无数据</div>
        )}
      </div>
    </div>
  );
};

export default InsightCard;