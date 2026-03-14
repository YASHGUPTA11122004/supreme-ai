"use client";

import { useState } from "react";

const MODELS = [
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", desc: "Fastest", emoji: "⚡" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", desc: "Most Powerful", emoji: "🧠" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", desc: "Balanced", emoji: "🔥" },
];

export default function ModelSelector({
  selected, onChange, isDark,
}: {
  selected: string;
  onChange: (m: string) => void;
  isDark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const current = MODELS.find(m => m.id === selected) || MODELS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs
          transition-all border font-medium
          ${isDark
            ? "border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
            : "border-gray-200 bg-white/80 hover:bg-gray-50 text-gray-700"
          }`}
      >
        <span>{current.emoji}</span>
        <span>{current.name}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className={`absolute top-9 left-0 rounded-xl shadow-2xl z-50
          min-w-[200px] overflow-hidden border animate-fadeIn
          ${isDark ? "glass-dark border-white/10" : "glass-light border-gray-200"}`}>
          {MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => { onChange(model.id); setOpen(false); }}
              className={`w-full text-left px-4 py-3 transition-all
                flex items-center gap-3
                ${selected === model.id
                  ? isDark ? "bg-violet-600/20 text-violet-300" : "bg-violet-50 text-violet-700"
                  : isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <span className="text-lg">{model.emoji}</span>
              <div>
                <div className="text-sm font-semibold">{model.name}</div>
                <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {model.desc}
                </div>
              </div>
              {selected === model.id && <span className="ml-auto text-violet-400">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
