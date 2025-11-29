
export interface StockData {
  symbol: string;
  code: string;
  name?: string;
}

export interface AIReport {
  price: string;        // e.g. "113.80"
  change: string;       // e.g. "+1.10"
  changePercent: string;// e.g. "+0.98%"
  marketStatus: 'OPEN' | 'CLOSED';
  trend: string;
  support: string;
  resistance: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: string;
  entryPoint: string;
  stopLoss: string;
  takeProfit: string;
  analysis: string;
  fundamentals: string; 
  capitalFlow: string; 
}

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedTime?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  summary?: string;
}

export interface WidgetProps {
  stockCode: string;
  title: string;
  description: string;
  className?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}