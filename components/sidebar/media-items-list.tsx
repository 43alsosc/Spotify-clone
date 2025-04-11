import { cn } from "@/lib/utils";
import MediaItem from "../media-item";
import { Playlist } from "@/types/types";
import { useEffect, useState } from "react";

interface MediaItemsListProps {
  viewMode: "compact" | "grid" | "list";
  data: Playlist[];
  isLoading: boolean;
  leftPanelWidth?: number;
}

export default function MediaItemsList({
  viewMode,
  data,
  isLoading,
  leftPanelWidth = 25,
}: MediaItemsListProps) {
  // Dynamisk justering av grid-kolonner basert på panelbredde
  const [gridColumns, setGridColumns] = useState(2);

  useEffect(() => {
    if (viewMode === "grid") {
      // Bestem antall kolonner basert på panelbredde
      if (leftPanelWidth < 20) {
        setGridColumns(2);
      } else if (leftPanelWidth < 30) {
        setGridColumns(3);
      } else if (leftPanelWidth < 40) {
        setGridColumns(4);
      } else {
        setGridColumns(5);
      }
    }
  }, [leftPanelWidth, viewMode]);

  if (isLoading) {
    return <div className="p-4 text-zinc-400">Loading playlists...</div>;
  }

  if (data.length === 0) {
    return <div className="p-4 text-zinc-400">No playlists found</div>;
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-y-auto [scrollbar-width:none]",
        viewMode === "grid" && `grid grid-cols-${gridColumns}`,
      )}
      style={
        viewMode === "grid"
          ? {
              // Use CSS grid-template-columns for better responsiveness
              gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            }
          : undefined
      }
    >
      {data.map((item, index) => (
        <MediaItem
          key={index}
          item={item}
          viewMode={viewMode}
          isCollapsed={false}
        />
      ))}
    </div>
  );
}
