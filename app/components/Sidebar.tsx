"use client";

import { useState } from "react";
import type { Chat } from "@/app/lib/storage";

interface Props {
  chats: Chat[];
  currentChatId: string;
  isDark: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onPinChat: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Sidebar({
  chats, currentChatId, isDark, isOpen,
  onClose, onSelectChat, onNewChat,
  onDeleteChat, onRenameChat, onPinChat,
  searchQuery, onSearchChange,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filtered = chats.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinned = filtered.filter(c => c.pinned);
  const unpinned = filtered.filter(c => !c.pinned);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return "Today";
    if (diff < 172800000) return "Yesterday";
    return d.toLocaleDateString();
  };

  const ChatItem = ({ chat }: { chat: Chat }) => (
    <div
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer
        transition-all duration-200 relative
        ${currentChatId === chat.id
          ? isDark ? "bg-violet-600/20 border border-violet-500/30" : "bg-violet-50 border border-violet-200"
          : isDark ? "hover:bg-white/5" : "hover:bg-gray-100"
        }`}
      onClick={() => { onSelectChat(chat.id); onClose(); }}
    >
      <span className="text-sm shrink-0">{chat.pinned ? "📌" : "💬"}</span>

      {editingId === chat.id ? (
        <input
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={() => {
            onRenameChat(chat.id, editTitle);
            setEditingId(null);
          }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              onRenameChat(chat.id, editTitle);
              setEditingId(null);
            }
          }}
          className={`flex-1 text-sm bg-transparent outline-none border-b
            ${isDark ? "text-white border-violet-500" : "text-gray-900 border-violet-400"}`}
          autoFocus
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span className={`flex-1 text-sm truncate
          ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {chat.title}
        </span>
      )}

      {/* Actions */}
      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
        <button
          onClick={e => {
            e.stopPropagation();
            onPinChat(chat.id);
          }}
          className={`p-1 rounded text-xs transition-all
            ${isDark ? "hover:bg-white/10 text-gray-500" : "hover:bg-gray-200 text-gray-400"}`}
          title={chat.pinned ? "Unpin" : "Pin"}
        >
          {chat.pinned ? "📌" : "📍"}
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            setEditingId(chat.id);
            setEditTitle(chat.title);
          }}
          className={`p-1 rounded text-xs transition-all
            ${isDark ? "hover:bg-white/10 text-gray-500" : "hover:bg-gray-200 text-gray-400"}`}
        >
          ✏️
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onDeleteChat(chat.id);
          }}
          className={`p-1 rounded text-xs transition-all
            ${isDark ? "hover:bg-red-500/20 text-gray-500 hover:text-red-400"
              : "hover:bg-red-50 text-gray-400 hover:text-red-500"}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:relative top-0 left-0 h-full w-72 z-50
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isDark ? "bg-black/40 border-r border-white/5" : "bg-white/60 border-r border-gray-200"}
        backdrop-blur-xl`}>

        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h2 className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
            Chat History
          </h2>
          <button
            onClick={onClose}
            className={`md:hidden p-1 rounded-lg transition-all
              ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
          >
            ✕
          </button>
        </div>

        {/* New Chat */}
        <div className="px-4 mb-3">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500
              text-white text-sm font-semibold transition-all
              flex items-center justify-center gap-2
              hover:shadow-lg hover:shadow-violet-900/30"
          >
            ✨ New Chat
          </button>
        </div>

        {/* Search */}
        <div className="px-4 mb-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl
            ${isDark ? "bg-white/5 border border-white/10" : "bg-gray-100 border border-gray-200"}`}>
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search chats..."
              className={`flex-1 bg-transparent text-sm outline-none
                ${isDark ? "text-white placeholder-gray-600" : "text-gray-900 placeholder-gray-400"}`}
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {pinned.length > 0 && (
            <>
              <p className={`text-xs px-2 py-1 font-semibold
                ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                📌 Pinned
              </p>
              {pinned.map(c => <ChatItem key={c.id} chat={c} />)}
              <div className={`border-t my-2 ${isDark ? "border-white/5" : "border-gray-200"}`} />
            </>
          )}

          {unpinned.length > 0 && (
            <>
              <p className={`text-xs px-2 py-1 font-semibold
                ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                Recent
              </p>
              {unpinned.map(c => <ChatItem key={c.id} chat={c} />)}
            </>
          )}

          {filtered.length === 0 && (
            <div className={`text-center py-8 text-sm
              ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              {searchQuery ? "No chats found" : "No chats yet"}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isDark ? "border-white/5" : "border-gray-200"}`}>
          <p className={`text-xs text-center ${isDark ? "text-gray-700" : "text-gray-400"}`}>
            👑 SupremeAI — Above All
          </p>
        </div>
      </div>
    </>
  );
}
