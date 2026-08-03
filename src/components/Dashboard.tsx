/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  MessageSquare, Users, Sparkles, Clock, Target, 
  TrendingUp, RefreshCw, Smartphone, Globe, AlertCircle, ShoppingBag 
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell 
} from "recharts";
import { DashboardMetrics, AnalyticsTrend } from "../types.js";

interface DashboardProps {
  metrics: DashboardMetrics | null;
  trends: AnalyticsTrend[];
  onRefresh: () => void;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ metrics, trends, onRefresh, onNavigate }: DashboardProps) {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await onRefresh();
    setTimeout(() => setLoading(false), 600);
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(val);
  };

  // Pie chart data for Channels
  const channelData = [
    { name: "WhatsApp", value: 45, color: "#22C55E" },
    { name: "Messenger", value: 30, color: "#2563EB" },
    { name: "Instagram", value: 15, color: "#E1306C" },
    { name: "Web Chat", value: 10, color: "#6B7280" }
  ];

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time insights and automated AI performance metrics.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-55"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Total Conversations */}
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Chats</span>
            <div className="p-1.5 bg-gray-50 text-gray-700 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-semibold tracking-tight text-gray-900">{metrics.totalConversations}</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4%</span>
              <span className="text-gray-400 font-normal">this week</span>
            </div>
          </div>
        </div>

        {/* Active Chats */}
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Active Now</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-semibold tracking-tight text-gray-900">{metrics.activeChats}</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              <span className="text-green-600 font-medium">Live sync</span>
              <span>across channels</span>
            </div>
          </div>
        </div>

        {/* AI Resolution Rate */}
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">AI Resolution</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-semibold tracking-tight text-gray-900">{metrics.aiResolutionRate}%</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-purple-600 font-medium">
              <span>Auto-Pilot resolution</span>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Avg Response</span>
            <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-semibold tracking-tight text-gray-900">{metrics.avgResponseTime}s</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
              <span>94% faster than humans</span>
            </div>
          </div>
        </div>

        {/* Lead Capture */}
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Lead Conv.</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-semibold tracking-tight text-gray-900">{metrics.leadConversionRate}%</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
              <span>+4.2% increased</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">AI Sales</span>
            <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl font-bold tracking-tight text-gray-900">{formatCurrency(metrics.revenueGenerated)}</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
              <span>Direct order generation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Daily Conversations Trend */}
        <div className="lg:col-span-2 p-5 bg-white border border-gray-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Conversations Volume</h2>
              <p className="text-xs text-gray-500">Daily breakdown of AI Auto-Pilot vs Human Takeovers.</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> AI Resolved</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Human Escalated</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="humanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111827", borderRadius: "12px", border: "none", color: "#FFF" }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="aiResolved" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#aiGrad)" name="AI Auto-Pilot" />
                <Area type="monotone" dataKey="humanHandled" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#humanGrad)" name="Human Agent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Share */}
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Traffic by Channels</h2>
            <p className="text-xs text-gray-500">Distribution of customer messages in the last 14 days.</p>
          </div>
          <div className="h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-2xl font-bold text-gray-800">4</p>
              <p className="text-[10px] uppercase font-semibold text-gray-400">Channels</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {channelData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 p-1.5 border border-gray-50 rounded-lg">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-600 truncate font-medium">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leads and Sales Trend */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Leads Collected & Sales Performance */}
        <div className="lg:col-span-2 p-5 bg-white border border-gray-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">AI Sales & Lead Generation</h2>
              <p className="text-xs text-gray-500">Daily total revenue generated and new business leads collected automatically.</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", borderRadius: "12px", border: "none", color: "#FFF" }} />
                <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Bar yAxisId="left" dataKey="revenue" fill="#22C55E" radius={[4, 4, 0, 0]} name="Sales Revenue (BDT)" />
                <Bar yAxisId="right" dataKey="leadsCollected" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Leads Captured" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Action & Onboarding Panel */}
        <div className="p-5 bg-gray-900 text-white rounded-2xl shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex p-2 bg-white/10 rounded-xl text-yellow-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-base font-semibold">AI Copilot Onboarding</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Your AI Customer Support Assistant is fully active. It has crawled your FAQ collection and is automatically answering queries in Bangla and English on active channels.
            </p>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors" onClick={() => onNavigate("inbox")}>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <div className="text-left">
                  <p className="text-xs font-semibold">Simulate Customer Chat</p>
                  <p className="text-[10px] text-gray-400">Test conversational auto-pilot replies</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-400">→</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors" onClick={() => onNavigate("knowledge")}>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <div className="text-left">
                  <p className="text-xs font-semibold">Fine-Tune Knowledge Base</p>
                  <p className="text-[10px] text-gray-400">Feed returns, pricing and locations</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-400">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
