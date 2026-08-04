/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, ShieldAlert, Sparkles, Send, User, Check, AlertCircle,
  Smartphone, Globe, Phone, Mail, MapPin, Tag, Plus, Loader2,
  Lock, RefreshCw, ShoppingBag, Eye, HelpCircle, AlertTriangle,
  MessageSquare, ArrowLeft, Info, X, ChevronUp, ChevronDown
} from "lucide-react";
import { Customer, Conversation, Message, Product, Order } from "../types.js";

interface InboxProps {
  conversations: (Conversation & {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAvatar: string;
    customerTags: string[];
    customerLanguage: string;
    customerLocation: string;
    customerNotes: string;
  })[];
  products: Product[];
  orders: Order[];
  onRefresh: () => void;
  onUpdateConvStatus: (id: string, status: Conversation["status"], assignedTo?: string) => Promise<any>;
}

export default function Inbox({ conversations, products, orders, onRefresh, onUpdateConvStatus }: InboxProps) {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"auto_pilot" | "open" | "closed">("auto_pilot");
  
  // Right side panel profile state
  const [editingProfile, setEditingProfile] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [newTag, setNewTag] = useState("");

  // Simulator State
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simName, setSimName] = useState("Karim Uddin");
  const [simPhone, setSimPhone] = useState("+8801711223344");
  const [simChannel, setSimChannel] = useState<"whatsapp" | "facebook" | "instagram" | "webchat">("whatsapp");
  const [simText, setSimText] = useState("");
  const [simulating, setSimulating] = useState(false);

  // General loading states
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [mobileShowProfile, setMobileShowProfile] = useState(false);

  // Smart Reply States
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [detectedSentiment, setDetectedSentiment] = useState<string>("");
  const [fetchingSmartReplies, setFetchingSmartReplies] = useState<boolean>(false);
  const [smartRepliesExpanded, setSmartRepliesExpanded] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<any>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages when conversation changes
  useEffect(() => {
    const loadData = async () => {
      if (activeConvId) {
        await fetchMessages(activeConvId);
        // Scroll to bottom once on initial load
        setTimeout(scrollToBottom, 200);
        fetchSmartReplies(activeConvId);
        // Setup polling for live replies & list updates
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = setInterval(() => {
          fetchMessages(activeConvId, true);
          onRefresh();
        }, 3000);
      } else {
        setMessages([]);
        setSmartReplies([]);
        setDetectedSentiment("");
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = setInterval(() => {
          onRefresh();
        }, 3000);
      }
    };
    loadData();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [activeConvId]);

  // Fetch smart replies when a new customer message is detected
  useEffect(() => {
    if (!activeConvId || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.senderType === "customer") {
      fetchSmartReplies(activeConvId);
    }
  }, [messages.length]);

  // Auto-fill profile details when active conversation changes
  useEffect(() => {
    if (activeConv) {
      setCustomerName(activeConv.customerName);
      setCustomerPhone(activeConv.customerPhone || "");
      setCustomerEmail(activeConv.customerEmail || "");
      setCustomerLocation(activeConv.customerLocation || "");
      setCustomerNotes(activeConv.customerNotes || "");
      setEditingProfile(false);
    }
  }, [activeConvId, conversations]);

  const fetchMessages = async (convId: string, isSilent = false) => {
    if (!isSilent) setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error("Error fetching messages:", e);
    } finally {
      if (!isSilent) setLoadingMessages(false);
    }
  };

  const fetchSmartReplies = async (convId: string) => {
    setFetchingSmartReplies(true);
    try {
      const res = await fetch("/api/messages/smart-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId })
      });
      if (res.ok) {
        const data = await res.json();
        setSmartReplies(data.suggestions || []);
        setDetectedSentiment(data.sentiment || "Neutral");
      }
    } catch (e) {
      console.error("Error fetching smart replies:", e);
    } finally {
      setFetchingSmartReplies(false);
    }
  };

  // Handle agent typing reply
  const handleSendAgentReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    setSendingMessage(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          senderType: "human",
          senderName: "sabrina.yeasmin@gmail.com", // Simulated logged in agent
          text: inputText
        })
      });

      if (res.ok) {
        setInputText("");
        onRefresh(); // Refresh conversation list
        await fetchMessages(activeConvId); // Refresh message stream
        setTimeout(scrollToBottom, 100);
      }
    } catch (e) {
      console.error("Error sending reply:", e);
    } finally {
      setSendingMessage(false);
    }
  };

  // Toggle Auto-Pilot
  const handleToggleAutoPilot = async () => {
    if (!activeConvId || !activeConv) return;
    const nextStatus = activeConv.status === "auto_pilot" ? "open" : "auto_pilot";
    const updated = await onUpdateConvStatus(activeConvId, nextStatus, nextStatus === "open" ? "team-3" : undefined);
    if (updated) {
      onRefresh();
    }
  };

  // Resolve / Close Conversation
  const handleCloseConversation = async () => {
    if (!activeConvId) return;
    const nextStatus = "closed";
    const updated = await onUpdateConvStatus(activeConvId, nextStatus);
    if (updated) {
      setActiveConvId(null);
      onRefresh();
    }
  };

  // Reopen Conversation
  const handleReopenConversation = async (convId: string) => {
    const updated = await onUpdateConvStatus(convId, "auto_pilot");
    if (updated) {
      setActiveConvId(convId);
      onRefresh();
    }
  };

  // Update Customer Profile
  const handleSaveProfile = async () => {
    if (!activeConv) return;
    setSavingProfile(true);
    try {
      const res = await fetch(`/api/customers/${activeConv.customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          location: customerLocation,
          notes: customerNotes
        })
      });
      if (res.ok) {
        setEditingProfile(false);
        onRefresh(); // refresh the main conversation list to update joined names
      }
    } catch (e) {
      console.error("Failed to save profile:", e);
    } finally {
      setSavingProfile(false);
    }
  };

  // Add tag
  const handleAddTag = async () => {
    if (!activeConv || !newTag.trim()) return;
    const currentTags = activeConv.customerTags || [];
    if (currentTags.includes(newTag)) return;

    try {
      const res = await fetch(`/api/customers/${activeConv.customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tags: [...currentTags, newTag.trim()]
        })
      });
      if (res.ok) {
        setNewTag("");
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Remove tag
  const handleRemoveTag = async (tagToRemove: string) => {
    if (!activeConv) return;
    const currentTags = activeConv.customerTags || [];
    try {
      const res = await fetch(`/api/customers/${activeConv.customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tags: currentTags.filter(t => t !== tagToRemove)
        })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run simulated customer message to trigger Gemini response
  const handleSimulateCustomerMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simText.trim()) return;

    setSimulating(true);
    try {
      const res = await fetch("/api/messages/simulate-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: simChannel,
          customerName: simName,
          customerPhone: simPhone,
          text: simText
        })
      });

      if (res.ok) {
        const result = await res.json();
        setSimText("");
        onRefresh(); // Refresh to catch the new conversation/customer
        
        // Auto select this conversation in the inbox to watch!
        setActiveConvId(result.conversation.id);
        setStatusFilter("auto_pilot"); // switch to AI Pilot filter to see it
        
        // Hide simulator drawer
        setSimulatorOpen(false);
      }
    } catch (e) {
      console.error("Simulating message failed:", e);
    } finally {
      setSimulating(false);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = 
      !q ||
      (conv.customerName || '').toLowerCase().includes(q) ||
      (conv.lastMessageText || '').toLowerCase().includes(q) ||
      (conv.customerPhone && conv.customerPhone.toLowerCase().includes(q)) ||
      (conv.customerEmail && conv.customerEmail.toLowerCase().includes(q)) ||
      (conv.customerTags && conv.customerTags.some(t => t && t.toLowerCase().includes(q)));
    
    const matchesChannel = channelFilter === "all" || conv.channel === channelFilter;
    const matchesStatus = q !== "" ? true : (conv.status === statusFilter);

    return matchesSearch && matchesChannel && matchesStatus;
  });

  // Get active customer orders
  const activeCustomerOrders = activeConv 
    ? orders.filter(o => o.customerId === activeConv.customerId)
    : [];

  // Insert template message
  const handleInsertTemplate = (text: string) => {
    setInputText(text);
  };

  // Helper for displaying beautiful channel badges
  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>WhatsApp</span>;
      case "facebook":
        return <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Messenger</span>;
      case "instagram":
        return <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full border border-pink-100"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>Instagram</span>;
      case "webchat":
        return <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>Web Chat</span>;
      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-130px)] flex bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs relative">
      
      {/* 1. LEFT COLUMN: Conversation List & Queues */}
      <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50 h-full shrink-0 ${activeConvId ? "hidden md:flex" : "flex"}`}>
        {/* Inbox header */}
        <div className="p-4 bg-white border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
              Omnichannel Inbox
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Live</span>
            </h2>
            <button
              onClick={() => setSimulatorOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-md shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Simulator
            </button>
          </div>

          {/* Queues (Status filter) */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setStatusFilter("auto_pilot")}
              className={`py-1.5 rounded-md transition-colors ${statusFilter === "auto_pilot" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
            >
              AI Pilot
            </button>
            <button
              onClick={() => setStatusFilter("open")}
              className={`py-1.5 rounded-md transition-colors ${statusFilter === "open" ? "bg-white text-blue-600 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
            >
              Escalated
            </button>
            <button
              onClick={() => setStatusFilter("closed")}
              className={`py-1.5 rounded-md transition-colors ${statusFilter === "closed" ? "bg-white text-gray-700 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
            >
              Archived
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chat, customer, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Channel fast-switchers */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] font-medium text-gray-500 scrollbar-none">
            {["all", "whatsapp", "facebook", "instagram", "webchat"].map(ch => (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`px-2.5 py-1 rounded-md capitalize shrink-0 ${channelFilter === ch ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
              >
                {ch === "all" ? "All Channels" : ch}
              </button>
            ))}
          </div>
        </div>

        {/* List of active filtered conversations */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400 space-y-2 h-full">
              <Eye className="w-8 h-8 opacity-45" />
              <p className="text-xs font-medium">No conversations found</p>
              <p className="text-[10px]">Adjust filters or open the simulator to generate a test user message.</p>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isActive = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 cursor-pointer text-left transition-colors relative flex items-start gap-3 ${isActive ? "bg-indigo-50/40 border-l-4 border-indigo-600" : "hover:bg-gray-50"}`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {conv.customerAvatar ? (
                      <img src={conv.customerAvatar} alt={conv.customerName} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                    ) : (
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {(conv.customerName || "?").charAt(0)}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xs text-[10px]">
                      {conv.channel === "whatsapp" && "🟢"}
                      {conv.channel === "facebook" && "🔵"}
                      {conv.channel === "instagram" && "🟣"}
                      {conv.channel === "webchat" && "🌐"}
                    </span>
                  </div>

                  {/* Body info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-gray-900 truncate">{conv.customerName}</h4>
                      <span className="text-[9px] text-gray-400 font-medium">
                        {new Date(conv.lastMessageTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-gray-500 truncate font-normal leading-normal">
                      {conv.lastMessageText}
                    </p>

                    <div className="flex items-center justify-between pt-0.5">
                      {/* Active status tags */}
                      <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                        {conv.channel}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. CENTER COLUMN: Chat Interface */}
      <div className={`flex-1 min-w-0 flex flex-col bg-gray-50/50 h-full ${!activeConvId ? "hidden md:flex" : "flex"}`}>
        {activeConv ? (
          <>
            {/* Active chat header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3 text-left">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-800 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-50 active:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {activeConv.customerAvatar ? (
                  <img src={activeConv.customerAvatar} alt={activeConv.customerName} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                ) : (
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                    {(activeConv.customerName || "?").charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{activeConv.customerName}</h3>
                    {getChannelBadge(activeConv.channel)}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Session started: {new Date(activeConv.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Toggles and controls */}
              <div className="flex items-center gap-3">
                {/* Auto pilot toggle */}
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-xl">
                  <Sparkles className={`w-3.5 h-3.5 ${activeConv.status === "auto_pilot" ? "text-purple-600 fill-purple-100 animate-pulse" : "text-gray-400"}`} />
                  <span className="text-[11px] font-semibold text-gray-600">AI Auto-Pilot</span>
                  <button
                    onClick={handleToggleAutoPilot}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${activeConv.status === "auto_pilot" ? "bg-purple-600" : "bg-gray-300"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${activeConv.status === "auto_pilot" ? "translate-x-4.5" : "translate-x-1"}`} />
                  </button>
                </div>

                {/* Resolve conversation */}
                {activeConv.status !== "closed" && (
                  <button
                    onClick={handleCloseConversation}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Resolve
                  </button>
                )}

                {/* Profile Toggle button on mobile */}
                <button
                  onClick={() => setMobileShowProfile(!mobileShowProfile)}
                  className="md:hidden p-1.5 rounded-lg border transition-all flex items-center justify-center min-w-[32px] min-h-[32px] bg-gray-50 border-gray-100 text-gray-500 hover:text-gray-800"
                  title="Toggle Profile Info"
                >
                  <Info className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Message streams */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/50">
              
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              ) : (
                <>
                  <div className="text-center my-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      Beginning of conversation
                    </span>
                  </div>

                  {messages.map((msg) => {
                    const isCustomer = msg.senderType === "customer";
                    const isAi = msg.senderType === "ai";
                    const isSystemAlert = msg.text.startsWith("🎉 System:");

                    if (isSystemAlert) {
                      return (
                        <div key={msg.id} className="mx-auto max-w-sm p-3 bg-emerald-50/90 border border-emerald-100 rounded-xl text-left shadow-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                            <ShoppingBag className="w-4 h-4 text-emerald-600" />
                            <span>AI Order Draft Generated</span>
                          </div>
                          <p className="text-[11px] text-emerald-700 font-normal leading-relaxed">
                            {msg.text.replace("🎉 System: ", "")}
                          </p>
                          <p className="text-[9px] text-emerald-400 font-semibold uppercase">Pending approval inside Orders</p>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isCustomer ? "items-start text-left" : "items-end text-right"}`}
                      >
                        {/* Sender Label */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 px-1 mb-0.5">
                          <span>{msg.senderName}</span>
                          {isAi && (
                            <span className="bg-purple-100 text-purple-700 text-[8px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                              <Sparkles className="w-2 h-2" />
                              AI
                            </span>
                          )}
                          {!isCustomer && !isAi && (
                            <span className="bg-blue-100 text-blue-700 text-[8px] font-bold px-1.5 py-0.2 rounded-md">
                              AGENT
                            </span>
                          )}
                        </div>

                        {/* Content bubble */}
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs font-normal leading-relaxed shadow-2xs text-left break-words ${
                            isCustomer
                              ? "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                              : isAi
                              ? "bg-purple-600 text-white rounded-tr-none"
                              : "bg-blue-600 text-white rounded-tr-none"
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>

                        {/* Timestamp */}
                        <span className="text-[9px] text-gray-400 px-1 mt-0.5">
                          {new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        </span>
                      </div>
                    );
                  })}

                  {/* Simulated typing dot animation */}
                  {activeConv.status === "auto_pilot" && messages.length > 0 && messages[messages.length - 1].senderType === "customer" && (
                    <div className="flex flex-col items-start text-left">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 px-1 mb-0.5">
                        <span>{activeConv.customerName} AI Agent</span>
                        <span className="bg-purple-100 text-purple-700 text-[8px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                          <Sparkles className="w-2 h-2 animate-spin" />
                          Typing...
                        </span>
                      </div>
                      <div className="p-3 bg-white text-gray-400 rounded-2xl rounded-tl-none border border-gray-100 shadow-2xs flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Active chat input bar */}
            <div className="p-3 bg-white border-t border-gray-100 space-y-2">
              {/* Smart Replies section */}
              <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-xl p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div 
                    onClick={() => setSmartRepliesExpanded(!smartRepliesExpanded)}
                    className="flex items-center gap-2 cursor-pointer select-none group/title"
                  >
                    <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 uppercase tracking-wider group-hover/title:text-indigo-900 transition-colors">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                      Smart Replies {smartReplies.length > 0 && `(${smartReplies.length})`}
                      {smartRepliesExpanded ? (
                        <ChevronDown className="w-3 h-3 text-indigo-500 inline-block" />
                      ) : (
                        <ChevronUp className="w-3 h-3 text-indigo-500 inline-block" />
                      )}
                    </div>
                    {detectedSentiment && (
                      (() => {
                        const s = (detectedSentiment || '').trim().toLowerCase();
                        let colorClasses = "bg-slate-50 text-slate-700 border-slate-100";
                        if (s === "happy" || s === "excited") {
                          colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-100";
                        } else if (s === "angry" || s === "frustrated") {
                          colorClasses = "bg-rose-50 text-rose-700 border-rose-100";
                        } else if (s === "confused") {
                          colorClasses = "bg-amber-50 text-amber-700 border-amber-100";
                        } else if (s === "urgent") {
                          colorClasses = "bg-orange-50 text-orange-700 border-orange-100";
                        }
                        return (
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorClasses}`}>
                            <span className="w-1 h-1 rounded-full bg-current"></span>
                            Sentiment: {detectedSentiment}
                          </span>
                        );
                      })()
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchSmartReplies(activeConvId!);
                    }}
                    disabled={fetchingSmartReplies}
                    className="p-1 hover:bg-indigo-100/60 rounded-md text-indigo-600 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Regenerate smart replies"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${fetchingSmartReplies ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {smartRepliesExpanded && (
                  fetchingSmartReplies ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span className="text-[10px] font-medium text-gray-500 animate-pulse">Generating replies using Gemini...</span>
                    </div>
                  ) : smartReplies.length > 0 ? (
                    <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-2 pb-1 scrollbar-none snap-x snap-mandatory">
                      {smartReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleInsertTemplate(reply)}
                          className="snap-start shrink-0 w-[240px] sm:w-auto text-left text-[11px] p-2.5 bg-white hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 rounded-lg shadow-2xs hover:shadow-xs transition-all duration-200 text-gray-700 font-medium leading-relaxed cursor-pointer relative group flex flex-col justify-between"
                        >
                          <span className="line-clamp-2 sm:line-clamp-none">"{reply}"</span>
                          <span className="text-[8px] text-indigo-500 font-bold uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Use Reply</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-400 font-medium py-1">No customer message to draft replies for yet. Feel free to use quick templates or type a message.</div>
                  )
                )}
              </div>

              {/* Agent Quick replies list */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[10px] font-semibold text-gray-600 scrollbar-none">
                <span className="text-[9px] uppercase font-bold text-gray-400 mr-1">Templates:</span>
                <button
                  onClick={() => handleInsertTemplate("Assalamu Alaikum! How can I assist you with Aura Fashion collection today?")}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md whitespace-nowrap"
                >
                  Assalamu Alaikum
                </button>
                <button
                  onClick={() => handleInsertTemplate("Our size chart ranges from S (36) to XXL (44). All are standard sizes in inches.")}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md whitespace-nowrap"
                >
                  Size Chart Info
                </button>
                <button
                  onClick={() => handleInsertTemplate("Delivery charges: Dhaka 60 BDT (1-2 days), Outside Dhaka 120 BDT (3-5 days). Cash on delivery!")}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md whitespace-nowrap"
                >
                  Delivery Fees
                </button>
                <button
                  onClick={() => handleInsertTemplate("Please provide your delivery address and contact number so we can confirm your COD order.")}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md whitespace-nowrap"
                >
                  Ask Address & Phone
                </button>
              </div>

              {/* Chat Send Form */}
              <form onSubmit={handleSendAgentReply} className="flex gap-2">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    activeConv.status === "auto_pilot" 
                      ? "⚠️ AI is managing this. Typing a message will trigger Human takeover..." 
                      : "Type your reply to the customer..."
                  }
                  rows={1}
                  className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendAgentReply(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !inputText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs hover:shadow-md transition-all font-semibold text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {sendingMessage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Reply
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 space-y-4 h-full">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-xs">
              <MessageSquare className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Select a conversation</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Choose an active chat from the sidebar to view metrics, interact with the customer, or watch your AI bot converse.
              </p>
            </div>
            <button
              onClick={() => setSimulatorOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Open Customer Simulator
            </button>
          </div>
        )}
      </div>

      {/* 3. RIGHT COLUMN: Customer Profile CRM & Catalog Search */}
      {activeConv && (
        <div className={`
          fixed md:relative inset-y-0 right-0 z-30 md:z-auto
          w-full sm:w-80 md:w-80 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col bg-white overflow-y-auto divide-y divide-gray-100 h-full text-left
          transition-transform duration-300 md:translate-x-0 shrink-0
          ${mobileShowProfile ? "translate-x-0 shadow-2xl" : "translate-x-full md:translate-x-0 hidden md:flex"}
        `}>
          {/* Section 1: Customer info */}
          <div className="p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileShowProfile(false)}
                  className="md:hidden p-1 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg min-w-[32px] min-h-[32px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Customer Profile</h3>
              </div>
              <button
                onClick={() => {
                  if (editingProfile) handleSaveProfile();
                  else setEditingProfile(true);
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {editingProfile ? "Save Profile" : "Edit Profile"}
              </button>
            </div>

            {editingProfile ? (
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Email</label>
                  <input
                    type="text"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={customerLocation}
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Internal Notes</label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={2}
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-semibold text-gray-900">{activeConv.customerName}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{activeConv.customerPhone || "No phone added"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{activeConv.customerEmail || "No email added"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{activeConv.customerLocation || "No address added"}</span>
                </div>
                {activeConv.customerNotes && (
                  <div className="p-2.5 bg-yellow-50/50 border border-yellow-100 rounded-xl space-y-1">
                    <p className="text-[10px] uppercase font-bold text-yellow-800">Support Notes</p>
                    <p className="text-[11px] leading-relaxed text-yellow-900">{activeConv.customerNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Tags manager */}
          <div className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">CRM Tags</h3>
            <div className="flex flex-wrap gap-1">
              {(activeConv.customerTags || []).map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-indigo-100">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 font-bold ml-0.5">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5 mt-1">
              <input
                type="text"
                placeholder="New tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTag();
                }}
              />
              <button onClick={handleAddTag} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section 3: Orders generated */}
          <div className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              Customer Orders ({activeCustomerOrders.length})
            </h3>
            {activeCustomerOrders.length === 0 ? (
              <p className="text-[10px] text-gray-400">No orders created yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activeCustomerOrders.map(ord => (
                  <div key={ord.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">Order #{ord.id.split("-")[1] || "NEW"}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase ${
                        ord.status === "pending" ? "bg-amber-100 text-amber-800" :
                        ord.status === "shipped" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">
                      {ord.items.map(i => `${i.productName} (x${i.quantity})`).join(", ")}
                    </p>
                    <div className="flex items-center justify-between font-bold text-[11px] text-gray-900 mt-0.5">
                      <span>Total: {ord.totalAmount} BDT</span>
                      <span className="text-[9px] uppercase font-bold text-gray-400">{ord.paymentStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Product Catalog Finder */}
          <div className="p-4 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Product Catalog Finder</h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {products.map(prod => (
                <div key={prod.id} className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex gap-2 text-xs">
                  <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 truncate">{prod.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold">{prod.price} BDT (Stock: {prod.stock})</p>
                    <button
                      onClick={() => handleInsertTemplate(`Would you like to order our popular "${prod.name}" (Price: ${prod.price} BDT)? It's currently in stock!`)}
                      className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 mt-1 block"
                    >
                      + Insert pitch template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: Live Chat Customer Simulator Drawer */}
      {simulatorOpen && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                <h3 className="font-bold text-gray-900 text-base">Channel Chat Simulator</h3>
              </div>
              <button onClick={() => setSimulatorOpen(false)} className="text-gray-400 hover:text-gray-900 font-bold text-lg">×</button>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-2 text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="font-normal leading-normal">
                Use this sandbox to trigger realistic customer events (WhatsApp, Facebook Messenger, etc.). Type in Bangla or English, see how your Gemini AI agent answers, and see leads or orders getting auto-drafted!
              </p>
            </div>

            <form onSubmit={handleSimulateCustomerMessage} className="space-y-3.5 text-xs text-gray-800">
              {/* Simulator settings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Simulated Channel</label>
                  <select
                    value={simChannel}
                    onChange={(e) => setSimChannel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="whatsapp">WhatsApp Business</option>
                    <option value="facebook">Facebook Messenger</option>
                    <option value="instagram">Instagram DM</option>
                    <option value="webchat">Web Chat</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <span className="text-[10px] text-gray-400 font-semibold mb-1">Default language preference</span>
                  <div className="flex gap-2 p-1.5 bg-gray-100 rounded-lg">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-gray-800 rounded-md shadow-2xs">Bangla / English</span>
                  </div>
                </div>
              </div>

              {/* Message text */}
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Customer Message</label>
                <textarea
                  required
                  placeholder="Ask about silk kurti, sizes, delivery fees, or order placement in English or Bangla..."
                  value={simText}
                  onChange={(e) => setSimText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Suggestions */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400">Suggested test phrases:</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => setSimText("আপনাদের আউটলেট কোথায়? কয়টা পর্যন্ত খোলা থাকে?")}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-[10px]"
                  >
                    📍 শোরুম কোথায়?
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimText("Do you have Royal Cotton Panjabi in size 42? What is the price?")}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-[10px]"
                  >
                    👕 Sizing & Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimText("আমার নাম তৌসিফ, মেইল: tousif@outlook.com, ফোন: 01811223344, আমি ধানমন্ডি তে থাকি।")}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-[10px]"
                  >
                    📞 Capture Lead details
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimText("আমি Premium Silk Kurti একটা অর্ডার করব, কুরিয়ার চার্জ কত? আমার ডেলিভারি ঠিকানা চট্টগ্রাম।")}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-[10px]"
                  >
                    🛍️ Order & Shipment
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={simulating || !simText.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-55"
                >
                  {simulating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Simulate Incoming Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
