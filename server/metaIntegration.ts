/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from "./db.js";
import { Server } from "socket.io";

// Real-time developer logs and architecture tracker
export interface WebhookLog {
  id: string;
  timestamp: string;
  platform: "facebook" | "instagram" | "whatsapp";
  eventType: "message" | "delivery" | "read" | "reaction" | "postback" | "referral" | "message_echo";
  status: "received" | "queued" | "processing" | "completed" | "failed" | "duplicate_ignored";
  payload: any;
  steps: { name: string; timestamp: string; status: "success" | "pending" | "fail" }[];
}

export interface MetaState {
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
  failoverEnabled: boolean; // Simulates AI engine failure to trigger fallback
  rateLimitPerMin: number; // Prevent spam: max messages per minute per user
  rateLimitWarnings: { [userId: string]: number };
}

// In-Memory state for Meta Sandbox Simulation
export const metaState: MetaState = {
  facebookPages: [
    {
      pageId: "10984752839485",
      name: "Aura Boutique BD",
      category: "Fashion & Clothing",
      likes: 124500,
      status: "connected",
      lastSynced: new Date().toISOString(),
      tokenStatus: "valid",
      accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN_1 || process.env.FACEBOOK_PAGE_ACCESS_TOKEN || "EAABz9x8P7q2... (Permanent Token)",
      webhookVerifyToken: process.env.META_VERIFY_TOKEN_1 || process.env.META_VERIFY_TOKEN || "aura_webhook_verify_secret_2026"
    },
    {
      pageId: "20947293847291",
      name: "Aura Men Dhaka",
      category: "Men's Clothing Store",
      likes: 18400,
      status: (process.env.FACEBOOK_PAGE_ACCESS_TOKEN_2 || process.env.FACEBOOK_PAGE_ACCESS_TOKEN) ? "connected" : "disconnected",
      lastSynced: new Date().toISOString(),
      tokenStatus: "valid",
      accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN_2 || process.env.FACEBOOK_PAGE_ACCESS_TOKEN || "EAABz1a2B3c4... (Page Token)",
      webhookVerifyToken: process.env.META_VERIFY_TOKEN_2 || process.env.META_VERIFY_TOKEN || "aura_webhook_verify_secret_2026"
    }
  ],
  instagramAccount: {
    username: "@auraboutique.bd",
    status: "connected",
    lastSynced: new Date().toISOString(),
    businessId: "inst_biz_992381",
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || "EAAB_mock_instagram_access_token_v18",
    webhookVerifyToken: process.env.META_VERIFY_TOKEN || "aura_webhook_verify_secret_2026"
  },
  whatsappAccount: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "wa_phone_id_88291",
    wabaId: process.env.WHATSAPP_WABA_ID || "waba_id_1029318",
    phoneNumber: "+8801712345678",
    verificationStatus: "verified",
    status: "connected",
    accessToken: process.env.WHATSAPP_SYSTEM_USER_ACCESS_TOKEN || "EAAB_mock_whatsapp_system_user_token_v18",
    webhookVerifyToken: process.env.META_VERIFY_TOKEN || "aura_webhook_verify_secret_2026"
  },
  failoverEnabled: false,
  rateLimitPerMin: 10,
  rateLimitWarnings: {}
};

// Global Logs Storage for Dashboard Developer Console
export const webhookLogs: WebhookLog[] = [];

// Socket.io Server Holder
let io: Server | null = null;
export function setIoInstance(socketIo: Server) {
  io = socketIo;
}

// Rate Limiting System (Track rate limit dynamically to prevent abuse)
const userMessageRateTracker: { [userId: string]: { timestamps: number[] } } = {};
export function checkRateLimit(customerId: string): boolean {
  const limit = metaState.rateLimitPerMin;
  const now = Date.now();
  if (!userMessageRateTracker[customerId]) {
    userMessageRateTracker[customerId] = { timestamps: [now] };
    return true;
  }

  // Filter out timestamps older than 60 seconds
  userMessageRateTracker[customerId].timestamps = userMessageRateTracker[customerId].timestamps.filter(
    t => now - t < 60000
  );

  if (userMessageRateTracker[customerId].timestamps.length >= limit) {
    metaState.rateLimitWarnings[customerId] = (metaState.rateLimitWarnings[customerId] || 0) + 1;
    return false; // Rate limit exceeded!
  }

  userMessageRateTracker[customerId].timestamps.push(now);
  return true;
}

