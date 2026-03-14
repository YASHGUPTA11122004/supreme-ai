import ChatWindow from "./components/ChatWindow";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-950">
      <div className="w-full max-w-4xl flex flex-col h-screen">

        {/* Header */}
        <header className="border-b border-purple-900/50 p-4 flex items-center gap-3 bg-gray-950/80 backdrop-blur-sm">
          {/* Logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center shadow-lg shadow-violet-900/50">
            <span className="text-white font-black text-sm">S</span>
          </div>

          {/* Name */}
          <div>
            <h1 className="text-white font-black text-lg tracking-tight">
              Supreme<span className="text-violet-400">AI</span>
            </h1>
            <p className="text-gray-500 text-xs">Above All</p>
          </div>

          {/* Status */}
          <span className="ml-auto text-xs text-violet-400 border border-violet-400/30 rounded-full px-3 py-1 bg-violet-400/5">
            ● Active
          </span>
        </header>

        <ChatWindow />
      </div>
    </main>
  );
}
