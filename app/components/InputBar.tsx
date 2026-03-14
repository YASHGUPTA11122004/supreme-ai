"use client";

import type { ChangeEvent, FormEvent } from "react";

interface InputBarProps {
  input: string;
  isLoading: boolean;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent) => void;
}

export default function InputBar({
  input,
  isLoading,
  handleInputChange,
  handleSubmit,
}: InputBarProps) {
  return (
    <div className="border-t border-purple-900/30 p-4 bg-gray-950/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex items-end gap-3 bg-gray-800/80 border border-gray-700/50 rounded-2xl px-4 py-3 focus-within:border-violet-500/50 transition-colors">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask SupremeAI anything..."
            rows={1}
            className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder-gray-600 max-h-32"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 
                       hover:from-violet-500 hover:to-purple-600
                       disabled:opacity-30 disabled:cursor-not-allowed
                       flex items-center justify-center transition-all shrink-0
                       shadow-lg shadow-violet-900/30"
          >
            {isLoading ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-gray-700 text-xs mt-2">
          Enter to send · Shift+Enter for new line · SupremeAI 👑
        </p>
      </form>
    </div>
  );
}
