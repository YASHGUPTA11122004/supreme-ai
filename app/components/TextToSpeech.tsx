"use client";

import { useState } from "react";

export default function TextToSpeech({
  text, isDark,
}: {
  text: string;
  isDark: boolean;
}) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (typeof window === "undefined") return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      text.replace(/[#*`]/g, "").trim()
    );
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const english = voices.find(v => v.lang.startsWith("en"));
    if (english) utterance.voice = english;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className={`text-xs px-2 py-0.5 rounded-full transition-all
        ${speaking
          ? "text-violet-400 bg-violet-400/10 animate-pulse"
          : isDark
            ? "text-gray-500 hover:text-white hover:bg-white/10"
            : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
        }`}
      title={speaking ? "Stop speaking" : "Read aloud"}
    >
      {speaking ? "⏹ Stop" : "🔊 Listen"}
    </button>
  );
}
