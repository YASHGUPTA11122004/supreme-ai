"use client";

import { useRef, useEffect, useState } from "react";

export const PERSONAS = [
  {
    id: "default",
    name: "SupremeAI",
    emoji: "👑",
    prompt: "You are SupremeAI — the most powerful AI assistant. Above All. Be confident and precise.",
  },
  {
    id: "coder",
    name: "Code Expert",
    emoji: "💻",
    prompt: "You are an expert software engineer. Always provide clean, production-ready code with detailed explanations.",
  },
  {
    id: "teacher",
    name: "Teacher",
    emoji: "📚",
    prompt: "You are a patient and knowledgeable teacher. Explain concepts simply with examples.",
  },
  {
    id: "creative",
    name: "Creative Writer",
    emoji: "✍️",
    prompt: "You are a creative writing expert. Help with stories, poems, scripts. Be imaginative.",
  },
  {
    id: "analyst",
    name: "Data Analyst",
    emoji: "📊",
    prompt: "You are a data analyst expert. Help with data analysis, statistics, SQL, Python pandas.",
  },
];

export default function PersonaSelector({
  selected, onChange, isDark, isOpen, onToggle,
}: {
  selected: string;
  onChange: (id: string, prompt: string) => void;
  isDark: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const current = PERSONAS.find(p => p.id === selected) || PERSONAS[0];
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
            {PERSONAS.map(persona => (
              <button
                key={persona.id}
                onClick={() => { onChange(persona.id, persona.prompt); onToggle(); }}
                className={`w-full text-left px-4 py-3 transition-all
                  flex items-center gap-3
                  ${selected === persona.id
                    ? isDark ? "bg-violet-600/30 text-violet-300" : "bg-violet-50 text-violet-700"
                    : isDark ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="text-xl">{persona.emoji}</span>
                <div className="text-sm font-semibold">{persona.name}</div>
                {selected === persona.id && (
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
