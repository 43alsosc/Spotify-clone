"use client";

import { ChevronRight } from "lucide-react";
import MediaItemsList from "./media-items-list";

interface CollapsedSidebarProps {
  leftPanelWidth: number;
  toggleCollapsed: () => void;
}

export default function CollapsedSidebar({
  leftPanelWidth,
  toggleCollapsed,
}: CollapsedSidebarProps) {
  return (
    <div
      className="flex w-full flex-col items-center gap-2 overflow-y-auto rounded-lg bg-zinc-800 py-4"
      style={{ width: `${leftPanelWidth}%` }}
    >
      <button
        onClick={toggleCollapsed}
        className="mb-2 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        aria-label="Expand panel"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <MediaItemsList viewMode="compact" />
    </div>
  );
}
