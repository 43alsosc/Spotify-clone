"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import SidebarContent from "./sidebar/sidebar-content";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserPlaylist } from "@/app/actions/getCurrentUserPlaylist";

export default function ResizablePanels({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(25); // percentage
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLeftPanelMaximized, setIsLeftPanelMaximized] = useState(false);

  // Panel width constants
  const MIN_WIDTH = 15;
  const MAX_WIDTH = 40;
  const COLLAPSED_WIDTH = 5;

  // Collapse behavior constants
  const COLLAPSE_THRESHOLD = MIN_WIDTH; // Start tracking collapse progress at minimum width
  const COLLAPSE_DRAG_DISTANCE = 5; // How much additional dragging needed to trigger collapse (percentage)

  // Handle the start of dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle the dragging motion
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      // Get the container element and its bounding client rectangle
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;

      // Calculate the new width as a percentage
      const newLeftPanelWidth =
        ((e.clientX - containerRect.left) / containerWidth) * 100;

      // Update isLeftPanelMaximized based on the new width
      if (newLeftPanelWidth >= MAX_WIDTH) {
        setIsLeftPanelMaximized(true);
      } else {
        setIsLeftPanelMaximized(false);
      }

      if (isCollapsed && newLeftPanelWidth > COLLAPSE_THRESHOLD) {
        setIsCollapsed(false);
        setLeftPanelWidth(MIN_WIDTH);
        return;
      }

      // If we're not collapsed and dragging below minimum width
      if (!isCollapsed && newLeftPanelWidth < COLLAPSE_THRESHOLD) {
        // Keep the panel at minimum width but track how much further the user is dragging
        setLeftPanelWidth(MIN_WIDTH);

        // Calculate drag progress towards collapse (0 to 1)
        const dragDistance = COLLAPSE_THRESHOLD - newLeftPanelWidth;
        const progress = Math.min(dragDistance / COLLAPSE_DRAG_DISTANCE, 1);

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
      }
    },
    [isDragging, isCollapsed, COLLAPSE_THRESHOLD],
  );

  // Handle the end of dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
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

  // Expand panel to maximum
  const expandPanel = useCallback(() => {
    setIsCollapsed(false);
    setLeftPanelWidth(MAX_WIDTH);
    setIsLeftPanelMaximized(true);
  }, []);

  // Collapse panel to minimum
  const collapsePanel = useCallback(() => {
    setIsCollapsed(true);
    setLeftPanelWidth(COLLAPSED_WIDTH);
    setIsLeftPanelMaximized(false);
  }, []);

  // Toggle collapsed state
  const toggleCollapsed = useCallback(() => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setLeftPanelWidth(MIN_WIDTH);
      setIsLeftPanelMaximized(false);
    } else {
      setIsCollapsed(true);
      setLeftPanelWidth(COLLAPSED_WIDTH);
      setIsLeftPanelMaximized(false);
    }
  }, [isCollapsed]);

  const minimizePanel = useCallback(() => {
    setIsLeftPanelMaximized(false);
    setLeftPanelWidth(MIN_WIDTH);
  }, []);

  const { data, error, isLoading } = useQuery({
    queryKey: ["user-playlists"],
    queryFn: () => getCurrentUserPlaylist(),
  });

  const userPlaylistsData = data?.items;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data && isLoading === false) {
    return <div>No user playlists found</div>;
  } else if (data && isLoading === false) {
    return (
      <div
        ref={containerRef}
        className="flex h-[calc(100vh-9.5rem)] w-full overflow-hidden"
      >
        {/* Left Panel */}
        <SidebarContent
          isCollapsed={isCollapsed}
          leftPanelWidth={leftPanelWidth}
          data={userPlaylistsData}
          isLoading={isLoading}
          isLeftPanelMaximized={isLeftPanelMaximized}
          expandPanel={expandPanel}
          collapsePanel={collapsePanel}
          minimizePanel={minimizePanel}
          toggleCollapsed={toggleCollapsed}
        />

        {/* Resizer */}
        <div
          className={cn(
            "flex w-2 cursor-col-resize items-center justify-center bg-transparent transition-colors hover:bg-zinc-600",
            isDragging && "bg-zinc-600",
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
          <div className={cn("h-8 w-0.5 rounded-full")}></div>
        </div>

        {/* Right Panel - Content */}
        <div className="flex-1 overflow-auto rounded-[1rem] bg-[#121212]">
          {children}
        </div>
      </div>
    );
  }
}
