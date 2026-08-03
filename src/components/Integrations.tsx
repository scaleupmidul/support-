/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Facebook, Instagram, Smartphone, Shield, Radio, Key, Globe,
  Settings, CheckCircle, RefreshCw, AlertTriangle, Play, 
  Trash2, Send, Clock, User, Check, AlertCircle, Copy, 
  FileText, Image as ImageIcon, Film, Music, ShieldAlert,
  ArrowRight, ToggleLeft, ToggleRight, Loader2, Sparkles, HelpCircle, Plus
} from "lucide-react";
import { Channel } from "../types.js";

interface WebhookLog {
  id: string;
  timestamp: string;
  platform: "facebook" | "instagram" | "whatsapp";
  eventType: "message" | "delivery" | "read" | "reaction" | "postback" | "referral" | "message_echo";
  status: "received" | "queued" | "processing" | "completed" | "failed" | "duplicate_ignored";
  payload: any;
  steps: { name: string; timestamp: string; status: "success" | "pending" | "fail" }[];
}

interface MetaState {
  facebookPages: {
    pageId: string;
    name: string;
    category: string;
    likes: number;
    status: "connected" | "disconnected";
    lastSynced: string;
    tokenStatus: "valid" | "expired";
    accessToken?: string;
    webhookVerifyToken?: string;
  }[];
  instagramAccount: {
    username: string;
    status: "connected" | "disconnected";
    lastSynced: string;
    businessId: string;
    accessToken?: string;
    webhookVerifyToken?: string;
  } | null;
  whatsappAccount: {
    phoneNumberId: string;
    wabaId: string;
    phoneNumber: string;
    verificationStatus: "verified" | "pending" | "none";
    status: "connected" | "disconnected";
    accessToken?: string;
    webhookVerifyToken?: string;
  } | null;
  failoverEnabled: boolean;
  rateLimitPerMin: number;
}

interface IntegrationsProps {
  channels: Channel[];
  onToggleChannel: (id: string, status: Channel["status"]) => Promise<any>;
}