// Asynchronous Redis-like Queue implementation to handle webhooks and avoid duplicates / message loss
export class RedisQueue {
  private static queue: { logId: string; payload: any; callback: () => Promise<void> }[] = [];
  private static processedMessageIds = new Set<string>(); // Prevent duplicates (idempotency checking)
  private static isProcessing = false;

  static async enqueue(messageId: string, logId: string, payload: any, callback: () => Promise<void>): Promise<boolean> {
    // Deduplication check
    if (this.processedMessageIds.has(messageId)) {
      console.log(`[DEDUPLICATION] Message ${messageId} already processed. Avoiding duplicates.`);
      const log = webhookLogs.find(l => l.id === logId);
      if (log) {
        log.status = "duplicate_ignored";
        log.steps.push({ name: "Redis Queue Deduplication Check", timestamp: new Date().toISOString(), status: "fail" });
        if (io) io.emit("webhook:log:update", log);
      }
      return false;
    }

    this.processedMessageIds.add(messageId);
    this.queue.push({ logId, payload, callback });
    
    const log = webhookLogs.find(l => l.id === logId);
    if (log) {
      log.status = "queued";
      log.steps.push({ name: "Enqueued in Redis Queue", timestamp: new Date().toISOString(), status: "success" });
      if (io) {
        io.emit("webhook:log:update", log);
        io.emit("queue:status", { length: this.queue.length, status: "queued", logId });
      }
    }

    // Start processing if idle
    if (!this.isProcessing) {
      this.processNext();
    }
    return true;
  }

  private static async processNext() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      if (io) io.emit("queue:status", { length: 0, status: "idle" });
      return;
    }

    this.isProcessing = true;
    const item = this.queue.shift()!;
    const log = webhookLogs.find(l => l.id === item.logId);

    if (log) {
      log.status = "processing";
      log.steps.push({ name: "Queue Worker Processing Start", timestamp: new Date().toISOString(), status: "success" });
      if (io) {
        io.emit("webhook:log:update", log);
        io.emit("queue:status", { length: this.queue.length, status: "processing", logId: item.logId });
      }
    }

    try {
      // Execute the message parser asynchronously
      await item.callback();
      
      if (log) {
        log.status = "completed";
        log.steps.push({ name: "Processed and Saved in Database", timestamp: new Date().toISOString(), status: "success" });
        if (io) io.emit("webhook:log:update", log);
      }
    } catch (e) {
      console.error("[QUEUE WORKER ERROR]:", e);
      if (log) {
        log.status = "failed";
        log.steps.push({ name: "Queue Worker Failed", timestamp: new Date().toISOString(), status: "fail" });
        if (io) io.emit("webhook:log:update", log);
      }
    }

    // Simulate network processing delay (e.g. 800ms)
    setTimeout(() => {
      this.processNext();
    }, 800);
  }

  static getQueueLength() {
    return this.queue.length;
  }
}

