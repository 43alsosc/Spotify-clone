"use client";

import { Playlist } from "@/types/types";
import MediaItem from "../media-item";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface CollapsedSidebarProps {
  leftPanelWidth: number;
  data: Playlist[];
  isLoading: boolean;
  toggleCollapsed: () => void;
}

export default function CollapsedSidebar({
  leftPanelWidth,
  data,
  isLoading,
  toggleCollapsed,
}: CollapsedSidebarProps) {
  return (
    <div
      className="mx-0 flex w-full flex-col items-center gap-2 rounded-[1rem] bg-[#121212] px-0 py-4"
      style={{ width: `${leftPanelWidth}%` }}
    >
      <button
        onClick={toggleCollapsed}
        className="rounded-full p-2 text-[#B3B3B3] transition-colors hover:bg-transparent hover:text-white"
        aria-label="Expand panel"
      >
        <svg
          className="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
        >
          <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
        </svg>
      </button>

      <Button
        variant={"default"}
        className="size-8 rounded-full bg-[#1F1F1F] text-[#B3B3B3] hover:bg-[#2F2F2F] hover:text-white"
      >
        <Plus className="h-4 w-4 text-current" />
      </Button>

      <div className="grid grid-cols-1 overflow-y-auto [scrollbar-width:none]">
        {isLoading ? (
          <div className="p-4 text-white">Loading playlists...</div>
        ) : (
          data.map((item, index) => (
            <MediaItem
              key={index}
              item={item}
              isCollapsed={true}
              viewMode="compact"
            />
          ))
        )}
      </div>
    </div>
  );
}
