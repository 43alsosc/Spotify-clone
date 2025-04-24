"use client";

import { z } from "zod";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import FiltersSection from "./filters-section";
import MediaItemsList from "./media-items-list";
import CollapsedSidebar from "./collapsed-sidebar";
import SidebarHeader from "./sidebar-header";
import { GetFollowedArtistsSchema } from "@/lib/validations/artist";
import { SimplifiedPlaylistSchema } from "@/lib/validations/playlist";

type ViewMode = "compact" | "grid" | "list";
type SortOption = "Nylig" | "Nylig lagt til" | "Alfabetisk" | "Oppretter";

interface SidebarContentProps {
  isCollapsed: boolean;
  leftPanelWidth: number;
  playlistData: z.infer<typeof SimplifiedPlaylistSchema>[] | undefined;
  artistData:
    | z.infer<typeof GetFollowedArtistsSchema>["artists"]["items"]
    | undefined;
  isLoading: boolean;
  followedArtistsLoading: boolean;
  isLeftPanelMaximized: boolean;
  expandPanel: () => void;
  collapsePanel: () => void;
  minimizePanel: () => void;
  toggleCollapsed: () => void;
}

const sortOptions: SortOption[] = [
  "Nylig",
  "Nylig lagt til",
  "Alfabetisk",
  "Oppretter",
];
const viewModeOptions: ViewMode[] = ["compact", "list", "grid"];

export default function SidebarContent({
  isCollapsed,
  leftPanelWidth,
  playlistData,
  artistData,
  isLoading,
  followedArtistsLoading,
  isLeftPanelMaximized,
  expandPanel,
  collapsePanel,
  minimizePanel,
  toggleCollapsed,
}: SidebarContentProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("Nylig");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  if (isCollapsed) {
    return (
      <CollapsedSidebar
        leftPanelWidth={leftPanelWidth}
        data={playlistData}
        isLoading={isLoading}
        toggleCollapsed={toggleCollapsed}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[1rem] bg-[#121212]",
      )}
      style={{ width: `${leftPanelWidth}%` }}
    >
      <div className="flex flex-col border-b border-zinc-700 p-4">
        <SidebarHeader
          isLeftPanelMaximized={isLeftPanelMaximized}
          expandPanel={expandPanel}
          collapsePanel={collapsePanel}
          minimizePanel={minimizePanel}
        />
        <FiltersSection />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between bg-[#121212] p-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                "rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white",
                isSearchOpen && "bg-zinc-700 text-white",
              )}
              aria-label="Søk"
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {isSearchOpen && (
              <div className="animate-in slide-in-from-left ml-2 w-1/2 duration-300">
                <input
                  type="text"
                  placeholder="Søk..."
                  className="w-full rounded-md bg-zinc-700 px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-zinc-500 focus:outline-none"
                  autoFocus
                />
              </div>
            )}
          </div>

          <div className="group relative">
            <button className="flex items-center gap-1 text-sm text-zinc-300 hover:text-white">
              <span>Sorter: {sortBy}</span>
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
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div className="invisible absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-md bg-zinc-700 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="py-1">
                {sortOptions.map((option) => (
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
                ))}

                <div className="my-1 border-t border-zinc-600" />
                <div className="px-4 py-2 text-sm text-zinc-400">Vis som:</div>

                {viewModeOptions.map((option) => (
                  <button
                    key={option}
                    className={cn(
                      "block w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-600 hover:text-white",
                      viewMode === option && "bg-zinc-600 text-white",
                    )}
                    onClick={() => setViewMode(option)}
                  >
                    {option === "compact"
                      ? "Kompakt"
                      : option === "list"
                        ? "Liste"
                        : "Rutenett"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <MediaItemsList
          viewMode={viewMode}
          playlistData={playlistData}
          artistData={artistData}
          isPlaylistLoading={isLoading}
          isArtistLoading={followedArtistsLoading}
          leftPanelWidth={leftPanelWidth}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}
