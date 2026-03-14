"use client";

import { useRef, useEffect, type ChangeEvent, type FormEvent } from "react";

interface Props {
  input: string;
  isLoading: boolean;
  isDark: boolean;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent) => void;
}

export default function InputBar({
  input, isLoading, isDark, handleInputChange, handleSubmit,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + "px";
    }
  }, [input]);

  return (
    <div className={`p-4 border-t backdrop-blur-xl transition-all
      ${isDark ? "border-purple-900/20 bg-black/10" : "border-purple-200/30 bg-white/20"}`}>

      <form onSubmit={handleSubmit}>
        <div className={`flex items-end gap-3 rounded-2xl px-4 py-3 transition-all
          focus-within:ring-2 focus-within:ring-violet-500/50
          ${isDark
            ? "bg-white/5 border border-white/10"
            : "bg-white/70 border border-purple-200/50 shadow-sm"
          }`}>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask SupremeAI anything..."
            rows={1}
            className={`flex-1 bg-transparent text-sm resize-none outline-none max-h-32
              ${isDark ? "text-white placeholder-gray-600" : "text-gray-900 placeholder-gray-400"}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />

          {/* Character Count */}
          {input.length > 0 && (
            <span className={`text-xs shrink-0 self-end mb-1
              ${input.length > 3000
                ? "text-red-400"
                : isDark ? "text-gray-600" : "text-gray-400"
              }`}>
              {input.length}
            </span>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700
              hover:from-violet-500 hover:to-purple-600
              disabled:opacity-30 disabled:cursor-not-allowed
              flex items-center justify-center transition-all shrink-0
              shadow-lg shadow-violet-900/30 hover:shadow-violet-500/30
              hover:scale-105 active:scale-95"
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

        <p className={`text-center text-xs mt-2
          ${isDark ? "text-gray-700" : "text-gray-400"}`}>
          Enter to send · Shift+Enter for new line · SupremeAI 👑
        </p>
      </form>
    </div>
  );
}
