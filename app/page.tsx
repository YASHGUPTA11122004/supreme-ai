"use client";

import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import AnimatedBackground from "./components/AnimatedBackground";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  return (
    <main className={`flex min-h-screen flex-col items-center relative
      ${isDark ? "text-white" : "text-gray-900"}`}>

      <AnimatedBackground isDark={isDark} />

      <div className="w-full max-w-4xl flex flex-col h-screen relative z-10">
        {/* Header */}
        <header className={`border-b p-4 flex items-center gap-3 
          backdrop-blur-xl transition-all duration-300
          ${isDark
            ? "border-purple-900/30 bg-black/20"
            : "border-purple-200/50 bg-white/30"
          }`}>

          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 
            flex items-center justify-center shadow-lg shadow-violet-900/30 glow-purple">
            <span className="text-white font-black text-lg">S</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="font-black text-xl tracking-tight">
              Supreme<span className="text-violet-400">AI</span>
            </h1>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Above All
            </p>
          </div>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-violet-400 border border-violet-400/30 
              rounded-full px-3 py-1 bg-violet-400/5">
              ● Active
            </span>
            <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
          </div>
        </header>

        <ChatWindow isDark={isDark} />
      </div>
    </main>
  );
}
