import React from 'react';
import { AIReport } from '../types';
import SentimentGauge from './SentimentGauge';
import StatCard from './StatCard';

interface Props {
  report: AIReport | null;
  loading: boolean;
}

const ReportSummary: React.FC<Props> = ({ report, loading }) => {
  if (loading) {
    return (
      <div className="h-full w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-4"></div>
        <span className="text-violet-600 font-bold text-lg animate-pulse">AI 分析运算中...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="h-full w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-slate-400">
        <span className="text-xl font-bold">等待生成报告</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Top Cards: Gauge & Key Levels */}
      <div className="flex flex-col xl:flex-row gap-4 h-auto xl:h-64 shrink-0">
         {/* Sentiment Gauge Card */}
         <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
             <h3 className="absolute top-4 left-4 text-slate-500 font-bold text-sm tracking-wider uppercase">AI 综合信号</h3>
             <SentimentGauge action={report.action} confidence={report.confidence} />
         </div>

         {/* Price Levels Grid */}
         <div className="flex-1 grid grid-cols-2 gap-3">
            <StatCard label="建仓区间 (ENTRY)" value={report.entryPoint} color="text-violet-600" />
            <StatCard label="目标价 (TARGET)" value={report.takeProfit} color="text-red-500" />
            <StatCard label="止损位 (STOP)" value={report.stopLoss} color="text-green-600" />
            <StatCard label="趋势 (TREND)" value={report.trend.split(' ')[0]} color="text-slate-800" />
         </div>
      </div>

      {/* Analysis Text Card */}
      <div className="flex-grow bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-violet-600 rounded-full"></div>
            核心逻辑分析 (Core Logic)
          </h3>
          <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
            <p className="text-xl text-slate-700 leading-9 text-justify font-medium">
                {report.analysis}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-500 font-mono">
            <span>支持位: {report.support}</span>
            <span>阻力位: {report.resistance}</span>
          </div>
      </div>
    </div>
  );
};

export default ReportSummary;