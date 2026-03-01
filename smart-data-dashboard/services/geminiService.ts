import { GoogleGenAI } from "@google/genai";
import { DataRow, ColumnStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

// Helper for language instruction
const getLangInstruction = (lang: 'en' | 'zh') => 
  lang === 'zh' ? "Please respond in Simplified Chinese (zh-CN)." : "Please respond in English.";

/**
 * 1. Pure Math Logic (Client-side): Simulates df.describe()
 * This is faster and cheaper than sending all data to AI.
 */
export const calculateDescriptiveStats = (data: DataRow[]): ColumnStats[] => {
  if (data.length === 0) return [];

  const headers = Object.keys(data[0]);
  
  return headers.map(header => {
    const values = data.map(row => row[header]).filter(v => v !== undefined && v !== null && v !== '');
    const isNumber = values.every(v => !isNaN(Number(v)));
    
    if (isNumber && values.length > 0) {
      const numValues = values.map(v => Number(v));
      const min = Math.min(...numValues);
      const max = Math.max(...numValues);
      const sum = numValues.reduce((a, b) => a + b, 0);
      const mean = sum / numValues.length;
      
      // Standard Deviation
      const squareDiffs = numValues.map(value => Math.pow(value - mean, 2));
      const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / numValues.length;
      const std = Math.sqrt(avgSquareDiff);

      return {
        name: header,
        type: 'Numeric',
        count: values.length,
        min,
        max,
        mean: Number(mean.toFixed(2)),
        std: Number(std.toFixed(2))
      };
    } else {
      // Categorical Stats
      const frequency: Record<string, number> = {};
      let topValue = '';
      let topFreq = 0;

      values.forEach(v => {
        const strVal = String(v);
        frequency[strVal] = (frequency[strVal] || 0) + 1;
        if (frequency[strVal] > topFreq) {
          topFreq = frequency[strVal];
          topValue = strVal;
        }
      });

      return {
        name: header,
        type: 'Categorical',
        count: values.length,
        topValue,
        topFreq
      };
    }
  });
};

/**
 * 2. AI Narrative Generation
 * Reads the calculated stats and generates a "Data Profiling" report.
 */
export const generateDataOverview = async (data: DataRow[], stats: ColumnStats[], lang: 'en' | 'zh'): Promise<{ summary: string; healthScore: number }> => {
  const sampleData = JSON.stringify(data.slice(0, 5)); 
  const statsSummary = JSON.stringify(stats);

  const prompt = `
    I have calculated the descriptive statistics for a dataset (similar to pandas df.describe()).
    
    Stats: ${statsSummary}
    Sample Data (First 5 rows): ${sampleData}

    Task:
    1. Write a professional "Data Profiling Report" (2-3 sentences). 
       - Do NOT just list numbers. Interpret them. 
       - Example: "The dataset shows a high variance in sales amounts (Std: 500), indicating a mix of high-value B2B orders and smaller B2C purchases."
    2. Estimate a Health Score (0-100) based on missing values (count vs total rows) and data type consistency.

    ${getLangInstruction(lang)}
    Return ONLY a JSON object: { "summary": "string", "healthScore": number }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{"summary": "Analysis failed", "healthScore": 0}');
  } catch (error) {
    console.error("Gemini Overview Error:", error);
    return { summary: lang === 'zh' ? "暂时无法生成AI总结。" : "Could not generate AI summary at this time.", healthScore: 50 };
  }
};

/**
 * Analyze a schema (column names) without data rows.
 */
export const analyzeSchemaOnly = async (headers: string[], lang: 'en' | 'zh'): Promise<{ summary: string; recommendations: string[] }> => {
  const prompt = `
    Analyze this data schema (columns): ${headers.join(', ')}.
    
    1. Summarize what kind of data this schema represents.
    2. Provide 3 specific recommendations on what analysis *could* be done with this data if rows were populated.
    
    ${getLangInstruction(lang)}
    Return ONLY a JSON object: { "summary": "string", "recommendations": ["string"] }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{"summary": "Schema analysis failed", "recommendations": []}');
  } catch (error) {
    return { summary: "Could not analyze schema.", recommendations: [] };
  }
};

/**
 * Suggest charts based on data columns.
 */
