"use client";

import { Plus, Maximize2 } from "lucide-react";

interface SidebarHeaderProps {
  expandPanel: () => void;
  collapsePanel: () => void;
  dragProgress: number;
}

export default function SidebarHeader({
  expandPanel,
  collapsePanel,
  dragProgress,
}: SidebarHeaderProps) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#B3B3B3] hover:text-white">
          <button
            className="flex cursor-pointer items-center gap-2 p-1.5 transition-colors hover:bg-transparent"
            onClick={collapsePanel}
            aria-label="Collapse panel"
          >
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
            >
              <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
            </svg>
            <span className="font-bold">Library</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            aria-label="Add new"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            onClick={expandPanel}
            aria-label="Expand panel"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Collapse progress indicator (only visible when dragging at min width) */}
      {dragProgress > 0 && (
        <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-zinc-700">
          <div
            className="h-full rounded-full bg-zinc-500 transition-all"
            style={{ width: `${dragProgress * 100}%` }}
          />
        </div>
      )}
    </>
  );
}
