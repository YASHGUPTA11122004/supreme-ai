"use client";

import { useRef, useEffect, useState } from "react";

const MODELS = [
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", desc: "Fastest", emoji: "⚡" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", desc: "Most Powerful", emoji: "🧠" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", desc: "Balanced", emoji: "🔥" },
];

export default function ModelSelector({
  selected, onChange, isDark, isOpen, onToggle,
}: {
  selected: string;
  onChange: (m: string) => void;
  isDark: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const current = MODELS.find(m => m.id === selected) || MODELS[0];
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, left: rect.left });
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs
          transition-all border font-medium
          ${isOpen
            ? "border-violet-500 bg-violet-500/10 text-violet-300"
            : isDark
              ? "border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
              : "border-gray-200 bg-white/80 hover:bg-gray-50 text-gray-700"
          }`}
      >
        <span>{current.emoji}</span>
        <span className="hidden sm:inline">{current.name}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          <div
            className={`fixed z-50 rounded-xl shadow-2xl min-w-[220px]
              overflow-hidden border
              ${isDark
                ? "bg-[#0d0d1a] border-white/10"
                : "bg-white border-gray-200"
              }`}
            style={{ top: pos.top, left: pos.left }}
          >
            {MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => { onChange(model.id); onToggle(); }}
                className={`w-full text-left px-4 py-3 transition-all
                  flex items-center gap-3
                  ${selected === model.id
                    ? isDark ? "bg-violet-600/30 text-violet-300" : "bg-violet-50 text-violet-700"
                    : isDark ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="text-lg">{model.emoji}</span>
                <div>
                  <div className="text-sm font-semibold">{model.name}</div>
                  <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {model.desc}
                  </div>
                </div>
                {selected === model.id && (
                  <span className="ml-auto text-violet-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
