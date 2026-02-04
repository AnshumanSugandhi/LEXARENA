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
  const [selectedExplanation, setSelectedExplanation] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);


  // 🔍 Semantic Search
  async function handleSearch() {
  if (!query) return;

  setLoading(true);
  setSelectedExplanation(null);

  const res = await fetch(
    `https://web-production-757f2.up.railway.app/semantic-search?q=${encodeURIComponent(query)}`
  );

  const data: SectionResult[] = await res.json();
  setResults(data);

  setLoading(false);
}

  // 📘 Explanation Fetch
 async function handleExplain(sectionId: string) {
  setSelectedExplanation("Loading explanation...");

  const res = await fetch(
    `https://web-production-757f2.up.railway.app/explain/${sectionId}`
  );

  const data: { explanation: string } = await res.json();
  setSelectedExplanation(data.explanation);
}

  return (
    <main className="min-h-screen bg-black-100 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">LexArena ⚖️</h1>
        <p className="text-black-600 mb-6">
          Semantic Legal Search + Law Student Explanations
        </p>

        {/* Search Box */}
        <div className="flex gap-2">
          <input
            className="flex-1 border p-3 rounded-xl"
            placeholder="Search: theft punishment, snatching, religious assembly..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="bg-black text-white px-6 rounded-xl"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Results */}
        <div className="mt-8 grid grid-cols-2 gap-6">
          {/* Left: Semantic Results */}
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Top Matching Sections
            </h2>

            {results.length === 0 && (
              <p className="text-black-500">No results yet.</p>
            )}

            <div className="space-y-3">
              {results.map((item: SectionResult) => (
                <div
                  key={item.section}
                  className="p-4 bg-black-50 rounded-xl shadow hover:bg-black-100 cursor-pointer"
                  onClick={() => handleExplain(item.section)}
                >
                  <h3 className="font-bold">
                    Section {item.section}: {item.title}
                  </h3>
                  <p className="text-sm text-black-600 mt-1">
                    {item.preview}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Explanation Panel */}
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Explanation (Law Student Style)
            </h2>

            <div className="p-4 bg-black text-white rounded-xl min-h-[300px] whitespace-pre-line">
              {selectedExplanation
                ? selectedExplanation
                : "Click on a section to view explanation."}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
