"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import TextToSpeech from "./TextToSpeech";
import type { Message } from "@/app/lib/storage";

interface Props {
  message: Message;
  isDark: boolean;
  onEdit: (id: string, newContent: string) => void;
  isLast: boolean;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

const REACTIONS = ["👍", "👎", "❤️", "🔥", "💡"];

export default function MessageBubble({
  message, isDark, onEdit, isLast, isStreaming, onRegenerate
}: Props) {
  const isUser = message.role === "user";
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<string[]>(message.reactions || []);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(message.id, editText);
      setIsEditing(false);
    }
  };

  const handleReaction = (emoji: string) => {
    setReactions(prev =>
      prev.includes(emoji) ? prev.filter(r => r !== emoji) : [...prev, emoji]
    );
    setShowReactions(false);
  };

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={`flex items-end gap-2 group
        ${isUser ? "justify-end animate-slideInRight" : "justify-start animate-slideInLeft"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowReactions(false); }}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-900
          flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/30">
          <span className="text-white font-black text-xs">S</span>
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[80%]">
        {/* Role Label */}
        <span className={`text-xs px-1 ${isUser ? "text-right" : "text-left"}
          ${isDark ? "text-gray-600" : "text-gray-400"}`}>
          {isUser ? "You" : "SupremeAI · Gemini"}
        </span>

        {/* Edit Mode */}
        {isEditing ? (
          <div className={`rounded-2xl p-3 border border-violet-500/50
            ${isDark ? "bg-white/10" : "bg-white shadow-sm"}`}>
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className={`w-full bg-transparent text-sm outline-none resize-none min-h-[60px]
                ${isDark ? "text-white" : "text-gray-900"}`}
              autoFocus
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all
                  ${isDark ? "bg-white/10 text-gray-300 hover:bg-white/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="text-xs px-3 py-1.5 rounded-lg bg-violet-600
                  hover:bg-violet-500 text-white transition-all"
              >
                Save & Resend ↑
              </button>
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl px-4 py-3 text-sm transition-all
            ${isUser
              ? isDark
                ? "bg-violet-600 text-white rounded-br-sm shadow-lg shadow-violet-900/40"
                : "bg-violet-500 text-white rounded-br-sm shadow-md"
              : isDark
                ? "glass-dark text-gray-100 rounded-bl-sm"
                : "glass-light text-gray-800 rounded-bl-sm shadow-sm"
            } ${isStreaming && isLast && !isUser ? "cursor-blink" : ""}`}>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match) {
                    return (
                      <CodeBlock
                        language={match[1]}
                        code={String(children).replace(/\n$/, "")}
                        isDark={isDark}
                      />
                    );
                  }
                  return (
                    <code className={`rounded px-1.5 py-0.5 text-xs font-mono
                      ${isDark ? "bg-white/10 text-violet-300" : "bg-violet-50 text-violet-600"}`}
                      {...props}>
                      {children}
                    </code>
                  );
                },
                strong: ({ children }) => (
                  <strong className="text-violet-300 font-bold">{children}</strong>
                ),
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>
                ),
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold mb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold mb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold mb-1">{children}</h3>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Reactions Display */}
        {reactions.length > 0 && (
          <div className="flex gap-1 px-1">
            {reactions.map((r, i) => (
              <button
                key={i}
                onClick={() => handleReaction(r)}
                className={`text-sm px-2 py-0.5 rounded-full transition-all
                  ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Actions Row */}
        <div className={`flex items-center gap-2 px-1 transition-all duration-200
          ${showActions ? "opacity-100" : "opacity-0"}`}>

          <span className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
            {formatTime(message.timestamp)}
          </span>

          <button onClick={handleCopy}
            className={`text-xs px-2 py-0.5 rounded-full transition-all
              ${isDark ? "text-gray-500 hover:text-white hover:bg-white/10"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}>
            {copied ? "✓" : "Copy"}
          </button>

          {isUser && (
            <button onClick={() => setIsEditing(true)}
              className={`text-xs px-2 py-0.5 rounded-full transition-all
                ${isDark ? "text-gray-500 hover:text-white hover:bg-white/10"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}>
              ✏️ Edit
            </button>
          )}

          {/* ✅ TextToSpeech — Naya Add Kiya */}
          {!isUser && (
            <TextToSpeech text={message.content} isDark={isDark} />
          )}

          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className={`text-xs px-2 py-0.5 rounded-full transition-all
                ${isDark ? "text-gray-500 hover:text-white hover:bg-white/10"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}>
              😊
            </button>
            {showReactions && (
              <div className={`absolute bottom-6 left-0 flex gap-1 p-2 rounded-xl
                shadow-xl z-10 animate-fadeIn border
                ${isDark ? "glass-dark border-white/10" : "glass-light border-gray-200"}`}>
                {REACTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleReaction(r)}
                    className={`text-lg hover:scale-125 transition-transform
                      ${reactions.includes(r) ? "opacity-100" : "opacity-60"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isUser && isLast && onRegenerate && (
            <button onClick={onRegenerate}
              className={`text-xs px-2 py-0.5 rounded-full transition-all
                ${isDark ? "text-gray-500 hover:text-violet-400 hover:bg-violet-400/10"
                  : "text-gray-400 hover:text-violet-600 hover:bg-violet-50"}`}>
              🔄 Regenerate
            </button>
          )}

          {message.pinned !== undefined && (
            <span className="text-xs">📌</span>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0
          ${isDark ? "bg-gray-800 border border-white/10" : "bg-gray-200"}`}>
          <span className="text-sm">👤</span>
        </div>
      )}
    </div>
  );
}