// Global webhook trigger receiver which simulates the full meta pipeline
export async function triggerInboundMetaWebhook(params: {
  platform: "facebook" | "instagram" | "whatsapp";
  eventType: "message" | "delivery" | "read" | "reaction" | "postback" | "referral" | "message_echo";
  customerName: string;
  customerPhone?: string;
  text?: string;
  attachmentUrl?: string;
  attachmentType?: "image" | "file" | "audio" | "video";
  messageId?: string;
  recipientId?: string;
}) {
  const logId = "log_" + Math.random().toString(36).substr(2, 9);
  const mId = params.messageId || "mid_" + Math.random().toString(36).substr(2, 12);
  
  // 1. Initialize Log Item
  const newLog: WebhookLog = {
    id: logId,
    timestamp: new Date().toISOString(),
    platform: params.platform,
    eventType: params.eventType,
    status: "received",
    payload: { ...params, messageId: mId },
    steps: [
      { name: "Meta Ingress Handshake", timestamp: new Date().toISOString(), status: "success" }
    ]
  };

  webhookLogs.unshift(newLog);
  if (webhookLogs.length > 50) webhookLogs.pop(); // Cap logs size
  if (io) io.emit("webhook:log:new", newLog);

  // Check Rate Limits first before entering queue
  // Find customer to check
  const customers = db.getCustomers();
  let customer = customers.find(c => c.name.toLowerCase() === params.customerName.toLowerCase() && c.channel === params.platform);
  const checkId = customer ? customer.id : "new_" + params.customerName;
  
  if (!checkRateLimit(checkId)) {
    newLog.status = "failed";
    newLog.steps.push({ name: "Anti-Spam Rate Limit Guard", timestamp: new Date().toISOString(), status: "fail" });
    if (io) {
      io.emit("webhook:log:update", newLog);
      io.emit("app:alert", { type: "rate_limit", message: `Anti-spam triggered for ${params.customerName} on ${params.platform}. Limit is ${metaState.rateLimitPerMin} msg/min.` });
    }
    return { success: false, error: "Rate limit exceeded" };
  }

  // 2. Queue the item asynchronously in our Redis Message Queue simulator
  const enqueued = await RedisQueue.enqueue(mId, logId, params, async () => {
    // Execute queue item process
    const customersList = db.getCustomers();
    const rawId = params.customerPhone ? params.customerPhone.replace(/^ID:\s*/, '').trim() : '';

    let currentCustomer = customersList.find(c => 
      (rawId && c.phone && c.phone.includes(rawId)) ||
      (rawId && c.notes && c.notes.includes(rawId)) ||
      (c.name.toLowerCase() === params.customerName.toLowerCase() && c.channel === params.platform)
    );
    
    // Fetch real profile from Meta Graph API if available for Facebook / Instagram
    let resolvedName = params.customerName;
    let avatarUrl: string | undefined;

    if (rawId && params.platform === "facebook") {
      const metaProfile = await fetchMetaUserProfile(rawId);
      if (metaProfile?.name) {
        resolvedName = metaProfile.name;
        avatarUrl = metaProfile.avatar;
      }
    }

    // Create customer if not exists
    if (!currentCustomer) {
      currentCustomer = db.addCustomer({
        name: resolvedName,
        phone: params.customerPhone || `ID: ${rawId}`,
        channel: params.platform,
        tags: ["Inbound_Lead", "Meta"],
        location: params.platform === "whatsapp" ? "Dhaka" : "Unmapped Profile",
        language: "en",
        avatar: avatarUrl,
        notes: `Profile imported automatically from ${params.platform} Webhook Ingress. Meta PSID: ${rawId}`
      });
      newLog.steps.push({ name: `Customer CRM Record Created (${resolvedName})`, timestamp: new Date().toISOString(), status: "success" });
    } else if (currentCustomer.name.startsWith("Meta User") && resolvedName && !resolvedName.startsWith("Meta User")) {
      // Upgrade generic customer name with real Facebook name
      db.updateCustomer(currentCustomer.id, { name: resolvedName, avatar: avatarUrl || currentCustomer.avatar });
      currentCustomer.name = resolvedName;
    }

    // Get or Create Conversation
    const conversations = db.getConversations();
    let conv = conversations.find(c => c.customerId === currentCustomer!.id);
    if (!conv) {
      conv = db.createConversation(currentCustomer.id, params.platform);
      newLog.steps.push({ name: "Support Conversation Created", timestamp: new Date().toISOString(), status: "success" });
    }

    // Handle reaction, delivery, read webhooks separately
    if (params.eventType === "delivery" || params.eventType === "read") {
      // Mark seen or updated
      newLog.steps.push({ name: `Processed status webhook: ${params.eventType}`, timestamp: new Date().toISOString(), status: "success" });
      if (io) io.emit("conversation:status:update", { conversationId: conv.id, status: params.eventType });
      return;
    }

    if (params.eventType === "reaction") {
      newLog.steps.push({ name: "Processed reaction webhook", timestamp: new Date().toISOString(), status: "success" });
      if (io) io.emit("conversation:reaction", { conversationId: conv.id, reaction: "❤️" });
      return;
    }

    if (params.eventType === "message_echo") {
      newLog.steps.push({ name: "Processed message_echo webhook", timestamp: new Date().toISOString(), status: "success" });
      return;
    }

    // Handle incoming messages
    let msgText = params.text || "";
    if (params.attachmentUrl) {
      const typeStr = params.attachmentType ? params.attachmentType.toUpperCase() : "FILE";
      msgText += `\n📎 [Attachment: ${typeStr}] (${params.attachmentUrl})`;
    }

    // Save Customer Message
    const userMsg = db.addMessage({
      conversationId: conv.id,
      senderType: "customer",
      senderName: currentCustomer.name,
      text: msgText
    });

    if (io) io.emit("message:new", { conversationId: conv.id, message: userMsg });

    newLog.steps.push({ name: "Message Persisted to Database", timestamp: new Date().toISOString(), status: "success" });

    // 3. AI Trigger Phase
    if (conv.status === "auto_pilot") {
      newLog.steps.push({ name: "AI Auto-pilot Active", timestamp: new Date().toISOString(), status: "success" });
      
      // Handle AI Failover System Simulation
      if (metaState.failoverEnabled) {
        // AI Failure triggered! Fallback response system
        const config = db.getSettings();
        const fallbackText = "🤖 Failover Guard: We are experiencing unusually high volumes. An agent is reviewing your message immediately!";
        
        const systemMsg = db.addMessage({
          conversationId: conv.id,
          senderType: "ai",
          senderName: config.personaName || "Fallback Aura",
          text: fallbackText
        });

        // Mark conversation open and alert admin logs
        db.updateConversationStatus(conv.id, "open", "team-2");

        newLog.steps.push({ name: "AI Engine Failed (Failover Triggered)", timestamp: new Date().toISOString(), status: "fail" });
        newLog.steps.push({ name: "Failover Fallback Message Dispatched", timestamp: new Date().toISOString(), status: "success" });

        if (io) {
          io.emit("message:new", { conversationId: conv.id, message: systemMsg });
          io.emit("app:alert", { type: "failover", message: `AI Process Failover for ${currentCustomer.name}. System returned safe fallback.` });
        }
        return;
      }

      // Safe asynchronous AI reply call
      newLog.steps.push({ name: "Consulting Gemini Pro API", timestamp: new Date().toISOString(), status: "success" });
      
      // We will trigger a simulated AI reply that eventually posts back
      setTimeout(async () => {
        try {
          // Trigger the standard AI trigger function in server.ts
          // To support both environments, we'll hit our own API or execute the trigger function
          await triggerExternalAIResponse(conv!.id, newLog, currentCustomer!.name);
        } catch (e) {
          console.error("Delayed AI execution failover:", e);
        }
      }, 1000);
    } else {
      newLog.steps.push({ name: "AI Autopilot Paused (Human Takeover)", timestamp: new Date().toISOString(), status: "success" });
    }
  });

  return { success: enqueued, logId };
}

