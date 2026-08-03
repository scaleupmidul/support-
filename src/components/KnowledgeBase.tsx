/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, Sparkles, Plus, Search, Trash, Edit, HelpCircle, 
  Check, Eye, EyeOff, Loader2, AlertCircle, RefreshCw 
} from "lucide-react";
import { KnowledgeArticle, FAQ } from "../types.js";

interface KnowledgeBaseProps {
  articles: KnowledgeArticle[];
  faqs: FAQ[];
  onAddArticle: (article: Omit<KnowledgeArticle, "id" | "updatedAt">) => Promise<any>;
  onDeleteArticle: (id: string) => Promise<any>;
  onAddFAQ: (faq: Omit<FAQ, "id" | "updatedAt">) => Promise<any>;
  onDeleteFAQ: (id: string) => Promise<any>;
}

export default function KnowledgeBase({ 
  articles, faqs, onAddArticle, onDeleteArticle, onAddFAQ, onDeleteFAQ 
}: KnowledgeBaseProps) {
  const [activeTab, setActiveTab] = useState<"articles" | "faqs">("articles");
  const [searchQuery, setSearchQuery] = useState("");

  // Article Modal
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [artTitle, setArtTitle] = useState("");
  const [artCategory, setArtCategory] = useState("General");
  const [artContent, setArtContent] = useState("");
  const [artStatus, setArtStatus] = useState<"published" | "draft">("published");

  // FAQ Modal & AI Generator state
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqTags, setFaqTags] = useState("");
  const [generatingFAQ, setGeneratingFAQ] = useState(false);
  const [aiDraftError, setAiDraftError] = useState("");

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim() || !artContent.trim()) return;

    await onAddArticle({
      title: artTitle,
      category: artCategory,
      content: artContent,
      status: artStatus
    });

    setArtTitle("");
    setArtContent("");
    setArtCategory("General");
    setShowArticleModal(false);
  };

  const handleAddFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    const parsedTags = faqTags
      ? faqTags.split(",").map(t => t.trim()).filter(Boolean)
      : ["General"];

    await onAddFAQ({
      question: faqQuestion,
      answer: faqAnswer,
      tags: parsedTags
    });

    setFaqQuestion("");
    setFaqAnswer("");
    setFaqTags("");
    setShowFAQModal(false);
  };

  // Call server-side Gemini grounding generator to draft answers
  const handleGenerateFAQWithAI = async () => {
    if (!faqQuestion.trim()) {
      setAiDraftError("Please input a customer question first.");
      return;
    }

    setGeneratingFAQ(true);
    setAiDraftError("");
    try {
      const res = await fetch("/api/faqs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: faqQuestion })
      });

      if (res.ok) {
        const data = await res.json();
        setFaqAnswer(data.answer);
        if (data.tags) {
          setFaqTags(data.tags.join(", "));
        }
      } else {
        throw new Error("Failed to generate response");
      }
    } catch (e) {
      console.error(e);
      setAiDraftError("AI generation failed. Operating in fallback draft mode.");
      setFaqAnswer(`We provide customized client assistance for queries regarding "${faqQuestion}". Contact our agents for sizing/delivery specs.`);
      setFaqTags("Assistance");
    } finally {
      setGeneratingFAQ(false);
    }
  };

  const filteredArticles = articles.filter(a =>
    (a.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (a.category || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (a.content || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const filteredFAQs = faqs.filter(f =>
    (f.question || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (f.answer || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (f.tags || []).some(t => (t || '').toLowerCase().includes((searchQuery || '').toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-100 gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Knowledge & FAQS</h1>
          <p className="text-sm text-gray-500">Provide rich articles and FAQ documents. Gemini AI automatically learns these to resolve chats.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 text-xs font-semibold self-start sm:self-center">
          <button
            onClick={() => setActiveTab("articles")}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "articles" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
          >
            <BookOpen className="w-4 h-4" />
            Support Articles ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "faqs" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
          >
            <HelpCircle className="w-4 h-4" />
            FAQ Shortcuts ({faqs.length})
          </button>
        </div>
      </div>

      {/* SEARCH AND TRIGGER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === "articles" ? "Search articles by title, categories..." : "Search FAQs by question, tags..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        
        {activeTab === "articles" ? (
          <button
            onClick={() => setShowArticleModal(true)}
            className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-sm text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Support Document
          </button>
        ) : (
          <button
            onClick={() => setShowFAQModal(true)}
            className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add FAQ Question
          </button>
        )}
      </div>

      {/* ARTICLES PANEL */}
      {activeTab === "articles" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 text-left">
          {filteredArticles.map(art => (
            <div key={art.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-[9px] font-bold tracking-wide uppercase">
                    {art.category}
                  </span>
                  <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase ${art.status === "published" ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-100 text-gray-500"}`}>
                    {art.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-950 leading-snug line-clamp-1">{art.title}</h3>
                <p className="text-xs text-gray-500 font-normal leading-relaxed line-clamp-4 whitespace-pre-line h-20">
                  {art.content}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-4">
                <span className="text-[10px] text-gray-400 font-semibold">
                  Updated: {new Date(art.updatedAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onDeleteArticle(art.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQS PANEL */}
      {activeTab === "faqs" && (
        <div className="space-y-3.5 text-left">
          {filteredFAQs.map(faq => (
            <div key={faq.id} className="p-4.5 bg-white border border-gray-100 rounded-2xl shadow-2xs flex gap-4 items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">Q</span>
                  <h3 className="text-xs font-semibold text-gray-900">{faq.question}</h3>
                </div>
                <div className="flex items-start gap-2 pl-7 text-xs font-normal text-gray-500 leading-relaxed">
                  <p>{faq.answer}</p>
                </div>
                <div className="flex flex-wrap gap-1 pl-7 pt-1">
                  {(faq.tags || []).map(tag => (
                    <span key={tag} className="px-2 py-0.2 bg-gray-100 text-gray-500 rounded-md font-bold text-[9px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onDeleteFAQ(faq.id)}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors shrink-0"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Article Modal */}
      {showArticleModal && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Write New Support Document</h3>
              <button onClick={() => setShowArticleModal(false)} className="text-gray-400 hover:text-gray-900 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleAddArticle} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Document Category</label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                  >
                    <option value="Shipping">Shipping & Courier</option>
                    <option value="Returns">Returns & Refunds</option>
                    <option value="Sizing">Sizing & Measurements</option>
                    <option value="Outlet">Boutique Location</option>
                    <option value="General">General Inquiries</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Publish Status</label>
                  <select
                    value={artStatus}
                    onChange={(e) => setArtStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sizing charts and details"
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Document Content *</label>
                <textarea
                  required
                  placeholder="Insert detailed terms, policies, return structures, measurements, addresses, etc."
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none resize-none font-sans leading-relaxed"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="w-1/2 py-2 border rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-xs font-semibold"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add FAQ Modal with AI generator */}
      {showFAQModal && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Add FAQ Question</h3>
              <button onClick={() => setShowFAQModal(false)} className="text-gray-400 hover:text-gray-900 font-bold text-lg">×</button>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1 text-indigo-900 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Google Gemini Draft Generator</span>
              </div>
              <p className="font-normal text-[11px] leading-relaxed">
                Type the customer question, and click the AI Sparkle button. Gemini will search your active support documents above to draft an accurate company answer and tags automatically!
              </p>
            </div>

            <form onSubmit={handleAddFAQ} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">FAQ Question *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Do you offer Cash on Delivery in Rajshahi?"
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateFAQWithAI}
                    disabled={generatingFAQ || !faqQuestion.trim()}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg shadow-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    {generatingFAQ ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Draft
                      </>
                    )}
                  </button>
                </div>
                {aiDraftError && (
                  <p className="text-[10px] text-amber-600 font-semibold mt-1">{aiDraftError}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Answer *</label>
                <textarea
                  required
                  placeholder="Write the response or generate it using the AI draft tool above..."
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Payment, COD, Delivery"
                  value={faqTags}
                  onChange={(e) => setFaqTags(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFAQModal(false)}
                  className="w-1/2 py-2 border rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-xs font-semibold"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