export default function Integrations({ channels, onToggleChannel }: IntegrationsProps) {
  const [activeTab, setActiveTab] = useState<"facebook" | "instagram" | "whatsapp" | "architecture">("facebook");
  
  // Dynamic Meta Integration States
  const [metaState, setMetaState] = useState<MetaState | null>(null);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loadingState, setLoadingState] = useState(true);
  const [refreshingLogs, setRefreshingLogs] = useState(false);
  const [syncingPageId, setSyncingPageId] = useState<string | null>(null);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  
  // Simulation Panel States
  const [simName, setSimName] = useState("Ayesha Siddiqua");
  const [simPhone, setSimPhone] = useState("+8801912345678");
  const [simText, setSimText] = useState("");
  const [simFbEvent, setSimFbEvent] = useState<WebhookLog["eventType"]>("message");
  const [simAttachmentType, setSimAttachmentType] = useState<"none" | "image" | "audio" | "video" | "document">("none");
  const [simAttachmentUrl, setSimAttachmentUrl] = useState("");
  const [sendingSim, setSendingSim] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // New configuration state hooks for Custom Inputs and removals
  const [fbName, setFbName] = useState("");
  const [fbPageId, setFbPageId] = useState("");
  const [fbCategory, setFbCategory] = useState("Fashion & Clothing");
  const [fbLikes, setFbLikes] = useState("10000");
  const [fbPageToken, setFbPageToken] = useState("");
  const [fbWebhookVerifyToken, setFbWebhookVerifyToken] = useState("");
  const [editingTokenPageId, setEditingTokenPageId] = useState<string | null>(null);
  const [editTokenInput, setEditTokenInput] = useState("");
  const [editFbWebhookVerifyInput, setEditFbWebhookVerifyInput] = useState("");
  const [addingFb, setAddingFb] = useState(false);
  const [fbError, setFbError] = useState("");
  const [fbSuccess, setFbSuccess] = useState("");
  const [showFbForm, setShowFbForm] = useState(false);

  const [igUsername, setIgUsername] = useState("");
  const [igBusinessId, setIgBusinessId] = useState("");
  const [igAccessToken, setIgAccessToken] = useState("");
  const [igWebhookVerifyToken, setIgWebhookVerifyToken] = useState("");
  const [editingIgToken, setEditingIgToken] = useState(false);
  const [editIgTokenInput, setEditIgTokenInput] = useState("");
  const [editIgWebhookVerifyInput, setEditIgWebhookVerifyInput] = useState("");
  const [connectingIg, setConnectingIg] = useState(false);
  const [igError, setIgError] = useState("");
  const [igSuccess, setIgSuccess] = useState("");

  const [waPhoneNumber, setWaPhoneNumber] = useState("");
  const [waPhoneNumberId, setWaPhoneNumberId] = useState("");
  const [waWabaId, setWaWabaId] = useState("");
  const [waAccessToken, setWaAccessToken] = useState("");
  const [waWebhookVerifyToken, setWaWebhookVerifyToken] = useState("");
  const [editingWaToken, setEditingWaToken] = useState(false);
  const [editWaTokenInput, setEditWaTokenInput] = useState("");
  const [editWaWebhookVerifyInput, setEditWaWebhookVerifyInput] = useState("");
  const [connectingWa, setConnectingWa] = useState(false);
  const [waError, setWaError] = useState("");
  const [waSuccess, setWaSuccess] = useState("");

  // WhatsApp OTP verification state
  const [otpCode, setOtpCode] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [whatsappConnecting, setWhatsappConnecting] = useState(false);

  // Poll intervals
  const logsInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMetaState();
    fetchLogs();
    
    // Poll logs every 2 seconds to capture asynchronous Queue and AI Response movements
    logsInterval.current = setInterval(() => {
      fetchLogs();
    }, 2000);

    return () => {
      if (logsInterval.current) clearInterval(logsInterval.current);
    };
  }, []);

  const fetchMetaState = async () => {
    try {
      const res = await fetch("/api/meta/state");
      if (res.ok) {
        const data = await res.json();
        setMetaState(data);
      }
    } catch (e) {
      console.error("Failed to load Meta state", e);
    } finally {
      setLoadingState(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/meta/webhook/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error("Failed to load logs", e);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 1500);
  };

  // Toggle AI Failover Simulation State
  const handleToggleFailover = async () => {
    if (!metaState) return;
    setIsUpdatingSettings(true);
    const nextVal = !metaState.failoverEnabled;
    try {
      const res = await fetch("/api/meta/state/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ failoverEnabled: nextVal })
      });
      if (res.ok) {
        const updated = await res.json();
        setMetaState(updated);
      }
    } catch (e) {
      console.error("Failed to update failover status", e);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Update Rate Limit Settings
  const handleUpdateRateLimit = async (limit: number) => {
    if (!metaState) return;
    try {
      const res = await fetch("/api/meta/state/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rateLimitPerMin: limit })
      });
      if (res.ok) {
        const updated = await res.json();
        setMetaState(updated);
      }
    } catch (e) {
      console.error("Failed to update rate limit", e);
    }
  };

  // Facebook Connection Handlers
  const handleToggleFacebookPage = async (pageId: string, currentStatus: "connected" | "disconnected") => {
    const endpoint = currentStatus === "connected" 
      ? "/api/meta/facebook/disconnect" 
      : "/api/meta/facebook/reconnect";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId })
      });
      if (res.ok) {
        await fetchMetaState();
      }
    } catch (e) {
      console.error("Failed to toggle facebook status", e);
    }
  };

  const handleSyncFacebookPage = async (pageId: string) => {
    setSyncingPageId(pageId);
    try {
      const res = await fetch("/api/meta/facebook/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId })
      });
      if (res.ok) {
        // Wait briefly for a high-fidelity sync animation
        await new Promise(r => setTimeout(r, 1200));
        await fetchMetaState();
      }
    } catch (e) {
      console.error("Sync page error", e);
    } finally {
      setSyncingPageId(null);
    }
  };

  const handleAddFacebookPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbPageId.trim()) {
      setFbError("Page Name and Page ID are required.");
      return;
    }
    setAddingFb(true);
    setFbError("");
    setFbSuccess("");
    try {
      const res = await fetch("/api/meta/facebook/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fbName,
          pageId: fbPageId,
          category: fbCategory,
          likes: Number(fbLikes) || 0,
          accessToken: fbPageToken,
          webhookVerifyToken: fbWebhookVerifyToken
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFbSuccess("Facebook page successfully integrated!");
        setFbName("");
        setFbPageId("");
        setFbCategory("Fashion & Clothing");
        setFbLikes("10000");
        setFbPageToken("");
        setFbWebhookVerifyToken("");
        setMetaState(data.state);
        setShowFbForm(false);
      } else {
        setFbError(data.error || "Failed to add Facebook page.");
      }
    } catch (err) {
      setFbError("Server communication error.");
    } finally {
      setAddingFb(false);
    }
  };

  const handleSaveTokenUpdate = async (pageId: string) => {
    try {
      const res = await fetch("/api/meta/facebook/token", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId,
          accessToken: editTokenInput,
          webhookVerifyToken: editFbWebhookVerifyInput
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMetaState(data.state);
        setEditingTokenPageId(null);
        setEditTokenInput("");
        setEditFbWebhookVerifyInput("");
        setFbSuccess("Page credentials & Webhook verify token updated successfully!");
        setTimeout(() => setFbSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Failed to update page token", err);
    }
  };

  const handleDeleteFacebookPage = async (pageId: string) => {
    setFbError("");
    try {
      const res = await fetch(`/api/meta/facebook/page/${pageId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        setMetaState(data.state);
        setFbSuccess("Page removed successfully.");
        setTimeout(() => setFbSuccess(""), 3000);
      } else {
        setFbError(data.error || "Failed to delete Facebook page.");
      }
    } catch (err) {
      console.error("Failed to delete page", err);
      setFbError("Server communication error.");
    }
  };

  const handleConnectInstagram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!igUsername.trim() || !igBusinessId.trim()) {
      setIgError("Instagram Handle and Business ID are required.");
      return;
    }
    setConnectingIg(true);
    setIgError("");
    setIgSuccess("");
    try {
      const res = await fetch("/api/meta/instagram/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: igUsername,
          businessId: igBusinessId,
          accessToken: igAccessToken,
          webhookVerifyToken: igWebhookVerifyToken
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIgSuccess("Instagram Business Profile connected successfully!");
        setIgUsername("");
        setIgBusinessId("");
        setIgAccessToken("");
        setIgWebhookVerifyToken("");
        setMetaState(data.state);
      } else {
        setIgError(data.error || "Failed to connect Instagram.");
      }
    } catch (err) {
      setIgError("Server communication error.");
    } finally {
      setConnectingIg(false);
    }
  };

  const handleSaveIgTokenUpdate = async () => {
    try {
      const res = await fetch("/api/meta/instagram/token", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: editIgTokenInput,
          webhookVerifyToken: editIgWebhookVerifyInput
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMetaState(data.state);
        setEditingIgToken(false);
        setEditIgTokenInput("");
        setEditIgWebhookVerifyInput("");
        setIgSuccess("Instagram credentials & Webhook verify token updated successfully!");
        setTimeout(() => setIgSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Failed to update Instagram token", err);
    }
  };

  const handleDeleteInstagram = async () => {
    setIgError("");
    try {
      const res = await fetch("/api/meta/instagram", {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        setMetaState(data.state);
        setIgSuccess("Instagram profile deleted completely.");
        setTimeout(() => setIgSuccess(""), 3000);
      } else {
        setIgError(data.error || "Failed to delete Instagram integration.");
      }
    } catch (err) {
      console.error("Failed to delete Instagram", err);
      setIgError("Server communication error.");
    }
  };

  const handleConnectWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waPhoneNumber.trim() || !waPhoneNumberId.trim() || !waWabaId.trim()) {
      setWaError("Phone Number, Phone ID, and WABA Account ID are required.");
      return;
    }
    setConnectingWa(true);
    setWaError("");
    setWaSuccess("");
    try {
      const res = await fetch("/api/meta/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: waPhoneNumber,
          phoneNumberId: waPhoneNumberId,
          wabaId: waWabaId,
          accessToken: waAccessToken,
          webhookVerifyToken: waWebhookVerifyToken
        })
      });
      const data = await res.json();
      if (res.ok) {
        setWaSuccess("WhatsApp Account registered! Please proceed to OTP verification.");
        setWaPhoneNumber("");
        setWaPhoneNumberId("");
        setWaWabaId("");
        setWaAccessToken("");
        setWaWebhookVerifyToken("");
        setMetaState(data.state);
      } else {
        setWaError(data.error || "Failed to register WhatsApp account.");
      }
    } catch (err) {
      setWaError("Server communication error.");
    } finally {
      setConnectingWa(false);
    }
  };

  const handleSaveWaTokenUpdate = async () => {
    try {
      const res = await fetch("/api/meta/whatsapp/token", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: editWaTokenInput,
          webhookVerifyToken: editWaWebhookVerifyInput
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMetaState(data.state);
        setEditingWaToken(false);
        setWaSuccess("WhatsApp API credentials updated successfully!");
        setTimeout(() => setWaSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Failed to update WhatsApp token", err);
    }
  };

  const handleDeleteWhatsApp = async () => {
    setWaError("");
    try {
      const res = await fetch("/api/meta/whatsapp", {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        setMetaState(data.state);
        setWaSuccess("WhatsApp connection removed completely.");
        setTimeout(() => setWaSuccess(""), 3000);
      } else {
        setWaError(data.error || "Failed to delete WhatsApp integration.");
      }
    } catch (err) {
      console.error("Failed to delete WhatsApp", err);
      setWaError("Server communication error.");
    }
  };

  // Instagram Connection Handlers
  const handleToggleInstagram = async () => {
    if (!metaState?.instagramAccount) return;
    const isConnected = metaState.instagramAccount.status === "connected";
    try {
      if (isConnected) {
        await fetch("/api/meta/instagram/disconnect", { method: "POST" });
      } else {
        // Toggle/re-enable simulated IG account
        setLoadingState(true);
        await new Promise(r => setTimeout(r, 1000));
        await fetchMetaState();
      }
      await fetchMetaState();
    } catch (e) {
      console.error("Toggle IG failed", e);
    }
  };

  // WhatsApp Connection & Verification
  const handleConnectWhatsAppSim = async () => {
    setWhatsappConnecting(true);
    setOtpError("");
    setOtpSuccess(false);
    // Request code step
    await new Promise(r => setTimeout(r, 1000));
    setWhatsappConnecting(false);
    if (metaState?.whatsappAccount) {
      metaState.whatsappAccount.verificationStatus = "pending";
      setMetaState({ ...metaState });
    }
  };

  const handleVerifyWhatsAppOtp = async () => {
    setVerifyingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/meta/whatsapp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otpCode })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSuccess(true);
        setOtpCode("");
        await fetchMetaState();
      } else {
        setOtpError(data.error || "Verification failed");
      }
    } catch (e) {
      setOtpError("Error checking code");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Inbound Webhook Simulator Trigger
  const handleTriggerSimulation = async (platform: "facebook" | "instagram" | "whatsapp") => {
    setSendingSim(true);
    let attachmentPayload = undefined;
    
    if (simAttachmentType !== "none" && simAttachmentUrl) {
      attachmentPayload = {
        url: simAttachmentUrl,
        type: simAttachmentType
      };
    }

    try {
      const res = await fetch("/api/meta/webhook/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          eventType: platform === "facebook" ? simFbEvent : "message",
          customerName: simName,
          customerPhone: simPhone,
          text: simText,
          attachmentUrl: simAttachmentUrl || undefined,
          attachmentType: simAttachmentType !== "none" ? simAttachmentType : undefined
        })
      });

      if (res.ok) {
        setSimText("");
        setSimAttachmentUrl("");
        setSimAttachmentType("none");
        await fetchLogs();
      }
    } catch (e) {
      console.error("Simulation trigger failed", e);
    } finally {
      setSendingSim(false);
    }
  };

  // Populate helper templates for simulate panel
  const applySimTemplate = (type: "text_size" | "text_delivery" | "text_address" | "reaction" | "postback") => {
    if (type === "text_size") {
      setSimText("Sarees matching collection are nice. Do you have L (40) size for Kurtis? Please tell me.");
      setSimFbEvent("message");
      setSimAttachmentType("none");
    } else if (type === "text_delivery") {
      setSimText("ডেলিভারি চার্জ কত ভাইয়া? ঢাকার বাহিরে কি কুরিয়ারে ক্যাশ অন ডেলিভারি দেওয়া যাবে?");
      setSimFbEvent("message");
      setSimAttachmentType("none");
    } else if (type === "text_address") {
      setSimText("My Name is Tanvir. Address is House 10, Road 4, Dhanmondi, Dhaka. Phone is 01711223344. Propose order please!");
      setSimFbEvent("message");
      setSimAttachmentType("none");
    } else if (type === "reaction") {
      setSimText("");
      setSimFbEvent("reaction");
    } else if (type === "postback") {
      setSimText("GET_STARTED_AURA");
      setSimFbEvent("postback");
    }
  };

  const handleSelectSimAttachment = (type: "image" | "audio" | "video" | "document") => {
    setSimAttachmentType(type);
    if (type === "image") {
      setSimAttachmentUrl("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80");
    } else if (type === "audio") {
      setSimAttachmentUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    } else if (type === "video") {
      setSimAttachmentUrl("https://assets.mixkit.co/videos/preview/mixkit-women-models-at-a-fashion-show-42006-large.mp4");
    } else if (type === "document") {
      setSimAttachmentUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
    }
  };

  if (loadingState) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-gray-500 font-medium">Booting Meta Omnichannel Sandbox Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upper Bar */}
      <div className="pb-3 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Meta Integrations Suite</h1>
          <p className="text-sm text-gray-500">
            Real-time Meta Webhooks, asynchronous message queues, failovers, and simulated connections for Messenger, Instagram, and WhatsApp.
          </p>
        </div>
        
        {/* Status indicator pill */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-green-800">Webhook Host Alive</span>
        </div>
      </div>

      {/* Meta Webhook Live Callback Endpoint & Setup Console */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-5 shadow-sm space-y-4 border border-indigo-900/50 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="text-base font-bold tracking-tight text-white">Meta Webhook Live Endpoint & Verification Console</h3>
              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-400/30 uppercase tracking-wider">
                Facebook Page Messenger + Instagram DM + WhatsApp
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              Meta (Facebook & Instagram) require configuring a Live Webhook Callback URL and Webhook Verification Secret in Meta Developer Console (<code className="text-amber-300 font-mono">developers.facebook.com</code>).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Callback URL */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-blue-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                1. Webhook Callback URL (Paste in Meta Developer Portal)
              </span>
              <button
                onClick={() => {
                  const url = typeof window !== "undefined" ? `${window.location.origin}/api/meta/webhook` : "https://your-domain/api/meta/webhook";
                  navigator.clipboard.writeText(url);
                  setCopiedText("Webhook URL Copied!");
                  setTimeout(() => setCopiedText(null), 2500);
                }}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs"
              >
                <Copy className="w-3 h-3" />
                {copiedText === "Webhook URL Copied!" ? "Copied!" : "Copy Callback URL"}
              </button>
            </div>
            <code className="block bg-black/50 text-blue-300 p-2.5 rounded-lg text-xs font-mono break-all border border-blue-900/50">
              {typeof window !== "undefined" ? `${window.location.origin}/api/meta/webhook` : "https://your-domain/api/meta/webhook"}
            </code>
          </div>

          {/* Verify Token */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-emerald-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                2. Default Webhook Verification Secret (Verify Token)
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("aura_webhook_verify_secret_2026");
                  setCopiedText("Verify Token Copied!");
                  setTimeout(() => setCopiedText(null), 2500);
                }}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs"
              >
                <Copy className="w-3 h-3" />
                {copiedText === "Verify Token Copied!" ? "Copied!" : "Copy Verify Secret"}
              </button>
            </div>
            <code className="block bg-black/50 text-emerald-300 p-2.5 rounded-lg text-xs font-mono break-all border border-emerald-900/50">
              aura_webhook_verify_secret_2026
            </code>
          </div>
        </div>

        {/* Vercel Environment Variables Setup Card (Recommended Security Standard) */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950 border border-emerald-500/30 rounded-xl p-4 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Vercel Environment Variables Setup (Maximum Security Standard)
              </span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
              Recommended for Production
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            এডমিন প্যানেলে সিক্রেট টোকেন না রেখে Vercel-এর <strong>Environment Variables (`.env`)</strong>-এ রাখা অত্যন্ত নিরাপদ ও বেস্ট প্র্যাকটিস! সার্ভার অটোমেটিকভাবে <code>process.env</code> থেকে টোকেন রিড করবে।
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <div className="bg-black/40 border border-emerald-900/50 p-2 rounded-lg">
              <span className="text-emerald-400 font-bold block text-[10px]">META_VERIFY_TOKEN</span>
              <span className="text-gray-400 text-[10px]">e.g. aura_webhook_verify_secret_2026</span>
            </div>
            <div className="bg-black/40 border border-emerald-900/50 p-2 rounded-lg">
              <span className="text-blue-400 font-bold block text-[10px]">FACEBOOK_PAGE_ACCESS_TOKEN</span>
              <span className="text-gray-400 text-[10px]">e.g. EAABz9x8...</span>
            </div>
            <div className="bg-black/40 border border-emerald-900/50 p-2 rounded-lg">
              <span className="text-pink-400 font-bold block text-[10px]">INSTAGRAM_ACCESS_TOKEN</span>
              <span className="text-gray-400 text-[10px]">e.g. EAAB_mock_instagram...</span>
            </div>
          </div>
        </div>

        {/* Setup instructions */}
        <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs text-gray-300 space-y-2 font-sans">
          <div className="font-semibold text-white flex items-center gap-2 text-xs">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Meta Webhooks কীভাবে সেটআপ করবেন (Step-by-Step Meta Webhook Setup Guide):</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-300 pl-1 leading-relaxed">
            <li><strong>developers.facebook.com</strong>-এ লগইন করুন &gt; আপনার Meta App Select করুন &gt; বাম পাশের <strong>Webhooks</strong> মেনুতে যান।</li>
            <li>Drop-down তালিকা থেকে <strong>Page</strong> (Facebook Messenger-এর জন্য), <strong>Instagram</strong> (Instagram Direct DM-এর জন্য), অথবা <strong>WhatsApp</strong> সিলেক্ট করুন।</li>
            <li><strong>Edit Subscription / Add Callback URL</strong> বাটনে ক্লিক করে ওপরের <strong>Callback URL</strong> ও <strong>Verify Token</strong> দিয়ে <strong>Verify & Save</strong> করুন।</li>
            <li>সাবস্ক্রিপশন তালিকা থেকে <strong>messages</strong>, <strong>messaging_postbacks</strong>, <strong>message_deliveries</strong> ফিল্ডগুলো <strong>Subscribe</strong> মার্ক করে দিন।</li>
          </ol>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 gap-1.5 scrollbar-none overflow-x-auto">
        <button
          onClick={() => setActiveTab("facebook")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "facebook" 
              ? "border-blue-600 text-blue-600 bg-blue-50/10" 
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Facebook className="w-4 h-4" />
          Facebook Pages & Messenger
        </button>
        <button
          onClick={() => setActiveTab("instagram")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "instagram" 
              ? "border-pink-600 text-pink-600 bg-pink-50/10" 
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Instagram className="w-4 h-4" />
          Instagram DM
        </button>
        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "whatsapp" 
              ? "border-emerald-600 text-emerald-600 bg-emerald-50/10" 
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          WhatsApp Cloud API
        </button>
        <button
          onClick={() => setActiveTab("architecture")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "architecture" 
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/10" 
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Shield className="w-4 h-4" />
          Queue & Webhook Monitor
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-left">
        
        {/* Left main settings tab */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* FACEBOOK TAB */}
          {activeTab === "facebook" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Facebook Pages Connection Console</h2>
                    <p className="text-xs text-gray-500 mt-1">Connect your product catalog Facebook pages to capture inbound Messenger chat threads.</p>
                  </div>
                  <button
                    onClick={() => setShowFbForm(!showFbForm)}
                    className="self-start sm:self-auto px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {showFbForm ? "Hide Form" : "Connect New Page"}
                  </button>
                </div>

                {/* ADD PAGE FORM */}
                {showFbForm && (
                  <form onSubmit={handleAddFacebookPage} className="p-4 bg-indigo-50/20 border border-indigo-100/30 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Integrate custom Facebook Page</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Page Name</label>
                        <input
                          type="text"
                          required
                          value={fbName}
                          onChange={(e) => setFbName(e.target.value)}
                          placeholder="e.g. Aura Boutique Chittagong"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Page ID (15-digit number)</label>
                        <input
                          type="text"
                          required
                          value={fbPageId}
                          onChange={(e) => setFbPageId(e.target.value)}
                          placeholder="e.g. 302948172839471"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Page Category</label>
                        <input
                          type="text"
                          value={fbCategory}
                          onChange={(e) => setFbCategory(e.target.value)}
                          placeholder="e.g. Fashion & Clothing"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Likes / Audience size</label>
                        <input
                          type="number"
                          value={fbLikes}
                          onChange={(e) => setFbLikes(e.target.value)}
                          placeholder="e.g. 50000"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    {fbError && <p className="text-xs font-semibold text-red-600">{fbError}</p>}
                    {fbSuccess && <p className="text-xs font-semibold text-green-600">{fbSuccess}</p>}
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setShowFbForm(false)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addingFb}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 disabled:opacity-50"
                      >
                        {addingFb ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                        Save Page Connection
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3.5">
                  {metaState?.facebookPages.map(page => {
                    const isConnected = page.status === "connected";
                    const isSyncing = syncingPageId === page.pageId;
                    
                    return (
                      <div key={page.pageId} className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3 transition-all hover:bg-gray-100/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1.5 flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📄</span>
                              <span className="font-bold text-sm text-gray-900">{page.name}</span>
                              <span className="text-[10px] text-gray-400 font-medium bg-white px-2 py-0.5 rounded-full border border-gray-100">{page.category}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-gray-500 font-normal">
                              <div><span className="font-semibold text-gray-700">Page ID:</span> {page.pageId}</div>
                              <div><span className="font-semibold text-gray-700">Audience:</span> {page.likes.toLocaleString()} likes</div>
                              <div><span className="font-semibold text-gray-700">Status:</span> 
                                <span className={`ml-1 font-semibold ${isConnected ? "text-green-600" : "text-gray-500"}`}>
                                  {isConnected ? "Connected" : "Disconnected"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 w-full md:w-auto self-stretch md:self-auto shrink-0 items-center justify-end">
                            <button
                              disabled={!isConnected || isSyncing}
                              onClick={() => handleSyncFacebookPage(page.pageId)}
                              className="flex-1 md:flex-none px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-indigo-600" : ""}`} />
                              {isSyncing ? "Syncing..." : "Sync Data"}
                            </button>
                            
                            <button
                              onClick={() => handleToggleFacebookPage(page.pageId, page.status)}
                              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                                isConnected 
                                  ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-100" 
                                  : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-xs"
                              }`}
                            >
                              {isConnected ? "Disconnect" : "Connect Page"}
                            </button>

                            <button
                              onClick={() => handleDeleteFacebookPage(page.pageId)}
                              className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-100 rounded-lg transition-all"
                              title="Remove connection completely"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inbound Simulator Panel */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <span className="p-1 bg-blue-100 text-blue-600 rounded-lg"><Facebook className="w-4 h-4" /></span>
                    Interactive Facebook Messenger Webhook Simulator
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Simulate real webhook payloads triggering the backend Meta ingress engine, testing queue flow and response automation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Customer Name</label>
                    <input
                      type="text"
                      value={simName}
                      onChange={(e) => setSimName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Webhook Event Type</label>
                    <select
                      value={simFbEvent}
                      onChange={(e) => setSimFbEvent(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    >
                      <option value="message">message (Inbound customer text)</option>
                      <option value="delivery">delivery (Message delivery receipt)</option>
                      <option value="read">read (Messenger seen event)</option>
                      <option value="reaction">reaction (Love reaction ❤️)</option>
                      <option value="postback">postback (Get Started button clicked)</option>
                    </select>
                  </div>
                </div>

                {simFbEvent === "message" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Message Text Content</label>
                        <div className="flex gap-1.5 text-[9px] font-bold text-indigo-600">
                          <button onClick={() => applySimTemplate("text_size")} className="hover:underline">Sizes Template</button>
                          <span>•</span>
                          <button onClick={() => applySimTemplate("text_delivery")} className="hover:underline">Delivery Template</button>
                          <span>•</span>
                          <button onClick={() => applySimTemplate("text_address")} className="hover:underline">Order Template</button>
                        </div>
                      </div>
                      <textarea
                        value={simText}
                        onChange={(e) => setSimText(e.target.value)}
                        rows={2}
                        placeholder="Write a message to your shop... (Bangla/English/Banglish supported)"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none resize-none"
                      />
                    </div>

                    {/* Media Attachments Section */}
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Attach Media Asset (Support JPG, PNG, PDF, MP4, MP3)</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleSelectSimAttachment("image")}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                            simAttachmentType === "image" ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          Image (PNG/JPG)
                        </button>
                        <button
                          onClick={() => handleSelectSimAttachment("document")}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                            simAttachmentType === "document" ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Invoice (PDF/DOCX)
                        </button>
                        <button
                          onClick={() => handleSelectSimAttachment("video")}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                            simAttachmentType === "video" ? "bg-pink-100 text-pink-800 border-pink-200" : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                          }`}
                        >
                          <Film className="w-3.5 h-3.5" />
                          Video (MP4)
                        </button>
                        <button
                          onClick={() => handleSelectSimAttachment("audio")}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                            simAttachmentType === "audio" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                          }`}
                        >
                          <Music className="w-3.5 h-3.5" />
                          Audio (MP3)
                        </button>
                        {simAttachmentType !== "none" && (
                          <button
                            onClick={() => { setSimAttachmentType("none"); setSimAttachmentUrl(""); }}
                            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[10px] font-bold"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {simAttachmentType !== "none" && (
                        <div className="p-2.5 bg-white rounded-lg border border-gray-100 text-[10px] font-mono break-all text-gray-500">
                          <span className="font-bold text-gray-700 uppercase">{simAttachmentType}:</span> {simAttachmentUrl}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {simFbEvent === "reaction" && (
                  <div className="p-3.5 bg-gray-50 rounded-xl text-xs space-y-2 text-gray-600 font-normal">
                    <p>Will send a simulated user reaction event to the last agent message:</p>
                    <div className="flex gap-2">
                      <button onClick={() => applySimTemplate("reaction")} className="px-3 py-1.5 bg-white border rounded-lg text-lg">❤️ Love</button>
                      <button className="px-3 py-1.5 bg-white border rounded-lg text-lg opacity-45 cursor-not-allowed">👍 Like</button>
                      <button className="px-3 py-1.5 bg-white border rounded-lg text-lg opacity-45 cursor-not-allowed">😮 Wow</button>
                    </div>
                  </div>
                )}

                {simFbEvent === "postback" && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Postback Payload String</label>
                      <button onClick={() => applySimTemplate("postback")} className="text-[9px] font-bold text-indigo-600 hover:underline">Apply Default</button>
                    </div>
                    <input
                      type="text"
                      value={simText}
                      onChange={(e) => setSimText(e.target.value)}
                      placeholder="e.g. GET_STARTED_AURA"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                )}

                <button
                  onClick={() => handleTriggerSimulation("facebook")}
                  disabled={sendingSim || (simFbEvent === "message" && !simText.trim() && simAttachmentType === "none") || (simFbEvent === "postback" && !simText.trim())}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs hover:shadow-md font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  {sendingSim ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Dispatch Simulated Facebook Webhook Payload
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* INSTAGRAM TAB */}
          {activeTab === "instagram" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Instagram Business Connected Profile</h2>
                  <p className="text-xs text-gray-500 mt-1">Directly automate replies to Instagram Direct Messages, Story Mentions, and post comments.</p>
                </div>

                {metaState?.instagramAccount ? (
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3 transition-all hover:bg-gray-100/50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1 flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📸</span>
                          <span className="font-bold text-sm text-pink-600">{metaState.instagramAccount.username}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold border ${
                            metaState.instagramAccount.status === "connected" ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-100 text-gray-400"
                          }`}>
                            {(metaState.instagramAccount.status || '').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-gray-500 font-normal pt-1">
                          <div><span className="font-semibold text-gray-700">WABA Business ID:</span> {metaState.instagramAccount.businessId}</div>
                          <div><span className="font-semibold text-gray-700">Last Synced:</span> {new Date(metaState.instagramAccount.lastSynced).toLocaleTimeString()}</div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={handleToggleInstagram}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                            metaState.instagramAccount.status === "connected"
                              ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-100"
                              : "bg-pink-600 hover:bg-pink-700 text-white border-pink-600 shadow-xs"
                          }`}
                        >
                          {metaState.instagramAccount.status === "connected" ? "Disconnect" : "Connect Profile"}
                        </button>
                        <button
                          onClick={handleDeleteInstagram}
                          className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-100 rounded-lg transition-all"
                          title="Remove profile completely"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleConnectInstagram} className="p-4 bg-pink-50/25 border border-pink-100 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold text-pink-950 uppercase tracking-wider text-left">Configure Instagram Business Connection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Instagram Handle</label>
                        <input
                          type="text"
                          required
                          value={igUsername}
                          onChange={(e) => setIgUsername(e.target.value)}
                          placeholder="e.g. @auraboutique.bd"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Instagram Business ID</label>
                        <input
                          type="text"
                          required
                          value={igBusinessId}
                          onChange={(e) => setIgBusinessId(e.target.value)}
                          placeholder="e.g. inst_biz_992381"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                    {igError && <p className="text-xs font-semibold text-red-600 text-left">{igError}</p>}
                    {igSuccess && <p className="text-xs font-semibold text-green-600 text-left">{igSuccess}</p>}
                    <button
                      type="submit"
                      disabled={connectingIg}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-xs"
                    >
                      {connectingIg ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                      Link Instagram Business Profile
                    </button>
                  </form>
                )}
              </div>

              {/* Instagram Sim Panel */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <span className="p-1 bg-pink-100 text-pink-600 rounded-lg"><Instagram className="w-4 h-4" /></span>
                    Interactive Instagram DM Inbound Simulator
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Simulate Instagram users mentioning your brand in stories or sending direct messages.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Instagram Handle</label>
                      <input
                        type="text"
                        value={simName}
                        onChange={(e) => setSimName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Inbound Action</label>
                      <select
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                        disabled
                      >
                        <option>direct_message (Private Inbox DM)</option>
                        <option>story_mention (Story Tag Alert)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">DM Message Content</label>
                    <textarea
                      value={simText}
                      onChange={(e) => setSimText(e.target.value)}
                      rows={2}
                      placeholder="e.g. Do you have any stock left for the Eid collection sarees?"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={() => handleTriggerSimulation("instagram")}
                    disabled={sendingSim || !simText.trim()}
                    className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl shadow-xs hover:shadow-md font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                  >
                    {sendingSim ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Simulate Inbound Instagram DM event
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WHATSAPP TAB */}
          {activeTab === "whatsapp" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900">WhatsApp Business Integration (Cloud API)</h2>
                  <p className="text-xs text-gray-500 mt-1">Configure your official Meta WhatsApp Business WABA credentials and numbers.</p>
                </div>

                {metaState?.whatsappAccount ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3.5 text-xs font-normal">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💬</span>
                          <span className="font-bold text-sm text-emerald-600">{metaState.whatsappAccount.phoneNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                            metaState.whatsappAccount.verificationStatus === "verified" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-amber-100 text-amber-800 border-amber-100"
                          }`}>
                            {metaState.whatsappAccount.verificationStatus}
                          </span>
                        </div>

                        <div className="flex gap-2 items-center">
                          {metaState.whatsappAccount.verificationStatus !== "verified" && (
                            <button
                              onClick={handleConnectWhatsAppSim}
                              disabled={whatsappConnecting}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition-all shadow-xs"
                            >
                              {whatsappConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Verify Phone Number"}
                            </button>
                          )}
                          <button
                            onClick={handleDeleteWhatsApp}
                            className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-100 rounded-lg transition-all"
                            title="Remove WhatsApp connection"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500 text-left">
                        <div><span className="font-semibold text-gray-700">Phone Number ID:</span> {metaState.whatsappAccount.phoneNumberId}</div>
                        <div><span className="font-semibold text-gray-700">WABA Account ID:</span> {metaState.whatsappAccount.wabaId}</div>
                      </div>
                    </div>

                    {/* Verification Form if Pending */}
                    {metaState.whatsappAccount.verificationStatus === "pending" && (
                      <div className="p-4 border-2 border-dashed border-amber-200 rounded-xl bg-amber-50/20 space-y-3 text-xs text-left">
                        <div className="flex items-start gap-2 text-amber-900 leading-relaxed font-normal">
                          <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">Enter Phone SMS Verification Code</p>
                            <p className="text-[10px] text-amber-700">A virtual 6-digit WhatsApp test SMS OTP has been simulated. Type <code className="bg-amber-100 px-1 py-0.2 rounded font-mono font-bold text-amber-950">123456</code> to activate this phone line.</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type 123456"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none"
                          />
                          <button
                            onClick={handleVerifyWhatsAppOtp}
                            disabled={verifyingOtp || !otpCode}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                          >
                            {verifyingOtp ? "Checking..." : "Confirm Code"}
                          </button>
                        </div>
                        {otpError && <p className="text-[11px] font-bold text-red-600">{otpError}</p>}
                        {otpSuccess && <p className="text-[11px] font-bold text-green-600">🎉 Phone successfully verified!</p>}
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleConnectWhatsApp} className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl space-y-4 text-left">
                    <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Configure WhatsApp Cloud API Connection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={waPhoneNumber}
                          onChange={(e) => setWaPhoneNumber(e.target.value)}
                          placeholder="e.g. +8801712345678"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Phone Number ID</label>
                        <input
                          type="text"
                          required
                          value={waPhoneNumberId}
                          onChange={(e) => setWaPhoneNumberId(e.target.value)}
                          placeholder="e.g. wa_phone_id_88291"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">WABA Account ID</label>
                        <input
                          type="text"
                          required
                          value={waWabaId}
                          onChange={(e) => setWaWabaId(e.target.value)}
                          placeholder="e.g. waba_id_1029318"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                    {waError && <p className="text-xs font-semibold text-red-600">{waError}</p>}
                    {waSuccess && <p className="text-xs font-semibold text-green-600">{waSuccess}</p>}
                    <button
                      type="submit"
                      disabled={connectingWa}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-xs"
                    >
                      {connectingWa ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                      Link WhatsApp API Credentials
                    </button>
                  </form>
                )}
              </div>

              {/* WhatsApp Sim Panel */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <span className="p-1 bg-emerald-100 text-emerald-600 rounded-lg"><Smartphone className="w-4 h-4" /></span>
                    WhatsApp Cloud API Inbound message simulator
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Simulate customer WhatsApp messages, story mentions, and file uploads.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Customer Phone Number</label>
                      <input
                        type="text"
                        value={simPhone}
                        onChange={(e) => setSimPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Customer Name</label>
                      <input
                        type="text"
                        value={simName}
                        onChange={(e) => setSimName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">WhatsApp Message Text</label>
                    <textarea
                      value={simText}
                      onChange={(e) => setSimText(e.target.value)}
                      rows={2}
                      placeholder="e.g. Assalamu Alaikum, I want to order the red wedding saree. Cash on delivery."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none resize-none"
                    />
                  </div>

                  {/* Multimedia attachments upload simulator */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Attach WhatsApp Media Asset</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleSelectSimAttachment("image")}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                          simAttachmentType === "image" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Photo (JPG)
                      </button>
                      <button
                        onClick={() => handleSelectSimAttachment("audio")}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                          simAttachmentType === "audio" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <Music className="w-3.5 h-3.5" />
                        Voice (MP3)
                      </button>
                      <button
                        onClick={() => handleSelectSimAttachment("video")}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                          simAttachmentType === "video" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <Film className="w-3.5 h-3.5" />
                        Video (MP4)
                      </button>
                      <button
                        onClick={() => handleSelectSimAttachment("document")}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                          simAttachmentType === "document" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Catalog (PDF)
                      </button>
                    </div>

                    {simAttachmentType !== "none" && (
                      <div className="p-2.5 bg-white rounded-lg border border-gray-100 text-[10px] font-mono break-all text-gray-500">
                        <span className="font-bold text-gray-700 uppercase">{simAttachmentType}:</span> {simAttachmentUrl}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleTriggerSimulation("whatsapp")}
                    disabled={sendingSim || (!simText.trim() && simAttachmentType === "none")}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs hover:shadow-md font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                  >
                    {sendingSim ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Send Inbound WhatsApp Message Webhook
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM ARCHITECTURE & QUEUE TAB */}
          {activeTab === "architecture" && (
            <div className="space-y-6">
              
              {/* Architecture Node Visualizer */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Meta Webhook Pipeline Architecture</h2>
                  <p className="text-xs text-gray-500 mt-1">High-fidelity schematic of webhooks traversing our asynchronous Message Queue to AI response engines.</p>
                </div>

                <div className="p-4 bg-gray-950 text-white rounded-2xl space-y-4 font-mono text-xs border border-gray-800">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 border-b border-gray-900 text-[11px] text-gray-500 font-bold">
                    <span>Meta Cloud Servers</span>
                    <span>Backend Container Node</span>
                    <span>Database / CRM</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
                    <div className="p-2.5 bg-blue-900/30 border border-blue-700/50 rounded-xl">
                      <p className="text-[10px] uppercase text-blue-400 font-bold">Meta Ingress</p>
                      <p className="text-[9px] mt-1 text-gray-300">HTTP Handshake</p>
                    </div>
                    
                    <div className="flex justify-center text-gray-600">
                      <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                    </div>

                    <div className="p-2.5 bg-purple-900/30 border border-purple-700/50 rounded-xl relative">
                      <p className="text-[10px] uppercase text-purple-400 font-bold">Redis Queue</p>
                      <p className="text-[9px] mt-1 text-gray-300">Asynchronous Loop</p>
                    </div>

                    <div className="flex justify-center text-gray-600">
                      <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                    </div>

                    <div className="p-2.5 bg-indigo-900/30 border border-indigo-700/50 rounded-xl">
                      <p className="text-[10px] uppercase text-indigo-400 font-bold">AI Response</p>
                      <p className="text-[9px] mt-1 text-gray-300">Gemini Pro API</p>
                    </div>
                  </div>

                  <div className="flex justify-center my-1 text-gray-600">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-emerald-950 border border-emerald-800 rounded-lg">
                      <p className="text-[9px] text-emerald-400 font-bold">Database Store</p>
                      <p className="text-[8px] mt-0.5 text-gray-400">JSON Persistent CRM</p>
                    </div>
                    <div className="p-2 bg-yellow-950 border border-yellow-800 rounded-lg">
                      <p className="text-[9px] text-yellow-400 font-bold">Seen/Status Events</p>
                      <p className="text-[8px] mt-0.5 text-gray-400">Real-time Echoes</p>
                    </div>
                    <div className="p-2 bg-pink-950 border border-pink-800 rounded-lg">
                      <p className="text-[9px] text-pink-400 font-bold">Socket.io Dispatch</p>
                      <p className="text-[8px] mt-0.5 text-gray-400">Instant browser update</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Failover and Rate Limits controls */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-5">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-orange-500" />
                    Failover Protection & Anti-Spam Controls
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Configure automated fallback triggers and protective thresholds for when downstream neural engines fail.</p>
                </div>

                <div className="space-y-4">
                  {/* Failover Switch */}
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="space-y-0.5 text-xs font-normal">
                      <p className="font-bold text-gray-900">Simulate AI Engine Outage (Failover Mode)</p>
                      <p className="text-[10px] text-gray-400 max-w-xs md:max-w-md">When checked, the system diverts incoming messages into safety fallback templates, logs an error log, notifies admins, and retries automatically.</p>
                    </div>

                    <button
                      onClick={handleToggleFailover}
                      disabled={isUpdatingSettings}
                      className="text-gray-600 transition-transform active:scale-95 shrink-0"
                    >
                      {metaState?.failoverEnabled ? (
                        <ToggleRight className="w-11 h-11 text-red-600" />
                      ) : (
                        <ToggleLeft className="w-11 h-11 text-gray-300" />
                      )}
                    </button>
                  </div>

                  {/* Rate Limiting Selector */}
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs font-normal space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <p className="font-bold text-gray-900">Anti-Spam Rate Limit Protection</p>
                        <p className="text-[10px] text-gray-400">Maximum messages acceptable per user in any 60-second window before block is active.</p>
                      </div>
                      <span className="font-bold text-indigo-600">{metaState?.rateLimitPerMin} msg/min</span>
                    </div>

                    <div className="flex gap-2">
                      {[5, 10, 15, 30].map(val => (
                        <button
                          key={val}
                          onClick={() => handleUpdateRateLimit(val)}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            metaState?.rateLimitPerMin === val 
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-xs" 
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {val} Msg
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Columns: Granular developer logs & Queues state */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Active Logs Module */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-gray-900">Developer Webhook Logs</h3>
                <p className="text-[10px] text-gray-400 font-normal">Real-time meta webhook ingress status streams.</p>
              </div>
              <button
                onClick={fetchLogs}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {logs.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs space-y-1 font-normal">
                <p className="font-bold text-gray-600">No Webhook Activity Yet</p>
                <p className="text-[10px] max-w-xs mx-auto">Use the simulator on the left to fire simulated Meta webhooks, or test our live web widget!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-160 overflow-y-auto pr-1">
                {logs.map(log => {
                  const statusColors = {
                    received: "bg-blue-50 text-blue-700 border-blue-100",
                    queued: "bg-amber-50 text-amber-700 border-amber-100",
                    processing: "bg-purple-50 text-purple-700 border-purple-100",
                    completed: "bg-green-50 text-green-700 border-green-100",
                    failed: "bg-red-50 text-red-700 border-red-100",
                    duplicate_ignored: "bg-gray-100 text-gray-500 border-gray-200"
                  };

                  return (
                    <div key={log.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-3 font-normal">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                          <span className="text-sm">
                            {log.platform === "facebook" && "🔵"}
                            {log.platform === "instagram" && "🟣"}
                            {log.platform === "whatsapp" && "🟢"}
                          </span>
                          <span>{log.payload.customerName}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${statusColors[log.status] || "bg-gray-50"}`}>
                          {log.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500">
                        <div><span className="font-semibold">Event:</span> <code className="bg-white px-1 py-0.2 rounded font-bold border">{log.eventType}</code></div>
                        <div className="text-right"><span className="font-semibold text-gray-400">ID:</span> <code className="font-mono text-[9px]">{log.id}</code></div>
                      </div>

                      {log.payload.text && (
                        <div className="p-2 bg-white rounded-lg border border-gray-100 text-[11px] text-gray-600 leading-relaxed max-h-12 overflow-y-auto">
                          {log.payload.text}
                        </div>
                      )}

                      {/* Webhook Path Stepper */}
                      <div className="space-y-1.5 pt-2 border-t border-gray-200/50">
                        <p className="text-[9px] uppercase font-bold text-gray-400">Asynchronous Webhook Traversal Paths</p>
                        <div className="space-y-1 text-[10px] font-normal text-gray-500">
                          {log.steps.map((st, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.status === "success" ? "bg-green-500" : "bg-red-500"}`}></span>
                              <span className="flex-1 truncate">{st.name}</span>
                              <span className="text-[8px] text-gray-400 shrink-0">{new Date(st.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Webhook Callback Config Cards */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-4 text-xs font-normal">
            <h4 className="font-bold text-gray-900">Callback API Keys & Credentials</h4>
            
            <div className="space-y-2.5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Developer Webhook URL</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value="https://aura-boutique.aistudio.build/api/meta/webhook"
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-mono text-[10px] outline-none"
                  />
                  <button
                    onClick={() => handleCopy("https://aura-boutique.aistudio.build/api/meta/webhook", "curlUrl")}
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 border text-gray-600 rounded-lg"
                  >
                    {copiedText === "curlUrl" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Verification Handshake Token</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value="aura_boutique_secure_handshake_2026"
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-mono text-[10px] outline-none"
                  />
                  <button
                    onClick={() => handleCopy("aura_boutique_secure_handshake_2026", "handshakeToken")}
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 border text-gray-600 rounded-lg"
                  >
                    {copiedText === "handshakeToken" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
