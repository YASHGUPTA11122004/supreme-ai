"use client";

import { useState, useEffect } from "react";

interface Props {
  onComplete: (name: string) => void;
  isDark: boolean;
}

export default function WelcomeScreen({ onComplete, isDark }: Props) {
  const [name, setName] = useState("");
  const [step, setStep] = useState<"intro" | "name" | "greeting">("intro");
  const [greeting, setGreeting] = useState("");
  const [timeEmoji, setTimeEmoji] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
      setTimeEmoji("🌅");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
      setTimeEmoji("☀️");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
      setTimeEmoji("🌆");
    } else {
      setGreeting("Good Night");
      setTimeEmoji("🌙");
    }

    // Auto advance intro
    const timer = setTimeout(() => setStep("name"), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep("greeting");
    setTimeout(() => onComplete(name.trim()), 2500);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center
      transition-all duration-500
      ${isDark
        ? "bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0d0020]"
        : "bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50"
      }`}>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="float-1 absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
        <div className="float-2 absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #4F46E5, transparent)" }} />
      </div>

      {/* Intro Step */}
      {step === "intro" && (
        <div className="text-center animate-fadeInUp">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-700
            flex items-center justify-center mx-auto mb-6 glow-purple shadow-2xl">
            <span className="text-white font-black text-5xl">S</span>
          </div>
          <h1 className={`text-4xl font-black mb-2
            ${isDark ? "text-white" : "text-gray-900"}`}>
            Supreme<span className="text-violet-400">AI</span>
          </h1>
          <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Above All
          </p>
        </div>
      )}

      {/* Name Step */}
      {step === "name" && (
        <div className="text-center animate-fadeInUp px-6 w-full max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700
            flex items-center justify-center mx-auto mb-6 glow-purple">
            <span className="text-white font-black text-4xl">S</span>
          </div>

          <h2 className={`text-2xl font-black mb-2
            ${isDark ? "text-white" : "text-gray-900"}`}>
            Welcome to SupremeAI! 👑
          </h2>
          <p className={`text-sm mb-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Before we begin, what should I call you?
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name..."
              autoFocus
              maxLength={30}
              className={`w-full px-5 py-4 rounded-2xl text-center text-lg font-semibold
                outline-none transition-all mb-4
                focus:ring-2 focus:ring-violet-500/50
                ${isDark
                  ? "bg-white/10 text-white placeholder-gray-500 border border-white/10"
                  : "bg-white text-gray-900 placeholder-gray-400 border border-gray-200 shadow-sm"
                }`}
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700
                hover:from-violet-500 hover:to-purple-600
                disabled:opacity-30 disabled:cursor-not-allowed
                text-white font-bold text-lg transition-all
                hover:shadow-xl hover:shadow-violet-900/30
                hover:scale-105 active:scale-95"
            >
              Let's Go! 🚀
            </button>
          </form>
        </div>
      )}

      {/* Greeting Step */}
      {step === "greeting" && (
        <div className="text-center animate-fadeInUp px-6">
          <div className="text-6xl mb-4 animate-fadeIn">{timeEmoji}</div>
          <h2 className={`text-3xl font-black mb-3
            ${isDark ? "text-white" : "text-gray-900"}`}>
            {greeting},
            <span className="text-violet-400"> {name}!</span>
          </h2>
          <p className={`text-lg mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            SupremeAI is ready to dominate!
          </p>
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map(i => (
              <div key={i}
                className="w-2 h-2 bg-violet-500 rounded-full dot-bounce"
                style={{ animationDelay: `${i * 0.16}s` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
