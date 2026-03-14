"use client";

import { useRef, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import VoiceInput from "./VoiceInput";
import ImageUpload from "./ImageUpload";

interface InputBarProps {
  input: string;
  isLoading: boolean;
  isDark: boolean;
  systemPrompt: string;
  onSystemPromptChange: (p: string) => void;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent, imageData?: { base64: string; mimeType: string }) => void;
}

export default function InputBar({
  input, isLoading, isDark, systemPrompt,
  onSystemPromptChange, handleInputChange, handleSubmit,
}: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ base64: string; mimeType: string } | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmit(e, pendingImage || undefined);
    setPendingImage(null);
  };

  return (
    <div className={`p-4 border-t backdrop-blur-xl transition-all
      ${isDark ? "border-purple-900/20 bg-black/10" : "border-purple-200/30 bg-white/20"}`}>

      {/* System Prompt */}
      {showSystemPrompt && (
        <div className={`mb-3 p-3 rounded-xl border text-xs animate-fadeIn
          ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200"}`}>
          <div className={`flex items-center justify-between mb-2
            ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <span className="font-semibold">🎯 System Prompt</span>
            <button onClick={() => setShowSystemPrompt(false)}>✕</button>
          </div>
          <textarea
            value={systemPrompt}
            onChange={e => onSystemPromptChange(e.target.value)}
            rows={3}
            className={`w-full bg-transparent outline-none resize-none text-xs
              ${isDark ? "text-gray-300" : "text-gray-700"}`}
          />
        </div>
      )}

      {/* Image Preview */}
      {pendingImage && (
        <div className="mb-3 flex items-center gap-2 animate-fadeIn">
          <img
            src={`data:${pendingImage.mimeType};base64,${pendingImage.base64}`}
            className="w-16 h-16 rounded-xl object-cover border border-violet-500/30"
            alt="preview"
          />
          <button
            onClick={() => setPendingImage(null)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            ✕ Remove
          </button>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className={`flex items-end gap-2 rounded-2xl px-3 py-3 transition-all
          focus-within:ring-2 focus-within:ring-violet-500/40
          ${isDark
            ? "bg-white/5 border border-white/10 focus-within:border-violet-500/30"
            : "bg-white/80 border border-gray-200 shadow-sm"
          }`}>

          {/* System Prompt Toggle */}
          <button
            type="button"
            onClick={() => setShowSystemPrompt(!showSystemPrompt)}
            className={`shrink-0 self-end mb-1 text-lg transition-all hover:scale-110
              ${showSystemPrompt ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
          >
            🎯
          </button>

          {/* Image Upload */}
          <ImageUpload onImage={(b, m) => setPendingImage({ base64: b, mimeType: m })} isDark={isDark} />

          {/* Voice Input */}
          <VoiceInput
            onTranscript={text => {
              const synth = { target: { value: input + (input ? " " : "") + text } };
              handleInputChange(synth as any);
            }}
            isDark={isDark}
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask SupremeAI anything..."
            rows={1}
            className={`flex-1 bg-transparent text-sm resize-none outline-none max-h-40
              ${isDark ? "text-white placeholder-gray-600" : "text-gray-900 placeholder-gray-400"}`}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e as any);
              }
            }}
          />

          {/* Counter */}
          {input.length > 0 && (
            <div className={`text-xs shrink-0 self-end mb-1 text-right
              ${input.length > 3000 ? "text-red-400" : isDark ? "text-gray-600" : "text-gray-400"}`}>
              <div>{wordCount}w</div>
            </div>
          )}

          {/* Send */}
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !pendingImage)}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700
              hover:from-violet-500 hover:to-purple-600
              disabled:opacity-30 disabled:cursor-not-allowed
              flex items-center justify-center transition-all shrink-0
              shadow-lg hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <p className={`text-center text-xs mt-2 ${isDark ? "text-gray-700" : "text-gray-400"}`}>
          Enter to send · Shift+Enter for new line · SupremeAI 👑
        </p>
      </form>
    </div>
  );
}
