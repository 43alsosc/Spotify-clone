import { z } from "zod";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import MediaItem from "@/components/media-item";
import { SimplifiedPlaylistSchema } from "@/lib/validations/playlist";
import { ArtistSchema } from "@/lib/validations/artist";

type ViewMode = "compact" | "grid" | "list";
type SortOption = "Nylig" | "Nylig lagt til" | "Alfabetisk" | "Oppretter";

interface MediaItemsListProps {
  viewMode: ViewMode;
  playlistData: z.infer<typeof SimplifiedPlaylistSchema>[] | undefined;
  artistData: z.infer<typeof ArtistSchema>[] | undefined;
  isPlaylistLoading: boolean;
  isArtistLoading: boolean;
  leftPanelWidth?: number;
  sortBy: SortOption;
}

type MediaItem =
  | z.infer<typeof SimplifiedPlaylistSchema>
  | z.infer<typeof ArtistSchema>;

export default function MediaItemsList({
  viewMode,
  playlistData,
  artistData,
  isPlaylistLoading,
  isArtistLoading,
  leftPanelWidth = 25,
  sortBy,
}: MediaItemsListProps) {
  const [gridColumns, setGridColumns] = useState(2);

  useEffect(() => {
    if (viewMode !== "grid") return;

    if (leftPanelWidth < 20) {
      setGridColumns(2);
    } else if (leftPanelWidth < 30) {
      setGridColumns(3);
    } else if (leftPanelWidth < 40) {
      setGridColumns(4);
    } else {
      setGridColumns(5);
    }
  }, [leftPanelWidth, viewMode]);

  if (isPlaylistLoading || isArtistLoading) {
    return <div className="p-4 text-zinc-400">Laster spillelister...</div>;
  }

  if (!playlistData || playlistData.length === 0) {
    return <div className="p-4 text-zinc-400">Ingen spillelister funnet</div>;
  }

  const allItems: MediaItem[] = [
    ...(playlistData || []),
    ...(artistData || []),
  ];

  const sortedItems = (() => {
    switch (sortBy) {
      // Sort by name
      case "Alfabetisk":
        return allItems.sort((a, b) => a.name.localeCompare(b.name));
      // Sort by snapshot_id in the meanwhile newly added is developed
      case "Nylig lagt til":
        return allItems.sort((a, b) => {
          if (a.type === "artist" && b.type === "artist") return 0;
          if (a.type === "artist") return 1;
          if (b.type === "artist") return -1;
          return (
            b as z.infer<typeof SimplifiedPlaylistSchema>
          ).snapshot_id.localeCompare(
            (a as z.infer<typeof SimplifiedPlaylistSchema>).snapshot_id,
          );
        });
      // Sort by owner alphabetically
      case "Oppretter":
        return allItems.sort((a, b) => {
          if (a.type === "artist" && b.type === "artist") {
            return a.name.localeCompare(b.name);
          }
          if (a.type === "artist") {
            return a.name.localeCompare(
              (b as z.infer<typeof SimplifiedPlaylistSchema>).owner
                .display_name,
            );
          }
          if (b.type === "artist") {
            return (
              a as z.infer<typeof SimplifiedPlaylistSchema>
            ).owner.display_name.localeCompare(b.name);
          }
          return (
            a as z.infer<typeof SimplifiedPlaylistSchema>
          ).owner.display_name.localeCompare(
            (b as z.infer<typeof SimplifiedPlaylistSchema>).owner.display_name,
          );
        });
      // Default sort in the meanwhile recently is developed
      case "Nylig":
      default:
        return allItems;
    }
  })();

  return (
    <div
      className={cn(
        "flex flex-col overflow-y-auto [scrollbar-width:none]",
        viewMode === "grid" && `grid grid-cols-${gridColumns}`,
      )}
      style={
        viewMode === "grid"
          ? {
              gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            }
          : undefined
      }
    >
      {sortedItems.map((item, index) => (
        <MediaItem
          key={`${item.type}-${item.id}-${index}`}
          item={item}
          viewMode={viewMode}
          isCollapsed={false}
        />
      ))}
    </div>
  );
}
