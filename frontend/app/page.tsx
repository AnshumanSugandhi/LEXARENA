"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  async function sendMessage() {
    if (!query.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", text: query },
    ];

    setMessages(newMessages);
    setQuery("");

    const res = await fetch(
      "https://web-production-757f2.up.railway.app/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      }
    );

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "assistant", text: data.answer },
    ]);
  }

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 text-xl font-bold bg-white shadow">
        LexArena ⚖️ AI Legal Assistant
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-xl ${
              m.role === "user"
                ? "ml-auto bg-blue-200"
                : "mr-auto bg-white shadow"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2 bg-white border-t">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about any legal section..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </main>
  );
}
