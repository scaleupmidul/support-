/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Users, Shield, Star, Check, Plus, Search, 
  Trash, Mail, ShieldCheck, HelpCircle 
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "agent";
  status: "online" | "offline";
  resolvedCount: number;
}

export default function Team() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Static state for support team management
  const [members, setMembers] = useState<TeamMember[]>([
    { id: "team-1", name: "Kazi Ashraful", email: "ashraf@aura.com.bd", role: "owner", status: "online", resolvedCount: 142 },
    { id: "team-2", name: "Sabrina Yeasmin", email: "sabrina.yeasmin@gmail.com", role: "admin", status: "online", resolvedCount: 98 },
    { id: "team-3", name: "Farhan Tanvir", email: "farhan.aura@gmail.com", role: "agent", status: "online", resolvedCount: 76 },
    { id: "team-4", name: "Tasmim Rahman", email: "tasmim@gmail.com", role: "agent", status: "offline", resolvedCount: 31 }
  ]);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"admin" | "agent">("agent");

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      status: "offline",
      resolvedCount: 0
    };

    setMembers([...members, newMember]);
    setNewMemberName("");
    setNewMemberEmail("");
    setShowAddModal(false);
  };

  const handleRoleChange = (id: string, role: TeamMember["role"]) => {
    setMembers(members.map(m => m.id === id ? { ...m, role } : m));
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const filteredMembers = members.filter(m =>
    (m.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (m.email || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-left">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Support Team</h1>
          <p className="text-sm text-gray-500">Add co-workers, assign roles (Owner, Admin, Agent), and review response metrics.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-sm text-xs font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Table list Column */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team member name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold text-[10px] border-b border-gray-100">
                  <th className="px-5 py-3 text-left">Member Profile</th>
                  <th className="px-5 py-3 text-left">System Role</th>
                  <th className="px-5 py-3 text-left">Live Status</th>
                  <th className="px-5 py-3 text-left">Resolved Chats</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50/30 transition-colors">
                    {/* Profile */}
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-3xs">
                        {member.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{member.name}</p>
                        <p className="text-[10px] text-gray-400">{member.email}</p>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5 capitalize">
                      {member.role === "owner" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          <Star className="w-3 h-3 fill-indigo-200" /> Owner
                        </span>
                      ) : (
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                          className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-[11px]"
                        >
                          <option value="admin">Admin</option>
                          <option value="agent">Agent</option>
                        </select>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></span>
                        <span className="capitalize text-gray-600">{member.status}</span>
                      </span>
                    </td>

                    {/* Resolved count */}
                    <td className="px-5 py-3.5 font-bold text-gray-700">
                      {member.resolvedCount} chats
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right">
                      {member.role !== "owner" ? (
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support analytics and metrics sidebar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Agent Security Levels</h3>
          
          <div className="space-y-3 text-xs text-gray-600">
            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
              <p className="font-bold text-indigo-900 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Owner & Admin role
              </p>
              <p className="text-[10px] text-indigo-700 leading-relaxed">
                Complete system-wide access. Can add and delete team members, configure Gemini API welcome messages, modify product catalogs, and review revenue graphs.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl space-y-1">
              <p className="font-bold text-gray-800">Support Agent role</p>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Can access the Omnichannel Inbox to read messages and type manual customer replies. Do not have permissions to modify pricing catalog models.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <span className="block text-[10px] uppercase font-bold text-gray-400">Total Team Output</span>
            <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between text-emerald-950 text-xs">
              <span className="font-semibold">AI Automated Resolution</span>
              <span className="font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100 shadow-3xs">
                72.4%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Invite Co-worker</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-900 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Mahmud"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. tanvir@aura.com.bd"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Security Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                >
                  <option value="admin">Platform Admin</option>
                  <option value="agent">Support Agent</option>
                </select>
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
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
