"use client";

import { useState } from "react";
import { storage } from "@/app/lib/storage";

export default function UsageStats({ isDark }: { isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const settings = storage.getSettings();
  const chats = storage.getChats();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs
          transition-all border
          ${isDark
            ? "border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
            : "border-gray-200 bg-white/80 hover:bg-gray-50 text-gray-700"
          }`}
      >
        📊 Stats
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`absolute top-9 right-0 rounded-2xl shadow-2xl z-50
            p-4 border animate-fadeIn min-w-[220px]
            ${isDark ? "glass-dark border-white/10" : "glass-light border-gray-200"}`}>

            <h3 className={`font-bold text-sm mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              📊 Usage Stats
            </h3>

            <div className="space-y-3">
              {[
                { label: "Total Chats", value: chats.length, emoji: "💬" },
                { label: "Total Messages", value: settings.totalMessages, emoji: "📨" },
                { label: "Est. Tokens", value: settings.totalTokens.toLocaleString(), emoji: "🔢" },
                { label: "Current Model", value: settings.selectedModel.split("-").slice(1).join(" "), emoji: "🤖" },
                { label: "Active Persona", value: settings.selectedPersona, emoji: "🎭" },
              ].map((stat, i) => (
                <div key={i} className={`flex items-center justify-between
                  pb-2 border-b last:border-0
                  ${isDark ? "border-white/5" : "border-gray-100"}`}>
                  <span className={`text-xs flex items-center gap-1
                    ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {stat.emoji} {stat.label}
                  </span>
                  <span className={`text-xs font-bold
                    ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                storage.saveSettings({ totalMessages: 0, totalTokens: 0 });
                setOpen(false);
              }}
              className={`mt-3 w-full text-xs py-1.5 rounded-lg transition-all
                ${isDark
                  ? "text-red-400 hover:bg-red-400/10"
                  : "text-red-500 hover:bg-red-50"
                }`}
            >
              Reset Stats
            </button>
          </div>
        </>
      )}
    </div>
  );
}
