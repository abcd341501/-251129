import { GoogleGenAI } from "@google/genai";
import { AIReport, NewsItem } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// Helper to clean JSON
const cleanAndParseJSON = <T>(text: string): T => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstOpen = cleanText.indexOf('{');
    const lastClose = cleanText.lastIndexOf('}');
    const firstOpenArr = cleanText.indexOf('[');
    const lastCloseArr = cleanText.lastIndexOf(']');

    let start = -1;
    let end = -1;

    if (firstOpen !== -1 && (firstOpenArr === -1 || firstOpen < firstOpenArr)) {
        start = firstOpen;
        end = lastClose;
    } else if (firstOpenArr !== -1) {
        start = firstOpenArr;
        end = lastCloseArr;
    }

    if (start !== -1 && end !== -1) {
        cleanText = cleanText.substring(start, end + 1);
    }
    return JSON.parse(cleanText) as T;
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Invalid JSON format");
  }
};

export const generateStockReport = async (stockCode: string): Promise<AIReport> => {
  const ai = getClient();
  
  // MOCK DATA: Fallback if API fails or no key
  // Ensures visual consistency with the Chinese "Red is Up" standard
  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          price: "113.80",
          change: "+1.10",
          changePercent: "+0.98%",
          marketStatus: "OPEN",
          trend: "震荡上行 (Bullish)",
          support: "HK$110.50",
          resistance: "HK$118.20",
          action: "BUY",
          confidence: "82%",
          entryPoint: "HK$112.00",
          stopLoss: "HK$108.00",
          takeProfit: "HK$125.00",
          analysis: "技术面显示均线系统呈多头排列，MACD 于零轴上方金叉，显示短期动能强劲。昨日股价突破 20 天移动平均线，成交量配合放大。基本面上，市场预期季度业绩将超出指引，主要受惠于 AI 业务扩张。建议投资者分批吸纳。",
          fundamentals: "市盈率 (PE) 约 15.2倍，低于行业平均。季度盈利同比增长 12.5%。",
          capitalFlow: "今日南向资金净流入约 2.3亿港元，大单买入占比 58%。"
        });
      }, 1500);
    });
  }

  try {
    const prompt = `
      You are a Senior Quantitative Analyst for a professional trading terminal (FinScope).
      
      Target: Hong Kong Stock ${stockCode}.HK.
      
      Task:
      1. Use Google Search to find the REAL-TIME PRICE, Change, and Change% for ${stockCode}.HK.
      2. Analyze Technicals (MACD, RSI, MA) and Fundamentals.
      3. Output a strictly valid JSON.
      
      CRITICAL:
      - Language: SIMPLIFIED CHINESE (简体中文).
      - China/HK Market Style: Red represents PRICE UP (+), Green represents PRICE DOWN (-).
      - Ensure 'change' includes '+' or '-' sign.
      - Be strictly factual with the price.
      
      JSON Structure:
      {
        "price": "Current Price (e.g. 113.80)",
        "change": "Price Change (e.g. +1.10)",
        "changePercent": "Percentage Change (e.g. +0.98%)",
        "marketStatus": "OPEN" or "CLOSED",
        "trend": "Short trend summary",
        "support": "Support level",
        "resistance": "Resistance level",
        "action": "BUY" | "SELL" | "HOLD",
        "confidence": "Confidence % (e.g. 85%)",
        "entryPoint": "Entry price",
        "stopLoss": "Stop loss",
        "takeProfit": "Target price",
        "analysis": "Detailed analysis paragraph (Simplified Chinese).",
        "fundamentals": "Fundamental summary.",
        "capitalFlow": "Capital flow summary."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1, 
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return cleanAndParseJSON<AIReport>(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      price: "---",
      change: "0.00",
      changePercent: "0.00%",
      marketStatus: "CLOSED",
      trend: "DATA_ERR",
      support: "---",
      resistance: "---",
      action: "HOLD",
      confidence: "0%",
      entryPoint: "---",
      stopLoss: "---",
      takeProfit: "---",
      analysis: "无法获取最新数据，请检查 API 设置或稍后重试。",
      fundamentals: "N/A",
      capitalFlow: "N/A"
    };
  }
};

export const fetchStockNews = async (stockCode: string): Promise<NewsItem[]> => {
  const ai = getClient();

  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { 
            title: `[财报] ${stockCode} 季度营收超预期，AI 业务成新增长引擎`, 
            url: "#", 
            source: "AASTOCKS", 
            publishedTime: "30分钟前",
            sentiment: "positive",
            summary: "营收同比增长20%，净利润超出市场预期5%。"
          },
          { 
            title: "南向资金连续3日大幅增持，累计吸纳超5亿元", 
            url: "#", 
            source: "ETNet", 
            publishedTime: "2小时前",
            sentiment: "positive",
            summary: "内地资金持续流入，显示看好后市。"
          },
          { 
            title: "大市回调，科技股普遍受压", 
            url: "#", 
            source: "HKEJ", 
            publishedTime: "4小时前",
            sentiment: "negative",
            summary: "恒生科技指数今日下跌，气氛偏弱。"
          }
        ]);
      }, 1000);
    });
  }

  try {
    const prompt = `
      Search news for ${stockCode}.HK.
      Return STRICT JSON array of top 4 news items.
      Analyze sentiment (positive/negative/neutral).
      
      JSON Structure:
      [{
        "title": "Title (Simplified Chinese)",
        "source": "Source",
        "url": "Link",
        "publishedTime": "Time ago",
        "sentiment": "positive" | "negative" | "neutral",
        "summary": "Brief summary (Simplified Chinese)"
      }]
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });

    const text = response.text;
    if (!text) return [];
    return cleanAndParseJSON<NewsItem[]>(text);

  } catch (error) {
    return [];
  }
};