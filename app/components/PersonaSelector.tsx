"use client";

import { useState } from "react";

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
    prompt: "You are an expert software engineer. Always provide clean, production-ready code with detailed explanations. Use best practices.",
  },
  {
    id: "teacher",
    name: "Teacher",
    emoji: "📚",
    prompt: "You are a patient and knowledgeable teacher. Explain concepts simply, use examples, and make learning fun.",
  },
  {
    id: "creative",
    name: "Creative Writer",
    emoji: "✍️",
    prompt: "You are a creative writing expert. Help with stories, poems, scripts, and creative content. Be imaginative and expressive.",
  },
  {
    id: "analyst",
    name: "Data Analyst",
    emoji: "📊",
    prompt: "You are a data analyst expert. Help with data analysis, statistics, SQL, Python pandas, and visualization.",
  },
];

export default function PersonaSelector({
  selected, onChange, isDark,
}: {
  selected: string;
  onChange: (id: string, prompt: string) => void;
  isDark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const current = PERSONAS.find(p => p.id === selected) || PERSONAS[0];

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
          min-w-[220px] overflow-hidden border animate-fadeIn
          ${isDark ? "glass-dark border-white/10" : "glass-light border-gray-200"}`}>
          {PERSONAS.map(persona => (
            <button
              key={persona.id}
              onClick={() => { onChange(persona.id, persona.prompt); setOpen(false); }}
              className={`w-full text-left px-4 py-3 transition-all flex items-center gap-3
                ${selected === persona.id
                  ? isDark ? "bg-violet-600/20 text-violet-300" : "bg-violet-50 text-violet-700"
                  : isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <span className="text-xl">{persona.emoji}</span>
              <div>
                <div className="text-sm font-semibold">{persona.name}</div>
              </div>
              {selected === persona.id && <span className="ml-auto text-violet-400">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
