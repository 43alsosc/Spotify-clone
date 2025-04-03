"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Maximize2,
  Search,
  Filter,
} from "lucide-react";
import MediaItem from "./media-item";
import { cn } from "@/lib/utils";

export default function ResizablePanels({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(25); // percentage
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [sortBy, setSortBy] = useState("Recent");
  const [viewMode, setViewMode] = useState("grid");
  const [dragProgress, setDragProgress] = useState(0); // Track progress towards collapse

  // Panel width constants
  const MIN_WIDTH = 15;
  const MAX_WIDTH = 40;
  const COLLAPSED_WIDTH = 6;

  // Collapse behavior constants
  const COLLAPSE_THRESHOLD = MIN_WIDTH; // Start tracking collapse progress at minimum width
  const COLLAPSE_DRAG_DISTANCE = 5; // How much additional dragging needed to trigger collapse (percentage)

  // Sample data
  const filters = [
    "All",
    "Playlists",
    "Albums",
    "Artists",
    "Songs",
    "Podcasts",
    "Audiobooks",
    "Downloaded",
    "Local Files",
    "Favorites",
    "Recently Played",
  ];

  const mediaItems = [
    {
      id: 1,
      title: "Chill Vibes",
      type: "Playlist",
      owner: "Spotify",
      songs: 45,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      title: "Summer Hits",
      type: "Playlist",
      owner: "User123",
      songs: 32,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      title: "Rock Classics",
      type: "Album",
      owner: "Various Artists",
      songs: 18,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 4,
      title: "Jazz Collection",
      type: "Playlist",
      owner: "JazzFan",
      songs: 27,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 5,
      title: "Workout Mix",
      type: "Playlist",
      owner: "FitnessPro",
      songs: 50,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 6,
      title: "Acoustic Sessions",
      type: "Album",
      owner: "Indie Band",
      songs: 12,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 7,
      title: "Study Focus",
      type: "Playlist",
      owner: "StudyBuddy",
      songs: 40,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 8,
      title: "Morning Coffee",
      type: "Playlist",
      owner: "ChillOut",
      songs: 22,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 9,
      title: "Road Trip",
      type: "Playlist",
      owner: "Traveler",
      songs: 35,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 10,
      title: "90s Throwback",
      type: "Playlist",
      owner: "RetroFan",
      songs: 48,
      image: "/placeholder.svg?height=60&width=60",
    },
  ];

  // Handle the start of dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragProgress(0); // Reset drag progress when starting a new drag
  }, []);

  // Handle the dragging motion
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;

      // Calculate the new width as a percentage
      const newLeftPanelWidth =
        ((e.clientX - containerRect.left) / containerWidth) * 100;

      // If we're expanding from collapsed state
      if (isCollapsed && newLeftPanelWidth > COLLAPSE_THRESHOLD) {
        setIsCollapsed(false);
        setLeftPanelWidth(MIN_WIDTH);
        setDragProgress(0);
        return;
      }

      // If we're not collapsed and dragging below minimum width
      if (!isCollapsed && newLeftPanelWidth < COLLAPSE_THRESHOLD) {
        // Keep the panel at minimum width but track how much further the user is dragging
        setLeftPanelWidth(MIN_WIDTH);

        // Calculate drag progress towards collapse (0 to 1)
        const dragDistance = COLLAPSE_THRESHOLD - newLeftPanelWidth;
        const progress = Math.min(dragDistance / COLLAPSE_DRAG_DISTANCE, 1);
        setDragProgress(progress);

        // If we've dragged far enough, collapse the panel
        if (progress >= 1) {
          setIsCollapsed(true);
          setLeftPanelWidth(COLLAPSED_WIDTH);
        }

        return;
      }

      // Normal dragging behavior within constraints
      if (!isCollapsed) {
        const constrainedWidth = Math.min(
          Math.max(newLeftPanelWidth, MIN_WIDTH),
          MAX_WIDTH,
        );
        setLeftPanelWidth(constrainedWidth);
        setDragProgress(0); // Reset progress when not at minimum width
      }
    },
    [isDragging, isCollapsed],
  );

  // Handle the end of dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragProgress(0); // Reset drag progress when ending drag
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Check if filters can be scrolled and update fade effect
  useEffect(() => {
    const checkScroll = () => {
      if (filtersRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = filtersRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

        // Update the mask image based on scroll position
        const element = filtersRef.current;
        if (scrollLeft <= 0) {
          // At the start - only fade right
          element.style.maskImage =
            "linear-gradient(to right, black 90%, transparent)";
        } else if (scrollLeft >= scrollWidth - clientWidth - 10) {
          // At the end - only fade left
          element.style.maskImage =
            "linear-gradient(to right, transparent, black 10%)";
        } else {
          // In the middle - fade both sides
          element.style.maskImage =
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)";
        }
      }
    };

    checkScroll();

    const filtersElement = filtersRef.current;
    if (filtersElement) {
      filtersElement.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      if (filtersElement) {
        filtersElement.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, []);

  // Scroll filters
  const scrollFilters = (direction: "left" | "right") => {
    if (filtersRef.current) {
      const scrollAmount = 200;
      const currentScroll = filtersRef.current.scrollLeft;
      filtersRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Expand panel to maximum
  const expandPanel = () => {
    setIsCollapsed(false);
    setLeftPanelWidth(MAX_WIDTH);
    setDragProgress(0);
  };

  // Collapse panel to minimum
  const collapsePanel = () => {
    setIsCollapsed(true);
    setLeftPanelWidth(COLLAPSED_WIDTH);
    setDragProgress(0);
  };

  // Toggle collapsed state
  const toggleCollapsed = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setLeftPanelWidth(MIN_WIDTH);
    } else {
      setIsCollapsed(true);
      setLeftPanelWidth(COLLAPSED_WIDTH);
    }
    setDragProgress(0);
  };

  return (
    <div
      ref={containerRef}
      className="flex h-[calc(100vh-8rem)] w-full overflow-hidden rounded-[0.5rem]"
    >
      {/* Left Panel */}
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-lg bg-zinc-800",
          isCollapsed ? "items-center" : "",
          dragProgress > 0 && "opacity-90", // Visual feedback during collapse drag
        )}
        style={{ width: `${leftPanelWidth}%` }}
      >
        {!isCollapsed ? (
          <>
            {/* Fixed top section */}
            <div className="flex flex-col border-b border-zinc-700 p-4">
              {/* Header with controls */}
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

              {/* Filters with scroll buttons */}
              <div className="relative">
                {canScrollLeft && (
                  <button
                    onClick={() => scrollFilters("left")}
                    className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-zinc-800/90 p-1 shadow-md"
                    aria-label="Scroll filters left"
                  >
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </button>
                )}

                <div
                  ref={filtersRef}
                  className="scrollbar-hide relative flex gap-2 overflow-x-auto pb-2"
                >
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      className="rounded-full bg-zinc-700 px-3 py-1.5 text-sm whitespace-nowrap text-white transition-colors hover:bg-zinc-600"
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {canScrollRight && (
                  <button
                    onClick={() => scrollFilters("right")}
                    className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-zinc-800/90 p-1 shadow-md"
                    aria-label="Scroll filters right"
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
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
                    <Search className="h-4 w-4" />
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
                    <ChevronDown className="h-3 w-3" />
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

                      <div className="px-4 py-2 text-sm text-zinc-400">
                        Show as:
                      </div>

                      {["compact", "list", "grid"].map((option) => (
                        <button
                          key={option}
                          className={cn(
                            "block w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-600 hover:text-white",
                            viewMode === option && "bg-zinc-600 text-white",
                          )}
                          onClick={() => setViewMode(option)}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Media items list */}
              <div className="p-2">
                {mediaItems.map((item) => (
                  <MediaItem
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Collapsed view - only show images */
          <div className="flex w-full flex-col items-center gap-2 overflow-y-auto py-4">
            <button
              onClick={toggleCollapsed}
              className="mb-2 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
              aria-label="Expand panel"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {mediaItems.map((item) => (
              <MediaItem
                key={item.id}
                item={item}
                viewMode="compact"
                isCollapsed={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resizer */}
      <div
        className={cn(
          "flex w-2 cursor-col-resize items-center justify-center bg-transparent transition-colors hover:bg-zinc-600",
          isDragging && "bg-zinc-600",
          dragProgress > 0 && "bg-zinc-500", // Visual feedback during collapse drag
        )}
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={leftPanelWidth}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            if (isCollapsed) {
              toggleCollapsed();
            } else if (leftPanelWidth > MIN_WIDTH) {
              setLeftPanelWidth((prev) => Math.max(prev - 1, MIN_WIDTH));
            }
          } else if (e.key === "ArrowRight") {
            if (isCollapsed) {
              toggleCollapsed();
            } else {
              setLeftPanelWidth((prev) => Math.min(prev + 1, MAX_WIDTH));
            }
          }
        }}
      >
        <div
          className={cn(
            "h-8 w-0.5 rounded-full",
            dragProgress > 0 ? "bg-zinc-400" : "bg-zinc-600",
          )}
        ></div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 overflow-auto rounded-[0.5rem] bg-zinc-900 p-6">
        {children}
      </div>
    </div>
  );
}
