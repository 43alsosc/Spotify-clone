"use client";

import { Library, List, Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { cn } from "@/lib/utils";
import samplePlaylistData from "@/lib/sample-playlist-data.json";
import Link from "next/link";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  type ImperativePanelHandle,
} from "react-resizable-panels";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ResizableSidePanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Spillelister");
  const [selectedSorting, setSelectedSorting] = useState("Nylige");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelRef = useRef<ImperativePanelHandle>(null);

  const filters = [
    "Spillelister",
    "Podkaster",
    "Album",
    "Artister",
    "Lastet Ned",
  ];
  const playlists = samplePlaylistData.items;

  const MIN_SIZE_PERCENTAGE = 10; // Minimum width as percentage of container
  const MAX_SIZE_PERCENTAGE = 30; // Maximum width as percentage of container
  const COLLAPSE_SIZE_PERCENTAGE = 10.001; // Threshold for collapsing
  const DEFAULT_SIZE_PERCENTAGE = 20; // Default width as percentage

  // Handle panel resize
  const handleResize = (size: number) => {
    // Check if panel should be collapsed based on size'
    if (size < COLLAPSE_SIZE_PERCENTAGE && !isCollapsed) {
      setIsCollapsed(true);
    } else if (size >= COLLAPSE_SIZE_PERCENTAGE && isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const sorting = ["Nylige", "Nylig lagt til", "Alfabetisk", "Kreatør"];

  return (
    <PanelGroup direction="horizontal">
      <Panel
        ref={panelRef}
        defaultSize={DEFAULT_SIZE_PERCENTAGE}
        minSize={MIN_SIZE_PERCENTAGE}
        maxSize={MAX_SIZE_PERCENTAGE}
        onResize={handleResize}
        className={cn(
          "pl-auto mb-2 ml-2 rounded-[1rem]",
          isCollapsed && "!w-[64px]",
        )}
      >
        <div className="flex h-full flex-col gap-2 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-[#121212]">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="flex items-center gap-3 text-gray-400 hover:text-white"
              >
                <Library className="h-6 w-6" />
                {!isCollapsed && (
                  <span className="font-semibold">Biblioteket ditt</span>
                )}
              </button>
              {!isCollapsed && (
                <Button variant="ghost" size="icon" className="mr-3">
                  <span className="flex items-center gap-2 rounded-full bg-[#2A2A2A] px-2 py-1 font-bold text-white">
                    <Plus className="h-5 w-5" />
                    Lag
                  </span>
                </Button>
              )}
            </div>

            {!isCollapsed && (
              <>
                <div className="flex h-full flex-col">
                  <div className="px-2">
                    <div className="relative">
                      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-2">
                        {filters.map((filter) => (
                          <button
                            key={filter}
                            className={cn(
                              "rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap",
                              selectedFilter === filter
                                ? "bg-[#333333] text-white"
                                : "bg-[#232323] text-gray-300 hover:bg-[#2A2A2A]",
                            )}
                            onClick={() => setSelectedFilter(filter)}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between px-2">
                      {!showSearch ? (
                        <Button
                          onClick={() => setShowSearch(true)}
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-gray-400 hover:text-white"
                        >
                          <Search className="h-5 w-5" />
                        </Button>
                      ) : (
                        <div className="flex w-1/2 items-center gap-2 bg-[#2A2A2A] pl-2">
                          <Search className="h-5 w-5 text-gray-400" />
                          <input
                            placeholder="Søk i ditt bibliotek"
                            className="h-9 w-full rounded-md bg-transparent pl-2 text-sm outline-none"
                            autoFocus
                            onBlur={() => setShowSearch(false)}
                          />
                        </div>
                      )}

                      <div className="mr-2 flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="ml-2 flex items-center gap-2 transition-all duration-200 select-none hover:scale-105 hover:text-white">
                              {selectedSorting}
                              <List className="h-5 w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {sorting.map((sort) => (
                              <DropdownMenuItem
                                key={sort}
                                onClick={() => setSelectedSorting(sort)}
                              >
                                {sort}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 overflow-y-auto px-2">
                    <div className="space-y-2 p-2">
                      {playlists.map((playlist, i) => (
                        <Link
                          key={i}
                          href="/playlist"
                          className="group flex items-center gap-3 p-2 hover:bg-[#1A1A1A]"
                        >
                          <Image
                            src={
                              playlist.images?.[0].url ||
                              "/Placeholder-48x48.svg"
                            }
                            alt={playlist.name}
                            width={48}
                            height={48}
                            className="rounded-md"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-medium text-white">
                              {playlist.name}
                            </h3>
                            <p className="truncate text-sm text-gray-400">
                              {playlist.owner.display_name}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}

            {isCollapsed && (
              <ScrollArea className="flex-1">
                <div className="flex flex-col items-center gap-4 p-2">
                  {playlists.map((playlist, i) => (
                    <Link
                      key={i}
                      href="/playlist"
                      className="group flex flex-col items-center"
                    >
                      <Image
                        src={
                          playlist.images?.[0].url || "/Placeholder-48x48.svg"
                        }
                        alt={playlist.name}
                        width={48}
                        height={48}
                        className="rounded-md"
                      />
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </Panel>

      <PanelResizeHandle className="group relative w-1.5 cursor-grab transition-colors">
        <div className="absolute top-1/2 right-0 h-8 w-1 -translate-y-1/2 rounded-full bg-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
      </PanelResizeHandle>

      <Panel
        defaultSize={100 - DEFAULT_SIZE_PERCENTAGE}
        className="mr-2 rounded-[1rem]"
      >
        {children}
      </Panel>
    </PanelGroup>
  );
}
