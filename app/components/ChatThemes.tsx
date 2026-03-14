"use client";

import { useState } from "react";

export const THEMES = [
  { id: "purple", name: "Purple", primary: "#7C3AED", bg: "from-[#0a0015] to-[#1a0035]" },
  { id: "blue", name: "Ocean", primary: "#2563EB", bg: "from-[#001529] to-[#003580]" },
  { id: "green", name: "Forest", primary: "#059669", bg: "from-[#001a0d] to-[#003320]" },
  { id: "red", name: "Fire", primary: "#DC2626", bg: "from-[#1a0000] to-[#3d0000]" },
  { id: "orange", name: "Sunset", primary: "#EA580C", bg: "from-[#1a0800] to-[#3d1500]" },
  { id: "pink", name: "Rose", primary: "#DB2777", bg: "from-[#1a0012] to-[#3d0030]" },
];

export default function ChatThemes({
  selected, onChange, isDark,
}: {
  selected: string;
  onChange: (id: string) => void;
  isDark: boolean;
}) {
  const [open, setOpen] = useState(false);

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
        🎨 Theme
      </button>

      {open && (
        <div className={`absolute top-9 right-0 rounded-xl shadow-2xl z-50
          p-3 border animate-fadeIn
          ${isDark ? "glass-dark border-white/10" : "glass-light border-gray-200"}`}>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => { onChange(theme.id); setOpen(false); }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl
                  transition-all hover:scale-105
                  ${selected === theme.id
                    ? isDark ? "bg-white/20" : "bg-gray-100"
                    : "hover:bg-white/10"
                  }`}
              >
                <div
                  className="w-8 h-8 rounded-lg shadow-md"
                  style={{ background: theme.primary }}
                />
                <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {theme.name}
                </span>
                {selected === theme.id && (
                  <span className="text-xs text-violet-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
