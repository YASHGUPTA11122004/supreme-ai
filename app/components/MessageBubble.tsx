import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center shrink-0">
          <span className="text-white font-black text-xs">S</span>
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm
        ${isUser
          ? "bg-violet-600 text-white rounded-br-sm"
          : "bg-gray-800/80 text-gray-100 rounded-bl-sm border border-gray-700/50"
        }`}>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" className="rounded-lg my-2 text-xs" {...props}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-900 rounded px-1.5 py-0.5 text-violet-300 text-xs font-mono" {...props}>
                  {children}
                </code>
              );
            },
            strong: ({ children }) => <strong className="text-violet-300 font-bold">{children}</strong>,
            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
          <span className="text-white text-xs">👤</span>
        </div>
      )}
    </div>
  );
}
```

---

## Commit Order:
```
1. app/api/chat/route.ts      → commit
2. app/components/ChatWindow.tsx  → commit
3. app/components/MessageBubble.tsx → commit
