import React, { useState } from 'react';

interface Props {
  symbol: string;
}

type TimeFrame = '1d' | '5d' | '1m' | '3m' | '6m' | '1y' | '5y';

const TradingViewWidget: React.FC<Props> = ({ symbol }) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('6m');
  const [imgError, setImgError] = useState(false);

  // 1. Format Symbol for Yahoo Finance
  // Yahoo expects "0700.HK" (4 digits) or "1810.HK". 
  // We strip leading zeros then pad to at least 4 digits just in case, though parseInt usually suffices.
  // Example: "00700" -> 700 -> "0700". "01810" -> 1810 -> "1810".
  const cleanNumber = parseInt(symbol, 10);
  const yahooSymbol = `${cleanNumber.toString().padStart(4, '0')}.HK`;

  // 2. Construct Yahoo Finance Chart Image URL
  // s = symbol
  // t = timeframe
  // q = type (c = candle, l = line)
  // l = log scale (on/off)
  // z = size (l = large)
  // p = indicators (m50, m200 = moving averages)
  // a = volume (v)
  const chartType = timeframe === '1d' || timeframe === '5d' ? 'l' : 'c'; // Line for intraday, Candle for longer
  const indicators = timeframe === '1d' ? '' : 'm50,m200,v';
  
  // Cache busting param
  const timestamp = new Date().getTime();
  
  const chartUrl = `https://chart.finance.yahoo.com/z?s=${yahooSymbol}&t=${timeframe}&q=${chartType}&l=off&z=l&p=${indicators}&a=v&region=HK&lang=zh-HK&time=${timestamp}`;

  const handleTimeframeChange = (tf: TimeFrame) => {
    setTimeframe(tf);
    setImgError(false);
  };

  return (
    <div className="h-full w-full bg-white rounded-xl overflow-hidden relative border border-slate-200 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['1d', '5d', '1m', '3m', '6m', '1y', '5y'] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-white text-slate-500 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="text-xs font-bold text-slate-400 hidden sm:block">
          {yahooSymbol}
        </div>
      </div>

      {/* Chart Image Area */}
      <div className="flex-grow relative bg-white flex items-center justify-center p-4">
        {!imgError ? (
          <img
            key={`${yahooSymbol}-${timeframe}`} // Force reload on change
            src={chartUrl}
            alt={`Chart for ${yahooSymbol}`}
            className="max-w-full max-h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-center p-6">
            <p className="text-slate-400 text-sm font-bold mb-2">无法加载图表截图</p>
            <p className="text-xs text-slate-300 mb-4">可能是该股票代码不支持或网络连接问题</p>
            <a 
                href={`https://hk.finance.yahoo.com/quote/${yahooSymbol}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 text-xs hover:underline"
            >
                前往 Yahoo 财经查看
            </a>
          </div>
        )}
        
        {/* Watermark / Attribution */}
        <div className="absolute bottom-2 right-2 text-[10px] text-slate-300 pointer-events-none">
          Source: Yahoo Finance
        </div>
      </div>
    </div>
  );
};

export default TradingViewWidget;