/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { 
  Role, User, Business, TeamMember, Channel, Customer, 
  Conversation, Message, Product, Order, KnowledgeArticle, 
  FAQ, AISettings, Subscription, DashboardMetrics, AnalyticsTrend 
} from "../src/types.js";

const DB_PATH = path.join(process.cwd(), "server-db.json");
const TMP_DB_PATH = path.join("/tmp", "server-db.json");

interface DatabaseSchema {
  business: Business;
  channels: Channel[];
  customers: Customer[];
  conversations: Conversation[];
  messages: Message[];
  products: Product[];
  orders: Order[];
  knowledgeBase: KnowledgeArticle[];
  faqs: FAQ[];
  settings: AISettings;
  subscription: Subscription;
  teamMembers: TeamMember[];
  analyticsTrends: AnalyticsTrend[];
}

const defaultData: DatabaseSchema = {
  business: {
    id: "biz-1",
    name: "Aura Boutique BD",
    industry: "Ecommerce - Fashion & Clothing",
    website: "https://auraboutiquebd.com",
    currency: "BDT"
  },
  channels: [
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      type: "whatsapp",
      status: "connected",
      connectedAt: "2026-06-01T10:00:00Z",
      config: {
        phoneNumber: "+8801712345678",
        webhookSecret: "wh_sec_wa_99238"
      }
    },
    {
      id: "facebook",
      name: "Facebook Messenger",
      type: "facebook",
      status: "connected",
      connectedAt: "2026-06-02T14:30:00Z",
      config: {
        pageName: "Aura Boutique BD",
        pageId: "10984752839485",
        webhookSecret: "wh_sec_fb_22849"
      }
    },
    {
      id: "instagram",
      name: "Instagram DM",
      type: "instagram",
      status: "connected",
      connectedAt: "2026-06-05T09:15:00Z",
      config: {
        instagramUsername: "@auraboutique.bd",
        webhookSecret: "wh_sec_ig_88374"
      }
    },
    {
      id: "webchat",
      name: "Web Widget",
      type: "webchat",
      status: "connected",
      connectedAt: "2026-06-10T11:00:00Z",
      config: {
        webhookSecret: "wh_sec_web_11029"
      }
    }
  ],
  customers: [
    {
      id: "cust-1",
      name: "Tanvir Rahman",
      email: "tanvir.rahman@gmail.com",
      phone: "+8801711223344",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      channel: "whatsapp",
      tags: ["Regular", "Dhaka", "Lead"],
      location: "Mirpur, Dhaka",
      language: "bn",
      notes: "Prefers Cash on Delivery. Likes cotton panjabis.",
      createdAt: "2026-07-01T12:00:00Z",
      lastActive: "2026-07-13T12:30:00Z"
    },
    {
      id: "cust-2",
      name: "Sarah Khan",
      email: "sarah.khan@yahoo.com",
      phone: "+8801822334455",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      channel: "facebook",
      tags: ["High Value", "Chittagong"],
      location: "GEC Circle, Chittagong",
      language: "en",
      notes: "Inquired about Silk Kurti medium size.",
      createdAt: "2026-07-03T15:30:00Z",
      lastActive: "2026-07-13T11:45:00Z"
    },
    {
      id: "cust-3",
      name: "Nafis Ahmed",
      phone: "+8801911887766",
      channel: "instagram",
      tags: ["New Customer", "Sylhet", "Requires Agent"],
      location: "Zindabazar, Sylhet",
      language: "bn",
      notes: "Asked for custom stitching options.",
      createdAt: "2026-07-10T09:20:00Z",
      lastActive: "2026-07-13T10:15:00Z"
    },
    {
      id: "cust-4",
      name: "Maliha Chowdhury",
      email: "maliha.c@outlook.com",
      phone: "+8801511443322",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
      channel: "webchat",
      tags: ["Lead"],
      location: "Dhanmondi, Dhaka",
      language: "bn",
      notes: "Looking for Floral Saree.",
      createdAt: "2026-07-12T18:00:00Z",
      lastActive: "2026-07-13T12:40:00Z"
    }
  ],
  conversations: [
    {
      id: "conv-1",
      customerId: "cust-1",
      channel: "whatsapp",
      status: "auto_pilot",
      unreadCount: 0,
      lastMessageText: "আপনাদের ডেলিভারি চার্জ কত?",
      lastMessageTime: "2026-07-13T12:30:00Z",
      createdAt: "2026-07-01T12:00:00Z"
    },
    {
      id: "conv-2",
      customerId: "cust-2",
      channel: "facebook",
      status: "auto_pilot",
      unreadCount: 0,
      lastMessageText: "Do you have the Premium Silk Kurti in Size M?",
      lastMessageTime: "2026-07-13T11:45:00Z",
      createdAt: "2026-07-03T15:30:00Z"
    },
    {
      id: "conv-3",
      customerId: "cust-3",
      channel: "instagram",
      status: "open",
      assignedTo: "team-2",
      unreadCount: 1,
      lastMessageText: "আমি কি কাস্টম ডিজাইন অর্ডার করতে পারব?",
      lastMessageTime: "2026-07-13T10:15:00Z",
      createdAt: "2026-07-10T09:20:00Z"
    },
    {
      id: "conv-4",
      customerId: "cust-4",
      channel: "webchat",
      status: "auto_pilot",
      unreadCount: 0,
      lastMessageText: "শাড়িটা অনেক সুন্দর লেগেছে, অর্ডার করতে চাই।",
      lastMessageTime: "2026-07-13T12:40:00Z",
      createdAt: "2026-07-12T18:00:00Z"
    }
  ],
  messages: [
    // Tanvir Rahman (WhatsApp) History
    {
      id: "msg-1-1",
      conversationId: "conv-1",
      senderType: "customer",
      senderName: "Tanvir Rahman",
      text: "আসসালামু আলাইকুম, আমি একটা পাঞ্জাবি নিতে চাচ্ছিলাম।",
      timestamp: "2026-07-13T12:20:00Z"
    },
    {
      id: "msg-1-2",
      conversationId: "conv-1",
      senderType: "ai",
      senderName: "Aura Assistant",
      text: "ওয়া আলাইকুম আসসালাম! Aura Boutique BD-তে আপনাকে স্বাগতম। আমাদের পাঞ্জাবি কালেকশনটি খুবই আরামদায়ক এবং আকর্ষণীয়। আপনি কি বিশেষ কোনো পাঞ্জাবি খুঁজছেন, যেমন- 'Royal Cotton Panjabi' (রয়্যাল কটন পাঞ্জাবি)? আপনার সাইজটি জানালে আমি সাহায্য করতে পারব।",
      timestamp: "2026-07-13T12:22:00Z"
    },
    {
      id: "msg-1-3",
      conversationId: "conv-1",
      senderType: "customer",
      senderName: "Tanvir Rahman",
      text: "হ্যাঁ কটন টাই লাগবে, সাইজ ৪০। ঢাকার বাইরে পাঠাতে পারবেন?",
      timestamp: "2026-07-13T12:25:00Z"
    },
    {
      id: "msg-1-4",
      conversationId: "conv-1",
      senderType: "ai",
      senderName: "Aura Assistant",
      text: "হ্যাঁ, অবশ্যই! আমরা সারা বাংলাদেশে Steadfast এবং Pathao কুরিয়ারের মাধ্যমে ডেলিভারি দিয়ে থাকি। আমাদের রয়্যাল কটন পাঞ্জাবি (Royal Cotton Panjabi) সাইজ ৪০ এখন স্টকে আছে। এর মূল্য ২৮০০ টাকা। ঢাকার বাইরে ডেলিভারি চার্জ ১২০ টাকা এবং ৩ থেকে ৫ কার্যদিবস সময় লাগবে। আপনি কি অর্ডারটি নিশ্চিত করতে চান?",
      timestamp: "2026-07-13T12:27:00Z"
    },
    {
      id: "msg-1-5",
      conversationId: "conv-1",
      senderType: "customer",
      senderName: "Tanvir Rahman",
      text: "আপনাদের ডেলিভারি চার্জ কত?",
      timestamp: "2026-07-13T12:30:00Z"
    },

    // Sarah Khan (Facebook) History
    {
      id: "msg-2-1",
      conversationId: "conv-2",
      senderType: "customer",
      senderName: "Sarah Khan",
      text: "Hello! I am looking for premium ethnic wear for an upcoming event.",
      timestamp: "2026-07-13T11:30:00Z"
    },
    {
      id: "msg-2-2",
      conversationId: "conv-2",
      senderType: "ai",
      senderName: "Aura Assistant",
      text: "Hello! Welcome to Aura Boutique BD. For formal events, I highly recommend our gorgeous 'Premium Silk Kurti' (3200 BDT) which features luxurious silk with intricate hand embroidery, or our 'Floral Georgette Saree' (4500 BDT) for a timeless look. What's your style preference?",
      timestamp: "2026-07-13T11:35:00Z"
    },
    {
      id: "msg-2-3",
      conversationId: "conv-2",
      senderType: "customer",
      senderName: "Sarah Khan",
      text: "Do you have the Premium Silk Kurti in Size M?",
      timestamp: "2026-07-13T11:45:00Z"
    },

    // Nafis Ahmed (Instagram) History (Requires Human Agent)
    {
      id: "msg-3-1",
      conversationId: "conv-3",
      senderType: "customer",
      senderName: "Nafis Ahmed",
      text: "ভাইয়া, আপনাদের রয়্যাল কটন পাঞ্জাবিটার বুকের ডিজাইনটা কি একটু কাস্টমাইজ করে দেয়া যাবে? আমি বিয়ের জন্য ৪টা পাঞ্জাবি নিব একইরকম কিন্তু বুকে একটু হালকা কাজ থাকবে।",
      timestamp: "2026-07-13T10:10:00Z"
    },
    {
      id: "msg-3-2",
      conversationId: "conv-3",
      senderType: "ai",
      senderName: "Aura Assistant",
      text: "কাস্টম ডিজাইনের চমৎকার চিন্তার জন্য ধন্যবাদ! কাস্টম এমব্রয়ডারি বা ডিজাইনের কাজের জন্য আমাদের ডিজাইনার টিমকে জানাতে হবে। আমি এই কথোপকথনটি আমাদের একজন মানব প্রতিনিধির কাছে স্থানান্তর করছি। তিনি আপনাকে সাহায্য করবেন। অনুগ্রহ করে কিছু সময় অপেক্ষা করুন। 😊",
      timestamp: "2026-07-13T10:12:00Z"
    },
    {
      id: "msg-3-3",
      conversationId: "conv-3",
      senderType: "customer",
      senderName: "Nafis Ahmed",
      text: "আমি কি কাস্টম ডিজাইন অর্ডার করতে পারব?",
      timestamp: "2026-07-13T10:15:00Z"
    },

    // Maliha Chowdhury (Webchat) History
    {
      id: "msg-4-1",
      conversationId: "conv-4",
      senderType: "customer",
      senderName: "Maliha Chowdhury",
      text: "শাড়িটা অনেক সুন্দর লেগেছে, অর্ডার করতে চাই।",
      timestamp: "2026-07-13T12:40:00Z"
    }
  ],
  products: [
    {
      id: "prod-1",
      name: "Premium Silk Kurti",
      price: 3200,
      stock: 45,
      sku: "AURA-K-01",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
      description: "Soft luxurious pure silk Kurti with intricate traditional hand-stitched embroidery around the neck and cuffs. Suitable for festive events and formal gatherings."
    },
    {
      id: "prod-2",
      name: "Royal Cotton Panjabi",
      price: 2800,
      stock: 60,
      sku: "AURA-P-02",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80",
      description: "Premium Egyptian long-staple cotton Panjabi, incredibly lightweight, breathable, and elegant. Features subtle tone-on-tone embroidery on the placket."
    },
    {
      id: "prod-3",
      name: "Designer Linen Tops",
      price: 1800,
      stock: 25,
      sku: "AURA-T-03",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
      description: "Trendy, pure European organic linen short tops for women. Extremely comfortable for summer, styled with clean modern cuts and shell buttons."
    },
    {
      id: "prod-4",
      name: "Floral Georgette Saree",
      price: 4500,
      stock: 15,
      sku: "AURA-S-04",
      image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=400&q=80",
      description: "Fluid, high-grade georgette saree featuring an elegant bespoke hand-painted floral pattern. Comes with 1-meter matching plain pure silk blouse fabric."
    }
  ],
  orders: [
    {
      id: "ord-1",
      customerId: "cust-1",
      customerName: "Tanvir Rahman",
      items: [
        {
          productId: "prod-2",
          productName: "Royal Cotton Panjabi",
          quantity: 1,
          price: 2800
        }
      ],
      totalAmount: 2860, // 2800 + 60 delivery
      status: "processing",
      paymentStatus: "cod",
      createdAt: "2026-07-13T12:28:00Z"
    },
    {
      id: "ord-2",
      customerId: "cust-2",
      customerName: "Sarah Khan",
      items: [
        {
          productId: "prod-1",
          productName: "Premium Silk Kurti",
          quantity: 2,
          price: 3200
        }
      ],
      totalAmount: 6520, // 6400 + 120 delivery
      status: "pending",
      paymentStatus: "cod",
      createdAt: "2026-07-13T11:46:00Z"
    }
  ],
  knowledgeBase: [
    {
      id: "kb-1",
      title: "Shipping & Delivery Policy",
      content: `Our delivery partners are Steadfast Delivery and Pathao Courier.
      
      - Inside Dhaka: 60 BDT (24 to 48 hours delivery). Same-day delivery is available upon special request at 150 BDT (orders must be placed before 11:00 AM).
      - Outside Dhaka: 120 BDT (3 to 5 business days delivery).
      - We offer Cash on Delivery (COD) nationwide, which means you pay only when you receive your package.
      - Please inspect the product in front of the delivery agent. If there is a sizing issue or damage, return it immediately to the delivery agent.`,
      category: "Shipping",
      status: "published",
      updatedAt: "2026-07-01T12:00:00Z"
    },
    {
      id: "kb-2",
      title: "Return & Exchange Policy",
      content: `We accept returns and exchanges within 7 days of delivery:
      
      - The item must be unused, unwashed, and have all original tags intact.
      - To process an exchange, contact us on our WhatsApp or Page inbox, and share your Order ID and the preferred size.
      - For size exchanges, the customer bears the return delivery cost (120 BDT outside Dhaka, 60 BDT inside Dhaka) unless the issue was due to our mistake.
      - Refund requests are processed within 3-5 business days via bKash, Rocket, or Bank Transfer once we receive and inspect the returned item.`,
      category: "Returns",
      status: "published",
      updatedAt: "2026-07-01T12:00:00Z"
    },
    {
      id: "kb-3",
      title: "Size Selection Guide",
      content: `We manufacture clothing according to standard Bangladeshi/Subcontinent sizing charts:
      
      - Panjabi Sizes: 
        * Size 38: Chest 39 inches, Length 40 inches
        * Size 40: Chest 41 inches, Length 42 inches
        * Size 42: Chest 43 inches, Length 44 inches
        * Size 44: Chest 45 inches, Length 46 inches
        
      - Women's Kurti Sizes:
        * Size S (36): Chest 36 inches, Length 38 inches
        * Size M (38): Chest 38 inches, Length 40 inches
        * Size L (40): Chest 40 inches, Length 42 inches
        * Size XL (42): Chest 42 inches, Length 44 inches
        * Size XXL (44): Chest 44 inches, Length 44 inches`,
      category: "Sizing",
      status: "published",
      updatedAt: "2026-07-02T10:00:00Z"
    }
  ],
  faqs: [
    {
      id: "faq-1",
      question: "Do you offer cash on delivery (COD)?",
      answer: "Yes! We offer cash on delivery nationwide in Bangladesh. You pay only after receiving and verifying the product package.",
      tags: ["COD", "Payment", "Delivery"],
      updatedAt: "2026-07-01T12:00:00Z"
    },
    {
      id: "faq-2",
      question: "How do I choose my clothing size?",
      answer: "Please consult our Size Selection Guide in the Knowledge Base. Panjabis are sized 38, 40, 42, 44 based on shoulder/chest. Kurtis are sized 36, 38, 40, 42, 44 based on bust circumference. Let us know your height and chest measurements and our AI can suggest the best fit!",
      tags: ["Sizing", "Sizing Chart"],
      updatedAt: "2026-07-02T11:00:00Z"
    },
    {
      id: "faq-3",
      question: "Where is your retail boutique outlet located?",
      answer: "Our flagship outlet is located at: House 12, Road 5, Dhanmondi, Dhaka 1205 (Opposite Dhanmondi Lake). We are open daily from 10:00 AM to 8:30 PM.",
      tags: ["Location", "Store Outlet", "Dhaka"],
      updatedAt: "2026-07-05T14:00:00Z"
    },
    {
      id: "faq-4",
      question: "ডেলিভারি চার্জ কত এবং কতদিন সময় লাগে?",
      answer: "ঢাকা সিটির ভেতরে ডেলিভারি চার্জ ৬০ টাকা (১-২ দিন সময় লাগে)। ঢাকা সিটির বাইরে ডেলিভারি চার্জ ১২০ টাকা (৩-৫ দিন সময় লাগে)। আমাদের ইমার্জেন্সি একই দিনের ডেলিভারি চার্জ ১৫০ টাকা (দুপুর ১২টার আগে অর্ডার করতে হবে)।",
      tags: ["ডেলিভারি", "Delivery BDT", "Shipping Cost"],
      updatedAt: "2026-07-08T09:00:00Z"
    }
  ],
  settings: {
    personaName: "Aura Boutique Support",
    tone: "friendly",
    primaryLanguage: "both",
    greetingMessage: "আসসালামু আলাইকুম। Aura Boutique-এ আপনাকে স্বাগতম। আজকে আপনাকে কিভাবে সাহায্য করতে পারি বলুন?",
    humanEscalationTrigger: "agent, human, call, speak to representative, boss, owner, মানুষ, কথা বলুন, কাস্টমার কেয়ার",
    leadCollectionEnabled: true,
    orderGenerationEnabled: true
  },
  subscription: {
    plan: "pro",
    status: "active",
    price: 49,
    billingCycle: "monthly",
    nextBillingDate: "2026-08-13T12:46:34Z"
  },
  teamMembers: [
    {
      id: "team-1",
      name: "Hasan Bin Osman",
      email: "hasanbinosman92@gmail.com",
      role: Role.BUSINESS_OWNER,
      status: "active",
      joinedAt: "2026-06-01T08:00:00Z"
    },
    {
      id: "team-2",
      name: "Asif Chowdhury",
      email: "asif.chowdhury@gmail.com",
      role: Role.MANAGER,
      status: "active",
      joinedAt: "2026-06-02T09:30:00Z"
    },
    {
      id: "team-3",
      name: "Sabrina Yeasmin",
      email: "sabrina.yeasmin@gmail.com",
      role: Role.AGENT,
      status: "active",
      joinedAt: "2026-06-15T11:00:00Z"
    }
  ],
  analyticsTrends: [
    { date: "07/07", totalConversations: 18, aiResolved: 15, humanHandled: 3, leadsCollected: 5, revenue: 12400 },
    { date: "07/08", totalConversations: 24, aiResolved: 20, humanHandled: 4, leadsCollected: 8, revenue: 18600 },
    { date: "07/09", totalConversations: 30, aiResolved: 26, humanHandled: 4, leadsCollected: 12, revenue: 24500 },
    { date: "07/10", totalConversations: 28, aiResolved: 22, humanHandled: 6, leadsCollected: 9, revenue: 16800 },
    { date: "07/11", totalConversations: 35, aiResolved: 31, humanHandled: 4, leadsCollected: 15, revenue: 32000 },
    { date: "07/12", totalConversations: 42, aiResolved: 36, humanHandled: 6, leadsCollected: 18, revenue: 45000 },
    { date: "07/13", totalConversations: 48, aiResolved: 41, humanHandled: 7, leadsCollected: 22, revenue: 49800 }
  ]
};

