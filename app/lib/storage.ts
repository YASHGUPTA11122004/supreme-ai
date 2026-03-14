export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  pinned?: boolean;
  reactions?: string[];
  imageUrl?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  pinned?: boolean;
}

export interface UserProfile {
  name: string;
  joinedAt: Date;
}

export interface Settings {
  theme: "dark" | "light";
  chatTheme: string;
  systemPrompt: string;
  sound: boolean;
  selectedModel: string;
  selectedPersona: string;
  ttsEnabled: boolean;
  totalMessages: number;
  totalTokens: number;
}

const CHATS_KEY = "supremeai_chats";
const SETTINGS_KEY = "supremeai_settings";
const USER_KEY = "supremeai_user";

export const storage = {
  // User
  getUser(): UserProfile | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  saveUser(user: UserProfile | null): void {
    if (typeof window === "undefined") return;
    try {
      if (user === null) {
        localStorage.removeItem(USER_KEY);
      } else {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch {}
  },

  // Chats
  getChats(): Chat[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(CHATS_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  saveChat(chat: Chat): void {
    if (typeof window === "undefined") return;
    try {
      const chats = this.getChats();
      const idx = chats.findIndex(c => c.id === chat.id);
      if (idx >= 0) chats[idx] = chat;
      else chats.unshift(chat);
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    } catch {}
  },

  deleteChat(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const chats = this.getChats().filter(c => c.id !== id);
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    } catch {}
  },

  clearAllChats(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CHATS_KEY);
  },

  // Settings
  getSettings(): Settings {
    const defaults: Settings = {
      theme: "dark",
      chatTheme: "purple",
      systemPrompt: "You are SupremeAI — the most powerful AI assistant. Above All.",
      sound: true,
      selectedModel: "gemini-2.0-flash",
      selectedPersona: "default",
      ttsEnabled: false,
      totalMessages: 0,
      totalTokens: 0,
    };
    if (typeof window === "undefined") return defaults;
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...defaults, ...JSON.parse(data) } : defaults;
    } catch { return defaults; }
  },

  saveSettings(settings: Partial<Settings>): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getSettings();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
    } catch {}
  },

  incrementStats(tokens: number = 50): void {
    if (typeof window === "undefined") return;
    const s = this.getSettings();
    this.saveSettings({
      totalMessages: s.totalMessages + 1,
      totalTokens: s.totalTokens + tokens,
    });
  },
};