// AI Response Trigger Handler Holder
let aiTriggerHandler: ((conversationId: string) => Promise<void>) | null = null;
export function setAiTriggerHandler(handler: (conversationId: string) => Promise<void>) {
  aiTriggerHandler = handler;
}

// Fetch real Facebook user profile (Name & Avatar) from Meta Graph API using PSID
export async function fetchMetaUserProfile(senderId: string, accessToken?: string): Promise<{ name?: string; avatar?: string } | null> {
  const token = accessToken || metaState.facebookPages[0]?.accessToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!token || token.startsWith("EAAB_mock")) {
    return null;
  }
  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${senderId}?fields=name,first_name,last_name,profile_pic&access_token=${encodeURIComponent(token)}`);
    if (res.ok) {
      const data = await res.json();
      const fullName = data.name || (data.first_name ? `${data.first_name} ${data.last_name || ""}`.trim() : undefined);
      return {
        name: fullName,
        avatar: data.profile_pic
      };
    }
  } catch (err) {
    console.error("[META GRAPH API] Error fetching user profile:", err);
  }
  return null;
}

// Send outgoing reply to Meta Graph API (Facebook Messenger or WhatsApp)
export async function sendMetaOutgoingMessage(platform: string, recipientId: string, text: string, pageToken?: string) {
  const token = pageToken || metaState.facebookPages[0]?.accessToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  console.log(`[META OUTGOING] Attempting to send reply to ${platform} recipient ${recipientId}...`);

  if (!recipientId || recipientId.startsWith("sim_") || recipientId.startsWith("mock_")) {
    console.log("[META OUTGOING] Simulation/mock recipient. Skipping external API call.");
    return { success: true, simulated: true };
  }

  // Sanitize recipient ID
  const cleanRecipientId = recipientId.replace(/^ID:\s*/, '').trim();

  if (platform === "facebook" || platform === "instagram") {
    if (!token || token.includes("mock")) {
      console.log("[META OUTGOING] Page Access Token not configured or is mock token.");
      return { success: false, error: "Missing Page Access Token" };
    }
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: cleanRecipientId },
          message: { text }
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log("[META OUTGOING SUCCESS] Delivered to Facebook Messenger:", data);
        return { success: true, data };
      } else {
        console.error("[META OUTGOING ERROR] Graph API error response:", data);
        return { success: false, error: data };
      }
    } catch (err: any) {
      console.error("[META OUTGOING ERROR] Exception during Graph API call:", err);
      return { success: false, error: err.message };
    }
  } else if (platform === "whatsapp") {
    const waToken = process.env.WHATSAPP_SYSTEM_USER_ACCESS_TOKEN || token;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || metaState.whatsappAccount?.phoneNumberId;
    if (!waToken || !phoneId || waToken.includes("mock")) {
      console.log("[META OUTGOING] WhatsApp Cloud API credentials missing.");
      return { success: false, error: "Missing WhatsApp credentials" };
    }
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${waToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: cleanRecipientId,
          type: "text",
          text: { body: text }
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log("[META OUTGOING SUCCESS] Delivered to WhatsApp:", data);
        return { success: true, data };
      } else {
        console.error("[META OUTGOING ERROR] WhatsApp Graph API error:", data);
        return { success: false, error: data };
      }
    } catch (err: any) {
      console.error("[META OUTGOING ERROR] WhatsApp call failed:", err);
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

// Triggers external AI reply postback
async function triggerExternalAIResponse(conversationId: string, log: WebhookLog, customerName: string) {
  try {
    if (aiTriggerHandler) {
      await aiTriggerHandler(conversationId);
      log.steps.push({ name: "Gemini Smart Response Dispatched", timestamp: new Date().toISOString(), status: "success" });
    } else {
      const res = await fetch(`http://localhost:3000/api/conversations/${conversationId}/ai-trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        log.steps.push({ name: "Gemini Smart Response Dispatched", timestamp: new Date().toISOString(), status: "success" });
      } else {
        throw new Error("Local AI Trigger API returned non-200");
      }
    }
  } catch (e) {
    console.error("AI trigger failed. Falling back.", e);
    const config = db.getSettings();
    const fallbackText = "🤖 Failover Guard (Automatic Retry): Our connection to the neural engines timed out. Our support manager is taking over your ticket right now!";
    
    db.addMessage({
      conversationId,
      senderType: "ai",
      senderName: config.personaName || "Fallback Bot",
      text: fallbackText
    });

    db.updateConversationStatus(conversationId, "open", "team-2");
    
    log.steps.push({ name: "AI Call Timeout. Triggered Fallover", timestamp: new Date().toISOString(), status: "fail" });
    
    if (io) {
      io.emit("app:alert", { type: "failover", message: `AI connection failed for ${customerName}. Redirecting to manager.` });
    }
  }
}
