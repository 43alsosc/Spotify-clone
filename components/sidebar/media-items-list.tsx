import MediaItem from "../media-item";
import { Playlist } from "@/types/types";

interface MediaItemsListProps {
  viewMode: "compact" | "grid" | "list";
  data: Playlist[];
  isLoading: boolean;
}

export default function MediaItemsList({
  viewMode,
  data,
  isLoading,
}: MediaItemsListProps) {
  if (isLoading) {
    return <div className="p-4 text-zinc-400">Loading playlists...</div>;
  }

  if (data.length === 0) {
    return <div className="p-4 text-zinc-400">No playlists found</div>;
  }

  return (
    <div className="p-2">
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
