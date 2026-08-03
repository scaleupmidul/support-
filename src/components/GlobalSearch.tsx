/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Search, MessageSquare, Users, ShoppingBag, 
  ChevronRight, ArrowRight, X, Sparkles
} from "lucide-react";
import { Customer, Conversation, Product, Order } from "../types.js";

interface GlobalSearchProps {
  customers: Customer[];
  conversations: any[];
  products: Product[];
  orders: Order[];
  onNavigate: (tab: string, itemId?: string) => void;
  onClose?: () => void;
}

export default function GlobalSearch({ 
  customers, conversations, products, orders, onNavigate, onClose 
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();

  const results = {
    conversations: trimmedQuery ? conversations.filter(c => 
      (c.lastMessageText || '').toLowerCase().includes(trimmedQuery) ||
      (c.customerId && customers.find(cust => cust.id === c.customerId)?.name?.toLowerCase().includes(trimmedQuery))
    ).slice(0, 3) : [],
    
    customers: trimmedQuery ? customers.filter(c => 
      (c.name || '').toLowerCase().includes(trimmedQuery) ||
      (c.phone && c.phone.includes(trimmedQuery)) ||
      (c.email && c.email.toLowerCase().includes(trimmedQuery))
    ).slice(0, 3) : [],

    products: trimmedQuery ? products.filter(p => 
      (p.name || '').toLowerCase().includes(trimmedQuery) ||
      (p.sku || '').toLowerCase().includes(trimmedQuery) ||
      (p.description && p.description.toLowerCase().includes(trimmedQuery))
    ).slice(0, 3) : [],

    orders: trimmedQuery ? orders.filter(o => 
      (o.id || '').toLowerCase().includes(trimmedQuery) ||
      (o.customerName && o.customerName.toLowerCase().includes(trimmedQuery))
    ).slice(0, 3) : []
  };

  const hasResults = results.conversations.length > 0 || 
                     results.customers.length > 0 || 
                     results.products.length > 0 || 
                     results.orders.length > 0;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4 text-left relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
          <Sparkles className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
          Global Workspace Search
        </h3>
        <p className="text-xs text-gray-400">Instantly query across live chat threads, consumer accounts, physical catalogs, and verified orders.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search phone numbers, products, skus, chats, customer names..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none transition-all focus:bg-white"
          autoFocus
        />
      </div>

      {trimmedQuery && (
        <div className="pt-2 divide-y divide-gray-50 max-h-96 overflow-y-auto pr-1">
          {!hasResults && (
            <p className="text-xs text-gray-400 py-6 text-center font-semibold">No records matched your search query in this workspace.</p>
          )}

          {/* Conversations */}
          {results.conversations.length > 0 && (
            <div className="py-3 space-y-2">
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Conversations
              </span>
              <div className="space-y-1.5">
                {results.conversations.map((c) => {
                  const customer = customers.find(cust => cust.id === c.customerId);
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        onNavigate("inbox", c.id);
                        if (onClose) onClose();
                      }}
                      className="w-full p-2 hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-xl flex items-center justify-between text-xs transition-all text-left"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{customer?.name || "Anonymous"}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[320px]">{c.lastMessageText}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customers */}
          {results.customers.length > 0 && (
            <div className="py-3 space-y-2">
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Customers
              </span>
              <div className="space-y-1.5">
                {results.customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onNavigate("crm");
                      if (onClose) onClose();
                    }}
                    className="w-full p-2 hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-xl flex items-center justify-between text-xs transition-all text-left"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{c.name}</p>
                      <p className="text-[10px] text-gray-400">{c.phone || c.email || "No direct contact details"}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {results.products.length > 0 && (
            <div className="py-3 space-y-2">
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5" /> Products
              </span>
              <div className="space-y-1.5">
                {results.products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onNavigate("catalog");
                      if (onClose) onClose();
                    }}
                    className="w-full p-2 hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-xl flex items-center justify-between text-xs transition-all text-left animate-fade-in"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={p.image} referrerPolicy="no-referrer" alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-[10px] text-gray-400">SKU: {p.sku} • Stock: {p.stock} units</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{p.price} BDT</p>
                      <span className="text-[9px] text-indigo-600 font-bold flex items-center gap-0.5 ml-auto">View <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {results.orders.length > 0 && (
            <div className="py-3 space-y-2">
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5" /> Orders
              </span>
              <div className="space-y-1.5">
                {results.orders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      onNavigate("catalog");
                      if (onClose) onClose();
                    }}
                    className="w-full p-2 hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-xl flex items-center justify-between text-xs transition-all text-left"
                  >
                    <div>
                      <p className="font-bold text-gray-900 font-mono">{o.id}</p>
                      <p className="text-[10px] text-gray-400">Customer: {o.customerName} • Total: {o.totalAmount} BDT</p>
                    </div>
                    <div className="text-right">
                      <span className="px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-100 text-[8px] font-bold text-indigo-700 capitalize">{o.status}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
