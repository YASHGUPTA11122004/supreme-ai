"use client";

const suggestions = [
  { icon: "💻", title: "Write Code", prompt: "Write a React component that..." },
  { icon: "🐛", title: "Debug", prompt: "Help me debug this code:\n\n" },
  { icon: "📖", title: "Explain", prompt: "Explain how this works in simple terms:\n\n" },
  { icon: "⚡", title: "Optimize", prompt: "How can I optimize this code for better performance:\n\n" },
  { icon: "🎨", title: "Design", prompt: "Help me design a system architecture for..." },
  { icon: "🔒", title: "Security", prompt: "Review this code for security vulnerabilities:\n\n" },
];

export default function PromptSuggestions({
  isDark,
  onSelect,
}: {
  isDark: boolean;
  onSelect: (prompt: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 animate-fadeIn">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 
          flex items-center justify-center mx-auto mb-4 glow-purple shadow-2xl">
          <span className="text-white font-black text-3xl">S</span>
        </div>
        <h2 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          Supreme<span className="text-violet-400">AI</span>
        </h2>
        <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Above All — How can I dominate for you today?
        </p>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s.prompt)}
            className={`p-4 rounded-xl text-left transition-all duration-200
              hover:scale-105 hover:shadow-lg group
              ${isDark
                ? "glass-dark hover:bg-white/10 hover:border-violet-500/30"
                : "glass-light hover:bg-white hover:shadow-violet-100"
              }`}
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-sm font-semibold mb-1
              ${isDark ? "text-white" : "text-gray-800"}`}>
              {s.title}
            </div>
            <div className={`text-xs line-clamp-1
              ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {s.prompt}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
