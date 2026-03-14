export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  pinned?: boolean;
  reactions?: string[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  pinned?: boolean;
}

export interface Settings {
  theme: "dark" | "light";
  systemPrompt: string;
  sound: boolean;
}

const CHATS_KEY = "supremeai_chats";
const SETTINGS_KEY = "supremeai_settings";

export const storage = {
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
    if (typeof window === "undefined") return {
      theme: "dark",
      systemPrompt: "You are SupremeAI — the most powerful AI assistant. Above All.",
      sound: true,
    };
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : {
        theme: "dark",
        systemPrompt: "You are SupremeAI — the most powerful AI assistant. Above All.",
        sound: true,
      };
    } catch {
      return {
        theme: "dark",
        systemPrompt: "You are SupremeAI — the most powerful AI assistant. Above All.",
        sound: true,
      };
    }
  },

  saveSettings(settings: Settings): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  },
};
