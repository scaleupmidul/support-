/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Settings as SettingsIcon, Sparkles, Languages, Check, 
  HelpCircle, RefreshCw, Eye, ShieldCheck, Mail, Key, KeyRound 
} from "lucide-react";
import { AISettings } from "../types.js";

interface SettingsProps {
  settings: AISettings;
  onUpdateSettings: (settings: Partial<AISettings>) => Promise<any>;
}

export default function SettingsView({ settings, onUpdateSettings }: SettingsProps) {
  const [businessName, setBusinessName] = useState(settings.businessName || settings.personaName || "");
  const [aiTone, setAiTone] = useState(settings.aiTone || settings.tone || "friendly");
  const [primaryLanguage, setPrimaryLanguage] = useState(settings.primaryLanguage || "both");
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcomeMessage || settings.greetingMessage || "");
  const [escalationRules, setEscalationRules] = useState(settings.escalationRules || settings.humanEscalationTrigger || "agent, human, call, speak to representative, boss, owner, মানুষ, কথা বলুন, কাস্টমার কেয়ার");
  const [geminiModel, setGeminiModel] = useState("gemini-2.5-flash");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const updated = await onUpdateSettings({
      personaName: businessName,
      tone: aiTone as any,
      primaryLanguage,
      greetingMessage: welcomeMessage,
      humanEscalationTrigger: escalationRules,
      businessName,
      aiTone,
      welcomeMessage,
      escalationRules
    });

    if (updated) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="pb-2 border-b border-gray-100 text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Platform Settings</h1>
        <p className="text-sm text-gray-500">Configure business info, select AI tone of voice, support languages, and specify human escalation guidelines.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Core fields Column */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <SettingsIcon className="w-4 h-4 text-gray-400" />
            General Support Configurations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Store / Business Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Preferred Language</label>
              <select
                value={primaryLanguage}
                onChange={(e) => setPrimaryLanguage(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none"
              >
                <option value="both">Mixed Bangla & English (Banglish / Multilingual)</option>
                <option value="en">English Only (Formal)</option>
                <option value="bn">Bangla Only (Bengali)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Google Gemini Assistant Tone</label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none"
              >
                <option value="helpful">Helpful & Polite (Default)</option>
                <option value="professional">Professional & Technical</option>
                <option value="friendly">Warm & Friendly (Boutique Style)</option>
                <option value="sassy">Humorous & Playful</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Active AI Model Version</label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-Fast Response)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Complex Reasoning)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Automated Welcome Message</label>
            <input
              type="text"
              required
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">System Handoff / Human Escalation Rules</label>
            <textarea
              value={escalationRules}
              onChange={(e) => setEscalationRules(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none resize-none leading-relaxed"
            />
            <p className="text-[10px] text-gray-400 mt-1 font-normal leading-normal">
              Specify clear trigger guidelines. The Gemini engine evaluates conversational customer intent in real-time, auto-escalating the queue if these patterns occur.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-xs hover:shadow-md text-xs font-semibold flex items-center gap-2 disabled:opacity-55"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save Settings"}
            </button>
            {saveSuccess && (
              <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Changes applied!
              </span>
            )}
          </div>
        </div>

        {/* AI Safeguards sidebar */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-5 h-fit">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            AI Guardrails & Safeguards
          </h3>

          <div className="space-y-3.5 text-xs text-gray-600">
            <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl space-y-1">
              <p className="font-bold text-purple-900">Hallucination Blockers</p>
              <p className="text-[10px] text-purple-700 leading-relaxed font-normal">
                Gemini is constrained using server-side system instructions to strictly answer from your Product Catalog and Knowledge Base. It is forbidden from inventing coupon codes or guessing dimensions.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl space-y-1">
              <p className="font-bold text-gray-800">Support Languages</p>
              <p className="text-[10px] text-gray-500 leading-relaxed font-normal">
                Detects Bengali queries instantly. Answers in correct local colloquial terms (e.g. "BDT", "কুৰ্তি") to increase client conversions.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2">
            <span className="block text-[10px] uppercase font-bold text-gray-400">Security Credentials</span>
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-gray-400" />
                <span>API Secret Key</span>
              </span>
              <span className="font-semibold text-emerald-600">Active (Injected)</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
