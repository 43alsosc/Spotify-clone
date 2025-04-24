"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils/cn";
import SidebarContent from "@/components/sidebar/sidebar-content";
import { getCurrentUserPlaylist } from "@/app/actions/getCurrentUserPlaylist";
import { getFollowedArtists } from "@/app/actions/getFollowedArtists";

const PANEL_WIDTHS = {
  MIN: 15,
  MAX: 40,
  COLLAPSED: 5,
  COLLAPSE_THRESHOLD: 15,
  COLLAPSE_DRAG_DISTANCE: 5,
} as const;

interface ResizablePanelsProps {
  children: React.ReactNode;
}

export default function ResizablePanels({ children }: ResizablePanelsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(25);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLeftPanelMaximized, setIsLeftPanelMaximized] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftPanelWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      setIsLeftPanelMaximized(newLeftPanelWidth >= PANEL_WIDTHS.MAX);

      if (isCollapsed && newLeftPanelWidth > PANEL_WIDTHS.COLLAPSE_THRESHOLD) {
        setIsCollapsed(false);
        setLeftPanelWidth(PANEL_WIDTHS.MIN);
        return;
      }

      if (!isCollapsed && newLeftPanelWidth < PANEL_WIDTHS.COLLAPSE_THRESHOLD) {
        setLeftPanelWidth(PANEL_WIDTHS.MIN);

        const dragDistance =
          PANEL_WIDTHS.COLLAPSE_THRESHOLD - newLeftPanelWidth;
        const progress = Math.min(
          dragDistance / PANEL_WIDTHS.COLLAPSE_DRAG_DISTANCE,
          1,
        );

        if (progress >= 1) {
          setIsCollapsed(true);
          setLeftPanelWidth(PANEL_WIDTHS.COLLAPSED);
        }
        return;
      }

      if (!isCollapsed) {
        const constrainedWidth = Math.min(
          Math.max(newLeftPanelWidth, PANEL_WIDTHS.MIN),
          PANEL_WIDTHS.MAX,
        );
        setLeftPanelWidth(constrainedWidth);
      }
    },
    [isDragging, isCollapsed],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const expandPanel = useCallback(() => {
    setIsCollapsed(false);
    setLeftPanelWidth(PANEL_WIDTHS.MAX);
    setIsLeftPanelMaximized(true);
  }, []);

  const collapsePanel = useCallback(() => {
    setIsCollapsed(true);
    setLeftPanelWidth(PANEL_WIDTHS.COLLAPSED);
    setIsLeftPanelMaximized(false);
  }, []);

  const minimizePanel = useCallback(() => {
    setIsLeftPanelMaximized(false);
    setLeftPanelWidth(PANEL_WIDTHS.MIN);
  }, []);

  const toggleCollapsed = useCallback(() => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setLeftPanelWidth(PANEL_WIDTHS.MIN);
      setIsLeftPanelMaximized(false);
    } else {
      setIsCollapsed(true);
      setLeftPanelWidth(PANEL_WIDTHS.COLLAPSED);
      setIsLeftPanelMaximized(false);
    }
  }, [isCollapsed]);

  const {
    data: playlistsData,
    error: playlistsError,
    isLoading: playlistsLoading,
  } = useQuery({
    queryKey: ["user-playlists"],
    queryFn: () => getCurrentUserPlaylist(),
  });

  const {
    data: followedArtistsData,
    error: followedArtistsError,
    isLoading: followedArtistsLoading,
  } = useQuery({
    queryKey: ["followed-artists"],
    queryFn: () => getFollowedArtists(),
  });

  if (playlistsError || followedArtistsError) {
    return (
      <div className="p-4 text-red-500">
        Feil ved lasting av data:{" "}
        {(playlistsError || followedArtistsError)?.message}
      </div>
    );
  }

  if (!followedArtistsData && !followedArtistsLoading) {
    return (
      <div className="p-4 text-zinc-400">Ingen fulgte artister funnet</div>
    );
  }

  if (!playlistsData?.items && !playlistsLoading) {
    return <div className="p-4 text-zinc-400">Ingen spillelister funnet</div>;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      if (isCollapsed) {
        toggleCollapsed();
      } else if (leftPanelWidth > PANEL_WIDTHS.MIN) {
        setLeftPanelWidth((prev) => Math.max(prev - 1, PANEL_WIDTHS.MIN));
      }
    } else if (e.key === "ArrowRight") {
      if (isCollapsed) {
        toggleCollapsed();
      } else {
        setLeftPanelWidth((prev) => Math.min(prev + 1, PANEL_WIDTHS.MAX));
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex h-[calc(100vh-8.5rem)] w-full overflow-hidden"
    >
      <SidebarContent
        isCollapsed={isCollapsed}
        leftPanelWidth={leftPanelWidth}
        playlistData={playlistsData?.items}
        artistData={followedArtistsData?.artists.items}
        isLoading={playlistsLoading}
        followedArtistsLoading={followedArtistsLoading}
        isLeftPanelMaximized={isLeftPanelMaximized}
        expandPanel={expandPanel}
        collapsePanel={collapsePanel}
        minimizePanel={minimizePanel}
        toggleCollapsed={toggleCollapsed}
      />

      <div
        className={cn(
          "flex w-2 cursor-col-resize items-center justify-center bg-transparent transition-colors hover:bg-zinc-600",
          isDragging && "bg-zinc-600",
        )}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={leftPanelWidth}
        tabIndex={0}
        aria-label="Juster panelbredde"
      >
        <div className="h-8 w-0.5 rounded-full" />
      </div>

      <div className="flex-1 overflow-auto rounded-[1rem] bg-[#121212]">
        {children}
      </div>
    </div>
  );
}
