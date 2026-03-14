"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  language: string;
  code: string;
  isDark: boolean;
}

export default function CodeBlock({ language, code, isDark }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl overflow-hidden my-3 border
      ${isDark ? "border-white/10" : "border-gray-200"}`}>

      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2
        ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className={`text-xs ml-2 font-mono
            ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {language || "code"}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className={`text-xs px-3 py-1 rounded-lg transition-all flex items-center gap-1
            ${copied
              ? "bg-green-500/20 text-green-400"
              : isDark
                ? "bg-white/10 hover:bg-white/20 text-gray-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-600"
            }`}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        style={isDark ? oneDark : oneLight}
        language={language || "text"}
        showLineNumbers
        wrapLines
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.8rem",
          background: isDark ? "rgba(0,0,0,0.4)" : "#f8f8f8",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
