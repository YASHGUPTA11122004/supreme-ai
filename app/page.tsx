"use client";

import { useState, useEffect, useCallback } from "react";
import ChatWindow from "./components/ChatWindow";
import AnimatedBackground from "./components/AnimatedBackground";
import ThemeToggle from "./components/ThemeToggle";
import Sidebar from "./components/Sidebar";
import { storage, type Chat } from "./lib/storage";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState("chat_" + Date.now());
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are SupremeAI — the most powerful AI assistant. Above All. Always respond with confidence and precision."
  );

  useEffect(() => {
    const settings = storage.getSettings();
    setIsDark(settings.theme === "dark");
    setSystemPrompt(settings.systemPrompt);
    setSoundEnabled(settings.sound);
    setChats(storage.getChats());
  }, []);

  const handleNewChat = () => {
    setCurrentChatId("chat_" + Date.now());
  };

  const handleChatUpdate = useCallback((chat: Chat) => {
    setChats(storage.getChats());
  }, []);

  const handleDeleteChat = (id: string) => {
    storage.deleteChat(id);
    setChats(storage.getChats());
    if (id === currentChatId) handleNewChat();
  };

  const handleRenameChat = (id: string, title: string) => {
    const all = storage.getChats();
    const chat = all.find(c => c.id === id);
    if (chat) {
      chat.title = title;
      storage.saveChat(chat);
      setChats(storage.getChats());
    }
  };

  const handlePinChat = (id: string) => {
    const all = storage.getChats();
    const chat = all.find(c => c.id === id);
    if (chat) {
      chat.pinned = !chat.pinned;
      storage.saveChat(chat);
      setChats(storage.getChats());
    }
  };

  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    storage.saveSettings({
      theme: newTheme ? "dark" : "light",
      systemPrompt,
      sound: soundEnabled,
    });
  };

  return (
    <main className={`flex h-screen overflow-hidden relative
      ${isDark ? "text-white" : "text-gray-900"}`}>

      <AnimatedBackground isDark={isDark} />

      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        isDark={isDark}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectChat={setCurrentChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onPinChat={handlePinChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        {/* Header */}
        <header className={`border-b p-4 flex items-center gap-3
          backdrop-blur-xl transition-all shrink-0
          ${isDark
            ? "border-purple-900/30 bg-black/20"
            : "border-purple-200/50 bg-white/30"
          }`}>

          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition-all hover:scale-105
              ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
          >
            ☰
          </button>

          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700
            flex items-center justify-center shadow-lg glow-purple">
            <span className="text-white font-black text-lg">S</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="font-black text-xl tracking-tight">
              Supreme<span className="text-violet-400">AI</span>
            </h1>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Above All
            </p>
          </div>

          {/* Right */}
          <div className="ml-auto flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`text-lg transition-all hover:scale-110
                ${soundEnabled ? "opacity-100" : "opacity-30"}`}
              title={soundEnabled ? "Sound On" : "Sound Off"}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>

            {/* New Chat */}
            <button
              onClick={handleNewChat}
              className={`text-xs px-3 py-1.5 rounded-xl transition-all
                border font-medium hover:scale-105
                ${isDark
                  ? "border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                  : "border-violet-300 text-violet-600 hover:bg-violet-50"
                }`}
            >
              ✨ New
            </button>

            <span className="text-xs text-violet-400 border border-violet-400/30
              rounded-full px-3 py-1 bg-violet-400/5">
              ● Active
            </span>

            <ThemeToggle isDark={isDark} toggle={handleThemeToggle} />
          </div>
        </header>

        <ChatWindow
          isDark={isDark}
          currentChatId={currentChatId}
          onChatUpdate={handleChatUpdate}
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
          soundEnabled={soundEnabled}
        />
      </div>
    </main>
  );
}
