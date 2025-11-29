import React, { useState, useEffect, useRef } from 'react';
import TradingViewWidget from './components/TradingViewWidget';
import InsightCard from './components/InsightCard';
import ReportSummary from './components/ReportSummary';
import NewsFeed from './components/NewsFeed';
import { generateStockReport, fetchStockNews } from './services/geminiService';
import { AIReport, NewsItem } from './types';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('00700');
  const [activeCode, setActiveCode] = useState('00700');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIReport | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);

  // Ref for scrolling to news
  const newsSectionRef = useRef<HTMLDivElement>(null);

  const getAAStocksUrl = (code: string) => `http://www.aastocks.com/tc/stocks/analysis/stock-aafn-con/quote.aspx?symbol=${code.padStart(5, '0')}`;
  const getFutuUrl = (code: string) => `https://www.futunn.com/hk/stock/${code}-HK`;
  
  const handleGenerate = async () => {
    let cleanCode = inputValue.trim().replace(/\.HK$/i, '');
    
    // Validation
    if (!/^\d{1,5}$/.test(cleanCode)) {
      alert("请输入有效的股票代码（例如 0700 或 1810）。");
      return;
    }
    
    // Normalize to 5 digits for general consistency (e.g. 700 -> 00700)
    // The TradingViewWidget will handle stripping zeros internally for its specific needs.
    cleanCode = cleanCode.padStart(5, '0');
    
    // Update State
    setActiveCode(cleanCode);
    setInputValue(cleanCode); // Update input to reflect normalized code
    setLoading(true);
    setReport(null); 
    setNews([]);

    try {
      const [aiResult, newsResult] = await Promise.all([
        generateStockReport(cleanCode),
        fetchStockNews(cleanCode)
      ]);
      setReport(aiResult);
      setNews(newsResult);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const scrollToNews = () => {
    newsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  // Determine Price Color (Red = Up, Green = Down for CN Market)
  const isUp = report?.change?.includes('+');
  const priceColor = isUp ? 'text-red-600' : report?.change?.includes('-') ? 'text-green-600' : 'text-slate-800';
  const bgBadge = isUp ? 'bg-red-50 text-red-600' : report?.change?.includes('-') ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600';

  return (
    <div className="h-screen w-full flex flex-col font-sans bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-8">
            {/* Brand */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-200">📈</div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden md:block">
                  股票免费推荐系统
                </h1>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 md:hidden">
                  FinScope
                </h1>
            </div>

            {/* Nav Items */}
            <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-500">
                <span className="text-violet-600 cursor-pointer bg-violet-50 px-3 py-1 rounded-full">市场 (Market)</span>
                <button onClick={scrollToNews} className="hover:text-slate-800 cursor-pointer transition-colors focus:outline-none hover:bg-slate-100 px-3 py-1 rounded-full">
                    资讯 (News)
                </button>
            </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
            <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">🔍</span>
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="输入代码 (00700)"
                    className="pl-9 pr-4 py-2 bg-slate-100 border border-transparent focus:bg-white focus:border-violet-200 rounded-full text-sm font-bold text-slate-700 w-36 md:w-56 outline-none transition-all"
                />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-6 py-2 rounded-full transition-all transform active:scale-95 shadow-md hover:shadow-lg whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? '分析中...' : '生成报告'}
            </button>
        </div>
      </header>

      {/* Main Layout - Scrollable to prevent truncation */}
      <main className="flex-grow w-full overflow-y-auto bg-slate-50 custom-scrollbar">
         <div className="max-w-[1920px] mx-auto p-4 md:p-6 flex flex-col gap-6">
             
             {/* HEADER INFO: Stock Info & Price */}
             <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex flex-col">
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{activeCode}.HK</h2>
                        <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">HKEX</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 mt-1 tracking-wider uppercase">Hong Kong Stock Exchange</span>
                 </div>
                 
                 {/* Real-time Price Display */}
                 {report ? (
                     <div className="flex items-end gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <span className={`text-6xl font-black ${priceColor} tracking-tighter`}>{report.price}</span>
                        <div className="flex flex-col items-start mb-2">
                             <div className={`flex items-baseline gap-2 text-lg font-bold ${priceColor}`}>
                                <span>{report.change}</span>
                                <span>({report.changePercent})</span>
                             </div>
                             <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded uppercase tracking-wide ${bgBadge}`}>
                                {report.marketStatus === 'OPEN' ? 'Market Open' : 'Market Closed'}
                             </span>
                        </div>
                     </div>
                 ) : (
                     <div className="flex flex-col items-end gap-2 animate-pulse w-48">
                        <div className="h-12 w-32 bg-slate-200 rounded"></div>
                        <div className="h-6 w-24 bg-slate-100 rounded"></div>
                     </div>
                 )}
             </div>

             {/* TOP SECTION: Chart + Analysis */}
             <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[600px]">
                 {/* CHART SECTION (Left) - 8 cols */}
                 <div className="xl:col-span-8 flex flex-col gap-3 h-[600px] xl:h-auto">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
                           📊 实时走势图表 (Real-time Chart)
                        </h3>
                    </div>
                    
                    <div className="flex-grow bg-white rounded-2xl shadow-sm border border-slate-200 p-1 relative overflow-hidden transition-all hover:shadow-md">
                        {/* 
                          KEY PROP: Forces complete remount when code changes.
                        */}
                        <TradingViewWidget key={activeCode} symbol={activeCode} />
                    </div>
                 </div>

                 {/* AI ANALYSIS SECTION (Right) - 4 cols */}
                 <div className="xl:col-span-4 h-full min-h-[600px]">
                    <ReportSummary report={report} loading={loading} />
                 </div>
             </div>

             {/* BOTTOM SECTION: News & Insights */}
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12" ref={newsSectionRef}>
                 <div className="h-[500px]">
                     <NewsFeed news={news} loading={loading} />
                 </div>

                 <div className="h-[500px]">
                      <InsightCard 
                        title="基本面分析 (Fundamentals)" 
                        sourceName="AASTOCKS"
                        content={report?.fundamentals || ""}
                        url={getAAStocksUrl(activeCode)}
                        loading={loading}
                        icon={<span className="text-xl">📈</span>}
                      />
                 </div>

                 <div className="h-[500px]">
                      <InsightCard 
                        title="资金流向 (Capital Flow)" 
                        sourceName="FUTU"
                        content={report?.capitalFlow || ""}
                        url={getFutuUrl(activeCode)}
                        loading={loading}
                        icon={<span className="text-xl">💸</span>}
                      />
                 </div>
             </div>

         </div>
      </main>
    </div>
  );
};

export default App;