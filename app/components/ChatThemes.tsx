"use client";

export const THEMES = [
  { id: "purple", name: "Purple", primary: "#7C3AED" },
  { id: "blue", name: "Ocean", primary: "#2563EB" },
  { id: "green", name: "Forest", primary: "#059669" },
  { id: "red", name: "Fire", primary: "#DC2626" },
  { id: "orange", name: "Sunset", primary: "#EA580C" },
  { id: "pink", name: "Rose", primary: "#DB2777" },
];

export default function ChatThemes({
  selected, onChange, isDark, isOpen, onToggle,
}: {
  selected: string;
  onChange: (id: string) => void;
  isDark: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
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
        🎨 <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          <div className={`absolute top-10 right-0 rounded-xl shadow-2xl z-50
            p-3 border
            ${isDark
              ? "bg-gray-900/95 border-white/10 backdrop-blur-xl"
              : "bg-white border-gray-200 shadow-xl"
            }`}>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => { onChange(theme.id); onToggle(); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl
                    transition-all hover:scale-105
                    ${selected === theme.id
                      ? isDark ? "bg-white/10" : "bg-gray-100"
                      : "hover:bg-white/5"
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
        </>
      )}
    </div>
  );
}
