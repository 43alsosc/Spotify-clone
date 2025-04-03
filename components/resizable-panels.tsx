"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import SidebarContent from "./sidebar/sidebar-content";

export default function ResizablePanels({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(25); // percentage
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // Track progress towards collapse

  // Panel width constants
  const MIN_WIDTH = 15;
  const MAX_WIDTH = 40;
  const COLLAPSED_WIDTH = 6;

  // Collapse behavior constants
  const COLLAPSE_THRESHOLD = MIN_WIDTH; // Start tracking collapse progress at minimum width
  const COLLAPSE_DRAG_DISTANCE = 5; // How much additional dragging needed to trigger collapse (percentage)

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
    [isDragging, isCollapsed, COLLAPSE_THRESHOLD],
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
      className="flex h-[calc(100vh-8rem)] w-full overflow-hidden"
    >
      {/* Left Panel */}
      <SidebarContent
        isCollapsed={isCollapsed}
        dragProgress={dragProgress}
        leftPanelWidth={leftPanelWidth}
        expandPanel={expandPanel}
        collapsePanel={collapsePanel}
        toggleCollapsed={toggleCollapsed}
      />

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
      <div className="flex-1 overflow-auto rounded-[1rem] bg-zinc-900 p-6">
        {children}
      </div>
    </div>
  );
}
