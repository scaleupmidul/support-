/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Shield, Lock, FileText, Trash2, Mail, ExternalLink, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
  const [activeSubTab, setActiveSubTab] = useState<"privacy" | "deletion" | "terms">("privacy");

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 backdrop-blur-md rounded-2xl border border-indigo-400/30">
            <Shield className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Privacy Policy & Meta Compliance</h1>
            <p className="text-xs text-indigo-200 mt-0.5">Official Privacy Statement, Data Deletion Directives, and Terms of Service</p>
          </div>
        </div>
        
        <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium text-indigo-200/80">
          <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">Last Updated: August 2026</span>
          <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">Meta Graph API Compliant</span>
          <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">GDPR & CCPA Aligned</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-6">
        <button
          onClick={() => setActiveSubTab("privacy")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === "privacy"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          <Lock className="w-4 h-4" /> Privacy Policy
        </button>
        <button
          onClick={() => setActiveSubTab("deletion")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === "deletion"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          <Trash2 className="w-4 h-4" /> User Data Deletion Callback
        </button>
        <button
          onClick={() => setActiveSubTab("terms")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === "terms"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          <FileText className="w-4 h-4" /> Terms of Service
        </button>
      </div>

      {/* SUB-TAB 1: PRIVACY POLICY */}
      {activeSubTab === "privacy" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-8 text-gray-700 dark:text-gray-300">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              1. Overview & Scope
            </h2>
            <p className="text-xs leading-relaxed">
              SmartSupport AI ("Application", "Service", "We") operates an omnichannel automated customer service platform integrated with Meta Platform APIs (including Facebook Messenger, WhatsApp Business API, and Instagram Messaging API). We respect your privacy and are committed to protecting personal data collected during messaging exchanges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              2. Information We Collect
            </h2>
            <p className="text-xs leading-relaxed">
              When a user contacts a Facebook Page, Instagram Account, or WhatsApp Business account integrated with SmartSupport AI, we collect the following limited information required for automated customer response and CRM record keeping:
            </p>
            <ul className="list-disc pl-5 text-xs space-y-1.5 marker:text-indigo-500">
              <li><strong>User Identity Data:</strong> Facebook/Instagram User ID (PSID/IGSID), display name, and public profile details provided via Meta Webhooks.</li>
              <li><strong>Messaging Data:</strong> Message body text, timestamps, attachment URLs (images/audio), and user interaction events.</li>
              <li><strong>Contact & Order Information:</strong> Customer phone number, email address, delivery address, and product order history explicitly shared during automated chat interactions.</li>
              <li><strong>Technical Metadata:</strong> Webhook request headers, IP address log traces, and session timestamps for security auditing.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              3. How We Use Collected Information
            </h2>
            <p className="text-xs leading-relaxed">
              We process data exclusively for the following operational purposes:
            </p>
            <ul className="list-disc pl-5 text-xs space-y-1.5 marker:text-indigo-500">
              <li>Processing incoming customer inquiries and generating automated AI responses using Google Gemini API.</li>
              <li>Escalating complex requests to human support agents when requested by the user.</li>
              <li>Managing customer orders, tracking shipment statuses, and providing FAQs.</li>
              <li>Maintaining secure logs to protect against fraudulent or malicious automated activities.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              4. Data Sharing & Third-Party Processors
            </h2>
            <p className="text-xs leading-relaxed">
              We <strong>never sell, rent, or monetize</strong> your personal data. Data is shared strictly with the following subprocessors necessary to operate the platform:
            </p>
            <ul className="list-disc pl-5 text-xs space-y-1.5 marker:text-indigo-500">
              <li><strong>Meta Platforms, Inc.:</strong> Data received via Meta Graph API and Webhook webhooks.</li>
              <li><strong>Google Cloud / Gemini AI:</strong> Server-side API processing for natural language interpretation (API keys stored securely on server-side only).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              5. Data Security & Storage
            </h2>
            <p className="text-xs leading-relaxed">
              All communications are transmitted over HTTPS with TLS 1.3 encryption. Data stored in our database is restricted via strict server-side access control, authenticated sessions, and audit logging.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              6. Contact Information
            </h2>
            <p className="text-xs leading-relaxed">
              If you have any questions regarding this Privacy Policy or your data, please contact our Data Protection Officer:
            </p>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/60 text-xs space-y-1">
              <p className="font-bold text-gray-900 dark:text-white">SmartSupport AI Compliance Team</p>
              <p className="text-gray-500 dark:text-gray-400">Email: midulhasan664@gmail.com</p>
              <p className="text-gray-500 dark:text-gray-400">Website: https://sazo.app</p>
            </div>
          </section>
        </div>
      )}

      {/* SUB-TAB 2: USER DATA DELETION */}
      {activeSubTab === "deletion" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6 text-gray-700 dark:text-gray-300">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Meta Data Deletion Callback & Instructions
            </h2>
            <p className="text-xs leading-relaxed">
              In compliance with Meta Platform Terms, users who wish to remove their data or revoke Meta App permissions can initiate a deletion request at any time.
            </p>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl space-y-2">
            <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Data Deletion Callback URL (for Meta App Settings)</h3>
            <code className="block p-3 bg-white dark:bg-gray-950 border border-indigo-200 dark:border-indigo-800 rounded-xl font-mono text-xs text-indigo-700 dark:text-indigo-300 select-all">
              https://ais-dev-6ira576x26ubpwhg7mut6o-33158705026.asia-southeast1.run.app/api/meta/data-deletion
            </code>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">How to Request Manual Data Deletion</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-2">
                <div className="w-7 h-7 bg-indigo-600 text-white font-bold rounded-lg flex items-center justify-center text-xs">1</div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">Via Facebook Settings</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Go to Facebook &gt; Settings &amp; Privacy &gt; Apps and Websites &gt; Select SmartSupport AI &gt; Click Remove.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-2">
                <div className="w-7 h-7 bg-indigo-600 text-white font-bold rounded-lg flex items-center justify-center text-xs">2</div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">Via Direct Support Email</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Send an email with subject "DATA DELETION REQUEST" to midulhasan664@gmail.com with your Page/PSID details.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-2">
                <div className="w-7 h-7 bg-indigo-600 text-white font-bold rounded-lg flex items-center justify-center text-xs">3</div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">Confirmation Code</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Our system processes request immediately and returns a unique deletion confirmation code and tracking URL.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TERMS OF SERVICE */}
      {activeSubTab === "terms" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6 text-gray-700 dark:text-gray-300">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Terms of Service</h2>
            <p className="text-xs leading-relaxed">
              By accessing or using SmartSupport AI, you agree to be bound by these Terms of Service. If you are registering an automated chatbot for a Facebook Page or Instagram Business account, you represent that you have legal authority to bind that business.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Acceptable Use Policy</h2>
            <p className="text-xs leading-relaxed">
              You agree not to use the automated messaging tools to dispatch unsolicited spam, deceptive marketing, fraudulent schemes, or messages violating Meta Community Standards or WhatsApp Business Messaging Policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Limitation of Liability</h2>
            <p className="text-xs leading-relaxed">
              SmartSupport AI provides AI-assisted responses based on Gemini AI model outputs. While we strive for 100% accuracy, automated responses should be monitored by human support agents via our Omnichannel Inbox.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
