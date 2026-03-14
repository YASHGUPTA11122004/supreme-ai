"use client";

import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatWindow() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👑 **SupremeAI online.** I am above all. Ask me anything — code, architecture, debugging, system design. I dominate every problem.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
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
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "❌ Error aaya. Please try again.";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
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
        handleInputChange={(e) => setInput(e.target.value)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
