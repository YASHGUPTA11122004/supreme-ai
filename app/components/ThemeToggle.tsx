"use client";

export default function ThemeToggle({
  isDark, toggle
}: {
  isDark: boolean;
  toggle: () => void;
}) {
  return (
    <button
      onClick={toggle}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 
        ${isDark ? "bg-violet-600" : "bg-gray-300"}`}
      title={isDark ? "Switch to Light" : "Switch to Dark"}
    >
      <div className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md 
        transition-all duration-300 flex items-center justify-center text-sm
        ${isDark ? "translate-x-7 bg-white" : "translate-x-0.5 bg-white"}`}>
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}
