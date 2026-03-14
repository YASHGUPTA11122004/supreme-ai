"use client";

import { useState } from "react";

interface Message {
  role: string;
  content: string;
  timestamp: Date;
}

export default function ExportChat({
  messages,
  isDark,
}: {
  messages: Message[];
  isDark: boolean;
}) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const exportAsText = () => {
    const text = messages
      .map((m) => `[${m.role.toUpperCase()}] ${new Date(m.timestamp).toLocaleString()}\n${m.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SupremeAI-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShow(false);
  };

  const exportAsJSON = () => {
    const json = JSON.stringify(messages, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SupremeAI-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShow(false);
  };

  const shareChat = () => {
    const text = messages
      .map((m) => `${m.role === "user" ? "You" : "SupremeAI"}: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShow(false); }, 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className={`text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1
          ${isDark
            ? "text-gray-400 hover:text-white hover:bg-white/10"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          }`}
      >
        📤 Export
      </button>

      {show && (
        <div className={`absolute top-8 right-0 rounded-xl shadow-2xl z-50 overflow-hidden
          min-w-[160px] border animate-fadeIn
          ${isDark ? "glass-dark border-white/10" : "glass-light border-gray-200"}`}>
          <button
            onClick={exportAsText}
            className={`w-full text-left px-4 py-3 text-sm transition-all
              ${isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-50"}`}
          >
            📄 Download .txt
          </button>
          <button
            onClick={exportAsJSON}
            className={`w-full text-left px-4 py-3 text-sm transition-all
              ${isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-50"}`}
          >
            📦 Download .json
          </button>
          <button
            onClick={shareChat}
            className={`w-full text-left px-4 py-3 text-sm transition-all
              ${isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-50"}`}
          >
            {copied ? "✓ Copied!" : "🔗 Copy to Clipboard"}
          </button>
        </div>
      )}
    </div>
  );
}