// Helper to read and write database
export function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(TMP_DB_PATH)) {
      const content = fs.readFileSync(TMP_DB_PATH, "utf-8");
      return JSON.parse(content) as DatabaseSchema;
    }
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(content) as DatabaseSchema;
    }
    return defaultData;
  } catch (error) {
    console.error("Error reading database:", error);
    return defaultData;
  }
}

export function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(TMP_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to /tmp database:", error);
  }
  try {
    if (fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    }
  } catch {
    // Ignore read-only filesystem errors on Vercel
  }
}

// Model wrappers and query helpers
export const db = {
  readDb,
  getBusiness: () => {
    return readDb().business;
  },
  updateBusiness: (updates: Partial<Business>) => {
    const data = readDb();
    data.business = { ...data.business, ...updates };
    writeDb(data);
    return data.business;
  },

  getChannels: () => {
    return readDb().channels;
  },
  updateChannelStatus: (channelId: string, status: "connected" | "disconnected") => {
    const data = readDb();
    const ch = data.channels.find(c => c.id === channelId);
    if (ch) {
      ch.status = status;
      if (status === "connected") {
        ch.connectedAt = new Date().toISOString();
      } else {
        delete ch.connectedAt;
      }
      writeDb(data);
    }
    return data.channels;
  },

  getCustomers: () => {
    return readDb().customers;
  },
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "lastActive">) => {
    const data = readDb();
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    data.customers.push(newCustomer);
    writeDb(data);
    return newCustomer;
  },
  updateCustomer: (id: string, updates: Partial<Customer>) => {
    const data = readDb();
    const idx = data.customers.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.customers[idx] = { ...data.customers[idx], ...updates, lastActive: new Date().toISOString() };
      writeDb(data);
      return data.customers[idx];
    }
    return null;
  },
  deleteCustomer: (id: string) => {
    const data = readDb();
    data.customers = data.customers.filter(c => c.id !== id);
    const convsToRemove = data.conversations.filter(conv => conv.customerId === id).map(c => c.id);
    data.conversations = data.conversations.filter(conv => conv.customerId !== id);
    data.messages = data.messages.filter(m => !convsToRemove.includes(m.conversationId));
    writeDb(data);
    return true;
  },
  clearAllCustomers: () => {
    const data = readDb();
    data.customers = [];
    data.conversations = [];
    data.messages = [];
    writeDb(data);
    return true;
  },

  getConversations: () => {
    const data = readDb();
    return data.conversations;
  },
  updateConversationStatus: (id: string, status: "auto_pilot" | "open" | "closed", assignedTo?: string) => {
    const data = readDb();
    const idx = data.conversations.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.conversations[idx].status = status;
      if (assignedTo !== undefined) {
        data.conversations[idx].assignedTo = assignedTo;
      }
      writeDb(data);
      return data.conversations[idx];
    }
    return null;
  },
  createConversation: (customerId: string, channel: "whatsapp" | "facebook" | "instagram" | "webchat") => {
    const data = readDb();
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      customerId,
      channel,
      status: "auto_pilot",
      unreadCount: 0,
      lastMessageText: "Conversation started",
      lastMessageTime: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    data.conversations.push(newConv);
    writeDb(data);
    return newConv;
  },

  getMessages: (conversationId?: string) => {
    const data = readDb();
    if (conversationId) {
      return data.messages.filter(m => m.conversationId === conversationId);
    }
    return data.messages;
  },
  addMessage: (msg: Omit<Message, "id" | "timestamp">) => {
    const data = readDb();
    const newMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    data.messages.push(newMsg);

    // Update corresponding conversation last message
    const convIdx = data.conversations.findIndex(c => c.id === msg.conversationId);
    if (convIdx !== -1) {
      data.conversations[convIdx].lastMessageText = msg.text;
      data.conversations[convIdx].lastMessageTime = newMsg.timestamp;
      if (msg.senderType === "customer") {
        data.conversations[convIdx].unreadCount += 1;
      }
      
      // Update customer last active time
      const custId = data.conversations[convIdx].customerId;
      const custIdx = data.customers.findIndex(c => c.id === custId);
      if (custIdx !== -1) {
        data.customers[custIdx].lastActive = newMsg.timestamp;
      }
    }
    
    writeDb(data);
    return newMsg;
  },
  clearUnreadCount: (conversationId: string) => {
    const data = readDb();
    const idx = data.conversations.findIndex(c => c.id === conversationId);
    if (idx !== -1) {
      data.conversations[idx].unreadCount = 0;
      writeDb(data);
    }
  },

  getProducts: () => {
    return readDb().products;
  },
  addProduct: (product: Omit<Product, "id">) => {
    const data = readDb();
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    data.products.push(newProd);
    writeDb(data);
    return newProd;
  },
  updateProduct: (id: string, updates: Partial<Product>) => {
    const data = readDb();
    const idx = data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      data.products[idx] = { ...data.products[idx], ...updates };
      writeDb(data);
      return data.products[idx];
    }
    return null;
  },

  getOrders: () => {
    return readDb().orders;
  },
  addOrder: (order: Omit<Order, "id" | "createdAt">) => {
    const data = readDb();
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    data.orders.push(newOrder);

    // Update analytics
    const todayStr = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
    const trendIdx = data.analyticsTrends.findIndex(t => t.date === todayStr);
    if (trendIdx !== -1) {
      data.analyticsTrends[trendIdx].revenue += order.totalAmount;
    } else if (data.analyticsTrends.length > 0) {
      data.analyticsTrends[data.analyticsTrends.length - 1].revenue += order.totalAmount;
    }

    writeDb(data);
    return newOrder;
  },
  updateOrderStatus: (id: string, status: Order["status"], paymentStatus?: Order["paymentStatus"]) => {
    const data = readDb();
    const idx = data.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      data.orders[idx].status = status;
      if (paymentStatus) {
        data.orders[idx].paymentStatus = paymentStatus;
      }
      writeDb(data);
      return data.orders[idx];
    }
    return null;
  },

  getKnowledgeBase: () => {
    return readDb().knowledgeBase;
  },
  addKnowledgeArticle: (article: Omit<KnowledgeArticle, "id" | "updatedAt">) => {
    const data = readDb();
    const newArt: KnowledgeArticle = {
      ...article,
      id: `kb-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    data.knowledgeBase.push(newArt);
    writeDb(data);
    return newArt;
  },
  updateKnowledgeArticle: (id: string, updates: Partial<KnowledgeArticle>) => {
    const data = readDb();
    const idx = data.knowledgeBase.findIndex(a => a.id === id);
    if (idx !== -1) {
      data.knowledgeBase[idx] = { ...data.knowledgeBase[idx], ...updates, updatedAt: new Date().toISOString() };
      writeDb(data);
      return data.knowledgeBase[idx];
    }
    return null;
  },
  deleteKnowledgeArticle: (id: string) => {
    const data = readDb();
    data.knowledgeBase = data.knowledgeBase.filter(a => a.id !== id);
    writeDb(data);
    return true;
  },

  getFAQs: () => {
    return readDb().faqs;
  },
  addFAQ: (faq: Omit<FAQ, "id" | "updatedAt">) => {
    const data = readDb();
    const newFaq: FAQ = {
      ...faq,
      id: `faq-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    data.faqs.push(newFaq);
    writeDb(data);
    return newFaq;
  },
  updateFAQ: (id: string, updates: Partial<FAQ>) => {
    const data = readDb();
    const idx = data.faqs.findIndex(f => f.id === id);
    if (idx !== -1) {
      data.faqs[idx] = { ...data.faqs[idx], ...updates, updatedAt: new Date().toISOString() };
      writeDb(data);
      return data.faqs[idx];
    }
    return null;
  },
  deleteFAQ: (id: string) => {
    const data = readDb();
    data.faqs = data.faqs.filter(f => f.id !== id);
    writeDb(data);
    return true;
  },

  getSettings: () => {
    return readDb().settings;
  },
  updateSettings: (updates: Partial<AISettings>) => {
    const data = readDb();
    data.settings = { ...data.settings, ...updates };
    writeDb(data);
    return data.settings;
  },

  getSubscription: () => {
    return readDb().subscription;
  },
  updateSubscription: (updates: Partial<Subscription>) => {
    const data = readDb();
    data.subscription = { ...data.subscription, ...updates };
    writeDb(data);
    return data.subscription;
  },

  getTeamMembers: () => {
    return readDb().teamMembers;
  },
  addTeamMember: (member: Omit<TeamMember, "id" | "status" | "joinedAt">) => {
    const data = readDb();
    const newMember: TeamMember = {
      ...member,
      id: `team-${Date.now()}`,
      status: "invited",
      joinedAt: new Date().toISOString()
    };
    data.teamMembers.push(newMember);
    writeDb(data);
    return newMember;
  },
  updateTeamMemberRole: (id: string, role: Role) => {
    const data = readDb();
    const idx = data.teamMembers.findIndex(t => t.id === id);
    if (idx !== -1) {
      data.teamMembers[idx].role = role;
      writeDb(data);
      return data.teamMembers[idx];
    }
    return null;
  },
  deleteTeamMember: (id: string) => {
    const data = readDb();
    data.teamMembers = data.teamMembers.filter(t => t.id !== id);
    writeDb(data);
    return true;
  },

  getAnalyticsMetrics: (): DashboardMetrics => {
    const data = readDb();
    const activeChats = data.conversations.filter(c => c.status === "auto_pilot" || c.status === "open").length;
    const totalConversations = data.conversations.length;
    
    // Calculate total orders revenue
    const revenueGenerated = data.orders
      .filter(o => o.status !== "cancelled")
      .reduce((acc, curr) => acc + curr.totalAmount, 0);

    return {
      totalConversations: totalConversations * 3 + 124, // realistic base + active scale
      activeChats,
      aiResolutionRate: 86.4,
      avgResponseTime: 8.5,
      leadConversionRate: 42.1,
      revenueGenerated: 154800 + revenueGenerated
    };
  },

  getAnalyticsTrends: () => {
    return readDb().analyticsTrends;
  },

  recordLeadCollected: () => {
    const data = readDb();
    const todayStr = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
    const trendIdx = data.analyticsTrends.findIndex(t => t.date === todayStr);
    if (trendIdx !== -1) {
      data.analyticsTrends[trendIdx].leadsCollected += 1;
    } else if (data.analyticsTrends.length > 0) {
      data.analyticsTrends[data.analyticsTrends.length - 1].leadsCollected += 1;
    }
    writeDb(data);
  },

  recordConversationHandled: (isAi: boolean) => {
    const data = readDb();
    const todayStr = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
    const trendIdx = data.analyticsTrends.findIndex(t => t.date === todayStr);
    if (trendIdx !== -1) {
      data.analyticsTrends[trendIdx].totalConversations += 1;
      if (isAi) {
        data.analyticsTrends[trendIdx].aiResolved += 1;
      } else {
        data.analyticsTrends[trendIdx].humanHandled += 1;
      }
    } else if (data.analyticsTrends.length > 0) {
      const last = data.analyticsTrends[data.analyticsTrends.length - 1];
      last.totalConversations += 1;
      if (isAi) last.aiResolved += 1;
      else last.humanHandled += 1;
    }
    writeDb(data);
  }
};
