"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import PromptSuggestions from "./PromptSuggestions";
import ExportChat from "./ExportChat";
import { storage, type Message, type Chat } from "@/app/lib/storage";
import { playSound } from "@/app/lib/sounds";

interface Props {
  isDark: boolean;
  currentChatId: string;
  onChatUpdate: (chat: Chat) => void;
  systemPrompt: string;
  onSystemPromptChange: (p: string) => void;
  soundEnabled: boolean;
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: "👑 **SupremeAI online.** I am above all. Ask me anything — code, architecture, debugging, system design. I dominate every problem.",
  timestamp: new Date(),
};

export default function ChatWindow({
  isDark, currentChatId, onChatUpdate,
  systemPrompt, onSystemPromptChange, soundEnabled,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Load chat from storage
  useEffect(() => {
    const chats = storage.getChats();
    const found = chats.find(c => c.id === currentChatId);
    if (found) setMessages(found.messages);
    else setMessages([WELCOME]);
  }, [currentChatId]);

  // Save chat to storage
  const saveChat = useCallback((msgs: Message[]) => {
    const title = msgs.find(m => m.role === "user")?.content.slice(0, 40) || "New Chat";
    const chat: Chat = {
      id: currentChatId,
      title,
      messages: msgs,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.saveChat(chat);
    onChatUpdate(chat);
  }, [currentChatId, onChatUpdate]);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 150);
  };

  const sendMessages = async (msgs: Message[]) => {
    setIsLoading(true);
    setIsStreaming(true);
    if (soundEnabled) playSound("send");

    const assistantMsg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    const withAssistant = [...msgs, assistantMsg];
    setMessages(withAssistant);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs.map(m => ({ role: m.role, content: m.content })),
          systemPrompt,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: fullText,
                  };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }

      if (soundEnabled) playSound("receive");
      const final = [...msgs, { ...assistantMsg, content: fullText }];
      saveChat(final);
    } catch {
      if (soundEnabled) playSound("error");
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = "❌ Error aaya. Please try again.";
        return updated;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    await sendMessages(updated);
  };

  const handleEdit = async (id: string, newContent: string) => {
    const idx = messages.findIndex(m => m.id === id);
    if (idx === -1) return;
    const updated = [
      ...messages.slice(0, idx),
      { ...messages[idx], content: newContent },
    ];
    setMessages(updated);
    await sendMessages(updated);
  };

  const handleRegenerate = async () => {
    const lastUserIdx = [...messages].reverse().findIndex(m => m.role === "user");
    if (lastUserIdx === -1) return;
    const idx = messages.length - 1 - lastUserIdx;
    const trimmed = messages.slice(0, idx + 1);
    setMessages(trimmed);
    await sendMessages(trimmed);
  };

  const handleClearChat = () => {
    setMessages([{
      ...WELCOME,
      id: Date.now().toString(),
      timestamp: new Date(),
    }]);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b
        ${isDark ? "border-purple-900/20" : "border-purple-200/30"}`}>
        <div className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
          {messages.length - 1} messages
        </div>
        <div className="flex items-center gap-2">
          <ExportChat messages={messages} isDark={isDark} />
          <button
            onClick={handleClearChat}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1
              ${isDark
                ? "text-gray-500 hover:text-red-400 hover:bg-red-400/10"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Messages or Suggestions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" onScroll={handleScroll}>
        {showSuggestions ? (
          <PromptSuggestions
            isDark={isDark}
            onSelect={prompt => setInput(prompt)}
          />
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isDark={isDark}
              onEdit={handleEdit}
              isLast={i === messages.length - 1}
              isStreaming={isStreaming}
              onRegenerate={
                msg.role === "assistant" && i === messages.length - 1
                  ? handleRegenerate
                  : undefined
              }
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Scroll Button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-28 right-6 w-9 h-9 rounded-full
            bg-violet-600 hover:bg-violet-500 text-white shadow-xl
            flex items-center justify-center transition-all animate-fadeIn
            hover:scale-110"
        >
          ↓
        </button>
      )}

      <InputBar
        input={input}
        isLoading={isLoading}
        isDark={isDark}
        systemPrompt={systemPrompt}
        onSystemPromptChange={onSystemPromptChange}
        handleInputChange={e => setInput(e.target.value)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
