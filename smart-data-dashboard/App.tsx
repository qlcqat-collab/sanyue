import React, { useState, useMemo, useEffect } from 'react';
import { 
  UploadCloud, 
  BarChart2, 
  TrendingUp, 
  Lightbulb, 
  Download, 
  RefreshCw,
  Table,
  Wand2,
  PieChart as PieIcon,
  Activity,
  ArrowRight,
  ShoppingBag,
  Bike,
  Users,
  User,
  Clipboard,
  Bot,
  Database,
  X,
  Sigma,
  Plus,
  Trash2,
  ScatterChart as ScatterIcon,
  AreaChart as AreaIcon,
  LayoutTemplate,
  PenTool,
  MapPin,
  Mail,
  Calendar,
  Share2,
  Globe,
  Sparkles,
  Zap,
  Cpu
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from 'recharts';

import { AppStep, DataRow, ColumnInfo, AnalysisState, DEMO_DATASETS, ChartConfig, ChartType, AnalysisModel } from './types';
import { 
  generateDataOverview, 
  generateChartSuggestions, 
  generateInsightReport, 
  generateMockDataFromInput, 
  generateSchemaFromDescription, 
  analyzeSchemaOnly,
  calculateDescriptiveStats,
  generateChartAnalysis,
  generateClassicInsight
} from './services/geminiService';

// --- Colors ---
const MORANDI_COLORS = ['#8CA6A2', '#A69EBB', '#E09F95', '#9FB8AD', '#DBCFB0', '#9AA0A8', '#E6C9A8', '#C8C6A7'];

// --- Translations ---
const TRANSLATIONS = {
  en: {
    title: "DataMind",
    steps: {
      upload: { title: "Source", desc: "Upload Data" },
      overview: { title: "Scan", desc: "Data Health" },
      exploration: { title: "Visualize", desc: "Auto-Plot" },
      insights: { title: "Synthesize", desc: "AI Conclusions" },
    },
    headers: {
      upload: { title: "Import Data", subtitle: "Begin your analysis", hint: "Select a demo dataset or upload your own." },
      overview: { title: "Data Profiling", subtitle: "Health Check", processing: "Processing...", complete: "Profile complete.", analyzing: "Analyzing statistics..." },
      exploration: { title: "Visual Board", subtitle: "Trends & Patterns", auto: "Auto-Pilot Mode Active", custom: "Custom Studio Active" },
      insights: { title: "Conclusions", subtitle: "Actionable Intelligence", hint: "Key strategic drivers identified." },
    },
    controlDeck: {
      title: "Control Deck",
      req: { title: "Requirements", item1: "CSV or Excel format", item2: "Header row required" },
      health: "Health Score",
      mode: { auto: "Auto-Pilot", custom: "Custom" },
      chartType: "Chart Type",
      xAxis: "X-Axis",
      yAxis: "Y-Axis",
      selectCol: "Select Column...",
      addToBoard: "Add to Board",
      activeCharts: "Active Charts",
      downloadPdf: "Download PDF",
      emailReport: "Email Report",
      shareLink: "Share Link",
      automation: "Automation",
      scheduleRun: "Schedule Run",
      datasetMetrics: "Dataset Metrics",
      introTitle: "Data Analysis Platform",
      introDesc: "Upload your data or select a template to begin. We support automatic insight generation and smart visualization.",
      rows: "Rows",
      cols: "Columns",
      memory: "Est. Memory",
      analysisEngine: "Analysis Engine",
      standard: "Standard",
      aiAgent: "AI Agent"
    },
    templates: {
      title: "Enterprise Data Sources",
      logistics: { title: "City Delivery", desc: "Includes 100+ Chinese cities data." },
      ecommerce: { title: "Order Data", desc: "Order flow & delivery status." },
      riders: { title: "Rider Data", desc: "Performance & fleet metrics." },
      users: { title: "User Segments", desc: "Demographics & churn risk." },
    },
    customInput: {
      title: "Custom Data",
      upload: { title: "Upload File", desc: "CSV or Excel (Max 50MB)" },
      paste: { title: "Paste / Schema", desc: "Paste CSV text or define headers manually." },
      ai: { title: "AI Data Gen", desc: "Describe your data needs and let AI build it." },
    },
    modal: {
      aiTitle: "AI Generator",
      pasteTitle: "Paste / Format",
      aiDesc: "Describe the dataset you need (e.g., 'Weekly sales for a coffee shop with items and prices').",
      pasteDesc: "Paste your CSV headers or raw JSON data structure below.",
      aiPlaceholder: "E.g., Customer list with age, location, and subscription status...",
      pastePlaceholder: "id, name, email, role, status...",
      simulate: "Simulate Mock Data",
      cancel: "Cancel",
      genAnalyze: "Generate & Analyze",
      analyzeStruct: "Analyze Structure",
    },
    content: {
      aiGenerated: "AI Generated",
      dataProfile: "Data Profiling Report",
      statProfile: "Statistical Profile",
      metaDict: "Metadata Dictionary",
      fieldName: "Field Name",
      detType: "Detected Type",
      missing: "Missing Values",
      unique: "Unique Values",
      avg: "Average",
      mostFreq: "Most Frequent",
      min: "Min",
      max: "Max",
      stdDev: "StdDev",
      count: "Count",
      topFreq: "Top Freq",
      noData: "No Data to Visualize",
      noDataDesc: "Import or generate actual data rows to see automatic visualizations.",
      emptyCanvas: "Your canvas is empty.",
      emptyDesc: "Use the builder on the right to add charts.",
      highIntel: "High Priority Intelligence",
      perfAnomaly: "Performance Anomaly",
      perfDesc: "Detected in delivery durations.",
      topPerf: "Top Performer",
      topDesc: "Contributes to significant volume.",
      optimize: "Optimization",
      optDesc: "Potential efficiency gains.",
      stratSum: "Strategic Summary",
      wait: "Synthesizing intelligence...",
      geoDist: "Geographic Distribution",
      compOf: "Composition of",
      trend: "Trend",
      analyze: "Analyze",
      analyzing: "Analyzing...",
      classicInsight: "Data Features",
      aiThinking: "AI Agent is analyzing patterns...",
      analysisModels: {
          trend: "Time-Series Analysis",
          comparison: "Comparative Analysis",
          composition: "Composition Analysis",
          correlation: "Correlation Analysis",
          funnel: "Funnel Analysis",
          distribution: "Distribution Analysis"
      }
    }
  },
  zh: {
    title: "DataMind",
    steps: {
      upload: { title: "数据源", desc: "导入数据" },
      overview: { title: "概览", desc: "数据健康" },
      exploration: { title: "可视化", desc: "智能绘图" },
      insights: { title: "洞察", desc: "AI 总结" },
    },
    headers: {
      upload: { title: "导入数据", subtitle: "开始分析", hint: "选择演示数据或上传文件" },
      overview: { title: "数据画像", subtitle: "健康检查", processing: "处理中...", complete: "画像完成", analyzing: "正在分析统计数据..." },
      exploration: { title: "可视化看板", subtitle: "趋势与模式", auto: "自动驾驶模式已激活", custom: "自定义工坊已激活" },
      insights: { title: "结论总结", subtitle: "行动建议", hint: "关键战略驱动因素已识别" },
    },
    controlDeck: {
      title: "控制台",
      req: { title: "数据要求", item1: "CSV 或 Excel 格式", item2: "包含标题行" },
      health: "健康评分",
      mode: { auto: "自动驾驶", custom: "自定义" },
      chartType: "图表类型",
      xAxis: "X 轴",
      yAxis: "Y 轴",
      selectCol: "选择列...",
      addToBoard: "添加到看板",
      activeCharts: "活跃图表",
      downloadPdf: "下载 PDF",
      emailReport: "邮件发送报告",
      shareLink: "分享链接",
      automation: "自动化",
      scheduleRun: "预约运行",
      datasetMetrics: "数据集指标",
      introTitle: "数据分析平台",
      introDesc: "上传数据或选择模版开始。我们支持自动生成洞察和智能可视化。",
      rows: "行数",
      cols: "列数",
      memory: "预估内存",
      analysisEngine: "分析引擎",
      standard: "经典模型",
      aiAgent: "AI Agent"
    },
    templates: {
      title: "企业数据源",
      logistics: { title: "城市配送", desc: "包含100+中国城市数据。" },
      ecommerce: { title: "订单数据", desc: "订单流转与配送状态。" },
      riders: { title: "骑手数据", desc: "绩效与车队指标。" },
      users: { title: "用户分群", desc: "人口统计与流失风险。" },
    },
    customInput: {
      title: "自定义数据",
      upload: { title: "上传文件", desc: "CSV 或 Excel (最大 50MB)" },
      paste: { title: "粘贴 / 结构", desc: "粘贴 CSV 文本或定义表头" },
      ai: { title: "AI 数据生成", desc: "描述需求，让 AI 生成数据" },
    },
    modal: {
      aiTitle: "AI 生成器",
      pasteTitle: "粘贴 / 格式化",
      aiDesc: "描述您需要的数据集（例如：'带有商品和价格的咖啡店周销售额'）。",
      pasteDesc: "在下方粘贴 CSV 表头或原始 JSON 数据结构。",
      aiPlaceholder: "例如：包含年龄、位置和订阅状态的客户列表...",
      pastePlaceholder: "id, name, email, role, status...",
      simulate: "模拟仿真数据",
      cancel: "取消",
      genAnalyze: "生成并分析",
      analyzeStruct: "分析结构",
    },
    content: {
      aiGenerated: "AI 生成",
      dataProfile: "数据画像报告",
      statProfile: "统计概览",
      metaDict: "元数据字典",
      fieldName: "字段名称",
      detType: "检测类型",
      missing: "缺失值",
      unique: "唯一值",
      avg: "平均值",
      mostFreq: "最高频",
      min: "最小值",
      max: "最大值",
      stdDev: "标准差",
      count: "计数",
      topFreq: "最高频次",
      noData: "暂无数据可视化",
      noDataDesc: "导入或生成实际数据以查看自动图表。",
      emptyCanvas: "画布为空",
      emptyDesc: "使用右侧构建器添加图表。",
      highIntel: "高优先级情报",
      perfAnomaly: "性能异常",
      perfDesc: "在配送时长中检测到异常。",
      topPerf: "最佳表现",
      topDesc: "贡献了主要业务量。",
      optimize: "优化建议",
      optDesc: "潜在的效率提升空间。",
      stratSum: "战略总结",
      wait: "正在综合情报...",
      geoDist: "地理分布",
      compOf: "构成分析：",
      trend: "趋势",
      analyze: "分析",
      analyzing: "分析中...",
      classicInsight: "数据特征",
      aiThinking: "AI Agent 正在分析数据模式...",
      analysisModels: {
          trend: "时序分析",
          comparison: "对比分析",
          composition: "交叉分析", // Using "Cross Analysis" as requested for Composition/Distribution
          correlation: "相关性分析",
          funnel: "漏斗分析", // Simulated
          distribution: "分布分析"
      }
    }
  }
};

export default function App() {
  // --- State ---
  const [lang, setLang] = useState<'en' | 'zh'>('zh'); // Default to Chinese
  const t = TRANSLATIONS[lang];

  const [activeStep, setActiveStep] = useState<AppStep>(AppStep.UPLOAD);
  const [data, setData] = useState<DataRow[]>([]);
  const [datasetName, setDatasetName] = useState<string>(''); 
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [isSchemaOnly, setIsSchemaOnly] = useState(false); 
  const [schemaAdvice, setSchemaAdvice] = useState<string[]>([]); 

  // Exploration / Charting State
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [builderConfig, setBuilderConfig] = useState<{type: ChartType, x: string, y: string}>({ type: 'bar', x: '', y: '' });
  const [chartAnalysisLoading, setChartAnalysisLoading] = useState<Record<string, boolean>>({});
  const [isAiAgentEnabled, setIsAiAgentEnabled] = useState(false); // Toggle for Analysis Engine

  const [analysis, setAnalysis] = useState<AnalysisState>({
    summary: '',
    healthScore: 0,
    columnStats: [],
    suggestedCharts: [],
    finalConclusion: '',
    isAnalyzing: false,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'paste' | 'ai'>('paste');
  const [inputText, setInputText] = useState('');
  const [simulateData, setSimulateData] = useState(true);

  // Right Panel Hover State for Upload
  const [hoveredUploadItem, setHoveredUploadItem] = useState<string | null>(null);

  // --- Derived State for Selectors ---
  const numericColumns = useMemo(() => columns.filter(c => c.type === 'number').map(c => c.name), [columns]);
  const categoricalColumns = useMemo(() => columns.filter(c => c.type === 'string' || c.type === 'date').map(c => c.name), [columns]);

  // --- Helpers ---
  const inferColumns = (rawData: DataRow[]): ColumnInfo[] => {
    if (rawData.length === 0) return [];
    const headers = Object.keys(rawData[0]);
    return headers.map(header => {
      const val = rawData[0][header];
      const type = typeof val === 'number' ? 'number' : 'string';
      return {
        name: header,
        type: type as any,
        missingCount: rawData.filter(r => r[header] === undefined || r[header] === null || r[header] === '').length,
        uniqueCount: new Set(rawData.map(r => r[header])).size
      };
    });
  };

  const generateAutoCharts = (cols: ColumnInfo[], currentData: DataRow[]): ChartConfig[] => {
      if (cols.length === 0) return [];
      
      const newCharts: ChartConfig[] = [];
      const colNames = cols.map(c => c.name.toLowerCase());
      
      const nums = cols.filter(c => c.type === 'number').map(c => c.name);
      const cats = cols.filter(c => c.type !== 'number').map(c => c.name);
      const dateCol = cols.find(c => c.name.toLowerCase().includes('date') || c.name.toLowerCase().includes('time'))?.name;

      // 1. Time-Series Analysis (Trend)
      if (dateCol && nums.length > 0) {
          newCharts.push({ 
              id: 'model-trend', 
              type: 'area', 
              xKey: dateCol, 
              yKey: nums[0], 
              title: `${nums[0]} Trend`,
              analysisModel: 'trend',
              classicInsight: generateClassicInsight(currentData, dateCol, nums[0], lang)
          });
      }

      // 2. Comparative Analysis (Bar)
      if (cats.length > 0 && nums.length > 0) {
           // If we have a category like "City", "Product", "Rider"
           const compareCat = cats.find(c => !c.toLowerCase().includes('date')) || cats[0];
           newCharts.push({ 
               id: 'model-comparison', 
               type: 'bar', 
               xKey: compareCat, 
               yKey: nums[0], 
               title: `${nums[0]} by ${compareCat}`,
               analysisModel: 'comparison',
               classicInsight: generateClassicInsight(currentData, compareCat, nums[0], lang)
           });
      }

      // 3. Composition/Cross Analysis (Pie)
      if (cats.length > 0 && nums.length > 0) {
          const compCat = cats[0];
          newCharts.push({ 
              id: 'model-composition', 
              type: 'pie', 
              xKey: compCat, 
              yKey: nums[0], 
              title: `${t.content.compOf} ${nums[0]}`,
              analysisModel: 'composition',
              classicInsight: generateClassicInsight(currentData, compCat, nums[0], lang)
          });
      }

      // 4. Map/Distribution (Scatter)
      const hasLat = colNames.some(n => n.includes('lat'));
      const hasLng = colNames.some(n => n.includes('lng') || n.includes('lon'));
      
      if (hasLat && hasLng) {
         const latKey = cols.find(c => c.name.toLowerCase().includes('lat'))?.name || '';
         const lngKey = cols.find(c => c.name.toLowerCase().includes('lng') || c.name.toLowerCase().includes('lon'))?.name || '';
         newCharts.push({ 
             id: 'model-distribution', 
             type: 'scatter', 
             xKey: lngKey, 
             yKey: latKey, 
             title: t.content.geoDist,
             analysisModel: 'distribution',
             classicInsight: lang === 'zh' ? '基于经纬度的地理分布散点图。' : 'Geographical distribution based on coordinates.'
         });
      }

      // 5. Funnel Analysis (Simulated using Bar if 'status' or 'stage' exists)
      const funnelCat = cats.find(c => c.toLowerCase().includes('status') || c.toLowerCase().includes('stage'));
      if (funnelCat) {
          // We count frequencies for the funnel
          newCharts.push({
              id: 'model-funnel',
              type: 'bar', // Using bar to represent funnel steps
              xKey: funnelCat,
              yKey: nums[0] || 'count', // Fallback to a metric or just counts (simplified here)
              title: 'Conversion Funnel',
              analysisModel: 'funnel',
              classicInsight: generateClassicInsight(currentData, funnelCat, nums[0] || '', lang)
          });
      }

      return newCharts;
  };

  // --- Handlers ---
  const handleLoadDemoData = (datasetKey: string) => {
    const selectedData = DEMO_DATASETS[datasetKey];
    if (!selectedData) return;
    
    // Set friendly name based on key
    let friendlyName = 'Demo Data';
    if (datasetKey === 'ORDERS') friendlyName = t.templates.ecommerce.title;
    if (datasetKey === 'RIDERS') friendlyName = t.templates.riders.title;
    if (datasetKey === 'USERS') friendlyName = t.templates.users.title;
    if (datasetKey === 'SMART_LOGISTICS') friendlyName = t.templates.logistics.title;

    setDatasetName(friendlyName);
    processData(selectedData);
  };

  const processData = (newData: DataRow[]) => {
    setData(newData);
    const inferredCols = inferColumns(newData);
    setColumns(inferredCols);
    
    const nums = inferredCols.filter(c => c.type === 'number').map(c => c.name);
    const cats = inferredCols.filter(c => c.type !== 'number').map(c => c.name);
    
    // Set builder default
    setBuilderConfig({ type: 'bar', x: cats[0] || inferredCols[0]?.name, y: nums[0] || inferredCols[1]?.name });

    // Generate Auto Charts and set to main chart state
    const auto = generateAutoCharts(inferredCols, newData);
    setCharts(auto);

    setIsSchemaOnly(false);
    handleAnalyzeData(newData);
    setActiveStep(AppStep.OVERVIEW); 
  };

  const handleAnalyzeData = async (currentData: DataRow[]) => {
    setAnalysis(prev => ({ ...prev, isAnalyzing: true }));
    const stats = calculateDescriptiveStats(currentData);
    const overview = await generateDataOverview(currentData, stats, lang);
    const charts = await generateChartSuggestions(currentData, lang);
    const insights = await generateInsightReport(currentData, lang);

    setAnalysis({
      summary: overview.summary,
      healthScore: overview.healthScore,
      columnStats: stats,
      suggestedCharts: charts,
      finalConclusion: insights,
      isAnalyzing: false,
    });
  };

  const handleSchemaAnalysis = async (headers: string[], description: string) => {
    setAnalysis(prev => ({ ...prev, isAnalyzing: true }));
    setIsSchemaOnly(true);
    const fakeColumns: ColumnInfo[] = headers.map(h => ({ name: h, type: 'string', missingCount: 0, uniqueCount: 0 }));
    setColumns(fakeColumns);
    setData([]);

    const result = await analyzeSchemaOnly(headers, lang);

    setAnalysis({
      summary: result.summary,
      healthScore: 100, 
      columnStats: [],
      suggestedCharts: [],
      finalConclusion: lang === 'zh' ? "等待数据填充。" : "Waiting for data population.",
      isAnalyzing: false,
    });
    setSchemaAdvice(result.recommendations);
    setActiveStep(AppStep.OVERVIEW);
  };

  const handleModalSubmit = async () => {
    if (!inputText.trim()) return;
    setIsModalOpen(false);
    setAnalysis(prev => ({ ...prev, isAnalyzing: true }));

    try {
      if (simulateData) {
        setDatasetName(modalMode === 'ai' ? (lang === 'zh' ? 'AI 生成数据' : 'AI Generated Data') : (lang === 'zh' ? '自定义数据' : 'Custom Data'));
        const generatedData = await generateMockDataFromInput(inputText, modalMode === 'paste');
        processData(generatedData);
      } else {
        setDatasetName(lang === 'zh' ? '结构模版' : 'Schema Template');
        let headers: string[] = [];
        if (modalMode === 'paste') {
            const firstLine = inputText.split('\n')[0];
            headers = firstLine.split(',').map(h => h.trim());
        } else {
            headers = await generateSchemaFromDescription(inputText);
        }
        await handleSchemaAnalysis(headers, inputText);
      }
    } catch (e) {
      console.error("Processing failed", e);
      setAnalysis(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleAddCustomChart = () => {
      if (!builderConfig.x || !builderConfig.y) return;
      const newChart: ChartConfig = {
          id: `custom-${Date.now()}`,
          type: builderConfig.type,
          xKey: builderConfig.x,
          yKey: builderConfig.y,
          title: `${builderConfig.type.charAt(0).toUpperCase() + builderConfig.type.slice(1)}: ${builderConfig.y} vs ${builderConfig.x}`,
          analysisModel: 'comparison', // Default to comparison for custom
          classicInsight: generateClassicInsight(data, builderConfig.x, builderConfig.y, lang)
      };
      // Append to existing charts instead of replacing
      setCharts(prev => [...prev, newChart]);
  };

  const removeChart = (id: string) => {
      setCharts(prev => prev.filter(c => c.id !== id));
  };

  const handleAnalyzeChart = async (chart: ChartConfig) => {
      setChartAnalysisLoading(prev => ({ ...prev, [chart.id]: true }));
      const analysisText = await generateChartAnalysis(data, chart.xKey, chart.yKey, lang);
      setCharts(prev => prev.map(c => c.id === chart.id ? { ...c, aiInsight: analysisText } : c));
      setChartAnalysisLoading(prev => ({ ...prev, [chart.id]: false }));
  };

  // Effect to auto-analyze charts when AI agent is enabled
  useEffect(() => {
    if (isAiAgentEnabled && activeStep === AppStep.EXPLORATION && charts.length > 0) {
        charts.forEach(chart => {
            if (!chart.aiInsight && !chartAnalysisLoading[chart.id]) {
                handleAnalyzeChart(chart);
            }
        });
    }
  }, [isAiAgentEnabled, activeStep, charts]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setDatasetName(e.target.files[0].name);
       handleLoadDemoData('ORDERS'); 
    }
  };

  // --- Generic Chart Renderer ---
  const renderChart = (config: ChartConfig) => {
      const commonProps = {
          data: data,
          margin: { top: 10, right: 10, left: 0, bottom: 0 }
      };

      const wrapChart = (chartNode: React.ReactNode) => (
         <ResponsiveContainer width="100%" height="100%">
             {chartNode as any}
         </ResponsiveContainer>
      );

      switch (config.type) {
          case 'bar':
              return wrapChart(
                  <BarChart {...commonProps}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                      <XAxis dataKey={config.xKey} axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 10}} dy={10} interval="preserveStartEnd" />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 10}} />
                      <RechartsTooltip cursor={{fill: '#f5f5f4'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px', fontSize: '12px'}} />
                      <Bar dataKey={config.yKey} fill={MORANDI_COLORS[0]} radius={[4, 4, 0, 0]} />
                  </BarChart>
              );
          case 'line':
          case 'area':
              return wrapChart(
                  <AreaChart {...commonProps}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                      <XAxis dataKey={config.xKey} hide />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 10}} />
                      <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                      <Area type="monotone" dataKey={config.yKey} stroke={MORANDI_COLORS[1]} fill={MORANDI_COLORS[1]} fillOpacity={0.3} />
                  </AreaChart>
              );
          case 'pie':
               return wrapChart(
                   <PieChart>
                       <Pie data={data} dataKey={config.yKey} nameKey={config.xKey} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} cornerRadius={4}>
                           {data.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={MORANDI_COLORS[index % MORANDI_COLORS.length]} stroke="none" />
                           ))}
                       </Pie>
                       <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                       <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{fontSize: '10px'}} />
                   </PieChart>
               );
          case 'scatter':
              return wrapChart(
                  <ScatterChart {...commonProps}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                      <XAxis dataKey={config.xKey} type="number" name={config.xKey} axisLine={false} tickLine={false} tick={{fontSize: 10}} domain={['auto', 'auto']} />
                      <YAxis dataKey={config.yKey} type="number" name={config.yKey} axisLine={false} tickLine={false} tick={{fontSize: 10}} domain={['auto', 'auto']} />
                      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{borderRadius: '8px', border: 'none', fontSize: '12px'}}/>
                      <Scatter name={config.title} data={data} fill={MORANDI_COLORS[3]} shape="circle" />
                  </ScatterChart>
              );
          default: return null;
      }
  };

  // --- Render Functions ---

  const renderImportModal = () => {
    if (!isModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-stone-100">
           {/* Modal Header */}
           <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 {modalMode === 'ai' ? <Bot className="w-5 h-5 text-purple-500"/> : <Clipboard className="w-5 h-5 text-blue-500"/>}
                 <h3 className="font-bold text-stone-700">{modalMode === 'ai' ? t.modal.aiTitle : t.modal.pasteTitle}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5"/></button>
           </div>
           
           {/* Modal Body */}
           <div className="p-6 space-y-4">
              <p className="text-sm text-stone-500">
                {modalMode === 'ai' ? t.modal.aiDesc : t.modal.pasteDesc}
              </p>
              <textarea 
                className="w-full h-32 p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-stone-400 outline-none resize-none"
                placeholder={modalMode === 'ai' ? t.modal.aiPlaceholder : t.modal.pastePlaceholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-100">
                 <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-stone-400" />
                    <span className="text-sm font-medium text-stone-700">{t.modal.simulate}</span>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={simulateData} onChange={(e) => setSimulateData(e.target.checked)} />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-800"></div>
                 </label>
              </div>
           </div>
           <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-stone-500 hover:text-stone-700">{t.modal.cancel}</button>
              <button onClick={handleModalSubmit} className="px-6 py-2 bg-stone-800 text-white text-sm font-bold rounded-xl hover:bg-stone-700 transition-colors">
                 {simulateData ? t.modal.genAnalyze : t.modal.analyzeStruct}
              </button>
           </div>
        </div>
      </div>
    );
  };

  const renderUploadContent = () => (
    <div className="flex flex-col h-full space-y-10 animate-fade-in pb-12">
      <div>
         <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">{t.templates.title}</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {/* New Logistics Map Card */}
             <div 
                onClick={() => handleLoadDemoData('SMART_LOGISTICS')} 
                onMouseEnter={() => setHoveredUploadItem('SMART_LOGISTICS')}
                onMouseLeave={() => setHoveredUploadItem(null)}
                className="group relative bg-gradient-to-br from-stone-800 to-stone-900 text-white p-6 rounded-2xl border border-stone-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
             >
                <div className="absolute top-4 right-4 bg-white/10 p-1 rounded-lg backdrop-blur-sm">
                    <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4"><Bike className="w-5 h-5 text-white" /></div>
                <h4 className="font-bold mb-1">{t.templates.logistics.title}</h4>
                <p className="text-xs text-stone-300">{t.templates.logistics.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                    <span className="bg-white/10 px-2 py-1 rounded">LAT/LNG</span>
                    <span className="bg-white/10 px-2 py-1 rounded">TIER</span>
                </div>
            </div>

            <div 
                onClick={() => handleLoadDemoData('ORDERS')}
                onMouseEnter={() => setHoveredUploadItem('ORDERS')}
                onMouseLeave={() => setHoveredUploadItem(null)}
                className="group relative bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
            >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4"><ShoppingBag className="w-5 h-5" /></div>
                <h4 className="font-bold text-stone-800 mb-1">{t.templates.ecommerce.title}</h4>
                <p className="text-xs text-stone-500">{t.templates.ecommerce.desc}</p>
            </div>
            <div 
                onClick={() => handleLoadDemoData('RIDERS')} 
                onMouseEnter={() => setHoveredUploadItem('RIDERS')}
                onMouseLeave={() => setHoveredUploadItem(null)}
                className="group relative bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
            >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4"><Bike className="w-5 h-5" /></div>
                <h4 className="font-bold text-stone-800 mb-1">{t.templates.riders.title}</h4>
                <p className="text-xs text-stone-500">{t.templates.riders.desc}</p>
            </div>
            <div 
                onClick={() => handleLoadDemoData('USERS')}
                onMouseEnter={() => setHoveredUploadItem('USERS')}
                onMouseLeave={() => setHoveredUploadItem(null)} 
                className="group relative bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
            >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4"><Users className="w-5 h-5" /></div>
                <h4 className="font-bold text-stone-800 mb-1">{t.templates.users.title}</h4>
                <p className="text-xs text-stone-500">{t.templates.users.desc}</p>
            </div>
         </div>
      </div>

      <div>
         <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">{t.customInput.title}</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
                className="relative group bg-stone-50 p-6 rounded-2xl border-2 border-dashed border-stone-200 hover:bg-stone-100 hover:border-stone-300 transition-all cursor-pointer flex flex-col items-center text-center justify-center h-48"
                onMouseEnter={() => setHoveredUploadItem('UPLOAD_FILE')}
                onMouseLeave={() => setHoveredUploadItem(null)}
            >
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} accept=".csv,.xlsx" />
                <UploadCloud className="w-8 h-8 text-stone-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-stone-700">{t.customInput.upload.title}</h4>
                <p className="text-xs text-stone-400 mt-1">{t.customInput.upload.desc}</p>
            </div>
            <div onClick={() => { setModalMode('paste'); setInputText(''); setIsModalOpen(true); }} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col h-48 justify-between group">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors"><Clipboard className="w-6 h-6" /></div>
                   <ArrowRight className="w-5 h-5 text-stone-200 group-hover:text-blue-500 transition-colors"/>
                </div>
                <div>
                   <h4 className="font-bold text-stone-800">{t.customInput.paste.title}</h4>
                   <p className="text-xs text-stone-500 mt-1">{t.customInput.paste.desc}</p>
                </div>
            </div>
            <div onClick={() => { setModalMode('ai'); setInputText(''); setIsModalOpen(true); }} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer flex flex-col h-48 justify-between group">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-purple-50 text-purple-500 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors"><Wand2 className="w-6 h-6" /></div>
                   <ArrowRight className="w-5 h-5 text-stone-200 group-hover:text-purple-500 transition-colors"/>
                </div>
                <div>
                   <h4 className="font-bold text-stone-800">{t.customInput.ai.title}</h4>
                   <p className="text-xs text-stone-500 mt-1">{t.customInput.ai.desc}</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderOverviewContent = () => (
    <div className="space-y-10 pb-10">
      <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-4">
              <div className="p-3 bg-stone-900 rounded-xl text-white">
                  <Wand2 className="w-6 h-6" />
              </div>
              <div className="space-y-2 max-w-3xl z-10">
                  <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">{t.content.dataProfile} <span className="bg-purple-100 text-purple-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">{t.content.aiGenerated}</span></h3>
                  <p className="text-stone-600 leading-relaxed">
                      {analysis.summary || t.headers.overview.analyzing}
                  </p>
              </div>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-stone-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      <div>
          <div className="flex items-center gap-2 mb-6">
              <Sigma className="w-5 h-5 text-stone-400" />
              <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">{t.content.statProfile}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis.columnStats.map((stat, i) => {
                  const isHighlighted = (stat.name.toLowerCase().includes('total') || stat.name.toLowerCase().includes('rating') || stat.type === 'Categorical') && stat.count > 0;
                  
                  return (
                  <div key={i} className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${isHighlighted ? 'bg-amber-50/50 border-amber-100' : 'bg-white border-stone-100'}`}>
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h4 className="font-bold text-lg text-stone-700">{stat.name}</h4>
                              <span className={`text-xs px-2 py-1 rounded border ${stat.type === 'Numeric' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-purple-50 border-purple-100 text-purple-600'}`}>
                                  {stat.type}
                              </span>
                          </div>
                          {stat.type === 'Numeric' ? (
                              <div className="text-right">
                                  <div className="text-2xl font-bold text-stone-800">{stat.mean}</div>
                                  <div className="text-xs text-stone-400">{t.content.avg}</div>
                              </div>
                          ) : (
                             <div className="text-right">
                                  <div className="text-lg font-bold text-stone-800 truncate max-w-[120px]">{stat.topValue}</div>
                                  <div className="text-xs text-stone-400">{t.content.mostFreq}</div>
                              </div>
                          )}
                      </div>
                      <div className={`grid grid-cols-3 gap-2 mt-4 pt-4 border-t ${isHighlighted ? 'border-amber-100/50' : 'border-stone-50'}`}>
                          {stat.type === 'Numeric' ? (
                              <>
                                  <div className="text-center">
                                      <div className="text-xs text-stone-400 mb-1">{t.content.min}</div>
                                      <div className="font-medium text-stone-700">{stat.min}</div>
                                  </div>
                                  <div className="text-center border-l border-stone-200/50">
                                      <div className="text-xs text-stone-400 mb-1">{t.content.max}</div>
                                      <div className="font-medium text-stone-700">{stat.max}</div>
                                  </div>
                                  <div className="text-center border-l border-stone-200/50">
                                      <div className="text-xs text-stone-400 mb-1">{t.content.stdDev}</div>
                                      <div className="font-medium text-stone-700">{stat.std}</div>
                                  </div>
                              </>
                          ) : (
                              <>
                                  <div className="text-center">
                                      <div className="text-xs text-stone-400 mb-1">{t.content.count}</div>
                                      <div className="font-medium text-stone-700">{stat.count}</div>
                                  </div>
                                  <div className="text-center border-l border-stone-200/50 col-span-2">
                                      <div className="text-xs text-stone-400 mb-1">{t.content.topFreq}</div>
                                      <div className="font-medium text-stone-700">{stat.topFreq} ({(stat.topFreq! / stat.count * 100).toFixed(0)}%)</div>
                                  </div>
                              </>
                          )}
                      </div>
                  </div>
              )})}
          </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-6">
              <Table className="w-5 h-5 text-stone-400" />
              <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">{t.content.metaDict}</h2>
        </div>
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
            <thead className="text-stone-400 bg-stone-50/50">
                <tr>
                <th className="px-8 py-4 font-medium">{t.content.fieldName}</th>
                <th className="px-8 py-4 font-medium">{t.content.detType}</th>
                {!isSchemaOnly && <th className="px-8 py-4 font-medium">{t.content.missing}</th>}
                {!isSchemaOnly && <th className="px-8 py-4 font-medium">{t.content.unique}</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
                {columns.map((col, idx) => (
                <tr key={idx} className="hover:bg-stone-50/30 transition-colors">
                    <td className="px-8 py-4 font-semibold text-stone-700">{col.name}</td>
                    <td className="px-8 py-4">
                    <span className="px-3 py-1 rounded-md text-xs font-medium border bg-stone-100 text-stone-600 border-stone-200">
                        {col.type}
                    </span>
                    </td>
                    {!isSchemaOnly && <td className="px-8 py-4 text-stone-500">
                        <span className={col.missingCount > 0 ? "text-rose-500 font-bold" : "text-stone-500"}>
                            {col.missingCount}
                        </span>
                    </td>}
                    {!isSchemaOnly && <td className="px-8 py-4 text-stone-500">{col.uniqueCount}</td>}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );

  const renderExplorationContent = () => {
    if (isSchemaOnly || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                    <BarChart2 className="w-8 h-8 text-stone-300" />
                </div>
                <h3 className="text-xl font-bold text-stone-700 mb-2">{t.content.noData}</h3>
                <p className="text-stone-500 max-w-md">{t.content.noDataDesc}</p>
            </div>
        );
    }

    return (
    <div className="pb-10">
      {/* Chart Grid */}
      {charts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
              <PenTool className="w-8 h-8 text-stone-300 mb-2"/>
              <p className="text-stone-400 font-medium">{t.content.emptyCanvas}</p>
              <p className="text-stone-300 text-sm">{t.content.emptyDesc}</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {charts.map((chart, i) => (
                  <div key={chart.id} className={`bg-white p-6 rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col min-h-[400px] group relative ${chart.type === 'scatter' ? 'col-span-1 lg:col-span-2' : ''}`}>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                        <button onClick={() => removeChart(chart.id)} className="p-1.5 bg-rose-50 text-rose-500 rounded-lg transition-all hover:bg-rose-100">
                            <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mb-4 flex-shrink-0">
                          <div className="min-w-0">
                              <h3 className="font-bold text-stone-800 truncate">{chart.title}</h3>
                              <p className="text-xs text-stone-400 capitalize flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full ${isAiAgentEnabled ? 'bg-purple-400' : 'bg-stone-400'}`}></span>
                                  {t.content.analysisModels[chart.analysisModel]}
                              </p>
                          </div>
                      </div>
                      
                      <div className="flex-1 min-h-0 w-full mb-4">
                          {renderChart(chart)}
                      </div>

                      {/* Analysis Block */}
                      <div className={`rounded-xl p-4 border transition-colors ${isAiAgentEnabled ? 'bg-purple-50/50 border-purple-100' : 'bg-stone-50 border-stone-100'}`}>
                          {isAiAgentEnabled ? (
                              /* AI MODE INSIGHT */
                              <div>
                                  {chart.aiInsight ? (
                                     <div className="flex items-start gap-2 animate-fade-in">
                                        <Bot className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-stone-700 leading-relaxed">{chart.aiInsight}</p>
                                     </div>
                                  ) : (
                                     <div className="flex items-center gap-2 text-xs text-purple-500 animate-pulse">
                                         <RefreshCw className="w-3 h-3 animate-spin" />
                                         {t.content.aiThinking}
                                     </div>
                                  )}
                              </div>
                          ) : (
                              /* CLASSIC MODE INSIGHT */
                              <div className="flex items-start gap-2">
                                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                  <div>
                                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">{t.content.classicInsight}</p>
                                      <p className="text-xs text-stone-600 leading-relaxed">{chart.classicInsight || "No specific features detected."}</p>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
    );
  };

  const renderInsightContent = () => (
    <div className="space-y-8 pb-10">
      {/* 0. Key Metrics / Highlights */}
      {!isSchemaOnly && (
          <div>
              <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">{t.content.highIntel}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">{t.content.perfAnomaly}</div>
                        <div className="text-2xl font-bold text-stone-800 mb-1">12% Variance</div>
                        <p className="text-stone-600 text-sm">{t.content.perfDesc}</p>
                      </div>
                      <Activity className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-amber-100 rotate-12" />
                  </div>
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">{t.content.topPerf}</div>
                        <div className="text-2xl font-bold text-stone-800 mb-1">VIP Segment</div>
                        <p className="text-stone-600 text-sm">{t.content.topDesc}</p>
                      </div>
                      <TrendingUp className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-indigo-100 rotate-12" />
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden">
                       <div className="relative z-10">
                        <div className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">{t.content.optimize}</div>
                        <div className="text-2xl font-bold text-stone-800 mb-1">Route Efficiency</div>
                        <p className="text-stone-600 text-sm">{t.content.optDesc}</p>
                      </div>
                      <MapPin className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-emerald-100 rotate-12" />
                  </div>
              </div>
          </div>
      )}

      {/* 1. AI Summary */}
      <div className="bg-[#F0F4F8] p-8 rounded-2xl border border-stone-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wand2 className="w-32 h-32 text-stone-900" />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <span className="bg-stone-900 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">{t.content.aiGenerated}</span>
                <h3 className="text-xl font-bold text-stone-800">{t.content.stratSum}</h3>
            </div>
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
                {analysis.finalConclusion ? (
                  <div dangerouslySetInnerHTML={{ __html: analysis.finalConclusion.replace(/\n/g, '<br/>').replace(/- /g, '• ') }} />
                ) : (
                  <div className="flex items-center space-x-2 text-stone-500">
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
                    <span>{t.content.wait}</span>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );

  // --- Header & Nav ---
  const getHeaderContent = () => {
    switch(activeStep) {
      case AppStep.UPLOAD: return { ...t.headers.upload, aiHint: t.headers.upload.hint };
      case AppStep.OVERVIEW: return { ...t.headers.overview, aiHint: analysis.summary ? t.headers.overview.complete : t.headers.overview.analyzing };
      case AppStep.EXPLORATION: return { ...t.headers.exploration, aiHint: t.headers.exploration.custom };
      case AppStep.INSIGHTS: return { ...t.headers.insights, aiHint: t.headers.insights.hint };
      default: return { title: "", subtitle: "", aiHint: "", hint: "" };
    }
  };
  const headerData = getHeaderContent();

  const navItems = [
    { id: AppStep.UPLOAD, title: t.steps.upload.title, desc: t.steps.upload.desc, icon: UploadCloud },
    { id: AppStep.OVERVIEW, title: t.steps.overview.title, desc: t.steps.overview.desc, icon: Activity },
    { id: AppStep.EXPLORATION, title: t.steps.exploration.title, desc: t.steps.exploration.desc, icon: PieIcon },
    { id: AppStep.INSIGHTS, title: t.steps.insights.title, desc: t.steps.insights.desc, icon: Lightbulb },
  ];

  return (
    <div className="flex h-screen bg-stone-100 text-stone-800 overflow-hidden font-sans selection:bg-stone-200">
      
      {/* 1. Left Sidebar */}
      <aside className="w-72 bg-stone-100 flex-shrink-0 flex flex-col py-8 pl-6 relative">
        {/* Top: User Profile */}
        <div className="mb-10 px-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center border-2 border-white shadow-sm text-stone-500">
                 <User className="w-5 h-5" />
             </div>
             <div>
                 <div className="text-sm font-bold text-stone-700">Guest User</div>
                 <div className="text-xs text-stone-400">Analyst</div>
             </div>
        </div>

        <nav className="flex-1 space-y-4 pr-0"> 
          {navItems.map((item) => {
            const isActive = activeStep === item.id;
            const isDisabled = activeStep !== AppStep.UPLOAD && data.length === 0 && !isSchemaOnly && item.id !== AppStep.UPLOAD;
            return (
                <button
                key={item.id}
                onClick={() => setActiveStep(item.id)}
                disabled={isDisabled}
                className={`w-full relative group text-left transition-all duration-300 ease-out outline-none ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                    <div className={`relative py-6 px-6 rounded-l-2xl border-y border-l ${isActive ? 'bg-white border-white shadow-[-8px_4px_20px_rgba(0,0,0,0.02)] z-20 translate-x-1' : 'bg-transparent border-transparent hover:bg-stone-200/50 translate-x-0'}`}>
                        {isActive && (
                            <>
                                <div className="absolute right-0 -top-5 w-5 h-5 bg-transparent rounded-br-2xl shadow-[4px_4px_0_0_white] pointer-events-none z-30"></div>
                                <div className="absolute right-0 -bottom-5 w-5 h-5 bg-transparent rounded-tr-2xl shadow-[4px_-4px_0_0_white] pointer-events-none z-30"></div>
                            </>
                        )}
                        <div>
                            <h3 className={`text-2xl font-bold tracking-tight mb-1 transition-colors ${isActive ? 'text-stone-800' : 'text-stone-400 group-hover:text-stone-600'}`}>{item.title}</h3>
                            <p className={`text-xs font-medium uppercase tracking-wider ${isActive ? 'text-stone-500' : 'text-stone-400'}`}>{item.desc}</p>
                        </div>
                    </div>
                </button>
            );
          })}
        </nav>
      </aside>

      {/* 2. Main Canvas */}
      <div className="flex-1 my-4 mr-4 bg-white rounded-3xl shadow-xl flex overflow-hidden relative z-10">
        <div className="flex-1 flex flex-col min-w-0 border-r border-stone-100">
            <header className="px-10 py-8 border-b border-stone-100">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 rounded-full bg-stone-300"></div>
                             <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{headerData.title}</p>
                             {datasetName && (
                                <span className="ml-2 px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] rounded-md border border-stone-200 font-mono">
                                    {datasetName}
                                </span>
                             )}
                        </div>
                        <h1 className="text-3xl font-bold text-stone-800">{headerData.subtitle}</h1>
                    </div>
                    {analysis.isAnalyzing ? (
                         <div className="flex items-center gap-2 text-stone-400 bg-stone-50 px-4 py-2 rounded-full border border-stone-100"><RefreshCw className="w-4 h-4 animate-spin" /><span className="text-sm font-medium">{t.headers.overview.processing}</span></div>
                    ) : (
                        <div className="flex items-center gap-3 bg-stone-50 pl-2 pr-4 py-2 rounded-full border border-stone-100 max-w-md"><Wand2 className="w-4 h-4 text-purple-400" /><span className="text-sm text-stone-600 truncate">{headerData.aiHint || t.headers.upload.hint}</span></div>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-10 custom-scrollbar">
                {activeStep === AppStep.UPLOAD && renderUploadContent()}
                {activeStep === AppStep.OVERVIEW && renderOverviewContent()}
                {activeStep === AppStep.EXPLORATION && renderExplorationContent()}
                {activeStep === AppStep.INSIGHTS && renderInsightContent()}
            </div>
        </div>

        {/* 3. Right Panel */}
        <aside className="w-80 bg-stone-50 flex-shrink-0 flex flex-col overflow-y-auto">
             <div className="p-8 sticky top-0 bg-stone-50 z-10">
                 <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">{t.controlDeck.title}</h2>
                 
                 {activeStep === AppStep.UPLOAD && (
                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 animate-fade-in">
                        {hoveredUploadItem === 'UPLOAD_FILE' ? (
                            <>
                                <h3 className="font-bold text-stone-700 mb-2">{t.controlDeck.req.title}</h3>
                                <ul className="text-sm text-stone-500 space-y-2 list-disc pl-4">
                                    <li>{t.controlDeck.req.item1}</li>
                                    <li>{t.controlDeck.req.item2}</li>
                                </ul>
                            </>
                        ) : hoveredUploadItem ? (
                             <>
                                <h3 className="font-bold text-stone-700 mb-2">{t.templates.title}</h3>
                                <p className="text-sm text-stone-500">{
                                    hoveredUploadItem === 'SMART_LOGISTICS' ? t.templates.logistics.desc :
                                    hoveredUploadItem === 'ORDERS' ? t.templates.ecommerce.desc :
                                    hoveredUploadItem === 'RIDERS' ? t.templates.riders.desc :
                                    t.templates.users.desc
                                }</p>
                             </>
                        ) : (
                            <>
                                <h3 className="font-bold text-stone-700 mb-2">{t.controlDeck.introTitle}</h3>
                                <p className="text-sm text-stone-500">{t.controlDeck.introDesc}</p>
                            </>
                        )}
                     </div>
                 )}
                 {activeStep === AppStep.OVERVIEW && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-stone-700">{t.controlDeck.health}</h3>
                                <div className={`w-2 h-2 rounded-full ${isSchemaOnly ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                            </div>
                            <div className="text-3xl font-bold text-stone-800">{analysis.healthScore}%</div>
                        </div>

                        {!isSchemaOnly && data.length > 0 && (
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                                <h3 className="font-bold text-stone-700 mb-4">{t.controlDeck.datasetMetrics}</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-stone-600">
                                        <span>{t.controlDeck.rows}</span>
                                        <span className="font-medium">{data.length}</span>
                                    </div>
                                    <div className="flex justify-between text-stone-600">
                                        <span>{t.controlDeck.cols}</span>
                                        <span className="font-medium">{columns.length}</span>
                                    </div>
                                    <div className="flex justify-between text-stone-600">
                                        <span>{t.controlDeck.memory}</span>
                                        <span className="font-medium">~{(JSON.stringify(data).length / 1024).toFixed(1)} KB</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                 )}
                 
                 {/* VISUALIZATION CONTROLS */}
                 {activeStep === AppStep.EXPLORATION && !isSchemaOnly && (
                     <div className="space-y-6">
                         {/* Analysis Engine Toggle */}
                         <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 animate-fade-in">
                             <label className="text-xs font-bold text-stone-400 uppercase mb-3 block">{t.controlDeck.analysisEngine}</label>
                             <div className="bg-stone-100 p-1 rounded-xl flex font-medium text-sm relative">
                                 <button 
                                    onClick={() => setIsAiAgentEnabled(false)}
                                    className={`flex-1 py-2 rounded-lg transition-all z-10 flex items-center justify-center gap-2 ${!isAiAgentEnabled ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
                                 >
                                    <Cpu className="w-4 h-4" />
                                    {t.controlDeck.standard}
                                 </button>
                                 <button 
                                    onClick={() => setIsAiAgentEnabled(true)}
                                    className={`flex-1 py-2 rounded-lg transition-all z-10 flex items-center justify-center gap-2 ${isAiAgentEnabled ? 'bg-white shadow-sm text-purple-600' : 'text-stone-500 hover:text-stone-700'}`}
                                 >
                                    <Bot className="w-4 h-4" />
                                    {t.controlDeck.aiAgent}
                                 </button>
                             </div>
                         </div>

                         <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 space-y-4 animate-fade-in">
                                 <div>
                                     <label className="text-xs font-bold text-stone-400 uppercase mb-2 block">{t.controlDeck.chartType}</label>
                                     <div className="grid grid-cols-4 gap-2">
                                         {['bar', 'line', 'pie', 'area', 'scatter'].map((type) => (
                                             <button 
                                                key={type}
                                                onClick={() => setBuilderConfig({...builderConfig, type: type as ChartType})}
                                                className={`p-2 rounded-lg border flex items-center justify-center transition-all ${builderConfig.type === type ? 'bg-stone-800 text-white border-stone-800' : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'}`}
                                             >
                                                {type === 'bar' && <BarChart2 className="w-4 h-4" />}
                                                {type === 'line' && <TrendingUp className="w-4 h-4" />}
                                                {type === 'pie' && <PieIcon className="w-4 h-4" />}
                                                {type === 'area' && <AreaIcon className="w-4 h-4" />}
                                                {type === 'scatter' && <ScatterIcon className="w-4 h-4" />}
                                             </button>
                                         ))}
                                     </div>
                                 </div>

                                 <div>
                                     <label className="text-xs font-bold text-stone-400 uppercase mb-2 block">{t.controlDeck.xAxis}</label>
                                     <select 
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl text-sm p-2 outline-none focus:ring-2 focus:ring-stone-200"
                                        value={builderConfig.x}
                                        onChange={(e) => setBuilderConfig({...builderConfig, x: e.target.value})}
                                     >
                                         <option value="" disabled>{t.controlDeck.selectCol}</option>
                                         {categoricalColumns.map(c => <option key={c} value={c}>{c}</option>)}
                                         {/* Allow numerics in X too if needed */}
                                         {numericColumns.map(c => <option key={c} value={c}>{c} (Num)</option>)}
                                     </select>
                                 </div>

                                 <div>
                                     <label className="text-xs font-bold text-stone-400 uppercase mb-2 block">{t.controlDeck.yAxis}</label>
                                     <select 
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl text-sm p-2 outline-none focus:ring-2 focus:ring-stone-200"
                                        value={builderConfig.y}
                                        onChange={(e) => setBuilderConfig({...builderConfig, y: e.target.value})}
                                     >
                                         <option value="" disabled>{t.controlDeck.selectCol}</option>
                                         {numericColumns.map(c => <option key={c} value={c}>{c}</option>)}
                                     </select>
                                 </div>

                                 <button 
                                    onClick={handleAddCustomChart}
                                    disabled={!builderConfig.x || !builderConfig.y}
                                    className="w-full py-2 bg-stone-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     <Plus className="w-4 h-4" />
                                     {t.controlDeck.addToBoard}
                                 </button>
                             </div>

                             {/* Active Charts Summary */}
                             <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                                 <h4 className="text-xs font-bold text-stone-400 uppercase mb-4">{t.controlDeck.activeCharts}</h4>
                                 {charts.length > 0 ? (
                                    <div className="space-y-2">
                                        {charts.map(c => (
                                            <div key={c.id} className="flex justify-between items-center p-2 bg-stone-50 rounded-lg border border-stone-100 text-sm">
                                                <div className="flex items-center gap-2 truncate">
                                                    <LayoutTemplate className="w-3 h-3 text-stone-400" />
                                                    <span className="truncate max-w-[140px] text-stone-600 font-medium">{c.title}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                 ) : (
                                     <p className="text-xs text-stone-400 italic">No active charts.</p>
                                 )}
                             </div>
                     </div>
                 )}

                 {/* INSIGHTS ACTIONS */}
                 {activeStep === AppStep.INSIGHTS && (
                     <div className="space-y-4">
                         <div className="bg-white p-2 rounded-2xl shadow-sm border border-stone-100">
                            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-stone-50 flex items-center gap-3 transition-colors text-stone-700 text-sm font-medium">
                                <Download className="w-4 h-4 text-stone-400" />
                                {t.controlDeck.downloadPdf}
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-stone-50 flex items-center gap-3 transition-colors text-stone-700 text-sm font-medium">
                                <Mail className="w-4 h-4 text-stone-400" />
                                {t.controlDeck.emailReport}
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-stone-50 flex items-center gap-3 transition-colors text-stone-700 text-sm font-medium">
                                <Share2 className="w-4 h-4 text-stone-400" />
                                {t.controlDeck.shareLink}
                            </button>
                         </div>
                         
                         <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                             <h4 className="text-xs font-bold text-stone-400 uppercase mb-3">{t.controlDeck.automation}</h4>
                             <div className="flex flex-col gap-2">
                                <label className="text-xs text-stone-500 font-medium">{t.controlDeck.scheduleRun}</label>
                                <input type="datetime-local" className="bg-stone-100 rounded-lg p-2 text-sm text-stone-700 outline-none focus:ring-2 focus:ring-stone-200 w-full" />
                             </div>
                         </div>
                     </div>
                 )}
             </div>
             
             <div className="mt-auto p-8 border-t border-stone-100">
                 <div className="flex flex-col gap-6">
                     {/* Branding */}
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-stone-800 text-white rounded-lg flex items-center justify-center font-bold text-lg">D</div>
                        <div>
                            <h2 className="font-bold text-lg text-stone-800 tracking-tight leading-none">{t.title}</h2>
                            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-medium mt-1">
                                 <Wand2 className="w-3 h-3" />
                                 <span>Powered by Gemini 3.0</span>
                            </div>
                        </div>
                     </div>

                     {/* Language Toggle */}
                     <div className="flex bg-stone-200/50 p-1 rounded-xl">
                        <button onClick={() => setLang('zh')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${lang === 'zh' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}>中文</button>
                        <button onClick={() => setLang('en')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}>English</button>
                     </div>
                 </div>
             </div>
        </aside>
      </div>

      {/* Modal Portal */}
      {renderImportModal()}
    </div>
  );
}