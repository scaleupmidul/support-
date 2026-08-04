/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Users, Mail, Phone, MapPin, Tag, Search, Plus, 
  Smartphone, Globe, Calendar, FileText, CheckCircle2,
  Trash2, AlertTriangle
} from "lucide-react";
import { Customer } from "../types.js";

interface CRMProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, "id" | "createdAt" | "lastActive">) => Promise<any>;
  onDeleteCustomer?: (id: string) => Promise<any>;
  onClearAllCustomers?: () => Promise<any>;
}

export default function CRM({ customers, onAddCustomer, onDeleteCustomer, onClearAllCustomers }: CRMProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // New customer modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustLocation, setNewCustLocation] = useState("");
  const [newCustNotes, setNewCustNotes] = useState("");
  const [newCustChannel, setNewCustChannel] = useState<"whatsapp" | "facebook" | "instagram" | "webchat">("whatsapp");

  // Fetch unique tags for filtering
  const allTags = Array.from(new Set(customers.flatMap(c => c.tags || [])));

  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    await onAddCustomer({
      name: newCustName,
      phone: newCustPhone,
      email: newCustEmail,
      channel: newCustChannel,
      location: newCustLocation,
      notes: newCustNotes,
      tags: ["Lead", "Manual Add"],
      language: "en"
    });

    // Reset fields
    setNewCustName("");
    setNewCustPhone("");
    setNewCustEmail("");
    setNewCustLocation("");
    setNewCustNotes("");
    setShowAddModal(false);
  };

  const handleDeleteSingle = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeletingId(id);
    if (onDeleteCustomer) {
      await onDeleteCustomer(id);
    }
    if (selectedCustomerId === id) {
      setSelectedCustomerId(null);
    }
    setDeletingId(null);
  };

  const handleClearAll = async () => {
    if (onClearAllCustomers) {
      await onClearAllCustomers();
    }
    setSelectedCustomerId(null);
    setShowClearConfirmModal(false);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      (c.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.email && c.email.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
      (c.location && c.location.toLowerCase().includes((searchTerm || '').toLowerCase()));

    const matchesChannel = channelFilter === "all" || c.channel === channelFilter;
    const matchesTag = tagFilter === "all" || (c.tags && c.tags.includes(tagFilter));

    return matchesSearch && matchesChannel && matchesTag;
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">CRM Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage customer contacts, conversational leads, and automated client tags.</p>
        </div>
        <div className="flex items-center gap-2">
          {customers.length > 0 && (
            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-300 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-800 transition-colors"
              title="Delete all demo customers permanently"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              Clear Demo Customers
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-sm text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 text-left">
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Hot Leads</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {customers.filter(c => c.tags?.includes("Lead")).length}
          </p>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Regular Buyers</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {customers.filter(c => c.tags?.includes("Regular")).length}
          </p>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-2xs">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">WhatsApp Audience</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {customers.filter(c => c.channel === "whatsapp").length}
          </p>
        </div>
      </div>

      {/* Main filterable table row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Column */}
        <div className="lg:col-span-2 space-y-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs text-left">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
              >
                <option value="all">All Channels</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="facebook">Messenger</option>
                <option value="instagram">Instagram</option>
                <option value="webchat">Web Chat</option>
              </select>

              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Channel</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Tags</th>
                  <th className="px-4 py-3 text-left">Last Active</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No customers matched the filters.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(cust => (
                    <tr
                      key={cust.id}
                      onClick={() => setSelectedCustomerId(cust.id)}
                      className={`hover:bg-gray-50/50 cursor-pointer transition-colors ${selectedCustomerId === cust.id ? "bg-indigo-50/20 font-medium" : ""}`}
                    >
                      <td className="px-4 py-3.5 flex items-center gap-3">
                        {cust.avatar ? (
                          <img src={cust.avatar} alt={cust.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                            {(cust.name || "?").charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-950">{cust.name}</p>
                          <p className="text-[10px] text-gray-400">{cust.phone || cust.email || "No contact info"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 capitalize">
                        <span className="flex items-center gap-1.5 font-semibold text-gray-600">
                          {cust.channel === "whatsapp" && "🟢"}
                          {cust.channel === "facebook" && "🔵"}
                          {cust.channel === "instagram" && "🟣"}
                          {cust.channel === "webchat" && "🌐"}
                          {cust.channel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {cust.location || "N/A"}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {(cust.tags || []).slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.2 bg-gray-100 text-gray-600 rounded-full font-bold text-[9px]">
                              {tag}
                            </span>
                          ))}
                          {(cust.tags || []).length > 2 && (
                            <span className="text-[9px] text-gray-400 font-bold">+{cust.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-400">
                        {new Date(cust.lastActive).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-indigo-600">
                        <div className="flex items-center justify-end gap-2">
                          <span>Inspect</span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteSingle(cust.id, e)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                            title="Delete this customer record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Customer profile side panel inspector */}
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs text-left h-fit space-y-4">
          {selectedCustomer ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
                {selectedCustomer.avatar ? (
                  <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-16 h-16 rounded-full object-cover border" />
                ) : (
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-2xl">
                    {(selectedCustomer.name || "?").charAt(0)}
                  </div>
                )}
                <h3 className="font-bold text-gray-900 mt-2.5 text-sm">{selectedCustomer.name}</h3>
                <span className="text-[9px] uppercase font-bold text-gray-400 mt-1 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  Customer ID: {selectedCustomer.id}
                </span>
              </div>

              {/* CRM details */}
              <div className="space-y-3.5 text-xs text-gray-600">
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Phone Number</span>
                  <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {selectedCustomer.phone || "Not provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Email Address</span>
                  <p className="font-semibold text-gray-800 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {selectedCustomer.email || "Not provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Physical Location</span>
                  <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {selectedCustomer.location || "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Language preference</span>
                  <p className="font-semibold text-gray-800 flex items-center gap-1.5 uppercase">
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                    {selectedCustomer.language === "bn" ? "Bangla" : "English"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Registration Date</span>
                  <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {selectedCustomer.notes && (
                  <div className="p-3 bg-yellow-50/50 border border-yellow-100 rounded-xl space-y-1">
                    <span className="block text-[10px] uppercase font-bold text-yellow-800 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Support Log Notes
                    </span>
                    <p className="text-[11px] leading-relaxed text-yellow-900">{selectedCustomer.notes}</p>
                  </div>
                )}
              </div>

              {/* Tags summary */}
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Active Tags</span>
                <div className="flex flex-wrap gap-1">
                  {(selectedCustomer.tags || []).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full font-bold text-[9px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic activity checklist */}
              <div className="p-3.5 bg-gray-50 rounded-xl space-y-2">
                <span className="block text-[10px] uppercase font-bold text-gray-400">Automation Milestones</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lead Verified</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${selectedCustomer.phone && selectedCustomer.location ? "text-emerald-600" : "text-gray-400"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Contact Info Captured</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${selectedCustomer.tags?.includes("Regular") ? "text-emerald-600" : "text-gray-400"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Conversion complete</span>
                  </div>
                </div>
              </div>

              {/* Permanent Delete Customer Button */}
              <button
                type="button"
                onClick={() => handleDeleteSingle(selectedCustomer.id)}
                className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-red-200 dark:border-red-800 transition-colors mt-2"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                Permanently Delete Customer
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center justify-center space-y-2">
              <Users className="w-8 h-8 opacity-45" />
              <p className="text-xs font-semibold">Select a customer</p>
              <p className="text-[10px] max-w-[180px]">Click any row in the list to inspect client records and log details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Register New CRM Contact</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-900 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arif Hossain"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +8801700000000"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. arif@gmail.com"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Preferred Channel</label>
                  <select
                    value={newCustChannel}
                    onChange={(e) => setNewCustChannel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                  >
                    <option value="whatsapp">WhatsApp Business</option>
                    <option value="facebook">Facebook Messenger</option>
                    <option value="instagram">Instagram DM</option>
                    <option value="webchat">Web Chat Widget</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanmondi, Dhaka"
                    value={newCustLocation}
                    onChange={(e) => setNewCustLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Internal Log Notes</label>
                <textarea
                  placeholder="Insert any particular specifications or requirements..."
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 border rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-xs font-semibold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-left space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2.5 bg-red-100 dark:bg-red-950/60 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Permanently Clear Demo Data?</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to permanently remove all demo customer records ({customers.length}) and their associated chat histories from the database?
            </p>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="w-1/2 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
