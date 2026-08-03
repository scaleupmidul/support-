/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  FileText, Calendar, Download, RefreshCw, BarChart3, 
  TrendingUp, CheckCircle, Clock, ShoppingCart, DollarSign
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, AreaChart, Area, CartesianGrid 
} from "recharts";

export default function Reports() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const reportData = {
    daily: [
      { label: "09:00", conversations: 12, resolved: 10, revenue: 1400 },
      { label: "12:00", conversations: 28, resolved: 24, revenue: 3800 },
      { label: "15:00", conversations: 35, resolved: 31, revenue: 4200 },
      { label: "18:00", conversations: 22, resolved: 20, revenue: 2600 },
      { label: "21:00", conversations: 15, resolved: 12, revenue: 1900 }
    ],
    weekly: [
      { label: "Mon", conversations: 110, resolved: 98, revenue: 14200 },
      { label: "Tue", conversations: 125, resolved: 112, revenue: 16800 },
      { label: "Wed", conversations: 140, resolved: 130, revenue: 18900 },
      { label: "Thu", conversations: 135, resolved: 121, revenue: 17500 },
      { label: "Fri", conversations: 160, resolved: 145, revenue: 21000 },
      { label: "Sat", conversations: 180, resolved: 162, revenue: 24500 },
      { label: "Sun", conversations: 155, resolved: 139, revenue: 19800 }
    ],
    monthly: [
      { label: "Week 1", conversations: 580, resolved: 520, revenue: 78000 },
      { label: "Week 2", conversations: 640, resolved: 585, revenue: 86500 },
      { label: "Week 3", conversations: 710, resolved: 650, revenue: 94000 },
      { label: "Week 4", conversations: 690, resolved: 630, revenue: 91500 }
    ],
    yearly: [
      { label: "Jan-Mar", conversations: 1850, resolved: 1680, revenue: 245000 },
      { label: "Apr-Jun", conversations: 2200, resolved: 1990, revenue: 295000 },
      { label: "Jul-Sep", conversations: 2620, resolved: 2385, revenue: 350000 },
      { label: "Oct-Dec", conversations: 3100, resolved: 2850, revenue: 412000 }
    ]
  };

  const handleExportCSV = () => {
    setIsExportingExcel(true);
    setExportNotice(null);
    setTimeout(() => {
      setIsExportingExcel(false);
      setExportNotice("Excel report CSV sheet compiled and downloaded successfully!");
      
      const headers = "Period Label,Conversations,Resolved,Estimated Revenue (BDT)\n";
      const rows = reportData[period].map(r => `${r.label},${r.conversations},${r.resolved},${r.revenue}`).join("\n");
      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `smartsupport_${period}_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => setExportNotice(null), 3000);
    }, 1200);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setExportNotice(null);
    setTimeout(() => {
      setIsExportingPDF(false);
      setExportNotice("Print-ready PDF summary generated!");
      setTimeout(() => setExportNotice(null), 3000);
      window.print();
    }, 1500);
  };

  const activeData = reportData[period];
  const totalConversations = activeData.reduce((acc, curr) => acc + curr.conversations, 0);
  const totalResolved = activeData.reduce((acc, curr) => acc + curr.resolved, 0);
  const totalRevenue = activeData.reduce((acc, curr) => acc + curr.revenue, 0);
  const resolutionRate = totalConversations > 0 ? ((totalResolved / totalConversations) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="pb-2 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">SaaS Analytical Reports</h1>
          <p className="text-sm text-gray-500">Compile sales reports, trace automated resolution rate performance, and download business audits.</p>
        </div>

        {/* Period selection */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
          {(["daily", "weekly", "monthly", "yearly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                period === p ? "bg-white text-gray-900 shadow-3xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-bold flex items-center gap-1.5 text-left">
          <CheckCircle className="w-4 h-4 text-green-600 animate-pulse" /> {exportNotice}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Conversations</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 className="w-4 h-4" /></div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-gray-900">{totalConversations.toLocaleString()}</h3>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" /> +15.2% over past cycle
            </p>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Resolution Rate</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="w-4 h-4" /></div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-gray-900">{resolutionRate}%</h3>
            <p className="text-[10px] text-emerald-600 mt-1 font-semibold">91% Handled autonomously by AI</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Avg Time-to-Reply</span>
            <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg"><Clock className="w-4 h-4" /></div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-gray-900">4.1 seconds</h3>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">98.5% instant auto-acknowledgements</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">E-Commerce Revenue</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} BDT</h3>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">Attributed directly to chatbot conversions</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Main conversation chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Inbounds vs Auto-Resolution</h2>
              <p className="text-[11px] text-gray-400">Detailed metric mapping chatbot resolved threads versus gross customer sessions.</p>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span> Total</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span> Resolved</span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="resolvedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="label" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #F3F4F6" }} />
                <Area type="monotone" dataKey="conversations" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#totalColor)" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#resolvedColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue distribution bar */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">E-Commerce Revenue (BDT)</h2>
            <p className="text-[11px] text-gray-400">Financial conversion logs generated via automated shop orders.</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="label" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #F3F4F6" }} />
                <Bar dataKey="revenue" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Manual Actions/Export panel */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-gray-400" />
            Audit Compilation Center
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">Generate formal Excel worksheets of conversational metrics or trigger the print-friendly PDF catalog.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            disabled={isExportingExcel}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-all disabled:opacity-55"
          >
            {isExportingExcel ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Export Excel (CSV)
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-55"
          >
            {isExportingPDF ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            Export PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}
