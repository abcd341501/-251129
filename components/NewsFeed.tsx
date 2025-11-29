import React from 'react';
import { NewsItem } from '../types';

interface Props {
  news: NewsItem[];
  loading: boolean;
}

const NewsFeed: React.FC<Props> = ({ news, loading }) => {
  if (loading) return <div className="p-6 text-slate-400 text-sm animate-pulse">正在扫描市场新闻...</div>;

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
             <span className="text-lg">📰</span> 相关新闻 (Related News)
        </h3>
      </div>
      <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
        {news.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-sm">暂无相关新闻</div>
        ) : (
          news.map((item, idx) => (
            <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0 group">
              <div className="flex justify-between items-start gap-3">
                 <h4 className="text-base font-bold text-slate-800 group-hover:text-violet-600 transition-colors line-clamp-2 leading-tight">
                    {item.title}
                 </h4>
                 {item.sentiment === 'positive' && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded shrink-0">利好</span>}
                 {item.sentiment === 'negative' && <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded shrink-0">利空</span>}
              </div>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{item.summary}</p>
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                 <span>{item.source}</span>
                 <span>{item.publishedTime}</span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeed;