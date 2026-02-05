"use client";

import { useState } from "react";

type SectionResult = {
  section: string;
  title: string;
  preview: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SectionResult[]>([]);
  const [selectedExplanation, setSelectedExplanation] = useState<string | null>(
    null,
  );
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [explaining, setExplaining] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // 🔍 Semantic Search
  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSelectedExplanation(null);
    setActiveSection(null);
    setResults([]);

    try {
      const res = await fetch(
        `${API_URL}/semantic-search?q=${encodeURIComponent(query)}`,
      );

      if (!res.ok) throw new Error("Failed to fetch results");

      const data: SectionResult[] = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // 📘 Explanation Fetch
  async function handleExplain(sectionId: string) {
    setActiveSection(sectionId);
    setExplaining(true);
    setSelectedExplanation(null);

    try {
      const res = await fetch(`${API_URL}/explain/${sectionId}`);
      if (!res.ok) throw new Error("Failed to fetch explanation");

      const data: { explanation: string } = await res.json();
      setSelectedExplanation(data.explanation);
    } catch (err) {
      console.error(err);
      setSelectedExplanation("Failed to load explanation. Please try again.");
    } finally {
      setExplaining(false);
    }
  }
  async function handleChat() {
    if (!query.trim()) return;

    setSelectedExplanation("Thinking...");

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setSelectedExplanation(data.answer);
    } catch (err) {
      console.error(err);
      setSelectedExplanation("⚠️ Assistant failed. Try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-black bg-white selection:bg-indigo-100 selection:text-black">
      {/* 🟢 Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <span className="text-xl font-extrabold tracking-tight text-black">
              LexArena
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 ml-2">
              BETA
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 🟢 Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-4">
            Legal Research, <span className="text-indigo-600">Simplified.</span>
          </h1>
          {/* CHANGED: text-slate-600 -> text-black */}
          <p className="text-lg text-black font-medium">
            Navigate the Bhartiya Nyaya Sanhita (BNS) with AI-powered semantic
            search and law-student style simplifications.
          </p>
        </div>

        {/* 🟢 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-16 relative group"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {/* CHANGED: text-slate-400 -> text-black */}
            <svg
              className="h-5 w-5 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            className="block w-full pl-11 pr-32 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg text-black font-medium shadow-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-600 focus:ring-0 transition-all"
            placeholder="Ex: punishment for snatching purse..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-2 absolute right-2 top-2 bottom-2">
  
  <button
    type="submit"
    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-xl"
  >
    Search
  </button>

  <button
    type="button"
    onClick={handleChat}
    className="bg-black hover:bg-gray-900 text-white font-bold px-5 rounded-xl"
  >
    Ask AI
  </button>

</div>

        </form>

        {/* 🟢 Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Results List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              {/* CHANGED: text-slate-500 -> text-black */}
              <h2 className="text-sm font-bold text-black uppercase tracking-wider">
                Relevant Sections
              </h2>
              {results.length > 0 && (
                // CHANGED: text-slate-400 -> text-black
                <span className="text-xs font-bold text-black border border-black px-2 py-0.5 rounded-full">
                  {results.length} results
                </span>
              )}
            </div>

            {results.length === 0 && !loading && (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                {/* CHANGED: text-slate-400 -> text-black */}
                <p className="text-black font-medium">
                  Try searching for a legal topic.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {results.map((item) => (
                <div
                  key={item.section}
                  onClick={() => handleExplain(item.section)}
                  className={`group relative p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                    activeSection === item.section
                      ? "bg-indigo-50 border-indigo-600"
                      : "bg-white border-gray-200 hover:border-indigo-400"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                        activeSection === item.section
                          ? "bg-indigo-100 text-indigo-900 border-indigo-200"
                          : "bg-gray-100 text-black border-gray-300"
                      }`}
                    >
                      Section {item.section}
                    </span>
                  </div>
                  {/* CHANGED: text-slate-900 -> text-black */}
                  <h3 className="font-bold text-lg mb-1 text-black">
                    {item.title}
                  </h3>
                  {/* CHANGED: text-slate-500 -> text-black */}
                  <p className="text-sm text-black line-clamp-2 leading-relaxed font-medium">
                    {item.preview}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Explanation Panel */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              {/* CHANGED: text-slate-500 -> text-black */}
              <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-4">
                Smart Explanation
              </h2>

              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm min-h-[500px] flex flex-col overflow-hidden">
                {/* Panel Header */}
                <div className="px-6 py-4 border-b-2 border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    {/* CHANGED: text-slate-600 -> text-black */}
                    <span className="text-sm font-bold text-black">
                      AI Legal Assistant
                    </span>
                  </div>
                </div>

                {/* Panel Content */}
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                  {explaining ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-32 bg-gray-100 rounded-lg border border-dashed border-gray-200 w-full mt-6"></div>
                    </div>
                  ) : selectedExplanation ? (
                    <div className="prose prose-slate max-w-none">
                      {/* CHANGED: text-slate-700 -> text-black */}
                      <div className="whitespace-pre-line text-black leading-7 text-lg font-medium">
                        {selectedExplanation}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      {/* CHANGED: text-slate-200 -> text-black (with low opacity if needed, or just black) */}
                      <svg
                        className="w-16 h-16 text-black opacity-20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      {/* CHANGED: text-slate-400 -> text-black */}
                      <p className="text-black font-bold">
                        Select a section to view the simplified explanation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
