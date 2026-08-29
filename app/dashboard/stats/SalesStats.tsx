'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { DateFilterType, PaymentMethodDistribution, SalesChartData } from '@/engine/types/sales'; 

const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function SalesChart() {
  const [filter, setFilter] = useState<DateFilterType>('7days');
  const [customFrom, setCustomFrom] = useState<string>('');
  const [customTo, setCustomTo] = useState<string>('');
  const [chartData, setChartData] = useState<SalesChartData[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodDistribution[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      try { 
        const response = await fetch(`/api/pos/sales-data?filter=${filter}&customFrom=${customFrom}&customTo=${customTo}`, { method: "GET" });
        const data = await response.json();
        const salesData: SalesChartData[] = data.data.salesTrends; 
        setChartData(salesData);
        setPaymentMethodData(data.data.paymentMethodData);
      } catch (err) {
        console.error('Failed to load sales data:', err);
      }
    });
  };

  useEffect(() => {
    if (filter !== 'custom' || (customFrom && customTo)) {
      loadData();
    }
  }, [filter, customFrom, customTo]);

  // Custom Tooltip component to display all three metrics nicely
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as SalesChartData;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-xs space-y-1">
          <p className="font-semibold text-gray-700 mb-1">{label}</p>
          <p className="text-blue-600 font-medium">
            Total Sales: KES {data.totalSales.toLocaleString()}
          </p>
          <p className="text-emerald-600 font-medium">
            Average Order: KES {data?.avg?.toFixed(2)}
          </p>
          <p className="text-amber-600 font-medium">
            Orders: {data.orderCount}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="">
      <div className="p-6 rounded-xl shadow-sm alert">
        {/* Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
            <p className="text-sm text-gray-500">Revenue performance over time</p>
          </div>

          <div className="d-flex align-items-center gap-2 btn-group mb-3" role="group">
            {(['today', '7days', '30days', '90days', 'custom'] as DateFilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`btn px-3 py-1.5 text-xs fs-8 rounded-lg capitalize transition-colors ${
                  filter === type
                    ? 'btn-primary text-black'
                    : 'btn-secondary text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === '7days' ? '7 Days' : type === '30days' ? '30 Days' : type === '90days' ? '90 Days' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Pickers */}
        {filter === 'custom' && (
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-5 mb-5 p-3 bg-grey rounded-lg">
            <label className="text-xs text-gray-600 d-flex items-center gap-2">
              <span>From:</span>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="px-2 py-1 text-xs border border-gray-300 rounded bg-white"
              />
            </label>
            <label className="text-xs text-gray-600 d-flex items-center gap-2">
              <span>To:</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="px-2 py-1 text-xs border border-gray-300 rounded bg-white"
              />
            </label>
          </div>
        )}

        <hr />

        {/* Pie Chart Section */}
        <div className="w-full relative">
          {isPending && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center text-sm text-gray-500">
              Loading sales data...
            </div>
          )}

          {chartData && chartData.length > 0 && (
            <>
              <h1>Payment Methods</h1>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="totalAmount"
                      nameKey="method"
                      label 
                    >
                      {paymentMethodData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        <hr />

        {/* Sales Trends Chart (Includes totalSales, orderCount, and avg) */}
        <div className="w-full relative">
          {isPending && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center text-sm text-gray-500">
              Loading sales data...
            </div>
          )}

          {chartData && chartData.length > 0 && (
            <h1 className="mb-4">Sales & Order Performance</h1>
          )}

          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient> 
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              
              {/* Primary Y-Axis (Left) for Monetary Values: Sales & Average */}
              <YAxis
                yAxisId="currency"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `KES ${val}`}
              />
              
              {/* Secondary Y-Axis (Right) for Volume: Order Count */}
              <YAxis
                yAxisId="count"
                orientation="right"
                stroke="#f59e0b"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `${val} orders`}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />

              {/* 1. Total Sales (Area) */}
              <Area
                yAxisId="currency"
                type="monotone"
                dataKey="totalSales"
                name="Total Sales (KES)"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#salesGradient)"
              />

              {/* 2. Average Order Value (Line - Currency Axis) */}
              <Line
                yAxisId="currency"
                type="monotone"
                dataKey="avg"
                name="Avg Order Value (KES)"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />

              {/* 3. Order Count (Line - Count Axis) */}
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="orderCount"
                name="Order Count"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}