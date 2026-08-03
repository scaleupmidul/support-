/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  CreditCard, ShieldCheck, CheckCircle2, RefreshCw, 
  Download, ArrowUpRight, HelpCircle, AlertCircle, Sparkles
} from "lucide-react";

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | "enterprise">("pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [upgradingTo, setUpgradingTo] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Starter Lite",
      priceMonthly: 0,
      priceYearly: 0,
      desc: "For small local boutiques starting automation.",
      features: [
        "1 Active AI Assistant",
        "Up to 100 auto-replies/month",
        "Basic Inbox (Web Chat)",
        "Single business workspace",
        "7 days data retention"
      ]
    },
    {
      id: "pro",
      name: "SaaS Premium Pro",
      priceMonthly: 49,
      priceYearly: 39,
      desc: "Perfect for multi-channel scaling commerce shops.",
      features: [
        "Everything in Lite",
        "Unlimited Auto-Replies via Gemini",
        "Messenger, Instagram & WhatsApp API",
        "Up to 5 Business profiles",
        "Support Team (Up to 5 members)",
        "Detailed Performance Analytics",
        "Custom knowledge base files"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise Custom",
      priceMonthly: 199,
      priceYearly: 159,
      desc: "For large retail chains needing SLA and dedicated models.",
      features: [
        "Everything in Pro",
        "Dedicated Custom-Tuned Gemini API Node",
        "Multi-agent workflow routing",
        "Unlimited Team Members & Roles",
        "Advanced custom integrations",
        "Enterprise-grade Security (Audit/IP logs)",
        "24/7 Priority Manager SLA Support"
      ]
    }
  ];

  const transactions = [
    { id: "INV-2026-004", date: "2026-07-01", amount: 49.00, status: "paid", method: "Mastercard •••• 4242" },
    { id: "INV-2026-003", date: "2026-06-01", amount: 49.00, status: "paid", method: "Mastercard •••• 4242" },
    { id: "INV-2026-002", date: "2026-05-01", amount: 49.00, status: "paid", method: "Mastercard •••• 4242" },
    { id: "INV-2026-001", date: "2026-04-01", amount: 29.00, status: "paid", method: "Mastercard •••• 4242" }
  ];

  const handleUpgrade = (planId: string) => {
    setUpgradingTo(planId);
    setTimeout(() => {
      setCurrentPlan(planId as any);
      setUpgradingTo(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="pb-3 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">SaaS Subscription & Billing</h1>
          <p className="text-sm text-gray-500">Manage your active subscription plan, billing cycles, quotas, and historical receipt invoices.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === "monthly" ? "bg-white text-gray-900 shadow-3xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === "yearly" ? "bg-white text-gray-900 shadow-3xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Yearly
            <span className="bg-indigo-100 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Quotas / Usage summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-3">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="font-semibold text-gray-700">AI Tokens / API Usage</span>
            <span className="font-mono text-indigo-600 font-bold">428,510 / Unlimited</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: "45%" }}></div>
          </div>
          <p className="text-[10px] text-gray-400">Gemini model requests utilize direct integration. No secret tokens or local caps imposed on Pro.</p>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-3">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Active Workspaces</span>
            <span className="font-mono text-emerald-600 font-bold">2 / 5 Businesses</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "40%" }}></div>
          </div>
          <p className="text-[10px] text-gray-400">Switch workspaces seamlessly from the top global bar to automate multiple brands.</p>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs space-y-3">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Support Team Members</span>
            <span className="font-mono text-purple-600 font-bold">4 / 5 Seats</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: "80%" }}></div>
          </div>
          <p className="text-[10px] text-gray-400">Invite agents and managers to manually take over high-intent hot lead threads.</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
          const priceLabel = plan.id === "free" ? "Free" : `$${price}`;
          
          return (
            <div 
              key={plan.id}
              className={`p-6 rounded-3xl border relative transition-all ${
                isCurrent 
                  ? "bg-white border-indigo-600 shadow-md ring-1 ring-indigo-600" 
                  : "bg-white border-gray-100 hover:border-gray-200 shadow-2xs"
              }`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  Your Active Plan
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-base text-gray-900">{plan.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 min-h-[32px]">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900">{priceLabel}</span>
                  {plan.id !== "free" && (
                    <span className="text-xs text-gray-400 font-medium">/{billingCycle === "monthly" ? "mo" : "mo (billed yearly)"}</span>
                  )}
                </div>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || upgradingTo !== null}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent 
                      ? "bg-indigo-50 text-indigo-700 cursor-default" 
                      : upgradingTo === plan.id 
                        ? "bg-indigo-600 text-white opacity-70"
                        : "bg-gray-900 hover:bg-gray-800 text-white shadow-xs"
                  }`}
                >
                  {upgradingTo === plan.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : isCurrent ? (
                    "Active Subscription"
                  ) : (
                    <>
                      Upgrade Plan
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="border-t border-gray-100 pt-4 space-y-2.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Features Included</p>
                  <ul className="space-y-2">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-2 font-normal leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Payments / Invoices */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4 text-left">
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-gray-400" />
            Billing History & Invoices
          </h2>
          <p className="text-xs text-gray-500 mt-1">Review your recent transaction log and download PDF receipts for tax auditing.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-500">
            <thead className="bg-gray-50/75 text-gray-700 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Billing Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3.5 font-semibold text-gray-900 font-mono">{t.id}</td>
                  <td className="px-4 py-3.5">{t.date}</td>
                  <td className="px-4 py-3.5 font-semibold text-gray-900">${t.amount.toFixed(2)}</td>
                  <td className="px-4 py-3.5">{t.method}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-700 border border-green-100">
                      {(t.status || '').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 ml-auto">
                      <Download className="w-3.5 h-3.5" />
                      PDF Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
