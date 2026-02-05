"use client";

import { useState, useRef, useEffect } from "react";

// Types
type SectionResult = {
  section: string;
  title: string;
  preview: string;
};

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Home() {
  // 🔄 Mode State (Search vs Chat)
  const [mode, setMode] = useState<"search" | "chat">("search");

  // 🔍 Search State
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SectionResult[]>([]);
  const [selectedExplanation, setSelectedExplanation] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [explaining, setExplaining] = useState(false);

  // 💬 Chat State (Memory)
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  // --- HANDLERS ---

  // 1. Search Handler
  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSelectedExplanation(null);
    setActiveSection(null);
    setResults([]);

    try {
      const res = await fetch(`${API_URL}/semantic-search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Search failed.");
    } finally {
      setLoading(false);
    }
  }

  // 2. Explain Handler
  async function handleExplain(sectionId: string) {
    setActiveSection(sectionId);
    setExplaining(true);
    setSelectedExplanation(null);

    try {
      const res = await fetch(`${API_URL}/explain/${sectionId}`);
      if (!res.ok) throw new Error("Failed to fetch explanation");
      const data = await res.json();
      setSelectedExplanation(data.explanation);
    } catch (err) {
      console.error(err);
      setSelectedExplanation("Failed to load explanation.");
    } finally {
      setExplaining(false);
    }
  }

  // 3. Chat Handler (The Memory Logic)
  async function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    // A. Add User Message to Memory
    const newMsg: Message = { role: "user", text: chatInput };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      // B. Send to Backend
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: newMsg.text }),
      });

      if (!res.ok) throw new Error("Chat failed");

      const data = await res.json();

      // C. Add AI Response to Memory
      const aiMsg: Message = { role: "assistant", text: data.answer };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Sorry, I encountered an error." }]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-black bg-white">
      
      {/* 🟢 Navbar & Mode Switcher */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <span className="text-xl font-extrabold tracking-tight">LexArena</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white text-black text-xs font-bold border-2 border-black ml-2">BETA</span>
          </div>

          {/* Toggle Switch */}
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-300">
            <button
              onClick={() => setMode("search")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                mode === "search" ? "bg-white shadow-sm text-black border border-black" : "text-gray-500 hover:text-black"
              }`}
            >
              Search
            </button>
            <button
              onClick={() => setMode("chat")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                mode === "chat" ? "bg-black text-white shadow-sm" : "text-gray-500 hover:text-black"
              }`}
            >
              AI Chat
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* ================= SEARCH MODE ================= */}
        {mode === "search" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h1 className="text-4xl sm:text-5xl font-black mb-4">
                Legal Research, <span className="underline decoration-4 underline-offset-4">Simplified.</span>
              </h1>
              <p className="text-lg font-bold">Semantic search for the BNS.</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 relative">
              <input
                className="block w-full pl-6 pr-32 py-4 bg-white border-2 border-black rounded-2xl text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
                placeholder="Ex: punishment for snatching purse..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 bg-black text-white font-bold px-6 rounded-xl hover:bg-gray-800 transition-colors"
              >
                {loading ? "..." : "Search"}
              </button>
            </form>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: List */}
              <div className="lg:col-span-5 space-y-4">
                {results.map((item) => (
                  <div
                    key={item.section}
                    onClick={() => handleExplain(item.section)}
                    className={`group p-5 rounded-xl border-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${
                      activeSection === item.section ? "bg-black text-white border-black" : "bg-white border-black"
                    }`}
                  >
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border-2 ${
                       activeSection === item.section ? "bg-white text-black border-white" : "bg-gray-100 border-black"
                    }`}>Section {item.section}</span>
                    <h3 className="font-bold text-lg mt-2">{item.title}</h3>
                    <p className={`text-sm mt-1 line-clamp-2 ${activeSection === item.section ? "text-gray-300" : "text-gray-600"}`}>{item.preview}</p>
                  </div>
                ))}
              </div>

              {/* Right: Explain */}
              <div className="lg:col-span-7 sticky top-24">
                <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[500px] flex flex-col p-6">
                   <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-2 mb-4">Explanation Panel</h2>
                   {explaining ? (
                     <div className="animate-pulse space-y-4"><div className="h-4 bg-gray-200 w-3/4 rounded"/><div className="h-4 bg-gray-200 w-1/2 rounded"/></div>
                   ) : selectedExplanation ? (
                     // NO MARKDOWN HERE - Just simple text rendering
                     <div className="whitespace-pre-wrap font-medium text-black leading-7">
                        {selectedExplanation}
                     </div>
                   ) : (
                     <div className="flex-1 flex items-center justify-center text-gray-400 font-bold">Select a section to explain</div>
                   )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= CHAT MODE ================= */}
        {mode === "chat" && (
          <div className="max-w-3xl mx-auto h-[80vh] flex flex-col bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="p-4 border-b-2 border-black bg-gray-50 flex items-center justify-between">
              <span className="font-black text-lg">AI Legal Assistant</span>
              <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">RAG Enabled</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                  <span className="text-6xl mb-4">⚖️</span>
                  <p className="font-bold">Ask anything about the BNS law.</p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl border-2 text-sm font-medium whitespace-pre-wrap ${
                    m.role === "user" 
                      ? "bg-black text-white border-black rounded-br-none" 
                      : "bg-gray-100 text-black border-black rounded-bl-none"
                  }`}>
                    {/* NO MARKDOWN HERE - Just simple text rendering */}
                    {m.text}
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-black border-2 border-black px-4 py-2 rounded-2xl rounded-bl-none animate-pulse font-bold text-sm">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-50 border-t-2 border-black">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                  placeholder="Ask a legal question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                />
                <button 
                  type="submit" 
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-black text-white font-bold px-6 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </form>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}