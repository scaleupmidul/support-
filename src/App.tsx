/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  BarChart3, MessageSquare, Users, ShoppingBag, BookOpen, 
  Link, Users2, Settings as SettingsIcon, LogOut, Menu, X, 
  Sparkles, RefreshCw, Smartphone, HelpCircle, Activity,
  Cpu, Bell, CreditCard, Shield, Database, Search, Building2,
  Moon, Sun
} from "lucide-react";

import Auth from "./components/Auth.js";
import Dashboard from "./components/Dashboard.js";
import Inbox from "./components/Inbox.js";
import CRM from "./components/CRM.js";
import Catalog from "./components/Catalog.js";
import KnowledgeBase from "./components/KnowledgeBase.js";
import Integrations from "./components/Integrations.js";
import Team from "./components/Team.js";
import SettingsView from "./components/Settings.js";

import Automation from "./components/Automation.js";
import NotificationsSettings from "./components/NotificationsSettings.js";
import Reports from "./components/Reports.js";
import Billing from "./components/Billing.js";
import Security from "./components/Security.js";
import Backup from "./components/Backup.js";
import GlobalSearch from "./components/GlobalSearch.js";
import PrivacyPolicy from "./components/PrivacyPolicy.js";

import { 
  Customer, Conversation, Message, Product, Order, Channel, FAQ, 
  KnowledgeArticle, AISettings, DashboardMetrics, AnalyticsTrend 
} from "./types.js";

import { 
  defaultCustomers, defaultConversations, defaultProducts, 
  defaultOrders, defaultChannels, defaultFaqs, defaultSettings, 
  defaultArticles, defaultMetrics, defaultTrends 
} from "./defaultData.js";

