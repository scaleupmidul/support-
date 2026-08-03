/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Cpu, Clock, AlertCircle, Sparkles, Check, 
  RefreshCw, Settings, ToggleLeft, ToggleRight, Calendar
} from "lucide-react";

export default function Automation() {
  const [welcomeEnabled, setWelcomeEnabled] = useState(true);
  const [awayEnabled, setAwayEnabled] = useState(true);
  const [followUpEnabled, setFollowUpEnabled] = useState(false);
  const [cartReminderEnabled, setCartReminderEnabled] = useState(true);
  const [orderConfirmationEnabled, setOrderConfirmationEnabled] = useState(true);
  const [shippingUpdateEnabled, setShippingUpdateEnabled] = useState(true);

  const [welcomeText, setWelcomeText] = useState("Assalamu Alaikum! Thanks for reaching out. How can we help you explore our premium sarees or kurtis today?");
  const [awayText, setAwayText] = useState("Thank you for your message. Our boutique showroom is currently closed. We've recorded your message, and a human agent or our intelligent AI assistant will respond as soon as we open at 10:00 AM.");
  const [cartReminderText, setCartReminderText] = useState("Hey! We noticed you left some lovely apparel items in your cart. Stocks of our exclusive designer sarees are running out soon. Complete your Cash on Delivery order now to secure free shipping!");
  const [orderConfirmationText, setOrderConfirmationText] = useState("Great news! Your order #ORD-{{order_id}} has been confirmed. We've logged your shipping address in {{delivery_area}}. Thank you for shopping with us!");
  const [shippingUpdateText, setShippingUpdateText] = useState("Excited to update you that your package has been shipped out and handed over to our delivery representative. It will reach your doorstep shortly!");

  const [businessHours, setBusinessHours] = useState({
    start: "10:00 AM",
    end: "08:30 PM",
    days: "Monday - Sunday"
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="pb-2 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">AI Automation Rules</h1>
          <p className="text-sm text-gray-500">Enable automated event-driven triggers, set offline office hours, and draft personalized system reminders.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-55"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save Automation Parameters"}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-bold flex items-center gap-1.5 text-left">
          <Check className="w-4 h-4 text-green-600" /> Automation workflows successfully updated and synchronized globally!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Core Triggers Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Welcome & Away messages */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-5">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-indigo-600" />
              Greeting & Presence Automations
            </h2>

            {/* Welcome message trigger */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">Welcome Message Trigger</p>
                  <p className="text-[10px] text-gray-500 font-medium">Dispatched instantly upon first customer inbound ping.</p>
                </div>
                <button onClick={() => setWelcomeEnabled(!welcomeEnabled)} className="text-gray-400 hover:text-indigo-600">
                  {welcomeEnabled ? <ToggleRight className="w-10 h-10 text-indigo-600" /> : <ToggleLeft className="w-10 h-10 text-gray-300" />}
                </button>
              </div>
              {welcomeEnabled && (
                <textarea
                  value={welcomeText}
                  onChange={(e) => setWelcomeText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none"
                />
              )}
            </div>

            {/* Away message trigger */}
            <div className="space-y-2 pt-2 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">Away Message Trigger</p>
                  <p className="text-[10px] text-gray-500 font-medium">Dispatched if inbounds occur outside set business hours.</p>
                </div>
                <button onClick={() => setAwayEnabled(!awayEnabled)} className="text-gray-400 hover:text-indigo-600">
                  {awayEnabled ? <ToggleRight className="w-10 h-10 text-indigo-600" /> : <ToggleLeft className="w-10 h-10 text-gray-300" />}
                </button>
              </div>
              {awayEnabled && (
                <textarea
                  value={awayText}
                  onChange={(e) => setAwayText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Commerce & Checkout Alerts */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-5">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
              E-Commerce & Transactional Reminders
            </h2>

            {/* Abandoned Cart reminders */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">Abandoned Cart Follow-Up</p>
                  <p className="text-[10px] text-gray-500 font-medium">Auto-dispatch after 3 hours of idle items sitting in cart checkout.</p>
                </div>
                <button onClick={() => setCartReminderEnabled(!cartReminderEnabled)} className="text-gray-400 hover:text-indigo-600">
                  {cartReminderEnabled ? <ToggleRight className="w-10 h-10 text-indigo-600" /> : <ToggleLeft className="w-10 h-10 text-gray-300" />}
                </button>
              </div>
              {cartReminderEnabled && (
                <textarea
                  value={cartReminderText}
                  onChange={(e) => setCartReminderText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none"
                />
              )}
            </div>

            {/* Order Confirmation trigger */}
            <div className="space-y-2 pt-2 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">Order Confirmation Message</p>
                  <p className="text-[10px] text-gray-500 font-medium">Auto-dispatch immediately after Cash on Delivery address verified by AI.</p>
                </div>
                <button onClick={() => setOrderConfirmationEnabled(!orderConfirmationEnabled)} className="text-gray-400 hover:text-indigo-600">
                  {orderConfirmationEnabled ? <ToggleRight className="w-10 h-10 text-indigo-600" /> : <ToggleLeft className="w-10 h-10 text-gray-300" />}
                </button>
              </div>
              {orderConfirmationEnabled && (
                <textarea
                  value={orderConfirmationText}
                  onChange={(e) => setOrderConfirmationText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none font-mono text-[10px]"
                />
              )}
            </div>

            {/* Shipping Update trigger */}
            <div className="space-y-2 pt-2 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">Shipping Transit Alert</p>
                  <p className="text-[10px] text-gray-500 font-medium">Auto-dispatch when delivery representative updates parcel status.</p>
                </div>
                <button onClick={() => setShippingUpdateEnabled(!shippingUpdateEnabled)} className="text-gray-400 hover:text-indigo-600">
                  {shippingUpdateEnabled ? <ToggleRight className="w-10 h-10 text-indigo-600" /> : <ToggleLeft className="w-10 h-10 text-gray-300" />}
                </button>
              </div>
              {shippingUpdateEnabled && (
                <textarea
                  value={shippingUpdateText}
                  onChange={(e) => setShippingUpdateText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right column: Business Hours & Automation Info */}
        <div className="space-y-6">
          {/* Business Hours Settings */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-gray-400" />
              Store Business Hours
            </h2>
            <p className="text-xs text-gray-500 leading-normal font-normal">
              Specify active operation windows. Inbound customer pings outside these bounds automatically trigger the custom Away response.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Weekly Schedule</label>
                <input
                  type="text"
                  value={businessHours.days}
                  onChange={(e) => setBusinessHours({ ...businessHours, days: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none font-semibold text-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Open Time</label>
                  <input
                    type="text"
                    value={businessHours.start}
                    onChange={(e) => setBusinessHours({ ...businessHours, start: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none font-semibold text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Close Time</label>
                  <input
                    type="text"
                    value={businessHours.end}
                    onChange={(e) => setBusinessHours({ ...businessHours, end: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none font-semibold text-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Workflows status */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Clock className="w-4.5 h-4.5 text-gray-400" />
              Dynamic Reminders & Intervals
            </h2>

            <div className="space-y-3.5">
              <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs border border-gray-100">
                <div className="text-left">
                  <p className="font-bold text-gray-900">Auto-Follow-Up (Idle)</p>
                  <p className="text-[10px] text-gray-400 font-semibold">After 24 hours of no response</p>
                </div>
                <button onClick={() => setFollowUpEnabled(!followUpEnabled)}>
                  {followUpEnabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
                </button>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs border border-gray-100">
                <div className="text-left">
                  <p className="font-bold text-gray-900">WhatsApp Notification Alerts</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Dispatched upon order shipment</p>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
