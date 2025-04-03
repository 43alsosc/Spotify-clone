"use client";

import { Filter, Plus, Maximize2, ChevronDown } from "lucide-react";

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
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-zinc-400" />
          <span className="font-medium text-white">Library</span>
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
          <button
            className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            onClick={collapsePanel}
            aria-label="Collapse panel"
          >
            <ChevronDown className="h-4 w-4" />
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
