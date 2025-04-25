"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
}

export function SearchBox({ placeholder = "Søk", className }: SearchBoxProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        "group flex h-12 items-center gap-2 rounded-full bg-[#242424] px-4 transition-all duration-300 hover:bg-[#2A2A2A] hover:ring-2 hover:ring-white",
        isFocused && "ring-2 ring-white",
        className,
      )}
    >
      <Search
        className={cn(
          "size-8 text-zinc-400 transition-colors duration-300 group-hover:text-white",
          isFocused && "text-white",
        )}
      />
      <input
        type="search"
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className="h-6 w-[2px] rounded-full bg-[#7C7C7C]" />
      <button
        className="flex items-center justify-center rounded-full hover:text-white"
        aria-label="Start avspilling"
      >
        <svg
          data-encore-id="icon"
          role="img"
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-7 fill-zinc-400 transition-colors hover:fill-white"
        >
          <path d="M15 15.5c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"></path>
          <path d="M1.513 9.37A1 1 0 0 1 2.291 9h19.418a1 1 0 0 1 .979 1.208l-2.339 11a1 1 0 0 1-.978.792H4.63a1 1 0 0 1-.978-.792l-2.339-11a1 1 0 0 1 .201-.837zM3.525 11l1.913 9h13.123l1.913-9H3.525zM4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4h-2V3H6v3H4V2z"></path>
        </svg>
      </button>
    </div>
  );
}
