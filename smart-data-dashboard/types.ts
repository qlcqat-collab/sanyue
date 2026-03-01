
export enum AppStep {
  UPLOAD = 'UPLOAD',
  OVERVIEW = 'OVERVIEW',
  EXPLORATION = 'EXPLORATION',
  INSIGHTS = 'INSIGHTS',
}

export interface DataRow {
  [key: string]: string | number;
}

export interface ColumnInfo {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  missingCount: number;
  uniqueCount: number;
}

export interface ColumnStats {
  name: string;
  type: string;
  count: number;
  mean?: number; // Only for numbers
  min?: number | string;
  max?: number | string;
  std?: number; // Standard Deviation
  topValue?: string; // Mode for strings
  topFreq?: number;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter';
export type AnalysisModel = 'comparison' | 'trend' | 'composition' | 'correlation' | 'funnel' | 'distribution';

export interface ChartConfig {
  id: string;
  type: ChartType;
  xKey: string;
  yKey: string;
  title: string;
  analysisModel: AnalysisModel; // The analytical approach
  classicInsight?: string; // Deterministic stat description
  aiInsight?: string; // AI generated deep analysis
}

export interface AnalysisState {
  summary: string; // AI Narrative
  healthScore: number;
  columnStats: ColumnStats[]; // The computed stats
  suggestedCharts: string[];
  finalConclusion: string;
  isAnalyzing: boolean;
}

export const DEMO_DATASETS: Record<string, DataRow[]> = {
  ORDERS: [
    { order_id: 'ORD-7712', date: '2023-11-01', category: 'Electronics', amount: 1299, status: 'Completed', payment: 'Credit Card' },
    { order_id: 'ORD-7713', date: '2023-11-01', category: 'Home', amount: 145, status: 'Processing', payment: 'PayPal' },
    { order_id: 'ORD-7714', date: '2023-11-02', category: 'Clothing', amount: 89, status: 'Returned', payment: 'Credit Card' },
    { order_id: 'ORD-7715', date: '2023-11-02', category: 'Electronics', amount: 250, status: 'Completed', payment: 'Credit Card' },
    { order_id: 'ORD-7716', date: '2023-11-03', category: 'Books', amount: 45, status: 'Completed', payment: 'Stripe' },
    { order_id: 'ORD-7717', date: '2023-11-03', category: 'Clothing', amount: 120, status: 'Completed', payment: 'PayPal' },
    { order_id: 'ORD-7718', date: '2023-11-04', category: 'Home', amount: 850, status: 'Processing', payment: 'Credit Card' },
    { order_id: 'ORD-7719', date: '2023-11-05', category: 'Electronics', amount: 2100, status: 'Completed', payment: 'Credit Card' },
    { order_id: 'ORD-7720', date: '2023-11-05', category: 'Books', amount: 25, status: 'Cancelled', payment: 'Stripe' },
    { order_id: 'ORD-7721', date: '2023-11-06', category: 'Clothing', amount: 210, status: 'Completed', payment: 'PayPal' },
    { order_id: 'ORD-7722', date: '2023-11-07', category: 'Home', amount: 320, status: 'Completed', payment: 'Credit Card' },
    { order_id: 'ORD-7723', date: '2023-11-08', category: 'Electronics', amount: 150, status: 'Returned', payment: 'PayPal' },
  ],
  RIDERS: [
    { rider_id: 'R-101', name: 'Alex M.', zone: 'Downtown', deliveries: 145, rating: 4.8, vehicle: 'Scooter', active_hours: 42 },
    { rider_id: 'R-102', name: 'Sarah K.', zone: 'Suburbs', deliveries: 98, rating: 4.9, vehicle: 'Car', active_hours: 35 },
    { rider_id: 'R-103', name: 'Mike J.', zone: 'Downtown', deliveries: 180, rating: 4.6, vehicle: 'Bike', active_hours: 48 },
    { rider_id: 'R-104', name: 'Emily R.', zone: 'North End', deliveries: 112, rating: 5.0, vehicle: 'Scooter', active_hours: 30 },
    { rider_id: 'R-105', name: 'David L.', zone: 'Suburbs', deliveries: 85, rating: 4.7, vehicle: 'Car', active_hours: 28 },
    { rider_id: 'R-106', name: 'Chris P.', zone: 'Downtown', deliveries: 165, rating: 4.5, vehicle: 'Bike', active_hours: 45 },
    { rider_id: 'R-107', name: 'Jessica T.', zone: 'North End', deliveries: 130, rating: 4.8, vehicle: 'Scooter', active_hours: 38 },
    { rider_id: 'R-108', name: 'Tom H.', zone: 'Suburbs', deliveries: 92, rating: 4.9, vehicle: 'Car', active_hours: 32 },
    { rider_id: 'R-109', name: 'Laura B.', zone: 'Downtown', deliveries: 155, rating: 4.7, vehicle: 'Bike', active_hours: 41 },
    { rider_id: 'R-110', name: 'Kevin W.', zone: 'North End', deliveries: 125, rating: 4.6, vehicle: 'Scooter', active_hours: 36 },
  ],
  USERS: [
    { user_id: 'U-501', join_date: '2023-01-15', segment: 'VIP', lifetime_value: 2400, last_active_days: 2, age: 34 },
    { user_id: 'U-502', join_date: '2023-02-20', segment: 'Regular', lifetime_value: 850, last_active_days: 15, age: 28 },
    { user_id: 'U-503', join_date: '2023-03-10', segment: 'New', lifetime_value: 120, last_active_days: 1, age: 22 },
    { user_id: 'U-504', join_date: '2023-01-05', segment: 'Churn Risk', lifetime_value: 600, last_active_days: 45, age: 45 },
    { user_id: 'U-505', join_date: '2023-04-12', segment: 'VIP', lifetime_value: 3100, last_active_days: 3, age: 39 },
    { user_id: 'U-506', join_date: '2023-05-30', segment: 'Regular', lifetime_value: 920, last_active_days: 8, age: 31 },
    { user_id: 'U-507', join_date: '2023-02-14', segment: 'New', lifetime_value: 80, last_active_days: 5, age: 24 },
    { user_id: 'U-508', join_date: '2023-03-22', segment: 'VIP', lifetime_value: 2800, last_active_days: 1, age: 36 },
    { user_id: 'U-509', join_date: '2023-06-01', segment: 'Regular', lifetime_value: 750, last_active_days: 12, age: 29 },
    { user_id: 'U-510', join_date: '2023-01-20', segment: 'Churn Risk', lifetime_value: 450, last_active_days: 60, age: 52 },
  ],
  SMART_LOGISTICS: [
    // Simulating Shanghai Area (approx Lat 31.2, Lng 121.4)
    { order_id: 'LOG-1001', time: '08:30', user_tier: 'VIP', rider_rating: 4.9, lat: 31.2304, lng: 121.4737, order_val: 120, duration: 25, status: 'On Time' },
    { order_id: 'LOG-1002', time: '08:45', user_tier: 'Regular', rider_rating: 4.5, lat: 31.2354, lng: 121.4787, order_val: 45, duration: 35, status: 'Delayed' },
    { order_id: 'LOG-1003', time: '09:00', user_tier: 'New', rider_rating: 4.8, lat: 31.2204, lng: 121.4637, order_val: 80, duration: 20, status: 'On Time' },
    { order_id: 'LOG-1004', time: '09:15', user_tier: 'VIP', rider_rating: 5.0, lat: 31.2404, lng: 121.4837, order_val: 250, duration: 15, status: 'On Time' },
    { order_id: 'LOG-1005', time: '09:30', user_tier: 'Regular', rider_rating: 4.2, lat: 31.2154, lng: 121.4587, order_val: 60, duration: 45, status: 'Delayed' },
    { order_id: 'LOG-1006', time: '09:45', user_tier: 'Regular', rider_rating: 4.7, lat: 31.2284, lng: 121.4707, order_val: 90, duration: 28, status: 'On Time' },
    { order_id: 'LOG-1007', time: '10:00', user_tier: 'VIP', rider_rating: 4.9, lat: 31.2324, lng: 121.4757, order_val: 180, duration: 22, status: 'On Time' },
    { order_id: 'LOG-1008', time: '10:15', user_tier: 'Churn Risk', rider_rating: 4.4, lat: 31.2104, lng: 121.4500, order_val: 35, duration: 40, status: 'Delayed' },
    { order_id: 'LOG-1009', time: '10:30', user_tier: 'New', rider_rating: 4.8, lat: 31.2384, lng: 121.4800, order_val: 75, duration: 30, status: 'On Time' },
    { order_id: 'LOG-1010', time: '10:45', user_tier: 'VIP', rider_rating: 5.0, lat: 31.2420, lng: 121.4850, order_val: 300, duration: 18, status: 'On Time' },
    { order_id: 'LOG-1011', time: '11:00', user_tier: 'Regular', rider_rating: 4.6, lat: 31.2250, lng: 121.4650, order_val: 55, duration: 32, status: 'On Time' },
    { order_id: 'LOG-1012', time: '11:15', user_tier: 'Regular', rider_rating: 4.3, lat: 31.2310, lng: 121.4740, order_val: 65, duration: 38, status: 'Delayed' },
    { order_id: 'LOG-1013', time: '11:30', user_tier: 'VIP', rider_rating: 4.9, lat: 31.2290, lng: 121.4720, order_val: 140, duration: 24, status: 'On Time' },
    { order_id: 'LOG-1014', time: '11:45', user_tier: 'Churn Risk', rider_rating: 4.5, lat: 31.2180, lng: 121.4610, order_val: 40, duration: 42, status: 'Delayed' },
    { order_id: 'LOG-1015', time: '12:00', user_tier: 'New', rider_rating: 4.8, lat: 31.2330, lng: 121.4760, order_val: 85, duration: 26, status: 'On Time' },
  ]
};

// Backwards compatibility for the mock data variable if needed elsewhere
export const MOCK_DATA = DEMO_DATASETS.ORDERS;
