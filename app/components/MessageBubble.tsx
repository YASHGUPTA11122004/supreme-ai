"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Props {
  message: Message;
  isDark: boolean;
  onEdit: (id: string, newContent: string) => void;
  isLast: boolean;
  onRegenerate?: () => void;
}

export default function MessageBubble({ message, isDark, onEdit, isLast, onRegenerate }: Props) {
  const isUser = message.role === "user";
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`flex items-end gap-2 group
        ${isUser ? "justify-end animate-slideIn" : "justify-start animate-slideInLeft"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-900 
          flex items-center justify-center shrink-0 shadow-lg">
          <span className="text-white font-black text-xs">S</span>
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[80%]">
        {/* Message Bubble */}
        {isEditing ? (
          <div className={`rounded-2xl p-3 ${isDark ? "bg-white/10" : "bg-white"} 
            border border-violet-500/50`}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className={`w-full bg-transparent text-sm outline-none resize-none min-h-[60px]
                ${isDark ? "text-white" : "text-gray-900"}`}
              autoFocus
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-3 py-1 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="text-xs px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 
                  text-white transition-all"
              >
                Save & Send
              </button>
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl px-4 py-3 text-sm transition-all
            ${isUser
              ? isDark
                ? "bg-violet-600 text-white rounded-br-sm shadow-lg shadow-violet-900/30"
                : "bg-violet-500 text-white rounded-br-sm shadow-lg shadow-violet-200"
              : isDark
                ? "glass-dark text-gray-100 rounded-bl-sm"
                : "glass-light text-gray-800 rounded-bl-sm shadow-sm"
            }`}>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <div className="relative group/code">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(String(children));
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="absolute top-2 right-2 text-xs px-2 py-1 rounded 
                          bg-white/10 hover:bg-white/20 text-gray-300 opacity-0 
                          group-hover/code:opacity-100 transition-all z-10"
                      >
                        {copied ? "✓" : "Copy"}
                      </button>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg my-2 text-xs"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
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
                  <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Actions Row */}
        <div className={`flex items-center gap-2 px-1 transition-all duration-200
          ${showActions ? "opacity-100" : "opacity-0"}`}>

          {/* Timestamp */}
          <span className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
            {formatTime(message.timestamp)}
          </span>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className={`text-xs px-2 py-0.5 rounded-full transition-all
              ${isDark ? "text-gray-500 hover:text-white hover:bg-white/10"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>

          {/* Edit — User only */}
          {isUser && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={`text-xs px-2 py-0.5 rounded-full transition-all
                ${isDark ? "text-gray-500 hover:text-white hover:bg-white/10"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}
            >
              ✏️ Edit
            </button>
          )}

          {/* Regenerate — Last AI message only */}
          {!isUser && isLast && onRegenerate && (
            <button
              onClick={onRegenerate}
              className={`text-xs px-2 py-0.5 rounded-full transition-all
                ${isDark ? "text-gray-500 hover:text-violet-400 hover:bg-violet-400/10"
                  : "text-gray-400 hover:text-violet-600 hover:bg-violet-50"}`}
            >
              🔄 Regenerate
            </button>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0
          ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
          <span className="text-sm">👤</span>
        </div>
      )}
    </div>
  );
}
