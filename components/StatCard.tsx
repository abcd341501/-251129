import React from 'react';

interface Props {
  label: string;
  value: string;
  color?: string;
}

const StatCard: React.FC<Props> = ({ label, value, color = "text-slate-900" }) => {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</span>
      <span className={`text-2xl font-bold font-mono tracking-tight ${color}`}>{value}</span>
    </div>
  );
};

export default StatCard;