export const generateChartSuggestions = async (data: DataRow[], lang: 'en' | 'zh'): Promise<string[]> => {
  if (data.length === 0) return [lang === 'zh' ? "添加数据以生成建议" : "Add data to generate chart suggestions"];

  const sampleData = JSON.stringify(data.slice(0, 5));
  const prompt = `
    Based on this data sample: ${sampleData}
    Suggest 3 types of charts that would be best to visualize this specific type of data.
    ${getLangInstruction(lang)}
    Return a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return ["Bar Chart Overview", "Trend Line Analysis", "Distribution Pie Chart"];
  }
};

/**
 * Client-side "Classic" Analysis (Deterministic)
 * Provides simple data features like Max, Min, Average, Count.
 */
export const generateClassicInsight = (data: DataRow[], xKey: string, yKey: string, lang: 'en' | 'zh'): string => {
    if (data.length === 0) return '';
    
    const yValues = data.map(d => Number(d[yKey])).filter(v => !isNaN(v));
    const isYNumeric = yValues.length > 0;
    
    if (isYNumeric) {
        const max = Math.max(...yValues);
        const min = Math.min(...yValues);
        const sum = yValues.reduce((a,b) => a+b, 0);
        const avg = (sum / yValues.length).toFixed(1);
        
        if (lang === 'zh') {
            return `数据范围: ${min} - ${max}。平均值: ${avg}。`;
        } else {
            return `Range: ${min} to ${max}. Average: ${avg}.`;
        }
    } else {
        // Categorical
        const xValues = data.map(d => String(d[xKey]));
        const unique = new Set(xValues).size;
        if (lang === 'zh') {
            return `包含 ${unique} 个唯一类别。`;
        } else {
            return `Contains ${unique} unique categories.`;
        }
    }
};

/**
 * Generate a small insight for a single chart.
 */
export const generateChartAnalysis = async (data: DataRow[], xKey: string, yKey: string, lang: 'en' | 'zh'): Promise<string> => {
    // Only take a sample to avoid token limits
    const sample = data.slice(0, 30).map(row => ({ [xKey]: row[xKey], [yKey]: row[yKey] }));
    const prompt = `
      Analyze this small dataset subset intended for a chart (${yKey} vs ${xKey}).
      Data: ${JSON.stringify(sample)}
      
      Provide a 1-sentence intelligent insight.
      - Mention trends, outliers, or specific segment performance.
      - Be more insightful than just "Max is X".
      ${getLangInstruction(lang)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        return response.text || (lang === 'zh' ? '无法生成分析' : 'Analysis unavailable');
    } catch (error) {
        return lang === 'zh' ? 'AI 服务繁忙' : 'AI service busy';
    }
};

/**
 * Generate a final insight report.
 */
export const generateInsightReport = async (data: DataRow[], lang: 'en' | 'zh'): Promise<string> => {
  if (data.length === 0) return lang === 'zh' ? "没有足够数据进行深度洞察。" : "No data available for deep insights.";

  const sampleData = JSON.stringify(data.slice(0, 20));
  const prompt = `
    Act as a senior data analyst. Analyze this dataset sample: ${sampleData}
    
    Write a "Key Insights" report. 
    - Identify the highest performing entities or segments.
    - Identify any concerning trends or outliers.
    - Provide 2 actionable strategic recommendations.
    
    Keep it professional, concise, and formatted with bullet points.
    ${getLangInstruction(lang)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "No insights could be generated.";
  } catch (error) {
    return "AI service is currently unavailable for insights.";
  }
};

/**
 * Generate Mock Data from Description or Schema
 */
export const generateMockDataFromInput = async (input: string, isSchema: boolean): Promise<DataRow[]> => {
  const prompt = `
    Generate a realistic JSON dataset (array of objects) with 10 rows based on this ${isSchema ? 'CSV header list' : 'description'}: 
    "${input}"
    
    Ensure the data types are varied (dates, numbers, strings) and realistic.
    Return ONLY the JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Data Gen Error", error);
    return [];
  }
};

/**
 * Generate only Schema (headers) from Description
 */
export const generateSchemaFromDescription = async (description: string): Promise<string[]> => {
  const prompt = `
    Based on the description "${description}", suggest a list of 5-7 relevant column headers for a dataset.
    Return ONLY a JSON array of strings (e.g. ["id", "date", "amount"]).
  `;
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return ["id", "name", "date", "value"];
  }
};