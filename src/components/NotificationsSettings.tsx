/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Bell, Mail, Smartphone, Slack, CheckCircle, 
  RefreshCw, ToggleLeft, ToggleRight, Settings
} from "lucide-react";

export default function NotificationsSettings() {
  const [browserEnabled, setBrowserEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [slackEnabled, setSlackEnabled] = useState(false);

  const [emailRecipients, setEmailRecipients] = useState("sabrina.yeasmin@gmail.com, support@aura.com.bd");
  const [slackWebhook, setSlackWebhook] = useState("https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="pb-2 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Notifications & Alert Webhooks</h1>
          <p className="text-sm text-gray-500">Configure administrative system browser push alerts, email summaries, WhatsApp order statuses, and Slack channels.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-55"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save Alert Settings"}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-bold flex items-center gap-1.5 text-left animate-fade-in">
          <CheckCircle className="w-4 h-4 text-green-600" /> Webhook trigger dispatch routes successfully updated!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Core Notifications Channels */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-5">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-indigo-600" />
              Live Workspace Alert Routes
            </h2>

            {/* Browser push notifications */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100/50">
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <Bell className="w-4 h-4 text-gray-400" />
                  Browser Desktop Notifications
                </p>
                <p className="text-[10px] text-gray-500 font-medium">Flash visual desktop push alerts when a hot customer requests live agent takeover.</p>
              </div>

              <button onClick={() => setBrowserEnabled(!browserEnabled)}>
                {browserEnabled ? <ToggleRight className="w-10 h-10 text-indigo-600" /> : <ToggleLeft className="w-10 h-10 text-gray-300" />}
              </button>
            </div>

            {/* Email reports notifications */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Administrative Email Summary Reports
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">Forward transactional summaries, invoice receipts, and lead digests directly to administrators.</p>
                </div>

                <button onClick={() => setEmailEnabled(!emailEnabled)}>
                  {emailEnabled ? <ToggleRight className="w-10 h-10 text-indigo-600" /> : <ToggleLeft className="w-10 h-10 text-gray-300" />}
                </button>
              </div>

              {emailEnabled && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recipient Emails (comma-separated)</label>
                  <input
                    type="text"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* WhatsApp notifications */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100/50">
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  WhatsApp Automated Alerts
                </p>
                <p className="text-[10px] text-gray-500 font-medium">Auto-dispatch transactional order updates and shipping slips to buyers.</p>
              </div>

              <button onClick={() => setWhatsappEnabled(!whatsappEnabled)}>
                {whatsappEnabled ? <ToggleRight className="w-10 h-10 text-indigo-600" /> : <ToggleLeft className="w-10 h-10 text-gray-300" />}
              </button>
            </div>

            {/* Slack webhook notifications */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <Slack className="w-4 h-4 text-gray-400" />
                    Slack Live Feed Integration
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">Broadcast hot lead details, incoming orders, and complaints into your shared Slack workspace.</p>
                </div>

                <button onClick={() => setSlackEnabled(!slackEnabled)}>
                  {slackEnabled ? <ToggleRight className="w-10 h-10 text-indigo-600" /> : <ToggleLeft className="w-10 h-10 text-gray-300" />}
                </button>
              </div>

              {slackEnabled && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Slack Webhook URL</label>
                  <input
                    type="text"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none font-mono text-[10px] text-gray-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: System info */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4 h-fit">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Settings className="w-4.5 h-4.5 text-gray-400" />
            Notification Metadata
          </h2>
          <p className="text-xs text-gray-500 leading-normal font-normal">
            Every workspace action creates instant local indicators. Real-time audio cues can also be checked during manual chat takeover.
          </p>

          <div className="pt-2 border-t border-gray-50 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-600">Daily Webhooks dispatched</span>
              <span className="font-mono text-indigo-600 font-bold">148 / Unlimited</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-600">Active Alert listeners</span>
              <span className="font-mono text-indigo-600 font-bold">3 channels live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
