"use client";

import { useState, useEffect, useCallback } from "react";
import ChatWindow from "./components/ChatWindow";
import AnimatedBackground from "./components/AnimatedBackground";
import ThemeToggle from "./components/ThemeToggle";
import Sidebar from "./components/Sidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import ModelSelector from "./components/ModelSelector";
import PersonaSelector, { PERSONAS } from "./components/PersonaSelector";
import ChatThemes from "./components/ChatThemes";
import UsageStats from "./components/UsageStats";
import { storage, type Chat } from "./lib/storage";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState("chat_" + Date.now());
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
  const [selectedPersona, setSelectedPersona] = useState("default");
  const [chatTheme, setChatTheme] = useState("purple");
  const [systemPrompt, setSystemPrompt] = useState(PERSONAS[0].prompt);
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const user = storage.getUser();
    if (!user) setShowWelcome(true);
    else setUserName(user.name);
    const settings = storage.getSettings();
    setIsDark(settings.theme === "dark");
    setSoundEnabled(settings.sound);
    setSelectedModel(settings.selectedModel);
    setSelectedPersona(settings.selectedPersona);
    setChatTheme(settings.chatTheme);
    const persona = PERSONAS.find(p => p.id === settings.selectedPersona);
    if (persona) setSystemPrompt(persona.prompt);
    setChats(storage.getChats());
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const handleWelcomeComplete = (name: string) => {
    setUserName(name);
    storage.saveUser({ name, joinedAt: new Date() });
    setShowWelcome(false);
  };

  const handleNewChat = () => setCurrentChatId("chat_" + Date.now());

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
    if (chat) { chat.title = title; storage.saveChat(chat); setChats(storage.getChats()); }
  };

  const handlePinChat = (id: string) => {
    const all = storage.getChats();
    const chat = all.find(c => c.id === id);
    if (chat) { chat.pinned = !chat.pinned; storage.saveChat(chat); setChats(storage.getChats()); }
  };

  const handleThemeToggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    storage.saveSettings({ theme: newDark ? "dark" : "light" });
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    storage.saveSettings({ selectedModel: model });
  };

  const handlePersonaChange = (id: string, prompt: string) => {
    setSelectedPersona(id);
    setSystemPrompt(prompt);
    storage.saveSettings({ selectedPersona: id });
  };

  const handleThemeChange = (theme: string) => {
    setChatTheme(theme);
    storage.saveSettings({ chatTheme: theme });
  };

  if (!mounted) return null;

  return (
    <main className={`flex h-screen overflow-hidden relative
      ${isDark ? "text-white" : "text-gray-900"}`}>

      <AnimatedBackground isDark={isDark} />

      {showWelcome && (
        <WelcomeScreen onComplete={handleWelcomeComplete} isDark={isDark} />
      )}

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

      <div className="flex flex-col flex-1 overflow-hidden relative z-10 min-w-0">
        <header className={`border-b px-4 py-3 flex items-center gap-2
          backdrop-blur-xl transition-all shrink-0 flex-wrap
          ${isDark
            ? "border-purple-900/30 bg-black/20"
            : "border-purple-200/50 bg-white/30"
          }`}>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition-all hover:scale-105 shrink-0
              ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
          >☰</button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700
            flex items-center justify-center glow-purple shrink-0">
            <span className="text-white font-black">S</span>
          </div>

          <div className="shrink-0">
            <h1 className="font-black text-lg leading-none">
              Supreme<span className="text-violet-400">AI</span>
            </h1>
            {userName && (
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Hey, {userName}! 👋
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
            <ModelSelector
              selected={selectedModel}
              onChange={handleModelChange}
              isDark={isDark}
              isOpen={activeDropdown === "model"}
              onToggle={() => toggleDropdown("model")}
            />
            <PersonaSelector
              selected={selectedPersona}
              onChange={handlePersonaChange}
              isDark={isDark}
              isOpen={activeDropdown === "persona"}
              onToggle={() => toggleDropdown("persona")}
            />
            <ChatThemes
              selected={chatTheme}
              onChange={handleThemeChange}
              isDark={isDark}
              isOpen={activeDropdown === "theme"}
              onToggle={() => toggleDropdown("theme")}
            />
            <UsageStats
              isDark={isDark}
              isOpen={activeDropdown === "stats"}
              onToggle={() => toggleDropdown("stats")}
              onClose={() => setActiveDropdown(null)}
            />

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`text-lg transition-all hover:scale-110
                ${soundEnabled ? "opacity-100" : "opacity-30"}`}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>

            <button
              onClick={handleNewChat}
              className={`text-xs px-3 py-1.5 rounded-xl transition-all border font-medium
                hover:scale-105 hidden sm:block
                ${isDark
                  ? "border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                  : "border-violet-300 text-violet-600 hover:bg-violet-50"
                }`}
            >✨ New</button>

            <span className="text-xs text-violet-400 border border-violet-400/30
              rounded-full px-3 py-1 bg-violet-400/5 hidden sm:block">
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
          selectedModel={selectedModel}
          userName={userName}
        />
      </div>
    </main>
  );
}
