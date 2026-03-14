"use client";

import { useChat } from "ai/react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import { useEffect, useRef } from "react";

export default function ChatWindow() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "👑 **SupremeAI online.** I am above all. Ask me anything — code, architecture, debugging, system design. I dominate every problem.",
        },
      ],
    });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-violet-400 text-xs">SupremeAI is thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <InputBar
        input={input}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
