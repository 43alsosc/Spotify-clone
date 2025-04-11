"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import FiltersSection from "./filters-section";
import MediaItemsList from "./media-items-list";
import CollapsedSidebar from "./collapsed-sidebar";
import SidebarHeader from "./sidebar-header";
import { Playlist } from "@/types/types";

interface SidebarContentProps {
  isCollapsed: boolean;
  dragProgress: number;
  leftPanelWidth: number;
  data: Playlist[];
  isLoading: boolean;
  expandPanel: () => void;
  collapsePanel: () => void;
  toggleCollapsed: () => void;
}

export default function SidebarContent({
  isCollapsed,
  dragProgress,
  leftPanelWidth,
  data,
  isLoading,
  expandPanel,
  collapsePanel,
  toggleCollapsed,
}: SidebarContentProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Recent");
  const [viewMode, setViewMode] = useState<"compact" | "grid" | "list">("grid");

  if (isCollapsed) {
    return (
      <CollapsedSidebar
        leftPanelWidth={leftPanelWidth}
        data={data}
        isLoading={isLoading}
        toggleCollapsed={toggleCollapsed}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[1rem] bg-zinc-800",
        dragProgress > 0 && "opacity-90", // Visual feedback during collapse drag
      )}
      style={{ width: `${leftPanelWidth}%` }}
    >
      {/* Fixed top section */}
      <div className="flex flex-col border-b border-zinc-700 p-4">
        {/* Header with controls */}
        <SidebarHeader
          expandPanel={expandPanel}
          collapsePanel={collapsePanel}
          dragProgress={dragProgress}
        />

        {/* Filters with scroll buttons */}
        <FiltersSection />
      </div>

      {/* Scrollable content section */}
      <div className="flex-1 overflow-y-auto">
        {/* Search and sort controls */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-700 bg-zinc-800 p-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                "rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white",
                isSearchOpen && "bg-zinc-700 text-white",
              )}
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>

            {isSearchOpen && (
              <div className="animate-in slide-in-from-left ml-2 w-1/2 duration-300">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-md bg-zinc-700 px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-zinc-500 focus:outline-none"
                  autoFocus
                />
              </div>
            )}
          </div>

          <div className="group relative">
            <button className="flex items-center gap-1 text-sm text-zinc-300 hover:text-white">
              <span>Sort: {sortBy}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>

            <div className="invisible absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-md bg-zinc-700 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="py-1">
                {["Recent", "Newly added", "Alphabetical", "Creator"].map(
                  (option) => (
                    <button
                      key={option}
                      className={cn(
                        "block w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-600 hover:text-white",
                        sortBy === option && "bg-zinc-600 text-white",
                      )}
                      onClick={() => setSortBy(option)}
                    >
                      {option}
                    </button>
                  ),
                )}

                <div className="my-1 border-t border-zinc-600"></div>

                <div className="px-4 py-2 text-sm text-zinc-400">Show as:</div>

                {["compact", "list", "grid"].map((option) => (
                  <button
                    key={option}
                    className={cn(
                      "block w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-600 hover:text-white",
                      viewMode === option && "bg-zinc-600 text-white",
                    )}
                    onClick={() =>
                      setViewMode(option as "compact" | "grid" | "list")
                    }
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Media items list */}
        <MediaItemsList viewMode={viewMode} data={data} isLoading={isLoading} />
      </div>
    </div>
  );
}
