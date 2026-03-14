"use client";

import { useRef } from "react";

interface Props {
  onImage: (base64: string, mimeType: string) => void;
  isDark: boolean;
}

export default function ImageUpload({ onImage, isDark }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      onImage(base64, file.type);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`shrink-0 self-end mb-1 w-8 h-8 rounded-xl
          flex items-center justify-center transition-all hover:scale-110
          ${isDark
            ? "bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-500"
          }`}
        title="Upload image"
      >
        🖼️
      </button>
    </>
  );
}
