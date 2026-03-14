"use client";

import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatWindow({ isDark }: { isDark: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👑 **SupremeAI online.** I am above all. Ask me anything — code, architecture, debugging, system design. I dominate every problem.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!isNearBottom);
  };

  const handleSubmit = async (e: React.FormEvent, editedMessages?: Message[]) => {
    e.preventDefault();
    const currentMessages = editedMessages || messages;
    if (!input.trim() && !editedMessages || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = editedMessages || [...currentMessages, userMessage];
    if (!editedMessages) {
      setMessages(updatedMessages);
      setInput("");
    }
    setIsLoading(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].content += data.text;
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "❌ Error aaya. Please try again.";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string, newContent: string) => {
    const idx = messages.findIndex((m) => m.id === id);
    if (idx === -1) return;
    const updated = messages.slice(0, idx + 1).map((m) =>
      m.id === id ? { ...m, content: newContent } : m
    );
    setMessages(updated);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(fakeEvent, updated);
  };

  const handleRegenerate = () => {
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const idx = messages.length - 1 - lastUserIdx;
    const trimmed = messages.slice(0, idx + 1);
    setMessages(trimmed);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(fakeEvent, trimmed);
  };

  const handleClearChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "👑 **SupremeAI online.** Chat cleared. What can I dominate for you?",
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {/* Clear Chat Button */}
      <div className={`flex justify-end px-4 py-2 border-b
        ${isDark ? "border-purple-900/20" : "border-purple-200/30"}`}>
        <button
          onClick={handleClearChat}
          className={`text-xs px-3 py-1 rounded-full transition-all
            ${isDark
              ? "text-gray-500 hover:text-red-400 hover:bg-red-400/10"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
            }`}
        >
          🗑️ Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isDark={isDark}
            onEdit={handleEdit}
            isLast={i === messages.length - 1}
            onRegenerate={msg.role === "assistant" && i === messages.length - 1 ? handleRegenerate : undefined}
          />
        ))}

        {/* Typing Indicator */}
        {isLoading && messages[messages.length - 1]?.content === "" && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-900 
              flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xs">S</span>
            </div>
            <div className={`rounded-2xl px-4 py-3 ${isDark ? "bg-white/5" : "bg-white/70"}`}>
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-violet-400 rounded-full dot-bounce"
                    style={{ animationDelay: `${i * 0.16}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to Bottom */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 w-9 h-9 rounded-full 
            bg-violet-600 hover:bg-violet-500 text-white shadow-lg
            flex items-center justify-center transition-all animate-fadeIn"
        >
          ↓
        </button>
      )}

      <InputBar
        input={input}
        isLoading={isLoading}
        isDark={isDark}
        handleInputChange={(e) => setInput(e.target.value)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
