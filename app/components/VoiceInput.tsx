"use client";

import { useState, useRef } from "react";

interface Props {
  onTranscript: (text: string) => void;
  isDark: boolean;
}

export default function VoiceInput({ onTranscript, isDark }: Props) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser. Use Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      className={`shrink-0 self-end mb-1 w-8 h-8 rounded-xl
        flex items-center justify-center transition-all
        ${isListening
          ? "bg-red-500 animate-pulse scale-110"
          : isDark
            ? "bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-500"
        }`}
      title={isListening ? "Stop listening" : "Voice input"}
    >
      {isListening ? (
        <span className="text-white text-sm">⏹</span>
      ) : (
        <span className="text-sm">🎤</span>
      )}
    </button>
  );
}
