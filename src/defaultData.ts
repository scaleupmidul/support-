import { 
  Customer, Conversation, Product, Order, Channel, FAQ, 
  KnowledgeArticle, AISettings, DashboardMetrics, AnalyticsTrend 
} from "./types";

export const defaultCustomers: Customer[] = [
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
    name: "Nusrat Jahan",
    email: "nusrat.j@hotmail.com",
    phone: "+8801822334455",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    channel: "facebook",
    tags: ["VIP", "Chittagong"],
    location: "Agrabad, Chittagong",
    language: "en",
    notes: "Ordered Silk Saree last week. Inquired about matching jewelry.",
    createdAt: "2026-07-03T09:15:00Z",
    lastActive: "2026-07-13T11:45:00Z"
  },
  {
    id: "cust-3",
    name: "Fahim Ahmed",
    email: "fahim.a@yahoo.com",
    phone: "+8801933445566",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    channel: "instagram",
    tags: ["New Lead", "Sylhet"],
    location: "Zindabazar, Sylhet",
    language: "bn",
    notes: "Asked about delivery time to Sylhet.",
    createdAt: "2026-07-10T15:20:00Z",
    lastActive: "2026-07-13T10:00:00Z"
  }
];

export const defaultConversations: Conversation[] = [
  {
    id: "conv-1",
    customerId: "cust-1",
    channel: "whatsapp",
    status: "auto_pilot",
    unreadCount: 0,
    lastMessageText: "Do you have Royal Blue Premium Cotton Panjabi in size L?",
    lastMessageTime: "2026-07-13T12:30:00Z",
    createdAt: "2026-07-13T12:00:00Z"
  },
  {
    id: "conv-2",
    customerId: "cust-2",
    channel: "facebook",
    status: "open",
    assignedTo: "user-2",
    unreadCount: 1,
    lastMessageText: "I want to exchange the size of my order ORD-8812.",
    lastMessageTime: "2026-07-13T11:45:00Z",
    createdAt: "2026-07-12T10:00:00Z"
  },
  {
    id: "conv-3",
    customerId: "cust-3",
    channel: "instagram",
    status: "auto_pilot",
    unreadCount: 0,
    lastMessageText: "How many days for delivery inside Dhaka?",
    lastMessageTime: "2026-07-13T10:00:00Z",
    createdAt: "2026-07-13T09:30:00Z"
  }
];

export const defaultProducts: Product[] = [
  {
    id: "prod-1",
    name: "Royal Blue Premium Cotton Panjabi",
    price: 2450,
    stock: 28,
    sku: "AURA-PANJ-01",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80",
    description: "100% pure combed cotton Panjabi with minimalist collar embroidery. Perfect for casual & festive wear."
  },
  {
    id: "prod-2",
    name: "Handcrafted Muslin Embroidered Saree",
    price: 6800,
    stock: 12,
    sku: "AURA-SAREE-04",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80",
    description: "Traditional Dhakai Muslin saree woven with golden zari motifs. Soft, breathable, and elegant."
  },
  {
    id: "prod-3",
    name: "Floral Printed Pure Silk Kurti",
    price: 1850,
    stock: 45,
    sku: "AURA-KURT-09",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80",
    description: "Soft luxurious pure silk Kurti with intricate hand-stitched embroidery around neck and cuffs."
  }
];

export const defaultOrders: Order[] = [
  {
    id: "ORD-8812",
    customerId: "cust-2",
    customerName: "Nusrat Jahan",
    items: [
      {
        productId: "prod-2",
        productName: "Handcrafted Muslin Embroidered Saree",
        quantity: 1,
        price: 6800
      }
    ],
    totalAmount: 6800,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: "2026-07-11T14:20:00Z"
  },
  {
    id: "ORD-8813",
    customerId: "cust-1",
    customerName: "Tanvir Rahman",
    items: [
      {
        productId: "prod-1",
        productName: "Royal Blue Premium Cotton Panjabi",
        quantity: 2,
        price: 2450
      }
    ],
    totalAmount: 4900,
    status: "pending",
    paymentStatus: "cod",
    createdAt: "2026-07-13T12:35:00Z"
  }
];

