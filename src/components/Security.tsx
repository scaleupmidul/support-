/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  ShieldCheck, ShieldAlert, Key, Globe, Eye, EyeOff, 
  Trash2, RefreshCw, Smartphone, Clipboard, Check
} from "lucide-react";

export default function Security() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [apiKeys, setApiKeys] = useState([
    { id: "key-01", name: "Production Meta Ingress Key", token: "gai_live_8f3c7e9a2b1d6f4c80309", createdAt: "2026-04-12", lastUsed: "2026-07-13 12:44:11" },
    { id: "key-02", name: "CRM webhook dispatch endpoint", token: "gai_live_9a0b1c2d3e4f5a6b7c8d9", createdAt: "2026-06-18", lastUsed: "2026-07-13 13:02:18" }
  ]);
  const [showKeyTokenId, setShowKeyTokenId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [auditLogs] = useState([
    { id: "log-1", timestamp: "2026-07-13 13:02:11", user: "Sabrina Yeasmin", action: "Settings update", details: "Modified AI Response Tone to Warm Friendly", ip: "103.114.172.5", device: "Chrome 124 / macOS" },
    { id: "log-2", timestamp: "2026-07-13 12:44:02", user: "Hasan Bin Osman", action: "Customer update", details: "Added custom notes for customer Ayesha Siddiqua", ip: "180.234.39.112", device: "Safari / iOS" },
    { id: "log-3", timestamp: "2026-07-13 10:15:33", user: "Afrin Sultana", action: "FAQ deletion", details: "Removed duplicate Kurti delivery FAQ", ip: "103.220.211.89", device: "Edge / Windows" },
    { id: "log-4", timestamp: "2026-07-12 18:33:12", user: "Sabrina Yeasmin", action: "Channel verification", details: "Verified virtual WhatsApp Phone Line (+8801912345678)", ip: "103.114.172.5", device: "Chrome 124 / macOS" }
  ]);

  const activeSessions = [
    { id: "sess-1", location: "Dhaka, Bangladesh", device: "Chrome / macOS", ip: "103.114.172.5", status: "current" },
    { id: "sess-2", location: "Chittagong, Bangladesh", device: "Safari / iPhone", ip: "180.234.39.112", status: "active" }
  ];

  const handleGenerateKey = () => {
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const newKey = {
      id: `key-${Date.now()}`,
      name: `Custom Applet Key - ${new Date().toLocaleDateString()}`,
      token: `gai_live_${randomHex}`,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Never"
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="pb-2 border-b border-gray-100 text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Security & Key Access Control</h1>
        <p className="text-sm text-gray-500">Enable Two-Factor verification, monitor active sessions, manage developer API keys, and review audit history logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Core Settings (2FA & Active Sessions) */}
        <div className="space-y-6">
          
          {/* Two-Factor verification */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Smartphone className="w-4.5 h-4.5 text-gray-400" />
              Two-Factor Authentication (2FA)
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Secure administrative operations. Each portal log-in requires entering a custom verification passcode dispatched to your verified mobile line.
            </p>

            <div className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">SMS Verification Status</p>
                <p className="text-[10px] text-gray-500 font-medium">OTP enabled for active admins</p>
              </div>

              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  twoFactorEnabled 
                    ? "bg-green-100 text-green-800 border border-green-200" 
                    : "bg-gray-100 text-gray-500 hover:text-gray-900"
                }`}
              >
                {twoFactorEnabled ? "Activated (Secure)" : "Turn On"}
              </button>
            </div>
          </div>

          {/* Active Sessions list */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Globe className="w-4.5 h-4.5 text-gray-400" />
              Active Admin Sessions
            </h2>
            <p className="text-xs text-gray-500 font-normal">Locations currently authenticated to edit AI settings and support records.</p>
            
            <div className="space-y-3">
              {activeSessions.map((sess) => (
                <div key={sess.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{sess.device}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      sess.status === "current" ? "bg-indigo-50 text-indigo-700" : "bg-gray-200 text-gray-500"
                    }`}>
                      {sess.status === "current" ? "THIS DEVICE" : "ACTIVE SESSION"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 text-[10px] text-gray-500 font-normal pt-1 border-t border-gray-100/50">
                    <div>IP: {sess.ip}</div>
                    <div className="text-right">{sess.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Key Management */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Key className="w-4.5 h-4.5 text-gray-400" />
                Webhook Access Keys
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Dispatched endpoints require these credentials to push external lead captures back to this workspace.</p>
            </div>

            <button
              onClick={handleGenerateKey}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Generate New API Key
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((key) => {
              const isShown = showKeyTokenId === key.id;
              const isCopied = copiedKey === key.id;
              const maskedToken = isShown ? key.token : key.token.replace(/(.{10}).*/, "$1•••••••••••••••••");
              
              return (
                <div key={key.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-gray-100/50">
                  <div className="space-y-1.5 flex-1 text-xs">
                    <p className="font-bold text-gray-900">{key.name}</p>
                    
                    <div className="flex items-center gap-2">
                      <code className="bg-white border border-gray-200 px-2 py-1 rounded font-mono text-[10px] text-gray-600 font-semibold truncate max-w-[280px]">
                        {maskedToken}
                      </code>

                      <button
                        onClick={() => setShowKeyTokenId(isShown ? null : key.id)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-500"
                        title={isShown ? "Hide Key" : "Reveal Key"}
                      >
                        {isShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopy(key.token, key.id)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-500 flex items-center gap-1 text-[9px] font-bold"
                        title="Copy to Clipboard"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Clipboard className="w-3.5 h-3.5" />}
                        {isCopied && "Copied"}
                      </button>
                    </div>

                    <div className="flex gap-4 text-[10px] text-gray-400 font-medium">
                      <span>Created: {key.createdAt}</span>
                      <span>Last Used: {key.lastUsed}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteKey(key.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all self-start sm:self-auto"
                    title="Delete Key Token"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audit Logs / Activity logs */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4 text-left">
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" />
            Workspace Audit History Log
          </h2>
          <p className="text-xs text-gray-500 mt-1">Immutable trace history of every setup update, FAQ deletion, or database synchronization triggered by managers.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-500">
            <thead className="bg-gray-50/75 text-gray-700 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Admin User</th>
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Device / User-Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3.5 font-semibold text-gray-900 font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3.5 font-medium text-gray-800">{log.user}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 font-medium">{log.details}</td>
                  <td className="px-4 py-3.5 font-mono text-gray-400">{log.ip}</td>
                  <td className="px-4 py-3.5 text-gray-400 font-medium truncate max-w-[140px]">{log.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