type TabType = 
  | "dashboard" | "inbox" | "crm" | "catalog" | "knowledge" | "integrations" | "team" | "settings"
  | "automation" | "notifications" | "reports" | "billing" | "security" | "backup" | "privacy";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Pre-logged in for rapid demo/testing
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== "undefined" && (window.location.pathname.includes("/privacy") || window.location.pathname.includes("/privacy-policy"))) {
      return "privacy";
    }
    return "dashboard";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default Obsidian Dark Studio Theme

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Core database state with rich defaults
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers);
  const [conversations, setConversations] = useState<any[]>(defaultConversations);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFaqs);
  const [settings, setSettings] = useState<AISettings | null>(defaultSettings);
  const [articles, setArticles] = useState<KnowledgeArticle[]>(defaultArticles);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(defaultMetrics);
  const [trends, setTrends] = useState<AnalyticsTrend[]>(defaultTrends);

  const [activeBusiness, setActiveBusiness] = useState<"aura" | "handicrafts">("aura");
  const [searchOpen, setSearchOpen] = useState(false);

  // Handicrafts static datasets (SaaS Multi Business profile #2)
  const handicraftsProducts: Product[] = [
    { id: "hc-p1", name: "Clay Terracotta Vase", price: 350, stock: 45, sku: "HC-01", image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500&auto=format&fit=crop&q=60", description: "Traditional organic clay vase handcrafted in Rajshahi." },
    { id: "hc-p2", name: "Wooden Folk Mask", price: 1200, stock: 15, sku: "HC-02", image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&auto=format&fit=crop&q=60", description: "Hand-carved and hand-painted protective folk mask." },
    { id: "hc-p3", name: "Copper Dinner Thali", price: 1800, stock: 22, sku: "HC-03", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60", description: "Pure heavy-gauge hammered copper traditional plate." }
  ];

  const handicraftsCustomers: Customer[] = [
    { id: "hc-c1", name: "Anisur Rahman", email: "anisur@gmail.com", phone: "+8801711122233", channel: "webchat", tags: ["Craft Lover"], location: "Rajshahi", language: "bn", createdAt: "2026-07-01", lastActive: "2026-07-13" },
    { id: "hc-c2", name: "Tasnim Sultana", email: "tasnim@gmail.com", phone: "+8801811122233", channel: "whatsapp", tags: ["VIP Buyer"], location: "Dhaka", language: "en", createdAt: "2026-07-05", lastActive: "2026-07-13" }
  ];

  const handicraftsConversations = [
    { id: "hc-conv1", customerId: "hc-c1", channel: "webchat", status: "auto_pilot", unreadCount: 0, lastMessageText: "Do you ship terracotta pots safely to Rajshahi?", lastMessageTime: "10 mins ago", createdAt: "2026-07-13" },
    { id: "hc-conv2", customerId: "hc-c2", channel: "whatsapp", status: "open", unreadCount: 1, lastMessageText: "I want to place an order for 2 wooden masks.", lastMessageTime: "2 mins ago", createdAt: "2026-07-13" }
  ];

  const handicraftsOrders: Order[] = [
    { id: "HC-ORD-101", customerId: "hc-c2", customerName: "Tasnim Sultana", items: [{ productId: "hc-p2", productName: "Wooden Folk Mask", quantity: 2, price: 1200 }], totalAmount: 2400, status: "pending", paymentStatus: "cod", createdAt: "2026-07-13" }
  ];

  const handicraftsSettings: AISettings = {
    personaName: "Bengal Handicrafts",
    tone: "friendly",
    primaryLanguage: "both",
    greetingMessage: "Namaskar! Welcome to Bengal Handicrafts. How can we assist you with our terracotta pots, wooden toys, or copper utensils today?",
    humanEscalationTrigger: "agent, human, custom, representative",
    leadCollectionEnabled: true,
    orderGenerationEnabled: true,
    businessName: "Bengal Handicrafts",
    aiTone: "friendly",
    welcomeMessage: "Namaskar! Welcome to Bengal Handicrafts. How can we assist you with our terracotta pots, wooden toys, or copper utensils today?"
  };

  const handicraftsMetrics: DashboardMetrics = {
    totalConversations: 84,
    activeChats: 3,
    aiResolutionRate: 68,
    avgResponseTime: 5,
    leadConversionRate: 14,
    revenueGenerated: 34200
  };

  const handicraftsTrends: AnalyticsTrend[] = [
    { date: "2026-07-10", totalConversations: 12, aiResolved: 8, humanHandled: 4, leadsCollected: 2, revenue: 4500 },
    { date: "2026-07-11", totalConversations: 18, aiResolved: 12, humanHandled: 6, leadsCollected: 3, revenue: 6800 },
    { date: "2026-07-12", totalConversations: 24, aiResolved: 16, humanHandled: 8, leadsCollected: 4, revenue: 8900 },
    { date: "2026-07-13", totalConversations: 30, aiResolved: 21, humanHandled: 9, leadsCollected: 5, revenue: 14000 }
  ];

  // Intercept variables depending on active workspace selection
  const displayProducts = activeBusiness === "handicrafts" ? handicraftsProducts : products;
  const displayCustomers = activeBusiness === "handicrafts" ? handicraftsCustomers : customers;
  const displayConversations = activeBusiness === "handicrafts" ? handicraftsConversations : conversations;
  const displayOrders = activeBusiness === "handicrafts" ? handicraftsOrders : orders;
  const displaySettings = activeBusiness === "handicrafts" ? handicraftsSettings : settings;
  const displayMetrics = activeBusiness === "handicrafts" ? handicraftsMetrics : metrics;
  const displayTrends = activeBusiness === "handicrafts" ? handicraftsTrends : trends;

  // UI state
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Safe JSON parser helper
  const safeJsonFetch = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  // Fetch all database records
  const fetchAllData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setSyncing(true);

    try {
      const [
        customersData, conversationsData, productsData, 
        ordersData, channelsData, faqsData, settingsData,
        articlesData, metricsData, trendsData
      ] = await Promise.all([
        safeJsonFetch("/api/customers"),
        safeJsonFetch("/api/conversations"),
        safeJsonFetch("/api/products"),
        safeJsonFetch("/api/orders"),
        safeJsonFetch("/api/channels"),
        safeJsonFetch("/api/faqs"),
        safeJsonFetch("/api/settings"),
        safeJsonFetch("/api/knowledge"),
        safeJsonFetch("/api/analytics/metrics"),
        safeJsonFetch("/api/analytics/trends")
      ]);

      if (customersData) setCustomers(customersData);
      if (conversationsData) setConversations(conversationsData);
      if (productsData) setProducts(productsData);
      if (ordersData) setOrders(ordersData);
      if (channelsData) setChannels(channelsData);
      if (faqsData) setFaqs(faqsData);
      if (settingsData) setSettings(settingsData);
      if (articlesData) setArticles(articlesData);
      if (metricsData) setMetrics(metricsData);
      if (trendsData) setTrends(trendsData);
    } catch (e) {
      console.error("Failed to synchronize support records:", e);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn]);

  // MUTATION: Update Conversation Status
  const handleUpdateConvStatus = async (id: string, status: Conversation["status"], assignedTo?: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, assignedTo })
      });
      if (res.ok) {
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Add Manual CRM Customer
  const handleAddCustomer = async (cust: Omit<Customer, "id" | "createdAt" | "lastActive">) => {
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cust)
      });
      if (res.ok) {
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Delete Single Customer
  const handleDeleteCustomer = async (id: string) => {
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setCustomers(prev => prev.filter(c => c.id !== id));
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Clear All Customers (Permanent Delete)
  const handleClearAllCustomers = async () => {
    try {
      const res = await fetch("/api/customers", {
        method: "DELETE"
      });
      if (res.ok) {
        setCustomers([]);
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Add E-Commerce Product
  const handleAddProduct = async (prod: Omit<Product, "id">) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod)
      });
      if (res.ok) {
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Update Order Status
  const handleUpdateOrderStatus = async (id: string, status: Order["status"], paymentStatus?: Order["paymentStatus"]) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus })
      });
      if (res.ok) {
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Add Knowledge Article
  const handleAddArticle = async (art: Omit<KnowledgeArticle, "id" | "updatedAt">) => {
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(art)
      });
      if (res.ok) {
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Delete Knowledge Article
  const handleDeleteArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Add FAQ
  const handleAddFAQ = async (faq: Omit<FAQ, "id" | "updatedAt">) => {
    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faq)
      });
      if (res.ok) {
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Delete FAQ
  const handleDeleteFAQ = async (id: string) => {
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Toggle channel connection status
  const handleToggleChannel = async (id: string, status: Channel["status"]) => {
    try {
      const res = await fetch(`/api/channels/${id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // MUTATION: Update general support settings
  const handleUpdateSettings = async (nextSettings: Partial<AISettings>) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextSettings)
      });
      if (res.ok) {
        await fetchAllData(true);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Render auth view if logged out
  if (!isLoggedIn) {
    return <Auth onLogin={() => setIsLoggedIn(true)} />;
  }

  // Render full page loader
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <Sparkles className="w-5 h-5 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-xs font-bold text-gray-950 uppercase tracking-widest">SmartSupport AI</p>
          <p className="text-[11px] text-gray-400 font-semibold">Synchronizing secure boutique parameters...</p>
        </div>
      </div>
    );
  }

  // Sidebar list of tab elements
  const sidebarTabs = [
    { id: "dashboard", label: "KPI Dashboard", icon: BarChart3 },
    { id: "inbox", label: "Omnichannel Inbox", icon: MessageSquare, badge: displayConversations.filter(c => c.unreadCount > 0).length || undefined },
    { id: "crm", label: "CRM Customers", icon: Users },
    { id: "catalog", label: "Products & Orders", icon: ShoppingBag, badge: displayOrders.filter(o => o.status === "pending").length || undefined },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { id: "automation", label: "AI Automation", icon: Cpu },
    { id: "notifications", label: "Alert Config", icon: Bell },
    { id: "reports", label: "Reports Centre", icon: BarChart3 },
    { id: "integrations", label: "Integrations", icon: Link },
    { id: "team", label: "Support Team", icon: Users2 },
    { id: "billing", label: "SaaS Billing", icon: CreditCard },
    { id: "security", label: "Security Logs", icon: Shield },
    { id: "backup", label: "Backup & Recovery", icon: Database },
    { id: "privacy", label: "Privacy Policy", icon: Shield },
    { id: "settings", label: "System Settings", icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col font-sans text-gray-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. TOP HEADER: Mobile Navigation Bar */}
      <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold shadow-sm">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-tight text-gray-900">{activeBusiness === "handicrafts" ? "Bengal Handicrafts" : (settings?.personaName || "Aura Boutique")}</h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">AI Support Suite</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {syncing && <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Obsidian Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        
        {/* 2. SIDEBAR NAVIGATION PANEL (Desktop & Mobile Drawer) */}
        <aside className={`
          fixed lg:sticky top-0 bottom-0 left-0 z-40 
          w-64 bg-white border-r border-gray-100 p-5 flex flex-col justify-between 
          transition-transform lg:translate-x-0 h-screen shrink-0
          ${mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="space-y-6">
            {/* Desktop Brand Header */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-indigo-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-bold tracking-tight text-gray-900 truncate max-w-[150px]">
                  {activeBusiness === "handicrafts" ? "Bengal Handicrafts" : (settings?.personaName || "Aura Boutique")}
                </h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gemini Pro Agent</p>
                </div>
              </div>
            </div>

            {/* Active Workspace Switcher */}
            <div className="space-y-1 text-left">
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-gray-400" /> Active Workspace
              </label>
              <div className="relative">
                <select
                  value={activeBusiness}
                  onChange={(e) => setActiveBusiness(e.target.value as any)}
                  className="w-full pl-3 pr-8 py-2 text-xs bg-gray-50 hover:bg-gray-100/70 border border-gray-200/80 rounded-xl focus:outline-none font-bold text-gray-800 transition-all cursor-pointer appearance-none"
                >
                  <option value="aura">✨ Aura Boutique BD</option>
                  <option value="handicrafts">🏺 Bengal Handicrafts</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 font-bold">
                  ▾
                </div>
              </div>
            </div>

            {/* Global Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100/60 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-all text-left"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span>Search workspace...</span>
            </button>

            {/* Sidebar Tabs List */}
            <nav className="space-y-1.5 text-left">
              {sidebarTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all
                      ${isActive 
                        ? "bg-indigo-50 text-indigo-700 shadow-3xs" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/55"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className="bg-indigo-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer details */}
          <div className="space-y-4 pt-4 border-t border-gray-50 text-left">
            {/* Active user info */}
            <div className="flex items-center gap-2.5 p-1">
              <div className="w-8 h-8 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                SY
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-gray-900 truncate">Sabrina Yeasmin</p>
                <p className="text-[9px] text-gray-400 truncate">sabrina.yeasmin@gmail.com</p>
              </div>
            </div>

            {/* Obsidian Dark Mode Toggle */}
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {isDarkMode ? "Obsidian Dark" : "Light Mode"}
                </span>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isDarkMode ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isDarkMode ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Syncing status */}
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold px-1">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-green-500" /> Webhook Listener Live
              </span>
              <button 
                onClick={() => fetchAllData(true)} 
                disabled={syncing}
                className="hover:text-gray-900 transition-colors"
                title="Synchronize Database"
              >
                <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin text-indigo-600" : ""}`} />
              </button>
            </div>

            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full px-3 py-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border border-gray-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Portal</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/35 z-30 lg:hidden"
          />
        )}

        {/* 3. MAIN CONTENT CONTAINER PANEL */}
        <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-24 md:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden space-y-6">
          
          {/* TAB ROUTER */}
          {activeTab === "dashboard" && (
            <Dashboard 
              metrics={displayMetrics}
              trends={displayTrends}
              onRefresh={() => fetchAllData(true)}
              onNavigate={(tab) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === "inbox" && (
            <Inbox 
              conversations={displayConversations} 
              products={displayProducts} 
              orders={displayOrders} 
              onRefresh={() => fetchAllData(true)} 
              onUpdateConvStatus={handleUpdateConvStatus} 
            />
          )}

          {activeTab === "crm" && (
            <CRM 
              customers={displayCustomers} 
              onAddCustomer={handleAddCustomer} 
              onDeleteCustomer={handleDeleteCustomer}
              onClearAllCustomers={handleClearAllCustomers}
            />
          )}

          {activeTab === "catalog" && (
            <Catalog 
              products={displayProducts} 
              orders={displayOrders} 
              onAddProduct={handleAddProduct} 
              onUpdateOrderStatus={handleUpdateOrderStatus} 
            />
          )}

          {activeTab === "knowledge" && (
            <KnowledgeBase 
              articles={articles} 
              faqs={faqs} 
              onAddArticle={handleAddArticle} 
              onDeleteArticle={handleDeleteArticle} 
              onAddFAQ={handleAddFAQ} 
              onDeleteFAQ={handleDeleteFAQ} 
            />
          )}

          {activeTab === "automation" && (
            <Automation />
          )}

          {activeTab === "notifications" && (
            <NotificationsSettings />
          )}

          {activeTab === "reports" && (
            <Reports />
          )}

          {activeTab === "integrations" && (
            <Integrations 
              channels={channels} 
              onToggleChannel={handleToggleChannel} 
            />
          )}

          {activeTab === "team" && (
            <Team />
          )}

          {activeTab === "billing" && (
            <Billing />
          )}

          {activeTab === "security" && (
            <Security />
          )}

          {activeTab === "backup" && (
            <Backup />
          )}

          {activeTab === "privacy" && (
            <PrivacyPolicy />
          )}

          {activeTab === "settings" && displaySettings && (
            <SettingsView 
              settings={displaySettings} 
              onUpdateSettings={handleUpdateSettings} 
            />
          )}

        </main>

      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 h-16 flex items-center justify-around z-40 px-2 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "inbox", label: "Inbox", icon: MessageSquare, badge: displayConversations.filter(c => c.unreadCount > 0).length || undefined },
          { id: "crm", label: "CRM", icon: Users },
          { id: "catalog", label: "Catalog", icon: ShoppingBag, badge: displayOrders.filter(o => o.status === "pending").length || undefined },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[48px] min-h-[48px] relative transition-colors ${
                isActive ? "text-indigo-600 font-semibold" : "text-gray-400 hover:text-gray-600 font-medium"
              }`}
              style={{ minWidth: "48px", minHeight: "48px" }}
            >
              <div className="relative p-1">
                <Icon className="w-5.5 h-5.5" />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2.5 bg-red-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full min-w-[14px] text-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
        
        {/* "More" Trigger for mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-[48px] min-h-[48px] relative transition-colors ${
            mobileMenuOpen ? "text-indigo-600 font-semibold" : "text-gray-400 hover:text-gray-600 font-medium"
          }`}
          style={{ minWidth: "48px", minHeight: "48px" }}
        >
          <div className="relative p-1">
            <Menu className="w-5.5 h-5.5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </div>

      {/* Global Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/55 flex items-start justify-center z-50 p-4 pt-20 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <GlobalSearch 
              customers={displayCustomers} 
              conversations={displayConversations} 
              products={displayProducts} 
              orders={displayOrders} 
              onNavigate={(tab, itemId) => {
                setActiveTab(tab as any);
                setSearchOpen(false);
              }}
              onClose={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