export const defaultChannels: Channel[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    type: "whatsapp",
    status: "connected",
    connectedAt: "2026-06-01T10:00:00Z",
    config: { phoneNumber: "+8801712345678" }
  },
  {
    id: "facebook",
    name: "Facebook Messenger",
    type: "facebook",
    status: "connected",
    connectedAt: "2026-06-02T14:30:00Z",
    config: { pageName: "Aura Boutique BD", pageId: "10984752839485" }
  },
  {
    id: "instagram",
    name: "Instagram DM",
    type: "instagram",
    status: "connected",
    connectedAt: "2026-06-05T09:15:00Z",
    config: { instagramUsername: "@auraboutique.bd" }
  },
  {
    id: "webchat",
    name: "Web Widget",
    type: "webchat",
    status: "connected",
    connectedAt: "2026-06-10T11:00:00Z",
    config: {}
  }
];

export const defaultFaqs: FAQ[] = [
  {
    id: "faq-1",
    question: "What are your delivery charges?",
    answer: "Dhaka city delivery is 80 BDT (24-48 hours). Outside Dhaka delivery is 150 BDT via Steadfast / Pathao Courier (2-4 days).",
    tags: ["Shipping", "Delivery"],
    updatedAt: "2026-07-01T10:00:00Z"
  },
  {
    id: "faq-2",
    question: "What is your exchange policy?",
    answer: "You can exchange any item within 7 days of receiving it if unused and with original tags. Customer pays exchange courier fee unless defective.",
    tags: ["Returns", "Exchange"],
    updatedAt: "2026-07-01T10:00:00Z"
  }
];

export const defaultArticles: KnowledgeArticle[] = [
  {
    id: "kb-1",
    title: "Sizing Chart & Fitting Guide for Panjabis",
    content: "Size M: Chest 40, Length 40. Size L: Chest 42, Length 42. Size XL: Chest 44, Length 44. Size XXL: Chest 46, Length 45.",
    category: "Products",
    status: "published",
    updatedAt: "2026-07-02T10:00:00Z"
  }
];

export const defaultSettings: AISettings = {
  personaName: "Aura Boutique",
  tone: "helpful",
  primaryLanguage: "both",
  greetingMessage: "Assalamu Alaikum! Welcome to Aura Boutique BD. How can I assist you with our panjabi, saree, or kurti collections today?",
  humanEscalationTrigger: "agent, human, talk to person, manager, call me",
  leadCollectionEnabled: true,
  orderGenerationEnabled: true,
  businessName: "Aura Boutique BD",
  aiTone: "helpful",
  welcomeMessage: "Assalamu Alaikum! Welcome to Aura Boutique BD. How can I assist you with our panjabi, saree, or kurti collections today?"
};

export const defaultMetrics: DashboardMetrics = {
  totalConversations: 268,
  activeChats: 12,
  aiResolutionRate: 84.5,
  avgResponseTime: 1.2,
  leadConversionRate: 28.4,
  revenueGenerated: 198700
};

export const defaultTrends: AnalyticsTrend[] = [
  { date: "07/07", totalConversations: 18, aiResolved: 15, humanHandled: 3, leadsCollected: 5, revenue: 12400 },
  { date: "07/08", totalConversations: 24, aiResolved: 20, humanHandled: 4, leadsCollected: 8, revenue: 18600 },
  { date: "07/09", totalConversations: 30, aiResolved: 26, humanHandled: 4, leadsCollected: 12, revenue: 24500 },
  { date: "07/10", totalConversations: 28, aiResolved: 22, humanHandled: 6, leadsCollected: 9, revenue: 16800 },
  { date: "07/11", totalConversations: 35, aiResolved: 31, humanHandled: 4, leadsCollected: 15, revenue: 32000 },
  { date: "07/12", totalConversations: 42, aiResolved: 36, humanHandled: 6, leadsCollected: 18, revenue: 45000 },
  { date: "07/13", totalConversations: 48, aiResolved: 41, humanHandled: 7, leadsCollected: 22, revenue: 49800 }
];
