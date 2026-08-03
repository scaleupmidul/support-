/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Role {
  SUPER_ADMIN = "super_admin",
  BUSINESS_OWNER = "business_owner",
  MANAGER = "manager",
  AGENT = "agent",
  VIEWER = "viewer"
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  businessId: string;
}

export interface Business {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  website?: string;
  currency: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "invited";
  joinedAt: string;
}

export interface Channel {
  id: string; // "whatsapp" | "facebook" | "instagram" | "webchat"
  name: string;
  type: "whatsapp" | "facebook" | "instagram" | "webchat";
  status: "connected" | "disconnected";
  connectedAt?: string;
  config: {
    phoneNumber?: string;
    pageName?: string;
    pageId?: string;
    instagramUsername?: string;
    webhookSecret?: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  channel: "whatsapp" | "facebook" | "instagram" | "webchat";
  tags: string[];
  location?: string;
  language: "en" | "bn";
  notes?: string;
  createdAt: string;
  lastActive: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  channel: "whatsapp" | "facebook" | "instagram" | "webchat";
  status: "auto_pilot" | "open" | "closed"; // "auto_pilot" means AI replies. "open" means human takeover. "closed" means archived.
  assignedTo?: string; // TeamMember ID
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: "customer" | "ai" | "human";
  senderName: string;
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  image: string;
  description: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "cod";
  createdAt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  status: "published" | "draft";
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  updatedAt: string;
}

export interface AISettings {
  personaName: string;
  tone: "professional" | "friendly" | "helpful" | "enthusiastic" | "empathetic";
  primaryLanguage: "en" | "bn" | "both";
  greetingMessage: string;
  humanEscalationTrigger: string;
  leadCollectionEnabled: boolean;
  orderGenerationEnabled: boolean;
  businessName?: string;
  aiTone?: string;
  welcomeMessage?: string;
  escalationRules?: string;
}

export interface Subscription {
  plan: "free" | "pro" | "enterprise";
  status: "active" | "trial" | "past_due";
  price: number;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: string;
}

export interface DashboardMetrics {
  totalConversations: number;
  activeChats: number;
  aiResolutionRate: number; // percentage
  avgResponseTime: number; // seconds
  leadConversionRate: number; // percentage
  revenueGenerated: number;
}

export interface AnalyticsTrend {
  date: string;
  totalConversations: number;
  aiResolved: number;
  humanHandled: number;
  leadsCollected: number;
  revenue: number;
}
