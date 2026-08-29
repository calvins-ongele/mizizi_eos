export type DateFilterType = 'today' | '7days' | '30days' | '90days' | 'custom';

export interface SalesFilterParams {
  filter: DateFilterType;
  customFrom?: string; // ISO string e.g. "2026-07-01"
  customTo?: string;   // ISO string e.g. "2026-07-27"
}

export interface SalesChartData {
  date: string;       // Formatted date label for X-Axis (e.g. "Jul 27" or "14:00")
  totalSales: number; // Y-Axis value
  orderCount: number;
  avg?:number
}

export interface PaymentMethodDistribution {
  method: string; // e.g. "Cash", "Card", "Mobile Money"
  count: number;  // Number of transactions for this payment method
  totalAmount: number; // Total sales amount for this payment method
}