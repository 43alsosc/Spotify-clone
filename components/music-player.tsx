"use client";

import {
  Heart,
  Maximize2,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { usePathname } from "next/navigation";

export function MusicPlayer() {
  const pathname = usePathname();
  if (pathname === "/login") {
    return null;
  }

  return (
    <footer className="sticky bottom-0 z-20 flex h-16 items-center justify-between border-t border-zinc-800 bg-zinc-900 px-4">
      <div className="flex w-1/3 items-center gap-3">
        <div className="relative h-10 w-10 flex-shrink-0 rounded bg-zinc-800"></div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-white">
            Nothing Playing
          </div>
          <div className="truncate text-xs text-zinc-400">
            Select a track to play
          </div>
        </div>
        <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex w-1/3 flex-col items-center">
        <div className="flex items-center gap-4">
          <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
            <SkipBack className="h-4 w-4" />
          </button>
          <button className="rounded-full bg-white p-2 text-black transition-transform hover:scale-105">
            <Play className="h-5 w-5" />
          </button>
          <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 flex w-full items-center gap-2">
          <span className="text-xs text-zinc-500">0:00</span>
          <div className="h-1 flex-1 rounded-full bg-zinc-700">
            <div className="h-full w-0 rounded-full bg-zinc-400"></div>
          </div>
          <span className="text-xs text-zinc-500">0:00</span>
        </div>
      </div>

      <div className="flex w-1/3 items-center justify-end gap-3">
        <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
          <Volume2 className="h-4 w-4" />
        </button>
        <div className="h-1 w-24 rounded-full bg-zinc-700">
          <div className="h-full w-1/2 rounded-full bg-zinc-400"></div>
        </div>
        <button className="p-1.5 text-zinc-400 transition-colors hover:text-white">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
